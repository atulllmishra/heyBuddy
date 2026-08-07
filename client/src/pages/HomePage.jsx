import React, { useState, useEffect } from 'react';
import { Sparkles, Play, BookOpen, Compass, Search, Award, TrendingUp, Layers, Zap } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function HomePage({ onSelectTopic, onNavigateStudio, onWatchDemo }) {
  const [sampleTopics, setSampleTopics] = useState([]);
  const [quickTopic, setQuickTopic] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/topics/sample`)
      .then(res => res.json())
      .then(data => setSampleTopics(data))
      .catch(err => console.warn('Failed to load sample topics:', err));
  }, []);

  const categories = ['All', 'Biology', 'Physics', 'Quantum Physics', 'Chemistry', 'Mathematics'];

  const filteredTopics = activeCategory === 'All' 
    ? sampleTopics 
    : sampleTopics.filter(t => t.category === activeCategory);

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!quickTopic.trim()) return;
    onSelectTopic(quickTopic);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner with Modern Gradient Glow */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-8 md:p-12 border border-indigo-500/20 shadow-glow-indigo">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI EdTech Engine
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Learn Anything in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Hinglish & Visual Graphics</span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Turn any academic topic into a professor-level video masterclass powered by multi-source open textbooks, interactive HTML5 canvas visuals, and real-time AI doubt resolution.
          </p>

          {/* Quick Generator Input */}
          <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Enter any topic e.g. 'Photosynthesis', 'Thermodynamics', 'Calculus'..."
                value={quickTopic}
                onChange={(e) => setQuickTopic(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl glass-input text-white placeholder-slate-400 text-sm md:text-base focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all duration-200"
            >
              <Zap className="w-5 h-5 fill-current" />
              Generate Lecture
            </button>
          </form>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 group">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Deep Multi-Source Ingestion</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Ingests OpenStax, Project Gutenberg, Wikidata SPARQL knowledge graphs, and YouTube educational transcripts.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-all duration-300 group">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Procedural Canvas Visualizer</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Renders animated molecular structures, physics vectors, and chemical balance equations dynamically.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 group">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Hinglish EdTech Narration</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Natural conversational teaching style blending Hindi intuition with English scientific terms.
          </p>
        </div>
      </div>

      {/* Featured Curated Topics Section */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Compass className="w-6 h-6 text-indigo-400" /> Curated Masterclass Topics
            </h2>
            <p className="text-slate-400 text-sm">Select a pre-built masterclass or customize in Studio</p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'glass-card text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Topics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{topic.icon}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-indigo-300 font-medium border border-indigo-500/20">
                    {topic.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {topic.title}
                </h3>
                <p className="text-slate-400 text-xs line-clamp-2">
                  Complete Hinglish masterclass with step-by-step canvas diagrams and quiz evaluation.
                </p>
              </div>

              <div className="pt-6 flex items-center gap-3">
                <button
                  onClick={() => onSelectTopic(topic.title)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                >
                  <Play className="w-4 h-4 fill-current" /> Watch Lecture
                </button>
                <button
                  onClick={() => onNavigateStudio(topic.title)}
                  className="px-3 py-2.5 rounded-xl glass-card text-slate-300 hover:text-white text-xs font-medium border border-slate-700"
                >
                  Customize
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
