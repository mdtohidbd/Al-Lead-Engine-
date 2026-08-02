import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { useNavigate } from 'react-router-dom';

export const BulkMessage: React.FC = () => {
  const { templates, addScheduledMessage, leads, contacts, setUpgradeOpen } = useCRM();
  const navigate = useNavigate();


  const [contactSource, setContactSource] = useState<'crm' | 'contacts' | 'manual' | 'csv'>('crm');
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || '');
  const [messageText, setMessageText] = useState(
    templates[0]?.content ||
      "Hi {{first_name}}, based on {{company}}'s team size, our AI engine can save your reps 12+ hours weekly. Would you be open for a 10-min demo?"
  );
  const [pastedNumbers, setPastedNumbers] = useState('');
  const [isLaunching, setIsLaunching] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];
  const targetCount = contactSource === 'crm' ? leads.length : contactSource === 'contacts' ? contacts.length : 50;

  const insertVariable = (varTag: string) => {
    setMessageText((prev) => prev + ' ' + varTag);
  };

  const handleLaunch = () => {
    setIsLaunching(true);
    setTimeout(() => {
      addScheduledMessage({
        campaignTitle: selectedTemplate?.name || 'Bulk Campaign Broadcast',
        recipientGroup: `${contactSource.toUpperCase()} Target Segment`,
        recipientCount: targetCount,
        templateName: selectedTemplate?.name || 'Default Template',
        scheduledTime: 'Immediate Dispatch',
        status: 'Sent',
      });
      setIsLaunching(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/scheduled');
      }, 1200);
    }, 800);
  };

  // Render preview text with replaced variables
  const renderPreviewText = () => {
    return messageText
      .replace(/\{\{first_name\}\}/g, 'Sarah')
      .replace(/\{\{company\}\}/g, 'Acme Corp')
      .replace(/\{\{link\}\}/g, 'https://leadengine.ai/demo');
  };

  return (
    <div className="grid grid-cols-12 gap-8 animate-fade-in pb-8">
      {/* Main Dispatcher Column (8 Cols on XL) */}
      <div className="col-span-12 xl:col-span-8 space-y-6">
        {/* Header Title Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 mb-2">
              <span className="material-symbols-outlined text-sm">forward_to_inbox</span>
              <span className="text-[11px] font-bold uppercase tracking-wider">Campaigns &bull; Bulk Messenger</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Blast Message Dispatcher</h1>
            <p className="text-xs text-slate-500 mt-1">
              Scale your outreach across thousands of contacts with automated variable tags and smart scheduling.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 text-xs self-start sm:self-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-700">Dispatcher Engine: <strong className="text-emerald-600">Ready</strong></span>
          </div>
        </div>

        {/* Success Toast Banner */}
        {showToast && (
          <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between animate-slide-up">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-xl">check_circle</span>
              <div>
                <p className="font-bold text-xs">Campaign Blast Dispatched Successfully!</p>
                <p className="text-[11px] text-emerald-100">Redirecting to scheduled queue...</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Choose Audience Source */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-sm shadow-emerald-600/30">
                1
              </span>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Choose Audience Source</h3>
                <p className="text-xs text-slate-500">Select which group of leads or saved contacts to message.</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400">Step 1 of 3</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'crm', label: 'CRM Leads', sub: `${leads.length} Verified Active Leads`, icon: 'groups' },
              { id: 'contacts', label: 'Address Book', sub: `${contacts.length} Saved Audience Contacts`, icon: 'contacts' },
              { id: 'manual', label: 'Manual Entry', sub: 'Copy-paste list of numbers', icon: 'edit_note' },
              { id: 'csv', label: 'CSV Import', sub: 'Upload batch list file (.csv)', icon: 'upload_file' },
            ].map((src) => {
              const isSelected = contactSource === src.id;
              return (
                <button
                  key={src.id}
                  onClick={() => setContactSource(src.id as any)}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-4 transition-all duration-200 relative overflow-hidden group cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/80'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                  }`}>
                    <span className="material-symbols-outlined text-xl block">{src.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-2 mb-0.5">
                      {src.label}
                      {isSelected && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.2 rounded-md">
                          Selected
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium truncate">{src.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Recipient Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-sm shadow-emerald-600/30">
                2
              </span>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Recipients Selected</h3>
                <p className="text-xs text-slate-500">Target audience summary and total reach.</p>
              </div>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full border border-emerald-200/80 shadow-xs">
              {targetCount} Target Recipients
            </span>
          </div>

          {contactSource === 'manual' ? (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Phone Numbers Input</label>
              <textarea
                rows={4}
                placeholder="Paste phone numbers (one per line, e.g. +15552345678)..."
                value={pastedNumbers}
                onChange={(e) => setPastedNumbers(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          ) : (
            <div className="bg-slate-50/80 p-4.5 rounded-xl border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-emerald-600 text-xl">groups</span>
                <div>
                  <span className="font-bold text-slate-900">Target Segment:</span> {contactSource.toUpperCase()} Target Audience ({targetCount} verified contacts ready)
                </div>
              </div>
              <span className="text-[11px] bg-emerald-600 text-white px-3 py-1 rounded-lg font-bold shadow-xs">
                Audience Verified
              </span>
            </div>
          )}
        </div>

        {/* Step 3: Compose Message & Live WhatsApp Preview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-sm shadow-emerald-600/30">
                3
              </span>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Compose & Preview Message</h3>
                <p className="text-xs text-slate-500">Select template preset and preview live WhatsApp rendering.</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400">Step 3 of 3</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Editor Area (7 Cols) */}
            <div className="lg:col-span-7 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Select Template Preset</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => {
                    setSelectedTemplateId(e.target.value);
                    const found = templates.find((t) => t.id === e.target.value);
                    if (found) setMessageText(found.content);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} — [{t.category}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700">Message Text</label>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400">Quick Tag:</span>
                    {['{{first_name}}', '{{company}}', '{{link}}'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => insertVariable(tag)}
                        className="px-1.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-mono text-[10px] font-bold rounded border border-emerald-200 transition-colors"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows={6}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5 px-1">
                  <span>{messageText.length} Characters &bull; 1 Segment</span>
                  <span>Variables Replaced in Real-Time</span>
                </div>
              </div>
            </div>

            {/* Real-time WhatsApp Smartphone Preview Bubble (5 Cols) */}
            <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-bold text-white">Live WhatsApp Preview</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Mock Screen</span>
              </div>

              {/* Chat Bubble Simulation */}
              <div className="bg-[#0b141a] p-4 rounded-xl flex-1 flex flex-col justify-end space-y-2 min-h-[160px]">
                <div className="bg-[#005c4b] text-white p-3.5 rounded-xl rounded-tr-xs text-xs font-sans shadow-md space-y-1 max-w-[90%] self-end">
                  <p className="leading-relaxed whitespace-pre-wrap">{renderPreviewText()}</p>
                  <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-200">
                    <span>12:15 PM</span>
                    <span className="material-symbols-outlined text-xs">done_all</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 text-center">
                Sample preview shown with recipient data: <strong className="text-slate-200">Sarah Jenkins (Acme Corp)</strong>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="material-symbols-outlined text-emerald-600 text-lg">bolt</span>
              <span>Estimated Delivery Rate: <strong className="text-slate-800">~2,400 msg/min</strong></span>
            </div>
            <button
              onClick={handleLaunch}
              disabled={isLaunching}
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              {isLaunching ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Dispatching Campaign...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform">send</span>
                  Send Campaign Blast
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar Column (4 Cols on XL) */}
      <div className="col-span-12 xl:col-span-4 space-y-6">
        {/* Job Execution History */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-500 text-lg">history</span>
              Job Execution History
            </h3>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Recent Runs</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Job 1 */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-3 hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] font-bold text-slate-400">JOBID_92841</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-emerald-200">
                  DONE
                </span>
              </div>
              <div className="font-bold text-slate-900 text-xs">Flash Sale Batch A</div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full w-[98%] rounded-full"></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Sent: <strong className="text-slate-900">1,240</strong></span>
                <span>Skipped: <strong className="text-slate-400">12</strong></span>
              </div>
            </div>

            {/* Job 2 */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-3 hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] font-bold text-slate-400">JOBID_92712</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-emerald-200">
                  DONE
                </span>
              </div>
              <div className="font-bold text-slate-900 text-xs">Retargeting List V2</div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full w-[99%] rounded-full"></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Sent: <strong className="text-slate-900">850</strong></span>
                <span>Skipped: <strong className="text-slate-400">4</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Quota Card */}
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white p-6 rounded-2xl shadow-xl space-y-4 relative overflow-hidden border border-emerald-500/20">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold">Monthly Usage Quota</span>
            <span className="material-symbols-outlined text-emerald-400 text-lg">donut_large</span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              42.8k <span className="text-sm font-normal text-slate-400">/ 50k</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">84% of messages consumed this billing cycle.</p>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden p-0.5">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full w-[84%] shadow-sm"></div>
          </div>
          <button
            onClick={() => setUpgradeOpen(true)}
            className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all border border-white/15 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">upgrade</span>
            Upgrade Quota Limit
          </button>

        </div>
      </div>
    </div>
  );
};


