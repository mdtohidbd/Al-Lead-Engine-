import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { QualificationQuestion } from '../types';

export const Qualification: React.FC = () => {
  const { questions, addQuestion, removeQuestion, updateQuestion, hotThreshold, setHotThreshold } = useCRM();

  const [showAddModal, setShowAddModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Omit<QualificationQuestion, 'id'>>({
    fieldName: '',
    fieldType: 'Number Range',
    hintText: '',
    required: true,
    weightPoints: 20,
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.fieldName) return;
    addQuestion(newQuestion);
    setShowAddModal(false);
    setNewQuestion({
      fieldName: '',
      fieldType: 'Number Range',
      hintText: '',
      required: true,
      weightPoints: 20,
    });
  };

  const calculateSampleScore = () => {
    return questions.reduce((acc, q) => acc + (q.required ? q.weightPoints : Math.round(q.weightPoints / 2)), 0);
  };

  const sampleScore = calculateSampleScore();

  const handleSaveLogic = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="flex flex-col space-y-8 animate-fade-in pb-8">
      {/* Header Strategy & Threshold Control */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 w-fit">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <span className="font-bold text-[11px] uppercase tracking-wider">
              Automated Intelligence &bull; Scoring Engine
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Lead Qualification Logic</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Configure how AI evaluates incoming signals to determine sales readiness and routing priority.
          </p>
        </div>

        {/* Hot Lead Threshold Slider Control */}
        <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200/80 border-l-4 border-l-emerald-600 flex items-center gap-6 self-start lg:self-center">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase text-slate-500 mb-1.5">Hot Lead Threshold</span>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={hotThreshold}
                onChange={(e) => setHotThreshold(parseInt(e.target.value))}
                className="w-36 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex items-center bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={hotThreshold}
                  onChange={(e) => setHotThreshold(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-10 text-center font-extrabold text-sm focus:outline-none text-slate-800"
                />
                <span className="text-slate-400 font-bold text-xs">%</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
          <div className="hidden sm:flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">AI Accuracy</span>
            <span className="text-lg font-extrabold text-emerald-600">94.2%</span>
          </div>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-md flex items-center gap-3 animate-slide-up">
          <span className="material-symbols-outlined text-xl">check_circle</span>
          <span className="font-bold text-xs">Qualification Logic Saved & Synced to AI Engine!</span>
        </div>
      )}

      {/* Logic Builder Interface Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Main Form Builder */}
        <div className="col-span-12 lg:col-span-8 flex flex-col space-y-4">
          <div className="flex items-center justify-between px-1 mb-1">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Qualification Questions
              <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {questions.length} ACTIVE FIELDS
              </span>
            </h2>
          </div>

          {/* Question Cards */}
          {questions.map((q) => (
            <div
              key={q.id}
              className="group relative bg-white rounded-2xl shadow-sm border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all overflow-hidden"
            >
              <div className="flex h-full">
                <div className="w-1.5 bg-emerald-500/30 group-hover:bg-emerald-500 transition-colors"></div>
                <div className="flex-1 p-5">
                  <div className="flex items-start gap-4">
                    <div className="mt-2 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500">
                      <span className="material-symbols-outlined text-xl">drag_indicator</span>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Field Name</label>
                          <input
                            type="text"
                            value={q.fieldName}
                            onChange={(e) => updateQuestion(q.id, { fieldName: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Hint / Guidance Text</label>
                          <input
                            type="text"
                            value={q.hintText}
                            onChange={(e) => updateQuestion(q.id, { hintText: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs text-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Field Type</label>
                          <select
                            value={q.fieldType}
                            onChange={(e) => updateQuestion(q.id, { fieldType: e.target.value as any })}
                            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all cursor-pointer"
                          >
                            <option value="Number Range">Number Range</option>
                            <option value="Text Input">Text Input</option>
                            <option value="Multiple Choice">Multiple Choice</option>
                            <option value="Boolean (Yes/No)">Boolean (Yes/No)</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => updateQuestion(q.id, { required: !q.required })}
                              className={`w-9 h-5 rounded-full relative transition-colors ${
                                q.required ? 'bg-emerald-600' : 'bg-slate-300'
                              }`}
                            >
                              <div
                                className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.75 transition-all shadow-xs ${
                                  q.required ? 'right-1' : 'left-1'
                                }`}
                              ></div>
                            </button>
                            <span className="text-xs font-semibold text-slate-700">Required Field</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              +{q.weightPoints} pts
                            </span>
                            <button
                              onClick={() => removeQuestion(q.id)}
                              className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove Field"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Question Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="group mt-2 flex items-center justify-center gap-3 border-2 border-dashed border-slate-300 hover:border-emerald-500 py-6 rounded-2xl hover:bg-emerald-50/40 transition-all cursor-pointer"
          >
            <div className="bg-emerald-100 text-emerald-700 p-2 rounded-xl group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-lg block">add</span>
            </div>
            <span className="font-bold text-xs text-slate-600 group-hover:text-emerald-700 transition-colors">
              Add New Qualification Field
            </span>
          </button>
        </div>

        {/* Sidebar Actions & Intelligence */}
        <div className="col-span-12 lg:col-span-4 flex flex-col space-y-6">
          {/* Live Preview Card */}
          <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-36 h-36 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
            <h3 className="text-sm font-bold mb-5 flex items-center gap-2 border-b border-slate-800 pb-3">
              <span className="material-symbols-outlined text-emerald-400 text-lg">visibility</span>
              Lead Score Live Preview
            </h3>

            <div className="space-y-3.5 text-xs">
              {questions.map((q) => (
                <div key={q.id} className="flex items-center justify-between text-slate-300">
                  <span>{q.fieldName}: Matched</span>
                  <span className="text-emerald-400 font-mono font-bold">+{q.weightPoints} pts</span>
                </div>
              ))}
              <div className="h-px bg-slate-800 my-4"></div>
              <div className="flex flex-col items-center py-2">
                <div className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                  {sampleScore}
                  <span className="text-base font-normal text-slate-500"> / 100</span>
                </div>
                <div
                  className={`px-4 py-1 rounded-full text-xs font-extrabold tracking-wider ${
                    sampleScore >= hotThreshold ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {sampleScore >= hotThreshold ? 'HOT LEAD' : 'QUALIFIED LEAD'}
                </div>
                <p className="text-[11px] text-slate-400 mt-2.5 text-center">
                  Hot Lead Threshold: <strong className="text-white">{hotThreshold}%</strong>
                </p>
              </div>
            </div>
          </div>

          {/* AI Recommendation Box */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-amber-500 text-xl">lightbulb</span>
              <h3 className="font-bold text-xs text-slate-900">AI Optimization Insight</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Based on your last 500 conversions, requiring a <span className="font-bold text-slate-900">"Budget Authority"</span> field increases demo booking rate by <span className="text-emerald-600 font-bold">+14%</span>.
            </p>
          </div>

          {/* Global Actions */}
          <button
            onClick={handleSaveLogic}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">save</span>
            Save Qualification Logic
          </button>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-fade-in border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Qualification Field</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Field Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Revenue"
                  value={newQuestion.fieldName}
                  onChange={(e) => setNewQuestion({ ...newQuestion, fieldName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Field Type</label>
                <select
                  value={newQuestion.fieldType}
                  onChange={(e) => setNewQuestion({ ...newQuestion, fieldType: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="Number Range">Number Range</option>
                  <option value="Text Input">Text Input</option>
                  <option value="Multiple Choice">Multiple Choice</option>
                  <option value="Boolean (Yes/No)">Boolean (Yes/No)</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Hint / Guidance Text</label>
                <input
                  type="text"
                  placeholder="e.g. What is your estimated annual budget?"
                  value={newQuestion.hintText}
                  onChange={(e) => setNewQuestion({ ...newQuestion, hintText: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Score Weight (Points)</label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={newQuestion.weightPoints}
                  onChange={(e) => setNewQuestion({ ...newQuestion, weightPoints: parseInt(e.target.value) || 10 })}
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
                  Add Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

