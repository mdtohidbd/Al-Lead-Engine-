import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';

export const Scheduled: React.FC = () => {
  const { scheduledMessages, addScheduledMessage, updateScheduledMessageStatus, deleteScheduledMessage, templates } = useCRM();
  const [filterTab, setFilterTab] = useState<'All' | 'Scheduled' | 'Sent' | 'Failed'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    campaignTitle: '',
    recipientGroup: 'Hot Leads (Score > 85)',
    recipientCount: 150,
    templateName: templates[0]?.name || 'Demo Invitation Broadcast',
    scheduledTime: 'Tomorrow at 9:00 AM EST',
  });

  const filteredMessages = scheduledMessages.filter((m) => {
    const matchesTab = filterTab === 'All' || m.status === filterTab;
    const matchesSearch =
      m.campaignTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.recipientGroup.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.campaignTitle) return;
    addScheduledMessage({
      ...formData,
      status: 'Scheduled',
    });
    setShowModal(false);
    setFormData({
      campaignTitle: '',
      recipientGroup: 'Hot Leads (Score > 85)',
      recipientCount: 150,
      templateName: templates[0]?.name || 'Demo Invitation Broadcast',
      scheduledTime: 'Tomorrow at 9:00 AM EST',
    });
  };

  return (
    <div className="flex flex-col space-y-6 animate-fade-in pb-8">
      {/* Top Title & Action */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 mb-2">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span className="text-[11px] font-bold uppercase tracking-wider">Campaign Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Scheduled Messages</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage automated outreach sequences and recurring lead interactions from a central control hub.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 group cursor-pointer self-start md:self-center"
        >
          <span className="material-symbols-outlined text-base group-hover:rotate-90 transition-transform">add</span>
          New Schedule
        </button>
      </div>

      {/* Metric Header Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Schedules</span>
            <span className="material-symbols-outlined text-emerald-600 text-lg">space_dashboard</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {scheduledMessages.filter((s) => s.status === 'Scheduled').length}
          </div>
          <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">trending_up</span> Ready to dispatch
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Completed Campaigns</span>
            <span className="material-symbols-outlined text-blue-600 text-lg">task_alt</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {scheduledMessages.filter((s) => s.status === 'Sent').length}
          </div>
          <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">verified</span> 100% Sent
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Target Leads</span>
            <span className="material-symbols-outlined text-amber-500 text-lg">groups</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {scheduledMessages.reduce((acc, s) => acc + s.recipientCount, 0)}
          </div>
          <div className="text-xs font-bold text-amber-600 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">mark_email_read</span> Audience Reached
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">AI Optimizer</span>
            <span className="material-symbols-outlined text-purple-600 text-lg">auto_awesome</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 tracking-tight">Active</div>
          <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">bolt</span> Smart Timing Enabled
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {(['All', 'Scheduled', 'Sent', 'Failed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                filterTab === tab
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200/80'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            search
          </span>
          <input
            type="text"
            placeholder="Find a schedule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200/80 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Schedule Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMessages.map((msg) => (
          <div
            key={msg.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all duration-200 group"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${msg.status === 'Scheduled' ? 'bg-emerald-500 animate-pulse' : msg.status === 'Sent' ? 'bg-blue-500' : 'bg-red-500'}`}></span>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">{msg.campaignTitle}</h3>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${
                    msg.status === 'Scheduled'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : msg.status === 'Sent'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}
                >
                  {msg.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold">{msg.recipientGroup}</p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-slate-400">schedule</span>
                <span className="font-medium text-slate-800">{msg.scheduledTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-slate-400">groups</span>
                <span>Target: <strong className="text-slate-800">{msg.recipientCount}</strong> Active Leads</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 truncate">
                <span className="material-symbols-outlined text-sm text-slate-400">article</span>
                <span className="truncate">Template: <strong className="text-slate-700">{msg.templateName}</strong></span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              {msg.status === 'Scheduled' ? (
                <button
                  onClick={() => updateScheduledMessageStatus(msg.id, 'Sent')}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                  Dispatch Now
                </button>
              ) : (
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-slate-400">check_circle</span>
                  Completed
                </span>
              )}
              <button
                onClick={() => deleteScheduledMessage(msg.id)}
                className="px-3 py-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-fade-in border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">New Scheduled Campaign</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Enterprise Lead Outreach"
                  value={formData.campaignTitle}
                  onChange={(e) => setFormData({ ...formData, campaignTitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Recipient Group</label>
                <select
                  value={formData.recipientGroup}
                  onChange={(e) => setFormData({ ...formData, recipientGroup: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="Hot Leads (Score > 85)">Hot Leads (Score &gt; 85)</option>
                  <option value="Warm Leads (Score 60-84)">Warm Leads (Score 60-84)</option>
                  <option value="Cold Leads (Re-engagement)">Cold Leads (Re-engagement)</option>
                  <option value="All Qualified Leads">All Qualified Leads</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Message Template</label>
                <select
                  value={formData.templateName}
                  onChange={(e) => setFormData({ ...formData, templateName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Scheduled Date & Time</label>
                <input
                  type="text"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-600/20">
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

