import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Conversation } from '../../types';
import {
  Plus,
  MessageSquare,
  BookOpen,
  FlaskConical,
  BarChart3,
  Settings,
  Shield,
  Pin,
  Trash2,
  Search,
  LayoutDashboard,
  Zap,
} from 'lucide-react';

interface AppSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  activeConversationId?: string;
  onSelectConversation?: (id: string) => void;
  onNewChat?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentPath,
  onNavigate,
  activeConversationId,
  onSelectConversation,
  onNewChat,
}) => {
  const { user, isAdmin } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchConversations = async () => {
    try {
      const data = await api.getConversations();
      setConversations(data);
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [activeConversationId]);

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Delete this investigation conversation?')) {
      try {
        await api.deleteConversation(id);
        setConversations(prev => prev.filter(c => c.id !== id));
        if (activeConversationId === id) {
          onNavigate('/app');
        }
      } catch (err) {
        alert('Failed to delete conversation');
      }
    }
  };

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedConversations = filteredConversations.filter(c => c.is_pinned);
  const recentConversations = filteredConversations.filter(c => !c.is_pinned);

  return (
    <aside className="w-64 bg-void-950 border-r border-void-700/60 flex flex-col h-[calc(100vh-37px)] font-mono text-xs select-none">
      {/* Top Action: New Chat */}
      <div className="p-3 border-b border-void-800/80 space-y-2">
        <button
          onClick={() => {
            if (onNewChat) onNewChat();
            else onNavigate('/app/chat');
          }}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-glow-emerald"
        >
          <Plus className="w-4 h-4" />
          <span>NEW INVESTIGATION</span>
        </button>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-void-900 border border-void-700 rounded pl-8 pr-2.5 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 text-[11px]"
          />
        </div>
      </div>

      {/* Center: Conversation Sessions List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {/* Pinned section */}
        {pinnedConversations.length > 0 && (
          <div>
            <div className="px-2 mb-1.5 text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <Pin className="w-2.5 h-2.5 text-cyan-400" />
              <span>FAVORITES</span>
            </div>
            <div className="space-y-0.5">
              {pinnedConversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => {
                    if (onSelectConversation) onSelectConversation(conv.id);
                    onNavigate(`/app/chat?id=${conv.id}`);
                  }}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer transition-colors ${
                    activeConversationId === conv.id
                      ? 'bg-void-850 text-cyan-300 border-l-2 border-cyan-400 font-semibold'
                      : 'text-slate-400 hover:bg-void-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className="w-3 h-3 shrink-0 text-cyan-400" />
                    <span className="truncate text-[11px]">{conv.title}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteConversation(e, conv.id)}
                    className="opacity-0 group-hover:opacity-100 hover:text-crimson-400 transition-opacity p-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent section */}
        <div>
          <div className="px-2 mb-1.5 text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <MessageSquare className="w-2.5 h-2.5 text-slate-400" />
            <span>RECENT SESSIONS</span>
          </div>

          {recentConversations.length === 0 ? (
            <div className="px-3 py-2 text-[11px] text-slate-600 italic">
              No recent investigations
            </div>
          ) : (
            <div className="space-y-0.5">
              {recentConversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => {
                    if (onSelectConversation) onSelectConversation(conv.id);
                    onNavigate(`/app/chat?id=${conv.id}`);
                  }}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer transition-colors ${
                    activeConversationId === conv.id
                      ? 'bg-void-850 text-emerald-400 border-l-2 border-emerald-400 font-semibold'
                      : 'text-slate-400 hover:bg-void-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[9px] px-1 py-0.2 rounded bg-void-800 text-slate-400 uppercase">
                      {conv.mode.slice(0, 3)}
                    </span>
                    <span className="truncate text-[11px]">{conv.title}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteConversation(e, conv.id)}
                    className="opacity-0 group-hover:opacity-100 hover:text-crimson-400 transition-opacity p-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Core Links */}
      <div className="p-2 border-t border-void-800/80 space-y-0.5">
        <button
          onClick={() => onNavigate('/app')}
          className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded transition-colors ${
            currentPath === '/app'
              ? 'bg-void-850 text-emerald-400 font-bold'
              : 'text-slate-400 hover:bg-void-900 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => onNavigate('/app/knowledge')}
          className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded transition-colors ${
            currentPath === '/app/knowledge'
              ? 'bg-void-850 text-emerald-400 font-bold'
              : 'text-slate-400 hover:bg-void-900 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>Knowledge Base</span>
        </button>

        <button
          onClick={() => onNavigate('/app/labs')}
          className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded transition-colors ${
            currentPath === '/app/labs'
              ? 'bg-void-850 text-emerald-400 font-bold'
              : 'text-slate-400 hover:bg-void-900 hover:text-slate-200'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
          <span>Security Labs</span>
        </button>

        <button
          onClick={() => onNavigate('/app/usage')}
          className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded transition-colors ${
            currentPath === '/app/usage'
              ? 'bg-void-850 text-emerald-400 font-bold'
              : 'text-slate-400 hover:bg-void-900 hover:text-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Token Usage</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => onNavigate('/admin')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded transition-colors ${
              currentPath.startsWith('/admin')
                ? 'bg-purple-900/30 text-purple-300 font-bold border border-purple-700/50'
                : 'text-purple-400 hover:bg-void-900 hover:text-purple-300'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Center</span>
          </button>
        )}
      </div>

      {/* Bottom User Pill */}
      {user && (
        <div className="p-3 border-t border-void-800/80 bg-void-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <div className="w-6 h-6 rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-[10px]">
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="truncate">
              <div className="text-[11px] text-slate-200 font-semibold truncate">
                {user.username}
              </div>
              <div className="text-[9px] text-slate-500 uppercase">
                {user.role} // {user.plan?.plan.replace('_', ' ') || 'FREE'}
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
