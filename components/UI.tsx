import React, { useState, useRef, useEffect } from 'react';
import { ReactorStage, StageInfo, ChatMessage } from '../types';
import { STAGES } from '../constants';
import { askReactorTutor } from '../services/geminiService';

interface UIProps {
  currentStageIndex: number;
  setStageIndex: (index: number) => void;
  controlRodLevel: number;
  setControlRodLevel: (level: number) => void;
}

const UI: React.FC<UIProps> = ({ currentStageIndex, setStageIndex, controlRodLevel, setControlRodLevel }) => {
  const stage = STAGES[currentStageIndex];
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm your AI Nuclear Physicist. Feel free to ask me questions about what you're seeing!" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (currentStageIndex < STAGES.length - 1) setStageIndex(currentStageIndex + 1);
  };

  const handlePrev = () => {
    if (currentStageIndex > 0) setStageIndex(currentStageIndex - 1);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    const response = await askReactorTutor(userMsg.text, stage.title);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
      {/* Header */}
      <div className="pointer-events-auto flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-green-400 tracking-tighter font-mono bg-black/50 p-2 rounded backdrop-blur-sm border border-green-500/30">
            VOXEL<span className="text-white">REACTOR</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-mono ml-2">SIMULATION v1.0</p>
        </div>

        {/* Control Panel (Only visible in relevant stages or always) */}
        <div className="bg-gray-900/80 backdrop-blur-md p-4 rounded-lg border border-gray-700 w-64 shadow-2xl">
            <label className="text-xs font-bold text-blue-400 uppercase mb-2 block">
                Control Rods (Reaction Rate)
            </label>
            <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={controlRodLevel}
                onChange={(e) => setControlRodLevel(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Safe (0%)</span>
                <span>Critical (100%)</span>
            </div>
             <div className="mt-2 text-right font-mono text-yellow-400 text-sm">
                OUTPUT: {(controlRodLevel * 1200).toFixed(0)} MW
            </div>
        </div>
      </div>

      {/* Bottom Navigation & Info */}
      <div className="pointer-events-auto flex gap-6 items-end">
        <div className="flex-1 bg-black/80 backdrop-blur-md border border-gray-800 rounded-xl p-6 shadow-2xl max-w-2xl">
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-gray-500 border border-gray-700 px-2 py-1 rounded">
                    STAGE {currentStageIndex + 1}/{STAGES.length}
                </span>
                <div className="flex gap-2">
                    <button 
                        onClick={handlePrev}
                        disabled={currentStageIndex === 0}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded text-sm font-bold transition-colors"
                    >
                        PREV
                    </button>
                    <button 
                        onClick={handleNext}
                        disabled={currentStageIndex === STAGES.length - 1}
                        className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded text-sm font-bold text-black transition-colors"
                    >
                        NEXT
                    </button>
                </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{stage.title}</h2>
            <p className="text-gray-300 leading-relaxed text-sm">{stage.description}</p>
        </div>

        {/* Chat Toggle Button */}
        <div className="relative">
           {!chatOpen && (
               <button 
                onClick={() => setChatOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
               >
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
               </button>
           )}

           {/* Chat Interface */}
           {chatOpen && (
             <div className="absolute bottom-0 right-0 w-80 bg-gray-900 border border-gray-700 rounded-t-lg shadow-2xl flex flex-col h-96">
                 <div className="p-3 border-b border-gray-700 bg-gray-800 rounded-t-lg flex justify-between items-center">
                     <span className="font-bold text-sm flex items-center gap-2">
                         <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                         AI Tutor
                     </span>
                     <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-white">×</button>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900/90">
                     {messages.map((m, i) => (
                         <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                             <div className={`max-w-[85%] rounded-lg p-2 text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                 {m.text}
                             </div>
                         </div>
                     ))}
                     {loading && <div className="text-xs text-gray-500 animate-pulse">Thinking...</div>}
                     <div ref={messagesEndRef} />
                 </div>
                 <div className="p-3 border-t border-gray-700 bg-gray-800">
                     <div className="flex gap-2">
                         <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask about the reactor..."
                            className="flex-1 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
                         />
                         <button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm">
                             Send
                         </button>
                     </div>
                 </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default UI;
