import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { leads, conversations, hotThreshold } = useCRM();

  const hotLeads = leads.filter((l) => l.status === 'Hot' || l.leadScore >= hotThreshold);
  const totalLeads = leads.length;

  const [pipelineView, setPipelineView] = useState<'Daily' | 'Quarterly'>('Quarterly');
  const [checklist, setChecklist] = useState([
    { id: 'c1', label: 'Company Profile', completed: true },
    { id: 'c2', label: 'WhatsApp Token', completed: true },
    { id: 'c3', label: 'Load Past Messages', completed: false },
    { id: 'c4', label: 'Team Notifications', completed: false },
  ]);

  const toggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedCount = checklist.filter((i) => i.completed).length;
  const checklistPercent = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="flex flex-col space-y-8 animate-fade-in">
      {/* Top Banner & Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Leads */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Leads</span>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">groups</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-[#151c27]">2,842</h2>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <span className="material-symbols-outlined text-sm">trending_up</span> +12%
            </span>
          </div>
        </div>

        {/* Hot Leads */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Hot Leads</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">local_fire_department</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-[#151c27]">156</h2>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <span className="material-symbols-outlined text-sm">trending_up</span> +5%
            </span>
          </div>
        </div>

        {/* Messages Today */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Messages Today</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">chat_bubble</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-[#151c27]">12.4k</h2>
            <span className="text-xs text-gray-400">Goal: 15k</span>
          </div>
        </div>

        {/* Active Convos */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Convos</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">forum</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 justify-between">
            <h2 className="text-3xl font-bold text-[#151c27]">{conversations.length * 241}</h2>
            <div className="flex items-center -space-x-2">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80" alt="Avatar" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80" alt="Avatar" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
              <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-[9px] font-bold border-2 border-white flex items-center justify-center">+12</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Pipeline Funnel Stepper */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#151c27]">Lead Pipeline Funnel</h3>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setPipelineView('Daily')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                pipelineView === 'Daily' ? 'bg-white text-[#151c27] shadow-sm' : 'text-gray-500'
              }`}
            >
              Daily View
            </button>
            <button
              onClick={() => setPipelineView('Quarterly')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                pipelineView === 'Quarterly' ? 'bg-primary text-white shadow-sm' : 'text-gray-500'
              }`}
            >
              Quarterly
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row w-full gap-2 overflow-hidden rounded-2xl">
          {/* New */}
          <div className="flex-1 bg-gray-50 p-5 flex flex-col items-center gap-2 group hover:bg-gray-100 transition-colors border border-gray-200/60 rounded-xl">
            <span className="text-xs font-bold text-gray-500 uppercase">New</span>
            <span className="text-2xl font-bold text-[#151c27]">1,240</span>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gray-400 w-full"></div>
            </div>
          </div>

          {/* Qualifying */}
          <div className="flex-1 bg-gray-50 p-5 flex flex-col items-center gap-2 group hover:bg-gray-100 transition-colors border border-gray-200/60 rounded-xl">
            <span className="text-xs font-bold text-gray-500 uppercase">Qualifying</span>
            <span className="text-2xl font-bold text-[#151c27]">842</span>
            <div className="h-1.5 w-full bg-primary/20 rounded-full overflow-hidden">
              <div className="h-full bg-primary/40 w-[65%]"></div>
            </div>
          </div>

          {/* Qualified */}
          <div className="flex-1 bg-gray-50 p-5 flex flex-col items-center gap-2 group hover:bg-gray-100 transition-colors border border-gray-200/60 rounded-xl">
            <span className="text-xs font-bold text-gray-700 uppercase">Qualified</span>
            <span className="text-2xl font-bold text-[#151c27]">415</span>
            <div className="h-1.5 w-full bg-primary/20 rounded-full overflow-hidden">
              <div className="h-full bg-primary/60 w-[40%]"></div>
            </div>
          </div>

          {/* Hot */}
          <div className="flex-1 bg-primary/10 p-5 flex flex-col items-center gap-2 group hover:bg-primary/20 transition-colors border border-primary/20 rounded-xl">
            <span className="text-xs font-bold text-primary uppercase">Hot</span>
            <span className="text-2xl font-bold text-[#151c27]">156</span>
            <div className="h-1.5 w-full bg-primary/30 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[25%]"></div>
            </div>
          </div>

          {/* Closed */}
          <div className="flex-1 bg-primary p-5 flex flex-col items-center gap-2 text-white rounded-xl shadow-md">
            <span className="text-xs font-bold uppercase">Closed</span>
            <span className="text-2xl font-bold">92</span>
            <div className="h-1.5 w-full bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white w-[15%]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mid Content: Setup Checklist & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Setup Checklist (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#151c27]">Setup Checklist</h3>
            <p className="text-xs text-gray-500 mt-1">Complete these steps to maximize your AI conversion rate.</p>
          </div>

          <div className="space-y-3">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    item.completed ? 'bg-primary text-white' : 'border-2 border-gray-300 text-transparent group-hover:border-primary'
                  }`}
                >
                  ✓
                </div>
                <span className={`text-xs font-semibold ${item.completed ? 'text-[#151c27]' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mb-2">
              <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${checklistPercent}%` }}></div>
            </div>
            <p className="text-[11px] font-bold text-gray-500">{checklistPercent}% Completed</p>
          </div>
        </div>

        {/* Quick Actions (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <h3 className="text-base font-bold text-[#151c27] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/bulk-message"
              className="flex flex-col items-center justify-center gap-3 p-6 bg-gray-50 hover:bg-[#f0f3ff] rounded-2xl border border-gray-200/60 hover:border-primary transition-all group"
            >
              <span className="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform">
                forward_to_inbox
              </span>
              <span className="text-xs font-bold text-[#151c27]">Send Bulk Message</span>
            </Link>

            <Link
              to="/templates"
              className="flex flex-col items-center justify-center gap-3 p-6 bg-gray-50 hover:bg-[#f0f3ff] rounded-2xl border border-gray-200/60 hover:border-primary transition-all group"
            >
              <span className="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform">
                add_box
              </span>
              <span className="text-xs font-bold text-[#151c27]">New Template</span>
            </Link>

            <Link
              to="/leads"
              className="flex flex-col items-center justify-center gap-3 p-6 bg-gray-50 hover:bg-[#f0f3ff] rounded-2xl border border-gray-200/60 hover:border-primary transition-all group"
            >
              <span className="material-symbols-outlined text-3xl text-amber-500 group-hover:scale-110 transition-transform">
                local_fire_department
              </span>
              <span className="text-xs font-bold text-[#151c27]">View Hot Leads</span>
            </Link>

            <Link
              to="/qualification"
              className="flex flex-col items-center justify-center gap-3 p-6 bg-gray-50 hover:bg-[#f0f3ff] rounded-2xl border border-gray-200/60 hover:border-primary transition-all group"
            >
              <span className="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform">
                psychology
              </span>
              <span className="text-xs font-bold text-[#151c27]">Configure AI</span>
            </Link>
          </div>

          {/* System Engine Health Bar */}
          <div className="mt-6 p-4 bg-[#f0f3ff] rounded-xl border border-primary/20 flex flex-wrap items-center justify-between text-xs font-semibold text-[#151c27]">
            <span className="uppercase text-[10px] text-gray-500 font-bold">System Engines:</span>
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Auto AI Reply
            </span>
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Event Triggers
            </span>
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Scheduled Messages
            </span>
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Bulk Messaging
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Activity & Leads This Week Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Leads Activity */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-[#151c27]">Recent Activity</h3>
            <Link to="/leads" className="text-xs text-primary font-bold hover:underline">
              View All Leads &rarr;
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {hotLeads.slice(0, 3).map((lead) => (
              <div key={lead.id} className="py-3 flex items-center justify-between hover:bg-gray-50 rounded-xl px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#151c27]">{lead.name}</h4>
                    <p className="text-[11px] text-gray-500">{lead.company} • {lead.lastActive}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                  {lead.status} ({lead.leadScore} pts)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Volume Chart Box */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-[#151c27]">Leads This Week</h3>
            <span className="text-xs font-bold text-primary bg-emerald-50 px-2 py-0.5 rounded-full">+24%</span>
          </div>

          {/* Bar Graph Simulation */}
          <div className="flex items-end justify-between h-36 gap-2 pt-2">
            {[
              { day: 'M', h: '40%' },
              { day: 'T', h: '65%' },
              { day: 'W', h: '95%', active: true },
              { day: 'T', h: '55%' },
              { day: 'F', h: '45%' },
              { day: 'S', h: '20%' },
              { day: 'S', h: '15%' },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={`w-full rounded-t-lg transition-all ${
                    bar.active ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-gray-200 hover:bg-primary/40'
                  }`}
                  style={{ height: bar.h }}
                ></div>
                <span className={`text-[10px] font-bold ${bar.active ? 'text-primary' : 'text-gray-400'}`}>
                  {bar.day}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100 text-xs">
            <div>
              <p className="text-[9px] uppercase font-bold text-gray-400">Peak Volume</p>
              <p className="font-bold text-[#151c27]">Wed, 2 PM</p>
            </div>
            <span className="material-symbols-outlined text-primary">analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
};
