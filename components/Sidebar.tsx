
import React from 'react';
import { Page } from '../types';

interface SidebarProps {
  activePage: Page;
  onPageChange: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange }) => {
  const navItems = [
    { id: Page.Detection, label: 'Vision Node', icon: '📡' },
    { id: Page.EChallan, label: 'e-Challan', icon: '📄' },
    { id: Page.Dashboard, label: 'Eco Impact', icon: '🌱' },
    { id: Page.History, label: 'Event Logs', icon: '🕰️' },
    { id: Page.Consultant, label: 'AI Advisor', icon: '🤖' },
    { id: Page.News, label: 'Eco Feed', icon: '📰' },
    { id: Page.About, label: 'System Bio', icon: '🛡️' },
  ];

  return (
    <aside className="w-20 md:w-72 bg-[#050810] border-r border-slate-800/40 flex flex-col h-screen sticky top-0 z-50 transition-all duration-500 shadow-[20px_0_40px_rgba(0,0,0,0.4)]">
      <div className="p-10 hidden md:block">
        <div className="flex items-center gap-5 group cursor-default">
          <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(20,184,166,0.3)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-teal-400/20">
            🛡️
          </div>
          <div className="space-y-0.5">
            <span className="font-black text-2xl tracking-tighter text-white block leading-none">SMOKEGUARD</span>
            <span className="text-[9px] font-black text-teal-500 uppercase tracking-[0.3em] block opacity-80 pl-1">Command Core</span>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-5 py-8 space-y-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center gap-5 px-6 py-4.5 rounded-[1.5rem] transition-all duration-300 relative overflow-hidden group ${
              activePage === item.id
                ? 'bg-teal-600 text-white shadow-2xl shadow-teal-900/30 border border-teal-400/30'
                : 'text-slate-500 hover:bg-slate-800/40 hover:text-slate-200'
            }`}
          >
            <span className={`text-2xl transition-transform duration-500 group-hover:scale-125 ${activePage === item.id ? 'scale-110' : ''}`}>
              {item.icon}
            </span>
            <span className="font-black hidden md:block text-xs uppercase tracking-widest">{item.label}</span>
            {activePage === item.id && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-1 bg-white rounded-l-full shadow-[0_0_10px_white]"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-10 mt-auto">
        <div className="bg-slate-900/40 rounded-[2.5rem] p-8 border border-slate-800 hidden md:block backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.3em] mb-6 opacity-60 text-center">Black Dragon Tech</p>
          <div className="flex items-center justify-center gap-4 mb-6">
             <div className="w-10 h-10 bg-slate-800/80 rounded-xl flex items-center justify-center text-xl shadow-xl group-hover:rotate-12 transition-transform">🐉</div>
             <span className="text-[10px] font-black text-slate-300 tracking-tighter leading-none uppercase">Neural<br/>Architecture</span>
          </div>
          <div className="flex gap-2 h-1.5">
             {[1,2,3,4,5].map(i => (
                <div key={i} className={`flex-1 rounded-full ${i <= 4 ? 'bg-teal-600 shadow-[0_0_5px_rgba(20,184,166,0.5)]' : 'bg-slate-800'} ${i === 4 ? 'animate-pulse' : ''}`}></div>
             ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
