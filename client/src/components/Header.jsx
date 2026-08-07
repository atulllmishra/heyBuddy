import React from 'react';
import { Menu, Search, Mic, Video, Settings, User, Bell } from 'lucide-react';

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
    <header className="sticky top-0 z-50 h-14 bg-[#0f0f0f] border-b border-[#272727] px-4 flex items-center justify-between gap-4">
      {/* Left: Menu Toggle & YouTube Style Brand Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-full text-white hover:bg-[#272727] transition-colors"
          title="Toggle Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); onSelectNav('home'); }}
          className="flex items-center gap-1.5 group"
        >
          {/* YouTube Signature Red Icon */}
          <div className="w-7 h-5 bg-[#ff0000] rounded-lg flex items-center justify-center text-white shadow-sm">
            <div className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[7px] border-l-white ml-0.5" />
          </div>
          <div className="flex items-center gap-1">
            <span className="font-extrabold text-lg tracking-tighter text-white">heyBuddy</span>
            <span className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest ml-0.5">EDTECH</span>
          </div>
        </a>
      </div>

      {/* Center: YouTube Signature Pill Search Bar & Mic Button */}
      <div className="flex-1 max-w-2xl hidden md:flex items-center justify-center gap-3">
        <form onSubmit={onSearchSubmit} className="flex items-center flex-1 max-w-xl">
          <input
            type="text"
            placeholder="Search academic topics or masterclasses..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 px-4 rounded-l-full bg-[#121212] border border-[#303030] focus:border-[#3ea6ff] text-white text-sm placeholder-[#888] outline-none"
          />
          <button
            type="submit"
            className="h-10 px-6 bg-[#222222] border border-l-0 border-[#303030] rounded-r-full text-slate-300 hover:bg-[#303030] transition-colors flex items-center justify-center"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        <button
          type="button"
          onClick={() => alert('Speak any topic: e.g. "Photosynthesis and Light Reactions"')}
          className="w-10 h-10 rounded-full bg-[#222222] hover:bg-[#303030] border border-[#303030] text-white flex items-center justify-center transition-colors"
          title="Search with voice"
        >
          <Mic className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Actions & User Avatar */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onSelectNav('studio')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-white text-xs font-semibold border border-[#383838] transition-colors"
          title="Create Masterclass"
        >
          <Video className="w-4 h-4 text-[#ff0000]" />
          <span className="hidden sm:inline">Create</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-full text-slate-300 hover:bg-[#272727] transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {user ? (
          <button
            onClick={onOpenAuth}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff0000] to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
            title={`${user.name}`}
          >
            {user.avatarChar || user.name[0].toUpperCase()}
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#3ea6ff] text-[#3ea6ff] hover:bg-[#3ea6ff]/10 text-xs font-semibold transition-colors"
          >
            <User className="w-4 h-4" /> Sign in
          </button>
        )}
      </div>
    </header>
  );
}
