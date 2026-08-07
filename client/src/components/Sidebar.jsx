import React from 'react';
import { Home, Sliders, Bookmark, History, TrendingUp, Atom, Cpu, Dna, Settings } from 'lucide-react';

export default function Sidebar({ activeNav = 'home', onSelectNav, isCollapsed }) {
  const mainNavItems = [
    { id: 'home', label: 'Explore Home', icon: Home },
    { id: 'studio', label: 'AI Studio', icon: Sliders },
  ];

  const libraryNavItems = [
    { id: 'library', label: 'Library', icon: Bookmark },
    { id: 'history', label: 'History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`sticky top-16 h-[calc(100vh-4rem)] bg-[#0B0F19]/95 border-r border-slate-800/80 p-3 transition-all duration-300 flex flex-col justify-between overflow-y-auto shrink-0 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="space-y-6">
        {/* Main Navigation Section */}
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
                title={item.label}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        <div className="h-px bg-slate-800/80 mx-2" />

        {/* Library & Stats Section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-2">
              MY LEARNING
            </div>
          )}
          {libraryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
                title={item.label}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Explore Streams */}
        {!isCollapsed && (
          <>
            <div className="h-px bg-slate-800/80 mx-2" />
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-2">
                EXPLORE DOMAINS
              </div>
              <button
                onClick={() => onSelectNav('home')}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-indigo-300 hover:bg-slate-800/40 rounded-xl transition-colors"
              >
                <Atom className="w-4 h-4 text-indigo-400" />
                <span>STEM & Physics</span>
              </button>
              <button
                onClick={() => onSelectNav('home')}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-sky-300 hover:bg-slate-800/40 rounded-xl transition-colors"
              >
                <Cpu className="w-4 h-4 text-sky-400" />
                <span>Computer Science</span>
              </button>
              <button
                onClick={() => onSelectNav('home')}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-emerald-300 hover:bg-slate-800/40 rounded-xl transition-colors"
              >
                <Dna className="w-4 h-4 text-emerald-400" />
                <span>Medical Sciences</span>
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
