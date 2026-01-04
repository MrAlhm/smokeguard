
import React, { useState } from 'react';
import { ViolationData } from '../types';

interface ChallanViewProps {
  violation: ViolationData | null;
}

const ChallanView: React.FC<ChallanViewProps> = ({ violation }) => {
  const [deliveryStatus, setDeliveryStatus] = useState<'IDLE' | 'SENDING' | 'SENT'>('IDLE');

  if (!violation) {
    return (
      <div className="flex flex-col items-center justify-center h-[550px] bg-slate-900/40 border border-slate-800 rounded-[3.5rem] p-12 text-slate-500 backdrop-blur-2xl animate-in fade-in duration-500 shadow-inner ring-1 ring-white/5">
        <div className="w-28 h-28 bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-5xl mb-8 shadow-2xl border border-slate-700 animate-bounce">📄</div>
        <p className="text-3xl font-black text-white tracking-tight">No Evidence Pipeline</p>
        <p className="text-sm mt-4 text-slate-500 text-center max-w-sm leading-relaxed font-bold uppercase tracking-widest opacity-60">Initialize Vision Node scan to populate enforcement documentation.</p>
      </div>
    );
  }

  const simulateDelivery = () => {
    setDeliveryStatus('SENDING');
    setTimeout(() => setDeliveryStatus('SENT'), 2000);
  };

  return (
    <div className="animate-in zoom-in-95 duration-500 space-y-12 pb-24">
      <div id="printable-challan" className="bg-white text-slate-900 rounded-[4rem] overflow-hidden shadow-2xl shadow-teal-900/40 border-8 border-white/5 print:m-0 print:shadow-none print:border-none">
        <div className="bg-[#050810] text-white p-12 flex justify-between items-center print:bg-black">
          <div className="flex items-center gap-6">
            <div className="bg-teal-600 p-3 rounded-2xl shadow-[0_0_20px_rgba(20,184,166,0.5)] border border-teal-400/30">
              <span className="text-[14px] font-black tracking-tighter text-white">SG</span>
            </div>
            <div>
              <h2 className="text-4xl font-black tracking-tighter uppercase mb-1">Notice of Violation</h2>
              <p className="text-teal-500 text-xs font-black tracking-[0.3em] uppercase opacity-80">Central AI-Enforcement Division</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase font-black text-slate-500 tracking-[0.3em] mb-2">Legal Docket Ref</p>
            <p className="text-3xl font-mono font-black text-teal-400 drop-shadow-sm">{violation.violationId}</p>
          </div>
        </div>

        <div className="p-12 grid md:grid-cols-3 gap-16">
          <div className="md:col-span-1 space-y-10">
            <div className="relative rounded-[3rem] overflow-hidden border-8 border-slate-50 shadow-2xl group cursor-zoom-in aspect-square">
              <img src={violation.imageUrl} alt="Forensic Evidence" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-6 left-6 bg-teal-600 text-white text-[9px] font-black px-4 py-2 rounded-full shadow-2xl tracking-[0.2em] border border-white/20">PROOF_IMG_SECURED</div>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
              <h4 className="text-[11px] uppercase font-black text-slate-400 mb-5 tracking-[0.25em] flex items-center gap-3">
                 <span className="w-2 h-4 bg-teal-500 rounded-full"></span>
                 AI Evidence Audit
              </h4>
              <ul className="space-y-4">
                {violation.aiReasoning.map((reason, i) => (
                  <li key={i} className="text-xs font-bold text-slate-600 flex items-start gap-4 leading-relaxed group">
                    <span className="text-teal-500 text-lg leading-none transition-transform group-hover:scale-125">✓</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-2 space-y-12">
            <div className="grid grid-cols-2 gap-x-16 gap-y-12">
              <Detail label="Subject Plate ID" value={violation.vehicleNumber} isMono />
              <Detail label="Classification" value={violation.vehicleType} />
              <Detail label="Active Node" value={violation.location} />
              <Detail label="Timestamp (IST)" value={violation.timestamp} />
              <Detail label="Pollution Grade" value={violation.smokeSeverity} isUrgent />
              
              <div className="space-y-3">
                <p className="text-[11px] uppercase font-black text-slate-400 tracking-[0.25em] mb-2">Legal Defensibility</p>
                <div className="flex items-center gap-5">
                  <span className="text-3xl font-black text-slate-900 tabular-nums">{violation.aiConfidence}%</span>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-blue-500 shadow-lg" style={{ width: `${violation.aiConfidence}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full my-10"></div>

            <div className="flex items-center justify-between p-10 bg-gradient-to-br from-teal-50 to-white border-2 border-teal-100 rounded-[3rem] relative overflow-hidden shadow-xl">
              <div className="absolute -right-16 -bottom-16 text-[15rem] text-teal-200 opacity-20 rotate-12 pointer-events-none font-serif tracking-tighter">⚖️</div>
              <div className="relative z-10">
                <p className="text-[11px] uppercase font-black text-teal-600 tracking-[0.3em] mb-3">Notice Penalty Value</p>
                <p className="text-7xl font-black text-slate-900 tracking-tighter tabular-nums drop-shadow-sm">{violation.penalty}</p>
              </div>
              <div className="text-right max-w-[280px] relative z-10 space-y-4">
                <p className="text-[11px] font-black text-teal-800 uppercase tracking-widest underline decoration-teal-200 underline-offset-4">Legal Citation</p>
                <p className="text-xs font-bold text-slate-600 leading-relaxed italic border-r-4 border-teal-500 pr-5">This notice is issued under Section 190(2) of the Motor Vehicles Act. Visible opacity measured exceeds statutory environmental limits.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-12 py-10 bg-[#050810] border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-500 font-black uppercase tracking-[0.3em] print:hidden">
          <p>© 2024 SmokeGuard AI | Digital Forensic Division</p>
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-2.5 bg-teal-500 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.6)]"></div>
            Immutable Proof Chain Verified
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-8 print:hidden px-4">
        <button 
          onClick={() => window.print()}
          className="group bg-teal-600 hover:bg-teal-500 text-white font-black px-12 py-6 rounded-3xl shadow-[0_20px_50px_rgba(20,184,166,0.4)] transition-all flex items-center gap-4 border-b-8 border-teal-800 hover:-translate-y-1"
        >
          <span className="text-3xl transition-transform group-hover:scale-125">🖨️</span> 
          <span className="uppercase tracking-[0.1em] text-sm font-black">Generate Legal PDF</span>
        </button>
        
        <button 
          onClick={simulateDelivery}
          disabled={deliveryStatus !== 'IDLE'}
          className={`px-12 py-6 rounded-3xl font-black transition-all flex items-center gap-4 border-b-8 shadow-2xl relative overflow-hidden ${
            deliveryStatus === 'SENT' 
            ? 'bg-green-600 text-white border-green-800 shadow-green-900/30' 
            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white shadow-black/40'
          }`}
        >
          <span className="text-3xl relative z-10">
            {deliveryStatus === 'IDLE' ? '📲' : deliveryStatus === 'SENDING' ? '📡' : '✅'}
          </span>
          <span className="relative z-10 uppercase tracking-[0.1em] text-sm font-black">
            {deliveryStatus === 'IDLE' ? 'Transmit to Owner' : deliveryStatus === 'SENDING' ? 'Dispatching Signals...' : 'E-Notice Delivered'}
          </span>
          {deliveryStatus === 'SENDING' && <div className="absolute inset-0 bg-white/10 animate-pulse"></div>}
        </button>

        <button className="bg-slate-900/40 hover:bg-slate-900 text-slate-500 font-black px-12 py-6 rounded-3xl border border-slate-800 transition-all shadow-xl backdrop-blur-md uppercase tracking-[0.1em] text-sm">
          Audit Raw JSON
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; background: white !important; color: black !important; }
          #printable-challan, #printable-challan * { visibility: visible; }
          #printable-challan { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            border-radius: 0;
            box-shadow: none;
            border: none;
          }
        }
      `}} />
    </div>
  );
};

const Detail: React.FC<{ label: string; value: string; isMono?: boolean; isUrgent?: boolean }> = ({ label, value, isMono, isUrgent }) => (
  <div className="space-y-2 group">
    <p className="text-[11px] uppercase font-black text-slate-400 tracking-[0.2em] mb-2 group-hover:text-teal-600 transition-colors">{label}</p>
    <p className={`text-2xl font-black leading-tight ${isMono ? 'font-mono tracking-widest' : 'tracking-tighter'} ${isUrgent ? 'text-red-600 bg-red-50 px-5 py-2 rounded-2xl inline-block shadow-sm ring-1 ring-red-100' : 'text-slate-950'}`}>
      {value}
    </p>
  </div>
);

export default ChallanView;
