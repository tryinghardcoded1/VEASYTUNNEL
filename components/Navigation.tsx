import React from 'react';
import { Settings, Activity, Globe, ShoppingBag } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: Activity, label: 'Tunnel' },
    { id: 'logs', icon: Settings, label: 'Logs' }, // Using Logs as Settings/Console view
    { id: 'browser', icon: Globe, label: 'Browser' },
    { id: 'premium', icon: ShoppingBag, label: 'Premium' },
  ];

  return (
    <nav className="bg-surface/90 backdrop-blur-md border-t border-slate-800 fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 z-50 pb-safe">
      <div className="flex justify-around items-center p-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};