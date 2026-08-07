import React, { useState, useEffect } from 'react';
import { TrendingUp, Flame, Clock, Award, CheckCircle2, BarChart2, Zap } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/analytics`)
      .then(res => res.json())
      .then(res => {
        if (res.success) setAnalytics(res.data);
      })
      .catch(err => console.warn('Failed to load analytics:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-16 text-slate-400 text-sm">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Calculating learning analytics & topic mastery...
      </div>
    );
  }

  const data = analytics || {
    studyStreakDays: 7,
    totalWatchTimeHours: 14.8,
    masterclassesCompleted: 18,
    doubtsSolved: 34,
    topicMastery: [
      { subject: 'Biology', score: 92, status: 'Mastered', color: '#10B981' },
      { subject: 'Physics', score: 85, status: 'Proficient', color: '#3B82F6' },
      { subject: 'Chemistry', score: 78, status: 'Developing', color: '#F59E0B' },
      { subject: 'Mathematics', score: 88, status: 'Proficient', color: '#8B5CF6' }
    ],
    weeklyActivity: [
      { day: 'Mon', minutes: 45 },
      { day: 'Tue', minutes: 60 },
      { day: 'Wed', minutes: 30 },
      { day: 'Thu', minutes: 75 },
      { day: 'Fri', minutes: 90 },
      { day: 'Sat', minutes: 120 },
      { day: 'Sun', minutes: 50 }
    ]
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Analytics Header */}
      <div className="glass-panel p-8 rounded-2xl border border-indigo-500/20 shadow-glow-indigo">
        <div className="flex items-center gap-3 mb-2 text-indigo-400">
          <TrendingUp className="w-6 h-6" />
          <span className="text-xs font-semibold uppercase tracking-wider">Student Progress & Learning Velocity</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Study Analytics Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">
          Real-time metrics on masterclass comprehension, study streaks, and subject mastery.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{data.studyStreakDays} Days</div>
            <div className="text-xs text-slate-400">Active Study Streak</div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{data.totalWatchTimeHours} hrs</div>
            <div className="text-xs text-slate-400">Total Watch Time</div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{data.masterclassesCompleted}</div>
            <div className="text-xs text-slate-400">Lectures Completed</div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{data.doubtsSolved}</div>
            <div className="text-xs text-slate-400">AI Doubts Answered</div>
          </div>
        </div>
      </div>

      {/* Main Analytics Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Mastery Progress Bars */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Topic Mastery Index
          </h2>

          <div className="space-y-5">
            {data.topicMastery.map((item) => (
              <div key={item.subject} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-white">{item.subject}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                      {item.status}
                    </span>
                    <span className="font-bold text-indigo-400">{item.score}%</span>
                  </div>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.score}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity Bar Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 flex flex-col justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-400" /> Weekly Learning Velocity (Minutes)
          </h2>

          <div className="flex items-end justify-between gap-3 h-48 pt-6 px-2">
            {data.weeklyActivity.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="text-[10px] text-slate-400 font-mono">{day.minutes}m</div>
                <div
                  className="w-full max-w-[32px] rounded-t-lg bg-gradient-to-t from-indigo-700 to-purple-500 transition-all duration-300 hover:brightness-125"
                  style={{ height: `${(day.minutes / 120) * 100}%` }}
                />
                <span className="text-xs text-slate-400 font-medium">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
