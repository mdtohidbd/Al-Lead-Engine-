import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { leads, conversations, hotThreshold } = useCRM();

  const hotLeads = leads.filter((l) => l.status === 'Hot' || l.leadScore >= hotThreshold);

  const [pipelineView, setPipelineView] = useState<'Daily' | 'Quarterly'>('Quarterly');
  const [checklist, setChecklist] = useState([
    { id: 'c1', label: 'Company Profile & AI Persona', completed: true },
    { id: 'c2', label: 'WhatsApp API Integration', completed: true },
    { id: 'c3', label: 'Sync Historical Contacts', completed: false },
    { id: 'c4', label: 'Configure Lead Scoring Rules', completed: false },
  ]);

  const toggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedCount = checklist.filter((i) => i.completed).length;
  const checklistPercent = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="flex flex-col space-y-8 animate-fade-in pb-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Live AI Pipeline
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Lead Engine Overview
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Real-time lead qualification, automated engagement triggers, and live CRM performance analytics.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <Link
            to="/qualification"
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 hover:scale-105 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">psychology</span>
            Configure AI Rules
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Leads */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover-lift group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Leads</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 text-emerald-600 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">groups</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">2,842</h2>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-0.5">
              <span className="material-symbols-outlined text-sm">trending_up</span> +12%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">182 new entries this week</p>
        </div>

        {/* Hot Leads */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover-lift group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Hot Leads</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/15 to-amber-600/5 text-amber-600 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">local_fire_department</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">156</h2>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 flex items-center gap-0.5">
              <span className="material-symbols-outlined text-sm">trending_up</span> +5%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">Requires immediate follow-up</p>
        </div>

        {/* Messages Today */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover-lift group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Messages Today</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-600/5 text-blue-600 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">chat_bubble</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">12.4k</h2>
            <span className="text-xs font-semibold text-slate-500">Goal: 15k</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: '82%' }}></div>
          </div>
        </div>

        {/* Active Convos */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover-lift group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Convos</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/15 to-teal-600/5 text-teal-600 border border-teal-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">forum</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 justify-between">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{conversations.length * 241}</h2>
            <div className="flex items-center -space-x-2">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80" alt="Avatar" className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-xs" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80" alt="Avatar" className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-xs" />
              <span className="w-7 h-7 rounded-full bg-slate-800 text-emerald-400 text-[10px] font-bold border-2 border-white flex items-center justify-center shadow-xs">+12</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">99.4% AI response rate</p>
        </div>
      </div>

      {/* Lead Pipeline Funnel Stepper */}
      <div className="glass-card p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Lead Pipeline Funnel</h3>
            <p className="text-xs text-slate-500">Live breakdown of prospect movement across qualification stages.</p>
          </div>
          <div className="flex gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setPipelineView('Daily')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                pipelineView === 'Daily' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Daily View
            </button>
            <button
              onClick={() => setPipelineView('Quarterly')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                pipelineView === 'Quarterly' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Quarterly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* New */}
          <div className="bg-slate-50/80 p-5 flex flex-col items-center justify-between gap-3 group hover:bg-slate-100/90 transition-all border border-slate-200/80 rounded-2xl hover-lift">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">New</span>
            <span className="text-2xl font-extrabold text-slate-900">1,240</span>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-slate-400 w-full rounded-full"></div>
            </div>
          </div>

          {/* Qualifying */}
          <div className="bg-slate-50/80 p-5 flex flex-col items-center justify-between gap-3 group hover:bg-slate-100/90 transition-all border border-slate-200/80 rounded-2xl hover-lift">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Qualifying</span>
            <span className="text-2xl font-extrabold text-slate-900">842</span>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 w-[65%] rounded-full"></div>
            </div>
          </div>

          {/* Qualified */}
          <div className="bg-slate-50/80 p-5 flex flex-col items-center justify-between gap-3 group hover:bg-slate-100/90 transition-all border border-slate-200/80 rounded-2xl hover-lift">
            <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">Qualified</span>
            <span className="text-2xl font-extrabold text-slate-900">415</span>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[40%] rounded-full"></div>
            </div>
          </div>

          {/* Hot */}
          <div className="bg-amber-50/70 p-5 flex flex-col items-center justify-between gap-3 group hover:bg-amber-100/70 transition-all border border-amber-200/70 rounded-2xl hover-lift">
            <span className="text-[11px] font-extrabold text-amber-700 uppercase tracking-wider">Hot</span>
            <span className="text-2xl font-extrabold text-slate-900">156</span>
            <div className="h-2 w-full bg-amber-200/80 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-[25%] rounded-full"></div>
            </div>
          </div>

          {/* Closed */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-5 flex flex-col items-center justify-between gap-3 text-white rounded-2xl shadow-lg shadow-emerald-600/20 hover-lift">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-100">Closed Won</span>
            <span className="text-2xl font-extrabold text-white">92</span>
            <div className="h-2 w-full bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white w-[15%] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mid Content: Setup Checklist & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Setup Checklist (5 Cols) */}
        <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-extrabold text-slate-900">Engine Setup</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                {checklistPercent}% Complete
              </span>
            </div>
            <p className="text-xs text-slate-500">Complete setup tasks to optimize AI conversion performance.</p>
          </div>

          <div className="space-y-3">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className="flex items-center gap-3.5 cursor-pointer group p-3 hover:bg-slate-50/90 rounded-2xl border border-slate-100 transition-all hover:border-slate-200"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                    item.completed ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30' : 'border-2 border-slate-300 text-transparent group-hover:border-emerald-500'
                  }`}
                >
                  ✓
                </div>
                <span className={`text-xs font-bold ${item.completed ? 'text-slate-800 line-through/30' : 'text-slate-600'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500" style={{ width: `${checklistPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Quick Actions (7 Cols) */}
        <div className="lg:col-span-7 glass-card p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <h3 className="text-base font-extrabold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              to="/bulk-message"
              className="flex flex-col items-center justify-center text-center gap-3 p-5 bg-slate-50/80 hover:bg-emerald-50/60 rounded-2xl border border-slate-200/70 hover:border-emerald-400/50 transition-all hover-lift group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl text-emerald-600">
                  forward_to_inbox
                </span>
              </div>
              <span className="text-xs font-bold text-slate-800">Bulk Blast</span>
            </Link>

            <Link
              to="/templates"
              className="flex flex-col items-center justify-center text-center gap-3 p-5 bg-slate-50/80 hover:bg-emerald-50/60 rounded-2xl border border-slate-200/70 hover:border-emerald-400/50 transition-all hover-lift group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl text-emerald-600">
                  add_box
                </span>
              </div>
              <span className="text-xs font-bold text-slate-800">New Template</span>
            </Link>

            <Link
              to="/leads"
              className="flex flex-col items-center justify-center text-center gap-3 p-5 bg-slate-50/80 hover:bg-amber-50/60 rounded-2xl border border-slate-200/70 hover:border-amber-400/50 transition-all hover-lift group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl text-amber-500">
                  local_fire_department
                </span>
              </div>
              <span className="text-xs font-bold text-slate-800">Hot Leads</span>
            </Link>

            <Link
              to="/qualification"
              className="flex flex-col items-center justify-center text-center gap-3 p-5 bg-slate-50/80 hover:bg-emerald-50/60 rounded-2xl border border-slate-200/70 hover:border-emerald-400/50 transition-all hover-lift group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl text-emerald-600">
                  psychology
                </span>
              </div>
              <span className="text-xs font-bold text-slate-800">AI Prompt</span>
            </Link>
          </div>

          {/* System Engine Health Bar */}
          <div className="mt-6 p-4 bg-slate-900 text-white rounded-2xl flex flex-wrap items-center justify-between text-xs font-bold border border-slate-800 gap-2">
            <span className="uppercase text-[10px] text-slate-400 tracking-wider">System Engines:</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"></span> Auto AI Bot
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"></span> Event Triggers
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"></span> Cron Schedule
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Activity & Leads Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Leads Activity */}
        <div className="lg:col-span-8 glass-card rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Recent High-Priority Leads</h3>
              <p className="text-xs text-slate-500">Leads with highest scoring activity today.</p>
            </div>
            <Link to="/leads" className="text-xs text-emerald-600 font-extrabold hover:underline flex items-center gap-1">
              View All Leads <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {hotLeads.slice(0, 3).map((lead) => (
              <div key={lead.id} className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 rounded-2xl px-3 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-extrabold flex items-center justify-center shadow-md shadow-emerald-500/20">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{lead.name}</h4>
                    <p className="text-[11px] text-slate-500">{lead.company} • {lead.lastActive}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/70">
                  {lead.status} ({lead.leadScore} pts)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Volume Chart Box */}
        <div className="lg:col-span-4 glass-card rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Weekly Acquisition</h3>
              <p className="text-xs text-slate-500">Leads captured by AI</p>
            </div>
            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">+24%</span>
          </div>

          {/* Bar Graph Visualizer */}
          <div className="flex items-end justify-between h-36 gap-2 pt-2 px-1">
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
                  className={`w-full rounded-t-xl transition-all ${
                    bar.active ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-md shadow-emerald-500/30' : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                  style={{ height: bar.h }}
                ></div>
                <span className={`text-[10px] font-bold ${bar.active ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {bar.day}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100 text-xs">
            <div>
              <p className="text-[9px] uppercase font-extrabold text-slate-400">Peak Volume</p>
              <p className="font-extrabold text-slate-900">Wed, 2:00 PM</p>
            </div>
            <span className="material-symbols-outlined text-emerald-600 bg-emerald-100/80 p-2 rounded-xl">analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
};
