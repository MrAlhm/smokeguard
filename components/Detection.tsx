
import React, { useState, useRef, useEffect } from 'react';
import { analyzeVehicleImage } from '../services/geminiService';
import { detectLicensePlate } from '../services/ocrService';
import { ViolationData } from '../types';
import { SystemMode } from '../App';

interface DetectionProps {
  onViolationDetected: (data: ViolationData) => void;
  systemMode: SystemMode;
  selectedZone: string;
}

const Detection: React.FC<DetectionProps> = ({ onViolationDetected, systemMode, selectedZone }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [plate, setPlate] = useState<string | null>(null);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isLiveMode) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(s => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch(err => {
          console.error("Camera error:", err);
          setIsLiveMode(false);
        });
    }
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [isLiveMode]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        setAnalysisResult(null);
        setPlate(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setScanProgress(0);
    
    // Multi-stage fake progress for visual impact
    const stages = [
      { p: 20, m: 'Calibrating Optical Sensors...' },
      { p: 45, m: 'Segmenting Emission Plumes...' },
      { p: 70, m: 'Executing Neural Spectral Audit...' },
      { p: 90, m: 'Validating against BS-VI Standards...' }
    ];

    for (const stage of stages) {
      await new Promise(r => setTimeout(r, 600));
      setScanProgress(stage.p);
      setScanMessage(stage.m);
    }

    try {
      const [aiData, plateText] = await Promise.all([
        analyzeVehicleImage(image),
        detectLicensePlate(image)
      ]);

      setAnalysisResult(aiData);
      setPlate(plateText);

      if ((aiData.smokeSeverity === 'High' || aiData.smokeScore > 0.4) && aiData.confidence >= confidenceThreshold) {
        const violation: ViolationData = {
          violationId: `VIO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          vehicleNumber: plateText,
          vehicleType: aiData.vehicleType,
          vehicleColor: aiData.vehicleColor,
          smokeSeverity: aiData.smokeSeverity,
          smokeScore: aiData.smokeScore,
          aiConfidence: aiData.confidence,
          timestamp: new Date().toLocaleString(),
          penalty: aiData.smokeSeverity === 'High' ? '₹ 5,000' : '₹ 2,000',
          imageUrl: image,
          location: selectedZone,
          status: 'Pending',
          aiReasoning: [
            `Temporal variance detected in plume density`,
            `Chrominance shift matched to incomplete combustion`,
            `Vehicle class ${aiData.vehicleType} verified via plate DB`
          ]
        };
        onViolationDetected(violation);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
      setScanProgress(0);
    }
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setImage(dataUrl);
        setIsLiveMode(false);
      }
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-[3rem] p-5 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl min-h-[550px] flex flex-col group ring-1 ring-white/5">
            {/* Corners HUD */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-teal-500/20 rounded-tl-[3rem] pointer-events-none group-hover:border-teal-400/40 transition-all duration-500"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-teal-500/20 rounded-br-[3rem] pointer-events-none group-hover:border-teal-400/40 transition-all duration-500"></div>

            {!image && !isLiveMode ? (
              <label className="flex-1 flex flex-col items-center justify-center border-4 border-dashed border-slate-800 hover:border-teal-500/40 rounded-[2.5rem] cursor-pointer hover:bg-teal-500/5 transition-all duration-500 m-3 group relative overflow-hidden">
                <div className="absolute inset-0 bg-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className="w-24 h-24 bg-slate-800 rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl border border-slate-700 group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-400 transition-all duration-500 group-hover:-translate-y-2">
                    🛰️
                  </div>
                  <div className="text-center space-y-3">
                    <p className="text-3xl font-black text-white tracking-tighter">Initialize Data Ingest</p>
                    <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">Accepts high-bitrate CCTV frames or JPEG captures for neural enforcement.</p>
                  </div>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            ) : isLiveMode ? (
              <div className="flex-1 flex flex-col justify-center items-center p-8 space-y-10">
                <div className="relative w-full max-w-4xl aspect-video rounded-[2.5rem] overflow-hidden border-4 border-slate-800 bg-black shadow-2xl group">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale brightness-75 contrast-125 transition-all duration-1000 group-hover:grayscale-0 group-hover:brightness-100" />
                  
                  {/* Scanlines HUD */}
                  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-10 bg-[length:100%_4px,4px_100%] opacity-50"></div>
                  
                  {/* Crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <div className="w-32 h-32 border-2 border-teal-500/30 rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-teal-500 rounded-full animate-ping"></div>
                    </div>
                  </div>

                  <div className="absolute top-10 right-10 text-right font-mono text-teal-400/60 text-[10px] space-y-1 z-30 uppercase tracking-widest bg-black/40 p-3 rounded-xl border border-white/5 backdrop-blur-md">
                    <p>LAT: 28.6139</p>
                    <p>LNG: 77.2090</p>
                    <p>AZIMUTH: 184.2°</p>
                    <p>ZOOM: 2.4X</p>
                  </div>

                  <div className="absolute bottom-10 left-10 flex items-center gap-3 bg-teal-600/20 backdrop-blur-xl border border-teal-500/40 px-5 py-2.5 rounded-2xl z-30">
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black tracking-widest text-teal-400 uppercase">Signal: Encrypted_L01</span>
                  </div>
                </div>
                <button 
                  onClick={captureFrame}
                  className="w-28 h-28 bg-white rounded-full p-2 shadow-[0_0_60px_rgba(255,255,255,0.3)] active:scale-90 transition-all group hover:bg-teal-50"
                >
                  <div className="w-full h-full bg-slate-900 rounded-full border-4 border-slate-200 flex items-center justify-center group-hover:bg-teal-600 group-hover:border-white transition-all duration-300">
                    <span className="text-[12px] font-black text-white tracking-widest">SCAN</span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col p-6 animate-in zoom-in-95 duration-500">
                <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-slate-800 shadow-2xl flex-1 bg-black flex items-center justify-center group ring-4 ring-slate-900/50">
                  <img src={image!} alt="Enforcement Frame" className="max-w-full max-h-[600px] object-contain transition-all duration-700 group-hover:scale-[1.03]" />
                  
                  {/* Analysis Sim HUD */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-40 flex flex-col items-center justify-center space-y-10 animate-in fade-in duration-300">
                      <div className="relative w-64 h-64">
                         <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                         <svg className="absolute inset-0 w-full h-full -rotate-90">
                           <circle 
                             cx="128" cy="128" r="124" 
                             stroke="currentColor" strokeWidth="8" fill="transparent" 
                             className="text-teal-500 transition-all duration-700 ease-out"
                             strokeDasharray="779"
                             strokeDashoffset={779 - (scanProgress * 7.79)}
                           />
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                            <span className="text-5xl font-black text-white tabular-nums">{scanProgress}%</span>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Spectral Scan</span>
                         </div>
                      </div>
                      <div className="text-center space-y-3">
                        <p className="text-xs font-black text-teal-400 uppercase tracking-[0.3em] animate-pulse drop-shadow-[0_0_8px_rgba(20,184,166,0.6)]">{scanMessage}</p>
                        <p className="text-[9px] text-slate-600 font-mono tracking-tighter opacity-60">KERNEL_PROC_ID: {Math.random().toString(16).slice(2, 12)}</p>
                      </div>
                    </div>
                  )}

                  {!isAnalyzing && (
                    <button 
                      onClick={() => {setImage(null); setAnalysisResult(null); setPlate(null);}}
                      className="absolute top-8 right-8 bg-red-600/90 hover:bg-red-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border border-white/10 transition-all active:scale-90 z-30"
                    >✕</button>
                  )}
                </div>
                
                {!analysisResult && !isAnalyzing && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={processImage}
                      className="group bg-teal-600 hover:bg-teal-500 text-white font-black px-20 py-6 rounded-3xl shadow-[0_20px_40px_rgba(20,184,166,0.3)] transition-all active:scale-95 flex items-center gap-5 border-b-8 border-teal-800 hover:border-teal-700 hover:-translate-y-1"
                    >
                      <span className="text-3xl">🛡️</span>
                      <span className="uppercase tracking-widest text-sm font-black">Begin Forensic Audit</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Intelligence HUD */}
        <div className="space-y-8">
          <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-xl group">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-8 flex items-center gap-3">
              <span className="w-2.5 h-5 bg-teal-500 rounded-full shadow-[0_0_12px_rgba(20,184,166,0.6)]"></span>
              Neural Sensitivity
            </h3>
            
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Legal Threshold</span>
                  <span className="text-3xl font-black text-teal-400 tabular-nums">{confidenceThreshold}%</span>
                </div>
                <div className="relative pt-2">
                  <input 
                    type="range" min="50" max="99" value={confidenceThreshold} 
                    onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-800 rounded-xl appearance-none cursor-pointer accent-teal-500 hover:accent-teal-400 transition-all"
                  />
                  <div className="flex justify-between text-[9px] font-black text-slate-600 mt-4 px-2 uppercase tracking-widest">
                    <span>Relaxed</span>
                    <span>Enforced</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-[1.5rem] bg-slate-950/50 border border-slate-800 space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Kernel v3.2-LTS</span>
                 </div>
                 <p className="text-[10px] text-slate-500 leading-relaxed italic">Temporal filtering active. Analyzing {systemMode === 'AUTO' ? '128' : '64'} distinct vision features to mitigate weather bias.</p>
              </div>
            </div>
          </div>

          {analysisResult && (
            <div className="bg-slate-900/60 border border-teal-500/20 rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-right-10 duration-700 backdrop-blur-xl ring-2 ring-white/5 group">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">Audit Telemetry</h3>
                <span className="bg-teal-500/10 text-teal-400 text-[9px] font-black px-3 py-1 rounded-full border border-teal-500/20 tracking-widest">VERIFIED_HASH</span>
              </div>
              
              <div className="space-y-8">
                <div className="flex items-center gap-6 p-5 bg-teal-600/5 rounded-3xl border border-teal-500/10 shadow-inner group-hover:bg-teal-600/10 transition-colors">
                  <div className="w-16 h-16 rounded-2xl bg-teal-600/10 border border-teal-500/20 flex items-center justify-center text-3xl shadow-xl">🎯</div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase mb-1">AI Verdict</p>
                    <p className="text-3xl font-black text-white tabular-nums">{analysisResult.confidence}%</p>
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Opacity Score</span>
                      <span className={`text-xs font-black tracking-widest ${analysisResult.smokeScore > 0.4 ? 'text-red-500' : 'text-teal-400'}`}>
                         {analysisResult.smokeScore > 0.4 ? 'PENALTY_WARN' : 'IN_RANGE'}
                      </span>
                   </div>
                   <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 shadow-inner">
                      <div 
                        className={`h-full transition-all duration-1000 shadow-[0_0_15px_rgba(20,184,166,0.4)] ${analysisResult.smokeScore > 0.5 ? 'bg-red-500' : 'bg-teal-500'}`}
                        style={{ width: `${analysisResult.smokeScore * 100}%` }}
                      ></div>
                   </div>
                </div>

                <div className="p-6 bg-slate-950/80 rounded-[1.5rem] border border-slate-800 shadow-inner">
                   <div className="flex justify-between items-center mb-3">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Digital Evidence ID</p>
                      <span className="text-[10px] font-mono text-teal-500">0x..{Math.random().toString(16).slice(2, 6)}</span>
                   </div>
                   <p className="text-[10px] font-mono text-slate-400 break-all leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">F392-DA91-88CB-2210-9F12-E401</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {analysisResult && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in slide-in-from-bottom-16 duration-1000">
          <div className="bg-slate-900/60 border border-slate-800 rounded-[3.5rem] p-12 shadow-2xl backdrop-blur-2xl hover:border-teal-500/30 transition-all group ring-1 ring-white/5">
             <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.3em] mb-10">Automated Plate Scan</h3>
             <div className="bg-teal-600/5 border border-teal-500/20 p-12 rounded-[3rem] flex flex-col items-center justify-center text-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                <div className="absolute inset-0 bg-teal-500/10 animate-pulse"></div>
                <span className="text-[10px] uppercase font-black text-teal-400 tracking-[0.5em] mb-5 relative z-10">AI Buffer Read</span>
                <span className="text-6xl font-mono font-black text-white tracking-[0.25em] relative z-10 drop-shadow-[0_0_30px_rgba(20,184,166,0.5)]">{plate}</span>
             </div>
             <div className="mt-12 grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Vehicle Class</p>
                  <p className="text-xl font-black text-white tracking-tight">{analysisResult.vehicleType}</p>
                </div>
                <div className="space-y-2 text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Chroma ID</p>
                  <p className="text-xl font-black text-white tracking-tight">{analysisResult.vehicleColor}</p>
                </div>
             </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-[3.5rem] p-12 shadow-2xl backdrop-blur-2xl flex flex-col justify-between hover:border-teal-500/30 transition-all ring-1 ring-white/5">
            <div>
              <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.3em] mb-12">Emission Diagnostics</h3>
              <div className={`p-12 rounded-[3rem] text-center border-4 border-dashed flex flex-col items-center justify-center min-h-[200px] shadow-inner transition-colors duration-500 ${
                analysisResult.smokeSeverity === 'High' ? 'bg-red-600/5 border-red-500/30 text-red-500' : 'bg-teal-600/5 border-teal-500/30 text-teal-500'
              }`}>
                <p className="text-[11px] font-black uppercase tracking-widest mb-3 opacity-60">Audit Severity</p>
                <p className="text-7xl font-black tracking-tighter drop-shadow-lg">{analysisResult.smokeSeverity}</p>
              </div>
            </div>
            <div className="mt-12">
               <div className="bg-slate-950/60 p-8 rounded-[2rem] flex items-center justify-between border border-slate-800 shadow-xl hover:bg-slate-900 transition-all group/info">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Opacity Reading</span>
                    <span className="text-4xl font-black text-white tracking-tighter tabular-nums">{(analysisResult.smokeScore * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center group-hover/info:border-teal-500/50 transition-colors">
                    <span className="text-[14px] font-black text-teal-400">AI</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-[3.5rem] p-12 shadow-2xl backdrop-blur-2xl flex flex-col lg:col-span-1 md:col-span-2 relative overflow-hidden group ring-1 ring-white/5">
            <div className="absolute -right-20 -bottom-20 text-[15rem] text-teal-500 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000 rotate-12">⚙️</div>
            <div className="relative z-10 space-y-12 flex flex-col h-full">
              <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.3em]">Neural Reasoning</h3>
              <div className="space-y-6">
                <p className="text-lg text-slate-300 leading-relaxed font-semibold italic opacity-90 border-l-8 border-teal-500/20 pl-6 py-3 bg-teal-500/5 rounded-r-2xl">"{analysisResult.description}"</p>
              </div>
              
              <div className="mt-auto bg-gradient-to-br from-teal-600/20 to-blue-600/20 p-10 rounded-[2.5rem] border border-teal-500/30 shadow-2xl hover:scale-[1.02] transition-all duration-500 ring-1 ring-white/5">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-3 h-3 bg-teal-400 rounded-full shadow-[0_0_15px_rgba(45,212,191,0.8)] animate-pulse"></div>
                  <p className="text-[11px] font-black text-teal-400 uppercase tracking-[0.2em]">Maintenance Logic</p>
                </div>
                <p className="text-base text-teal-50 font-bold leading-relaxed">{analysisResult.maintenanceTip}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-4 border-b border-slate-800 last:border-0 group/row">
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover/row:text-teal-500 transition-colors">{label}</span>
    <span className="text-sm font-black text-slate-300 tracking-tight">{value}</span>
  </div>
);

export default Detection;
