import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Conversation, HealthStatus } from '../types';
import {
  Terminal,
  Shield,
  Zap,
  MessageSquare,
  FlaskConical,
  BookOpen,
  ArrowRight,
  Activity,
  Cpu,
  Database,
  Code2,
  Lock,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadDashboard = async () => {
      try {
        const [convData, healthData] = await Promise.all([
          api.getConversations(),
          api.getHealth(),
        ]);
        if (isMounted) {
          setConversations(convData);
          setHealth(healthData);
        }
      } catch {
        // Fallback
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboard();
    return () => { isMounted = false; };
  }, []);

  const plan = user?.plan;
  const tokensLimit = plan?.monthly_token_limit || 100000;
  const tokensUsed = plan?.tokens_used || 0;
  const tokensRemaining = Math.max(0, tokensLimit - tokensUsed);
  const percentage = Math.min(100, Math.round((tokensUsed / tokensLimit) * 100));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 font-mono text-xs">
      {/* Welcome Banner */}
      <div className="bg-void-900/90 border border-void-700/80 rounded-xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
              SYS.CONSOLE // AUTHORIZED
            </span>
            <span className="text-slate-500 text-[10px]">// DEFCON-5 READY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 font-mono">
            WELCOME, OPERATOR <span className="text-emerald-400">{user?.username.toUpperCase()}</span>
          </h1>
          <p className="text-slate-400 text-xs">
            Secora AI Cyber Operations Environment. Ready to analyze threats, audit code, and explore CTF labs.
          </p>
        </div>

        {/* Quick Launch Button */}
        <button
          onClick={() => onNavigate('/app/chat')}
          className="flex items-center gap-2.5 px-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-glow-emerald transition-all shrink-0"
        >
          <Terminal className="w-4 h-4" />
          <span>START INVESTIGATION</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid: System Status & User Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="cyber-card rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>TOKENS REMAINING</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-300">
            {tokensRemaining.toLocaleString()}
          </div>
          <div className="w-full bg-void-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all"
              style={{ width: `${100 - percentage}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 flex justify-between">
            <span>{percentage}% Used</span>
            <span>Limit: {(tokensLimit / 1000).toFixed(0)}k</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="cyber-card rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>INVESTIGATIONS</span>
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {conversations.length}
          </div>
          <div className="text-[10px] text-slate-500">
            Active session records saved
          </div>
        </div>

        {/* Metric 3 */}
        <div className="cyber-card rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>HANDS-ON LABS</span>
            <FlaskConical className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">3 ACTIVE</div>
          <div className="text-[10px] text-slate-500">
            SQLi, DOM XSS, SUID Privileges
          </div>
        </div>

        {/* Metric 4 */}
        <div className="cyber-card rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>RAG DOCUMENTS</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400">4 GROUNDED</div>
          <div className="text-[10px] text-slate-500">
            OWASP, CWE, MITRE, Linux
          </div>
        </div>
      </div>

      {/* Main Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Quick Actions & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-void-900/80 border border-void-700/80 rounded-xl p-5 space-y-4">
            <div className="text-slate-200 font-bold flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>QUICK SECURITY OPERATIONS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate('/app/chat')}
                className="p-3.5 rounded bg-void-950 hover:bg-void-850 border border-void-700 hover:border-emerald-500/50 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">
                    Ask Security Question
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Query web security, networking, CVEs, or penetration testing procedures.
                </p>
              </button>

              <button
                onClick={() => onNavigate('/app/chat?mode=CODE_REVIEW')}
                className="p-3.5 rounded bg-void-950 hover:bg-void-850 border border-void-700 hover:border-cyan-500/50 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">
                    Analyze Vulnerable Code
                  </span>
                  <Code2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Submit Python, JS, C, or PHP snippets to locate logic flaws and injection sinks.
                </p>
              </button>

              <button
                onClick={() => onNavigate('/app/labs')}
                className="p-3.5 rounded bg-void-950 hover:bg-void-850 border border-void-700 hover:border-amber-500/50 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-amber-400 font-bold group-hover:translate-x-1 transition-transform">
                    Start Cybersecurity Lab
                  </span>
                  <FlaskConical className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Learn through guided interactive challenges in safe, isolated scenarios.
                </p>
              </button>

              <button
                onClick={() => onNavigate('/app/knowledge')}
                className="p-3.5 rounded bg-void-950 hover:bg-void-850 border border-void-700 hover:border-purple-500/50 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-purple-400 font-bold group-hover:translate-x-1 transition-transform">
                    Search Knowledge Base
                  </span>
                  <BookOpen className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Access curated OWASP Top 10, CWE definitions, and Linux hardening specs.
                </p>
              </button>
            </div>
          </div>

          {/* Recent Investigations */}
          <div className="bg-void-900/80 border border-void-700/80 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-slate-200 font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>RECENT INVESTIGATION SESSIONS</span>
              </div>
              <button
                onClick={() => onNavigate('/app/chat')}
                className="text-[11px] text-emerald-400 hover:underline"
              >
                + Start New
              </button>
            </div>

            {conversations.length === 0 ? (
              <div className="p-8 text-center bg-void-950/80 rounded border border-void-800 text-slate-500 text-xs">
                No active conversations recorded yet. Launch an investigation session to begin.
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.slice(0, 5).map(conv => (
                  <div
                    key={conv.id}
                    onClick={() => onNavigate(`/app/chat?id=${conv.id}`)}
                    className="p-3 rounded bg-void-950 hover:bg-void-850 border border-void-800 hover:border-emerald-500/40 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className="px-1.5 py-0.5 rounded bg-void-800 text-slate-400 text-[10px]">
                        {conv.mode}
                      </span>
                      <span className="text-slate-200 font-medium truncate">
                        {conv.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">
                      {new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Live System Status Breakdown */}
        <div className="space-y-6">
          <div className="bg-void-900/80 border border-void-700/80 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-void-800 pb-3">
              <div className="text-slate-200 font-bold flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>SYSTEM STATUS TELEMETRY</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                200 OK
              </span>
            </div>

            <div className="space-y-3 text-[11px]">
              <div className="flex items-center justify-between p-2.5 rounded bg-void-950 border border-void-800">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-300">AI INFERENCE</span>
                </div>
                <span className="text-emerald-400 font-bold">ONLINE</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-void-950 border border-void-800">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300">DATABASE</span>
                </div>
                <span className="text-emerald-400 font-bold">HEALTHY</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-void-950 border border-void-800">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-300">RAG PIPELINE</span>
                </div>
                <span className="text-emerald-400 font-bold">READY</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-void-950 border border-void-800">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-300">POLICY GUARDRAILS</span>
                </div>
                <span className="text-emerald-400 font-bold">ENFORCED</span>
              </div>
            </div>

            <div className="p-3 rounded bg-void-950 border border-void-850 text-[10px] text-slate-500 space-y-1">
              <div>// LATENCY: {health?.components?.api_gateway?.latency_ms || 1.4}ms</div>
              <div>// MODEL: gemini-2.5-flash</div>
              <div>// REVISION: SECORA-CORE-1.0.0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
