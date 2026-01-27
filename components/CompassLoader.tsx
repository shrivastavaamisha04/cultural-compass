
import React from 'react';

const CompassLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-12">
      <div className="relative w-40 h-40">
        {/* Outer Circle Glow */}
        <div className="absolute inset-0 bg-white shadow-xl rounded-full blur-xl opacity-50"></div>
        {/* Ring */}
        <div className="absolute inset-0 border-[1px] border-slate-200 rounded-full"></div>
        {/* Detailed Markers */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-slate-400 font-black text-[10px] tracking-widest">N</div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-slate-200 font-black text-[10px] tracking-widest">S</div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-200 font-black text-[10px] tracking-widest">W</div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-200 font-black text-[10px] tracking-widest">E</div>
        
        {/* Needle */}
        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
          <div className="w-[2px] h-32 bg-gradient-to-t from-transparent via-red-400 to-transparent rounded-full shadow-[0_0_15px_rgba(239,68,68,0.2)]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-slate-800 rounded-full shadow-lg border border-white/50"></div>
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-slate-800 text-xl font-bold tracking-tight">Deciphering Nuance</h3>
        <p className="text-slate-400 text-sm font-medium">Scanning etiquette databases...</p>
      </div>
    </div>
  );
};

export default CompassLoader;
