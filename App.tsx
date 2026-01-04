
import React, { useState, useEffect } from 'react';
import { Page, ViolationData } from './types';
import Sidebar from './components/Sidebar';
import Detection from './components/Detection';
import ChallanView from './components/ChallanView';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Consultant from './components/Consultant';
import News from './components/News';
import About from './components/About';

export type SystemMode = 'AUTO' | 'ASSIST' | 'MANUAL';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Detection);
  const [violations, setViolations] = useState<ViolationData[]>([]);
  const [selectedViolation, setSelectedViolation] = useState<ViolationData | null>(null);
  const [systemMode, setSystemMode] = useState<SystemMode>('AUTO');
  const [selectedZone, setSelectedZone] = useState('Delhi - North Ring');
  const [globalCO2, setGlobalCO2] = useState(1240.5);

  useEffect(() => {
    // Persistent CO2 Counter simulation
    const interval = setInterval(() => {
      setGlobalCO2(prev => prev + (Math.random() * 0.1));
    }, 3000);
    
    const initialLogs: ViolationData[] = [
      { 
        violationId: 'VIO-1029', 
        vehicleNumber: 'DL-3C-AS-9921', 
        vehicleType: 'Truck', 
        vehicleColor: 'Yellow',
        smokeSeverity: 'High', 
        timestamp: new Date().toLocaleString(), 
        smokeScore: 0.82, 
        aiConfidence: 94,
        penalty: 'Rs. 5000',
        imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400',
        location: 'Delhi - North Ring',
        status: 'Sent',
        aiReasoning: ['Abnormal opacity detected', 'Continuous emission burst', 'Exhaust alignment confirmed']
      }
    ];
    setViolations(initialLogs);
    return () => clearInterval(interval);
  }, []);

  const handleNewViolation = (data: ViolationData) => {
    setViolations(prev => [data, ...prev]);
    setSelectedViolation(data);
    if (systemMode === 'AUTO' && data.smokeSeverity === 'High') {
      setCurrentPage(Page.EChallan);
    }
  };

  const handleViewChallan = (violation: ViolationData) => {
    setSelectedViolation(violation);
    setCurrentPage(Page.EChallan);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Detection: return <Detection onViolationDetected={handleNewViolation} systemMode={systemMode} selectedZone={selectedZone} />;
      case Page.EChallan: return <ChallanView violation={selectedViolation} />;
      case Page.Dashboard: return <Dashboard violations={violations} />;
      case Page.History: return <History violations={violations} onViewChallan={handleViewChallan} />;
      case Page.Consultant: return <Consultant />;
      case Page.News: return <News />;
      case Page.About: return <About />;
      default: return <Detection onViolationDetected={handleNewViolation} systemMode={systemMode} selectedZone={selectedZone} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050810] text-slate-100 font-inter selection:bg-teal-500/30">
      <Sidebar activePage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto relative">
        {/* Glow Backgrounds */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/40 pb-10">
            <div className="space-y-1">
              <div className="flex items-center gap-4">
                <div className="bg-teal-600 p-2.5 rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.3)] border border-teal-400/30">
                  <span className="text-[10px] font-black tracking-tighter text-white">SG-AI</span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-white drop-shadow-sm">SmokeGuard <span className="text-teal-400">AI</span></h1>
              </div>
              <p className="text-slate-400 text-base font-medium">
                Autonomous Enforcement Ecosystem by <span className="text-teal-400 font-bold italic tracking-tight underline decoration-teal-500/20 underline-offset-4">Black Dragon</span>
              </p>
            </div>
            
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Monitoring Zone</span>
                <select 
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="bg-slate-900/60 backdrop-blur-xl p-2 px-4 rounded-xl border border-slate-800 text-xs font-bold text-slate-300 focus:outline-none focus:border-teal-500/50 transition-all cursor-pointer"
                >
                  <option>Delhi - North Ring</option>
                  <option>Mumbai - Marine Drive</option>
                  <option>Bangalore - Silk Board</option>
                  <option>Hyderabad - HITEC City</option>
                </select>
              </div>

              <div className="bg-slate-900/40 backdrop-blur-xl p-1 rounded-2xl border border-slate-800 flex items-center shadow-inner h-[50px]">
                {(['AUTO', 'ASSIST', 'MANUAL'] as SystemMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSystemMode(mode)}
                    className={`px-4 h-full rounded-xl text-[10px] font-black transition-all duration-300 ${
                      systemMode === mode 
                        ? 'bg-teal-600 text-white shadow-[0_0_15px_rgba(20,184,166,0.4)] border border-teal-400/40' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              
              <div className="bg-slate-900/80 backdrop-blur-md p-3 px-6 rounded-2xl border border-slate-800 shadow-2xl flex items-center gap-4 h-[60px]">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">CO2 Mitigated</span>
                  <span className="text-xl font-black text-teal-400 tabular-nums">
                    {globalCO2.toFixed(2)} <span className="text-[10px] opacity-60">kg</span>
                  </span>
                </div>
                <div className="w-px h-8 bg-slate-800"></div>
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.8)]"></div>
                  <span className="text-[8px] font-black text-green-500 mt-1">LIVE</span>
                </div>
              </div>
            </div>
          </header>
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;
