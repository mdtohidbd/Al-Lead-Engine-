import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';

export const Settings: React.FC = () => {
  const { settings, updateSettings, resetToDefaults } = useCRM();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Settings saved successfully!');
  };

  return (
    <div className="flex flex-col space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg font-bold text-xs flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex items-end justify-between border-b border-gray-200/80 pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-1">
            System Configuration
          </p>
          <h1 className="text-2xl font-bold text-[#151c27]">AI Controls & API Integration</h1>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Configure your AI Lead Engine's primary parameters, models, WhatsApp webhooks, and local database.
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">sync</span> Live Synced
        </span>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Toggle AI Agent */}
        <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-200/80 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">psychology</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#151c27]">AI Auto-Responder Engine</h3>
              <p className="text-[11px] text-gray-500">Allow AI to automatically analyze incoming WhatsApp leads and reply.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => updateSettings({ aiActive: !settings.aiActive })}
            className={`w-12 h-6 rounded-full relative transition-colors ${
              settings.aiActive ? 'bg-[#22c55e]' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                settings.aiActive ? 'right-1' : 'left-1'
              }`}
            ></div>
          </button>
        </div>

        {/* AI Model Configuration */}
        <div className="p-5 bg-white rounded-xl border border-gray-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[#151c27] flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-base">memory</span>
            AI Intelligence Model Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-gray-600 block mb-1">Model Selection</label>
              <select
                value={settings.model || 'claude'}
                onChange={(e) => updateSettings({ model: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-medium text-[#151c27] focus:outline-none focus:border-[#22c55e]"
              >
                <option value="claude">Claude 3.5 Sonnet (Recommended)</option>
                <option value="gemini">Gemini 2.5 Flash (Fastest)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-gray-600 block mb-1">Creativity Temperature: {settings.temperature || 0.7}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.temperature || 0.7}
                onChange={(e) => updateSettings({ temperature: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#22c55e]"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp & Webhook Settings */}
        <div className="p-5 bg-white rounded-xl border border-gray-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[#151c27] flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-base">hub</span>
            API Keys & WhatsApp Webhooks
          </h3>
          <div className="space-y-3">
            <div>
              <label className="font-bold text-gray-600 block mb-1">WhatsApp Access Token</label>
              <input
                type="password"
                value={settings.apiKey || ''}
                onChange={(e) => updateSettings({ apiKey: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-mono text-[#151c27] focus:outline-none focus:border-[#22c55e]"
                placeholder="EAAL..."
              />
            </div>
            <div>
              <label className="font-bold text-gray-600 block mb-1">WhatsApp Phone Number ID</label>
              <input
                type="text"
                value={settings.phoneNumber || ''}
                onChange={(e) => updateSettings({ phoneNumber: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-mono text-[#151c27] focus:outline-none focus:border-[#22c55e]"
                placeholder="1045..."
              />
            </div>
            <div>
              <label className="font-bold text-gray-600 block mb-1">WhatsApp Webhook Verify Token</label>
              <input
                type="text"
                value={settings.verifyToken || ''}
                onChange={(e) => updateSettings({ verifyToken: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-mono text-[#151c27] focus:outline-none focus:border-[#22c55e]"
                placeholder="E.g. primequalify4242"
              />
            </div>
            <div>
              <label className="font-bold text-gray-600 block mb-1">WhatsApp Webhook Listener URL (Informational)</label>
              <input
                type="text"
                readOnly
                value={`${settings.webhookUrl || ''}/webhook/whatsapp`}
                className="w-full bg-gray-100 border border-gray-200 rounded-lg p-2 font-mono text-gray-500 cursor-not-allowed focus:outline-none"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                Note: This is not saved to the database. For local testing with Meta, replace <code className="bg-gray-100 px-1 rounded">http://localhost:3001</code> with your public <b>ngrok URL</b>.
              </p>
            </div>
          </div>
        </div>

        {/* Save & Reset Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset database to initial demo state? All local edits will be restored.')) {
                resetToDefaults();
                showToast('Database reset to defaults!');
              }
            }}
            className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors"
          >
            Reset All Local Data
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#22c55e] text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-md shadow-[#22c55e]/20"
          >
            Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
};
