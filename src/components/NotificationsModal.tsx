import React from 'react';
import { useCRM } from '../context/CRMContext';

export const NotificationsModal: React.FC = () => {
  const { isNotificationsOpen, setNotificationsOpen } = useCRM();

  if (!isNotificationsOpen) return null;

  const alerts = [
    { id: 1, title: 'New Hot Lead Qualified!', desc: 'David Chen score reached 98 pts.', time: '5m ago', type: 'hot' },
    { id: 2, title: 'WhatsApp Broadcast Completed', desc: 'Retargeting List V2 sent to 850 contacts.', time: '1h ago', type: 'campaign' },
    { id: 3, title: 'AI Scoring Model Updated', desc: 'Threshold criteria updated to 85 points.', time: '3h ago', type: 'system' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex justify-end p-4 animate-fade-in" onClick={() => setNotificationsOpen(false)}>
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 border border-slate-200 mt-16 mr-6 self-start" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600">notifications</span>
            <h3 className="font-extrabold text-sm text-slate-900">Activity Notifications</h3>
          </div>
          <button onClick={() => setNotificationsOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="space-y-3 text-xs">
          {alerts.map((a) => (
            <div key={a.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 hover:bg-slate-100/80 transition-colors">
              <div className="flex justify-between items-center font-bold text-slate-900">
                <span>{a.title}</span>
                <span className="text-[10px] text-slate-400 font-normal">{a.time}</span>
              </div>
              <p className="text-[11px] text-slate-500">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
