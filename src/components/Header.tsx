import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';

export const Header: React.FC = () => {
  const {
    user,
    exportData,
    setCreateLeadOpen,
    isNotificationsOpen,
    setNotificationsOpen,
    setHelpOpen,
    setAuthModalOpen,
  } = useCRM();

  const [toastMessage, setToastMessage] = useState('');

  const handleExport = () => {
    exportData();
    setToastMessage('CRM Leads Data Exported (.CSV)');
    setTimeout(() => setToastMessage(''), 2500);
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 z-40 flex items-center justify-between px-8 text-slate-900 shadow-sm transition-all">
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-slate-100 px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-emerald-500/20 shadow-xs">
          <span className="material-symbols-outlined text-emerald-600 text-sm animate-pulse">bolt</span>
          <span className="text-xs font-semibold text-slate-700">
            Daily Quota Usage: <strong className="text-emerald-600 font-extrabold">84%</strong>
          </span>
        </div>

        {toastMessage && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-md shadow-emerald-500/20 animate-slide-up flex items-center gap-2 border border-emerald-400/30">
            <span className="material-symbols-outlined text-sm">download_done</span>
            {toastMessage}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Export Button */}
        <button
          onClick={handleExport}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-bold text-slate-700 shadow-xs flex items-center gap-2 transition-all hover:border-slate-300 hover:shadow-sm cursor-pointer"
          title="Export CSV"
        >
          <span className="material-symbols-outlined text-base text-slate-500">download</span>
          Export Data
        </button>

        {/* Create Lead Button */}
        <button
          onClick={() => setCreateLeadOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 flex items-center gap-2 transition-all hover-lift cursor-pointer border border-emerald-400/20"
        >
          <span className="material-symbols-outlined text-base font-bold">add</span>
          Create Lead
        </button>

        <div className="h-5 w-px bg-slate-200/80 mx-1"></div>

        {/* Notifications */}
        <button
          onClick={() => setNotificationsOpen(!isNotificationsOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-all relative cursor-pointer"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse"></span>
        </button>

        {/* Help */}
        <button
          onClick={() => setHelpOpen(true)}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-all cursor-pointer"
          title="Help & Docs"
        >
          <span className="material-symbols-outlined text-xl">help</span>
        </button>

        <div className="h-5 w-px bg-slate-200/80 mx-1"></div>

        {/* Auth / Login Button */}
        <button
          onClick={() => setAuthModalOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80 text-xs font-bold text-slate-800 transition-all shadow-xs cursor-pointer"
        >
          <img src={user.avatar} alt="User Avatar" className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-500/40" />
          <span>{user.isLoggedIn ? user.name.split(' ')[0] : 'Sign In'}</span>
          <span className="material-symbols-outlined text-sm text-slate-400">key</span>
        </button>
      </div>
    </header>
  );
};
