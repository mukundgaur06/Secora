import re
from typing import Tuple, Optional

class SafetyService:
    """
    Evaluates cybersecurity prompts against safety and authorization policies.
    Distinguishes legitimate defensive, educational, and authorized testing inquiries
    from dangerous autonomous real-world attacks.
    """

    # Patterns indicating malicious real-world execution
    BLOCKED_PATTERNS = [
        r"(?i)\b(create|write|generate)\s+(a\s+)?(ransomware|wiper|rootkit|botnet|keylogger)\s+to\s+(infect|encrypt|destroy|steal)",
        r"(?i)\b(ddos|dos|flood)\s+(attack\s+)?(against|target|victim)\s+[a-zA-Z0-9\.\-]+",
        r"(?i)\b(hack|infiltrate|breach)\s+(into\s+)?(my\s+ex|bank|gov|school|instagram|facebook|twitter|target)\s+",
        r"(?i)\b(steal|dump|exfiltrate)\s+credit\s+card\s+numbers",
    ]

    @classmethod
    def evaluate(cls, content: str, mode: str = "GENERAL") -> Tuple[bool, str, Optional[str]]:
        """
        Returns: (is_allowed, category, refusal_message)
        """
        for pattern in cls.BLOCKED_PATTERNS:
            if re.search(pattern, content):
                refusal = (
                    "[SECURITY POLICY NOTICE]\n\n"
                    "CyberForge AI is strictly engineered for defensive cybersecurity, authorized testing, "
                    "and educational research. We cannot generate weaponized payloads targeting external entities, "
                    "assist with destructive malware, or facilitate unauthorized access.\n\n"
                    "We can, however, explain how these vulnerabilities operate conceptually, provide defensive detection "
                    "signatures (e.g., YARA/Snort rules), or discuss mitigation and hardening controls."
                )
                return False, "PROHIBITED_OFFENSIVE_OPERATION", refusal

        # Categorize inquiry for metadata logging
        lower = content.lower()
        if any(w in lower for w in ["sql", "sqli", "injection", "union select"]):
            category = "SQL_INJECTION"
        elif any(w in lower for w in ["xss", "cross-site", "innerhtml", "script>"]):
            category = "CROSS_SITE_SCRIPTING"
        elif any(w in lower for w in ["jwt", "token", "signature", "auth", "session", "oauth"]):
            category = "AUTHENTICATION_SECURITY"
        elif any(w in lower for w in ["nginx", "apache", "tls", "ssl", "cors", "header"]):
            category = "INFRASTRUCTURE_CONFIG"
        elif any(w in lower for w in ["suid", "privilege", "sudo", "linux", "chmod"]):
            category = "LINUX_PRIVILEGE_MANAGEMENT"
        elif any(w in lower for w in ["nmap", "scan", "port", "recon"]):
            category = "NETWORK_RECONNAISSANCE"
        else:
            category = "GENERAL_CYBERSECURITY"

        return True, category, None
