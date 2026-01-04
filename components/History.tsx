
import React, { useState } from 'react';
import { ViolationData } from '../types';

interface HistoryProps {
  violations: ViolationData[];
  onViewChallan: (violation: ViolationData) => void;
}

const History: React.FC<HistoryProps> = ({ violations, onViewChallan }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredLogs = violations.filter(log => 
    log.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.violationId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-10 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-white tracking-tight">Active Event Logs</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">Neural audit stream from all nodes</p>
          </div>
          <div className="relative w-full md:w-96 group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors">🔍</span>
            <input 
              type="text" 
              placeholder="Filter by License Plate or Docket ID..." 
              className="w-full bg-black/40 border border-slate-800 rounded-2xl py-4 pl-16 pr-6 text-sm font-bold focus:border-teal-500/50 focus:outline-none focus:ring-4 focus:ring-teal-500/5 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-24 text-slate-600 italic flex flex-col items-center">
               <span className="text-5xl mb-4 opacity-20">🌫️</span>
               <p className="font-bold uppercase tracking-widest text-sm">No neural hits matching filter criteria.</p>
            </div>
          ) : (
            <table className="w-full text-left border-separate border-spacing-y-4">
              <thead>
                <tr className="text-slate-500 text-[10px] uppercase font-black tracking-[0.25em] pl-6">
                  <th className="pb-4 px-6">Docket ID</th>
                  <th className="pb-4 px-6">Subject Plate</th>
                  <th className="pb-4 px-6">Class</th>
                  <th className="pb-4 px-6">Severity</th>
                  <th className="pb-4 px-6">Opacity</th>
                  <th className="pb-4 px-6">Status</th>
                  <th className="pb-4 px-6 text-right pr-10">Neural Audit</th>
                </tr>
              </thead>
              <tbody className="space-y-4">
                {filteredLogs.map((log) => (
                  <tr key={log.violationId} className="group hover:bg-slate-800/40 transition-all duration-300">
                    <td className="py-6 px-6 text-xs font-mono font-black text-slate-500 bg-black/20 rounded-l-[1.5rem] border-y border-l border-slate-800/50">{log.violationId}</td>
                    <td className="py-6 px-6 text-base font-black font-mono tracking-widest text-teal-400">{log.vehicleNumber}</td>
                    <td className="py-6 px-6 text-xs font-black text-slate-300 uppercase">{log.vehicleType}</td>
                    <td className="py-6 px-6">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                        log.smokeSeverity === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                      }`}>
                        {log.smokeSeverity}
                      </span>
                    </td>
                    <td className="py-6 px-6">
                       <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-slate-400">{(log.smokeScore * 100).toFixed(0)}%</span>
                          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                             <div className={`h-full ${log.smokeScore > 0.5 ? 'bg-red-500' : 'bg-teal-500'}`} style={{ width: `${log.smokeScore * 100}%` }}></div>
                          </div>
                       </div>
                    </td>
                    <td className="py-6 px-6">
                       <span className={`text-[10px] font-black uppercase tracking-widest ${log.status === 'Sent' ? 'text-teal-500' : 'text-slate-500'}`}>
                          {log.status}
                       </span>
                    </td>
                    <td className="py-6 px-6 text-right pr-10 bg-black/20 rounded-r-[1.5rem] border-y border-r border-slate-800/50">
                      <button 
                        onClick={() => onViewChallan(log)}
                        className="bg-teal-600/10 hover:bg-teal-600 text-teal-500 hover:text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-teal-500/20"
                      >
                        Launch Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
