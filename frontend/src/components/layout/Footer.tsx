import React from 'react';
import { ShieldCheck, Terminal, Github, ExternalLink, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-void-950 border-t border-void-700/60 mt-auto">
      {/* Top Status Bar */}
      <div className="border-b border-void-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-200 font-bold tracking-wide">ALL SYSTEMS OPERATIONAL</span>
            <span className="text-slate-600">//</span>
            <span className="text-slate-400">DEFENSIVE AI ENGINE ONLINE</span>
          </div>

          <div className="text-slate-500 text-xs">
            SYS.CORE: <span className="text-slate-400">FASTAPI + RAG + POSTGRES</span> // 256-BIT ENCRYPTION
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 font-mono text-xs">
        <div>
          <h4 className="text-slate-200 font-bold mb-4 tracking-wider text-emerald-400">// PLATFORM</h4>
          <ul className="space-y-2.5 text-slate-400">
            <li>
              <button onClick={() => onNavigate('/app/chat')} className="hover:text-emerald-300 transition-colors">
                Security Assistant
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/app/labs')} className="hover:text-emerald-300 transition-colors">
                Hands-On Labs
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/app/knowledge')} className="hover:text-emerald-300 transition-colors">
                Curated Knowledge Base
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/pricing')} className="hover:text-emerald-300 transition-colors">
                Token Allocation & Plans
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-200 font-bold mb-4 tracking-wider text-cyan-400">// SECURITY</h4>
          <ul className="space-y-2.5 text-slate-400">
            <li>
              <button onClick={() => onNavigate('/security')} className="hover:text-cyan-300 transition-colors">
                Security Architecture
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/docs')} className="hover:text-cyan-300 transition-colors">
                Responsible Use Policy
              </button>
            </li>
            <li>
              <span className="text-slate-500 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-400" />
                Zero Autonomous Attacks
              </span>
            </li>
            <li>
              <span className="text-slate-500">OWASP Top 10 Aligned</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-200 font-bold mb-4 tracking-wider text-purple-400">// DEVELOPERS</h4>
          <ul className="space-y-2.5 text-slate-400">
            <li>
              <a href="/docs" target="_blank" rel="noreferrer" className="hover:text-purple-300 transition-colors flex items-center gap-1">
                OpenAPI Reference
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </li>
            <li>
              <span className="text-slate-500">SSE Realtime Streaming</span>
            </li>
            <li>
              <span className="text-slate-500">Multi-Model Abstraction</span>
            </li>
            <li>
              <span className="text-slate-500">pgvector RAG Core</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-200 font-bold mb-4 tracking-wider text-slate-300">// IDENTITY</h4>
          <p className="text-slate-400 leading-relaxed mb-4 text-[11px]">
            SECORA is an independent cyber operations intelligence and defensive portal designed for certified ethical hackers, security analysts, and engineers.
          </p>
          <div className="flex items-center gap-2 text-slate-500 text-[10px]">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>TERMINAL OS v1.0.0</span>
          </div>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="border-t border-void-800/60 py-6 text-center text-slate-500 font-mono text-[11px]">
        &copy; {new Date().getFullYear()} SECORA SECURITY SYSTEMS. ALL RIGHTS RESERVED. DEFENSIVE & EDUCATIONAL WORKFLOWS ONLY.
      </div>
    </footer>
  );
};
