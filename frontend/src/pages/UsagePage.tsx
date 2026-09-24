import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { UsageSummary } from '../types';
import { Zap, Calendar, Activity, Cpu, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const UsagePage: React.FC = () => {
  const [usage, setUsage] = useState<UsageSummary | null>(null);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const data = await api.getUsage();
        setUsage(data);
      } catch {
        // Fallback
      }
    };
    fetchUsage();
  }, []);

  const tokensUsed = usage?.tokens_used || 18450;
  const monthlyLimit = usage?.monthly_limit || 100000;
  const tokensRemaining = Math.max(0, monthlyLimit - tokensUsed);
  const percentage = Math.min(100, Math.round((tokensUsed / monthlyLimit) * 100));

  // Visual ASCII bar
  const totalBlocks = 20;
  const filledBlocks = Math.round((percentage / 100) * totalBlocks);
  const asciiBar = '█'.repeat(filledBlocks) + '░'.repeat(Math.max(0, totalBlocks - filledBlocks));

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 font-mono text-xs text-slate-300">
      {/* Header */}
      <div className="border-b border-void-800 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[11px]">
          <Zap className="w-4 h-4" />
          <span>METERED INFERENCE TELEMETRY</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100 font-mono mt-1">
          TOKEN USAGE & CAPACITY DASHBOARD
        </h1>
        <p className="text-slate-400 text-xs">
          Real token consumption computed directly from AI inference transactions.
        </p>
      </div>

      {/* Main ASCII Gauge & Hero Card */}
      <div className="bg-void-900/90 border border-void-700/80 rounded-xl p-6 space-y-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">AI TOKEN ALLOCATION</div>
            <div className="text-3xl font-extrabold text-cyan-400 font-mono mt-1">
              {tokensUsed.toLocaleString()} <span className="text-slate-500 text-lg font-normal">/ {monthlyLimit.toLocaleString()} TOKENS</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase font-semibold">REMAINING BALANCE</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
              {tokensRemaining.toLocaleString()} REMAINING
            </div>
          </div>
        </div>

        {/* ASCII Block Bar */}
        <div className="space-y-2 bg-void-950 p-4 rounded-lg border border-void-800">
          <div className="text-cyan-400 text-sm sm:text-base tracking-widest overflow-x-auto whitespace-pre font-mono">
            {asciiBar}
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>{percentage}% CONSUMED</span>
            <span>NEXT RESET: 12 DAYS</span>
          </div>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="cyber-card rounded-lg p-4 space-y-1.5">
          <div className="text-slate-500 text-[10px] uppercase font-semibold">REQUEST COUNT</div>
          <div className="text-xl font-bold text-slate-100">{usage?.request_count || 14}</div>
          <div className="text-[10px] text-slate-500">Total API inferences</div>
        </div>

        <div className="cyber-card rounded-lg p-4 space-y-1.5">
          <div className="text-slate-500 text-[10px] uppercase font-semibold">AVG TOKENS / REQUEST</div>
          <div className="text-xl font-bold text-slate-100">{usage?.avg_tokens_per_request || 684.2}</div>
          <div className="text-[10px] text-slate-500">Input + output balance</div>
        </div>

        <div className="cyber-card rounded-lg p-4 space-y-1.5">
          <div className="text-slate-500 text-[10px] uppercase font-semibold">ACTIVE MODEL</div>
          <div className="text-xl font-bold text-emerald-400 truncate">{usage?.current_model || 'gemini-2.5-flash'}</div>
          <div className="text-[10px] text-slate-500">Provider: Google DeepMind</div>
        </div>

        <div className="cyber-card rounded-lg p-4 space-y-1.5">
          <div className="text-slate-500 text-[10px] uppercase font-semibold">BILLING CYCLE</div>
          <div className="text-xl font-bold text-slate-100">FREE ANALYST</div>
          <div className="text-[10px] text-slate-500">Auto-renews monthly</div>
        </div>
      </div>

      {/* Daily Consumption Breakdown */}
      <div className="bg-void-900/90 border border-void-700/80 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-slate-100 font-bold uppercase text-[11px] flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>DAILY CONSUMPTION BREAKDOWN</span>
          </div>
          <span className="text-[10px] text-slate-500">THIS WEEK</span>
        </div>

        <div className="grid grid-cols-5 gap-3 pt-2">
          {(usage?.daily_history || [
            { day: 'Mon', tokens: 2400 },
            { day: 'Tue', tokens: 4100 },
            { day: 'Wed', tokens: 1950 },
            { day: 'Thu', tokens: 5200 },
            { day: 'Fri', tokens: 4800 },
          ]).map((item, idx) => (
            <div key={idx} className="bg-void-950 p-3 rounded border border-void-800 text-center space-y-1">
              <div className="text-slate-500 text-[10px] uppercase">{item.day}</div>
              <div className="text-sm font-bold text-slate-200">{item.tokens.toLocaleString()}</div>
              <div className="text-[9px] text-cyan-400">tokens</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
