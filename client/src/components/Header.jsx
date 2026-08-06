import React from 'react';

export default function Header({ activeTab, setActiveTab, theme, toggleTheme, onOpenSettings }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand" onClick={() => setActiveTab('studio')}>
          <div className="brand-icon">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <div>
            <span>heyBuddy</span>
            <span className="brand-tag">AI EDTECH</span>
          </div>
        </div>

        <nav className="nav-links">
          <button 
            className={`nav-btn ${activeTab === 'studio' ? 'active' : ''}`}
            onClick={() => setActiveTab('studio')}
          >
            <i className="fa-solid fa-clapperboard"></i> Studio
          </button>
          <button 
            className={`nav-btn ${activeTab === 'library' ? 'active' : ''}`}
            onClick={() => setActiveTab('library')}
          >
            <i className="fa-solid fa-book-open"></i> Courses
          </button>
        </nav>

        <div className="header-actions">
          <button className="icon-action-btn" onClick={onOpenSettings} title="AI Engine & Key Settings">
            <i className="fa-solid fa-sliders"></i>
          </button>
          <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Light/Dark Theme">
            {theme === 'dark' ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}
          </button>
        </div>
      </div>
    </header>
  );
}
