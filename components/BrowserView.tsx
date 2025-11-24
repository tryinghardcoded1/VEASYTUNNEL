import React, { useState } from 'react';
import { RotateCw, Lock } from 'lucide-react';

interface BrowserViewProps {
  isConnected: boolean;
}

export const BrowserView: React.FC<BrowserViewProps> = ({ isConnected }) => {
  const [url, setUrl] = useState('https://whatismyip.com');
  const [displayUrl, setDisplayUrl] = useState('https://whatismyip.com');

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = displayUrl;
    if (!target.startsWith('http')) target = 'https://' + target;
    setUrl(target);
  };

  return (
    <div className="flex flex-col h-full bg-surface rounded-xl overflow-hidden shadow-neu-flat">
      <div className="bg-slate-900 p-2 flex items-center gap-2 border-b border-slate-700">
        <div className="flex gap-1 mr-2">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>
        <form onSubmit={handleNavigate} className="flex-1 relative">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400">
            {isConnected ? <Lock size={12} className="text-emerald-400" /> : <GlobeIcon />}
          </div>
          <input 
            type="text" 
            value={displayUrl}
            onChange={(e) => setDisplayUrl(e.target.value)}
            className="w-full bg-slate-800 text-xs text-slate-200 rounded-full py-1 pl-8 pr-8 border border-slate-700 focus:outline-none focus:border-primary"
          />
          <button type="button" onClick={() => setUrl(displayUrl)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
            <RotateCw size={12} />
          </button>
        </form>
      </div>
      <div className="flex-1 bg-white relative">
        {!isConnected && (
           <div className="absolute inset-0 bg-slate-900/90 z-10 flex flex-col items-center justify-center text-center p-6">
             <div className="p-4 rounded-full bg-surface mb-4 shadow-neu-flat">
               <Lock size={32} className="text-rose-500" />
             </div>
             <h3 className="text-xl font-bold text-slate-200">Tunnel Disconnected</h3>
             <p className="text-slate-400 text-sm mt-2 max-w-xs">Connect the VPN tunnel to access the secure internal browser.</p>
           </div>
        )}
        <iframe 
          src={isConnected ? url : 'about:blank'}
          className="w-full h-full border-none"
          title="Internal Browser"
          sandbox="allow-scripts allow-same-origin allow-forms" 
        />
      </div>
    </div>
  );
};

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
);