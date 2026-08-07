import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Lead, LeadStatus } from '../types';

export const Leads: React.FC = () => {
  const { leads, addLead, updateLeadStatus, updateLead, deleteLead, convertLeadToContact } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [hotOnly, setHotOnly] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(leads[0] || null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newLeadData, setNewLeadData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    companySize: '50-200',
    budgetAuthority: true,
    status: 'Warm' as LeadStatus,
    leadScore: 75,
    assignedTo: 'Alex Rivera',
    notes: '',
  });

  const [editLeadData, setEditLeadData] = useState<Partial<Lead>>({});

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || lead.status === filterStatus;
    const matchesHotOnly = !hotOnly || lead.status === 'Hot' || lead.leadScore >= 85;
    return matchesSearch && matchesStatus && matchesHotOnly;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadData.name || !newLeadData.phone) return;
    addLead({
      name: newLeadData.name,
      email: newLeadData.email,
      phone: newLeadData.phone,
      company: newLeadData.company,
      companySize: newLeadData.companySize,
      budgetAuthority: newLeadData.budgetAuthority,
      status: newLeadData.status,
      leadScore: newLeadData.leadScore,
      assignedTo: newLeadData.assignedTo,
      notes: newLeadData.notes,
      tags: ['Manual Input'],
      scoreBreakdown: [{ label: 'Manual Input', points: newLeadData.leadScore }],
      lastActive: 'Just now',
      createdAt: new Date().toISOString().split('T')[0],
    });
    setShowAddModal(false);
    setNewLeadData({
      name: '',
      email: '',
      phone: '',
      company: '',
      companySize: '50-200',
      budgetAuthority: true,
      status: 'Warm',
      leadScore: 75,
      assignedTo: 'Alex Rivera',
      notes: '',
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !editLeadData.name) return;
    updateLead(selectedLead.id, editLeadData);
    setSelectedLead({ ...selectedLead, ...editLeadData } as Lead);
    setShowEditModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      deleteLead(id);
      if (selectedLead?.id === id) {
        setSelectedLead(null);
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Status', 'Lead Score', 'Assigned To'];
    const rows = filteredLeads.map((l) => [l.id, l.name, l.email, l.phone, l.company, l.status, l.leadScore, l.assignedTo]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `greenlead_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="flex flex-col space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Leads Management</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time AI qualification tracking, scoring breakdown, and lead conversions.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Search leads, email, company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200/90 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-xs"
            />
          </div>
          <button
            onClick={exportToCSV}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Export to CSV"
          >
            <span className="material-symbols-outlined text-base text-slate-500">download</span>
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 shrink-0 cursor-pointer border border-emerald-400/20 hover-lift"
          >
            <span className="material-symbols-outlined text-base">add</span>
            New Lead
          </button>
        </div>
      </div>

      {/* Main Grid: Data Table + Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`${selectedLead ? 'lg:col-span-8' : 'lg:col-span-12'} glass-card rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col transition-all`}>
          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-200/70 flex flex-wrap items-center justify-between gap-4 bg-slate-50/80 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-slate-400 uppercase text-[10px] tracking-wider mr-1">Filter Status:</span>
              {['All', 'New', 'Qualifying', 'Warm', 'Hot', 'Qualified', 'Cold', 'Closed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-full font-bold text-xs transition-all cursor-pointer ${
                    filterStatus === st
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setHotOnly(!hotOnly)}
                className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer ${
                  hotOnly ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.75 transition-all shadow-xs ${
                    hotOnly ? 'right-1' : 'left-1'
                  }`}
                ></div>
              </button>
              <span className="font-bold text-slate-700 text-xs">Hot leads only</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-extrabold text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Lead</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Score</th>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Last Activity</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`hover:bg-slate-50/90 cursor-pointer transition-colors ${
                      selectedLead?.id === lead.id ? 'bg-emerald-50/50 font-medium' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-extrabold flex items-center justify-center shrink-0 shadow-xs">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 text-xs">{lead.name}</div>
                          <div className="text-[10px] text-slate-400 font-semibold">{lead.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={lead.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border-0 cursor-pointer focus:outline-none shadow-xs ${
                          lead.status === 'Hot' || lead.status === 'Qualified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : lead.status === 'Warm'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Qualifying">Qualifying</option>
                        <option value="Warm">Warm</option>
                        <option value="Hot">Hot</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Cold">Cold</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            lead.leadScore >= 85 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : lead.leadScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                        ></span>
                        <span className="font-extrabold text-slate-900">{lead.leadScore}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-bold">{lead.company}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">{lead.companySize || 'N/A'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px] font-semibold">
                      <div>{lead.lastActive}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Lead"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Details Side Panel */}
        {selectedLead && (
          <div className="lg:col-span-4 glass-card rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between space-y-6 animate-fade-in">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-emerald-500/20">
                    {selectedLead.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{selectedLead.name}</h3>
                    <p className="text-[10px] text-slate-500 font-bold">{selectedLead.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditLeadData(selectedLead);
                      setShowEditModal(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-xl hover:bg-slate-100 cursor-pointer"
                    title="Edit Lead"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>
              </div>

              {/* Lead Details */}
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-extrabold uppercase tracking-wider">AI LEAD SCORE</span>
                    <span className="font-extrabold text-xl text-emerald-600">{selectedLead.leadScore} / 100</span>
                  </div>
                  <button
                    onClick={() => convertLeadToContact(selectedLead.id)}
                    className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl text-[10px] hover:bg-emerald-500 transition-all shadow-xs cursor-pointer"
                  >
                    + Convert Contact
                  </button>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">Score Breakdown</span>
                  <div className="space-y-1.5 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 text-[11px]">
                    {selectedLead.scoreBreakdown?.map((sb, idx) => (
                      <div key={idx} className="flex justify-between text-slate-700 font-semibold">
                        <span>{sb.label}</span>
                        <span className="font-bold text-emerald-600">+{sb.points} pts</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-extrabold uppercase">Email</span>
                    <span className="font-bold text-slate-900 truncate block">{selectedLead.email}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-extrabold uppercase">Phone</span>
                    <span className="font-bold text-slate-900 truncate block">{selectedLead.phone}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-extrabold uppercase">Assigned Rep</span>
                  <span className="font-bold text-slate-900">{selectedLead.assignedTo}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <button
                onClick={() => handleDelete(selectedLead.id)}
                className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition-colors cursor-pointer border border-rose-200/50"
              >
                Delete Lead
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 animate-fade-in shadow-2xl border border-slate-200">
            <h3 className="font-extrabold text-lg text-slate-900">Add New Lead</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newLeadData.name}
                  onChange={(e) => setNewLeadData({ ...newLeadData, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none text-slate-900 font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={newLeadData.email}
                    onChange={(e) => setNewLeadData({ ...newLeadData, email: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    value={newLeadData.phone}
                    onChange={(e) => setNewLeadData({ ...newLeadData, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none text-slate-900 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Company</label>
                <input
                  type="text"
                  value={newLeadData.company}
                  onChange={(e) => setNewLeadData({ ...newLeadData, company: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none text-slate-900 font-medium"
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer">
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {showEditModal && selectedLead && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 animate-fade-in shadow-2xl border border-slate-200">
            <h3 className="font-extrabold text-lg text-slate-900">Edit Lead</h3>
            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editLeadData.name || ''}
                  onChange={(e) => setEditLeadData({ ...editLeadData, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none text-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email</label>
                <input
                  type="email"
                  value={editLeadData.email || ''}
                  onChange={(e) => setEditLeadData({ ...editLeadData, email: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none text-slate-900 font-medium"
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer">
                  Update Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
