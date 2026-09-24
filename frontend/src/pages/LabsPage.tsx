import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Lab } from '../types';
import { FlaskConical, CheckCircle2, HelpCircle, Code2, ArrowRight, ShieldAlert, Award } from 'lucide-react';
import { TerminalCommandBlock } from '../components/terminal/TerminalCommandBlock';

export const LabsPage: React.FC = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [completedLabs, setCompletedLabs] = useState<string[]>([]);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const data = await api.getLabs();
        setLabs(data);
        if (data.length > 0) {
          loadLabDetail(data[0].slug);
        }
      } catch {
        // Fallback
      }
    };
    fetchLabs();
  }, []);

  const loadLabDetail = async (slug: string) => {
    try {
      const full = await api.getLab(slug);
      setSelectedLab(full);
      setShowHint(false);
      setShowSolution(false);
    } catch {
      // Fallback
    }
  };

  const handleToggleComplete = (slug: string) => {
    if (completedLabs.includes(slug)) {
      setCompletedLabs(prev => prev.filter(s => s !== slug));
    } else {
      setCompletedLabs(prev => [...prev, slug]);
    }
  };

  const objectives = selectedLab?.learning_objectives ? JSON.parse(selectedLab.learning_objectives) : [];
  const hints = selectedLab?.hints ? JSON.parse(selectedLab.hints) : [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-mono text-xs text-slate-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-void-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-[11px]">
            <FlaskConical className="w-4 h-4" />
            <span>CONTROLLED EDUCATIONAL ENVIRONMENTS</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 font-mono mt-1">
            INTERACTIVE CYBERSECURITY LABS
          </h1>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>COMPLETED: <strong className="text-emerald-400">{completedLabs.length}</strong> / {labs.length}</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lab List */}
        <div className="space-y-3 lg:col-span-1">
          {labs.map(l => {
            const isDone = completedLabs.includes(l.slug);
            const isSelected = selectedLab?.slug === l.slug;
            return (
              <div
                key={l.id}
                onClick={() => loadLabDetail(l.slug)}
                className={`p-4 rounded-lg cursor-pointer transition-all border text-left space-y-2.5 ${
                  isSelected
                    ? 'bg-void-900 border-amber-500/60 shadow-glow-emerald'
                    : 'bg-void-950 border-void-800 hover:border-void-700 hover:bg-void-900/60'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                    l.difficulty === 'BEGINNER' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    l.difficulty === 'INTERMEDIATE' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                    'bg-crimson-500/10 text-crimson-400 border border-crimson-500/30'
                  }`}>
                    {l.difficulty}
                  </span>
                  {isDone && (
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>COMPLETED</span>
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-100 text-xs">{l.title}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {l.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Selected Lab Workbench */}
        <div className="lg:col-span-2 bg-void-900/90 border border-void-700/80 rounded-xl p-6 space-y-6">
          {selectedLab ? (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-void-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold text-[10px] uppercase">
                      {selectedLab.category}
                    </span>
                    <span className="text-slate-500">//</span>
                    <span className="text-slate-400 text-[10px]">{selectedLab.difficulty}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-100 font-mono">
                    {selectedLab.title}
                  </h2>
                </div>

                <button
                  onClick={() => handleToggleComplete(selectedLab.slug)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold text-xs transition-all ${
                    completedLabs.includes(selectedLab.slug)
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-void-950 border border-void-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{completedLabs.includes(selectedLab.slug) ? 'COMPLETED' : 'MARK COMPLETE'}</span>
                </button>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-slate-200 font-bold uppercase text-[11px] text-emerald-400">
                  // SCENARIO DESCRIPTION
                </h4>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {selectedLab.description}
                </p>
              </div>

              {/* Objectives */}
              {objectives.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-slate-200 font-bold uppercase text-[11px] text-cyan-400">
                    // LEARNING OBJECTIVES
                  </h4>
                  <ul className="space-y-1.5">
                    {objectives.map((obj: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Instructions */}
              <div className="space-y-2">
                <h4 className="text-slate-200 font-bold uppercase text-[11px] text-amber-400">
                  // INSTRUCTIONS
                </h4>
                <div className="p-4 rounded bg-void-950 border border-void-800 text-slate-300 text-xs leading-relaxed">
                  {selectedLab.instructions}
                </div>
              </div>

              {/* Hints & Solutions */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-void-950 border border-void-700 text-slate-300 hover:border-amber-500/40 text-[11px] transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{showHint ? 'HIDE HINTS' : 'VIEW HINTS'}</span>
                  </button>

                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-void-950 border border-void-700 text-slate-300 hover:border-emerald-500/40 text-[11px] transition-colors"
                  >
                    <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{showSolution ? 'HIDE SOLUTION' : 'REVEAL SOLUTION'}</span>
                  </button>
                </div>

                {showHint && hints.length > 0 && (
                  <div className="p-3.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1 text-xs">
                    <div className="font-bold text-[11px]">HINTS:</div>
                    {hints.map((h: string, i: number) => (
                      <div key={i}>• {h}</div>
                    ))}
                  </div>
                )}

                {showSolution && selectedLab.solution && (
                  <div className="space-y-1.5">
                    <div className="font-bold text-[11px] text-emerald-400">VERIFIED SOLUTION:</div>
                    <TerminalCommandBlock
                      command={selectedLab.solution}
                      title="LAB SOLUTION CODE"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              Select a lab challenge from the left to start hands-on exploration.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
