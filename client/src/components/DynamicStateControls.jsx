import React from 'react';
import { useAppStore } from '../store/zustand';
import { Sparkles, Shuffle, Languages, Brain, Mic, UserCheck, Palette } from 'lucide-react';

export default function DynamicStateControls() {
  const {
    pedagogyStyle,
    setPedagogyStyle,
    targetLanguage,
    setTargetLanguage,
    voiceAccent,
    personaAvatar,
    whiteboardTheme,
    shuffleStyles
  } = useAppStore();

  const PEDAGOGIES = [
    { id: 'Feynman', label: 'Feynman', desc: 'Simplified & intuitive child-friendly analogies' },
    { id: 'Socratic', label: 'Socratic', desc: 'Guided questions & self-discovery' },
    { id: 'Analogical', label: 'Analogical', desc: 'Vivid narrative stories & real-world metaphors' },
    { id: 'Deep Dive Academic', label: 'Deep Dive', desc: 'Rigorous proofs, math notation & edge cases' }
  ];

  const LANGUAGES = ['English', 'Spanish', 'Hindi', 'French', 'German', 'Mandarin', 'Hinglish'];

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-2xl shadow-xl mb-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" />
            Dynamic Pedagogy & Voice Controls
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Customize teaching methodology, target translation language, voice accent, and whiteboard persona.
          </p>
        </div>

        {/* Style Shuffle Button */}
        <button
          onClick={shuffleStyles}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2 active:scale-95"
        >
          <Shuffle className="w-4 h-4 animate-spin-slow" />
          <span>Style Shuffle</span>
        </button>
      </div>

      {/* Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Methodology Selection Tabs */}
        <div className="md:col-span-7">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
            Pedagogical Methodology:
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PEDAGOGIES.map((p) => {
              const isActive = pedagogyStyle === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPedagogyStyle(p.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold">{p.label}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{p.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Language & Voice Accent Selection */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center space-x-3">
            <Languages className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="flex-1">
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Target Language
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Profile Info Pills */}
          <div className="flex items-center flex-wrap gap-2 text-[11px] text-slate-400 pt-1">
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-1.5">
              <Mic className="w-3 h-3 text-cyan-400" />
              {voiceAccent}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-1.5">
              <UserCheck className="w-3 h-3 text-purple-400" />
              {personaAvatar}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-1.5">
              <Palette className="w-3 h-3 text-emerald-400" />
              {whiteboardTheme}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
