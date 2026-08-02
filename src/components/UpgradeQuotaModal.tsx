import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';

export const UpgradeQuotaModal: React.FC = () => {
  const { isUpgradeOpen, setUpgradeOpen } = useCRM();
  const [success, setSuccess] = useState(false);

  if (!isUpgradeOpen) return null;

  const handleUpgrade = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setUpgradeOpen(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-6 border border-slate-200 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-extrabold shadow-md shadow-emerald-600/30">
              <span className="material-symbols-outlined text-xl">upgrade</span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Upgrade Quota Limit</h3>
              <p className="text-xs text-slate-400">Scale message dispatch capacity & AI scoring quota.</p>
            </div>
          </div>
          <button onClick={() => setUpgradeOpen(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {success ? (
          <div className="bg-emerald-600 text-white p-6 rounded-2xl text-center space-y-2 animate-slide-up">
            <span className="material-symbols-outlined text-3xl block">task_alt</span>
            <h4 className="font-bold text-sm">Quota Successfully Upgraded to 250k Messages/mo!</h4>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/40 flex justify-between items-center">
              <div>
                <div className="font-extrabold text-slate-900 text-sm">Enterprise Unlimited Plan</div>
                <div className="text-slate-500 text-[11px]">Up to 250,000 WhatsApp AI messages / mo</div>
              </div>
              <div className="text-right">
                <span className="text-lg font-extrabold text-slate-900">$199</span>
                <span className="text-[10px] text-slate-400 block">/month</span>
              </div>
            </div>

            <button
              onClick={handleUpgrade}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">bolt</span>
              Upgrade Instantly
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
