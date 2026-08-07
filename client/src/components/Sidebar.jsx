import React from 'react';

export default function Sidebar({ activeNav = 'home', onSelectNav, isCollapsed }) {
  const mainNavItems = [
    { id: 'home', label: 'Home', icon: 'fa-house' },
    { id: 'studio', label: 'Studio Generator', icon: 'fa-wand-magic-sparkles' },
    { id: 'subscriptions', label: 'Subscriptions', icon: 'fa-layer-group' }
  ];

  const libraryNavItems = [
    { id: 'library', label: 'Library', icon: 'fa-bookmark' },
    { id: 'history', label: 'History', icon: 'fa-clock-rotate-left' },
    { id: 'analytics', label: 'Analytics', icon: 'fa-chart-line' }
  ];

  return (
    <aside className={`yt-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {mainNavItems.map((item) => (
          <button
            key={item.id}
            className={`yt-sidebar-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => onSelectNav(item.id)}
            title={item.label}
          >
            <i className={`fa-solid ${item.icon}`}></i>
            <span>{item.label}</span>
          </button>
        ))}

        {!isCollapsed && <div className="yt-sidebar-divider"></div>}

        {libraryNavItems.map((item) => (
          <button
            key={item.id}
            className={`yt-sidebar-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => onSelectNav(item.id)}
            title={item.label}
          >
            <i className={`fa-solid ${item.icon}`}></i>
            <span>{item.label}</span>
          </button>
        ))}

        {!isCollapsed && (
          <>
            <div className="yt-sidebar-divider"></div>
            <div style={{ padding: '0.5rem 0.85rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--yt-text-secondary)' }}>
              EXPLORE STREAMS
            </div>

            <button className="yt-sidebar-item" onClick={() => onSelectNav('home')}>
              <i className="fa-solid fa-atom" style={{ color: '#6366f1' }}></i>
              <span>STEM & Physics</span>
            </button>
            <button className="yt-sidebar-item" onClick={() => onSelectNav('home')}>
              <i className="fa-solid fa-laptop-code" style={{ color: '#38bdf8' }}></i>
              <span>Computer Science</span>
            </button>
            <button className="yt-sidebar-item" onClick={() => onSelectNav('home')}>
              <i className="fa-solid fa-dna" style={{ color: '#10b981' }}></i>
              <span>Medical Sciences</span>
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
