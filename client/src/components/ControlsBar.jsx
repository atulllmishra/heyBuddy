import React from 'react';

const LANGUAGES = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Arabic'];

export default function ControlsBar({
  isPlaying,
  onTogglePlay,
  onPrevScene,
  onNextScene,
  progressPercent,
  onSeek,
  currentTimeStr,
  totalTimeStr,
  playbackSpeed,
  onChangeSpeed,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
  onExportVideo,
  currentLanguage,
  onLiveTranslate,
  onShuffleStyle,
  isTranslating
}) {
  return (
    <div className="player-controls">
      {/* Seeker Row */}
      <div className="timeline-row">
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progressPercent || 0}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="slider-mono"
        />
        <span className="time-mono">{currentTimeStr} / {totalTimeStr}</span>
      </div>

      {/* Action Buttons Row */}
      <div className="actions-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button className="ctrl-btn-mono" onClick={onTogglePlay} title="Play / Pause">
            {isPlaying ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}
          </button>
          <button className="ctrl-btn-mono" onClick={onPrevScene} title="Previous Scene">
            <i className="fa-solid fa-backward-step"></i>
          </button>
          <button className="ctrl-btn-mono" onClick={onNextScene} title="Next Scene">
            <i className="fa-solid fa-forward-step"></i>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.2rem' }}>
            <button className="ctrl-btn-mono" onClick={onToggleMute}>
              {isMuted || volume === 0 ? <i className="fa-solid fa-volume-xmark"></i> : <i className="fa-solid fa-volume-high"></i>}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              style={{ width: '65px', accentColor: 'var(--text-primary)' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Live Translation Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}><i className="fa-solid fa-language"></i></span>
            <select
              value={currentLanguage || 'English'}
              onChange={(e) => onLiveTranslate && onLiveTranslate(e.target.value)}
              className="select-mono"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
              disabled={isTranslating}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Shuffle Style & Methodology Button */}
          <button
            className="method-pill active"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', gap: '5px' }}
            onClick={onShuffleStyle}
            title="1-Click Methodology & Style Shuffle"
          >
            <i className="fa-solid fa-shuffle"></i> Shuffle Style
          </button>

          {/* Speed Selector */}
          <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-card)', padding: '2px', borderRadius: '4px' }}>
            {[1, 1.25, 1.5, 2].map((spd) => (
              <button
                key={spd}
                className={`method-pill ${playbackSpeed === spd ? 'active' : ''}`}
                style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                onClick={() => onChangeSpeed(spd)}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Export Video Button */}
          <button className="btn-black" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }} onClick={onExportVideo}>
            <i className="fa-solid fa-download"></i> Export WebM
          </button>
        </div>
      </div>
    </div>
  );
}
