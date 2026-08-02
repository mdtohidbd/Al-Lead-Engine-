import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, user, login, signup, logout } = useCRM();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('alex@leadengine.ai');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'signin') {
      login(email, password);
    } else {
      signup(name, email, password);
    }
  };

  const handleDemoLogin = () => {
    login('alex@leadengine.ai', 'demo1234');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-6 border border-slate-200 relative overflow-hidden">
        {/* Top Glow Accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold shadow-md shadow-emerald-600/30">
              <span className="material-symbols-outlined text-xl">bolt</span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">AI Lead Engine</h3>
              <p className="text-[11px] text-slate-400 font-medium">Enterprise Authentication Portal</p>
            </div>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* User Status Bar if Logged In */}
        {user.isLoggedIn && (
          <div className="bg-emerald-50 border border-emerald-200/80 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={user.avatar} alt="User Avatar" className="w-9 h-9 rounded-full border border-emerald-300 object-cover" />
              <div>
                <div className="font-bold text-xs text-slate-900">{user.name}</div>
                <div className="text-[10px] text-emerald-700 font-semibold">{user.email} &bull; Active</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl border border-red-200 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Auth Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setTab('signin')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              tab === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              tab === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {tab === 'signup' && (
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 block mb-1">Work Email Address</label>
            <input
              type="email"
              required
              placeholder="alex@leadengine.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">login</span>
            {tab === 'signin' ? 'Sign In to Dashboard' : 'Create Account & Access'}
          </button>
        </form>

        {/* Demo 1-Click Login Trigger */}
        <div className="pt-2 border-t border-slate-100 text-center space-y-2">
          <p className="text-[11px] text-slate-400">Testing the application?</p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-emerald-600">flash_on</span>
            1-Click Demo Login (Alex Rivera)
          </button>
        </div>
      </div>
    </div>
  );
};
