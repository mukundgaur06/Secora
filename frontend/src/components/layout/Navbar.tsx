import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Terminal, Zap, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-void-950/90 border-b border-void-700/60 backdrop-blur-md px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-void-900 border border-emerald-500/30 group-hover:border-emerald-500/80 group-hover:shadow-glow-emerald transition-all">
            <Shield className="w-5 h-5 text-emerald-400 group-hover:scale-105 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-extrabold tracking-wider text-lg text-slate-100 group-hover:text-emerald-400 transition-colors">
                SECORA
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold uppercase">
                CYBER.OS
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500 hidden sm:block">
              AI Security Intelligence & Defense
            </p>
          </div>
        </button>

        {/* Public Navigation Links */}
        <div className="hidden md:flex items-center gap-6 font-mono text-xs text-slate-300">
          <button
            onClick={() => onNavigate('/features')}
            className={`hover:text-emerald-400 transition-colors ${currentPath === '/features' ? 'text-emerald-400 font-bold' : ''}`}
          >
            // FEATURES
          </button>
          <button
            onClick={() => onNavigate('/security')}
            className={`hover:text-emerald-400 transition-colors ${currentPath === '/security' ? 'text-emerald-400 font-bold' : ''}`}
          >
            // ARCHITECTURE
          </button>
          <button
            onClick={() => onNavigate('/docs')}
            className={`hover:text-emerald-400 transition-colors ${currentPath === '/docs' ? 'text-emerald-400 font-bold' : ''}`}
          >
            // DOCS
          </button>
          <button
            onClick={() => onNavigate('/pricing')}
            className={`hover:text-emerald-400 transition-colors ${currentPath === '/pricing' ? 'text-emerald-400 font-bold' : ''}`}
          >
            // PRICING
          </button>
        </div>

        {/* Actions / Auth States */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {/* Token Pill */}
              <div 
                onClick={() => onNavigate('/app/usage')}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-void-900 border border-void-700 hover:border-cyan-500/40 text-xs font-mono text-slate-300 cursor-pointer transition-all"
                title="View Token Dashboard"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">TOKENS:</span>
                <span className="text-cyan-300 font-bold">
                  {user.plan ? `${(user.plan.tokens_remaining / 1000).toFixed(1)}k` : '100k'}
                </span>
              </div>

              {/* Console App Link */}
              <button
                onClick={() => onNavigate('/app')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold transition-all ${
                  currentPath.startsWith('/app')
                    ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald font-bold'
                    : 'bg-void-900 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>CONSOLE</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => onNavigate('/admin')}
                  className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono border transition-all ${
                    currentPath.startsWith('/admin')
                      ? 'bg-cyber-purple/20 border-cyber-purple text-purple-300'
                      : 'border-void-700 text-slate-400 hover:text-purple-300 hover:border-cyber-purple/50'
                  }`}
                >
                  <LayoutDashboard className="w-3 h-3" />
                  <span>ADMIN</span>
                </button>
              )}

              {/* User Avatar & Logout */}
              <div className="flex items-center gap-2 pl-2 border-l border-void-700">
                <span className="hidden xl:inline text-xs font-mono text-slate-400">
                  {user.username}
                </span>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-1.5 rounded text-slate-400 hover:text-crimson-400 hover:bg-void-850 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('/login')}
                className="px-3 py-1.5 rounded text-xs font-mono text-slate-300 hover:text-emerald-400 transition-colors"
              >
                SIGN IN
              </button>
              <button
                onClick={() => onNavigate('/register')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold shadow-glow-emerald transition-all"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>ENTER CONSOLE</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
