import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';

export const CreateLeadModal: React.FC = () => {
  const { isCreateLeadOpen, setCreateLeadOpen, addLead } = useCRM();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [companySize, setCompanySize] = useState('50-200');
  const [budgetAuthority, setBudgetAuthority] = useState(true);
  const [status, setStatus] = useState<'Hot' | 'Warm' | 'Cold' | 'Qualified'>('Hot');
  const [notes, setNotes] = useState('');

  if (!isCreateLeadOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addLead({
      name,
      email,
      phone: phone || '+1 (555) 000-1122',
      company: company || 'New Prospect Corp',
      companySize,
      budgetAuthority,
      status,
      tags: ['New Lead', status],
      assignedTo: 'AI Engine',
      notes,
    });


    setCreateLeadOpen(false);
    // Reset form
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl space-y-6 border border-slate-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/30">
              <span className="material-symbols-outlined text-xl">person_add</span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Add New CRM Lead</h3>
              <p className="text-xs text-slate-400">Add a prospect manually into the AI scoring engine pipeline.</p>
            </div>
          </div>
          <button
            onClick={() => setCreateLeadOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Jonathan Blake"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="j.blake@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+1 (555) 987-6543"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Company Name</label>
              <input
                type="text"
                placeholder="Blake Holdings"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Company Size</label>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                <option value="1-10">1-10 Employees</option>
                <option value="10-50">10-50 Employees</option>
                <option value="50-200">50-200 Employees</option>
                <option value="200-500">200-500 Employees</option>
                <option value="500+">500+ Employees</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Lead Priority Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                <option value="Hot">Hot (High Intent)</option>
                <option value="Warm">Warm (In Discussion)</option>
                <option value="Cold">Cold (Exploratory)</option>
                <option value="Qualified">Qualified (Ready to Buy)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              id="budgetAuth"
              checked={budgetAuthority}
              onChange={(e) => setBudgetAuthority(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
            />
            <label htmlFor="budgetAuth" className="font-bold text-xs text-slate-700 cursor-pointer">
              Has Budget Authority / Purchasing Power (+30 Lead Score)
            </label>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Internal Notes</label>
            <textarea
              rows={3}
              placeholder="Add key notes or qualification details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCreateLeadOpen(false)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">check</span>
              Save Lead to Pipeline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
