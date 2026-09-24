import React, { useState } from 'react';
import { Copy, Check, Download, Maximize2, Minimize2, Code2 } from 'lucide-react';

interface CodeBlockProps {
  language: string;
  code: string;
  filename?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, code, filename }) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'typescript' ? 'ts' : 'txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `secora_code_${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isLong = code.split('\n').length > 18;

  return (
    <div className="my-4 font-mono text-xs rounded-lg overflow-hidden border border-void-700/80 bg-void-950 shadow-md">
      {/* Code Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-void-900 border-b border-void-800 text-slate-300">
        <div className="flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-semibold text-slate-200">
            {filename || language.toUpperCase()}
          </span>
          <span className="text-[10px] text-slate-500 uppercase">
            [{language}]
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 px-2 py-1 rounded bg-void-850 hover:bg-void-800 border border-void-700 text-slate-400 hover:text-slate-200 transition-colors"
              title={expanded ? "Collapse snippet" : "Expand snippet"}
            >
              {expanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              <span className="text-[10px]">{expanded ? 'COLLAPSE' : 'EXPAND'}</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded bg-void-850 hover:bg-void-800 border border-void-700 text-slate-300 hover:text-emerald-400 transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="text-[10px]">{copied ? 'COPIED' : 'COPY'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-1 rounded bg-void-850 hover:bg-void-800 border border-void-700 text-slate-400 hover:text-cyan-400 transition-colors"
            title="Download file"
          >
            <Download className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Code Body */}
      <div
        className={`p-3.5 overflow-x-auto text-slate-200 transition-all ${
          !expanded && isLong ? 'max-h-72 overflow-y-hidden relative' : ''
        }`}
      >
        <pre className="text-[11px] leading-relaxed font-mono">
          <code>{code}</code>
        </pre>
        {!expanded && isLong && (
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-void-950 to-transparent flex items-end justify-center pb-2">
            <button
              onClick={() => setExpanded(true)}
              className="px-3 py-1 rounded bg-void-900/90 border border-void-700 text-[10px] text-cyan-400 hover:text-cyan-300 shadow"
            >
              Click to Expand Full Snippet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
