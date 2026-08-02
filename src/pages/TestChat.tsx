import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';

export const TestChat: React.FC = () => {
  const { hotThreshold, settings } = useCRM();
  const [simulatedScore, setSimulatedScore] = useState(40);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: "Hello! I'm your GreenLead AI agent. I'll automatically score your answers against your active qualification rules. What is your company size and timeline?",
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
        text: "Sandbox reset! I'm your GreenLead AI agent ready to test your qualification pipeline.",
        time: 'Just now',
      },
    ]);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl mx-auto h-[calc(100vh-8rem)] relative animate-fade-in">
      {/* Left Chat Container */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">smart_toy</span>
            </div>
            <div>
              <h2 className="font-bold text-sm text-[#151c27]">AI Lead Agent Simulator</h2>
              <p className="text-[10px] text-gray-500">Model: {settings.model} &bull; Threshold: {hotThreshold} pts</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs rounded-lg transition-colors"
          >
            Reset Sandbox
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f8f9fb]">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-md p-3 rounded-xl text-xs leading-relaxed shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-[#22c55e] text-white rounded-tr-none font-medium'
                    : 'bg-white border border-gray-200 text-[#151c27] rounded-tl-none'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-gray-400 mt-1 px-1">{m.time}</span>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-gray-400 p-2">
              <span className="material-symbols-outlined text-sm animate-spin text-emerald-600">sync</span>
              Evaluating qualification rules...
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-gray-200 space-y-2">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['We have 500+ employees', 'Yes, I am the buyer', 'Need deployment this month'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => sendMessage(suggestion)}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold rounded-full whitespace-nowrap"
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
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#22c55e]"
            />
            <button
              onClick={() => sendMessage()}
              className="px-4 py-2 bg-[#22c55e] text-white font-bold text-xs rounded-xl hover:bg-emerald-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Right Qualification Meter Side Panel */}
      <div className="w-full lg:w-72 bg-white rounded-xl border border-gray-200/80 shadow-sm p-5 space-y-6 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-4">Live Qualification Score</h3>

          <div className="text-center space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="text-4xl font-extrabold text-emerald-600">{simulatedScore}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Current Lead Rating</div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  simulatedScore >= hotThreshold ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${simulatedScore}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-gray-400 flex justify-between">
              <span>0</span>
              <span>Target: {hotThreshold} pts</span>
              <span>100</span>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-xs">
            <div className="flex justify-between items-center text-gray-600">
              <span>Hot Threshold</span>
              <span className="font-bold text-emerald-600">{hotThreshold} pts</span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span>Routing Decision</span>
              <span className="font-bold text-[#151c27]">
                {simulatedScore >= hotThreshold ? 'VIP Sales Routing' : 'Nurture Sequence'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

