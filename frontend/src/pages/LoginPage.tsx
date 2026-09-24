import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Terminal, Lock, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please provide both username/email and password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(identifier, password);
      onNavigate('/app');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (user: string, pass: string) => {
    setIdentifier(user);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-6 cyber-grid font-mono">
      <div className="w-full max-w-md bg-void-950/95 border border-emerald-500/30 rounded-xl p-8 shadow-2xl backdrop-blur-md space-y-6">
        {/* Terminal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-void-900 border border-emerald-500/40 text-emerald-400 mb-2 shadow-glow-emerald">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-wider">
            AUTHENTICATE CONSOLE
          </h2>
          <p className="text-xs text-slate-400">
            SECORA Cyber Operations & Intelligence Access
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded bg-crimson-500/10 border border-crimson-500/40 text-crimson-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block uppercase text-[11px]">
              USERNAME OR EMAIL:
            </label>
            <input
              type="text"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="e.g. cyber_analyst or analyst@secora.internal"
              className="w-full bg-void-900 border border-void-700 rounded px-3 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block uppercase text-[11px]">
              PASSWORD:
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-void-900 border border-void-700 rounded px-3 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-xs"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold transition-all shadow-glow-emerald flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span>VERIFYING CREDENTIALS...</span>
            ) : (
              <>
                <Terminal className="w-4 h-4" />
                <span>AUTHENTICATE SESSION</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="pt-4 border-t border-void-800 space-y-2">
          <div className="text-[10px] text-slate-500 uppercase font-bold text-center">
            QUICK ACCESS DEMO ROLES:
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickLogin('cyber_analyst', 'Analyst@Secora2026!')}
              className="px-2.5 py-1.5 rounded bg-void-900 hover:bg-void-850 border border-emerald-500/20 text-emerald-400 hover:border-emerald-500/50 transition-colors text-left flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 shrink-0" />
              <div className="truncate">
                <div className="font-bold">Analyst Role</div>
                <div className="text-[9px] text-slate-500">Free Tier (100k)</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('secora_admin', 'Admin@Secora2026!')}
              className="px-2.5 py-1.5 rounded bg-void-900 hover:bg-void-850 border border-purple-500/20 text-purple-300 hover:border-purple-500/50 transition-colors text-left flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <div className="truncate">
                <div className="font-bold">Admin Role</div>
                <div className="text-[9px] text-slate-500">Root System</div>
              </div>
            </button>
          </div>
        </div>

        {/* Register prompt */}
        <div className="text-center text-xs text-slate-400">
          Need a security clearance?{' '}
          <button
            onClick={() => onNavigate('/register')}
            className="text-emerald-400 font-semibold hover:underline"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};
