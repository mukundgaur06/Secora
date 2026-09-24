import json
from app.database import engine, Base, SessionLocal
from app.models.user import User, UserPlan
from app.models.knowledge import Document, DocumentChunk, Lab
from app.security.passwords import hash_password

def seed_database():
    print("[*] Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Admin User
        admin_email = "admin@secora.internal"
        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            print("[+] Creating default administrator account...")
            admin = User(
                email=admin_email,
                username="secora_admin",
                password_hash=hash_password("Admin@Secora2026!"),
                role="ADMIN",
                status="ACTIVE"
            )
            db.add(admin)
            db.flush()

            admin_plan = UserPlan(
                user_id=admin.id,
                plan="ENTERPRISE_SOC",
                monthly_token_limit=10000000,
                tokens_used=42150
            )
            db.add(admin_plan)

        # 2. Seed Standard Demo Analyst
        user_email = "analyst@secora.internal"
        analyst = db.query(User).filter(User.email == user_email).first()
        if not analyst:
            print("[+] Creating demo analyst account...")
            analyst = User(
                email=user_email,
                username="cyber_analyst",
                password_hash=hash_password("Analyst@Secora2026!"),
                role="USER",
                status="ACTIVE"
            )
            db.add(analyst)
            db.flush()

            analyst_plan = UserPlan(
                user_id=analyst.id,
                plan="FREE_ANALYST",
                monthly_token_limit=100000,
                tokens_used=18450
            )
            db.add(analyst_plan)

        # 3. Seed Knowledge Base Documents
        if db.query(Document).count() == 0:
            print("[+] Seeding curated cybersecurity knowledge base...")
            docs = [
                Document(
                    title="OWASP A03:2021 — Injection & SQLi Deep Dive",
                    source="OWASP",
                    category="Web Security",
                    url="https://owasp.org/Top10/A03_2021-Injection/",
                    version="2021.1",
                    tags="sqli,injection,owasp,database,defense",
                    content="""# SQL Injection (SQLi) Overview and Mitigation
SQL Injection occurs when untrusted user data is directly concatenated into dynamic SQL interpreters without parameterized queries or object-relational mapping (ORM) abstractions.

### Common Vectors
1. Classic In-band SQLi (UNION-based or Error-based)
2. Inferential (Blind) SQLi (Boolean-based or Time-based)
3. Out-of-band SQLi (DNS/HTTP exfiltration)

### Detection Methodology
- Test input parameters with single quote `'`, double quote `"`, and escape sequences `\\`.
- Observe error traces or behavioral differences in server response time.
- Verify through prepared statements before deploying to production.

### Mitigation & Secure Coding
Always use Parameterized Queries (Prepared Statements) or modern ORMs like SQLAlchemy, Hibernate, or Prisma.
Never construct dynamic SQL using string formatting like `f"SELECT * FROM users WHERE id = {user_id}"`.
"""
                ),
                Document(
                    title="OWASP A01:2021 — Broken Access Control & IDOR",
                    source="OWASP",
                    category="Web Security",
                    url="https://owasp.org/Top10/A01_2021-Broken_Access_Control/",
                    version="2021.1",
                    tags="idor,access-control,authorization,bfla",
                    content="""# Insecure Direct Object References (IDOR)
IDOR occurs when an application exposes a reference to an internal implementation object (such as a database key) without validating that the authenticated actor possesses authorization to view or mutate that resource.

### Prevention
1. Enforce strict server-side authorization checks on every endpoint.
2. Adopt indirect or cryptographically random references (UUIDv4) rather than sequential integers.
3. Deny access by default; enforce Role-Based Access Control (RBAC) or Attribute-Based Access Control (ABAC).
"""
                ),
                Document(
                    title="CWE-79 — Cross-Site Scripting (XSS) Prevention",
                    source="CWE",
                    category="Web Security",
                    url="https://cwe.mitre.org/data/definitions/79.html",
                    version="4.12",
                    tags="xss,dom,stored,reflected,csp",
                    content="""# Cross-Site Scripting (XSS) Prevention
Cross-Site Scripting occurs when an application includes untrusted data in a web page without adequate validation or context-aware encoding.

### Defensive Measures
1. Context-Aware Output Encoding (HTML body, attributes, JavaScript, CSS).
2. Content Security Policy (CSP): Deploy `default-src 'self'` with strict script nonces or hashes.
3. Set `HttpOnly` and `SameSite=Strict` on session cookies.
"""
                ),
                Document(
                    title="Linux System Hardening & Privilege Separation",
                    source="LINUX",
                    category="Linux Security",
                    url="https://wiki.archlinux.org/title/Security",
                    version="2024",
                    tags="linux,hardening,ssh,sudo,file-permissions,iptables",
                    content="""# Linux Infrastructure Hardening
1. Disable Root SSH Login (`PermitRootLogin no`) and password authentication (`PasswordAuthentication no`).
2. Implement Sudo Least-Privilege with `visudo` and audit logging.
3. Configure UFW or iptables default DROP policy for unneeded ingress ports.
4. Enable AppArmor or SELinux in enforcing mode.
"""
                ),
            ]
            for doc in docs:
                db.add(doc)

        # 4. Seed Interactive Learning Labs
        if db.query(Lab).count() == 0:
            print("[+] Seeding interactive cybersecurity learning labs...")
            labs = [
                Lab(
                    slug="sqli-fundamentals",
                    title="SQL Injection Fundamentals & Mitigation",
                    category="Web Security",
                    difficulty="BEGINNER",
                    description="Analyze vulnerable authentication query strings and rewrite them using parameterized prepared statements.",
                    learning_objectives=json.dumps([
                        "Understand SQL syntax break-out using quotes and comments",
                        "Distinguish between vulnerable dynamic queries and parameterized queries",
                        "Implement defense-in-depth sanitization"
                    ]),
                    instructions="Review the Python Flask login handler code. Identify the injection point in the raw SQL statement and rewrite it safely using SQLAlchemy parameter binding.",
                    hints=json.dumps([
                        "Look for string formatting (`%s` or f-strings) inside `cursor.execute()`",
                        "Parameterized statements pass arguments as a separate tuple or dict"
                    ]),
                    solution="cursor.execute('SELECT id, role FROM users WHERE username = %s AND password = %s', (username, hashed_pass))"
                ),
                Lab(
                    slug="xss-context-encoding",
                    title="Defending Against DOM-Based XSS",
                    category="Web Security",
                    difficulty="BEGINNER",
                    description="Identify dangerous JavaScript DOM sinks (like innerHTML) and replace them with safe text nodes.",
                    learning_objectives=json.dumps([
                        "Recognize dangerous sinks: innerHTML, document.write, eval",
                        "Utilize safe alternatives: textContent and DOMPurify",
                        "Configure Content Security Policy (CSP)"
                    ]),
                    instructions="Inspect the client-side profile render function. Replace innerHTML with textContent to neutralize user-supplied malicious script payloads.",
                    hints=json.dumps([
                        "Never assign untrusted input to element.innerHTML directly",
                        "Use element.textContent or createTextNode"
                    ]),
                    solution="document.getElementById('bio').textContent = userProfile.bio;"
                ),
                Lab(
                    slug="linux-privilege-audit",
                    title="Linux SUID Binary Enumeration",
                    category="Linux Security",
                    difficulty="INTERMEDIATE",
                    description="Learn how misconfigured SUID binaries can lead to privilege escalation and how to audit them with Linux find commands.",
                    learning_objectives=json.dumps([
                        "Audit SUID/SGID bits using find command",
                        "Recognize common GTFOBins exploitation risks",
                        "Enforce principle of least privilege"
                    ]),
                    instructions="Construct a find command to locate all world-executable SUID binaries starting from the root filesystem while discarding permission-denied errors.",
                    hints=json.dumps([
                        "Use find with `-perm -4000` or `-perm -u=s`",
                        "Redirect stderr with `2>/dev/null`"
                    ]),
                    solution="find / -perm -4000 -type f -exec ls -la {} + 2>/dev/null"
                )
            ]
            for lab in labs:
                db.add(lab)

        db.commit()
        print("[*] Database seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"[!] Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
