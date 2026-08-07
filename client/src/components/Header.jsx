import React from 'react';
import { Menu, Search, Mic, Video, Settings, User, Sparkles, Sliders } from 'lucide-react';

export default function Header({
  activeNav,
  onSelectNav,
  user,
  onOpenAuth,
  onOpenSettings,
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  onSearchSubmit
}) {
  return (
    <header className="sticky top-0 z-50 h-16 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left: Menu Toggle & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); onSelectNav('home'); }}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-white leading-none">heyBuddy</span>
            <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">AI EDTECH</span>
          </div>
        </a>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-xl hidden md:flex items-center gap-2">
        <form onSubmit={onSearchSubmit} className="relative flex-1 flex items-center">
          <input
            type="text"
            placeholder="Search any subject or AI masterclass..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-4 pr-10 py-2 rounded-xl glass-input text-white text-sm placeholder-slate-400"
          />
          <button
            type="submit"
            className="absolute right-2 p-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        <button
          type="button"
          onClick={() => alert('Voice search ready: speak your topic!')}
          className="p-2 rounded-xl glass-card text-slate-400 hover:text-white border border-slate-800 transition-colors"
          title="Voice Search"
        >
          <Mic className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onSelectNav('studio')}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold transition-colors"
          title="Create Masterclass"
        >
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline">Studio</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {user ? (
          <button
            onClick={onOpenAuth}
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-md border border-purple-400/30 hover:scale-105 transition-transform"
            title={`${user.name} (${user.academicStream})`}
          >
            {user.avatarChar || user.name[0].toUpperCase()}
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10 text-xs font-semibold transition-colors"
          >
            <User className="w-4 h-4" /> Sign In
          </button>
        )}
      </div>
    </header>
  );
}
