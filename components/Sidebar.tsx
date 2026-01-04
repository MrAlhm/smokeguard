
import React from 'react';
import { Page } from '../types';

interface SidebarProps {
  activePage: Page;
  onPageChange: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange }) => {
  const navItems = [
    { id: Page.Detection, label: 'Vision Node', icon: '🔍' },
    { id: Page.EChallan, label: 'e-Challan', icon: '📄' },
    { id: Page.Dashboard, label: 'Impact Hub', icon: '📊' },
    { id: Page.History, label: 'Event Logs', icon: '🕰️' },
    { id: Page.Consultant, label: 'AI Support', icon: '🤖' },
    { id: Page.News, label: 'Eco News', icon: '📰' },
    { id: Page.About, label: 'System Bio', icon: '🛡️' },
  ];

  return (
    <aside className="w-20 md:w-64 bg-[#0d1525] border-r border-slate-800/60 flex flex-col h-screen sticky top-0 z-50">
      <div className="p-8 hidden md:block">
        <div className="flex items-center gap-3 group cursor-default">
          <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-2xl shadow-blue-900/40 group-hover:rotate-12 transition-transform duration-500">
            🛡️
          </div>
          <span className="font-black text-xl tracking-tighter text-white">SMOKEGUARD</span>
        </div>
      </div>
      
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden group ${
              activePage === item.id
                ? 'bg-blue-600 text-white shadow-2xl shadow-blue-900/40'
                : 'text-slate-500 hover:bg-slate-800/40 hover:text-slate-200'
            }`}
          >
            <span className={`text-xl transition-transform duration-300 group-hover:scale-110 ${activePage === item.id ? 'scale-110' : ''}`}>
              {item.icon}
            </span>
            <span className="font-bold hidden md:block text-[13px] tracking-tight">{item.label}</span>
            {activePage === item.id && (
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-slate-900/50 rounded-3xl p-5 border border-slate-800 hidden md:block">
          <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em] mb-3 opacity-60">Team BLACK DRAGON</p>
          <div className="flex gap-1.5">
             {[1,2,3].map(i => (
                <div key={i} className={`w-full h-1 rounded-full ${i === 2 ? 'bg-blue-500 animate-pulse' : 'bg-slate-800'}`}></div>
             ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
