import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Conversation, Message, CybersecurityMode } from '../types';
import { AppSidebar } from '../components/layout/AppSidebar';
import { RightContextPanel } from '../components/layout/RightContextPanel';
import { TerminalCommandBlock } from '../components/terminal/TerminalCommandBlock';
import { CodeBlock } from '../components/terminal/CodeBlock';
import {
  Send,
  Terminal,
  Shield,
  Zap,
  Sparkles,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface ChatPageProps {
  onNavigate: (path: string) => void;
  initialConversationId?: string;
}

const MODES: Array<{ id: CybersecurityMode; label: string; desc: string }> = [
  { id: 'GENERAL', label: 'GENERAL', desc: 'Standard cybersecurity analyst peer' },
  { id: 'LEARNING', label: 'LEARNING', desc: 'Detailed concepts, root causes & analogies' },
  { id: 'DEFENSIVE', label: 'DEFENSIVE', desc: 'Detection, hardening, and mitigation focus' },
  { id: 'TROUBLESHOOTING', label: 'TROUBLESHOOTING', desc: 'Diagnose configs, TLS, network & errors' },
  { id: 'CTF', label: 'CTF / LAB', desc: 'Educational hints for capture-the-flag exercises' },
  { id: 'CODE_REVIEW', label: 'CODE REVIEW', desc: 'Source code audit for OWASP vulnerabilities' },
];

export const ChatPage: React.FC<ChatPageProps> = ({
  onNavigate,
  initialConversationId,
}) => {
  const { user } = useAuth();
  const [activeConvId, setActiveConvId] = useState<string | undefined>(initialConversationId);
  const [activeMode, setActiveMode] = useState<CybersecurityMode>('GENERAL');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  // Load conversation if activeConvId is present
  useEffect(() => {
    if (activeConvId) {
      loadConversation(activeConvId);
    } else {
      // Default welcome state
      setMessages([]);
    }
  }, [activeConvId]);

  const loadConversation = async (id: string) => {
    try {
      const conv = await api.getConversation(id);
      setActiveMode(conv.mode);
      setMessages(conv.messages || []);
    } catch {
      // Create new conversation
      setActiveConvId(undefined);
    }
  };

  const handleStartNewChat = async () => {
    setActiveConvId(undefined);
    setMessages([]);
    setInput('');
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userText = input.trim();
    setInput('');

    let convId = activeConvId;

    // If no conversation exists yet, create one
    if (!convId) {
      try {
        const titleSnippet = userText.length > 35 ? userText.slice(0, 32) + '...' : userText;
        const newConv = await api.createConversation(titleSnippet, activeMode);
        convId = newConv.id;
        setActiveConvId(convId);
      } catch (err) {
        alert('Failed to initialize investigation session.');
        return;
      }
    }

    // Append user message to UI immediately
    const userMsg: Message = {
      id: `temp-${Date.now()}`,
      conversation_id: convId,
      role: 'user',
      content: userText,
      token_count: Math.ceil(userText.length / 4),
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);
    setStreamingText('');

    // Phase 1 structured response simulation (interfaced for Phase 2/3 real LLM streaming)
    let aiResponseText = '';
    const lower = userText.toLowerCase();

    if (lower.includes('sql') || lower.includes('injection') || lower.includes('sqli')) {
      aiResponseText = `[SUMMARY]
SQL Injection occurs when untrusted user input directly modifies the query structure executed by the database.

[WHAT IS HAPPENING]
The application concatenates input parameters into an active SQL interpreter rather than isolating data from commands.

[WHY IT HAPPENS]
Dynamic string interpolation (e.g. \`f"SELECT * FROM users WHERE id = '{id}'"\`) allows an attacker to inject SQL syntax modifiers like quotes (\`'\`), boolean evaluations (\`OR 1=1\`), or comment specifiers (\`--\`).

[HOW TO VERIFY SAFELY]
1. Input a single tick \`'\` in test fields and observe for unhandled syntax error exceptions.
2. Observe if boolean conditionals alter application state in authorized testing.

[COMMANDS]
\`\`\`terminal
sqlmap -u "http://127.0.0.1:8000/api/items?cat=1" --batch --risk=1
\`\`\`

[HOW TO FIX]
Always enforce Parameterized Queries or Prepared Statements using an ORM like SQLAlchemy:
\`\`\`python
# SECURE: Bind parameters directly
query = text("SELECT id, username FROM users WHERE username = :uname")
user = db.execute(query, {"uname": username}).first()
\`\`\`

[SECURITY NOTES]
Never trust client-side validation alone. Ensure the database user runs with least-privilege principles.

[REFERENCES]
- OWASP Top 10 A03:2021 (Injection)
- CWE-89: Improper Neutralization of Special Elements used in an SQL Command`;
    } else if (lower.includes('xss') || lower.includes('script')) {
      aiResponseText = `[SUMMARY]
Cross-Site Scripting (XSS) allows attackers to inject malicious scripts into trusted web applications viewed by other users.

[ROOT CAUSE]
Untrusted data is returned in an HTTP response or rendered via dangerous DOM sinks (such as \`innerHTML\`) without context-aware output encoding.

[REMEDIATION PATTERN]
\`\`\`javascript
// VULNERABLE:
element.innerHTML = userProvidedBio;

// SECURE:
element.textContent = userProvidedBio;
\`\`\`

[DEFENSE-IN-DEPTH]
1. Implement a strict Content Security Policy (CSP):
\`\`\`http
Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none';
\`\`\`
2. Set \`HttpOnly\` and \`SameSite=Strict\` on authentication session cookies.

[REFERENCES]
- OWASP Top 10 A03:2021
- CWE-79: Improper Neutralization of Input During Web Page Generation`;
    } else {
      aiResponseText = `[SUMMARY]
Grounded cybersecurity analysis for investigation: "${userText}".

[ANALYSIS & SECURITY POSTURE]
In ${activeMode} mode, Secora evaluates target behavior, privilege boundaries, and defensive hardening parameters.

[RECOMMENDED PROCEDURE]
1. Inspect server logs and error codes for anomalous payloads.
2. Check network boundary filters and firewall rules.
3. Validate least-privilege role assignments for service accounts.

[COMMANDS]
\`\`\`terminal
nmap -sV -sC -p- 127.0.0.1 -oN security_audit.txt
\`\`\`

[DEFENSIVE HARDENING]
Ensure all external inputs pass schema validation and enforce rate-limiting boundaries.`;
    }

    // Stream token-by-token smoothly
    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx += 8;
      if (currentIdx >= aiResponseText.length) {
        clearInterval(interval);
        setStreamingText('');
        setIsStreaming(false);

        // Add assistant message to messages list
        const assistantMsg: Message = {
          id: `msg-${Date.now()}`,
          conversation_id: convId!,
          role: 'assistant',
          content: aiResponseText,
          token_count: Math.ceil(aiResponseText.length / 4),
          security_metadata: {
            topic: 'Cybersecurity Operations',
            category: 'Defensive Engineering',
            difficulty: 'Intermediate',
            mode: activeMode,
            sources: ['OWASP Top 10', 'CWE', 'MITRE ATT&CK', 'Secora Core'],
          },
          created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        setStreamingText(aiResponseText.slice(0, currentIdx));
      }
    }, 25);
  };

  // Helper to render markdown content with Terminal & Code blocks
  const renderMessageContent = (content: string) => {
    // Check for terminal blocks
    const terminalMatch = content.match(/```terminal\n([\s\S]*?)```/);
    const pythonMatch = content.match(/```python\n([\s\S]*?)```/);
    const jsMatch = content.match(/```javascript\n([\s\S]*?)```/);

    const parts = content.split(/```(?:terminal|python|javascript|http)\n[\s\S]*?```/);

    return (
      <div className="space-y-3 leading-relaxed text-xs">
        {parts.map((part, index) => (
          <div key={index}>
            <div className="whitespace-pre-wrap">{part.trim()}</div>
            {index === 0 && terminalMatch && (
              <TerminalCommandBlock
                command={terminalMatch[1].trim()}
                title="DEFENSIVE SCAN AUDIT"
                notes="Authorized testing environments only."
              />
            )}
            {index === 0 && pythonMatch && (
              <CodeBlock
                language="python"
                filename="secure_implementation.py"
                code={pythonMatch[1].trim()}
              />
            )}
            {index === 0 && jsMatch && (
              <CodeBlock
                language="javascript"
                filename="defense.js"
                code={jsMatch[1].trim()}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-37px)] bg-void-950 font-mono text-xs overflow-hidden">
      {/* Left Sidebar */}
      <AppSidebar
        currentPath="/app/chat"
        onNavigate={onNavigate}
        activeConversationId={activeConvId}
        onSelectConversation={id => setActiveConvId(id)}
        onNewChat={handleStartNewChat}
      />

      {/* Main Chat Core */}
      <main className="flex-1 flex flex-col h-full bg-void-950 min-w-0">
        {/* Top Chat Bar: Cybersecurity Mode Selector */}
        <div className="px-4 py-2.5 bg-void-900/90 border-b border-void-700/60 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-bold text-slate-300">ACTIVE MODE:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => setActiveMode(m.id)}
                title={m.desc}
                className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider transition-all uppercase whitespace-nowrap ${
                  activeMode === m.id
                    ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald font-extrabold'
                    : 'bg-void-950 hover:bg-void-850 text-slate-400 border border-void-700/80 hover:text-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-500 shrink-0">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>RAG CONNECTED</span>
          </div>
        </div>

        {/* Message Stream Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.length === 0 && !isStreaming ? (
            <div className="max-w-2xl mx-auto my-12 text-center space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-void-900 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-glow-emerald">
                <Terminal className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-100">
                  SECORA SECURITY INTELLIGENCE ASSISTANT
                </h2>
                <p className="text-slate-400 text-xs leading-relaxed max-w-lg mx-auto">
                  Ask ethical hacking, networking, vulnerability analysis, or defensive remediation queries. Mode set to{' '}
                  <span className="text-emerald-400 font-bold">{activeMode}</span>.
                </p>
              </div>

              {/* Sample Starters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left pt-4">
                {[
                  "How do I identify SQL injection in my test application?",
                  "Explain DOM-based XSS vs Reflected XSS",
                  "Why is my Nginx reverse proxy returning 502 Bad Gateway?",
                  "How does Linux SUID privilege escalation work?",
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(sample);
                    }}
                    className="p-3 rounded bg-void-900 hover:bg-void-850 border border-void-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 text-[11px] transition-all text-left flex items-start gap-2"
                  >
                    <span className="text-emerald-400 select-none">$</span>
                    <span>{sample}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role !== 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-void-900 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <Shield className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-xl p-4 ${
                      msg.role === 'user'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-slate-100 ml-auto'
                        : 'bg-void-900/90 border border-void-700/80 text-slate-200 shadow-xl'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2 border-b border-void-800/80 pb-1.5 font-bold">
                      <span className="text-emerald-400 uppercase tracking-wider">
                        {msg.role === 'user' ? (user?.username || 'ANALYST') : 'SECORA AI ASSISTANT'}
                      </span>
                      <span>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {renderMessageContent(msg.content)}
                  </div>
                </div>
              ))}

              {/* Streaming AI In-Progress Indicator & Token Stream */}
              {isStreaming && (
                <div className="flex gap-3.5 justify-start">
                  <div className="w-8 h-8 rounded-lg bg-void-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 animate-pulse">
                    <Sparkles className="w-4 h-4" />
                  </div>

                  <div className="max-w-[85%] rounded-xl p-4 bg-void-900/90 border border-cyan-500/30 text-slate-200 shadow-xl space-y-3">
                    <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-bold border-b border-void-800/80 pb-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                      <span>AI ANALYZING... // REASONING CORE ENGAGED</span>
                    </div>

                    {streamingText ? (
                      renderMessageContent(streamingText)
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse"></span>
                        <span>Retrieving threat knowledge from vector store...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Input Area */}
        <div className="p-4 bg-void-950 border-t border-void-700/60">
          <form
            onSubmit={handleSendMessage}
            className="max-w-4xl mx-auto relative rounded-xl bg-void-900 border border-void-700 focus-within:border-emerald-500/70 transition-all shadow-xl"
          >
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={2}
              placeholder="Query security posture, ask for mitigation code, explain CTF concepts... (Press Enter to transmit)"
              className="w-full bg-transparent px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none resize-none text-xs font-mono"
            />

            <div className="flex items-center justify-between px-3 py-2 border-t border-void-800/60 text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-void-800 text-slate-400">
                  MODE: {activeMode}
                </span>
                <span className="hidden sm:inline text-slate-500">Shift + Enter for newline</span>
              </div>

              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-slate-950 font-bold transition-all shadow-glow-emerald"
              >
                <span>TRANSMIT</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Right Security Context Panel */}
      <RightContextPanel mode={activeMode} />
    </div>
  );
};
