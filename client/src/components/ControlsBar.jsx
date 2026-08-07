import React from 'react';

export default function ControlsBar({
  isPlaying,
  onTogglePlay,
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
  showCaptions = true,
  onToggleCaptions,
  onGenerateHeyGenVideo,
  isHeyGenGenerating = false
}) {
  return (
    <div className="player-controls" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: '16px', padding: '0.85rem 1.25rem' }}>
      {/* Seeker Row */}
      <div className="timeline-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.65rem' }}>
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progressPercent || 0}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="slider-mono"
          style={{ flex: 1, accentColor: '#FF0000' }}
        />
        <span className="time-mono" style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
          {currentTimeStr} / {totalTimeStr}
        </span>
      </div>

      {/* Action Buttons Row */}
      <div className="actions-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        {/* Playback Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button className="ctrl-btn-mono" onClick={onTogglePlay} title={isPlaying ? "Pause Lecture" : "Play Lecture"} style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isPlaying ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.3rem' }}>
            <button className="ctrl-btn-mono" onClick={onToggleMute} title={isMuted ? "Unmute" : "Mute"} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1rem' }}>
              {isMuted || volume === 0 ? <i className="fa-solid fa-volume-xmark"></i> : <i className="fa-solid fa-volume-high"></i>}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              style={{ width: '70px', accentColor: 'var(--accent-indigo)' }}
            />
          </div>

          {/* Captions Remove/Toggle Option */}
          <button
            className={`method-pill ${showCaptions ? 'active' : ''}`}
            onClick={onToggleCaptions}
            title={showCaptions ? "Hide Captions" : "Show Captions"}
            style={{ fontSize: '0.78rem', padding: '0.38rem 0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <i className={`fa-solid ${showCaptions ? 'fa-closed-captioning' : 'fa-rectangle-xmark'}`}></i>
            {showCaptions ? 'CC On' : 'CC Off'}
          </button>
        </div>

        {/* Clean Streamlined Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Active Hinglish Voice Badge */}
          <span className="badge-mono" style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', borderColor: 'rgba(99,102,241,0.3)', fontSize: '0.75rem', padding: '0.38rem 0.75rem' }}>
            <i className="fa-solid fa-microphone-lines" style={{ marginRight: '5px' }}></i> Hinglish Expressive AI Voice
          </span>

          {/* HeyGen Virtual Avatar Video Generation Trigger Button */}
          {onGenerateHeyGenVideo && (
            <button
              className="method-pill"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.78rem', gap: '6px', background: 'rgba(236,72,153,0.14)', color: '#ec4899', borderColor: 'rgba(236,72,153,0.35)', fontWeight: 600 }}
              onClick={onGenerateHeyGenVideo}
              disabled={isHeyGenGenerating}
              title="Generate Virtual Teacher Video with HeyGen"
            >
              {isHeyGenGenerating ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-video"></i>}
              HeyGen Video
            </button>
          )}

          {/* Speed Selector */}
          <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-surface)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            {[1, 1.25, 1.5, 2].map((spd) => (
              <button
                key={spd}
                className={`method-pill ${playbackSpeed === spd ? 'active' : ''}`}
                style={{ padding: '3px 8px', fontSize: '0.75rem', border: 'none' }}
                onClick={() => onChangeSpeed(spd)}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Export Video Button */}
          <button className="btn-black" style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderColor: 'transparent', fontWeight: 600 }} onClick={onExportVideo}>
            <i className="fa-solid fa-download"></i> Export WebM
          </button>
        </div>
      </div>
    </div>
  );
}
