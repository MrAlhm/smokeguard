
import React, { useState, useRef, useEffect } from 'react';
import { analyzeVehicleImage } from '../services/geminiService';
import { detectLicensePlate } from '../services/ocrService';
import { ViolationData } from '../types';

interface DetectionProps {
  onViolationDetected: (data: ViolationData) => void;
}

const Detection: React.FC<DetectionProps> = ({ onViolationDetected }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [plate, setPlate] = useState<string | null>(null);
  const [isLiveMode, setIsLiveMode] = useState(false);
  
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
        processImage(dataUrl);
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImage(result);
        setAnalysisResult(null);
        setPlate(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (imgData?: string) => {
    const targetImage = imgData || image;
    if (!targetImage) return;
    setIsAnalyzing(true);
    
    try {
      const [aiData, plateText] = await Promise.all([
        analyzeVehicleImage(targetImage),
        detectLicensePlate(targetImage)
      ]);

      setAnalysisResult(aiData);
      setPlate(plateText);

      if (aiData.smokeSeverity === 'High' || aiData.smokeScore > 0.4) {
        const violation: ViolationData = {
          violationId: `VIO-${Date.now()}`,
          vehicleNumber: plateText,
          vehicleType: aiData.vehicleType,
          vehicleColor: aiData.vehicleColor,
          smokeSeverity: aiData.smokeSeverity,
          smokeScore: aiData.smokeScore,
          aiConfidence: aiData.confidence,
          timestamp: new Date().toLocaleString(),
          penalty: aiData.smokeSeverity === 'High' ? 'Rs. 5000' : 'Rs. 2000',
          imageUrl: targetImage,
          location: "Zone A - Monitoring Point"
        };
        onViolationDetected(violation);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-6 md:p-10 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-6 left-6 flex gap-3 z-10">
          <button 
            onClick={() => setIsLiveMode(!isLiveMode)}
            className={`px-5 py-2.5 rounded-2xl text-[11px] font-black tracking-widest uppercase transition-all border flex items-center gap-3 backdrop-blur-md ${
              isLiveMode 
              ? 'bg-red-500/20 border-red-500/50 text-red-500' 
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isLiveMode ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></div>
            {isLiveMode ? 'HALT CCTV STREAM' : 'ACTIVATE LIVE NODE'}
          </button>
        </div>

        {!image && !isLiveMode ? (
          <label className="flex flex-col items-center justify-center w-full h-96 border-4 border-dashed border-slate-800 hover:border-blue-600/50 rounded-[2rem] cursor-pointer hover:bg-blue-600/5 transition-all duration-500 group">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500 group-hover:bg-blue-600 group-hover:text-white">
                📤
              </div>
              <div className="space-y-1">
                <p className="text-xl font-black text-white">Import CCTV Frame</p>
                <p className="text-sm text-slate-500 font-medium">Drag & Drop or Click to browse vehicle imagery</p>
              </div>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        ) : isLiveMode ? (
          <div className="space-y-8">
            <div className="relative max-w-3xl mx-auto rounded-[2.5rem] overflow-hidden border-8 border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black aspect-video flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-6 left-6 text-left">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Node Connectivity</p>
                <p className="text-xs text-white font-bold font-mono">ENCRYPTED_SIGNAL_STREAM_01</p>
              </div>
              <div className="absolute top-6 right-6 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full shadow-lg">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black text-white uppercase">Live</span>
              </div>
            </div>
            <div className="flex justify-center">
              <button 
                onClick={captureFrame}
                className="group relative w-20 h-20 bg-white rounded-full p-2 active:scale-95 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              >
                <div className="w-full h-full bg-slate-900 rounded-full border-4 border-slate-200 flex items-center justify-center group-hover:bg-red-600 group-hover:border-white transition-colors">
                  <span className="text-white font-black text-xs">SCAN</span>
                </div>
              </button>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="relative group max-w-3xl mx-auto rounded-[2rem] overflow-hidden border-4 border-slate-800 shadow-2xl">
              <img src={image!} alt="CCTV Feed" className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <button 
                onClick={() => {setImage(null); setAnalysisResult(null);}}
                className="absolute top-6 right-6 bg-slate-900/80 hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border border-slate-700"
              >✕</button>
            </div>
            
            {!analysisResult && (
              <div className="flex justify-center">
                <button
                  onClick={() => processImage()}
                  disabled={isAnalyzing}
                  className="group relative bg-blue-600 hover:bg-blue-500 text-white font-black px-12 py-5 rounded-2xl shadow-2xl shadow-blue-900/40 transition-all active:scale-95 flex items-center gap-3"
                >
                  <span className="text-xl">{isAnalyzing ? '🌀' : '⚡'}</span>
                  <span className="tracking-tighter uppercase text-sm">
                    {isAnalyzing ? "Analyzing Emission Spectrum..." : "Initialize Deep Vision Scan"}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {analysisResult && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-700">
          <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-8 shadow-2xl space-y-8">
             <div>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Subject Identity</h3>
                <div className="space-y-4">
                  <InfoRow label="Class" value={analysisResult.vehicleType} />
                  <InfoRow label="Spectrum" value={analysisResult.vehicleColor} />
                </div>
             </div>
             <div className="p-6 bg-blue-600/5 border border-blue-500/20 rounded-[1.5rem] space-y-2">
                <span className="text-[9px] uppercase font-black text-blue-400 tracking-widest block">Neural OCR Plate</span>
                <span className="text-3xl font-mono font-black text-white tracking-widest block">{plate}</span>
             </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-8 shadow-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Emission Telemetry</h3>
              <div className={`p-6 rounded-2xl text-center border-2 mb-8 ${
                analysisResult.smokeSeverity === 'High' ? 'bg-red-500/5 border-red-500/20 text-red-500' : 'bg-green-500/5 border-green-500/20 text-green-500'
              }`}>
                <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Status</p>
                <p className="text-4xl font-black">{analysisResult.smokeSeverity}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Opacity Level</span>
                <span className="text-xl font-black text-white">{(analysisResult.smokeScore * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-800/50 h-3 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className={`h-full transition-all duration-1000 ${analysisResult.smokeScore > 0.5 ? 'bg-red-600' : 'bg-blue-600'}`}
                  style={{ width: `${analysisResult.smokeScore * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] p-8 shadow-2xl flex flex-col lg:col-span-1 md:col-span-2 relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 text-9xl text-slate-800 opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-700">⚙️</div>
            <div className="relative z-10">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Predictive Diagnostics</h3>
              <div className="space-y-6">
                 <div>
                   <p className="text-sm text-slate-200 leading-relaxed font-medium italic">"{analysisResult.description}"</p>
                 </div>
                 <div className="bg-blue-600/10 p-5 rounded-2xl border border-blue-500/20">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Engine Maintenance Tip</p>
                    <p className="text-xs text-blue-100 leading-relaxed font-bold">{analysisResult.maintenanceTip}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2.5 border-b border-slate-800/50 last:border-0">
    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
    <span className="text-sm font-black text-slate-200 tracking-tight">{value}</span>
  </div>
);

export default Detection;
