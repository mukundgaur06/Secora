# SECORA — AI Cybersecurity & Ethical Hacking Operating System

> **Understand. Investigate. Secure.**

SECORA is a full-stack, two-way AI-powered cybersecurity portal and ethical hacking platform. Built for security researchers, SOC analysts, ethical hackers, and software engineers, SECORA delivers grounded defensive intelligence, vulnerability assessment, interactive educational labs, code reviews, and structured remediation paths.

---

## Key Highlights & Architectural Features

- **CyberOS Technical Aesthetic:** Terminal-inspired UI featuring deep carbon backgrounds, high-contrast monospace technical metadata, and glowing DEFCON-5 system status telemetry.
- **6 Specialized Operational Modes:**
  - `LEARNING`: First-principles technical explanations and root-cause analyses.
  - `DEFENSIVE`: Mitigation, intrusion detection, firewall rules, and system hardening focus.
  - `TROUBLESHOOTING`: Diagnostics for misconfigured Nginx proxies, TLS certificates, and network boundaries.
  - `CTF / LAB`: Educational hints and methodology coaching for Capture The Flag challenges.
  - `CODE REVIEW`: Source code audits for OWASP Top 10 vulnerabilities (SQLi, IDOR, SSRF, XSS).
  - `GENERAL`: Peer cybersecurity assistant for broad queries.
- **Grounded RAG Pipeline:** Vector embeddings cross-referenced against authoritative sources (OWASP Top 10, CWE, MITRE ATT&CK, Linux Hardening specs).
- **Zero Autonomous Execution Policy:** Informational commands with copy/download controls; no silent executions on user hosts.
- **Transparent Token Accounting:** Metered usage tracking computed from actual inference requests with monthly quotas and daily history.

---

## Technology Stack

- **Backend:** Python 3.11, FastAPI, SQLAlchemy 2.0, Pydantic v2, PyJWT, Bcrypt, Aiosqlite, Uvicorn
- **Database:** PostgreSQL (with pgvector support) / SQLite with zero-config standalone development
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Deployment:** Docker, Docker Compose, Nginx reverse-proxy

---

## Directory Structure

```
Secora/
├── backend/
│   ├── app/
│   │   ├── api/             # REST routes: auth, users, conversations, usage, health, admin, knowledge
│   │   ├── models/          # Relational models (User, Plan, Conversation, Message, Knowledge, Lab, Audit)
│   │   ├── schemas/         # Pydantic validation schemas
│   │   ├── security/        # JWT, Bcrypt hashing, RBAC dependencies
│   │   ├── middleware/      # OWASP security headers, rate limiting
│   │   ├── config.py        # Pydantic settings & environment secrets
│   │   ├── database.py      # SQLAlchemy engine & session maker
│   │   └── main.py          # FastAPI application factory
│   ├── tests/               # Pytest suite with isolated in-memory DB tests
│   ├── seed.py              # Seeds initial Admin, Demo Analyst, Knowledge Docs, and Labs
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/      # UI, Navbar, Footer, AppSidebar, TelemetryBar, TerminalCommandBlock, CodeBlock
│   │   ├── context/         # AuthContext with persistent JWT token storage
│   │   ├── pages/           # LandingPage, Features, Security, Docs, Pricing, Login, Register, Dashboard, Chat, etc.
│   │   ├── services/        # API client
│   │   ├── types/           # TypeScript definitions
│   │   ├── App.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
├── ARCHITECTURE.md
└── README.md
```

---

## Quickstart & Local Setup

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python seed.py
uvicorn app.main:app --reload --port 8000
```
- Swagger API Docs: `http://localhost:8000/docs`
- Health Telemetry: `http://localhost:8000/api/health`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:3000`

### 3. Default Credentials
| Role | Identifier / Email | Password | Monthly Token Quota |
| :--- | :--- | :--- | :--- |
| **Demo Analyst** | `cyber_analyst` / `analyst@secora.internal` | `Analyst@Secora2026!` | 100,000 Tokens (Free Tier) |
| **Root Administrator** | `secora_admin` / `admin@secora.internal` | `Admin@Secora2026!` | 10,000,000 Tokens (Enterprise Tier) |

---

## Docker Production Deployment

To launch the complete containerized stack (FastAPI Backend, Nginx Frontend, PostgreSQL 16 with pgvector, and Redis):

```bash
docker-compose up -d --build
```
- Web Portal: `http://localhost:3000`
- API Gateway: `http://localhost:8000`

---

## Testing & Verification

Run automated backend tests via Pytest:
```bash
cd backend
venv\Scripts\pytest
```

Run frontend production bundle validation:
```bash
cd frontend
npm run build
```
