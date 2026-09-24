import React from 'react';
import { Shield, Zap, Check, ArrowRight } from 'lucide-react';

interface PricingPageProps {
  onNavigate: (path: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-void-950 cyber-grid font-mono text-xs text-slate-300 py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-void-900 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
            // TOKEN ALLOCATION & PLANS
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 font-mono">
            TRANSPARENT DEFENSIVE INTELLIGENCE
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Metered token consumption with zero hidden fees. Built for individual researchers and enterprise SOC teams alike.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tier 1 */}
          <div className="cyber-card rounded-xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-emerald-400 font-bold uppercase tracking-wider text-xs">
                TIER 1 // COMMUNITY
              </div>
              <h3 className="text-2xl font-bold text-slate-100 font-mono">FREE ANALYST</h3>
              <div className="text-3xl font-extrabold text-slate-100 font-mono">
                $0 <span className="text-xs text-slate-500 font-normal">/ month</span>
              </div>
              <p className="text-slate-400 text-xs">
                Essential defensive AI assistance for students, CTF players, and developers.
              </p>

              <div className="space-y-2.5 pt-4 border-t border-void-800 text-[11px]">
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>100,000 monthly tokens</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>All 6 operational modes</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Access to curated learning labs</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Standard community support</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/register')}
              className="w-full py-2.5 rounded bg-void-900 hover:bg-void-850 border border-emerald-500/30 text-emerald-400 font-bold transition-all text-center"
            >
              PROVISION FREE
            </button>
          </div>

          {/* Tier 2 */}
          <div className="cyber-card rounded-xl p-6 space-y-6 flex flex-col justify-between border-emerald-500/60 shadow-glow-emerald relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px]">
              RECOMMENDED FOR RESEARCHERS
            </div>

            <div className="space-y-4">
              <div className="text-cyan-400 font-bold uppercase tracking-wider text-xs">
                TIER 2 // RESEARCH
              </div>
              <h3 className="text-2xl font-bold text-slate-100 font-mono">PRO RESEARCHER</h3>
              <div className="text-3xl font-extrabold text-slate-100 font-mono">
                $29 <span className="text-xs text-slate-500 font-normal">/ month</span>
              </div>
              <p className="text-slate-400 text-xs">
                Full-throttle capacity for active penetration testers, security engineers, and auditors.
              </p>

              <div className="space-y-2.5 pt-4 border-t border-void-800 text-[11px]">
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>1,000,000 monthly tokens</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>High-priority inference queue</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Custom code review audits</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Interactive lab sandboxes</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/register')}
              className="w-full py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-glow-emerald transition-all text-center"
            >
              UPGRADE TO PRO
            </button>
          </div>

          {/* Tier 3 */}
          <div className="cyber-card rounded-xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-purple-400 font-bold uppercase tracking-wider text-xs">
                TIER 3 // SOC
              </div>
              <h3 className="text-2xl font-bold text-slate-100 font-mono">ENTERPRISE SOC</h3>
              <div className="text-3xl font-extrabold text-slate-100 font-mono">
                $199 <span className="text-xs text-slate-500 font-normal">/ month</span>
              </div>
              <p className="text-slate-400 text-xs">
                Dedicated infrastructure, custom document ingestion, and compliance reporting.
              </p>

              <div className="space-y-2.5 pt-4 border-t border-void-800 text-[11px]">
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>10,000,000+ monthly tokens</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Private internal knowledge base RAG</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Dedicated model instance isolation</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Full audit log exports & SLA</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/register')}
              className="w-full py-2.5 rounded bg-void-900 hover:bg-void-850 border border-purple-500/30 text-purple-300 font-bold transition-all text-center"
            >
              CONTACT SOC TEAM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
