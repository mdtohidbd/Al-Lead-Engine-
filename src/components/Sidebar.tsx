import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCRM } from '../context/CRMContext';

export const Sidebar: React.FC = () => {
  const { user, setAuthModalOpen, logout } = useCRM();

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `group relative flex items-center px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] font-bold'
        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 hover:border-slate-800 border border-transparent'
    }`;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-950/95 backdrop-blur-2xl text-white z-50 flex flex-col border-r border-slate-800/80 shadow-2xl">
      {/* Brand Header */}
      <div className="p-5 flex flex-col gap-2.5 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/40 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-400/30">
            <span className="material-symbols-outlined text-2xl">bolt</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              AI Lead Engine
            </span>
            <span className="text-[10px] text-emerald-400/80 font-bold tracking-wider uppercase">Enterprise v2.4</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/40 w-fit">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse"></div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            AI Engine Active
          </span>
        </div>
      </div>

      {/* Global Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-focus-within:text-emerald-400 transition-colors">
            search
          </span>
          <input
            type="text"
            placeholder="Search leads, data & tools..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5 custom-scrollbar">
        {/* Overview Module */}
        <section>
          <h3 className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400/70 mb-2">
            Overview
          </h3>
          <div className="flex flex-col gap-1">
            <NavLink to="/" className={getNavClass}>
              {({ isActive }) => (
                <>
                  <span className={`material-symbols-outlined mr-3 text-lg transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                    dashboard
                  </span>
                  <span>Dashboard</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"></div>}
                </>
              )}
            </NavLink>

            <NavLink to="/leads" className={getNavClass}>
              {({ isActive }) => (
                <>
                  <span className={`material-symbols-outlined mr-3 text-lg transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                    group
                  </span>
                  <span>Leads Management</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"></div>}
                </>
              )}
            </NavLink>

            <NavLink to="/conversations" className={getNavClass}>
              {({ isActive }) => (
                <>
                  <span className={`material-symbols-outlined mr-3 text-lg transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                    chat_bubble
                  </span>
                  <span>Conversations</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"></div>}
                </>
              )}
            </NavLink>

            <NavLink to="/contacts" className={getNavClass}>
              {({ isActive }) => (
                <>
                  <span className={`material-symbols-outlined mr-3 text-lg transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                    contacts
                  </span>
                  <span>Contacts</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"></div>}
                </>
              )}
            </NavLink>
          </div>
        </section>

        {/* Campaigns Module */}
        <section>
          <h3 className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400/70 mb-2">
            Campaigns
          </h3>
          <div className="flex flex-col gap-1">
            <NavLink to="/scheduled" className={getNavClass}>
              {({ isActive }) => (
                <>
                  <span className={`material-symbols-outlined mr-3 text-lg transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                    schedule
                  </span>
                  <span>Scheduled Messages</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"></div>}
                </>
              )}
            </NavLink>

            <NavLink to="/templates" className={getNavClass}>
              {({ isActive }) => (
                <>
                  <span className={`material-symbols-outlined mr-3 text-lg transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                    description
                  </span>
                  <span>Templates</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"></div>}
                </>
              )}
            </NavLink>

            <NavLink to="/bulk-message" className={getNavClass}>
              {({ isActive }) => (
                <>
                  <span className={`material-symbols-outlined mr-3 text-lg transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                    forward_to_inbox
                  </span>
                  <span>Bulk Message</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"></div>}
                </>
              )}
            </NavLink>
          </div>
        </section>

        {/* System Module */}
        <section>
          <h3 className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400/70 mb-2">
            System
          </h3>
          <div className="flex flex-col gap-1">
            <NavLink to="/qualification" className={getNavClass}>
              {({ isActive }) => (
                <>
                  <span className={`material-symbols-outlined mr-3 text-lg transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                    verified_user
                  </span>
                  <span>Qualification Setup</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"></div>}
                </>
              )}
            </NavLink>

            <NavLink to="/test-chat" className={getNavClass}>
              {({ isActive }) => (
                <>
                  <span className={`material-symbols-outlined mr-3 text-lg transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                    lab_profile
                  </span>
                  <span>Test Chat</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"></div>}
                </>
              )}
            </NavLink>

            <NavLink to="/settings" className={getNavClass}>
              {({ isActive }) => (
                <>
                  <span className={`material-symbols-outlined mr-3 text-lg transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                    settings
                  </span>
                  <span>Settings</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"></div>}
                </>
              )}
            </NavLink>
          </div>
        </section>
      </nav>

      {/* User Profile Footer */}
      <div className="p-3.5 border-t border-slate-800/90 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900/90 transition-colors border border-transparent hover:border-slate-800">
          <img
            src={user.avatar}
            alt="Profile"
            className="w-9 h-9 rounded-full border-2 border-emerald-500/40 object-cover cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setAuthModalOpen(true)}
          />
          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setAuthModalOpen(true)}>
            <p className="text-xs font-bold text-white truncate">{user.isLoggedIn ? user.name : 'Guest User'}</p>
            <p className="text-[10px] text-slate-400 truncate">{user.isLoggedIn ? user.email : 'Click to Sign In'}</p>
          </div>
          <button
            onClick={logout}
            className="text-slate-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10 cursor-pointer"
            title={user.isLoggedIn ? 'Sign Out' : 'Sign In'}
          >
            <span className="material-symbols-outlined text-lg">{user.isLoggedIn ? 'logout' : 'login'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
