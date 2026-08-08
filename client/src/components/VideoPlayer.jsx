import React, { useEffect, useRef, useState, useCallback } from 'react';
import AIAvatarPresenter from './AIAvatarPresenter';
import {
  sendTelemetryEvent,
  fetchVideoStats,
  fetchChannelStats,
  subscribeTelemetryStream
} from '../services/telemetryClient';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Subtitles,
  Maximize,
  Minimize,
  Settings,
  HelpCircle,
  SkipForward,
  SkipBack,
  RotateCcw,
  RotateCw,
  Sliders,
  Tv,
  Keyboard
} from 'lucide-react';

export default function VideoPlayer({
  videoData,
  activeSceneIndex = 0,
  setActiveSceneIndex,
  sceneProgress = 0,
  isPlaying,
  onTogglePlay,
  currentAvatarId = 'Daisy-in-suit',
  onSelectAvatar,
  showCaptions = true,
  setShowCaptions,
  codec = 'AV1',
  onSelectCodec,
  quality = '1080p60',
  onSelectQuality,
  isTheaterMode = false,
  onToggleTheater,
  playbackSpeed = 1,
  setPlaybackSpeed,
  volume = 1,
  setVolume,
  isMuted = false,
  setIsMuted,
  onSeek,
  onExportVideo
}) {
  const canvasRef = useRef(null);
  const playerStageRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const clickTimeoutRef = useRef(null);

  const [avatarMode, setAvatarMode] = useState('pip'); // 'pip' | 'split' | 'off'
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const activeVideoId = videoData?.topic ? videoData.topic.replace(/\s+/g, '_').toLowerCase() : 'default_video';

  // Real Persistent Zero-Based Views Counter
  const viewsKey = `heybuddy_views_${activeVideoId}`;
  const [viewsCount, setViewsCount] = useState(() => {
    const saved = localStorage.getItem(viewsKey);
    return saved ? parseInt(saved, 10) : 0;
  });

  // Real Persistent Zero-Based Subscriber Counter
  const [subscribed, setSubscribed] = useState(() => {
    return localStorage.getItem('heybuddy_subscribed') === 'true';
  });
  const [subscriberCount, setSubscriberCount] = useState(() => {
    const saved = localStorage.getItem('heybuddy_subscribers_count');
    if (saved !== null) return parseInt(saved, 10);
    return localStorage.getItem('heybuddy_subscribed') === 'true' ? 1 : 0;
  });

  // Real Persistent Zero-Based Like / Dislike Counter & State
  const topicKey = `heybuddy_like_${activeVideoId}`;
  const [likedState, setLikedState] = useState(() => localStorage.getItem(topicKey) || 'none');
  const [likeCount, setLikeCount] = useState(() => {
    const savedLikes = localStorage.getItem(`heybuddy_likes_count_${activeVideoId}`);
    if (savedLikes !== null) return parseInt(savedLikes, 10);
    return localStorage.getItem(topicKey) === 'liked' ? 1 : 0;
  });

  // Real Live Student Telemetry & Unique HLL Visitors
  const [liveViewers, setLiveViewers] = useState(1);
  const [hllVisitorsEstimate, setHllVisitorsEstimate] = useState(1);

  // Send Initial Ingestion View Event & Sync Stats from v3 API
  useEffect(() => {
    // 1. Send ingest view event to backend stream queue
    sendTelemetryEvent({ videoId: activeVideoId, type: 'view' });

    // 2. Fetch initial consolidated stats (Bigtable + Redis + HLL)
    fetchVideoStats(activeVideoId).then(res => {
      if (res?.statistics) {
        if (res.statistics.viewCount) setViewsCount(res.statistics.viewCount);
        if (res.statistics.likeCount) setLikeCount(res.statistics.likeCount);
        if (res.statistics.liveConcurrentStudents) setLiveViewers(res.statistics.liveConcurrentStudents);
        if (res.statistics.uniqueVisitorsHLL) setHllVisitorsEstimate(res.statistics.uniqueVisitorsHLL);
      }
    });

    // 3. Subscribe to Server-Sent Events (SSE) real-time stream
    const unsubscribeSSE = subscribeTelemetryStream(activeVideoId, (data) => {
      if (data.views) setViewsCount(data.views);
      if (data.likes) setLikeCount(data.likes);
      if (data.subscribers) setSubscriberCount(data.subscribers);
    });

    const interval = setInterval(() => {
      setLiveViewers(prev => {
        return Math.max(1, prev);
      });
    }, 4000);

    return () => {
      clearInterval(interval);
      if (unsubscribeSSE) unsubscribeSSE();
    };
  }, [activeVideoId]);

  const toggleSubscribe = () => {
    const next = !subscribed;
    setSubscribed(next);
    localStorage.setItem('heybuddy_subscribed', next ? 'true' : 'false');
    setSubscriberCount(prev => (next ? prev + 1 : prev - 1));
    sendTelemetryEvent({
      videoId: activeVideoId,
      type: 'subscribe',
      action: next ? 'subscribe' : 'unsubscribe'
    });
  };

  const handleLike = () => {
    if (likedState === 'liked') {
      setLikedState('none');
      setLikeCount(prev => prev - 1);
      localStorage.setItem(topicKey, 'none');
      sendTelemetryEvent({ videoId: activeVideoId, type: 'like', action: 'remove' });
    } else {
      if (likedState === 'disliked') {
        setLikeCount(prev => prev + 1);
      } else {
        setLikeCount(prev => prev + 1);
      }
      setLikedState('liked');
      localStorage.setItem(topicKey, 'liked');
      sendTelemetryEvent({ videoId: activeVideoId, type: 'like', action: 'add' });
    }
  };

  const handleDislike = () => {
    if (likedState === 'disliked') {
      setLikedState('none');
      localStorage.setItem(topicKey, 'none');
      sendTelemetryEvent({ videoId: activeVideoId, type: 'dislike', action: 'remove' });
    } else {
      if (likedState === 'liked') {
        setLikeCount(prev => prev - 1);
      }
      setLikedState('disliked');
      localStorage.setItem(topicKey, 'disliked');
      sendTelemetryEvent({ videoId: activeVideoId, type: 'dislike', action: 'add' });
    }
  };

  // Scrubber Hover Tooltip State
  const [hoverTimeStr, setHoverTimeStr] = useState(null);
  const [hoverSceneTitle, setHoverSceneTitle] = useState(null);
  const [hoverPosX, setHoverPosX] = useState(0);
  const [isHoveringTimeline, setIsHoveringTimeline] = useState(false);

  // On-Screen Toast / Ripple Feedback State
  const [toastFeedback, setToastFeedback] = useState(null); // { icon, text, type: 'center' | 'left' | 'right' }

  const totalScenes = videoData?.scenes?.length || 1;
  const currentScene = videoData?.scenes?.[activeSceneIndex] || videoData?.scenes?.[0] || {};

  // Calculate Total Duration & Elapsed Time
  const getTotalDuration = useCallback(() => {
    if (!videoData?.scenes) return 60;
    return videoData.scenes.reduce((acc, s) => acc + (s.duration || 10), 0);
  }, [videoData]);

  const getCurrentTime = useCallback(() => {
    if (!videoData?.scenes) return 0;
    let prevSecs = 0;
    for (let i = 0; i < activeSceneIndex; i++) {
      prevSecs += videoData.scenes[i]?.duration || 10;
    }
    const currentDur = currentScene.duration || 10;
    return prevSecs + (currentDur * (sceneProgress / 100));
  }, [videoData, activeSceneIndex, currentScene, sceneProgress]);

  const totalSecs = getTotalDuration();
  const currentSecs = getCurrentTime();
  const progressPercent = totalSecs > 0 ? (currentSecs / totalSecs) * 100 : 0;

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Trigger Visual On-screen Ripple Toast
  const showToast = (text, type = 'center') => {
    setToastFeedback({ text, type });
    setTimeout(() => setToastFeedback(null), 900);
  };

  // Controls Auto-Hide Timer on Mouse Inactivity
  const handleMouseMoveStage = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying && !showSettingsMenu && !isHoveringTimeline) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  // Seeking Helper (by Delta seconds or Percentage)
  const seekToTime = (targetSecs) => {
    const clampedTime = Math.max(0, Math.min(totalSecs, targetSecs));
    if (!videoData?.scenes) return;

    let accumulated = 0;
    for (let i = 0; i < videoData.scenes.length; i++) {
      const dur = videoData.scenes[i]?.duration || 10;
      if (accumulated + dur >= clampedTime || i === videoData.scenes.length - 1) {
        if (setActiveSceneIndex) setActiveSceneIndex(i);
        const secInScene = clampedTime - accumulated;
        const progress = Math.min(100, Math.max(0, (secInScene / dur) * 100));
        if (onSeek) onSeek(progress);
        break;
      }
      accumulated += dur;
    }
  };

  const seekDelta = (deltaSecs) => {
    const target = currentSecs + deltaSecs;
    seekToTime(target);
    if (deltaSecs < 0) {
      showToast(`${deltaSecs}s`, 'left');
    } else {
      showToast(`+${deltaSecs}s`, 'right');
    }
  };

  const toggleFullscreen = () => {
    if (playerStageRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        playerStageRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    }
  };

  // YouTube Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore shortcut key bindings if typing in inputs/textareas
      const targetTag = e.target.tagName.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || e.target.isContentEditable) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'k':
        case ' ':
          e.preventDefault();
          onTogglePlay();
          showToast(isPlaying ? 'Paused' : 'Playing', 'center');
          break;

        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;

        case 't':
          e.preventDefault();
          if (onToggleTheater) onToggleTheater();
          showToast(isTheaterMode ? 'Default View' : 'Theater Mode', 'center');
          break;

        case 'm':
          e.preventDefault();
          if (setIsMuted) setIsMuted(!isMuted);
          showToast(isMuted ? 'Unmuted' : 'Muted', 'center');
          break;

        case 'j':
          e.preventDefault();
          seekDelta(-10);
          break;

        case 'l':
          e.preventDefault();
          seekDelta(10);
          break;

        case 'arrowleft':
          e.preventDefault();
          seekDelta(-5);
          break;

        case 'arrowright':
          e.preventDefault();
          seekDelta(5);
          break;

        case 'arrowup':
          e.preventDefault();
          if (setVolume) {
            const nextVol = Math.min(1, +(volume + 0.1).toFixed(2));
            setVolume(nextVol);
            if (setIsMuted && isMuted) setIsMuted(false);
            showToast(`Volume ${Math.round(nextVol * 100)}%`, 'center');
          }
          break;

        case 'arrowdown':
          e.preventDefault();
          if (setVolume) {
            const nextVol = Math.max(0, +(volume - 0.1).toFixed(2));
            setVolume(nextVol);
            showToast(`Volume ${Math.round(nextVol * 100)}%`, 'center');
          }
          break;

        case 'c':
          e.preventDefault();
          if (setShowCaptions) setShowCaptions(!showCaptions);
          showToast(showCaptions ? 'Captions Off' : 'Captions On', 'center');
          break;

        case ',':
        case '<':
          e.preventDefault();
          if (setPlaybackSpeed) {
            const nextSpd = Math.max(0.25, +(playbackSpeed - 0.25).toFixed(2));
            setPlaybackSpeed(nextSpd);
            showToast(`Speed ${nextSpd}x`, 'center');
          }
          break;

        case '.':
        case '>':
          e.preventDefault();
          if (setPlaybackSpeed) {
            const nextSpd = Math.min(2.0, +(playbackSpeed + 0.25).toFixed(2));
            setPlaybackSpeed(nextSpd);
            showToast(`Speed ${nextSpd}x`, 'center');
          }
          break;

        case 'n':
          e.preventDefault();
          if (setActiveSceneIndex && activeSceneIndex < totalScenes - 1) {
            setActiveSceneIndex(activeSceneIndex + 1);
            showToast(`Next Scene (${activeSceneIndex + 2}/${totalScenes})`, 'center');
          }
          break;

        case 'p':
          e.preventDefault();
          if (setActiveSceneIndex && activeSceneIndex > 0) {
            setActiveSceneIndex(activeSceneIndex - 1);
            showToast(`Prev Scene (${activeSceneIndex}/${totalScenes})`, 'center');
          }
          break;

        case '?':
        case '/':
          if (e.shiftKey || e.key === '?') {
            e.preventDefault();
            setShowShortcutsModal(prev => !prev);
          }
          break;

        default:
          if (e.key >= '0' && e.key <= '9') {
            e.preventDefault();
            const pct = Number(e.key) * 10;
            seekToTime((pct / 100) * totalSecs);
            showToast(`Seek ${pct}%`, 'center');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted, volume, showCaptions, playbackSpeed, activeSceneIndex, totalScenes, isTheaterMode, currentSecs, totalSecs]);

  // Stage Single / Double Click Handler
  const handleStageClick = (e) => {
    if (clickTimeoutRef.current) {
      // Double click detected!
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;

      const rect = playerStageRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX < rect.width / 2) {
        seekDelta(-10);
      } else {
        seekDelta(10);
      }
    } else {
      // Single click delay
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null;
        onTogglePlay();
        showToast(isPlaying ? 'Paused' : 'Playing', 'center');
      }, 250);
    }
  };

  // Canvas Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !videoData || !videoData.scenes || !videoData.scenes[0]) return;
    const ctx = canvas.getContext('2d');
    const scene = videoData.scenes[activeSceneIndex] || videoData.scenes[0];
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

    // 3. Top Masterclass Title Banner Box (Positioned below HTML top overlay badges)
    ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
    ctx.strokeStyle = "rgba(99, 102, 241, 0.3)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(30, 65, 900, 50, 16); ctx.fill(); ctx.stroke();

    ctx.font = "bold 18px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#F8FAFC"; ctx.textAlign = "left";
    ctx.fillText(`🎓 ${videoData.topic || scene.title}`, 50, 97);

    ctx.font = "bold 12px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#38BDF8"; ctx.textAlign = "right";
    ctx.fillText(`SCENE ${activeSceneIndex + 1}/${totalScenes} • ${videoData.gradeLevel || 'AP / College'}`, 910, 97);

    // 4. Render Visual Graphic Elements
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

    // 5. Content Takeaways Cards at Bottom
    if (scene.bullets && scene.bullets.length) {
      ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(30, 430, 900, 85, 16); ctx.fill(); ctx.stroke();

      ctx.font = "bold 11px 'JetBrains Mono', monospace"; ctx.fillStyle = "#818CF8";
      ctx.textAlign = "left"; ctx.fillText("KEY SCENE CONCEPT SUMMARY & FORMULA:", 50, 452);

      ctx.font = "500 13px 'Plus Jakarta Sans', sans-serif"; ctx.fillStyle = "#E2E8F0";
      scene.bullets.forEach((bullet, idx) => {
        const xPos = 50 + (idx * 300);
        if (idx < 3) ctx.fillText(`✨ ${bullet}`, xPos, 490);
      });
    }

  }, [videoData, activeSceneIndex, sceneProgress]);

  const handleTimelineMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const clampedPos = Math.max(0, Math.min(1, pos));
    const hoverSecs = clampedPos * totalSecs;

    // Find preview scene title at hover position
    let accumulated = 0;
    let title = currentScene.title;
    if (videoData?.scenes) {
      for (let s of videoData.scenes) {
        const dur = s.duration || 10;
        if (accumulated + dur >= hoverSecs) {
          title = s.title;
          break;
        }
        accumulated += dur;
      }
    }

    setHoverPosX(e.clientX - rect.left);
    setHoverTimeStr(formatTime(hoverSecs));
    setHoverSceneTitle(title);
  };

  if (!videoData) return null;

  return (
    <div className={`player-layout ${avatarMode === 'split' ? 'split-layout' : ''} ${isTheaterMode ? 'theater-layout' : ''}`}>
      {/* Main YouTube Stage Container */}
      <div
        ref={playerStageRef}
        onMouseMove={handleMouseMoveStage}
        onClick={handleStageClick}
        className="relative rounded-2xl overflow-hidden shadow-2xl bg-black group select-none cursor-pointer"
        style={{ aspectRatio: '16/9' }}
      >
        <canvas ref={canvasRef} width="960" height="540" className="w-full h-full object-contain" />

        {/* YouTube Top Badges Overlay (Z-Index 20) */}
        <div
          className={`absolute top-3 left-4 right-4 flex items-center justify-between z-20 transition-opacity duration-300 pointer-events-auto ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-black/80 text-[#ff0000] border border-[#ff0000]/40 font-bold text-[11px] shadow flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ff0000] animate-ping" />
              🔴 {liveViewers.toLocaleString()} Live Students
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-black/80 text-sky-400 border border-sky-500/30 font-mono text-[11px] hidden sm:inline">
              Codec: {codec}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-black/80 text-emerald-400 border border-emerald-500/30 font-mono text-[11px] hidden sm:inline">
              {quality}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAvatarMode(avatarMode === 'pip' ? 'off' : 'pip')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                avatarMode === 'pip' ? 'bg-[#ff0000] text-white border-transparent' : 'bg-black/80 text-slate-300 border-slate-700'
              }`}
            >
              PIP Avatar
            </button>
            <button
              onClick={() => setShowShortcutsModal(true)}
              className="p-1.5 rounded-lg bg-black/80 text-slate-300 hover:text-white border border-slate-700 text-xs"
              title="Keyboard Shortcuts (?)"
            >
              <Keyboard className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className={`p-1.5 rounded-lg bg-black/80 border text-xs transition-colors ${
                showSettingsMenu ? 'text-white border-[#ff0000]' : 'text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Settings"
            >
              <Settings className={`w-4 h-4 ${showSettingsMenu ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Visual On-Screen Ripple Toast Feedback (Z-Index 30) */}
        {toastFeedback && (
          <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
            {toastFeedback.type === 'center' && (
              <div className="w-16 h-16 rounded-full bg-black/75 border border-white/20 text-white flex items-center justify-center text-xl font-bold shadow-2xl animate-ping">
                {toastFeedback.text === 'Playing' ? <Play className="w-8 h-8 fill-current ml-1" /> : <Pause className="w-8 h-8 fill-current" />}
              </div>
            )}
            {toastFeedback.type === 'left' && (
              <div className="absolute left-10 w-20 h-20 rounded-full bg-[#ff0000]/30 border border-[#ff0000]/60 text-white flex flex-col items-center justify-center text-xs font-extrabold shadow-2xl animate-pulse">
                <RotateCcw className="w-6 h-6 mb-0.5" />
                {toastFeedback.text}
              </div>
            )}
            {toastFeedback.type === 'right' && (
              <div className="absolute right-10 w-20 h-20 rounded-full bg-[#ff0000]/30 border border-[#ff0000]/60 text-white flex flex-col items-center justify-center text-xs font-extrabold shadow-2xl animate-pulse">
                <RotateCw className="w-6 h-6 mb-0.5" />
                {toastFeedback.text}
              </div>
            )}
          </div>
        )}

        {/* Captions Narration Banner */}
        {showCaptions && (
          <div className="absolute bottom-16 left-6 right-6 z-20 pointer-events-none flex justify-center">
            <div className="px-4 py-2 rounded-xl bg-black/85 border border-slate-700/80 text-white text-xs md:text-sm font-medium text-center shadow-lg backdrop-blur-md max-w-2xl leading-relaxed">
              <span className="text-[#3ea6ff] font-bold mr-2">CC</span>
              {currentScene.narration || 'AI masterclass narration...'}
            </div>
          </div>
        )}

        {/* Compact Picture-in-Picture AI Avatar Floating Widget */}
        {avatarMode === 'pip' && (
          <div className="absolute bottom-16 right-4 z-20 w-24 sm:w-28 rounded-2xl overflow-hidden border border-indigo-500/40 shadow-2xl bg-black/95 pointer-events-auto">
            <AIAvatarPresenter
              isPlaying={isPlaying}
              currentAvatarId={currentAvatarId}
              onSelectAvatar={onSelectAvatar}
              compact={true}
            />
          </div>
        )}

        {/* YouTube Integrated Control Overlay Bar (Z-Index 20) */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/95 via-black/70 to-transparent pt-8 pb-3 px-4 transition-opacity duration-300 ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* YouTube Red Scrubber Timeline */}
          <div
            className="relative h-4 flex items-center cursor-pointer mb-2 group/scrubber"
            onMouseEnter={() => setIsHoveringTimeline(true)}
            onMouseLeave={() => setIsHoveringTimeline(false)}
            onMouseMove={handleTimelineMouseMove}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              seekToTime(pos * totalSecs);
            }}
          >
            {/* Timeline Tooltip Hover Box */}
            {isHoveringTimeline && (
              <div
                className="absolute bottom-5 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-[#121212] border border-slate-700 text-white text-[11px] font-mono pointer-events-none shadow-xl flex flex-col items-center whitespace-nowrap z-30"
                style={{ left: `${hoverPosX}px` }}
              >
                <span className="font-bold text-[#ff0000]">{hoverTimeStr}</span>
                {hoverSceneTitle && <span className="text-[10px] text-slate-300 max-w-[180px] truncate">{hoverSceneTitle}</span>}
              </div>
            )}

            {/* Red Progress Track */}
            <div className={`w-full bg-white/20 rounded-full overflow-hidden transition-all ${isHoveringTimeline ? 'h-2' : 'h-1.5'}`}>
              <div
                className="h-full bg-[#ff0000] relative rounded-full"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#ff0000] shadow-md group-hover/scrubber:scale-125 transition-transform" />
              </div>
            </div>
          </div>

          {/* Bottom Action Controls Row */}
          <div className="flex items-center justify-between gap-3 text-white text-xs">
            {/* Left Controls: Play, Scene Nav, Volume, Time */}
            <div className="flex items-center gap-3">
              <button
                onClick={onTogglePlay}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white"
                title={isPlaying ? "Pause (k)" : "Play (k)"}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <button
                onClick={() => setActiveSceneIndex && activeSceneIndex > 0 && setActiveSceneIndex(activeSceneIndex - 1)}
                disabled={activeSceneIndex === 0}
                className="p-1 text-slate-300 hover:text-white disabled:opacity-30 transition-colors"
                title="Previous Scene (p)"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveSceneIndex && activeSceneIndex < totalScenes - 1 && setActiveSceneIndex(activeSceneIndex + 1)}
                disabled={activeSceneIndex === totalScenes - 1}
                className="p-1 text-slate-300 hover:text-white disabled:opacity-30 transition-colors"
                title="Next Scene (n)"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Volume Slider Group */}
              <div className="flex items-center gap-2 group/vol">
                <button
                  onClick={() => setIsMuted && setIsMuted(!isMuted)}
                  className="p-1 text-slate-300 hover:text-white transition-colors"
                  title="Mute (m)"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    if (setVolume) setVolume(parseFloat(e.target.value));
                    if (setIsMuted && isMuted) setIsMuted(false);
                  }}
                  className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#ff0000]"
                />
              </div>

              {/* Timestamp Counter */}
              <span className="font-mono text-slate-300 text-[11px] shrink-0">
                {formatTime(currentSecs)} / {formatTime(totalSecs)}
              </span>
            </div>

            {/* Right Controls: CC, Speed, Settings, Fullscreen */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCaptions && setShowCaptions(!showCaptions)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                  showCaptions ? 'bg-[#ff0000] text-white border-transparent' : 'bg-black/60 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title="Subtitles (c)"
              >
                CC
              </button>

              {/* Speed Button */}
              <button
                onClick={() => {
                  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
                  const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                  if (setPlaybackSpeed) setPlaybackSpeed(speeds[nextIdx]);
                }}
                className="px-2 py-0.5 rounded bg-black/60 border border-slate-700 text-slate-200 font-mono text-[11px] hover:text-white"
                title="Playback Speed (< / >)"
              >
                {playbackSpeed}x
              </button>

              <button
                onClick={onToggleTheater}
                className="p-1.5 text-slate-300 hover:text-white transition-colors"
                title="Theater mode (t)"
              >
                <Tv className="w-4 h-4" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-1.5 text-slate-300 hover:text-white transition-colors"
                title="Fullscreen (f)"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* YouTube Settings Popover Menu */}
        {showSettingsMenu && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-12 right-4 z-40 bg-[#181818]/95 border border-[#303030] rounded-2xl p-4 w-64 shadow-2xl backdrop-blur-xl text-xs space-y-3 animate-fadeIn"
          >
            <div className="font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4 text-[#ff0000]" /> Player Settings & Quality
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1 font-semibold">Playback Speed</label>
              <div className="grid grid-cols-4 gap-1">
                {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => { if (setPlaybackSpeed) setPlaybackSpeed(spd); }}
                    className={`py-1 rounded font-mono text-[11px] transition-colors ${
                      playbackSpeed === spd ? 'bg-[#ff0000] text-white font-bold' : 'bg-[#272727] text-slate-300 hover:bg-[#383838]'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1 font-semibold">Video Codec</label>
              <select
                value={codec}
                onChange={(e) => onSelectCodec && onSelectCodec(e.target.value)}
                className="w-full p-2 rounded-xl bg-[#121212] border border-[#303030] text-white text-xs outline-none"
              >
                <option value="AV1">AV1 (Ultra High Efficiency)</option>
                <option value="VP9">VP9 (WebM Standard)</option>
                <option value="AVC / H.264">H.264 (Universal)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1 font-semibold">Quality Stream</label>
              <select
                value={quality}
                onChange={(e) => onSelectQuality && onSelectQuality(e.target.value)}
                className="w-full p-2 rounded-xl bg-[#121212] border border-[#303030] text-white text-xs outline-none"
              >
                <option value="1080p60">1080p60 HD</option>
                <option value="720p60">720p60</option>
                <option value="480p">480p</option>
              </select>
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Help Modal */}
        {showShortcutsModal && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md p-6 flex flex-col justify-between animate-fadeIn overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-[#ff0000]" /> YouTube Keyboard Shortcuts
              </h3>
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded bg-[#272727]"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 text-xs">
              <div className="p-2.5 rounded-xl bg-[#181818] border border-[#272727] space-y-0.5">
                <span className="font-mono text-[#ff0000] font-bold">k / Space</span>
                <p className="text-slate-300">Toggle Play / Pause</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#181818] border border-[#272727] space-y-0.5">
                <span className="font-mono text-[#ff0000] font-bold">f</span>
                <p className="text-slate-300">Toggle Fullscreen</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#181818] border border-[#272727] space-y-0.5">
                <span className="font-mono text-[#ff0000] font-bold">t</span>
                <p className="text-slate-300">Toggle Theater Mode</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#181818] border border-[#272727] space-y-0.5">
                <span className="font-mono text-[#ff0000] font-bold">m</span>
                <p className="text-slate-300">Mute / Unmute</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#181818] border border-[#272727] space-y-0.5">
                <span className="font-mono text-[#ff0000] font-bold">j / l</span>
                <p className="text-slate-300">Rewind / Forward 10s</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#181818] border border-[#272727] space-y-0.5">
                <span className="font-mono text-[#ff0000] font-bold">← / →</span>
                <p className="text-slate-300">Rewind / Forward 5s</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#181818] border border-[#272727] space-y-0.5">
                <span className="font-mono text-[#ff0000] font-bold">↑ / ↓</span>
                <p className="text-slate-300">Volume Up / Down 10%</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#181818] border border-[#272727] space-y-0.5">
                <span className="font-mono text-[#ff0000] font-bold">c</span>
                <p className="text-slate-300">Toggle Captions</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#181818] border border-[#272727] space-y-0.5">
                <span className="font-mono text-[#ff0000] font-bold">0 - 9</span>
                <p className="text-slate-300">Jump to 0% - 90%</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#181818] border border-[#272727] space-y-0.5">
                <span className="font-mono text-[#ff0000] font-bold">&lt; / &gt;</span>
                <p className="text-slate-300">Decrease / Increase Speed</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#181818] border border-[#272727] space-y-0.5">
                <span className="font-mono text-[#ff0000] font-bold">n / p</span>
                <p className="text-slate-300">Next / Previous Scene</p>
              </div>
            </div>

            <div className="text-center text-slate-500 text-[11px]">
              Tip: Press <kbd className="px-1.5 py-0.5 bg-[#272727] rounded text-slate-300 font-mono">?</kbd> at any time to open this guide.
            </div>
          </div>
        )}
      </div>

      {/* Split Avatar Panel */}
      {avatarMode === 'split' && (
        <div className="mt-4 p-4 rounded-2xl bg-[#181818] border border-[#272727]">
          <AIAvatarPresenter
            isPlaying={isPlaying}
            currentAvatarId={currentAvatarId}
            onSelectAvatar={onSelectAvatar}
            compact={false}
          />
        </div>
      )}

      {/* Channel Meta Bar below Player */}
      <div className="mt-4 p-5 rounded-2xl bg-[#181818] border border-[#272727] space-y-4">
        <h1 className="text-xl md:text-2xl font-extrabold text-white">
          {videoData.topic}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#ff0000] to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
              🎓
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                heyBuddy Hinglish AI Professor
                <span className="w-4 h-4 rounded-full bg-[#3ea6ff]/20 text-[#3ea6ff] flex items-center justify-center text-[10px] font-bold">✓</span>
              </div>
              <div className="text-xs text-slate-400">
                {subscriberCount.toLocaleString()} Subscribers
              </div>
            </div>

            <button
              onClick={toggleSubscribe}
              className={`ml-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                subscribed
                  ? 'bg-[#272727] text-slate-300 border border-slate-700'
                  : 'bg-white text-black hover:bg-slate-200'
              }`}
            >
              {subscribed ? 'Subscribed ✓' : 'Subscribe'}
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center rounded-full bg-[#272727] border border-slate-700 overflow-hidden text-xs text-slate-200">
              <button
                onClick={handleLike}
                className={`px-3.5 py-2 hover:bg-[#383838] transition-colors flex items-center gap-1.5 ${likedState === 'liked' ? 'text-[#3ea6ff] font-bold' : ''}`}
              >
                👍 {likeCount.toLocaleString()}
              </button>
              <div className="w-px h-4 bg-slate-700" />
              <button
                onClick={handleDislike}
                className={`px-3 py-2 hover:bg-[#383838] transition-colors ${likedState === 'disliked' ? 'text-red-400 font-bold' : ''}`}
              >
                👎
              </button>
            </div>

            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Video link copied to clipboard!'); }}
              className="px-4 py-2 rounded-full bg-[#272727] hover:bg-[#383838] border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Share
            </button>

            <button
              onClick={onExportVideo}
              className="px-4 py-2 rounded-full bg-[#272727] hover:bg-[#383838] border border-slate-700 text-xs font-semibold text-[#3ea6ff] hover:text-sky-300 transition-colors"
            >
              Download WebM
            </button>
          </div>
        </div>

        {/* Expandable Description Box */}
        <div className="mt-3 bg-[#121212] p-4 rounded-xl border border-[#272727] text-xs space-y-2">
          <div className="flex flex-wrap items-center gap-3 text-slate-300 font-bold">
            <span>{viewsCount.toLocaleString()} views</span>
            <span>• Premiered Aug 7, 2026</span>
            <span className="text-[#3ea6ff]">#HinglishMasterclass</span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono">
              ⚡ HLL Est: ~{hllVisitorsEstimate.toLocaleString()} Uniques
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
              ⚡ GCP Bigtable & CRDT G-Counter Sync
            </span>
          </div>

          <p className="text-slate-300 leading-relaxed">
            {videoData.summary || `Single-scene Hinglish AI Masterclass on "${videoData.topic}".`}
          </p>

          {isDescriptionExpanded && (
            <div className="mt-3 pt-3 border-t border-[#272727] space-y-2 text-slate-400">
              <div className="font-bold text-white">Distributed Telemetry Infrastructure (YouTube Architecture):</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                <div className="p-2 rounded bg-black/40 border border-slate-800">
                  <span className="text-indigo-400 font-bold">In-Memory Cache:</span> Redis Accumulator Store
                </div>
                <div className="p-2 rounded bg-black/40 border border-slate-800">
                  <span className="text-emerald-400 font-bold">Unique Estimator:</span> HyperLogLog (64-Register)
                </div>
                <div className="p-2 rounded bg-black/40 border border-slate-800">
                  <span className="text-sky-400 font-bold">CRDT Counters:</span> Multi-Region G-Counter
                </div>
                <div className="p-2 rounded bg-black/40 border border-slate-800">
                  <span className="text-purple-400 font-bold">Persistent Audit:</span> Cloud Bigtable / Spanner
                </div>
              </div>

              <div className="font-bold text-white pt-1">Open Academic Citations:</div>
              <p className="text-[11px]">
                Content derived from OpenStax Rice University, Project Gutenberg, Internet Archive, LibreTexts OER, Wikidata SPARQL, Wolfram Alpha API, and Stack Exchange Q&A.
              </p>
            </div>
          )}

          <button
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            className="text-[#3ea6ff] font-bold hover:underline"
          >
            {isDescriptionExpanded ? 'Show less ▲' : '...more ▼'}
          </button>
        </div>
      </div>
    </div>
  );
}

