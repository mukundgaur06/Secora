import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Terminal, AlertCircle, ArrowRight, Check } from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !username || !password) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await register(email, username, password);
      onNavigate('/app');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
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
            REGISTER CLEARANCE
          </h2>
          <p className="text-xs text-slate-400">
            Provision Instant Access & 100,000 Monthly Tokens
          </p>
        </div>

        {/* Plan Perks */}
        <div className="p-3 rounded bg-void-900 border border-void-800 space-y-1.5 text-[11px] text-slate-300">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Check className="w-3.5 h-3.5" />
            <span>FREE ANALYST TIER INCLUDED</span>
          </div>
          <div className="pl-5 text-slate-400 space-y-0.5 text-[10px]">
            <div>• 100,000 monthly AI tokens</div>
            <div>• OWASP & MITRE RAG knowledge base access</div>
            <div>• Hands-on cybersecurity labs</div>
          </div>
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
              EMAIL ADDRESS:
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="operator@security.internal"
              className="w-full bg-void-900 border border-void-700 rounded px-3 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block uppercase text-[11px]">
              OPERATOR HANDLE (USERNAME):
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. sentinel_42"
              className="w-full bg-void-900 border border-void-700 rounded px-3 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block uppercase text-[11px]">
              PASSPHRASE (MIN 8 CHARS):
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
              <span>PROVISIONING ACCOUNT...</span>
            ) : (
              <>
                <Terminal className="w-4 h-4" />
                <span>CREATE CLEARANCE</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Login prompt */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-void-800">
          Already possess clearance?{' '}
          <button
            onClick={() => onNavigate('/login')}
            className="text-emerald-400 font-semibold hover:underline"
          >
            Authenticate here
          </button>
        </div>
      </div>
    </div>
  );
};
