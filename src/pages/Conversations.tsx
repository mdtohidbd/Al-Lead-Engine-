import React, { useState, useEffect, useRef } from 'react';
import { useCRM } from '../context/CRMContext';

export const Conversations: React.FC = () => {
  const { conversations, addConversationMessage, toggleHumanTakeover, deleteConversation, templates } = useCRM();
  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'chat' | 'table'>('chat');
  const [filterTab, setFilterTab] = useState<'all' | 'ai' | 'human'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.leadName.toLowerCase().includes(searchTerm.toLowerCase()) || c.leadPhone.includes(searchTerm);
    if (filterTab === 'ai') return matchesSearch && !c.humanTakeover;
    if (filterTab === 'human') return matchesSearch && c.humanTakeover;
    return matchesSearch;
  });

  const activeConv = conversations.find((c) => c.id === activeConvId) || filteredConversations[0] || conversations[0];

  // Auto-scroll chat log to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  const handleSend = () => {
    if (!inputText.trim() || !activeConv) return;
    addConversationMessage(activeConv.id, {
      text: inputText,
      sender: activeConv.humanTakeover ? 'agent' : 'user',
    });
    setInputText('');
  };

  const handleSimulateCustomerReply = () => {
    if (!activeConv) return;
    const sampleReplies = [
      "Can you send over the pricing deck for 50 users?",
      "That sounds great! What time works best for a discovery call?",
      "We currently use Salesforce. Does your engine support webhooks?",
    ];
    const reply = sampleReplies[Math.floor(Math.random() * sampleReplies.length)];
    addConversationMessage(activeConv.id, {
      text: reply,
      sender: 'user',
    });
  };

  const handleApplyTemplate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tempId = e.target.value;
    setSelectedTemplate(tempId);
    if (!tempId) return;
    const tmpl = templates.find((t) => t.id === tempId);
    if (tmpl && activeConv) {
      let content = tmpl.content;
      content = content.replace(/\{\{first_name\}\}/g, activeConv.leadName.split(' ')[0]);
      content = content.replace(/\{\{company\}\}/g, 'Acme Corp');
      setInputText(content);
    }
  };

  return (
    <div className="flex flex-col space-y-6 animate-fade-in pb-8">
      {/* Header Strategy */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-700 border border-emerald-200/60 mb-2">
            <span className="material-symbols-outlined text-sm">chat</span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Live Engagement Hub</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Conversation History</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time AI engagement tracking, automated lead qualification, and agent takeover.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100/90 p-1 rounded-xl text-xs font-semibold border border-slate-200/60">
            <button
              onClick={() => setViewMode('chat')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'chat' ? 'bg-white text-slate-900 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Dual Chat View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Table View
            </button>
          </div>
          <span className="bg-emerald-100 text-emerald-800 px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-xs">
            {conversations.length} Active Conversations
          </span>
        </div>
      </div>

      {/* View Mode: Dual Chat View vs Table View */}
      {viewMode === 'chat' ? (
        <div className="h-[680px] glass-card border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden flex flex-col md:flex-row">
          {/* Left Side: Conversation List (320px) */}
          <div className="w-full md:w-80 border-r border-slate-200/80 flex flex-col bg-slate-50/70 shrink-0">
            <div className="p-3.5 border-b border-slate-200/80 space-y-2.5">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search leads or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex bg-slate-200/70 p-0.5 rounded-xl text-[11px] font-bold text-slate-600">
                <button
                  onClick={() => setFilterTab('all')}
                  className={`flex-1 py-1 rounded-lg cursor-pointer ${filterTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : ''}`}
                >
                  All ({conversations.length})
                </button>
                <button
                  onClick={() => setFilterTab('ai')}
                  className={`flex-1 py-1 rounded-lg cursor-pointer ${filterTab === 'ai' ? 'bg-white text-emerald-700 shadow-xs' : ''}`}
                >
                  AI Active
                </button>
                <button
                  onClick={() => setFilterTab('human')}
                  className={`flex-1 py-1 rounded-lg cursor-pointer ${filterTab === 'human' ? 'bg-white text-amber-700 shadow-xs' : ''}`}
                >
                  Human
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
              {filteredConversations.map((conv) => {
                const isSelected = activeConv?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full text-left p-4 flex items-start gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white shadow-sm border-l-4 border-emerald-500'
                        : 'hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-extrabold flex items-center justify-center shrink-0 shadow-xs">
                      {conv.leadName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-xs text-slate-900 truncate">{conv.leadName}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{conv.lastMessageTime}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mb-1.5 font-medium">
                        {conv.messages[conv.messages.length - 1]?.text || 'No messages yet...'}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                          {conv.leadScore} pts
                        </span>
                        {conv.humanTakeover ? (
                          <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                            HUMAN
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                            AI AGENT
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side: Active Chat Window */}
          {activeConv ? (
            <div className="flex-1 flex flex-col bg-slate-50/40 min-w-0">
              {/* Active Conversation Header */}
              <div className="p-4 bg-white border-b border-slate-200/80 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-extrabold flex items-center justify-center shadow-xs">
                    {activeConv.leadName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{activeConv.leadName}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">{activeConv.leadPhone} &bull; Score: <strong className="text-emerald-600">{activeConv.leadScore} pts</strong></p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl text-xs border border-slate-200/80">
                    <span className="text-slate-500 font-medium">Control Mode:</span>
                    <span className={`font-extrabold ${activeConv.humanTakeover ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {activeConv.humanTakeover ? 'Human Control' : 'AI Active'}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleHumanTakeover(activeConv.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-xs cursor-pointer ${
                      activeConv.humanTakeover
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'
                        : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20'
                    }`}
                  >
                    {activeConv.humanTakeover ? 'Resume AI Agent' : 'Take Over Chat'}
                  </button>
                </div>
              </div>

              {/* Chat Log Window */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
                {activeConv.messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  const isAI = msg.sender === 'ai';

                  return (
                    <div key={msg.id} className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}>
                      <div className="text-[10px] text-slate-400 font-bold mb-1 px-1 flex items-center gap-1.5">
                        <span>{isUser ? activeConv.leadName : isAI ? '🤖 AI Lead Agent' : '👤 Human Representative'}</span>
                        <span>&bull;</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs whitespace-pre-wrap ${
                          isUser
                            ? 'bg-white border border-slate-200 text-slate-900 rounded-tl-xs font-medium'
                            : isAI
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-xs shadow-emerald-600/10 font-medium'
                            : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-tr-xs shadow-indigo-600/10 font-medium'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-4 bg-white border-t border-slate-200/80 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <select
                      value={selectedTemplate}
                      onChange={handleApplyTemplate}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">-- Quick Response Templates --</option>
                      {templates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.category})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleSimulateCustomerReply}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    + Simulate Customer Reply
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={
                      activeConv.humanTakeover
                        ? 'Type a message as Human Agent...'
                        : 'AI Agent is auto-responding (Take over to message)...'
                    }
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleSend}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer hover-lift flex items-center gap-1 border border-emerald-400/20"
                  >
                    <span className="material-symbols-outlined text-base">send</span>
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-slate-400 text-xs">
              Select a conversation to view chat log.
            </div>
          )}
        </div>
      ) : (
        /* Table View */
        <div className="glass-card rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-extrabold text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Lead</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4">Score</th>
                <th className="py-3.5 px-4">Last Active</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredConversations.map((conv) => (
                <tr key={conv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{conv.leadName}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono">{conv.leadPhone}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        conv.humanTakeover ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {conv.humanTakeover ? 'HUMAN' : 'AI AGENT'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-600">{conv.leadScore} pts</td>
                  <td className="py-3.5 px-4 text-slate-500">{conv.lastMessageTime}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => deleteConversation(conv.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer transition-colors"
                      title="Delete Conversation"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
