import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { clsx } from 'clsx';

interface TunnelConsoleProps {
  logs: LogEntry[];
}

export const TunnelConsole: React.FC<TunnelConsoleProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-surface rounded-xl shadow-neu-pressed p-4 border border-slate-700/30 font-mono text-xs sm:text-sm overflow-hidden">
      <div className="text-secondary mb-2 border-b border-slate-700 pb-1 flex justify-between items-center">
        <span>System Log</span>
        <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-white">{logs.length} events</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
        {logs.length === 0 && (
          <div className="text-slate-500 italic text-center mt-10">Waiting for connection...</div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="break-words leading-tight">
            <span className="text-slate-500 mr-2">[{log.timestamp}]</span>
            <span
              className={clsx({
                'text-cyan-400': log.type === 'info',
                'text-rose-500': log.type === 'error',
                'text-emerald-400': log.type === 'rx',
                'text-yellow-400': log.type === 'tx',
                'text-slate-300': log.type === 'system',
              })}
            >
              {log.type === 'tx' ? '>>> ' : log.type === 'rx' ? '<<< ' : ''}
              {log.message}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};