import React, { useState, useEffect } from 'react';
import { Settings, Key, User, Save, CheckCircle, Shield, Volume2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'Alex Rivera',
    email: 'alex@heybuddy.edu',
    role: 'Student / Researcher',
    gradeLevel: 'High School / AP',
    targetStream: 'STEM / Physical Sciences',
    learningGoal: 'Master Calculus & Quantum Physics before Semester Finals'
  });
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('heybuddy_gemini_key') || '');
  const [openaiKey, setOpenaiKey] = useState(localStorage.getItem('heybuddy_openai_key') || '');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/user/profile`)
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) setProfile(res.data);
      })
      .catch(err => console.warn('Failed to load profile:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (geminiKey) localStorage.setItem('heybuddy_gemini_key', geminiKey);
    if (openaiKey) localStorage.setItem('heybuddy_openai_key', openaiKey);

    fetch(`${API_BASE_URL}/api/user/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    })
      .then(res => res.json())
      .then(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      {/* Settings Header */}
      <div className="glass-panel p-8 rounded-2xl border border-indigo-500/20">
        <div className="flex items-center gap-3 mb-2 text-indigo-400">
          <Settings className="w-6 h-6" />
          <span className="text-xs font-semibold uppercase tracking-wider">Account & AI Engine Configuration</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Platform Settings</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your personal profile, API key credentials, and default video settings.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* User Profile Info */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" /> Personal Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-white text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-white text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Academic Goal
            </label>
            <input
              type="text"
              value={profile.learningGoal}
              onChange={(e) => setProfile({ ...profile, learningGoal: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-white text-sm"
            />
          </div>
        </div>

        {/* API Credentials */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-400" /> API Keys & Security
          </h2>
          <p className="text-slate-400 text-xs">
            Your API keys are stored securely in browser localStorage and never logged on remote servers.
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Google Gemini API Key
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-white text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                OpenAI API Key (Optional)
              </label>
              <input
                type="password"
                placeholder="sk-proj-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-white text-sm"
              />
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
        >
          {saved ? (
            <>
              <CheckCircle className="w-5 h-5 text-emerald-400" /> Settings Saved!
            </>
          ) : (
            <>
              <Save className="w-5 h-5" /> Save Preference Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
}
