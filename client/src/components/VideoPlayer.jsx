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
  onToggleTheater
}) {
  const canvasRef = useRef(null);
  const playerStageRef = useRef(null);
  const [avatarMode, setAvatarMode] = useState('pip'); // 'pip' | 'split' | 'off'
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  // 2D High-Fidelity Masterclass Slide Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !videoData || !videoData.scenes || !videoData.scenes[0]) return;
    const ctx = canvas.getContext('2d');
    const scene = videoData.scenes[0];
    const canvasData = scene.canvasData || {};

    // 1. Rich Warm Background Linear Gradient
    const grad = ctx.createLinearGradient(0, 0, 960, 540);
    grad.addColorStop(0, "#070a14");
    grad.addColorStop(1, "#121b2d");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 960, 540);

    // 2. Ambient Soft Background Glow Spheres
    const aura1 = ctx.createRadialGradient(250, 180, 10, 250, 180, 320);
    aura1.addColorStop(0, "rgba(99, 102, 241, 0.2)");
    aura1.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = aura1;
    ctx.beginPath(); ctx.arc(250, 180, 320, 0, Math.PI * 2); ctx.fill();

    const aura2 = ctx.createRadialGradient(720, 360, 10, 720, 360, 280);
    aura2.addColorStop(0, "rgba(16, 185, 129, 0.16)");
    aura2.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = aura2;
    ctx.beginPath(); ctx.arc(720, 360, 280, 0, Math.PI * 2); ctx.fill();

    // 3. Header Scene Title Glassmorphic Banner
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.beginPath();
    ctx.roundRect(40, 25, 880, 52, 14);
    ctx.fill();

    ctx.font = "bold 18px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#F8FAFC";
    ctx.textAlign = "left";
    ctx.fillText(`SCENE: ${scene.title || videoData.topic}`, 65, 57);

    ctx.font = "bold 12px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#818CF8";
    ctx.textAlign = "right";
    const domainTag = videoData.streamDomain ? `${videoData.streamDomain} • ` : '';
    const levelTag = videoData.gradeLevel ? `${videoData.gradeLevel}` : 'Standard';
    ctx.fillText(`${domainTag}${levelTag}`, 895, 57);

    // 4. Render Scene Visual Elements
    const elements = canvasData.elements || [];

    elements.forEach((el) => {
      ctx.save();
      if (el.type === 'sun') {
        const sunGrad = ctx.createRadialGradient(el.x, el.y, 5, el.x, el.y, el.radius || 45);
        sunGrad.addColorStop(0, "#FDE047");
        sunGrad.addColorStop(1, el.color || "#F59E0B");
        ctx.fillStyle = sunGrad;
        ctx.beginPath(); ctx.arc(el.x, el.y, el.radius || 45, 0, Math.PI * 2); ctx.fill();

        ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#F8FAFC"; ctx.textAlign = "center";
        ctx.fillText(el.label || "Sunlight (Photons)", el.x, el.y + (el.radius || 45) + 20);
      }
      else if (el.type === 'leaf') {
        ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
        ctx.strokeStyle = "#10B981"; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.ellipse(el.x, el.y, el.width / 2, el.height / 2, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();

        ctx.font = "bold 15px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#34D399"; ctx.textAlign = "center";
        ctx.fillText("CHLOROPLAST THYLAKOID MATRIX", el.x, el.y + 5);
      }
      else if (el.type === 'molecule' || el.type === 'output') {
        ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
        ctx.strokeStyle = el.color || "#6366F1"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(el.x - 85, el.y - 24, 170, 48, 12); ctx.fill(); ctx.stroke();

        ctx.font = "bold 14px 'JetBrains Mono', monospace";
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
        const boxGrad = ctx.createLinearGradient(el.x, el.y, el.x + 560, el.y + 64);
        boxGrad.addColorStop(0, "rgba(99, 102, 241, 0.18)");
        boxGrad.addColorStop(1, "rgba(16, 185, 129, 0.18)");
        ctx.fillStyle = boxGrad;
        ctx.strokeStyle = el.color || "#818CF8"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(el.x, el.y, 560, 64, 14); ctx.fill(); ctx.stroke();

        ctx.font = "bold 17px 'JetBrains Mono', monospace";
        ctx.fillStyle = "#F8FAFC"; ctx.textAlign = "center";
        ctx.fillText(el.text, el.x + 280, el.y + 38);
      }
      else if (el.type === 'concept_node' || el.type === 'branch_node') {
        const nodeGrad = ctx.createRadialGradient(el.x, el.y, 5, el.x, el.y, el.r || 50);
        nodeGrad.addColorStop(0, "rgba(30, 41, 59, 0.95)");
        nodeGrad.addColorStop(1, "rgba(15, 23, 42, 0.95)");
        ctx.fillStyle = nodeGrad;
        ctx.strokeStyle = el.color || "#6366F1"; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(el.x, el.y, el.r || 50, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#F8FAFC"; ctx.textAlign = "center";
        ctx.fillText(el.label, el.x, el.y + 4);
      }
      ctx.restore();
    });

    // 5. Polished Key Takeaways Footer Box
    if (scene.bullets && scene.bullets.length) {
      ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
      ctx.beginPath(); ctx.roundRect(40, 435, 880, 80, 14); ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)"; ctx.lineWidth = 1; ctx.stroke();

      ctx.font = "bold 11px 'JetBrains Mono', monospace"; ctx.fillStyle = "#818CF8";
      ctx.textAlign = "left"; ctx.fillText("KEY TAKEAWAYS & VERBALIZED FORMULAS:", 60, 456);

      ctx.font = "500 13.5px 'Plus Jakarta Sans', sans-serif"; ctx.fillStyle = "#E2E8F0";
      scene.bullets.forEach((bullet, idx) => {
        if (idx < 2) ctx.fillText(`• ${bullet}`, 60 + (idx * 435), 492);
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

  if (!videoData) return null;
  const currentScene = videoData.scenes[0] || {};

  return (
    <div className={`player-layout ${avatarMode === 'split' ? 'split-layout' : ''} ${isTheaterMode ? 'theater-layout' : ''}`}>
      <div className="stage-wrapper" ref={playerStageRef} style={{ borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
        <canvas ref={canvasRef} width="960" height="540" style={{ width: '100%', height: 'auto', display: 'block' }} />

        {/* Top Badges */}
        <div style={{ position: 'absolute', top: '14px', left: '16px', display: 'flex', gap: '8px', zIndex: 10 }}>
          <span className="badge-mono" style={{ background: 'rgba(0,0,0,0.7)', color: '#38bdf8', borderColor: 'rgba(56,189,248,0.3)', fontSize: '0.68rem' }}>
            <i className="fa-solid fa-microchip"></i> Codec: {codec}
          </span>
          <span className="badge-mono" style={{ background: 'rgba(0,0,0,0.7)', color: '#34d399', borderColor: 'rgba(52,211,153,0.3)', fontSize: '0.68rem' }}>
            <i className="fa-solid fa-sliders"></i> MSE: {quality}
          </span>
        </div>

        {/* Top Right Avatar Mode Controls */}
        <div className="avatar-controls-top" style={{ position: 'absolute', top: '14px', right: '16px', display: 'flex', gap: '6px', zIndex: 10 }}>
          <button
            className={`method-pill ${avatarMode === 'pip' ? 'active' : ''}`}
            onClick={() => setAvatarMode('pip')}
            style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
          >
            PIP Avatar
          </button>
          <button
            className={`method-pill ${avatarMode === 'split' ? 'active' : ''}`}
            onClick={() => setAvatarMode('split')}
            style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
          >
            Split View
          </button>
          <button
            className={`method-pill ${avatarMode === 'off' ? 'active' : ''}`}
            onClick={() => setAvatarMode('off')}
            style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
          >
            Hide Avatar
          </button>
        </div>

        {/* PIP Avatar Presenter */}
        {avatarMode === 'pip' && (
          <div className="pip-avatar-wrapper" style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 15 }}>
            <AIAvatarPresenter
              isPlaying={isPlaying}
              currentAvatarId={currentAvatarId}
              onSelectAvatar={onSelectAvatar}
              compact={true}
            />
          </div>
        )}

        {/* Captions Narration Banner */}
        {showCaptions && (
          <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '200px', background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '0.6rem 1rem', fontSize: '0.85rem', color: '#f8fafc', zIndex: 15 }}>
            <i className="fa-solid fa-closed-captioning" style={{ marginRight: '8px', color: '#818cf8' }}></i>
            {currentScene.narration || 'Loading video narration...'}
          </div>
        )}
      </div>

      {avatarMode === 'split' && (
        <div className="split-avatar-panel" style={{ marginTop: '1rem' }}>
          <AIAvatarPresenter
            isPlaying={isPlaying}
            currentAvatarId={currentAvatarId}
            onSelectAvatar={onSelectAvatar}
            compact={false}
          />
        </div>
      )}
    </div>
  );
}
