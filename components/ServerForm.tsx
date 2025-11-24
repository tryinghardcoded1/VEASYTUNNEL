import React from 'react';
import { ServerProfile, Protocol } from '../types';
import { Globe } from 'lucide-react';

interface ServerFormProps {
  profile: ServerProfile;
  onChange: (updates: Partial<ServerProfile>) => void;
  disabled: boolean;
}

export const ServerForm: React.FC<ServerFormProps> = ({ profile, onChange, disabled }) => {
  const inputClass = "w-full bg-background border-none shadow-neu-pressed rounded-lg p-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary transition-all disabled:opacity-50";
  const labelClass = "block text-xs font-bold text-secondary mb-1 uppercase tracking-wider";

  return (
    <div className="space-y-4 p-1">
      {/* Connection Details */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className={labelClass}>Host / IP</label>
          <input
            type="text"
            value={profile.host}
            onChange={(e) => onChange({ host: e.target.value })}
            disabled={disabled}
            placeholder="example.com"
            className={inputClass}
          />
        </div>
        <div className="col-span-1">
          <label className={labelClass}>Port</label>
          <input
            type="number"
            value={profile.port}
            onChange={(e) => onChange({ port: e.target.value })}
            disabled={disabled}
            placeholder="80"
            className={inputClass}
          />
        </div>
      </div>

      {/* Protocol Selection */}
      <div>
        <label className={labelClass}>Protocol</label>
        <div className="relative">
          <select
            value={profile.protocol}
            onChange={(e) => onChange({ protocol: e.target.value as Protocol })}
            disabled={disabled}
            className={`${inputClass} appearance-none`}
          >
            {Object.values(Protocol).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <div className="absolute right-3 top-3 text-slate-500 pointer-events-none">
            <Globe size={16} />
          </div>
        </div>
      </div>

      {/* Auth (Optional) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Username (Opt)</label>
          <input
            type="text"
            value={profile.username || ''}
            onChange={(e) => onChange({ username: e.target.value })}
            disabled={disabled}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Password (Opt)</label>
          <input
            type="password"
            value={profile.password || ''}
            onChange={(e) => onChange({ password: e.target.value })}
            disabled={disabled}
            className={inputClass}
          />
        </div>
      </div>

      {/* Payload Configuration */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <label className={labelClass}>Payload Generator</label>
          <button
            onClick={() => onChange({ usePayload: !profile.usePayload })}
            disabled={disabled}
            className={`text-xs px-2 py-1 rounded transition-colors ${profile.usePayload ? 'bg-primary text-black font-bold' : 'bg-surface text-slate-400'}`}
          >
            {profile.usePayload ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>
        
        {profile.usePayload && (
          <div className="animate-in fade-in duration-300">
             <textarea
              value={profile.payload}
              onChange={(e) => onChange({ payload: e.target.value })}
              disabled={disabled}
              rows={5}
              className={`${inputClass} font-mono text-xs`}
              placeholder={`GET / HTTP/1.1[crlf]Host: [host][crlf]Upgrade: websocket[crlf][crlf]`}
            />
            <div className="flex flex-wrap gap-2 mt-2">
               {['[crlf]', '[lf]', '[split]', '[host]', '[port]'].map(tag => (
                 <button
                    key={tag}
                    onClick={() => onChange({ payload: profile.payload + tag })}
                    disabled={disabled}
                    className="bg-surface border border-slate-700 rounded px-2 py-1 text-[10px] hover:bg-slate-700 text-cyan-300"
                 >
                   {tag}
                 </button>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};