import React, { useState } from 'react';
import { Sparkles, Sliders, Play, Key, Bot, Languages, BookOpen, Layers, CheckCircle } from 'lucide-react';

export default function StudioPage({ onGenerate, loading, initialTopic = '' }) {
  const [topic, setTopic] = useState(initialTopic);
  const [gradeLevel, setGradeLevel] = useState('High School / AP');
  const [streamDomain, setStreamDomain] = useState('STEM / Physical Sciences');
  const [methodology, setMethodology] = useState('Feynman');
  const [language, setLanguage] = useState('Hinglish');
  const [style, setStyle] = useState('Modern EdTech Canvas');
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('heybuddy_gemini_key') || '');
  const [openaiKey, setOpenaiKey] = useState(localStorage.getItem('heybuddy_openai_key') || '');
  const [useHeyGen, setUseHeyGen] = useState(false);
  const [avatarId, setAvatarId] = useState('Daisy-in-suit');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    if (geminiKey) localStorage.setItem('heybuddy_gemini_key', geminiKey);
    if (openaiKey) localStorage.setItem('heybuddy_openai_key', openaiKey);

    onGenerate({
      topic,
      gradeLevel,
      streamDomain,
      methodology,
      language,
      style,
      apiKey: geminiKey,
      openaiKey,
      useHeyGen,
      avatarId
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Studio Header */}
      <div className="glass-panel p-8 rounded-2xl border border-indigo-500/20 shadow-glow-indigo">
        <div className="flex items-center gap-3 mb-2 text-indigo-400">
          <Sliders className="w-6 h-6" />
          <span className="text-xs font-semibold uppercase tracking-wider">AI Masterclass Generator Studio</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Create Custom AI Video Masterclass</h1>
        <p className="text-slate-400 text-sm mt-1">
          Configure deep pedagogical parameters, choose visual styles, and generate animated visual scripts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Topic & Stream Section */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" /> Topic & Academic Context
          </h2>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Masterclass Topic Title <span className="text-indigo-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Photosynthesis & Light Reactions, Quantum Entanglement, Thermodynamics..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-white placeholder-slate-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Grade Level
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-white text-sm"
              >
                <option value="Middle School">Middle School (Grades 6-8)</option>
                <option value="High School / AP">High School / AP</option>
                <option value="Undergraduate">Undergraduate University</option>
                <option value="Graduate / Advanced">Graduate / Advanced</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Discipline Stream
              </label>
              <select
                value={streamDomain}
                onChange={(e) => setStreamDomain(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-white text-sm"
              >
                <option value="STEM / Physical Sciences">STEM / Physical Sciences</option>
                <option value="Life Sciences & Medicine">Life Sciences & Medicine</option>
                <option value="Humanities & Social Sciences">Humanities & Social Sciences</option>
                <option value="Computer Science & AI">Computer Science & AI</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pedagogical Methodology & Language */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" /> Pedagogy & Language Style
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Methodology Lens
              </label>
              <select
                value={methodology}
                onChange={(e) => setMethodology(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-white text-sm"
              >
                <option value="Feynman">Feynman Technique (Simple Intuitive Analogies)</option>
                <option value="Socratic">Socratic Method (Inquiry & Q&A Driven)</option>
                <option value="First Principles">First Principles (Deconstruct Axioms)</option>
                <option value="Analogical">Analogical Storytelling (Real-World Metaphors)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Delivery Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-white text-sm"
              >
                <option value="Hinglish">Hinglish (Hindi + English EdTech Style)</option>
                <option value="English">English (Global Standard)</option>
                <option value="Hindi">Hindi (Pure Academic Hindi)</option>
                <option value="Spanish">Spanish (Español)</option>
              </select>
            </div>
          </div>
        </div>

        {/* HeyGen AI Avatar Presenter Configuration */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-400" /> HeyGen AI Avatar Integration
            </h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useHeyGen}
                onChange={(e) => setUseHeyGen(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {useHeyGen && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 animate-fadeIn">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Avatar Presenter Model
                </label>
                <select
                  value={avatarId}
                  onChange={(e) => setAvatarId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-white text-sm"
                >
                  <option value="Daisy-in-suit">Daisy (Professional Academic Suit)</option>
                  <option value="Eric-in-shirt">Eric (Casual Professor Shirt)</option>
                  <option value="Monica-in-coat">Monica (Lab Coat Specialist)</option>
                </select>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
                <div className="font-semibold flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> HeyGen Sync Ready
                </div>
                <p>Generates realistic lip-synced video presenter along with canvas visual diagrams.</p>
              </div>
            </div>
          )}
        </div>

        {/* API Keys Configuration */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-400" /> Custom API Keys (Optional)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Google Gemini API Key
              </label>
              <input
                type="password"
                placeholder="AIzaSy... (Leave empty for default server key)"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-white text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                OpenAI API Key
              </label>
              <input
                type="password"
                placeholder="sk-proj-... (Optional GPT-4o fallback)"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-white text-xs"
              />
            </div>
          </div>
        </div>

        {/* Generate Trigger Button */}
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-lg shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Ingesting Educational Sources & Generating Masterclass...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6" /> Generate AI Masterclass Lecture
            </>
          )}
        </button>
      </form>
    </div>
  );
}
