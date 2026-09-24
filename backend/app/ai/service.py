import json
import time
from typing import AsyncGenerator, Dict, Any, List
from sqlalchemy.orm import Session
from app.models.user import User, UserPlan
from app.models.conversation import Conversation, Message
from app.models.usage import UsageLog
from app.models.audit import AuditLog
from app.ai.prompts.system import CYBERFORGE_SYSTEM_PROMPT
from app.ai.prompts.modes import get_mode_prompt
from app.ai.safety import SafetyService
from app.ai.factory import get_llm_provider
from app.config import settings

class AIService:
    """
    Central orchestration service for CyberForge conversational AI requests.
    Manages safety checks, context windowing, streaming token dissemination,
    and database persistence of messages and real token usage.
    """

    @classmethod
    async def process_chat_stream(
        cls,
        db: Session,
        user: User,
        conversation: Conversation,
        user_content: str,
        mode: str,
    ) -> AsyncGenerator[str, None]:
        start_time = time.time()
        
        # 1. Rate Limit & Usage Limit Verification
        plan = user.plan
        if not plan:
            yield f"data: {json.dumps({'type': 'error', 'detail': 'User has no active billing plan.'})}\n\n"
            return

        if plan.tokens_used >= plan.monthly_token_limit:
            yield f"data: {json.dumps({'type': 'error', 'detail': 'Monthly AI token limit reached. Please upgrade your tier.'})}\n\n"
            return

        # 2. Safety & Policy Layer Verification
        is_allowed, category, refusal = SafetyService.evaluate(user_content, mode)
        if not is_allowed:
            # Audit safety trigger
            audit = AuditLog(
                user_id=user.id,
                event="POLICY_VIOLATION_BLOCKED",
                details=json.dumps({"category": category, "snippet": user_content[:100]})
            )
            db.add(audit)
            db.commit()

            yield f"data: {json.dumps({'type': 'token', 'content': refusal})}\n\n"
            yield f"data: {json.dumps({'type': 'message_complete', 'content': refusal})}\n\n"
            return

        # 3. Persist User Message First
        user_token_est = max(1, len(user_content) // 4)
        user_msg = Message(
            conversation_id=conversation.id,
            role="user",
            content=user_content,
            token_count=user_token_est,
            security_metadata=json.dumps({"mode": mode, "category": category})
        )
        db.add(user_msg)
        db.commit()
        db.refresh(user_msg)

        # Notify frontend of message start
        yield f"data: {json.dumps({'type': 'message_start', 'user_message_id': user_msg.id})}\n\n"

        # 4. Assemble Conversation Context (Limit to recent N messages to avoid token blowup)
        recent_messages = (
            db.query(Message)
            .filter(Message.conversation_id == conversation.id)
            .order_by(Message.created_at.asc())
            .all()
        )
        
        context_messages: List[Dict[str, str]] = []
        for m in recent_messages[-10:]:  # Keep last 10 messages
            context_messages.append({"role": m.role, "content": m.content})

        # Assemble full system instruction with active mode
        system_instruction = f"{CYBERFORGE_SYSTEM_PROMPT}\n\n{get_mode_prompt(mode)}"

        # 5. Call LLM Provider
        provider = get_llm_provider()
        accumulated_text = ""
        input_tokens = 0
        output_tokens = 0
        total_tokens = 0

        try:
            async for chunk in provider.stream_chat(
                messages=context_messages,
                system_instruction=system_instruction
            ):
                if chunk.error:
                    yield f"data: {json.dumps({'type': 'error', 'detail': chunk.error})}\n\n"
                    return

                if chunk.text:
                    accumulated_text += chunk.text
                    yield f"data: {json.dumps({'type': 'token', 'content': chunk.text})}\n\n"

                if chunk.is_complete:
                    input_tokens = chunk.input_tokens or provider.count_tokens(user_content + system_instruction)
                    output_tokens = chunk.output_tokens or provider.count_tokens(accumulated_text)
                    total_tokens = chunk.total_tokens or (input_tokens + output_tokens)

            # 6. Persist Completed Assistant Message
            assistant_metadata = {
                "topic": "Cybersecurity Operations",
                "category": category,
                "difficulty": "Intermediate",
                "mode": mode,
                "sources": ["OWASP Top 10", "CWE", "MITRE ATT&CK", "CyberForge AI Core"]
            }

            assistant_msg = Message(
                conversation_id=conversation.id,
                role="assistant",
                content=accumulated_text,
                token_count=output_tokens,
                security_metadata=json.dumps(assistant_metadata)
            )
            db.add(assistant_msg)

            # Update User Plan Tokens
            plan.tokens_used += total_tokens

            # Record Usage Log
            latency = round((time.time() - start_time) * 1000, 2)
            usage_log = UsageLog(
                user_id=user.id,
                conversation_id=conversation.id,
                model=settings.DEFAULT_MODEL,
                input_tokens=input_tokens,
                output_tokens=output_tokens,
                total_tokens=total_tokens,
                latency_ms=latency
            )
            db.add(usage_log)

            # Auto-title conversation if it still has default title
            if conversation.title == "New Security Investigation" or not conversation.title:
                clean_title = user_content.strip().split("\n")[0][:40]
                conversation.title = clean_title if clean_title else "Security Analysis"

            db.commit()

            # 7. Final SSE Completion Events
            yield f"data: {json.dumps({'type': 'message_metadata', 'metadata': assistant_metadata})}\n\n"
            yield f"data: {json.dumps({'type': 'usage', 'input_tokens': input_tokens, 'output_tokens': output_tokens, 'total_tokens': total_tokens, 'tokens_remaining': max(0, plan.monthly_token_limit - plan.tokens_used)})}\n\n"
            yield f"data: {json.dumps({'type': 'message_complete', 'message_id': assistant_msg.id, 'content': accumulated_text})}\n\n"

        except Exception as e:
            db.rollback()
            yield f"data: {json.dumps({'type': 'error', 'detail': f'Inference processing exception: {str(e)}'})}\n\n"
