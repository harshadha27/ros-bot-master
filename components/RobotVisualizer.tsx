
import React from 'react';

export const RobotVisualizer: React.FC<{ steering: number, speed: number }> = ({ steering, speed }) => {
  return (
    <div className="relative w-full h-64 bg-[#0d1117] rounded-xl border border-[#30363d] flex items-center justify-center overflow-hidden">
      <div className="absolute top-4 left-4 text-[10px] text-cyan-500/50 uppercase tracking-[0.2em] font-black">Hardware Simulation Engine</div>
      
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#22d3ee 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      {/* Robot Chassis */}
      <div 
        className="w-32 h-48 bg-[#21262d] rounded-2xl relative transition-transform duration-200 border-2 border-[#30363d] shadow-2xl"
        style={{ transform: `rotate(${steering * 15}deg) translateY(${-speed * 10}px)` }}
      >
        {/* Left Wheel */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-24 bg-[#0d1117] rounded-sm border border-[#30363d]"></div>
        {/* Right Wheel */}
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-24 bg-[#0d1117] rounded-sm border border-[#30363d]"></div>
        
        {/* Lidar Node (Unique feature) - Cyber Edition */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-cyan-950 rounded-full border-2 border-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
            <div className="w-1 h-6 bg-cyan-400 animate-spin blur-[1px]"></div>
            <div className="absolute w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
        
        {/* Direction Indicator */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-4 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
      </div>

      <div className="absolute bottom-4 right-4 text-[10px] space-y-1 bg-[#161b22]/80 backdrop-blur-sm p-3 rounded-lg border border-[#30363d]">
        <div className="flex justify-between gap-6"><span className="text-gray-500 uppercase font-bold">Linear_X:</span> <span className="text-cyan-400 font-mono">{speed.toFixed(3)}</span></div>
        <div className="flex justify-between gap-6"><span className="text-gray-500 uppercase font-bold">Angular_Z:</span> <span className="text-orange-400 font-mono">{steering.toFixed(3)}</span></div>
      </div>
    </div>
  );
};
