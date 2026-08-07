import React from 'react';

export default function Header({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onOpenSettings
}) {
  return (
    <header className="app-header">
      <div className="brand-logo" onClick={() => setActiveTab('studio')} style={{ cursor: 'pointer' }}>
        <div className="brand-icon">
          <i className="fa-solid fa-graduation-cap"></i>
        </div>
        <div>
          <span style={{ fontWeight: 800 }}>heyBuddy</span>
          <span style={{ fontSize: '0.68rem', color: 'var(--accent-indigo-light)', display: 'block', fontWeight: 600, letterSpacing: '0.5px' }}>
            ADAPTIVE AI TUTOR
          </span>
        </div>
      </div>

      <nav className="nav-tabs">
        <button
          className={`nav-btn ${activeTab === 'studio' ? 'active' : ''}`}
          onClick={() => setActiveTab('studio')}
        >
          <i className="fa-solid fa-wand-magic-sparkles"></i> Lecture Studio
        </button>
        <button
          className={`nav-btn ${activeTab === 'library' ? 'active' : ''}`}
          onClick={() => setActiveTab('library')}
        >
          <i className="fa-solid fa-layer-group"></i> Course Library
        </button>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button className="method-pill" onClick={onOpenSettings} title="Settings">
          <i className="fa-solid fa-gear"></i>
        </button>

        {user ? (
          <button
            onClick={onOpenAuth}
            className="method-pill active"
            style={{ fontWeight: 700 }}
            title={`${user.name} (${user.academicStream})`}
          >
            👤 {user.name}
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="btn-black"
            style={{ padding: '0.45rem 1.25rem', fontSize: '0.85rem' }}
          >
            <i className="fa-regular fa-circle-user"></i> Sign In
          </button>
        )}
      </div>
    </header>
  );
}
