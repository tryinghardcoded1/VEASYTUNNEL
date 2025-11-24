import React, { useState, useEffect } from 'react';
import { ServerForm } from './components/ServerForm';
import { TunnelConsole } from './components/TunnelConsole';
import { BrowserView } from './components/BrowserView';
import { Navigation } from './components/Navigation';
import { useWebSocketTunnel } from './hooks/useWebSocketTunnel';
import { ServerProfile, Protocol, ConnectionStatus } from './types';
import { Power, Save, Trash2, Wifi, Zap } from 'lucide-react';

const DEFAULT_PROFILE: ServerProfile = {
  id: 'default',
  name: 'Echo Test Server',
  host: 'echo.websocket.org',
  port: '443',
  protocol: Protocol.WEBSOCKET,
  payload: 'GET / HTTP/1.1[crlf]Host: [host][crlf]Upgrade: websocket[crlf]Connection: Upgrade[crlf][crlf]',
  usePayload: true,
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [profile, setProfile] = useState<ServerProfile>(DEFAULT_PROFILE);
  const { status, logs, connect, disconnect, clearLogs } = useWebSocketTunnel();
  const [showInstall, setShowInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Load profile
  useEffect(() => {
    const saved = localStorage.getItem('veasy-profile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load profile");
      }
    }
  }, []);

  // PWA Install Logic
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    });
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setShowInstall(false);
        }
        setDeferredPrompt(null);
      });
    }
  };

  const handleSave = () => {
    localStorage.setItem('veasy-profile', JSON.stringify(profile));
    alert('Profile Saved!');
  };

  const handleConnectToggle = () => {
    if (status === ConnectionStatus.CONNECTED || status === ConnectionStatus.CONNECTING) {
      disconnect();
    } else {
      connect(profile.host, profile.port, profile.protocol, profile.payload, profile.usePayload);
      setActiveTab('logs');
    }
  };

  const isConnected = status === ConnectionStatus.CONNECTED;

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background relative shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-background z-10">
        <div className="flex items-center gap-2">
          <Zap className="text-primary" fill="currentColor" size={20} />
          <h1 className="text-lg font-bold tracking-wider text-white">V-EASY <span className="text-primary">TUNNEL</span></h1>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors ${
          status === ConnectionStatus.CONNECTED ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' :
          status === ConnectionStatus.CONNECTING ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
          'bg-slate-800 text-slate-400 border border-slate-700'
        }`}>
          <div className={`w-2 h-2 rounded-full ${status === ConnectionStatus.CONNECTED ? 'bg-emerald-400 animate-pulse' : status === ConnectionStatus.CONNECTING ? 'bg-yellow-400 animate-ping' : 'bg-slate-500'}`} />
          {status}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative pb-[80px]">
        <div className={`h-full w-full transition-opacity duration-300 ${activeTab === 'home' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none absolute top-0 left-0'}`}>
          <div className="h-full overflow-y-auto p-4 space-y-6 custom-scrollbar">
            
            {/* Big Connect Button */}
            <div className="flex justify-center my-6">
              <button
                onClick={handleConnectToggle}
                className={`w-32 h-32 rounded-full shadow-neu-flat flex flex-col items-center justify-center transition-all duration-300 active:shadow-neu-pressed active:scale-95 ${isConnected ? 'bg-surface border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'bg-surface hover:text-primary'}`}
              >
                <Power size={40} className={isConnected ? 'text-emerald-400' : 'text-slate-400'} />
                <span className="mt-2 text-xs font-bold text-slate-500 uppercase">{isConnected ? 'STOP' : 'START'}</span>
              </button>
            </div>

            {/* Stats (Mock) */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-surface p-3 rounded-xl shadow-neu-flat border border-slate-700/30 flex items-center gap-3">
                 <div className="bg-slate-900 p-2 rounded-lg"><Wifi size={18} className="text-primary" /></div>
                 <div>
                    <div className="text-[10px] text-slate-500 uppercase">Download</div>
                    <div className="text-sm font-mono">{isConnected ? '4.2 MB/s' : '---'}</div>
                 </div>
               </div>
               <div className="bg-surface p-3 rounded-xl shadow-neu-flat border border-slate-700/30 flex items-center gap-3">
                 <div className="bg-slate-900 p-2 rounded-lg"><Wifi size={18} className="text-accent rotate-180" /></div>
                 <div>
                    <div className="text-[10px] text-slate-500 uppercase">Upload</div>
                    <div className="text-sm font-mono">{isConnected ? '1.1 MB/s' : '---'}</div>
                 </div>
               </div>
            </div>

            {/* Config Form */}
            <div className="bg-surface rounded-xl shadow-neu-flat p-4 border border-slate-700/30">
              <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                <h2 className="text-sm font-bold text-slate-300">Configuration</h2>
                <div className="flex gap-2">
                   <button onClick={handleSave} className="p-1.5 text-primary hover:bg-slate-700 rounded transition-colors"><Save size={16} /></button>
                   <button onClick={() => setProfile(DEFAULT_PROFILE)} className="p-1.5 text-rose-500 hover:bg-slate-700 rounded transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
              <ServerForm 
                profile={profile} 
                onChange={(updates) => setProfile({ ...profile, ...updates })}
                disabled={isConnected}
              />
            </div>
          </div>
        </div>

        <div className={`h-full w-full transition-opacity duration-300 p-4 ${activeTab === 'logs' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none absolute top-0 left-0'}`}>
          <div className="h-full flex flex-col">
            <div className="flex justify-end mb-2">
              <button onClick={clearLogs} className="text-xs text-slate-400 hover:text-white">Clear Logs</button>
            </div>
            <TunnelConsole logs={logs} />
          </div>
        </div>

        <div className={`h-full w-full transition-opacity duration-300 p-4 ${activeTab === 'browser' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none absolute top-0 left-0'}`}>
          <BrowserView isConnected={isConnected} />
        </div>

        <div className={`h-full w-full transition-opacity duration-300 p-4 ${activeTab === 'premium' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none absolute top-0 left-0'}`}>
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-20 h-20 bg-gradient-to-tr from-primary to-accent rounded-2xl rotate-3 flex items-center justify-center shadow-lg shadow-primary/20">
                <Zap size={40} className="text-white" fill="white" />
             </div>
             <h2 className="text-2xl font-bold">Go Premium</h2>
             <p className="text-slate-400 text-sm max-w-xs">Unlock SSH Tunneling, No Ads, and Unlimited Bandwidth.</p>
             <button className="bg-white text-slate-900 font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform">
               Start 7-Day Free Trial
             </button>
             {showInstall && (
               <div className="mt-8 p-4 bg-surface rounded-lg border border-primary/30 w-full">
                 <p className="text-xs text-primary mb-2">Install App for better performance</p>
                 <button onClick={handleInstall} className="text-xs bg-primary text-black px-4 py-2 rounded font-bold">Install to Home Screen</button>
               </div>
             )}
          </div>
        </div>
      </main>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;