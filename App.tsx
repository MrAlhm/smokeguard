
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

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Detection);
  const [violations, setViolations] = useState<ViolationData[]>([]);
  const [selectedViolation, setSelectedViolation] = useState<ViolationData | null>(null);

  useEffect(() => {
    const initialLogs: ViolationData[] = [
      { 
        violationId: 'VIO-1029', 
        vehicleNumber: 'DL-3C-AS-9921', 
        vehicleType: 'Truck', 
        vehicleColor: 'Yellow',
        smokeSeverity: 'High', 
        timestamp: '2024-05-20 10:30', 
        smokeScore: 0.82, 
        aiConfidence: 94,
        penalty: 'Rs. 5000',
        imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400',
        location: 'Zone A - Main'
      }
    ];
    setViolations(initialLogs);
  }, []);

  const handleNewViolation = (data: ViolationData) => {
    setViolations(prev => [data, ...prev]);
    setSelectedViolation(data);
  };

  const handleViewChallan = (violation: ViolationData) => {
    setSelectedViolation(violation);
    setCurrentPage(Page.EChallan);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Detection: return <Detection onViolationDetected={handleNewViolation} />;
      case Page.EChallan: return <ChallanView violation={selectedViolation} />;
      case Page.Dashboard: return <Dashboard violations={violations} />;
      case Page.History: return <History violations={violations} onViewChallan={handleViewChallan} />;
      case Page.Consultant: return <Consultant />;
      case Page.News: return <News />;
      case Page.About: return <About />;
      default: return <Detection onViolationDetected={handleNewViolation} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b1220] text-slate-100 font-inter selection:bg-blue-500/30">
      <Sidebar activePage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="bg-blue-600 p-1.5 rounded-lg text-xs font-black">SG</span>
                <h1 className="text-4xl font-black tracking-tighter text-white">SmokeGuard <span className="text-blue-500">AI</span></h1>
              </div>
              <p className="text-slate-400 text-lg font-medium">
                Advanced Monitoring Ecosystem by <span className="text-blue-400 font-extrabold italic">Black Dragon</span>
              </p>
            </div>
            <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur-md p-4 rounded-3xl border border-slate-800 shadow-2xl">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Status</span>
                <span className="text-xs font-bold text-green-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  SYST_HEALTH: OPTIMAL
                </span>
              </div>
            </div>
          </header>
          <div className="relative">
             {renderPage()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
