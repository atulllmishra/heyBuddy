import React from 'react';

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
    <header className="yt-header">
      {/* Left: Sidebar Toggle & YouTube Logo */}
      <div className="yt-header-left">
        <button className="yt-icon-btn" onClick={onToggleSidebar} title="Toggle Drawer Menu">
          <i className="fa-solid fa-bars"></i>
        </button>

        <a href="#home" onClick={(e) => { e.preventDefault(); onSelectNav('home'); }} className="yt-logo">
          <i className="fa-brands fa-youtube" style={{ color: '#FF0000', fontSize: '1.6rem' }}></i>
          <span>heyBuddy</span>
          <span className="yt-logo-badge">AI TUTOR</span>
        </a>
      </div>

      {/* Center: YouTube Search Bar */}
      <div className="yt-search-container">
        <form onSubmit={onSearchSubmit} className="yt-search-box">
          <input
            type="text"
            className="yt-search-input"
            placeholder="Search any subject or masterclass..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button type="submit" className="yt-search-btn" title="Search">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </form>

        <button className="yt-icon-btn" title="Search with Voice" onClick={() => alert('Speak your topic: e.g. "Explain Photosynthesis"')}>
          <i className="fa-solid fa-microphone"></i>
        </button>
      </div>

      {/* Right: Actions & User Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button className="yt-icon-btn" onClick={() => onSelectNav('studio')} title="Create Masterclass">
          <i className="fa-solid fa-video"></i>
        </button>

        <button className="yt-icon-btn" onClick={onOpenSettings} title="Settings">
          <i className="fa-solid fa-gear"></i>
        </button>

        {user ? (
          <button
            onClick={onOpenAuth}
            className="yt-avatar"
            style={{ width: '34px', height: '34px', fontSize: '0.9rem', cursor: 'pointer', border: 'none' }}
            title={`${user.name} (${user.academicStream})`}
          >
            {user.avatarChar || user.name[0].toUpperCase()}
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: '1px solid #3ea6ff',
              color: '#3ea6ff',
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <i className="fa-regular fa-circle-user"></i> Sign in
          </button>
        )}
      </div>
    </header>
  );
}
