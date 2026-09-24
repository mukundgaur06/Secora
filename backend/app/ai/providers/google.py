import os
import asyncio
from typing import AsyncGenerator, Dict, Any, List, Optional
from app.ai.provider import LLMProvider, StreamChunk
from app.config import settings

class GoogleGeminiProvider(LLMProvider):
    """
    Official Google Gemini API implementation using the google-genai SDK.
    """

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model_name = model or settings.DEFAULT_MODEL
        self._client = None

        if self.api_key:
            try:
                from google import genai
                self._client = genai.Client(api_key=self.api_key)
            except Exception:
                self._client = None

    async def stream_chat(
        self,
        messages: List[Dict[str, str]],
        system_instruction: str,
        model: Optional[str] = None,
        temperature: float = 0.3,
        max_output_tokens: int = 2048,
    ) -> AsyncGenerator[StreamChunk, None]:
        target_model = model or self.model_name
        
        # If no client or API key is available, fail gracefully
        if not self._client:
            yield StreamChunk(
                text="",
                is_complete=True,
                error="Google Gemini API key not configured on backend."
            )
            return

        try:
            from google import genai
            from google.genai import types

            # Format history for Gemini
            contents = []
            for m in messages:
                role = "user" if m["role"] == "user" else "model"
                contents.append(
                    types.Content(
                        role=role,
                        parts=[types.Part.from_text(text=m["content"])]
                    )
                )

            config = types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=temperature,
                max_output_tokens=max_output_tokens,
            )

            # Use run_in_executor to stream asynchronously from SDK
            def generate_stream_sync():
                return self._client.models.generate_content_stream(
                    model=target_model,
                    contents=contents,
                    config=config
                )

            loop = asyncio.get_running_loop()
            stream_iterator = await loop.run_in_executor(None, generate_stream_sync)

            full_text = ""
            input_tokens = 0
            output_tokens = 0

            # Iterate through stream chunks
            for chunk in stream_iterator:
                chunk_text = chunk.text if hasattr(chunk, 'text') and chunk.text else ""
                if chunk_text:
                    full_text += chunk_text
                    yield StreamChunk(text=chunk_text, is_complete=False)

                # Capture usage metadata if provided by chunk
                if hasattr(chunk, 'usage_metadata') and chunk.usage_metadata:
                    meta = chunk.usage_metadata
                    input_tokens = getattr(meta, 'prompt_token_count', 0) or input_tokens
                    output_tokens = getattr(meta, 'candidates_token_count', 0) or output_tokens

                await asyncio.sleep(0)  # Yield execution to event loop

            # Fallback token estimation if provider did not return exact usage metadata
            if input_tokens == 0:
                prompt_text = system_instruction + " ".join(m["content"] for m in messages)
                input_tokens = self.count_tokens(prompt_text)
            if output_tokens == 0:
                output_tokens = self.count_tokens(full_text)

            total_tokens = input_tokens + output_tokens

            yield StreamChunk(
                text="",
                is_complete=True,
                input_tokens=input_tokens,
                output_tokens=output_tokens,
                total_tokens=total_tokens
            )

        except Exception as e:
            yield StreamChunk(
                text="",
                is_complete=True,
                error=f"Gemini Inference Exception: {str(e)}"
            )

    async def health_check(self) -> Dict[str, Any]:
        if not self.api_key:
            return {
                "provider": "google_gemini",
                "model": self.model_name,
                "status": "standby",
                "configured": False,
                "details": "GEMINI_API_KEY is not set in backend environment."
            }
        return {
            "provider": "google_gemini",
            "model": self.model_name,
            "status": "online",
            "configured": True,
            "details": "Google Gemini Client initialized and ready."
        }

    def count_tokens(self, text: str) -> int:
        if not text:
            return 0
        # Standard token heuristic (~4 characters per token for English & code)
        return max(1, len(text) // 4)
