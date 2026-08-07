import React, { useState } from 'react';
import { X, Sparkles, User, Mail, Lock, BookOpen } from 'lucide-react';

export default function AuthModal({ user, onLogin, onLogout, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [academicStream, setAcademicStream] = useState('STEM & Physics');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter your email and password.');
      return;
    }

    const userData = {
      name: name || email.split('@')[0],
      email,
      academicStream,
      avatarChar: (name || email)[0].toUpperCase(),
      savedLectures: 3,
      streakDays: 7
    };

    onLogin(userData);
  };

  if (user) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 max-w-md w-full space-y-6 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-400" /> Account Profile
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-md">
              {user.avatarChar || user.name[0].toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-white text-base">{user.name}</div>
              <div className="text-xs text-slate-400">{user.email}</div>
              <div className="text-xs text-indigo-400 font-medium mt-0.5">{user.academicStream}</div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full py-3 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30 text-xs font-bold transition-colors"
          >
            Sign Out of Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 max-w-md w-full space-y-6 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-extrabold text-white">
              {isSignUp ? 'Create Account' : 'Sign in to heyBuddy'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">Email Address</label>
            <input
              type="email"
              required
              placeholder="alex@heybuddy.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
          >
            {isSignUp ? 'Create Student Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-indigo-400 font-bold hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
