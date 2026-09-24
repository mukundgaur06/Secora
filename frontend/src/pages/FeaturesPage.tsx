import React from 'react';
import {
  Terminal,
  Shield,
  Cpu,
  Code2,
  BookOpen,
  FlaskConical,
  Zap,
  Wrench,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface FeaturesPageProps {
  onNavigate: (path: string) => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-void-950 cyber-grid font-mono text-xs text-slate-300 py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-void-900 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
            // PLATFORM CAPABILITIES
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 font-mono">
            MISSION-CRITICAL CAPABILITIES
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            SECORA fuses advanced large language model reasoning with authoritative cybersecurity taxonomies, isolated hands-on practice labs, and strict defensive guardrails.
          </p>
        </div>

        {/* Deep Dive Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="cyber-card rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">6 Cybersecurity Operational Modes</h3>
                <span className="text-[10px] text-slate-500 uppercase">Dynamic Prompt Orchestration</span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Tailor reasoning pipelines instantly. Modes include <strong>Learning</strong> (first-principles conceptual breakdowns), <strong>Defensive</strong> (hardening and mitigation priority), <strong>Troubleshooting</strong> (diagnosing TLS/Nginx/routing issues), <strong>CTF / Lab</strong> (ethical capture-the-flag coaching), and <strong>Code Review</strong> (OWASP vulnerability detection).
            </p>
          </div>

          <div className="cyber-card rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Grounded RAG Knowledge Engine</h3>
                <span className="text-[10px] text-slate-500 uppercase">OWASP • CWE • MITRE ATT&CK</span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Every inference request is cross-referenced with curated vector embeddings spanning the OWASP Top 10, Common Weakness Enumeration (CWE), NIST guidelines, and Linux hardening specifications to eliminate hallucinations and deliver authoritative answers.
            </p>
          </div>

          <div className="cyber-card rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Interactive Security Labs</h3>
                <span className="text-[10px] text-slate-500 uppercase">Isolated Educational Environments</span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Progress through guided lab challenges covering SQL Injection mitigation, DOM-based XSS defense, SUID binary privilege auditing, and cryptographic hash verification with progressive hints and solutions.
            </p>
          </div>

          <div className="cyber-card rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Transparent Token Accounting</h3>
                <span className="text-[10px] text-slate-500 uppercase">Real-Time Usage Metering</span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Zero synthetic token calculations. Token consumption is logged directly from inference providers, tracking monthly allowances, daily request velocity, and cost breakdowns in real-time.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-8">
          <button
            onClick={() => onNavigate('/app')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-glow-emerald transition-all"
          >
            <Terminal className="w-4 h-4" />
            <span>ENTER SECURITY CONSOLE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
