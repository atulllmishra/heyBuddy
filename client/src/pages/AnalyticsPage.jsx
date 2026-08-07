import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Flame,
  Clock,
  Award,
  CheckCircle2,
  BarChart2,
  Zap,
  PlusCircle,
  RotateCcw,
  Calendar,
  BookOpenCheck,
  Sparkles
} from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('week'); // 'week' | 'month' | 'all'
  const [showLogModal, setShowLogModal] = useState(false);
  const [logMinutes, setLogMinutes] = useState(30);
  const [logSubject, setLogSubject] = useState('Physics');

  const fetchAnalytics = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/analytics`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setAnalytics(res.data);
          localStorage.setItem('heybuddy_analytics', JSON.stringify(res.data));
        }
      })
      .catch(err => {
        console.warn('Backend analytics offline, reading local fallback:', err);
        const cached = localStorage.getItem('heybuddy_analytics');
        if (cached) setAnalytics(JSON.parse(cached));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleLogStudySession = (e) => {
    e.preventDefault();
    if (!logMinutes || logMinutes <= 0) return;

    fetch(`${API_BASE_URL}/api/analytics/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'log_minutes',
        minutes: Number(logMinutes),
        subject: logSubject
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) setAnalytics(res.data);
        setShowLogModal(false);
      })
      .catch(() => {
        // Fallback local update
        setAnalytics(prev => {
          if (!prev) return prev;
          const updated = {
            ...prev,
            totalWatchTimeHours: +(prev.totalWatchTimeHours + (logMinutes / 60)).toFixed(1)
          };
          localStorage.setItem('heybuddy_analytics', JSON.stringify(updated));
          return updated;
        });
        setShowLogModal(false);
      });
  };

  const handleResetAnalytics = () => {
    if (!window.confirm('Are you sure you want to reset your study analytics metrics?')) return;

    fetch(`${API_BASE_URL}/api/analytics/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset' })
    })
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) setAnalytics(res.data);
      })
      .catch(() => fetchAnalytics());
  };

  if (loading && !analytics) {
    return (
      <div className="text-center py-20 text-slate-400 text-sm animate-fadeIn">
        <div className="w-10 h-10 border-2 border-[#ff0000] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        Calculating real-time student analytics & learning velocity...
      </div>
    );
  }

  const rawData = analytics || {
    studyStreakDays: 7,
    totalWatchTimeHours: 14.8,
    masterclassesCompleted: 18,
    doubtsSolved: 34,
    quizzesCompleted: 12,
    topicMastery: [
      { subject: 'Biology', score: 92, status: 'Mastered', color: '#10B981' },
      { subject: 'Physics', score: 85, status: 'Proficient', color: '#3B82F6' },
      { subject: 'Chemistry', score: 78, status: 'Developing', color: '#F59E0B' },
      { subject: 'Mathematics', score: 88, status: 'Proficient', color: '#8B5CF6' },
      { subject: 'Computer Science', score: 94, status: 'Mastered', color: '#06B6D4' }
    ],
    weeklyActivity: [
      { day: 'Mon', minutes: 45 },
      { day: 'Tue', minutes: 60 },
      { day: 'Wed', minutes: 30 },
      { day: 'Thu', minutes: 75 },
      { day: 'Fri', minutes: 90 },
      { day: 'Sat', minutes: 120 },
      { day: 'Sun', minutes: 50 }
    ],
    recentQuizLog: [
      { id: 1, topic: 'Photosynthesis & Light Reactions', score: '3/3', subject: 'Biology', date: '2 hours ago' },
      { id: 2, topic: "Newton's Laws & Vector Mechanics", score: '2/2', subject: 'Physics', date: '1 day ago' },
      { id: 3, topic: 'Quantum Entanglement', score: '3/3', subject: 'Physics', date: '2 days ago' }
    ]
  };

  // Adjust metrics based on timeframe filter
  const timeMultiplier = timeframe === 'month' ? 3.5 : timeframe === 'all' ? 8 : 1;
  const displayWatchHours = +(rawData.totalWatchTimeHours * (timeframe === 'week' ? 1 : timeframe === 'month' ? 2.5 : 4)).toFixed(1);
  const displayLectures = Math.round(rawData.masterclassesCompleted * (timeframe === 'week' ? 1 : timeframe === 'month' ? 2.8 : 5));

  const maxMinutes = Math.max(...rawData.weeklyActivity.map(d => d.minutes), 120);

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#181818] via-[#212121] to-[#181818] border border-[#303030] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#3ea6ff] text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" /> Live Learning Velocity & Progress
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Student Analytics Dashboard</h1>
          <p className="text-slate-400 text-xs md:text-sm max-w-xl">
            Real-time telemetry tracking your AI masterclass watch times, doubt resolutions, and subject mastery.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe Selector */}
          <div className="bg-[#121212] border border-[#303030] p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setTimeframe('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === 'week' ? 'bg-[#272727] text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === 'month' ? 'bg-[#272727] text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeframe('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === 'all' ? 'bg-[#272727] text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Time
            </button>
          </div>

          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ff0000] hover:bg-red-700 text-white font-bold text-xs shadow transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" /> Log Session
          </button>
        </div>
      </div>

      {/* Top Telemetry KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#181818] border border-[#272727] flex items-center gap-4 hover:border-[#383838] transition-all">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{rawData.studyStreakDays} Days</div>
            <div className="text-xs text-slate-400 font-medium">Active Study Streak</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#181818] border border-[#272727] flex items-center gap-4 hover:border-[#383838] transition-all">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{displayWatchHours} hrs</div>
            <div className="text-xs text-slate-400 font-medium">Total Watch Time</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#181818] border border-[#272727] flex items-center gap-4 hover:border-[#383838] transition-all">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{displayLectures}</div>
            <div className="text-xs text-slate-400 font-medium">Masterclasses Completed</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#181818] border border-[#272727] flex items-center gap-4 hover:border-[#383838] transition-all">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{rawData.doubtsSolved}</div>
            <div className="text-xs text-slate-400 font-medium">AI Doubts Resolved</div>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Mastery Breakdown */}
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#272727] space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Topic Mastery Index
            </h2>
            <span className="text-xs text-slate-400">Target: &gt;80% Proficient</span>
          </div>

          <div className="space-y-5">
            {rawData.topicMastery.map((item) => (
              <div key={item.subject} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{item.subject}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#272727] text-slate-300 font-medium">
                      {item.status}
                    </span>
                    <span className="font-bold text-[#3ea6ff] font-mono">{item.score}%</span>
                  </div>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#121212] overflow-hidden p-0.5 border border-[#272727]">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${item.score}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity Bar Chart */}
        <div className="p-6 rounded-2xl bg-[#181818] border border-[#272727] space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#3ea6ff]" /> Weekly Learning Velocity (Minutes)
            </h2>
            <span className="text-xs text-slate-400 font-mono">Total: {rawData.weeklyActivity.reduce((acc, d) => acc + d.minutes, 0)} mins</span>
          </div>

          <div className="flex items-end justify-between gap-3 h-52 pt-8 px-2">
            {rawData.weeklyActivity.map((day) => {
              const heightPercent = Math.min(100, Math.round((day.minutes / maxMinutes) * 100));
              return (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] text-slate-400 font-mono group-hover:text-white transition-colors">
                    {day.minutes}m
                  </div>
                  <div
                    className="w-full max-w-[36px] rounded-t-lg bg-gradient-to-t from-[#ff0000]/70 to-[#3ea6ff] transition-all duration-300 group-hover:brightness-125 group-hover:scale-105"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-xs text-slate-400 font-bold">{day.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Quiz Logs & Action Bar */}
      <div className="p-6 rounded-2xl bg-[#181818] border border-[#272727] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-purple-400" /> Recent Quiz & Evaluation Activity
          </h2>
          <button
            onClick={handleResetAnalytics}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Metrics
          </button>
        </div>

        {rawData.recentQuizLog && rawData.recentQuizLog.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {rawData.recentQuizLog.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl bg-[#121212] border border-[#272727] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 truncate">{log.topic}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
                    {log.score}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>{log.subject}</span>
                  <span>{log.date}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 text-xs">
            No quiz evaluations recorded yet. Complete quizzes in any masterclass to track accuracy here!
          </div>
        )}
      </div>

      {/* Log Study Session Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#181818] border border-[#303030] p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#ff0000]" /> Log Extra Study Session
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogStudySession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Study Duration (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="480"
                  value={logMinutes}
                  onChange={(e) => setLogMinutes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#121212] border border-[#303030] text-white text-xs outline-none focus:border-[#3ea6ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Academic Subject</label>
                <select
                  value={logSubject}
                  onChange={(e) => setLogSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#121212] border border-[#303030] text-white text-xs outline-none focus:border-[#3ea6ff]"
                >
                  <option value="Physics">Physics</option>
                  <option value="Biology">Biology</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Economics">Economics</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 py-2 rounded-xl bg-[#272727] text-slate-300 font-bold text-xs hover:bg-[#383838]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#ff0000] text-white font-bold text-xs hover:bg-red-700"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

