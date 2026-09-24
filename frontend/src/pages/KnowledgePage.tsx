import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { KnowledgeDocument } from '../types';
import { BookOpen, Search, Filter, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react';

export const KnowledgePage: React.FC = () => {
  const [docs, setDocs] = useState<KnowledgeDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await api.getKnowledge();
        setDocs(data);
        if (data.length > 0) setSelectedDoc(data[0]);
      } catch {
        // Fallback
      }
    };
    fetchDocs();
  }, []);

  const categories = ['ALL', 'Web Security', 'Linux Security', 'Cloud Security'];

  const filteredDocs = docs.filter(doc => {
    const matchesCategory = selectedCategory === 'ALL' || doc.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-mono text-xs text-slate-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-void-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-[11px]">
            <BookOpen className="w-4 h-4" />
            <span>GROUNDED DEFENSIVE TAXONOMY</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 font-mono mt-1">
            CURATED CYBERSECURITY KNOWLEDGE BASE
          </h1>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search OWASP, CWE, Linux..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-void-900 border border-void-700 rounded pl-9 pr-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded text-[11px] font-bold transition-all uppercase whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-glow-emerald'
                : 'bg-void-900 text-slate-400 border border-void-800 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Two Column Layout: Document List & Document Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document List */}
        <div className="space-y-3 lg:col-span-1">
          {filteredDocs.length === 0 ? (
            <div className="p-8 bg-void-900/60 rounded border border-void-800 text-center text-slate-500">
              No matching knowledge documents found.
            </div>
          ) : (
            filteredDocs.map(doc => (
              <div
                key={doc.id}
                onClick={async () => {
                  try {
                    const full = await api.getKnowledge(doc.category);
                    const match = full.find(d => d.id === doc.id);
                    setSelectedDoc(match || doc);
                  } catch {
                    setSelectedDoc(doc);
                  }
                }}
                className={`p-4 rounded-lg cursor-pointer transition-all border text-left space-y-2 ${
                  selectedDoc?.id === doc.id
                    ? 'bg-void-900 border-emerald-500/60 shadow-glow-emerald'
                    : 'bg-void-950 border-void-800 hover:border-void-700 hover:bg-void-900/60'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-void-850 text-cyan-400 font-bold border border-void-700">
                    {doc.source}
                  </span>
                  <span className="text-slate-500">{doc.category}</span>
                </div>
                <h3 className="font-bold text-slate-200 text-xs leading-snug">
                  {doc.title}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {doc.summary}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Selected Document Full Viewer */}
        <div className="lg:col-span-2 bg-void-900/90 border border-void-700/80 rounded-xl p-6 space-y-4">
          {selectedDoc ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-void-800 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                      {selectedDoc.source} // {selectedDoc.version}
                    </span>
                    <span className="text-slate-400 text-[11px]">{selectedDoc.category}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-100 font-mono">
                    {selectedDoc.title}
                  </h2>
                </div>

                {selectedDoc.url && (
                  <a
                    href={selectedDoc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-void-850 hover:bg-void-800 border border-void-700 text-cyan-400 hover:text-cyan-300 text-[11px] transition-colors"
                  >
                    <span>Upstream Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Document Text / Markdown Body */}
              <div className="bg-void-950/80 rounded-lg p-5 border border-void-800 text-slate-300 leading-relaxed space-y-3 whitespace-pre-wrap text-xs">
                {selectedDoc.content || selectedDoc.summary}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              Select a document from the left list to review its complete taxonomy specifications.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
