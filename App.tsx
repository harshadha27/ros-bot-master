
import React, { useState, useEffect } from 'react';
import { BOMTable } from './components/BOMTable';
import { RobotVisualizer } from './components/RobotVisualizer';
import { INITIAL_BOM, COMMON_ROS_COMMANDS } from './constants';
import { getROSAdvice, generateURDF } from './services/geminiService';
import { ChatMessage } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bom' | 'control' | 'ai'>('overview');
  const [speed, setSpeed] = useState(0);
  const [steering, setSteering] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [urdfOutput, setUrdfOutput] = useState('');

  // Handle keyboard teleop simulation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'control') return;
      switch(e.key.toLowerCase()) {
        case 'w': setSpeed(s => Math.min(s + 0.1, 1)); break;
        case 's': setSpeed(s => Math.max(s - 0.1, -1)); break;
        case 'a': setSteering(st => Math.max(st - 0.2, -1)); break;
        case 'd': setSteering(st => Math.min(st + 0.2, 1)); break;
        case ' ': setSpeed(0); setSteering(0); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const userMsg = userInput;
    setUserInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsAiLoading(true);
    
    const aiResponse = await getROSAdvice(userMsg);
    setChatMessages(prev => [...prev, { role: 'model', text: aiResponse || 'No response.' }]);
    setIsAiLoading(false);
  };

  const handleGenerateURDF = async () => {
    setIsAiLoading(true);
    const code = await generateURDF({ width: 0.2, length: 0.3, wheelRadius: 0.05 });
    setUrdfOutput(code || '');
    setIsAiLoading(false);
    setActiveTab('ai');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#0d1117]">
      {/* Header - Industrial HUD Style */}
      <header className="bg-[#161b22] border-b border-[#30363d] py-5 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-500 p-2.5 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#0d1117]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">ROS Bot <span className="text-cyan-400">Master</span></h1>
            <div className="flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
               <p className="text-[10px] text-cyan-500/70 font-mono font-bold tracking-widest uppercase">System Online // v2.1.0-CYBER</p>
            </div>
          </div>
        </div>
        <nav className="flex gap-2 bg-[#0d1117] p-1.5 rounded-xl border border-[#30363d]">
          {(['overview', 'bom', 'control', 'ai'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab 
                  ? 'bg-cyan-500 text-[#0d1117] shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-[1.05]' 
                  : 'text-gray-500 hover:text-cyan-400 hover:bg-[#161b22]'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'overview' && (
          <div className="space-y-10 animate-fadeIn">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="inline-block px-3 py-1 bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded">
                  Mission Parameters
                </div>
                <h2 className="text-4xl font-black text-white leading-tight">Prototyping the Future of <span className="text-cyan-500">Differential Drive</span></h2>
                <p className="text-gray-400 text-lg leading-relaxed font-medium">
                  Designing a robust mobile platform for the ROS hardware track. Engineered for precise 
                  localization using the <code className="bg-[#161b22] px-2 py-1 rounded text-orange-400 font-mono text-sm border border-[#30363d]">teleop_keyboard</code> protocol.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-[#161b22] p-5 rounded-2xl border border-[#30363d] group hover:border-cyan-500/50 transition-colors">
                    <div className="text-cyan-500 text-[10px] font-black uppercase mb-2 tracking-widest">Logic Controller</div>
                    <div className="text-xl font-bold text-gray-200">ROS Noetic / Foxy</div>
                  </div>
                  <div className="bg-[#161b22] p-5 rounded-2xl border border-[#30363d] group hover:border-orange-500/50 transition-colors">
                    <div className="text-orange-500 text-[10px] font-black uppercase mb-2 tracking-widest">Transmission</div>
                    <div className="text-xl font-bold text-gray-200">Dual-Motor Diff</div>
                  </div>
                </div>
                <button 
                  onClick={handleGenerateURDF}
                  className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-[#0d1117] rounded-2xl font-black text-sm uppercase tracking-widest transition-all transform active:scale-[0.98] shadow-[0_10px_30px_rgba(6,182,212,0.2)]"
                >
                  Initialize URDF Generation
                </button>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <RobotVisualizer speed={speed} steering={steering} />
              </div>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-xl font-black text-white uppercase tracking-wider">Advanced Capabilities</h3>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-[#30363d] to-transparent"></div>
              </div>
              <div className="bg-orange-500/5 border border-orange-500/30 p-8 rounded-3xl flex items-start gap-6 group hover:bg-orange-500/10 transition-all">
                <div className="bg-orange-500 p-4 rounded-2xl shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#0d1117]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-orange-200 uppercase tracking-tight">Active SLAM Implementation</h4>
                  <p className="text-orange-100/60 text-lg mt-2 leading-relaxed">
                    Going beyond standard tele-operation. Integrating a high-precision RPLIDAR A1 sensor for 
                    Real-Time Environment Mapping and Obstacle Avoidance using Gmapping protocols.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'bom' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-end border-b border-[#30363d] pb-8">
              <div>
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Inventory <span className="text-cyan-500">Manifest</span></h2>
                <p className="text-gray-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Procurement and Allocation Log</p>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-cyan-500/50 font-black uppercase tracking-[0.3em] mb-1">Total Estimated Overhead</div>
                <div className="text-4xl font-black text-cyan-400 font-mono">
                  ${INITIAL_BOM.reduce((acc, curr) => acc + curr.costEstimate, 0).toFixed(2)}
                </div>
              </div>
            </div>
            <BOMTable items={INITIAL_BOM} />
          </div>
        )}

        {activeTab === 'control' && (
          <div className="space-y-10 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-6">
                <div className="relative">
                   <div className="absolute -inset-1 bg-cyan-500 rounded-2xl blur opacity-10"></div>
                   <RobotVisualizer speed={speed} steering={steering} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-[#161b22] rounded-2xl border border-[#30363d] shadow-xl">
                    <span className="block text-cyan-500 text-[10px] font-black uppercase mb-4 tracking-widest">Input Control Mapping</span>
                    <ul className="text-sm space-y-3 font-bold">
                      <li className="flex items-center justify-between"><span className="text-gray-400 uppercase text-xs">Linear (+)</span> <kbd className="bg-[#21262d] px-3 py-1 rounded border border-[#30363d] text-cyan-400 font-mono shadow-sm">W</kbd></li>
                      <li className="flex items-center justify-between"><span className="text-gray-400 uppercase text-xs">Linear (-)</span> <kbd className="bg-[#21262d] px-3 py-1 rounded border border-[#30363d] text-cyan-400 font-mono shadow-sm">S</kbd></li>
                      <li className="flex items-center justify-between"><span className="text-gray-400 uppercase text-xs">Angular (L)</span> <kbd className="bg-[#21262d] px-3 py-1 rounded border border-[#30363d] text-cyan-400 font-mono shadow-sm">A</kbd></li>
                      <li className="flex items-center justify-between"><span className="text-gray-400 uppercase text-xs">Angular (R)</span> <kbd className="bg-[#21262d] px-3 py-1 rounded border border-[#30363d] text-cyan-400 font-mono shadow-sm">D</kbd></li>
                      <li className="flex items-center justify-between pt-2 border-t border-[#30363d]"><span className="text-orange-500 uppercase text-xs">Full Stop</span> <kbd className="bg-[#21262d] px-3 py-1 rounded border border-orange-500/50 text-orange-400 font-mono shadow-sm">SPACE</kbd></li>
                    </ul>
                  </div>
                  <div className="p-6 bg-[#161b22] rounded-2xl border border-[#30363d] shadow-xl">
                    <span className="block text-orange-500 text-[10px] font-black uppercase mb-4 tracking-widest">Real-Time Telemetry</span>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-gray-500 uppercase">Aux Power</span>
                          <span className="text-green-400 font-mono">94.2%</span>
                        </div>
                        <div className="w-full h-1 bg-[#21262d] rounded-full overflow-hidden">
                           <div className="h-full bg-green-500 w-[94%]" />
                        </div>
                      </div>
                      <div className="flex justify-between text-xs font-bold border-b border-[#30363d] pb-2">
                        <span className="text-gray-500 uppercase">Node Sync</span>
                        <span className="text-cyan-400 font-mono">ACTIVE_STREAM</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-500 uppercase">Bus Latency</span>
                        <span className="text-yellow-500 font-mono">0.012s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#161b22] rounded-2xl border border-[#30363d] p-8 overflow-y-auto max-h-[600px] shadow-2xl">
                <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <div className="w-1 h-4 bg-cyan-500"></div>
                  Terminal Cheat Sheet
                </h3>
                <div className="space-y-6">
                  {COMMON_ROS_COMMANDS.map((cmd, idx) => (
                    <div key={idx} className="group">
                      <div className="text-[10px] text-cyan-500 font-black uppercase mb-2 tracking-widest">{cmd.category}</div>
                      <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] code-font text-xs text-cyan-300 relative overflow-hidden group-hover:border-cyan-500/30 transition-colors">
                        <div className="absolute left-0 top-0 w-1 h-full bg-cyan-900 group-hover:bg-cyan-500 transition-colors"></div>
                        {cmd.command}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-2 font-medium leading-relaxed">{cmd.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 h-[75vh] animate-fadeIn">
            {/* Chat Interface */}
            <div className="bg-[#161b22] rounded-3xl border border-[#30363d] flex flex-col shadow-2xl overflow-hidden relative">
              <div className="p-5 bg-[#21262d] border-b border-[#30363d] flex items-center justify-between">
                <span className="font-black text-white uppercase tracking-widest text-xs flex items-center gap-3">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                  Neural Core: ROS-ENG-01
                </span>
                <span className="text-[10px] text-gray-500 font-mono font-bold tracking-widest">ENCRYPTED CHANNEL</span>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0d1117]/50">
                {chatMessages.length === 0 && (
                  <div className="text-center text-gray-600 py-24 px-10">
                    <div className="bg-[#161b22] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#30363d]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest">Awaiting Technical Inquiry...</p>
                    <p className="text-xs mt-2 text-gray-700">Query regarding L298N pinouts, Twist message structures, or PID tuning.</p>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed font-medium shadow-xl ${
                      msg.role === 'user' 
                        ? 'bg-cyan-600 text-[#0d1117] rounded-tr-none font-bold' 
                        : 'bg-[#21262d] text-gray-200 border border-[#30363d] rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#21262d] border border-[#30363d] p-5 rounded-2xl rounded-tl-none text-xs text-cyan-500 font-black uppercase tracking-[0.2em] animate-pulse">
                      Processing Neural Link...
                    </div>
                  </div>
                )}
              </div>
              <div className="p-5 bg-[#161b22] border-t border-[#30363d] flex gap-3">
                <input 
                  type="text" 
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Transmit technical query..."
                  className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500 transition-all font-medium placeholder:text-gray-700"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isAiLoading}
                  className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-700 px-8 py-4 rounded-2xl text-[#0d1117] font-black uppercase text-xs tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                >
                  Send
                </button>
              </div>
            </div>

            {/* AI Generated Content (URDF/Config) */}
            <div className="bg-[#161b22] rounded-3xl border border-[#30363d] flex flex-col shadow-2xl overflow-hidden">
               <div className="p-5 bg-[#21262d] border-b border-[#30363d] flex items-center justify-between">
                  <span className="font-black text-white uppercase tracking-widest text-xs">Generated Schematics</span>
                  <button 
                    className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500 hover:text-[#0d1117] px-3 py-1.5 rounded-lg font-black uppercase transition-all tracking-widest"
                    onClick={() => {
                        const blob = new Blob([urdfOutput], {type: 'text/plain'});
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'robot.urdf';
                        a.click();
                    }}
                  >
                    Export File
                  </button>
               </div>
               <div className="flex-1 p-8 bg-[#090b0e] code-font text-xs text-green-400/90 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                 {urdfOutput || "Run a system generator (e.g., 'URDF Initialization' in Overview) to populate this buffer."}
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#161b22] border-t border-[#30363d] py-6 px-8 text-center">
        <div className="text-[10px] text-gray-600 font-black uppercase tracking-[0.5em]">
          End of Line • Terminal Session Managed by Gemini Core
        </div>
      </footer>
    </div>
  );
};

export default App;
