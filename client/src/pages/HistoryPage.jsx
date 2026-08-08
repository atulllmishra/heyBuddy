import React, { useState, useEffect } from 'react';
import { History, Play, Trash2, Clock, Calendar, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function HistoryPage({ onSelectTopic }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const DEFAULT_SEED_HISTORY = [
    {
      id: 'hist_1',
      topic: 'Photosynthesis & Light-Dependent Reactions Masterclass',
      methodology: 'Feynman Technique',
      language: 'Hinglish',
      status: 'Completed',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'hist_2',
      topic: "Newton's 3 Laws of Motion & Vector Mechanics Proofs",
      methodology: 'Feynman Technique',
      language: 'Hinglish',
      status: 'Completed',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: 'hist_3',
      topic: 'Quantum Entanglement & Superposition',
      methodology: 'First Principles',
      language: 'Hinglish',
      status: 'Completed',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
    }
  ];

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/history`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setHistory(res.data);
          localStorage.setItem('heybuddy_history', JSON.stringify(res.data));
        } else {
          const cached = localStorage.getItem('heybuddy_history');
          setHistory(cached ? JSON.parse(cached) : DEFAULT_SEED_HISTORY);
        }
      })
      .catch(() => {
        const cached = localStorage.getItem('heybuddy_history');
        setHistory(cached ? JSON.parse(cached) : DEFAULT_SEED_HISTORY);
      })
      .finally(() => setLoading(false));
  };

  const handleClearHistory = () => {
    fetch(`${API_BASE_URL}/api/history`, { method: 'DELETE' }).catch(() => {});
    setHistory([]);
    localStorage.removeItem('heybuddy_history');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* History Header */}
      <div className="glass-panel p-8 rounded-2xl border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2 text-indigo-400">
            <History className="w-6 h-6" />
            <span className="text-xs font-semibold uppercase tracking-wider">Generation Log</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Masterclass History</h1>
          <p className="text-slate-400 text-sm mt-1">
            Track and re-watch your previously generated AI lectures.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card text-red-400 hover:bg-red-500/10 border border-red-500/20 text-xs font-semibold transition-colors w-fit"
          >
            <Trash2 className="w-4 h-4" /> Clear Log
          </button>
        )}
      </div>

      {/* History Timeline List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading masterclass history...
        </div>
      ) : history.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center space-y-4 max-w-md mx-auto">
          <Clock className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Generation History</h3>
          <p className="text-slate-400 text-xs">
            Generated AI lectures will appear here automatically for quick re-watching.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((log) => (
            <div
              key={log.id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    <CheckCircle className="w-3 h-3" /> {log.status || 'Completed'}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(log.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{log.topic}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>Lens: <strong className="text-slate-300">{log.methodology}</strong></span>
                  <span>Language: <strong className="text-slate-300">{log.language}</strong></span>
                </div>
              </div>

              <button
                onClick={() => onSelectTopic(log.topic)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shrink-0"
              >
                <Play className="w-4 h-4 fill-current" /> Re-watch Lecture
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
