import React from 'react';

export default function Header({ activeTab, setActiveTab, theme, toggleTheme, onOpenSettings }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand" onClick={() => setActiveTab('studio')}>
          <div className="brand-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #10b981)', color: '#ffffff' }}>
            <i className="fa-solid fa-sparkles"></i>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'flex-start' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(90deg, #6366f1, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              heyBuddy
            </span>
            <span className="brand-tag" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)', width: 'fit-content' }}>
              ADAPTIVE AI TUTOR
            </span>
          </div>
        </div>

        <nav className="nav-links">
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

        <div className="header-actions">
          <button className="icon-action-btn" onClick={onOpenSettings} title="Gemini & System Voice Settings">
            <i className="fa-solid fa-sliders"></i>
          </button>
          <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Light/Dark Mode">
            {theme === 'dark' ? <i className="fa-solid fa-sun" style={{ color: '#f59e0b' }}></i> : <i className="fa-solid fa-moon" style={{ color: '#6366f1' }}></i>}
          </button>
        </div>
      </div>
    </header>
  );
}
