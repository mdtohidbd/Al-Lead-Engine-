import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';

export const TestChat: React.FC = () => {
  const { hotThreshold, settings } = useCRM();
  const [simulatedScore, setSimulatedScore] = useState(40);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: "Hello! I'm your Prime Qualify AI agent. I'll automatically score your answers against your active qualification rules. What is your company size and purchasing timeline?",
      time: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const sendMessage = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const newMsg = { sender: 'user' as const, text, time: 'Just now' };
    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInput('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      const pointsGain = Math.floor(Math.random() * 25) + 15;
      const newScore = Math.min(100, simulatedScore + pointsGain);
      setSimulatedScore(newScore);

      let aiReply = `Thank you! I've logged your input "${text}". Your evaluated Lead Score increased by +${pointsGain} pts to ${newScore}/100.`;
      if (newScore >= hotThreshold) {
        aiReply += ` 🎉 Congratulations! You passed our Hot Lead Threshold (${hotThreshold}). Let me connect you with Alex Rivera for an immediate demo!`;
      } else {
        aiReply += ` Do you have budget signing authority for software purchases?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          time: 'Just now',
        },
      ]);
    }, 1000);
  };

  const handleReset = () => {
    setSimulatedScore(40);
    setMessages([
      {
        sender: 'ai',
        text: "Sandbox reset! I'm your Prime Qualify AI agent ready to test your qualification pipeline.",
        time: 'Just now',
      },
    ]);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto h-[calc(100vh-9rem)] relative animate-fade-in pb-4">
      {/* Left Chat Container */}
      <div className="flex-1 flex flex-col glass-card rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-extrabold flex items-center justify-center shadow-md shadow-emerald-500/30">
              <span className="material-symbols-outlined text-xl">smart_toy</span>
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white">AI Lead Agent Simulator</h2>
              <p className="text-[10px] text-slate-400 font-medium">Model: <span className="text-emerald-400 font-bold">{settings.model}</span> &bull; Hot Threshold: <span className="text-emerald-400 font-bold">{hotThreshold} pts</span></p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            Reset Sandbox
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50 custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none font-medium shadow-md shadow-emerald-600/15'
                    : 'bg-white border border-slate-200/90 text-slate-900 rounded-tl-none font-medium'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] font-bold text-slate-400 mt-1 px-1">{m.time}</span>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-slate-500 p-2 bg-white/60 rounded-xl border border-slate-200/60 w-fit animate-pulse">
              <span className="material-symbols-outlined text-sm animate-spin text-emerald-600">sync</span>
              Evaluating qualification rules...
            </div>
          )}
        </div>

        {/* Input & Prompt Suggestion Chips */}
        <div className="p-4 bg-white border-t border-slate-200/80 space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {['We have 500+ employees', 'Yes, I am the buyer', 'Need deployment this month'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => sendMessage(suggestion)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-slate-700 text-[10px] font-extrabold rounded-xl border border-slate-200 whitespace-nowrap transition-all cursor-pointer"
              >
                + {suggestion}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your response to test lead scoring..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 bg-slate-50 border border-slate-300/80 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 font-medium"
            />
            <button
              onClick={() => sendMessage()}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer hover-lift border border-emerald-400/20 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base">send</span>
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Right Qualification Meter Side Panel */}
      <div className="w-full lg:w-80 glass-card rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6 flex flex-col justify-between">
        <div>
          <h3 className="font-extrabold text-[11px] text-slate-400 uppercase tracking-widest mb-4">Live Qualification Meter</h3>

          <div className="text-center space-y-3 bg-gradient-to-b from-slate-50 to-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="text-4xl font-extrabold text-emerald-600 tracking-tight">{simulatedScore}</div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Current Lead Rating</div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  simulatedScore >= hotThreshold ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm' : 'bg-gradient-to-r from-amber-500 to-amber-400'
                }`}
                style={{ width: `${simulatedScore}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-slate-400 font-bold flex justify-between">
              <span>0</span>
              <span>Target: {hotThreshold} pts</span>
              <span>100</span>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-xs">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-600">Hot Threshold</span>
              <span className="font-extrabold text-emerald-600">{hotThreshold} pts</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-600">Routing Decision</span>
              <span className="font-extrabold text-slate-900">
                {simulatedScore >= hotThreshold ? 'VIP Sales Routing' : 'Nurture Sequence'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
