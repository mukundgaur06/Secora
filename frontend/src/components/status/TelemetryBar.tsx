import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { HealthStatus } from '../../types';
import { ShieldCheck, Cpu, Database, Network } from 'lucide-react';

export const TelemetryBar: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchHealth = async () => {
      try {
        const data = await api.getHealth();
        if (isMounted) setHealth(data);
      } catch {
        // Handled silently
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const isDbOk = health?.components?.database?.status === 'healthy';
  const isAiOk = health?.components?.ai_engine?.status === 'healthy' || health?.components?.ai_engine?.status === 'standby';
  const isRagOk = health?.components?.rag_core?.status === 'healthy';

  return (
    <div className="w-full bg-void-900/80 border-b border-void-700/50 backdrop-blur-md px-4 py-1.5 text-xs font-mono text-slate-400 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDbOk ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isDbOk ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <span className="text-slate-300 font-semibold uppercase tracking-wider">SYS.STATUS:</span>
          <span className="text-emerald-400">ONLINE</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI.ENGINE:</span>
          <span className={isAiOk ? 'text-emerald-400' : 'text-amber-400'}>
            {health?.components?.ai_engine?.status?.toUpperCase() || 'READY'}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-slate-400">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>DB.CLUSTER:</span>
          <span className={isDbOk ? 'text-emerald-400' : 'text-crimson-400'}>
            {isDbOk ? 'HEALTHY' : 'CONNECTING'}
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
          <Network className="w-3.5 h-3.5 text-cyber-purple" />
          <span>RAG.CORE:</span>
          <span className="text-emerald-400">
            {isRagOk ? 'ACTIVE' : 'READY'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-slate-400">
        <span className="hidden sm:inline">SECURITY LEVEL: <span className="text-cyan-400 font-bold">DEFCON-5</span></span>
        <span className="text-void-700">|</span>
        <span className="text-slate-500">v1.0.0</span>
      </div>
    </div>
  );
};
