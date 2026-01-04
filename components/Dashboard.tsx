
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { ViolationData } from '../types';

interface DashboardProps {
  violations: ViolationData[];
}

const Dashboard: React.FC<DashboardProps> = ({ violations }) => {
  const highSeverityCount = violations.filter(v => v.smokeSeverity === 'High').length;
  const totalPenalty = violations.length * 5000; // Mock calculation
  
  // Eco Impact Simulation: Assume each caught High severity vehicle prevents 2kg of extra CO2/day if fixed
  const co2Saved = highSeverityCount * 2.4; 
  const treesEquivalent = Math.floor(co2Saved / 0.05); // Simulated metric

  const cityData = [
    { name: 'Zone A', violations: 45 + violations.length, color: '#ef4444' },
    { name: 'Zone B', violations: 32, color: '#f97316' },
    { name: 'Zone C', violations: 28, color: '#eab308' },
    { name: 'Zone D', violations: 38, color: '#ef4444' },
  ];

  const vehicleMix = [
    { name: 'Trucks', value: 40 },
    { name: 'Buses', value: 25 },
    { name: 'Cars', value: 20 },
    { name: 'Bikes', value: 15 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Live Nodes" value="1,408" icon="📡" />
        <StatCard label="Active Alerts" value={violations.length.toString()} icon="🚨" urgent={violations.length > 0} />
        <StatCard label="AI Uptime" value="99.9%" icon="⚡" />
        <StatCard label="Estimated Revenue" value={`₹${totalPenalty.toLocaleString()}`} icon="💰" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-colors"></div>
          <div className="relative z-10">
             <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-white">Ecological Impact Calculator</h3>
              <span className="bg-green-500/10 text-green-400 text-[10px] font-black px-3 py-1 rounded-full border border-green-500/20">LIVE METRICS</span>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
               <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">CO2 Emission Reduction</p>
                  <p className="text-4xl font-black text-green-400">{co2Saved.toFixed(1)} <span className="text-sm opacity-50">KG/DAY</span></p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                    <span className="text-green-500">↑ 12%</span> vs last week
                  </div>
               </div>
               <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Tree Offset Equivalent</p>
                  <p className="text-4xl font-black text-blue-400">{treesEquivalent} <span className="text-sm opacity-50">TREES</span></p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                    Calculated based on detected high-emitters
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8">
          <h3 className="text-lg font-black text-white mb-8">Vehicle Composition</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={vehicleMix} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {vehicleMix.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {vehicleMix.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                {item.name}: {item.value}%
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8">
        <h3 className="text-lg font-black text-white mb-8">Violation Trends by Zone</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#1e293b', radius: 10}} contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px'}} />
              <Bar dataKey="violations" radius={[8, 8, 0, 0]}>
                {cityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; icon: string; urgent?: boolean }> = ({ label, value, icon, urgent }) => (
  <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 hover:border-blue-500/30 transition-all duration-300">
    <div className="flex justify-between items-center mb-4">
      <span className="text-2xl bg-slate-800 p-2 rounded-xl">{icon}</span>
      {urgent && <div className="flex gap-1"><div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div><div className="w-2 h-2 bg-red-500 rounded-full"></div></div>}
    </div>
    <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.1em]">{label}</p>
    <p className={`text-3xl font-black mt-1 ${urgent ? 'text-red-500' : 'text-white'}`}>{value}</p>
  </div>
);

export default Dashboard;
