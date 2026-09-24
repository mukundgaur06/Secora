import React from 'react';
import { CybersecurityMode } from '../../types';
import { ShieldCheck, BookOpen, ExternalLink, Activity, Info, CheckCircle2 } from 'lucide-react';

interface RightContextPanelProps {
  mode: CybersecurityMode;
  topic?: string;
  category?: string;
  difficulty?: string;
  sources?: string[];
}

export const RightContextPanel: React.FC<RightContextPanelProps> = ({
  mode,
  topic = "Web & Cloud Security",
  category = "Vulnerability Assessment",
  difficulty = "Intermediate",
  sources = ["OWASP Top 10", "CWE / SANS", "MITRE ATT&CK", "Secora RAG Core"],
}) => {
  return (
    <aside className="w-72 bg-void-950 border-l border-void-700/60 p-4 font-mono text-xs hidden xl:flex flex-col gap-5 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-void-800">
        <div className="flex items-center gap-2 text-slate-200 font-bold">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>SECURITY CONTEXT</span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
          LIVE
        </span>
      </div>

      {/* Primary Classification */}
      <div className="space-y-3">
        <div className="bg-void-900/90 border border-void-800 rounded p-3 space-y-2.5">
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">ACTIVE MODE</div>
            <div className="text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {mode}
            </div>
          </div>

          <div className="pt-2 border-t border-void-800">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">TARGET DOMAIN</div>
            <div className="text-slate-200 font-medium mt-0.5">{topic}</div>
          </div>

          <div className="pt-2 border-t border-void-800">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">CLASSIFICATION</div>
            <div className="text-cyan-400 font-medium mt-0.5">{category}</div>
          </div>

          <div className="pt-2 border-t border-void-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">DIFFICULTY</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Authoritative Sources Grounding */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>GROUNDED SOURCES</span>
        </div>
        <div className="space-y-1.5">
          {sources.map((src, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-2.5 py-1.5 rounded bg-void-900/60 border border-void-800/80 text-[11px] text-slate-300 hover:border-cyan-500/30 transition-colors"
            >
              <span className="flex items-center gap-1.5 truncate">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{src}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Defensive Safety Policy */}
      <div className="mt-auto bg-void-900/40 border border-emerald-500/20 rounded p-3 space-y-2 text-[11px]">
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>POLICY ENFORCED</span>
        </div>
        <p className="text-slate-400 text-[10px] leading-relaxed">
          Authorized testing, educational deep dives, and defensive mitigation rules active. Autonomous attacks restricted.
        </p>
      </div>
    </aside>
  );
};
