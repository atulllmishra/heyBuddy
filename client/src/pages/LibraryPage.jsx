import React, { useState, useEffect } from 'react';
import { Bookmark, Play, Trash2, Search, Filter, BookOpen } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function LibraryPage({ onSelectTopic }) {
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const DEFAULT_SEED_LIBRARY = [
    {
      id: 'lib_1',
      title: 'Photosynthesis & Light-Dependent Reactions Masterclass',
      category: 'Biology',
      icon: '🌱',
      summary: 'Complete breakdown of chloroplast thylakoids, photolysis, ATP Synthase, and Calvin Cycle.'
    },
    {
      id: 'lib_2',
      title: "Newton's 3 Laws of Motion & Vector Mechanics Proofs",
      category: 'Physics',
      icon: '🚀',
      summary: 'F=ma force equations, inertia principles, and action-reaction thrust pairs.'
    },
    {
      id: 'lib_3',
      title: 'Deep Learning & Neural Networks Backpropagation Illustrated',
      category: 'Computer Science',
      icon: '🤖',
      summary: 'Mathematical intuition behind gradient descent, activation functions, and weights.'
    }
  ];

  useEffect(() => {
    fetchLibrary();
  }, []);

  const fetchLibrary = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/library`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setLibrary(res.data);
          localStorage.setItem('heybuddy_library', JSON.stringify(res.data));
        } else {
          const cached = localStorage.getItem('heybuddy_library');
          setLibrary(cached ? JSON.parse(cached) : DEFAULT_SEED_LIBRARY);
        }
      })
      .catch(() => {
        const cached = localStorage.getItem('heybuddy_library');
        setLibrary(cached ? JSON.parse(cached) : DEFAULT_SEED_LIBRARY);
      })
      .finally(() => setLoading(false));
  };

  const handleRemove = (id, e) => {
    e.stopPropagation();
    fetch(`${API_BASE_URL}/api/library/${id}`, { method: 'DELETE' }).catch(() => {});
    setLibrary(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('heybuddy_library', JSON.stringify(updated));
      return updated;
    });
  };

  const filteredItems = library.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          item.summary?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Library Header */}
      <div className="glass-panel p-8 rounded-2xl border border-indigo-500/20">
        <div className="flex items-center gap-3 mb-2 text-indigo-400">
          <Bookmark className="w-6 h-6" />
          <span className="text-xs font-semibold uppercase tracking-wider">Saved Masterclasses & Resources</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Your Saved Library</h1>
        <p className="text-slate-400 text-sm mt-1">
          Access your bookmarked AI masterclasses, study guides, and visual notes.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search saved lectures..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg glass-input text-white text-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg glass-input text-white text-xs"
          >
            <option value="All">All Categories</option>
            <option value="Biology">Biology</option>
            <option value="Physics">Physics</option>
            <option value="Quantum Physics">Quantum Physics</option>
            <option value="Chemistry">Chemistry</option>
          </select>
        </div>
      </div>

      {/* Library Items Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading your saved library...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center space-y-4 max-w-md mx-auto">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Saved Lectures Found</h3>
          <p className="text-slate-400 text-xs">
            Save masterclasses while watching to build your personalized study repository.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{item.icon || '📚'}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-indigo-300 font-medium border border-indigo-500/20">
                    {item.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-xs line-clamp-2">
                  {item.summary || 'Saved AI Masterclass with interactive visual scenes.'}
                </p>
              </div>

              <div className="pt-6 flex items-center gap-2">
                <button
                  onClick={() => onSelectTopic(item.title)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                >
                  <Play className="w-4 h-4 fill-current" /> Watch Lecture
                </button>
                <button
                  onClick={(e) => handleRemove(item.id, e)}
                  title="Remove from Library"
                  className="p-2.5 rounded-xl glass-card text-slate-400 hover:text-red-400 border border-slate-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
