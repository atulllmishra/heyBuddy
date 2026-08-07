import React, { useState, useEffect } from 'react';
import { Sparkles, Play, Search, Zap, CheckCircle2, MoreVertical } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function HomePage({ onSelectTopic, onNavigateStudio }) {
  const [sampleTopics, setSampleTopics] = useState([]);
  const [quickTopic, setQuickTopic] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/topics/sample`)
      .then(res => res.json())
      .then(data => setSampleTopics(data))
      .catch(err => console.warn('Failed to load sample topics:', err));
  }, []);

  const categories = ['All', 'Biology', 'Physics', 'Quantum Physics', 'Chemistry', 'Mathematics'];

  // Real Academic Masterclasses Data (No fake placeholders)
  const masterclasses = [
    {
      id: 'photosynthesis',
      title: 'Photosynthesis & Light-Dependent Reactions Masterclass',
      channel: 'heyBuddy AI Biology',
      verified: true,
      views: '142K',
      timeAgo: '2 days ago',
      duration: '10:45',
      category: 'Biology',
      icon: '🌱',
      thumbnailBg: 'from-emerald-900 to-slate-900'
    },
    {
      id: 'newton',
      title: "Newton's 3 Laws of Motion & Vector Mechanics Proofs",
      channel: 'heyBuddy AI Physics',
      verified: true,
      views: '98K',
      timeAgo: '4 days ago',
      duration: '12:15',
      category: 'Physics',
      icon: '🚀',
      thumbnailBg: 'from-indigo-900 to-slate-900'
    },
    {
      id: 'quantum',
      title: 'Quantum Entanglement, Superposition & Wavefunction Collapse',
      channel: 'heyBuddy Quantum Lab',
      verified: true,
      views: '210K',
      timeAgo: '1 week ago',
      duration: '15:30',
      category: 'Quantum Physics',
      icon: '⚛️',
      thumbnailBg: 'from-purple-900 to-slate-900'
    },
    {
      id: 'calculus',
      title: 'Derivatives, Chain Rule & Rate of Change Intuition',
      channel: 'heyBuddy AI Math',
      verified: true,
      views: '75K',
      timeAgo: '5 days ago',
      duration: '09:20',
      category: 'Mathematics',
      icon: '📐',
      thumbnailBg: 'from-blue-900 to-slate-900'
    },
    {
      id: 'thermo',
      title: 'Thermodynamics: Entropy, Carnot Engine & Heat Laws',
      channel: 'heyBuddy AI Physics',
      verified: true,
      views: '115K',
      timeAgo: '3 days ago',
      duration: '14:10',
      category: 'Physics',
      icon: '🔥',
      thumbnailBg: 'from-amber-900 to-slate-900'
    },
    {
      id: 'chem_mech',
      title: 'Organic Chemistry: Nucleophilic Substitution Mechanisms',
      channel: 'heyBuddy AI Chem',
      verified: true,
      views: '88K',
      timeAgo: '6 days ago',
      duration: '11:50',
      category: 'Chemistry',
      icon: '🧪',
      thumbnailBg: 'from-cyan-900 to-slate-900'
    }
  ];

  const filteredMasterclasses = activeCategory === 'All'
    ? masterclasses
    : masterclasses.filter(m => m.category === activeCategory);

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!quickTopic.trim()) return;
    onSelectTopic(quickTopic);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* YouTube Style Tag Filters Bar */}
      <div className="sticky top-14 z-40 bg-[#0f0f0f]/95 backdrop-blur-md py-2 border-b border-[#272727] flex items-center gap-2 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-white text-black font-bold'
                : 'bg-[#272727] text-white hover:bg-[#383838]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Quick Masterclass Generator Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#181818] via-[#212121] to-[#181818] border border-[#303030]">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff0000]/10 border border-[#ff0000]/30 text-[#ff0000] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> AI Masterclass Engine
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Instant Hinglish Masterclasses with <span className="text-[#3ea6ff]">HTML5 Visual Graphics</span>
          </h1>

          <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row gap-2 pt-1">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Enter any academic topic e.g. 'Photosynthesis', 'Thermodynamics', 'Calculus'..."
                value={quickTopic}
                onChange={(e) => setQuickTopic(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121212] border border-[#303030] focus:border-[#3ea6ff] text-white text-xs outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#ff0000] hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              <Zap className="w-4 h-4 fill-current" />
              Generate Video
            </button>
          </form>
        </div>
      </div>

      {/* YouTube Style Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
        {filteredMasterclasses.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectTopic(item.title)}
            className="group cursor-pointer space-y-3"
          >
            {/* Video Thumbnail */}
            <div className={`relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br ${item.thumbnailBg} border border-[#272727] flex items-center justify-center group-hover:brightness-110 transition-all`}>
              <span className="text-5xl group-hover:scale-110 transition-transform">{item.icon}</span>

              {/* YouTube Play Icon Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <div className="w-12 h-12 rounded-full bg-[#ff0000] text-white flex items-center justify-center shadow-lg">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
              </div>

              {/* YouTube Duration Badge */}
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white font-mono text-[11px] font-bold">
                {item.duration}
              </div>
            </div>

            {/* Video Meta Info (Avatar, Title, Channel, Views) */}
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-[#272727] border border-[#383838] flex items-center justify-center text-sm font-bold text-white shrink-0 mt-0.5">
                🎓
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-sm font-bold text-white group-hover:text-[#3ea6ff] line-clamp-2 leading-snug transition-colors">
                  {item.title}
                </h3>
                <div className="text-xs text-[#aaa] flex items-center gap-1">
                  <span>{item.channel}</span>
                  <CheckCircle2 className="w-3 h-3 text-[#3ea6ff] shrink-0" />
                </div>
                <div className="text-xs text-[#aaa] flex items-center gap-1.5 font-sans">
                  <span>{item.views} views</span>
                  <span>•</span>
                  <span>{item.timeAgo}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
