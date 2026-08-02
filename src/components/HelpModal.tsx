import React from 'react';
import { useCRM } from '../context/CRMContext';

export const HelpModal: React.FC = () => {
  const { isHelpOpen, setHelpOpen } = useCRM();

  if (!isHelpOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-6 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold shadow-md shadow-emerald-600/30">
              <span className="material-symbols-outlined text-xl">help</span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Help & Knowledge Base</h3>
              <p className="text-xs text-slate-400">Documentation & AI lead scoring guides.</p>
            </div>
          </div>
          <button onClick={() => setHelpOpen(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-900 mb-0.5">How does AI Lead Qualification work?</div>
            <div className="text-slate-500 text-[11px]">Points are calculated automatically based on qualification rules configured under System Setup.</div>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="font-bold text-slate-900 mb-0.5">How to connect WhatsApp API?</div>
            <div className="text-slate-500 text-[11px]">Navigate to Settings &gt; Webhook Setup to paste your WhatsApp Meta developer token.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
