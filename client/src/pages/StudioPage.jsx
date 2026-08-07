import React, { useState } from 'react';
import { Video, Sliders, Play, Key, Bot, BookOpen, Layers, CheckCircle } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Studio Header */}
      <div className="p-6 rounded-2xl bg-[#181818] border border-[#272727]">
        <div className="flex items-center gap-2 mb-2 text-[#ff0000]">
          <Video className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">YouTube Studio Masterclass Engine</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white">Create Custom AI Video Masterclass</h1>
        <p className="text-xs text-[#aaa] mt-1">
          Specify exact topic requirements, pedagogy frameworks, and delivery language styles.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Topic Input Box */}
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#272727] space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#ff0000]" /> Topic Title & Discipline Stream
          </h2>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Masterclass Subject / Topic <span className="text-[#ff0000]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Photosynthesis, Newton's Laws, Quantum Superposition..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#121212] border border-[#303030] focus:border-[#3ea6ff] text-white text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Grade Rigor Level
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#121212] border border-[#303030] text-white text-xs outline-none"
              >
                <option value="Middle School">Middle School (Grades 6-8)</option>
                <option value="High School / AP">High School / AP</option>
                <option value="Undergraduate">Undergraduate University</option>
                <option value="Graduate / Advanced">Graduate / Advanced</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Discipline Category
              </label>
              <select
                value={streamDomain}
                onChange={(e) => setStreamDomain(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#121212] border border-[#303030] text-white text-xs outline-none"
              >
                <option value="STEM / Physical Sciences">STEM / Physical Sciences</option>
                <option value="Life Sciences & Medicine">Life Sciences & Medicine</option>
                <option value="Humanities & Social Sciences">Humanities & Social Sciences</option>
                <option value="Computer Science & AI">Computer Science & AI</option>
              </select>
            </div>
          </div>
        </div>

        {/* Methodology & Language */}
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#272727] space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" /> Pedagogy & Language
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Methodology Lens
              </label>
              <select
                value={methodology}
                onChange={(e) => setMethodology(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#121212] border border-[#303030] text-white text-xs outline-none"
              >
                <option value="Feynman">Feynman Technique (Simple Analogies)</option>
                <option value="Socratic">Socratic Method (Q&A Inquiry)</option>
                <option value="First Principles">First Principles (Axiom Breakdown)</option>
                <option value="Analogical">Analogical Framework</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Delivery Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#121212] border border-[#303030] text-white text-xs outline-none"
              >
                <option value="Hinglish">Hinglish (Hindi + English EdTech)</option>
                <option value="English">English (Global Standard)</option>
                <option value="Hindi">Hindi (Pure Academic)</option>
                <option value="Spanish">Spanish (Español)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Trigger */}
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="w-full py-3.5 rounded-xl bg-[#ff0000] hover:bg-red-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Compiling Openstax & Generating Masterclass...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" /> Generate Video Masterclass
            </>
          )}
        </button>
      </form>
    </div>
  );
}
