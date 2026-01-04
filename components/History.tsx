
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold">Real-time Violation Database</h2>
            <p className="text-xs text-slate-500 mt-1">Live tracking of active SmokeGuard AI nodes</p>
          </div>
          <div className="relative w-full md:w-80">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
            <input 
              type="text" 
              placeholder="Search Plate or ID..." 
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-blue-500 focus:outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-600 italic">No violations found matching search criteria.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-[10px] uppercase font-bold tracking-widest border-b border-slate-800">
                  <th className="pb-4 px-4">ID</th>
                  <th className="pb-4 px-4">Plate Number</th>
                  <th className="pb-4 px-4">Vehicle</th>
                  <th className="pb-4 px-4">Severity</th>
                  <th className="pb-4 px-4">Opacity</th>
                  <th className="pb-4 px-4">Timestamp</th>
                  <th className="pb-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredLogs.map((log) => (
                  <tr key={log.violationId} className="group hover:bg-slate-800/30 transition-colors">
                    <td className="py-5 px-4 text-xs font-mono text-slate-400">{log.violationId}</td>
                    <td className="py-5 px-4 text-sm font-bold font-mono tracking-wider text-blue-400">{log.vehicleNumber}</td>
                    <td className="py-5 px-4 text-sm text-slate-300">{log.vehicleType}</td>
                    <td className="py-5 px-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                        log.smokeSeverity === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
                      }`}>
                        {log.smokeSeverity}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-sm text-slate-500">{(log.smokeScore * 100).toFixed(0)}%</td>
                    <td className="py-5 px-4 text-xs text-slate-400">{log.timestamp}</td>
                    <td className="py-5 px-4 text-right">
                      <button 
                        onClick={() => onViewChallan(log)}
                        className="text-xs font-bold text-blue-500 hover:text-blue-400 underline decoration-blue-500/30 underline-offset-4"
                      >
                        View Challan
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
