import React, { useState } from 'react';
import {
  BookOpen,
  Terminal,
  Code2,
  Cpu,
  Shield,
  Layers,
  Zap,
  ExternalLink,
} from 'lucide-react';
import { TerminalCommandBlock } from '../components/terminal/TerminalCommandBlock';

export const DocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'getting-started' | 'rag' | 'modes' | 'api'>('getting-started');

  return (
    <div className="min-h-screen bg-void-950 cyber-grid font-mono text-xs text-slate-300 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 space-y-2 shrink-0">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            // DOCUMENTATION
          </div>
          {[
            { id: 'getting-started', label: '1. Getting Started', icon: Terminal },
            { id: 'rag', label: '2. RAG Architecture', icon: Layers },
            { id: 'modes', label: '3. Cybersecurity Modes', icon: Shield },
            { id: 'api', label: '4. REST API Reference', icon: Code2 },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-left transition-colors ${
                  activeSection === item.id
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold'
                    : 'text-slate-400 hover:bg-void-900 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 border-t border-void-800">
            <a
              href="/docs"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded bg-void-900 border border-void-800 text-cyan-400 hover:border-cyan-500/50 transition-colors"
            >
              <span>Interactive OpenAPI Swagger</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Content Pane */}
        <div className="flex-1 bg-void-900/80 border border-void-700/80 rounded-xl p-8 space-y-6">
          {activeSection === 'getting-started' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-100 font-mono">Getting Started with SECORA</h2>
              <p className="text-slate-400 leading-relaxed text-xs">
                SECORA provides an intelligent copilot for defensive security operations, incident diagnosis, vulnerability research, and secure code review.
              </p>

              <h3 className="text-base font-bold text-emerald-400 pt-2">Environment Setup</h3>
              <p className="text-slate-400 text-xs">
                To run SECORA locally or within your private cluster:
              </p>
              <TerminalCommandBlock
                command="git clone https://github.com/secora/secora.git\ncd secora\n# Launch backend and frontend via docker-compose\ndocker-compose up -d --build"
                title="DEPLOYMENT COMMAND"
              />

              <h3 className="text-base font-bold text-emerald-400 pt-2">Default Credentials</h3>
              <div className="p-3 bg-void-950 rounded border border-void-800 text-[11px] space-y-1">
                <div>• Demo Analyst: <code className="text-emerald-400">analyst@secora.internal</code> / <code className="text-slate-400">Analyst@Secora2026!</code></div>
                <div>• Root Admin: <code className="text-purple-400">admin@secora.internal</code> / <code className="text-slate-400">Admin@Secora2026!</code></div>
              </div>
            </div>
          )}

          {activeSection === 'rag' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-100 font-mono">Retrieval-Augmented Generation (RAG)</h2>
              <p className="text-slate-400 leading-relaxed text-xs">
                Our RAG pipeline ensures that answers are verified against official cybersecurity taxonomies before reaching the model:
              </p>
              <div className="p-4 bg-void-950 rounded-lg border border-void-800 space-y-2 text-xs">
                <div className="text-cyan-400 font-bold">1. Query Classification</div>
                <p className="text-slate-400">Identifies target threat domain (Web, Linux, Crypto, Network, Forensic).</p>

                <div className="text-cyan-400 font-bold pt-2">2. Vector Search Retrieval</div>
                <p className="text-slate-400">Pulls top-k chunks from indexed OWASP Top 10, CWE-2025, and NIST special publications.</p>

                <div className="text-cyan-400 font-bold pt-2">3. Policy & Guardrail Verification</div>
                <p className="text-slate-400">Audits user request to eliminate autonomous malicious execution vectors.</p>
              </div>
            </div>
          )}

          {activeSection === 'modes' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-100 font-mono">Cybersecurity Operational Modes</h2>
              <p className="text-slate-400 leading-relaxed text-xs">
                Switch modes dynamically to calibrate AI responses:
              </p>
              <div className="space-y-3">
                <div className="p-3 rounded bg-void-950 border border-emerald-500/20">
                  <div className="text-emerald-400 font-bold">LEARNING</div>
                  <div className="text-slate-400 text-[11px]">Explains technical mechanisms step-by-step from root principles.</div>
                </div>
                <div className="p-3 rounded bg-void-950 border border-cyan-500/20">
                  <div className="text-cyan-400 font-bold">DEFENSIVE</div>
                  <div className="text-slate-400 text-[11px]">Focuses strictly on detection rules, firewall policies, and secure configurations.</div>
                </div>
                <div className="p-3 rounded bg-void-950 border border-amber-500/20">
                  <div className="text-amber-400 font-bold">TROUBLESHOOTING</div>
                  <div className="text-slate-400 text-[11px]">Pinpoints broken configs, permission errors, and service timeouts.</div>
                </div>
                <div className="p-3 rounded bg-void-950 border border-purple-500/20">
                  <div className="text-purple-400 font-bold">CODE REVIEW</div>
                  <div className="text-slate-400 text-[11px]">Scans source code for injection, authentication, and cryptographic flaws.</div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'api' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-100 font-mono">FastAPI REST Endpoints</h2>
              <p className="text-slate-400 leading-relaxed text-xs">
                All endpoints require Bearer JWT token header <code className="text-emerald-400">Authorization: Bearer &lt;token&gt;</code>:
              </p>
              <div className="space-y-2 text-[11px]">
                <div className="p-2.5 bg-void-950 rounded border border-void-800 flex items-center justify-between">
                  <div><span className="text-emerald-400 font-bold">POST</span> /api/auth/login</div>
                  <span className="text-slate-500">Authenticate session</span>
                </div>
                <div className="p-2.5 bg-void-950 rounded border border-void-800 flex items-center justify-between">
                  <div><span className="text-cyan-400 font-bold">GET</span> /api/conversations</div>
                  <span className="text-slate-500">List user investigations</span>
                </div>
                <div className="p-2.5 bg-void-950 rounded border border-void-800 flex items-center justify-between">
                  <div><span className="text-purple-400 font-bold">GET</span> /api/usage</div>
                  <span className="text-slate-500">Get token balance</span>
                </div>
                <div className="p-2.5 bg-void-950 rounded border border-void-800 flex items-center justify-between">
                  <div><span className="text-emerald-400 font-bold">GET</span> /api/health</div>
                  <span className="text-slate-500">System telemetry</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
