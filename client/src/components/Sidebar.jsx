import React from 'react';
import {
  Home,
  Video,
  Bookmark,
  History,
  TrendingUp,
  Settings,
  Compass,
  Layers,
  Atom,
  Binary,
  Globe2,
  DollarSign,
  Cpu,
  Palette
} from 'lucide-react';

export default function Sidebar({
  activeNav = 'home',
  onSelectNav,
  onSelectDomain,
  selectedDomain = 'All',
  isCollapsed,
  isMobileOpen,
  onCloseMobile
}) {
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

  const domainItems = [
    { id: 'Physics', label: 'STEM & Physics', icon: Compass, color: 'text-indigo-400' },
    { id: 'Biology', label: 'Life Sciences', icon: Layers, color: 'text-emerald-400' },
    { id: 'Chemistry', label: 'Chemistry & Materials', icon: Atom, color: 'text-cyan-400' },
    { id: 'Mathematics', label: 'Mathematics & Stats', icon: Binary, color: 'text-purple-400' },
    { id: 'Computer Science', label: 'AI & Computer Science', icon: Cpu, color: 'text-blue-400' },
    { id: 'Economics', label: 'Business & Economics', icon: DollarSign, color: 'text-amber-400' },
    { id: 'Environmental Science', label: 'Earth & Ecology', icon: Globe2, color: 'text-teal-400' },
    { id: 'Humanities', label: 'Arts & Humanities', icon: Palette, color: 'text-rose-400' },
  ];

  const handleDomainClick = (domainId) => {
    if (onSelectDomain) {
      onSelectDomain(domainId);
    }
    onSelectNav('home');
    if (onCloseMobile) onCloseMobile();
  };

  const handleNavClick = (navId) => {
    onSelectNav(navId);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Blur Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden transition-opacity duration-300"
        />
      )}

      <aside
        className={`fixed md:sticky top-14 z-50 md:z-30 h-[calc(100vh-3.5rem)] bg-[#0f0f0f] border-r border-[#272727] p-2 transition-all duration-300 flex flex-col justify-between overflow-y-auto shrink-0 ${
          isCollapsed ? 'w-16' : 'w-60'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-4 pb-6">
          {/* Main Navigation */}
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#272727] text-white font-bold shadow-sm'
                      : 'text-[#f1f1f1] hover:bg-[#272727]/60'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#ff0000]' : 'text-slate-400'}`} />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>

          <div className="h-px bg-[#272727] mx-2" />

          {/* Library Navigation */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                You
              </div>
            )}
            {libraryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#272727] text-white font-bold shadow-sm'
                      : 'text-[#f1f1f1] hover:bg-[#272727]/60'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#ff0000]' : 'text-slate-400'}`} />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>

          {/* Fully Functional Explore Domains Section */}
          {!isCollapsed && (
            <>
              <div className="h-px bg-[#272727] mx-2" />
              <div className="space-y-1">
                <div className="px-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Explore Domains</span>
                  {selectedDomain !== 'All' && (
                    <button
                      onClick={() => handleDomainClick('All')}
                      className="text-[10px] text-[#3ea6ff] hover:underline lowercase font-normal"
                    >
                      reset
                    </button>
                  )}
                </div>
                {domainItems.map((domain) => {
                  const DomainIcon = domain.icon;
                  const isDomainActive = activeNav === 'home' && selectedDomain === domain.id;
                  return (
                    <button
                      key={domain.id}
                      onClick={() => handleDomainClick(domain.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 ${
                        isDomainActive
                          ? 'bg-[#272727] text-white font-bold border border-[#383838]'
                          : 'text-slate-300 hover:bg-[#272727]/70 hover:text-white'
                      }`}
                      title={domain.label}
                    >
                      <div className="flex items-center gap-3">
                        <DomainIcon className={`w-4 h-4 ${domain.color} shrink-0`} />
                        <span className="truncate">{domain.label}</span>
                      </div>
                      {isDomainActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ff0000]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

