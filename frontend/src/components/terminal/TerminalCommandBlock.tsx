import React, { useState } from 'react';
import { Copy, Check, Terminal, Download, ShieldAlert } from 'lucide-react';

interface TerminalCommandBlockProps {
  command: string;
  title?: string;
  notes?: string;
}

export const TerminalCommandBlock: React.FC<TerminalCommandBlockProps> = ({
  command,
  title = "TERMINAL",
  notes,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([command], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `secora_command_${Date.now()}.sh`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="my-4 font-mono text-xs rounded-lg overflow-hidden border border-emerald-500/30 bg-void-950 shadow-lg">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-void-900 border-b border-void-800 text-slate-300">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-bold tracking-wider text-emerald-400">
            ┌──[ {title.toUpperCase()} ]
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-void-800 text-slate-400">
            INFORMATIONAL ONLY
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded bg-void-850 hover:bg-void-800 border border-void-700 text-slate-300 hover:text-emerald-400 transition-colors"
            title="Copy command"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="text-[10px]">{copied ? 'COPIED' : 'COPY'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="p-1 rounded bg-void-850 hover:bg-void-800 border border-void-700 text-slate-400 hover:text-cyan-400 transition-colors"
            title="Download script"
          >
            <Download className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Command Body */}
      <div className="p-3 bg-void-950/90 text-emerald-300 overflow-x-auto selection:bg-emerald-500/30">
        <div className="flex items-start gap-2">
          <span className="text-slate-600 select-none">│ $</span>
          <code className="text-slate-100 flex-1 whitespace-pre-wrap">{command}</code>
        </div>
        <div className="text-slate-700 select-none text-[10px] mt-2">
          └──────────────────────────────────────────────
        </div>
      </div>

      {notes && (
        <div className="px-3 py-1.5 bg-void-900/60 border-t border-void-850 text-[10px] text-slate-400 flex items-center gap-1.5">
          <ShieldAlert className="w-3 h-3 text-amber-400 shrink-0" />
          <span>{notes}</span>
        </div>
      )}
    </div>
  );
};
