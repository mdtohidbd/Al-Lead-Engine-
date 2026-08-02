import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Contact } from '../types';

export const Contacts: React.FC = () => {
  const { contacts, addContact, updateContact, deleteContact } = useCRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    tags: 'Inbound',
  });

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    addContact({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      company: formData.company,
      tags: formData.tags.split(',').map((t) => t.trim()),
      status: 'Warm',
      totalMessagesSent: 1,
      lastContacted: 'Just now',
    });
    setShowAddModal(false);
    setFormData({ name: '', phone: '', email: '', company: '', tags: 'Inbound' });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContact) return;
    updateContact(editingContact.id, editingContact);
    setShowEditModal(false);
    setEditingContact(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      deleteContact(id);
    }
  };

  return (
    <div className="flex flex-col space-y-6 animate-fade-in pb-8">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 mb-2">
            <span className="material-symbols-outlined text-sm">contacts</span>
            <span className="text-[11px] font-bold uppercase tracking-wider">Address Book</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Contacts Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage all saved audience contacts for WhatsApp campaigns & direct messaging.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 group cursor-pointer self-start md:self-center"
        >
          <span className="material-symbols-outlined text-base group-hover:rotate-90 transition-transform">add</span>
          Add Contact
        </button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900">{contacts.length}</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Saved Contacts</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined">chat</span>
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900">
              {contacts.reduce((acc, c) => acc + c.totalMessagesSent, 0)}
            </div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Messages Dispatched</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined">verified</span>
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900">100%</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">WhatsApp Verified</div>
          </div>
        </div>
      </div>

      {/* Toolbar & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            search
          </span>
          <input
            type="text"
            placeholder="Search contact name, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
        <span className="text-xs font-bold text-slate-500 hidden sm:inline">{filteredContacts.length} Contacts Listed</span>
      </div>

      {/* Contacts Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-4 px-5">Contact Name</th>
                <th className="py-4 px-5">Phone Number</th>
                <th className="py-4 px-5">Company</th>
                <th className="py-4 px-5">Tags</th>
                <th className="py-4 px-5">Messages Sent</th>
                <th className="py-4 px-5">Last Contacted</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="py-4 px-5 font-bold text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center border border-emerald-200">
                        {getInitials(contact.name)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{contact.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{contact.email || 'No email registered'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-slate-700 font-mono font-medium">{contact.phone}</td>
                  <td className="py-4 px-5 text-slate-700 font-medium">{contact.company || '—'}</td>
                  <td className="py-4 px-5">
                    <div className="flex flex-wrap gap-1.5">
                      {contact.tags.map((tg) => (
                        <span key={tg} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          {tg}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-5 font-extrabold text-slate-900">{contact.totalMessagesSent}</td>
                  <td className="py-4 px-5 text-slate-500 text-[11px] font-medium">{contact.lastContacted}</td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setEditingContact(contact);
                          setShowEditModal(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit Contact"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Contact"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-fade-in border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">New Contact</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +1 (555) 234-5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Company / Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-600/20">
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingContact && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-fade-in border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Edit Contact</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingContact.name}
                  onChange={(e) => setEditingContact({ ...editingContact, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editingContact.phone}
                  onChange={(e) => setEditingContact({ ...editingContact, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Company</label>
                <input
                  type="text"
                  value={editingContact.company}
                  onChange={(e) => setEditingContact({ ...editingContact, company: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-600/20">
                  Update Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

