import React, { useEffect, useRef, useState } from 'react';
import AIAvatarPresenter from './AIAvatarPresenter';

export default function VideoPlayer({
  videoData,
  activeSceneIndex = 0,
  sceneProgress = 0,
  isPlaying,
  currentAvatarId = 'maya',
  onSelectAvatar,
  showCaptions = true,
  codec = 'AV1',
  onSelectCodec,
  quality = '1080p60',
  onSelectQuality,
  isTheaterMode = false,
  onToggleTheater,
  onTogglePlay,
  onSeek,
  getCurrentTime,
  getTotalDuration,
  formatTime,
  onExportVideo
}) {
  const canvasRef = useRef(null);
  const playerStageRef = useRef(null);
  const [avatarMode, setAvatarMode] = useState('pip'); // 'pip' | 'split' | 'off'
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(24850);
  const [subscribed, setSubscribed] = useState(false);

  const [hoverTimeStr, setHoverTimeStr] = useState(null);
  const [hoverPosX, setHoverPosX] = useState(0);
  const [isHoveringTimeline, setIsHoveringTimeline] = useState(false);

  // 2D Ultra-Attractive Single Masterclass Slide Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !videoData || !videoData.scenes || !videoData.scenes[0]) return;
    const ctx = canvas.getContext('2d');
    const scene = videoData.scenes[0];
    const canvasData = scene.canvasData || {};

    // 1. Rich Deep Dark Gradient Background
    const grad = ctx.createLinearGradient(0, 0, 960, 540);
    grad.addColorStop(0, "#050814");
    grad.addColorStop(0.5, "#0b1224");
    grad.addColorStop(1, "#111a33");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 960, 540);

    // 2. Ambient Glowing Dynamic Aura Rings
    const aura1 = ctx.createRadialGradient(240, 160, 10, 240, 160, 350);
    aura1.addColorStop(0, "rgba(99, 102, 241, 0.22)");
    aura1.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = aura1;
    ctx.beginPath(); ctx.arc(240, 160, 350, 0, Math.PI * 2); ctx.fill();

    const aura2 = ctx.createRadialGradient(740, 340, 10, 740, 340, 300);
    aura2.addColorStop(0, "rgba(16, 185, 129, 0.18)");
    aura2.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = aura2;
    ctx.beginPath(); ctx.arc(740, 340, 300, 0, Math.PI * 2); ctx.fill();

    // 3. Top Masterclass Title Banner Box
    ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
    ctx.strokeStyle = "rgba(99, 102, 241, 0.3)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(30, 20, 900, 56, 16); ctx.fill(); ctx.stroke();

    ctx.font = "bold 19px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#F8FAFC"; ctx.textAlign = "left";
    ctx.fillText(`🎓 ${videoData.topic || scene.title}`, 50, 55);

    ctx.font = "bold 12px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#38BDF8"; ctx.textAlign = "right";
    ctx.fillText(`HINGLISH MASTERCLASS • ${videoData.gradeLevel || 'AP / College'}`, 910, 55);

    // 4. Render Rich Visual Graphic Elements
    const elements = canvasData.elements || [];
    elements.forEach((el) => {
      ctx.save();
      if (el.type === 'sun') {
        const sunGrad = ctx.createRadialGradient(el.x, el.y, 5, el.x, el.y, el.radius || 40);
        sunGrad.addColorStop(0, "#FDE047");
        sunGrad.addColorStop(1, el.color || "#F59E0B");
        ctx.fillStyle = sunGrad;
        ctx.beginPath(); ctx.arc(el.x, el.y, el.radius || 40, 0, Math.PI * 2); ctx.fill();

        ctx.font = "bold 12px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#F8FAFC"; ctx.textAlign = "center";
        ctx.fillText(el.label || "Sunlight (Photons)", el.x, el.y + (el.radius || 40) + 18);
      }
      else if (el.type === 'leaf') {
        ctx.fillStyle = "rgba(16, 185, 129, 0.16)";
        ctx.strokeStyle = "#10B981"; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.ellipse(el.x, el.y, el.width / 2, el.height / 2, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();

        ctx.font = "bold 15px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#34D399"; ctx.textAlign = "center";
        ctx.fillText("CHLOROPLAST THYLAKOID MATRIX", el.x, el.y + 4);
      }
      else if (el.type === 'molecule' || el.type === 'output') {
        ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
        ctx.strokeStyle = el.color || "#6366F1"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(el.x - 90, el.y - 24, 180, 48, 12); ctx.fill(); ctx.stroke();

        ctx.font = "bold 13.5px 'JetBrains Mono', monospace";
        ctx.fillStyle = el.color || "#F8FAFC"; ctx.textAlign = "center";
        ctx.fillText(el.name, el.x, el.y + 6);
      }
      else if (el.type === 'arrow') {
        ctx.strokeStyle = el.color || "#38BDF8"; ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]); ctx.beginPath();
        ctx.moveTo(el.from[0], el.from[1]); ctx.lineTo(el.to[0], el.to[1]); ctx.stroke();
        ctx.setLineDash([]);

        if (el.label) {
          ctx.font = "600 12px 'Plus Jakarta Sans', sans-serif";
          ctx.fillStyle = "#94A3B8"; ctx.textAlign = "center";
          const midX = (el.from[0] + el.to[0]) / 2;
          const midY = (el.from[1] + el.to[1]) / 2 - 10;
          ctx.fillText(el.label, midX, midY);
        }
      }
      else if (el.type === 'formula_banner') {
        const boxGrad = ctx.createLinearGradient(el.x, el.y, el.x + 640, el.y + 62);
        boxGrad.addColorStop(0, "rgba(99, 102, 241, 0.2)");
        boxGrad.addColorStop(1, "rgba(16, 185, 129, 0.2)");
        ctx.fillStyle = boxGrad;
        ctx.strokeStyle = el.color || "#818CF8"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(el.x, el.y, 640, 62, 14); ctx.fill(); ctx.stroke();

        ctx.font = "bold 16px 'JetBrains Mono', monospace";
        ctx.fillStyle = "#F8FAFC"; ctx.textAlign = "center";
        ctx.fillText(el.text, el.x + 320, el.y + 37);
      }
      else if (el.type === 'concept_node' || el.type === 'branch_node') {
        const nodeGrad = ctx.createRadialGradient(el.x, el.y, 5, el.x, el.y, el.r || 55);
        nodeGrad.addColorStop(0, "rgba(30, 41, 59, 0.95)");
        nodeGrad.addColorStop(1, "rgba(15, 23, 42, 0.98)");
        ctx.fillStyle = nodeGrad;
        ctx.strokeStyle = el.color || "#6366F1"; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(el.x, el.y, el.r || 55, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#F8FAFC"; ctx.textAlign = "center";
        ctx.fillText(el.label, el.x, el.y + 4);
      }
      ctx.restore();
    });

    // 5. Rich Content Takeaways Cards (Packed at Bottom)
    if (scene.bullets && scene.bullets.length) {
      ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(30, 430, 900, 85, 16); ctx.fill(); ctx.stroke();

      ctx.font = "bold 11px 'JetBrains Mono', monospace"; ctx.fillStyle = "#818CF8";
      ctx.textAlign = "left"; ctx.fillText("COMPLETE MASTERCLASS CONCEPTS & FORMULA SUMMARY:", 50, 452);

      ctx.font = "500 13px 'Plus Jakarta Sans', sans-serif"; ctx.fillStyle = "#E2E8F0";
      scene.bullets.forEach((bullet, idx) => {
        const xPos = 50 + (idx * 300);
        if (idx < 3) ctx.fillText(`✨ ${bullet}`, xPos, 490);
      });
    }

  }, [videoData, activeSceneIndex, sceneProgress]);

  const handleFullscreen = () => {
    if (playerStageRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        playerStageRef.current.requestFullscreen();
      }
    }
  };

  const handleTimelineMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const clampedPos = Math.max(0, Math.min(1, pos));
    const totalSecs = getTotalDuration ? getTotalDuration() : 200;
    const hoverSecs = clampedPos * totalSecs;

    setHoverPosX(e.clientX - rect.left);
    setHoverTimeStr(formatTime ? formatTime(hoverSecs) : '0:00');
  };

  if (!videoData) return null;
  const currentScene = videoData.scenes[0] || {};
  const currentSecs = getCurrentTime ? getCurrentTime() : 0;
  const totalSecs = getTotalDuration ? getTotalDuration() : 200;
  const progressPercent = totalSecs > 0 ? (currentSecs / totalSecs) * 100 : 0;

  return (
    <div className={`player-layout ${avatarMode === 'split' ? 'split-layout' : ''} ${isTheaterMode ? 'theater-layout' : ''}`}>
      <div className="stage-wrapper" ref={playerStageRef} style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 30px -10px rgba(0,0,0,0.6)' }}>
        <canvas ref={canvasRef} width="960" height="540" />

        {/* YouTube Top Badges */}
        <div style={{ position: 'absolute', top: '14px', left: '16px', display: 'flex', gap: '8px', zIndex: 10 }}>
          <span className="badge-mono" style={{ background: 'rgba(0,0,0,0.75)', color: '#FF0000', borderColor: 'rgba(255,0,0,0.4)', fontSize: '0.68rem' }}>
            <i className="fa-brands fa-youtube"></i> YouTube Hinglish Masterclass
          </span>
          <span className="badge-mono" style={{ background: 'rgba(0,0,0,0.75)', color: '#38bdf8', borderColor: 'rgba(56,189,248,0.3)', fontSize: '0.68rem' }}>
            <i className="fa-solid fa-microchip"></i> Codec: {codec}
          </span>
          <span className="badge-mono" style={{ background: 'rgba(0,0,0,0.75)', color: '#34d399', borderColor: 'rgba(52,211,153,0.3)', fontSize: '0.68rem' }}>
            <i className="fa-solid fa-sliders"></i> {quality}
          </span>
        </div>

        {/* Top Right Avatar & View Controls */}
        <div className="avatar-controls-top">
          <button
            className={`mode-btn ${avatarMode === 'pip' ? 'active' : ''}`}
            onClick={() => setAvatarMode('pip')}
            title="Picture in Picture Avatar"
          >
            PIP Avatar
          </button>
          <button
            className={`mode-btn ${avatarMode === 'split' ? 'active' : ''}`}
            onClick={() => setAvatarMode('split')}
            title="Side by Side Split View"
          >
            Split View
          </button>
          <button
            className={`mode-btn ${avatarMode === 'off' ? 'active' : ''}`}
            onClick={() => setAvatarMode('off')}
            title="Hide Avatar"
          >
            Hide Avatar
          </button>
          <button
            className={`mode-btn ${showSettingsMenu ? 'active' : ''}`}
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            title="YouTube Settings & Codecs"
            style={{ borderRadius: '50%', width: '28px', height: '28px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <i className={`fa-solid fa-gear ${showSettingsMenu ? 'fa-spin' : ''}`}></i>
          </button>
        </div>

        {/* YouTube Settings Popover Menu */}
        {showSettingsMenu && (
          <div style={{ position: 'absolute', top: '48px', right: '14px', background: 'rgba(15,23,42,0.96)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '0.75rem', zIndex: 30, width: '220px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.3rem' }}>
              <i className="fa-solid fa-sliders" style={{ color: '#818cf8', marginRight: '6px' }}></i> Player Codec & Quality
            </div>

            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Video Codec:</label>
              <select
                value={codec}
                onChange={(e) => onSelectCodec && onSelectCodec(e.target.value)}
                className="select-mono"
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem' }}
              >
                <option value="AV1">AV1 (AOMedia Video 1)</option>
                <option value="VP9">VP9 (WebM High-Efficiency)</option>
                <option value="AVC / H.264">AVC / H.264 (Universal Standard)</option>
              </select>
            </div>

            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>MSE Quality Stream:</label>
              <select
                value={quality}
                onChange={(e) => onSelectQuality && onSelectQuality(e.target.value)}
                className="select-mono"
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem' }}
              >
                <option value="Auto (Adaptive)">Auto (Adaptive Bitrate)</option>
                <option value="1080p60">1080p60 HD</option>
                <option value="720p60">720p60</option>
                <option value="480p">480p</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <button className="mode-btn" onClick={onToggleTheater} style={{ fontSize: '0.68rem', width: '48%' }}>
                {isTheaterMode ? 'Default View' : 'Theater Mode'}
              </button>
              <button className="mode-btn" onClick={handleFullscreen} style={{ fontSize: '0.68rem', width: '48%' }}>
                Fullscreen
              </button>
            </div>
          </div>
        )}

        {/* PIP Avatar Presenter */}
        {avatarMode === 'pip' && (
          <div className="pip-avatar-wrapper">
            <AIAvatarPresenter
              isPlaying={isPlaying}
              currentAvatarId={currentAvatarId}
              onSelectAvatar={onSelectAvatar}
              compact={true}
            />
          </div>
        )}

        {/* YouTube Red Scrubber & Interactive Controls Bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0))', padding: '0.5rem 1rem 0.6rem', zIndex: 20 }}>
          <div
            style={{ position: 'relative', height: '14px', display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '4px' }}
            onMouseEnter={() => setIsHoveringTimeline(true)}
            onMouseLeave={() => setIsHoveringTimeline(false)}
            onMouseMove={handleTimelineMouseMove}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              if (onSeek) onSeek(pos * 100);
            }}
          >
            {isHoveringTimeline && (
              <div style={{ position: 'absolute', bottom: '16px', left: `${hoverPosX}px`, transform: 'translateX(-50%)', background: '#0f172a', color: '#f8fafc', fontSize: '0.68rem', fontFamily: 'monospace', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', pointerEvents: 'none' }}>
                {hoverTimeStr}
              </div>
            )}

            <div style={{ width: '100%', height: isHoveringTimeline ? '6px' : '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px', transition: 'height 0.15s ease' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: '#FF0000', borderRadius: '2px', position: 'relative' }}>
                <div style={{ position: 'absolute', right: '-6px', top: '50%', transform: 'translateY(-50%)', width: '12px', height: '12px', borderRadius: '50%', background: '#FF0000', boxShadow: '0 0 6px rgba(255,0,0,0.8)' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Captions Narration Banner */}
        {showCaptions && (
          <div className="subtitle-box">
            <i className="fa-solid fa-closed-captioning" style={{ marginRight: '8px', color: '#818cf8' }}></i>
            {currentScene.narration || 'Loading video narration...'}
          </div>
        )}
      </div>

      {avatarMode === 'split' && (
        <div className="split-avatar-panel">
          <AIAvatarPresenter
            isPlaying={isPlaying}
            currentAvatarId={currentAvatarId}
            onSelectAvatar={onSelectAvatar}
            compact={false}
          />
        </div>
      )}

      {/* Channel Meta Bar below Player */}
      <div className="mt-4 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <h1 className="text-xl md:text-2xl font-extrabold text-white">
          {videoData.topic}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
              🎓
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                heyBuddy Hinglish AI Professor
                <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-[10px] font-bold">✓</span>
              </div>
              <div className="text-xs text-slate-400">1.4M Subscribers</div>
            </div>

            <button
              onClick={() => setSubscribed(!subscribed)}
              className={`ml-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                subscribed
                  ? 'bg-slate-800 text-slate-300 border border-slate-700'
                  : 'bg-white text-slate-950 hover:bg-slate-200'
              }`}
            >
              {subscribed ? 'Subscribed ✓' : 'Subscribe'}
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center rounded-full glass-card border border-slate-800 overflow-hidden text-xs text-slate-200">
              <button
                onClick={() => { setLiked(!liked); setLikeCount(prev => liked ? prev - 1 : prev + 1); }}
                className={`px-3.5 py-2 hover:bg-slate-800 transition-colors flex items-center gap-1.5 ${liked ? 'text-sky-400 font-bold' : ''}`}
              >
                👍 {likeCount.toLocaleString()}
              </button>
              <div className="w-px h-4 bg-slate-800" />
              <button className="px-3 py-2 hover:bg-slate-800 transition-colors">
                👎
              </button>
            </div>

            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Video link copied to clipboard!'); }}
              className="px-4 py-2 rounded-full glass-card hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Share
            </button>

            <button
              onClick={onExportVideo}
              className="px-4 py-2 rounded-full glass-card hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Download WebM
            </button>
          </div>
        </div>

        {/* Expandable Description Box */}
        <div className="mt-3 glass-card p-4 rounded-xl border border-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-3 text-slate-300 font-bold">
            <span>142,500 views</span>
            <span>• Premiered Aug 7, 2026</span>
            <span className="text-indigo-400">#HinglishMasterclass</span>
          </div>

          <p className="text-slate-300 leading-relaxed">
            {videoData.summary || `Single-scene Hinglish AI Masterclass on "${videoData.topic}".`}
          </p>

          {isDescriptionExpanded && (
            <div className="mt-3 pt-3 border-t border-slate-800 space-y-1 text-slate-400">
              <div className="font-bold text-white">Open Academic Citations:</div>
              <p className="text-[11px]">
                Content derived from OpenStax Rice University, Project Gutenberg, Internet Archive, LibreTexts OER, Wikidata SPARQL, Wolfram Alpha API, and Stack Exchange Q&A.
              </p>
            </div>
          )}

          <button
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            className="text-indigo-400 font-bold hover:underline"
          >
            {isDescriptionExpanded ? 'Show less ▲' : '...more ▼'}
          </button>
        </div>
      </div>
    </div>
  );
}
