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
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#191c1e]">Leads Management</h1>
          <p className="text-xs text-gray-500">Real-time AI qualification tracking, scoring breakdown, and lead conversions.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200/80 rounded-lg py-1.5 pl-9 pr-4 text-xs text-[#191c1e] focus:outline-none focus:border-[#22c55e]"
            />
          </div>
          <button
            onClick={exportToCSV}
            className="px-3 py-2 bg-gray-100 text-gray-700 font-semibold text-xs rounded-lg hover:bg-gray-200 transition-all flex items-center gap-1.5"
            title="Export to CSV"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#22c55e] text-white font-bold text-xs rounded-lg hover:bg-emerald-600 transition-all shadow-md shadow-[#22c55e]/20 flex items-center gap-1.5 shrink-0"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            New Lead
          </button>
        </div>
      </div>

      {/* Main Grid: Data Table + Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`${selectedLead ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col transition-all`}>
          {/* Filter Bar */}
          <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-400 uppercase text-[10px] tracking-wider mr-1">Status:</span>
              {['All', 'Hot', 'Warm', 'Cold', 'Qualified'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-full font-semibold text-xs transition-colors ${
                    filterStatus === st ? 'bg-[#22c55e] text-white' : 'bg-gray-200/60 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setHotOnly(!hotOnly)}
                className={`w-9 h-5 rounded-full relative transition-colors ${
                  hotOnly ? 'bg-[#22c55e]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.75 transition-all ${
                    hotOnly ? 'right-1' : 'left-1'
                  }`}
                ></div>
              </button>
              <span className="font-semibold text-gray-700 text-xs">Hot leads only</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-400 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Lead</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`hover:bg-gray-50/80 cursor-pointer transition-colors ${
                      selectedLead?.id === lead.id ? 'bg-emerald-50/40 font-medium' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-semibold text-[#191c1e]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-[#191c1e] text-xs">{lead.name}</div>
                          <div className="text-[10px] text-gray-400 font-normal">{lead.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={lead.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border-0 cursor-pointer focus:outline-none ${
                          lead.status === 'Hot' || lead.status === 'Qualified'
                            ? 'bg-emerald-100 text-emerald-700'
                            : lead.status === 'Warm'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        <option value="Hot">Hot</option>
                        <option value="Warm">Warm</option>
                        <option value="Cold">Cold</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Unqualified">Unqualified</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            lead.leadScore >= 85 ? 'bg-emerald-500' : lead.leadScore >= 60 ? 'bg-amber-500' : 'bg-red-400'
                          }`}
                        ></span>
                        <span className="font-bold text-[#191c1e]">{lead.leadScore}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-gray-700 font-medium">{lead.company}</div>
                      <div className="text-[10px] text-gray-400">{lead.companySize || 'N/A'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                      <div>{lead.lastActive}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
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
          <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200/80 shadow-sm p-6 flex flex-col justify-between space-y-6 animate-fade-in">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-lg">
                    {selectedLead.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#191c1e]">{selectedLead.name}</h3>
                    <p className="text-[10px] text-gray-500 font-semibold">{selectedLead.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditLeadData(selectedLead);
                      setShowEditModal(true);
                    }}
                    className="p-1 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-gray-100"
                    title="Edit Lead"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>
              </div>

              {/* Lead Details */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-semibold">LEAD SCORE</span>
                    <span className="font-bold text-lg text-emerald-600">{selectedLead.leadScore} / 100</span>
                  </div>
                  <button
                    onClick={() => convertLeadToContact(selectedLead.id)}
                    className="px-2.5 py-1 bg-emerald-100 text-emerald-700 font-bold rounded text-[10px] hover:bg-emerald-200"
                  >
                    + Convert to Contact
                  </button>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Score Breakdown</span>
                  <div className="space-y-1.5 bg-gray-50 p-3 rounded-lg border border-gray-200 text-[11px]">
                    {selectedLead.scoreBreakdown?.map((sb, idx) => (
                      <div key={idx} className="flex justify-between text-gray-700">
                        <span>{sb.label}</span>
                        <span className="font-bold text-emerald-600">+{sb.points} pts</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-semibold">Email</span>
                    <span className="font-medium text-[#191c1e]">{selectedLead.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-semibold">Phone</span>
                    <span className="font-medium text-[#191c1e]">{selectedLead.phone}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 block font-semibold">Assigned Rep</span>
                  <span className="font-medium text-[#191c1e]">{selectedLead.assignedTo}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 flex gap-2">
              <button
                onClick={() => handleDelete(selectedLead.id)}
                className="w-full py-2 bg-red-50 text-red-600 font-bold text-xs rounded-lg hover:bg-red-100 transition-colors"
              >
                Delete Lead
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 animate-fade-in shadow-2xl">
            <h3 className="font-bold text-lg text-[#191c1e]">Add New Lead</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-600 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newLeadData.name}
                  onChange={(e) => setNewLeadData({ ...newLeadData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-600 block mb-1">Email</label>
                  <input
                    type="email"
                    value={newLeadData.email}
                    onChange={(e) => setNewLeadData({ ...newLeadData, email: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-600 block mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    value={newLeadData.phone}
                    onChange={(e) => setNewLeadData({ ...newLeadData, phone: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-gray-600 block mb-1">Company</label>
                <input
                  type="text"
                  value={newLeadData.company}
                  onChange={(e) => setNewLeadData({ ...newLeadData, company: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#22c55e] text-white rounded-lg font-bold hover:bg-emerald-600">
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {showEditModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 animate-fade-in shadow-2xl">
            <h3 className="font-bold text-lg text-[#191c1e]">Edit Lead</h3>
            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-600 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editLeadData.name || ''}
                  onChange={(e) => setEditLeadData({ ...editLeadData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-gray-600 block mb-1">Email</label>
                <input
                  type="email"
                  value={editLeadData.email || ''}
                  onChange={(e) => setEditLeadData({ ...editLeadData, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#22c55e] text-white rounded-lg font-bold hover:bg-emerald-600">
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
