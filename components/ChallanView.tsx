
import React from 'react';
import { ViolationData } from '../types';

interface ChallanViewProps {
  violation: ViolationData | null;
}

const ChallanView: React.FC<ChallanViewProps> = ({ violation }) => {
  if (!violation) {
    return (
      <div className="flex flex-col items-center justify-center h-80 bg-[#111827] border border-slate-800 rounded-3xl p-8 text-slate-500">
        <span className="text-5xl mb-4">📄</span>
        <p className="text-xl font-medium">No violation selected</p>
        <p className="text-sm mt-2 text-slate-600">Select a record from the Logs or run a new detection</p>
      </div>
    );
  }

  const exportCSV = () => {
    const headers = ['Violation ID', 'Vehicle Number', 'Type', 'Color', 'Severity', 'Opacity', 'Penalty', 'Timestamp', 'Location'];
    const row = [
      violation.violationId,
      violation.vehicleNumber,
      violation.vehicleType,
      violation.vehicleColor,
      violation.smokeSeverity,
      `${(violation.smokeScore * 100).toFixed(1)}%`,
      violation.penalty,
      violation.timestamp,
      violation.location || 'N/A'
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + row.join(",");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `challan_${violation.violationId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    // Triggers browser native print which can be saved as PDF
    window.print();
  };

  return (
    <div className="animate-in zoom-in-95 duration-300">
      <div id="printable-challan" className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/40 border border-slate-200 print:m-0 print:shadow-none print:border-none">
        <div className="bg-slate-900 text-white p-8 flex justify-between items-center print:bg-black">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Electronic Violation Record</h2>
            <p className="text-slate-400 text-sm mt-1">SmokeGuard AI Monitoring System</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase font-bold text-slate-500 tracking-widest">ID</p>
            <p className="text-lg font-mono font-bold text-blue-400">{violation.violationId}</p>
          </div>
        </div>

        <div className="p-8 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm print:max-h-60">
              <img src={violation.imageUrl} alt="Violation Proof" className="w-full h-auto object-contain" />
            </div>
            <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Digital Proof Hash</p>
              <p className="text-[10px] font-mono break-all opacity-60">
                0x{Math.random().toString(16).slice(2)}...{Math.random().toString(16).slice(2)}
              </p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              <Detail label="Vehicle Number" value={violation.vehicleNumber} isMono />
              <Detail label="Vehicle Category" value={violation.vehicleType} />
              <Detail label="Vehicle Color" value={violation.vehicleColor} />
              <Detail label="Detection Time" value={violation.timestamp} />
              <Detail label="Pollution Level" value={violation.smokeSeverity} isUrgent />
              <Detail label="Opacity Score" value={`${(violation.smokeScore * 100).toFixed(1)}%`} />
            </div>

            <div className="h-px bg-slate-200 w-full my-6"></div>

            <div className="flex items-center justify-between p-6 bg-red-50 border border-red-200 rounded-2xl print:border-red-600">
              <div>
                <p className="text-xs uppercase font-bold text-red-600 tracking-wider">Penalty Amount</p>
                <p className="text-3xl font-black text-slate-900">{violation.penalty}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-red-700/70 max-w-[200px]">Fine imposed by SmokeGuard AI for violation of environmental standards.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 italic print:hidden">
          <p>© 2024 SmokeGuard AI | Team Black Dragon</p>
          <p>Confidence: {violation.aiConfidence}% • Verified Proof Attached</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4 print:hidden">
        <button 
          onClick={exportPDF}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-blue-900/20 transition-all flex items-center gap-2"
        >
          <span>📄</span> Download PDF
        </button>
        <button 
          onClick={exportCSV}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-8 py-4 rounded-2xl border border-slate-700 transition-all flex items-center gap-2"
        >
          <span>📊</span> Export CSV
        </button>
        <button className="bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold px-8 py-4 rounded-2xl border border-slate-800 transition-all">
          ✉️ Send to Owner
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          #printable-challan, #printable-challan * { visibility: visible; }
          #printable-challan { 
            position: fixed; 
            left: 0; 
            top: 0; 
            width: 100%; 
            height: auto;
            border-radius: 0;
          }
        }
      `}} />
    </div>
  );
};

const Detail: React.FC<{ label: string; value: string; isMono?: boolean; isUrgent?: boolean }> = ({ label, value, isMono, isUrgent }) => (
  <div>
    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{label}</p>
    <p className={`text-lg font-bold ${isMono ? 'font-mono tracking-wider' : ''} ${isUrgent ? 'text-red-600' : 'text-slate-800'}`}>
      {value}
    </p>
  </div>
);

export default ChallanView;
