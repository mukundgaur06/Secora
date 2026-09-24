import asyncio
from typing import AsyncGenerator, Dict, Any, List, Optional
from app.ai.provider import LLMProvider, StreamChunk

class MockCybersecurityProvider(LLMProvider):
    """
    Fallback / local deterministic cybersecurity reasoning provider.
    Used for unit testing and offline environments.
    """

    async def stream_chat(
        self,
        messages: List[Dict[str, str]],
        system_instruction: str,
        model: Optional[str] = None,
        temperature: float = 0.3,
        max_output_tokens: int = 2048,
    ) -> AsyncGenerator[StreamChunk, None]:
        last_message = messages[-1]["content"] if messages else ""
        lower = last_message.lower()

        if "sql" in lower or "sqli" in lower:
            response = (
                "[SUMMARY]\n"
                "SQL Injection (SQLi) occurs when untrusted input concatenates directly into dynamic database queries, "
                "bypassing interpreter separation.\n\n"
                "[WHAT IS HAPPENING]\n"
                "The application combines user strings into raw SQL strings without parameter binding. "
                "Attackers use characters like `'` or `\"` to alter the query logic.\n\n"
                "[DETECTION & SAFE AUDIT]\n"
                "1. Audit all endpoints accepting user parameters.\n"
                "2. Input escape characters (`'`, `\"`, `\\`) in authorized test environments and inspect for database syntax exceptions.\n"
                "3. Verify through prepared statements.\n\n"
                "[COMMANDS]\n"
                "```terminal\n"
                "sqlmap -u \"http://localhost:8000/api/items?id=1\" --batch --risk=1\n"
                "```\n\n"
                "[HOW TO FIX]\n"
                "Always utilize Parameterized Queries (Prepared Statements) or an ORM like SQLAlchemy:\n"
                "```python\n"
                "# SECURE: Parameter binding\n"
                "query = text(\"SELECT id, role FROM users WHERE username = :uname\")\n"
                "user = db.execute(query, {\"uname\": username}).first()\n"
                "```\n\n"
                "[REFERENCES]\n"
                "- OWASP Top 10 A03:2021 (Injection)\n"
                "- CWE-89: Improper Neutralization of Special Elements used in an SQL Command"
            )
        elif "jwt" in lower or "auth" in lower:
            response = (
                "[SUMMARY]\n"
                "JWT authentication failures typically stem from signature validation mismatches, expiration, or algorithm confusion.\n\n"
                "[COMMON CAUSES]\n"
                "1. Expired `exp` claim timestamp in UTC.\n"
                "2. Secret key mismatch between the signer and verifier.\n"
                "3. Algorithm confusion (e.g. HS256 vs RS256).\n"
                "4. Missing `Bearer ` prefix in the HTTP Authorization header.\n\n"
                "[HOW TO VERIFY]\n"
                "Inspect the decoded payload without verifying signature first to check claims:\n"
                "```python\n"
                "import jwt\n"
                "# Inspect unverified claims\n"
                "unverified = jwt.decode(token, options={\"verify_signature\": False})\n"
                "print(unverified)\n"
                "```\n\n"
                "[HOW TO FIX]\n"
                "Ensure strict algorithm enforcement and UTC datetime handling:\n"
                "```python\n"
                "payload = jwt.decode(token, SECRET_KEY, algorithms=[\"HS256\"])\n"
                "```\n\n"
                "[SECURITY NOTES]\n"
                "Never accept `alg: none`. Set appropriate token lifetimes (e.g. 15-60 minutes) and use refresh tokens."
            )
        else:
            response = (
                f"[SUMMARY]\n"
                f"Analysis for cybersecurity inquiry: \"{last_message}\".\n\n"
                f"[TECHNICAL BREAKDOWN]\n"
                f"In this mode, CyberForge evaluates attack surfaces, privilege boundaries, and defensive configurations.\n\n"
                f"[RECOMMENDED PROCEDURE]\n"
                f"1. Audit relevant server configuration files and error logs.\n"
                f"2. Validate input boundary sanitization and least-privilege role mappings.\n"
                f"3. Enforce cryptographic safeguards on data in transit and at rest.\n\n"
                f"[COMMANDS]\n"
                f"```terminal\n"
                f"nmap -sV -sC 127.0.0.1 -oN scan_audit.txt\n"
                f"```\n\n"
                f"[MITIGATION & DEFENSE]\n"
                f"Adopt defense-in-depth principles and verify configurations against NIST/OWASP standards."
            )

        # Stream in realistic chunks
        words = response.split(" ")
        for i in range(0, len(words), 4):
            chunk_text = " ".join(words[i:i+4]) + " "
            yield StreamChunk(text=chunk_text, is_complete=False)
            await asyncio.sleep(0.01)

        input_toks = self.count_tokens(last_message + system_instruction)
        output_toks = self.count_tokens(response)
        yield StreamChunk(
            text="",
            is_complete=True,
            input_tokens=input_toks,
            output_tokens=output_toks,
            total_tokens=input_toks + output_toks
        )

    async def health_check(self) -> Dict[str, Any]:
        return {
            "provider": "mock_cybersecurity",
            "model": "cyberforge-deterministic-v1",
            "status": "online",
            "configured": True,
            "details": "Deterministic local fallback engine active."
        }

    def count_tokens(self, text: str) -> int:
        return max(1, len(text) // 4)
