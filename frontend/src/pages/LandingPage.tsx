import React, { useState } from 'react';
import {
  Terminal,
  ShieldCheck,
  Code2,
  BookOpen,
  FlaskConical,
  Zap,
  Wrench,
  Search,
  ArrowRight,
  CheckCircle,
  Cpu,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { TerminalCommandBlock } from '../components/terminal/TerminalCommandBlock';
import { CodeBlock } from '../components/terminal/CodeBlock';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'status' | 'demo' | 'defensive'>('demo');

  const demoPythonCode = `def authenticate_user(username, password):
    # SECURE: Parameterized Query using SQLAlchemy ORM
    query = text("SELECT id, role, password_hash FROM users WHERE username = :uname")
    user = db.execute(query, {"uname": username}).first()
    
    if user and bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        return {"status": "success", "user_id": user.id, "role": user.role}
    return {"status": "unauthorized"}`;

  return (
    <div className="relative min-h-screen bg-void-950 cyber-grid overflow-hidden">
      {/* Glow gradient blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[400px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Top Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-void-900 border border-emerald-500/30 text-emerald-400 font-mono text-xs shadow-glow-emerald">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>NEXT-GEN DEFENSIVE CYBERSECURITY OPERATING SYSTEM</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-100 font-mono">
            CYBERSECURITY.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-200">
              ASK. ANALYZE. SOLVE.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            An AI-powered cybersecurity assistant for learning, troubleshooting, defensive security and ethical hacking. Grounded with authoritative OWASP, CWE, and MITRE knowledge.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 font-mono text-xs">
            <button
              onClick={() => onNavigate('/app')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold shadow-glow-emerald transition-all transform hover:-translate-y-0.5"
            >
              <Terminal className="w-4 h-4" />
              <span>ENTER SECURITY CONSOLE</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('/features')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-md bg-void-900 hover:bg-void-850 border border-void-700 text-slate-200 hover:border-emerald-500/50 transition-all"
            >
              <span>EXPLORE CAPABILITIES</span>
              <ChevronRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Interactive Terminal Visual Hero Panel */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="rounded-xl overflow-hidden border border-emerald-500/40 bg-void-950/90 shadow-2xl backdrop-blur-xl">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-void-900 border-b border-void-800 font-mono text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-crimson-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="ml-2 text-slate-400 font-semibold text-[11px]">secora-telemetry-terminal // bash</span>
              </div>

              {/* Selector Tabs */}
              <div className="flex items-center gap-1 bg-void-950 p-1 rounded border border-void-800 text-[10px]">
                <button
                  onClick={() => setActiveTab('status')}
                  className={`px-2 py-0.5 rounded transition-colors ${activeTab === 'status' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  $ sys.status
                </button>
                <button
                  onClick={() => setActiveTab('demo')}
                  className={`px-2 py-0.5 rounded transition-colors ${activeTab === 'demo' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  $ sqli.investigate
                </button>
                <button
                  onClick={() => setActiveTab('defensive')}
                  className={`px-2 py-0.5 rounded transition-colors ${activeTab === 'defensive' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  $ secure.code
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-6 font-mono text-xs leading-relaxed space-y-4">
              {activeTab === 'status' && (
                <div className="space-y-2 text-slate-300">
                  <div className="text-emerald-400">$ security_assistant --status</div>
                  <div className="text-slate-400">
                    SYSTEM ........ <span className="text-emerald-400 font-bold">ONLINE</span><br />
                    AI ENGINE ..... <span className="text-emerald-400 font-bold">ONLINE (GEMINI 2.5 FLASH)</span><br />
                    KNOWLEDGE ..... <span className="text-emerald-400 font-bold">CONNECTED (OWASP, CWE, MITRE)</span><br />
                    API ........... <span className="text-emerald-400 font-bold">ONLINE (200 OK)</span><br />
                    DATABASE ...... <span className="text-emerald-400 font-bold">HEALTHY</span>
                  </div>
                  <div className="text-slate-500 pt-2 text-[11px]">
                    [READY] Listening on secure socket for security investigations.
                  </div>
                </div>
              )}

              {activeTab === 'demo' && (
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">USER:</span>
                    <span className="text-slate-200">How do I identify SQL injection in my test application?</span>
                  </div>

                  <div className="space-y-3 pl-4 border-l-2 border-emerald-500/40 text-slate-300">
                    <div className="text-emerald-400 font-bold">[SUMMARY]</div>
                    <p className="text-slate-300">
                      SQL Injection occurs when untrusted input concatenates into database queries. In an authorized test environment, follow systematic verification:
                    </p>

                    <div className="text-cyan-400 font-bold">[DETECTION PROCEDURE]</div>
                    <ol className="list-decimal pl-4 space-y-1 text-slate-300 text-[11px]">
                      <li>Audit parameter inputs using single quotes (<code className="text-amber-300">'</code>) and boolean differentials.</li>
                      <li>Observe database syntax error responses or anomalous response timing.</li>
                      <li>Check query construction in source code for raw f-strings or string concatenation.</li>
                    </ol>

                    <TerminalCommandBlock
                      command="sqlmap -u 'http://localhost:8080/search?q=test' --batch --banner"
                      title="SAFE LOCAL AUDIT"
                      notes="Only run against systems and IP ranges you own or have explicit written authorization to test."
                    />

                    <div className="text-emerald-400 font-bold">[HOW TO FIX]</div>
                    <p className="text-slate-300 text-[11px]">
                      Always utilize Parameterized Queries (Prepared Statements) or an Object-Relational Mapper (ORM).
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'defensive' && (
                <div className="space-y-3">
                  <div className="text-emerald-400 font-bold">[REMEDIATION PATTERN: PYTHON & SQLALCHEMY]</div>
                  <CodeBlock
                    language="python"
                    filename="auth_service.py"
                    code={demoPythonCode}
                  />
                  <div className="text-[11px] text-slate-400">
                    Status: <span className="text-emerald-400 font-semibold">100% Parameterized</span> // Immune to in-band SQL Injection attacks.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="relative border-t border-void-800 bg-void-950 py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono text-emerald-400 font-bold tracking-widest uppercase">
              // ARCHITECTURE CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 font-mono">
              ENGINEERED FOR SERIOUS SECURITY
            </h2>
            <p className="text-slate-400 text-sm">
              Modular, grounded intelligence designed specifically for defensive security engineers, penetration testers, and SOC analysts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
            {/* Card 1 */}
            <div className="cyber-card rounded-lg p-5 space-y-3">
              <div className="w-9 h-9 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">AI SECURITY ASSISTANT</h3>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Ask complex cybersecurity questions and receive structured explanations, root causes, and safe verification steps.
              </p>
            </div>

            {/* Card 2 */}
            <div className="cyber-card rounded-lg p-5 space-y-3">
              <div className="w-9 h-9 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">CODE & SCRIPT GEN</h3>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Generate defensive scripts, secure hardening rules, Nmap scans, firewall configs, and remediation patches.
              </p>
            </div>

            {/* Card 3 */}
            <div className="cyber-card rounded-lg p-5 space-y-3">
              <div className="w-9 h-9 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">STEP-BY-STEP GUIDES</h3>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Turn complex vulnerabilities and CTF problems into structured learning paths with clear objectives.
              </p>
            </div>

            {/* Card 4 */}
            <div className="cyber-card rounded-lg p-5 space-y-3">
              <div className="w-9 h-9 rounded bg-crimson-500/10 border border-crimson-500/30 flex items-center justify-center text-crimson-400">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">TROUBLESHOOTING</h3>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Diagnose broken Nginx configs, failed JWT signatures, TLS handshake errors, and Docker container escapes.
              </p>
            </div>

            {/* Card 5 */}
            <div className="cyber-card rounded-lg p-5 space-y-3">
              <div className="w-9 h-9 rounded bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">KNOWLEDGE BASE</h3>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Ground responses using curated cybersecurity resources from OWASP, CWE, MITRE ATT&CK, and Linux hardening docs.
              </p>
            </div>

            {/* Card 6 */}
            <div className="cyber-card rounded-lg p-5 space-y-3">
              <div className="w-9 h-9 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">CONVERSATION MEMORY</h3>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Continue investigations across sessions with intelligent context compression to prevent token explosion.
              </p>
            </div>

            {/* Card 7 */}
            <div className="cyber-card rounded-lg p-5 space-y-3">
              <div className="w-9 h-9 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <FlaskConical className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">SECURITY LABS</h3>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Practice ethical hacking concepts in isolated, controlled educational environments with step-by-step hints.
              </p>
            </div>

            {/* Card 8 */}
            <div className="cyber-card rounded-lg p-5 space-y-3">
              <div className="w-9 h-9 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">TOKEN DASHBOARD</h3>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Track real token consumption, remaining credits, model usage, and daily request activity transparently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cybersecurity Modes Banner */}
      <section className="border-t border-void-800 bg-void-900/50 py-16 px-6 font-mono text-xs">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-emerald-400 font-bold uppercase tracking-wider">// SYSTEM ORCHESTRATION</span>
              <h3 className="text-2xl font-bold text-slate-100 mt-1 font-mono">
                6 SPECIALIZED CYBERSECURITY MODES
              </h3>
            </div>
            <p className="text-slate-400 text-xs max-w-md">
              Switch modes on the fly to tailor the AI's reasoning depth, command generation, and defensive guardrails.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { mode: 'LEARNING', desc: 'Explains foundational concepts deeply with analogies.' },
              { mode: 'DEFENSIVE', desc: 'Prioritizes mitigation, detection, and hardening.' },
              { mode: 'TROUBLESHOOTING', desc: 'Diagnoses broken configs and service errors.' },
              { mode: 'CTF / LAB', desc: 'Safe educational hints for capture-the-flag exercises.' },
              { mode: 'CODE REVIEW', desc: 'Audits source code for OWASP vulnerabilities.' },
              { mode: 'GENERAL', desc: 'Versatile peer cybersecurity assistant.' },
            ].map(m => (
              <div key={m.mode} className="p-3.5 rounded bg-void-950 border border-void-700/80 hover:border-emerald-500/40 transition-colors">
                <div className="text-emerald-400 font-bold mb-1 text-[11px]">{m.mode}</div>
                <div className="text-slate-400 text-[10px] leading-relaxed">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-void-800 bg-void-950 py-16 px-6 text-center font-mono">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold text-slate-100">
            READY TO ELEVATE YOUR SECURITY DEFENSE?
          </h2>
          <p className="text-slate-400 text-sm">
            Launch the security console now. Free analyst tier includes 100,000 tokens monthly with zero credit card required.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/register')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold shadow-glow-emerald transition-all"
            >
              <Terminal className="w-4 h-4" />
              <span>LAUNCH SECURITY CONSOLE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
