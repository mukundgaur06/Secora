import React from 'react';
import {
  ShieldCheck,
  Lock,
  Server,
  AlertTriangle,
  Cpu,
  Key,
  FileCheck,
  ArrowRight,
} from 'lucide-react';

interface SecurityPageProps {
  onNavigate: (path: string) => void;
}

export const SecurityPage: React.FC<SecurityPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-void-950 cyber-grid font-mono text-xs text-slate-300 py-16 px-6">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-void-900 border border-cyan-500/30 text-cyan-400 text-[11px] font-bold">
            // DEFENSIVE INTEGRITY
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 font-mono">
            SECURITY ARCHITECTURE & GUARDRAILS
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            SECORA is engineered with defense-in-depth principles. Our safety policy layer actively protects against autonomous attack vectors while supporting legitimate ethical security analysis.
          </p>
        </div>

        {/* 4 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-void-900/80 border border-void-700/80 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>1. Defensive & Educational Policy Layer</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              All user inquiries pass through an automated policy engine. The system clearly distinguishes educational concepts, authorized penetration testing guidance, and mitigation patches from malicious live-target exploitation. Real-world autonomous attacking campaigns are strictly denied.
            </p>
          </div>

          <div className="bg-void-900/80 border border-void-700/80 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Server className="w-5 h-5" />
              <span>2. No Silent or Unrestricted Execution</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              SECORA never silently executes terminal commands on user machines or host infrastructure. All generated terminal commands are clearly badged as informational. Any future interactive executions run exclusively inside isolated, ephemeral container sandboxes with restricted network capabilities.
            </p>
          </div>

          <div className="bg-void-900/80 border border-void-700/80 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <Lock className="w-5 h-5" />
              <span>3. Data Privacy & Zero-Retention Security</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Client passwords are never stored in plaintext and are protected with salted bcrypt (12 rounds). Session tokens use cryptographically signed JWTs with expiration boundaries. Users retain full autonomy to purge conversations and profile records.
            </p>
          </div>

          <div className="bg-void-900/80 border border-void-700/80 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <FileCheck className="w-5 h-5" />
              <span>4. OWASP Top 10 2025 Compliant</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Built following secure application architecture standards: parameterized SQLAlchemy queries (zero SQLi risk), strict Content Security Policy, X-Frame-Options DENY, strict MIME sniff prevention, rate limiting per IP, and automated security audit logging.
            </p>
          </div>
        </div>

        {/* Responsible Use Notice */}
        <div className="p-6 rounded-xl bg-void-900/50 border border-amber-500/30 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>RESPONSIBLE USE & ETHICAL HACKING CHARTER</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-xs">
            SECORA tools, guides, and suggestions are intended strictly for educational study, academic vulnerability analysis, authorized CTF competitions, and internal infrastructure defense. Testing external systems without explicit written permission from the asset owner is illegal and violates our terms of service.
          </p>
        </div>
      </div>
    </div>
  );
};
