import React from 'react';
import { Home, Video, Bookmark, History, TrendingUp, Settings, BookOpen, Compass, Layers } from 'lucide-react';

export default function Sidebar({ activeNav = 'home', onSelectNav, isCollapsed }) {
  const mainNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'studio', label: 'Studio Generator', icon: Video },
  ];

  const libraryNavItems = [
    { id: 'library', label: 'Library', icon: Bookmark },
    { id: 'history', label: 'History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`sticky top-14 h-[calc(100vh-3.5rem)] bg-[#0f0f0f] border-r border-[#272727] p-2 transition-all duration-200 flex flex-col justify-between overflow-y-auto shrink-0 ${
        isCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      <div className="space-y-4">
        {/* Main Section */}
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectNav(item.id)}
                className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#272727] text-white font-bold'
                    : 'text-[#f1f1f1] hover:bg-[#272727]/60'
                }`}
                title={item.label}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#ff0000]' : 'text-slate-300'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        <div className="h-px bg-[#272727] mx-2" />

        {/* You / Library Section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              You
            </div>
          )}
          {libraryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectNav(item.id)}
                className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#272727] text-white font-bold'
                    : 'text-[#f1f1f1] hover:bg-[#272727]/60'
                }`}
                title={item.label}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#ff0000]' : 'text-slate-300'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {!isCollapsed && (
          <>
            <div className="h-px bg-[#272727] mx-2" />
            <div className="space-y-1">
              <div className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Explore Domains
              </div>
              <button
                onClick={() => onSelectNav('home')}
                className="w-full flex items-center gap-4 px-3 py-2 text-xs text-slate-300 hover:bg-[#272727] rounded-xl transition-colors"
              >
                <Compass className="w-5 h-5 text-indigo-400" />
                <span>STEM & Physics</span>
              </button>
              <button
                onClick={() => onSelectNav('home')}
                className="w-full flex items-center gap-4 px-3 py-2 text-xs text-slate-300 hover:bg-[#272727] rounded-xl transition-colors"
              >
                <Layers className="w-5 h-5 text-emerald-400" />
                <span>Life Sciences</span>
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
