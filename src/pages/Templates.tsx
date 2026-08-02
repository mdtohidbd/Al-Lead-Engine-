import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { MessageTemplate } from '../types';

export const Templates: React.FC = () => {
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useCRM();
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'Sales Closing' as MessageTemplate['category'],
    content: '',
  });

  const categoryColors: Record<string, string> = {
    'Sales Closing': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Lead Nurture': 'bg-blue-50 text-blue-700 border-blue-200',
    'Onboarding': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Event Follow-up': 'bg-amber-50 text-amber-700 border-amber-200',
  };

  const filteredTemplates = templates.filter((tpl) => {
    const matchesCategory = selectedCategory === 'All' || tpl.category === selectedCategory;
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tpl.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.content) return;
    addTemplate({
      ...formData,
      variables: ['{{first_name}}', '{{company}}'],
    });
    setShowModal(false);
    setFormData({ name: '', category: 'Sales Closing', content: '' });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate || !editingTemplate.name) return;
    updateTemplate(editingTemplate.id, editingTemplate);
    setEditingTemplate(null);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      deleteTemplate(id);
    }
  };

  const insertVariableToNew = (tag: string) => {
    setFormData((prev) => ({ ...prev, content: prev.content + ' ' + tag }));
  };

  const insertVariableToEdit = (tag: string) => {
    if (!editingTemplate) return;
    setEditingTemplate((prev) => prev ? { ...prev, content: prev.content + ' ' + tag } : null);
  };

  return (
    <div className="flex flex-col space-y-6 animate-fade-in pb-8">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 mb-2">
            <span className="material-symbols-outlined text-sm">description</span>
            <span className="text-[11px] font-bold uppercase tracking-wider">Outreach Assets</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Message Templates</h1>
          <p className="text-xs text-slate-500 mt-1">
            Create reusable, high-converting WhatsApp templates with dynamic variables like <code className="text-emerald-600 font-mono">{"{{first_name}}"}</code> and <code className="text-emerald-600 font-mono">{"{{company}}"}</code>.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 group cursor-pointer self-start md:self-center"
        >
          <span className="material-symbols-outlined text-base group-hover:rotate-90 transition-transform">add</span>
          Create Template
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Sales Closing', 'Lead Nurture', 'Onboarding', 'Event Follow-up'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            search
          </span>
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200/80 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md hover:border-slate-300 transition-all duration-200 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                    categoryColors[tpl.category] || 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {tpl.category}
                </span>
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">schedule</span>
                  {tpl.lastModified}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">{tpl.name}</h3>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 font-mono text-xs text-slate-700 leading-relaxed break-words relative">
                {tpl.content}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex flex-wrap gap-1.5">
                {tpl.variables.map((v) => (
                  <span key={v} className="text-[10px] text-slate-600 font-mono bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60 font-medium">
                    {v}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => handleCopy(tpl.id, tpl.content)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm text-slate-500">
                    {copiedId === tpl.id ? 'check' : 'content_copy'}
                  </span>
                  {copiedId === tpl.id ? 'Copied!' : 'Copy'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingTemplate(tpl)}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Edit Template"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(tpl.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Template"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 animate-fade-in border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">New Message Template</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Template Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sales Qualification Invite"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="Sales Closing">Sales Closing</option>
                  <option value="Lead Nurture">Lead Nurture</option>
                  <option value="Onboarding">Onboarding</option>
                  <option value="Event Follow-up">Event Follow-up</option>
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Content *</label>
                  <div className="flex gap-1">
                    {['{{first_name}}', '{{company}}', '{{link}}'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => insertVariableToNew(tag)}
                        className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-mono text-[10px] rounded border border-emerald-200 font-bold"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Hello {{first_name}}, thanks for reaching out..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-600/20">
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 animate-fade-in border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Edit Template</h3>
              <button onClick={() => setEditingTemplate(null)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Template Name</label>
                <input
                  type="text"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Content</label>
                  <div className="flex gap-1">
                    {['{{first_name}}', '{{company}}', '{{link}}'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => insertVariableToEdit(tag)}
                        className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-mono text-[10px] rounded border border-emerald-200 font-bold"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows={4}
                  value={editingTemplate.content}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-600/20">
                  Update Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


