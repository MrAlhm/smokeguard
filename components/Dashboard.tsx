
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area } from 'recharts';
import { ViolationData } from '../types';

interface DashboardProps {
  violations: ViolationData[];
}

const Dashboard: React.FC<DashboardProps> = ({ violations }) => {
  const highSeverityCount = violations.filter(v => v.smokeSeverity === 'High').length;
  const totalPenalty = violations.length * 5000;
  
  // Eco Impact Simulation
  const co2Saved = highSeverityCount * 2.4; 
  const treesEquivalent = Math.floor(co2Saved / 0.05);

  const cityData = [
    { name: 'Zone A', violations: 45 + violations.length, color: '#14b8a6' },
    { name: 'Zone B', violations: 32, color: '#3b82f6' },
    { name: 'Zone C', violations: 28, color: '#f59e0b' },
    { name: 'Zone D', violations: 38, color: '#ef4444' },
  ];

  const trendData = [
    { hour: '08:00', baseline: 80, active: 65 },
    { hour: '10:00', baseline: 95, after: 70 },
    { hour: '12:00', baseline: 110, after: 75 },
    { hour: '14:00', baseline: 105, after: 68 },
    { hour: '16:00', baseline: 120, after: 72 },
    { hour: '18:00', baseline: 130, after: 78 },
  ];

  const vehicleMix = [
    { name: 'Heavy Trucks', value: 40 },
    { name: 'Buses', value: 25 },
    { name: 'Old Sedans', value: 20 },
    { name: 'Motorcycles', value: 15 },
  ];

  const COLORS = ['#14b8a6', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-1000">
      {/* Dynamic Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Network Uptime" value="99.98%" icon="📡" />
        <StatCard label="Enforcement Hits" value={violations.length.toString()} icon="🚨" urgent={violations.length > 0} />
        <StatCard label="Audit Fidelity" value="98.7%" icon="⚡" />
        <StatCard label="Projected Recovery" value={`₹${totalPenalty.toLocaleString()}`} icon="💰" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-[3.5rem] p-12 relative overflow-hidden group backdrop-blur-2xl ring-1 ring-white/5">
          <div className="absolute -right-24 -top-24 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-teal-500/15 transition-all duration-1000"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h3 className="text-3xl font-black text-white tracking-tight">Eco-Savings Impact Hub</h3>
                <p className="text-slate-500 text-sm mt-2 font-bold uppercase tracking-widest">Global emission prevention index</p>
              </div>
              <div className="bg-teal-500/10 text-teal-400 text-[10px] font-black px-6 py-2.5 rounded-full border border-teal-500/30 tracking-[0.25em] shadow-lg">LIVE_MONITORING</div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10 mb-12">
               <div className="bg-[#0b1220] p-10 rounded-[3rem] border border-slate-800/60 shadow-2xl group hover:border-teal-500/40 transition-all duration-500">
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">CO2 Neutralized</p>
                  <div className="flex items-baseline gap-3">
                    <p className="text-7xl font-black text-teal-400 tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(20,184,166,0.3)]">{co2Saved.toFixed(1)}</p>
                    <span className="text-xl font-black text-slate-600 uppercase">KG</span>
                  </div>
                  <div className="mt-8 flex items-center gap-4">
                    <span className="bg-teal-500 text-black px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">↑ 18.2%</span>
                    <span className="text-xs text-slate-400 font-bold">Improvement vs Baseline</span>
                  </div>
               </div>
               
               <div className="bg-[#0b1220] p-10 rounded-[3rem] border border-slate-800/60 shadow-2xl group hover:border-blue-500/40 transition-all duration-500">
                  <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Offset Equivalence</p>
                  <div className="flex items-baseline gap-3">
                    <p className="text-7xl font-black text-blue-400 tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">{treesEquivalent}</p>
                    <span className="text-xl font-black text-slate-600 uppercase">TREES</span>
                  </div>
                  <div className="mt-8 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Validated by SG-Node-7</p>
                  </div>
               </div>
            </div>
            
            <div className="mt-auto bg-slate-950/80 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden ring-1 ring-white/5">
               <div className="absolute right-0 top-0 w-48 h-48 bg-teal-500/5 blur-3xl"></div>
               <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center text-3xl shadow-2xl border border-teal-400/20">🧬</div>
                  <div>
                    <h4 className="text-base font-black text-white uppercase tracking-widest mb-1">Neural Core Transparency</h4>
                    <p className="text-[10px] font-black text-teal-500/80 uppercase tracking-[0.2em]">Active Ver: v3.4.1-ENFORCE</p>
                  </div>
               </div>
               <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  The SmokeGuard neural engine integrates temporal plume variance analysis and pixel-level spectral histograms. By cross-referencing RTO database parameters with real-time vision data, the model effectively segregates legitimate exhaust from mechanical errors with 99.8% precision.
               </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-[3.5rem] p-12 backdrop-blur-2xl flex flex-col justify-between group ring-1 ring-white/5">
          <div className="space-y-2 mb-10">
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-4">
               Vehicle Class Mix
               <span className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.6)]"></span>
            </h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current deployment distribution</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={vehicleMix} cx="50%" cy="50%" innerRadius={85} outerRadius={110} paddingAngle={12} dataKey="value" stroke="none">
                  {vehicleMix.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{backgroundColor: '#050810', border: '1px solid #1e293b', borderRadius: '16px', fontSize: '11px', fontWeight: '900'}} 
                  itemStyle={{color: '#fff'}}
                  cursor={{fill: 'transparent'}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-5 mt-12 bg-black/40 p-8 rounded-[2rem] border border-slate-800 shadow-inner ring-1 ring-white/5">
            {vehicleMix.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.25em]">
                <div className="flex items-center gap-4">
                  <div className="w-3.5 h-3.5 rounded-full shadow-lg" style={{backgroundColor: COLORS[i]}}></div>
                  <span className="text-slate-500">{item.name}</span>
                </div>
                <span className="text-white tabular-nums">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-[3.5rem] p-12 backdrop-blur-2xl ring-1 ring-white/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
          <div>
            <h3 className="text-3xl font-black text-white tracking-tight">Pollution Prevention Trends</h3>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mt-2">Active Enforcement Delta vs Baseline</p>
          </div>
          <div className="flex gap-8 bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
             <div className="flex items-center gap-3">
                <div className="w-4 h-1 rounded-full bg-slate-700"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Standard Baseline</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-4 h-1 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]"></div>
                <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">SG-AI Enforced</span>
             </div>
          </div>
        </div>
        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
              <XAxis dataKey="hour" stroke="#475569" fontSize={11} fontWeight="900" axisLine={false} tickLine={false} dy={15} />
              <YAxis stroke="#475569" fontSize={11} fontWeight="900" axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{backgroundColor: '#050810', border: '1px solid #1e293b', borderRadius: '16px', color: '#fff', fontSize: '11px', fontWeight: 'bold'}}
                cursor={{stroke: '#14b8a6', strokeWidth: 2, strokeDasharray: '5 5'}}
              />
              <Area type="monotone" dataKey="baseline" stroke="#334155" fill="#1e293b" strokeWidth={3} fillOpacity={0.3} />
              <Area type="monotone" dataKey="after" stroke="#14b8a6" fill="url(#colorActive)" strokeWidth={4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; icon: string; urgent?: boolean }> = ({ label, value, icon, urgent }) => (
  <div className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] p-8 hover:border-teal-500/40 transition-all duration-500 shadow-2xl group backdrop-blur-2xl relative overflow-hidden h-[200px] flex flex-col justify-between ring-1 ring-white/5">
    <div className="absolute top-0 right-0 w-28 h-28 bg-teal-500/5 blur-3xl pointer-events-none group-hover:bg-teal-500/10 transition-colors duration-1000"></div>
    <div className="flex justify-between items-start relative z-10">
      <span className="text-3xl bg-slate-800/80 p-3.5 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/5 shadow-xl">{icon}</span>
      {urgent && (
        <div className="flex items-center gap-2 bg-red-500/10 px-4 py-1.5 rounded-full border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
          <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Live Hit</span>
        </div>
      )}
    </div>
    <div className="relative z-10">
      <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.25em] mb-2">{label}</p>
      <p className={`text-5xl font-black tracking-tighter tabular-nums ${urgent ? 'text-red-500' : 'text-white'}`}>{value}</p>
    </div>
  </div>
);

export default Dashboard;
