import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCRM } from '../context/CRMContext';

export const Sidebar: React.FC = () => {
  const { user, setAuthModalOpen, logout } = useCRM();

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `group relative flex items-center px-4 py-3 text-xs font-semibold rounded-xl transition-all duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 text-emerald-400 border border-emerald-500/30 shadow-sm'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`;


  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-950 text-white z-50 flex flex-col border-r border-slate-800 shadow-2xl">
      {/* Brand Header */}
      <div className="p-6 flex flex-col gap-2 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold shadow-md shadow-emerald-600/30">
            <span className="material-symbols-outlined text-xl">bolt</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-white">AI Lead Engine</span>
            <span className="text-[10px] text-slate-400 font-medium">Enterprise CRM v2.4</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-1 mt-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse"></div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            AI Scoring Active
          </span>
        </div>
      </div>

      {/* Global Search */}
      <div className="px-4 pt-5 pb-2">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-focus-within:text-emerald-400 transition-colors">
            search
          </span>
          <input
            type="text"
            placeholder="Search modules & data..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all"
          />
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {/* Overview Module */}
        <section>
          <h3 className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
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
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>}
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
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>}
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
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>}
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
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>}
                </>
              )}
            </NavLink>
          </div>
        </section>

        {/* Campaigns Module */}
        <section>
          <h3 className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
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
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>}
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
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>}
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
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>}
                </>
              )}
            </NavLink>
          </div>
        </section>

        {/* System Module */}
        <section>
          <h3 className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
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
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>}
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
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>}
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
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>}
                </>
              )}
            </NavLink>
          </div>
        </section>
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt="Profile"
            className="w-9 h-9 rounded-full border border-slate-700 object-cover cursor-pointer"
            onClick={() => setAuthModalOpen(true)}
          />
          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setAuthModalOpen(true)}>
            <p className="text-xs font-bold text-white truncate">{user.isLoggedIn ? user.name : 'Guest User'}</p>
            <p className="text-[10px] text-slate-400 truncate">{user.isLoggedIn ? user.email : 'Click to Sign In'}</p>
          </div>
          <button
            onClick={logout}
            className="text-slate-400 hover:text-red-400 transition-colors p-1 cursor-pointer"
            title={user.isLoggedIn ? 'Sign Out' : 'Sign In'}
          >
            <span className="material-symbols-outlined text-lg">{user.isLoggedIn ? 'logout' : 'login'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};


