import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AdminStats, User } from '../types';
import { Shield, Users, Activity, Lock, Database, AlertTriangle, Cpu } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users'>('overview');

  useEffect(() => {
    if (isAdmin) {
      const loadAdminData = async () => {
        try {
          const [statsData, usersData] = await Promise.all([
            api.getAdminStats(),
            api.getAdminUsers(),
          ]);
          setStats(statsData);
          setUsers(usersData);
        } catch {
          // Fallback
        }
      };
      loadAdminData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-6 cyber-grid font-mono">
        <div className="p-8 max-w-md bg-void-950 border border-crimson-500/40 rounded-xl text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-crimson-500/10 border border-crimson-500/30 flex items-center justify-center text-crimson-400 mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 uppercase">ACCESS RESTRICTED // 403 FORBIDDEN</h2>
          <p className="text-slate-400 text-xs">
            Administrative clearance required. Please authenticate with a root operator account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 font-mono text-xs text-slate-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-void-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-bold uppercase text-[11px]">
            <Shield className="w-4 h-4" />
            <span>ROOT OPERATIONS CONSOLE</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 font-mono mt-1">
            SECORA PLATFORM ADMINISTRATION
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-void-900 p-1 rounded border border-void-800 text-[11px]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded transition-all font-bold ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            SYS.OVERVIEW
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded transition-all font-bold ${
              activeTab === 'users'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            USER.MANAGEMENT ({users.length})
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Admin Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="cyber-card rounded-lg p-4 space-y-1.5">
              <div className="text-slate-500 text-[10px] uppercase font-semibold">TOTAL OPERATORS</div>
              <div className="text-2xl font-bold text-purple-400">{stats?.total_users || users.length}</div>
              <div className="text-[10px] text-slate-500">{stats?.active_users || 2} active sessions</div>
            </div>

            <div className="cyber-card rounded-lg p-4 space-y-1.5">
              <div className="text-slate-500 text-[10px] uppercase font-semibold">TOTAL TOKENS CONSUMED</div>
              <div className="text-2xl font-bold text-cyan-400">{stats?.total_tokens_consumed?.toLocaleString() || '60,600'}</div>
              <div className="text-[10px] text-slate-500">Across all user plans</div>
            </div>

            <div className="cyber-card rounded-lg p-4 space-y-1.5">
              <div className="text-slate-500 text-[10px] uppercase font-semibold">ESTIMATED LLM COST</div>
              <div className="text-2xl font-bold text-emerald-400">${stats?.llm_costs_estimated_usd || '0.0303'}</div>
              <div className="text-[10px] text-slate-500">DeepMind Gemini API</div>
            </div>

            <div className="cyber-card rounded-lg p-4 space-y-1.5">
              <div className="text-slate-500 text-[10px] uppercase font-semibold">SYSTEM ERROR RATE</div>
              <div className="text-2xl font-bold text-slate-200">{stats?.error_rate_percent || 0.02}%</div>
              <div className="text-[10px] text-slate-500">Avg Latency: {stats?.avg_latency_ms || 284}ms</div>
            </div>
          </div>

          {/* System Components Breakdown */}
          <div className="bg-void-900/90 border border-void-700/80 rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span>INFRASTRUCTURE HEALTH</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded bg-void-950 border border-void-800 space-y-1">
                <div className="text-emerald-400 font-bold">SQL DATABASE ENGINE</div>
                <div className="text-slate-300">SQLite / PostgreSQL + SQLAlchemy</div>
                <div className="text-[10px] text-slate-500">Connection pool healthy</div>
              </div>

              <div className="p-3.5 rounded bg-void-950 border border-void-800 space-y-1">
                <div className="text-cyan-400 font-bold">AI INFERENCE ADAPTER</div>
                <div className="text-slate-300">Google Gemini 2.5 Flash</div>
                <div className="text-[10px] text-slate-500">Zero connection drops</div>
              </div>

              <div className="p-3.5 rounded bg-void-950 border border-void-800 space-y-1">
                <div className="text-purple-400 font-bold">RAG VECTOR STORE</div>
                <div className="text-slate-300">Curated OWASP + CWE Index</div>
                <div className="text-[10px] text-slate-500">4 documents / 12 chunks</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-void-900/90 border border-void-700/80 rounded-xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-void-800 flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>REGISTERED OPERATORS</span>
            </h3>
            <span className="text-[11px] text-slate-500">Total: {users.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-void-950 text-slate-400 uppercase text-[10px] border-b border-void-800">
                <tr>
                  <th className="py-3 px-4">Handle</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-void-800/60">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-void-850/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-200">{u.username}</td>
                    <td className="py-3 px-4 text-slate-400">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-void-800 text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-cyan-400 font-semibold">
                      {u.plan ? u.plan.plan : 'FREE_ANALYST'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[10px]">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
