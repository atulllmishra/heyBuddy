/**
 * heyBuddy AI - Frontend Video Renderer, Web Speech TTS, Canvas Animation Engine & Interactive Tutor
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM ELEMS
  const canvas = document.getElementById('videoCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const generateForm = document.getElementById('generateForm');
  const topicInput = document.getElementById('topicInput');
  const gradeSelect = document.getElementById('gradeSelect');
  const styleSelect = document.getElementById('styleSelect');
  const voiceSelect = document.getElementById('voiceSelect');
  const generateBtn = document.getElementById('generateBtn');
  
  // Video Controls
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playIcon = document.getElementById('playIcon');
  const prevSceneBtn = document.getElementById('prevSceneBtn');
  const nextSceneBtn = document.getElementById('nextSceneBtn');
  const timelineSlider = document.getElementById('timelineSlider');
  const currentTimeText = document.getElementById('currentTimeText');
  const totalTimeText = document.getElementById('totalTimeText');
  const volumeSlider = document.getElementById('volumeSlider');
  const muteBtn = document.getElementById('muteBtn');
  const volumeIcon = document.getElementById('volumeIcon');
  const subtitleText = document.getElementById('subtitleText');
  const videoTitleDisplay = document.getElementById('videoTitleDisplay');
  const videoLoader = document.getElementById('videoLoader');
  const exportVideoBtn = document.getElementById('exportVideoBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const canvasWrapper = document.getElementById('canvasWrapper');

  // Avatar & Speech
  const speechWaves = document.getElementById('speechWaves');
  const avatarStatus = document.getElementById('avatarStatus');
  const avatarFace = document.getElementById('avatarFace');

  // Tabs & Containers
  const sceneCardsList = document.getElementById('sceneCardsList');
  const quizContainer = document.getElementById('quizContainer');
  const notesContainer = document.getElementById('notesContainer');
  const scoreBadge = document.getElementById('scoreBadge');
  const downloadNotesBtn = document.getElementById('downloadNotesBtn');
  const sceneCountBadge = document.getElementById('sceneCountBadge');
  const chatMessages = document.getElementById('chatMessages');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');

  // Modal & Nav
  const apiKeyModalBtn = document.getElementById('apiKeyModalBtn');
  const apiModal = document.getElementById('apiModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const saveKeyBtn = document.getElementById('saveKeyBtn');
  const clearKeyBtn = document.getElementById('clearKeyBtn');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const libraryGrid = document.getElementById('libraryGrid');
  const librarySection = document.getElementById('librarySection');
  const studioSection = document.getElementById('studioSection');
  const workspaceSection = document.getElementById('workspaceSection');

  // APP STATE
  let videoData = null;
  let activeSceneIndex = 0;
  let isPlaying = false;
  let sceneProgress = 0; // 0 to 1 inside active scene
  let sceneStartTime = 0;
  let animationFrameId = null;
  let playbackSpeed = 1.0;
  let volume = 1.0;
  let isMuted = false;
  let currentUtterance = null;
  let availableVoices = [];
  let userQuizScore = 0;
  let particlePool = [];

  // MediaRecorder for Video Export
  let mediaRecorder = null;
  let recordedChunks = [];

  // INITIALIZE SYNTHESIS VOICES
  function initVoices() {
    if ('speechSynthesis' in window) {
      availableVoices = window.speechSynthesis.getVoices();
      voiceSelect.innerHTML = '<option value="default">Default Neural Voice</option>';
      availableVoices.forEach((voice, index) => {
        if (voice.lang.startsWith('en')) {
          const option = document.createElement('option');
          option.value = index;
          option.textContent = `${voice.name} (${voice.lang})`;
          voiceSelect.appendChild(option);
        }
      });
    }
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = initVoices;
    initVoices();
  }

  // Load API Key from local storage
  const savedApiKey = localStorage.getItem('heybuddy_gemini_key') || '';
  if (apiKeyInput) apiKeyInput.value = savedApiKey;

  // INITIAL PARTICLE ENGINE FOR CANVAS
  function initParticlePool() {
    particlePool = [];
    for (let i = 0; i < 40; i++) {
      particlePool.push({
        x: Math.random() * 960,
        y: Math.random() * 540,
        radius: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  }
  initParticlePool();

  // -------------------------------------------------------------
  // API FETCH & VIDEO GENERATION
  // -------------------------------------------------------------
  async function loadVideo(topic, gradeLevel, style) {
    showVideoLoader(true, `Generating AI script & dynamic visual scenes for "${topic}"...`);
    
    try {
      const apiKey = localStorage.getItem('heybuddy_gemini_key') || '';
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, gradeLevel, style, apiKey })
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        videoData = resData.data;
        renderVideoData(videoData);
      } else {
        alert(resData.error || 'Failed to generate AI video.');
      }
    } catch (err) {
      console.error('Error fetching AI video:', err);
      alert('Network error connecting to heyBuddy server.');
    } finally {
      showVideoLoader(false);
    }
  }

  function renderVideoData(data) {
    activeSceneIndex = 0;
    sceneProgress = 0;
    isPlaying = false;
    stopSpeech();

    // Set Meta Info
    videoTitleDisplay.textContent = data.topic;
    let totalSecs = data.scenes.reduce((acc, s) => acc + (s.duration || 10), 0);
    totalTimeText.textContent = formatTime(totalSecs);
    currentTimeText.textContent = '0:00';
    timelineSlider.value = 0;

    // Render Scenes List
    renderSceneCards(data.scenes);
    
    // Render Quiz & Notes
    renderQuiz(data.quiz || []);
    renderNotes(data.notes || []);

    // Set Scene count
    if (sceneCountBadge) sceneCountBadge.textContent = `${data.scenes.length} Scenes`;

    // Reset Chat message
    chatMessages.innerHTML = `
      <div class="chat-bubble ai">
        Hello! 👋 I'm ready to answer any questions about <strong>${escapeHtml(data.topic)}</strong> or explain specific formulas!
      </div>
    `;

    // Start Rendering First Scene on Canvas
    drawSceneFrame();
    updatePlayPauseUI();
  }

  function showVideoLoader(show, text = '') {
    if (videoLoader) {
      if (show) {
        videoLoader.classList.remove('hidden');
        document.getElementById('loaderStep').textContent = text;
      } else {
        videoLoader.classList.add('hidden');
      }
    }
  }

  // -------------------------------------------------------------
  // CANVAS VIDEO RENDERER ENGINE
  // -------------------------------------------------------------
  function drawSceneFrame() {
    if (!ctx || !videoData || !videoData.scenes[activeSceneIndex]) return;

    const scene = videoData.scenes[activeSceneIndex];
    const canvasData = scene.canvasData || {};
    const bgGradient = canvasData.bgGradient || ["#0F172A", "#1E1B4B"];

    // 1. Clear & Draw Dynamic Ambient Background
    const grad = ctx.createLinearGradient(0, 0, 960, 540);
    grad.addColorStop(0, bgGradient[0]);
    grad.addColorStop(1, bgGradient[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 960, 540);

    // 2. Draw Animated Dust Particles
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    particlePool.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = 960;
      if (p.x > 960) p.x = 0;
      if (p.y < 0) p.y = 540;
      if (p.y > 540) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Draw Header Title Bar on Canvas
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.fillRect(40, 30, 880, 50);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 30, 880, 50);

    ctx.font = "bold 20px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = "#F8FAFC";
    ctx.textAlign = "left";
    ctx.fillText(`SCENE ${activeSceneIndex + 1}: ${scene.title}`, 60, 62);

    ctx.font = "bold 13px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#818CF8";
    ctx.textAlign = "right";
    ctx.fillText(`${videoData.subject || 'heyBuddy AI'} • ${videoData.gradeLevel || 'Standard'}`, 900, 62);

    // 4. Render Visual Elements per scene visualType
    const elements = canvasData.elements || [];
    renderSceneElements(scene.visualType, elements);

    // 5. Draw Dynamic Bullets / Key Callouts on Bottom-Left
    if (scene.bullets && scene.bullets.length) {
      ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
      ctx.fillRect(40, 430, 880, 85);
      ctx.strokeStyle = "rgba(99, 102, 241, 0.4)";
      ctx.strokeRect(40, 430, 880, 85);

      ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#06B6D4";
      ctx.textAlign = "left";
      ctx.fillText("KEY TAKEAWAYS & FORMULAS:", 55, 452);

      ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#E2E8F0";
      scene.bullets.forEach((bullet, idx) => {
        if (idx < 2) {
          ctx.fillText(`• ${bullet}`, 55 + (idx * 430), 485);
        }
      });
    }

    // Update Subtitle text
    subtitleText.textContent = scene.narration || '';
    avatarStatus.textContent = `Scene ${activeSceneIndex + 1} of ${videoData.scenes.length}`;
  }

  function renderSceneElements(visualType, elements) {
    const time = Date.now() * 0.003;

    elements.forEach(el => {
      ctx.save();

      if (el.type === 'sun') {
        // Glowing Sun with Ray Pulses
        const rayGlow = Math.sin(time * 3) * 6;
        ctx.shadowColor = el.color || "#FBBF24";
        ctx.shadowBlur = 25 + rayGlow;
        ctx.fillStyle = el.color || "#FBBF24";
        ctx.beginPath();
        ctx.arc(el.x, el.y, el.radius || 40, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText(el.label || "Sunlight", el.x, el.y + el.radius + 20);
      }
      else if (el.type === 'leaf') {
        // Chloroplast / Leaf outline
        ctx.fillStyle = el.color || "#10B981";
        ctx.beginPath();
        ctx.ellipse(el.x, el.y, el.width / 2, el.height / 2, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#059669";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.font = "bold 16px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText("PLANT CELL / LEAF", el.x, el.y + 5);
      }
      else if (el.type === 'molecule' || el.type === 'output') {
        ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
        ctx.strokeStyle = el.color || "#3B82F6";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(el.x - 70, el.y - 20, 140, 40, 8);
        ctx.fill();
        ctx.stroke();

        ctx.font = "bold 14px 'JetBrains Mono', monospace";
        ctx.fillStyle = el.color || "#3B82F6";
        ctx.textAlign = "center";
        ctx.fillText(el.name, el.x, el.y + 5);
      }
      else if (el.type === 'arrow') {
        const fromX = el.from[0], fromY = el.from[1];
        const toX = el.to[0], toY = el.to[1];

        ctx.strokeStyle = el.color || "#FBBF24";
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 6]);
        ctx.lineDashOffset = -time * 20;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        ctx.setLineDash([]);

        if (el.label) {
          ctx.font = "bold 12px 'Plus Jakarta Sans', sans-serif";
          ctx.fillStyle = el.color || "#FBBF24";
          ctx.textAlign = "center";
          ctx.fillText(el.label, (fromX + toX) / 2, (fromY + toY) / 2 - 10);
        }
      }
      else if (el.type === 'complex') {
        ctx.fillStyle = el.color || "#10B981";
        ctx.shadowColor = el.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.roundRect(el.x, el.y, el.width, el.height, 12);
        ctx.fill();

        ctx.font = "bold 11px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText(el.name, el.x + el.width / 2, el.y + el.height / 2 + 4);
      }
      else if (el.type === 'electron_pulse') {
        const path = el.path || [];
        if (path.length >= 2) {
          ctx.strokeStyle = el.color || "#FDE047";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(path[0][0], path[0][1]);
          for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i][0], path[i][1]);
          }
          ctx.stroke();

          // Animated Electron particle
          const pulseOffset = (time * 150) % 440;
          const currX = path[0][0] + (pulseOffset > 220 ? pulseOffset - 220 : pulseOffset);
          ctx.fillStyle = "#FFFFFF";
          ctx.shadowColor = "#FDE047";
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(currX, path[0][1], 8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      else if (el.type === 'math_formula' || el.type === 'equation') {
        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.strokeStyle = el.color || "#6366F1";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(el.x, el.y, 440, 50, 10);
        ctx.fill();
        ctx.stroke();

        ctx.font = "bold 18px 'JetBrains Mono', monospace";
        ctx.fillStyle = el.color || "#F59E0B";
        ctx.textAlign = "center";
        ctx.fillText(el.text, el.x + 220, el.y + 32);
      }
      else if (el.type === 'box' || el.type === 'box_animated') {
        const animX = el.type === 'box_animated' ? el.x + Math.sin(time * 2) * 20 : el.x;
        ctx.fillStyle = el.color || "#6366F1";
        ctx.shadowColor = el.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.roundRect(animX, el.y, el.w, el.h, 8);
        ctx.fill();

        ctx.font = "bold 14px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText(el.label || "Mass (m)", animX + el.w / 2, el.y + el.h / 2 + 5);
      }
      else if (el.type === 'vector_arrow') {
        const fromX = el.from[0], fromY = el.from[1];
        const toX = el.to[0], toY = el.to[1];

        ctx.strokeStyle = el.color || "#EF4444";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        // Draw Arrowhead
        const angle = Math.atan2(toY - fromY, toX - fromX);
        ctx.fillStyle = el.color || "#EF4444";
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - 12 * Math.cos(angle - Math.PI / 6), toY - 12 * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - 12 * Math.cos(angle + Math.PI / 6), toY - 12 * Math.sin(angle + Math.PI / 6));
        ctx.fill();

        if (el.label) {
          ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
          ctx.fillStyle = el.color || "#EF4444";
          ctx.textAlign = "left";
          ctx.fillText(el.label, toX + 10, toY + 5);
        }
      }
      else if (el.type === 'quantum_particle') {
        const spinAngle = time * 4;
        ctx.fillStyle = el.color || "#8B5CF6";
        ctx.shadowColor = el.color;
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(el.x, el.y, el.r || 40, 0, Math.PI * 2);
        ctx.fill();

        // Quantum Orbit Ring
        ctx.strokeStyle = "#EC4899";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(el.x, el.y, 70, 25, spinAngle, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = "bold 14px 'JetBrains Mono', monospace";
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText("|Ψ⟩ Superposition", el.x, el.y + 5);
      }
      else if (el.type === 'wave_sine') {
        ctx.strokeStyle = el.color || "#06B6D4";
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x < el.width; x += 5) {
          const y = Math.sin((x * 0.03) + time * 3) * 30;
          if (x === 0) ctx.moveTo(el.x + x, el.y + y);
          else ctx.lineTo(el.x + x, el.y + y);
        }
        ctx.stroke();
      }
      else if (el.type === 'concept_node' || el.type === 'branch_node') {
        const pulse = Math.sin(time * 3) * 4;
        ctx.fillStyle = el.color || "#6366F1";
        ctx.shadowColor = el.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(el.x, el.y, (el.r || 45) + pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText(el.label, el.x, el.y + 4);
      }
      else if (el.type === 'flow_step') {
        ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
        ctx.strokeStyle = el.color || "#F59E0B";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(el.x - 80, el.y - 30, 160, 60, 10);
        ctx.fill();
        ctx.stroke();

        ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = el.color || "#F59E0B";
        ctx.textAlign = "center";
        ctx.fillText(el.title, el.x, el.y + 5);
      }
      else if (el.type === 'formula_banner') {
        ctx.fillStyle = "rgba(99, 102, 241, 0.15)";
        ctx.strokeStyle = el.color || "#6366F1";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(el.x, el.y, 520, 60, 12);
        ctx.fill();
        ctx.stroke();

        ctx.font = "bold 20px 'JetBrains Mono', monospace";
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.fillText(el.text, el.x + 260, el.y + 37);
      }
      else if (el.type === 'summary_grid') {
        const items = el.items || [];
        items.forEach((item, idx) => {
          ctx.fillStyle = "rgba(30, 41, 59, 0.8)";
          ctx.strokeStyle = "#10B981";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(140, 150 + (idx * 80), 680, 60, 10);
          ctx.fill();
          ctx.stroke();

          ctx.font = "bold 16px 'Plus Jakarta Sans', sans-serif";
          ctx.fillStyle = "#34D399";
          ctx.textAlign = "left";
          ctx.fillText(`✔  ${item}`, 170, 187 + (idx * 80));
        });
      }

      ctx.restore();
    });
  }

  // -------------------------------------------------------------
  // ANIMATION & TIMELINE CONTROL LOOP
  // -------------------------------------------------------------
  function startPlayback() {
    if (!videoData) return;
    isPlaying = true;
    updatePlayPauseUI();
    sceneStartTime = Date.now() - (sceneProgress * getSceneDurationSecs() * 1000);
    speakSceneNarration();
    loopAnimation();
  }

  function pausePlayback() {
    isPlaying = false;
    updatePlayPauseUI();
    stopSpeech();
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  }

  function togglePlayPause() {
    if (isPlaying) pausePlayback();
    else startPlayback();
  }

  function getSceneDurationSecs() {
    if (!videoData || !videoData.scenes[activeSceneIndex]) return 10;
    return (videoData.scenes[activeSceneIndex].duration || 10) / playbackSpeed;
  }

  function loopAnimation() {
    if (!isPlaying || !videoData) return;

    const sceneDurationMs = getSceneDurationSecs() * 1000;
    const elapsed = Date.now() - sceneStartTime;
    sceneProgress = Math.min(1, elapsed / sceneDurationMs);

    drawSceneFrame();
    updateTimelineProgress();

    if (sceneProgress >= 1) {
      // Advance to next scene
      if (activeSceneIndex < videoData.scenes.length - 1) {
        activeSceneIndex++;
        sceneProgress = 0;
        sceneStartTime = Date.now();
        highlightActiveSceneCard();
        speakSceneNarration();
      } else {
        // Video finished
        pausePlayback();
        sceneProgress = 1;
        return;
      }
    }

    animationFrameId = requestAnimationFrame(loopAnimation);
  }

  function updateTimelineProgress() {
    if (!videoData) return;

    let totalDurationSecs = videoData.scenes.reduce((a, s) => a + (s.duration || 10), 0);
    let currentTotalSecs = 0;

    for (let i = 0; i < activeSceneIndex; i++) {
      currentTotalSecs += videoData.scenes[i].duration || 10;
    }
    currentTotalSecs += sceneProgress * (videoData.scenes[activeSceneIndex].duration || 10);

    const percent = (currentTotalSecs / totalDurationSecs) * 100;
    timelineSlider.value = percent;
    currentTimeText.textContent = formatTime(currentTotalSecs);
  }

  function seekToPercent(percent) {
    if (!videoData) return;

    let totalDurationSecs = videoData.scenes.reduce((a, s) => a + (s.duration || 10), 0);
    let targetSecs = (percent / 100) * totalDurationSecs;

    let accumulatedSecs = 0;
    for (let i = 0; i < videoData.scenes.length; i++) {
      let dur = videoData.scenes[i].duration || 10;
      if (targetSecs <= accumulatedSecs + dur || i === videoData.scenes.length - 1) {
        activeSceneIndex = i;
        sceneProgress = (targetSecs - accumulatedSecs) / dur;
        sceneProgress = Math.max(0, Math.min(1, sceneProgress));
        break;
      }
      accumulatedSecs += dur;
    }

    sceneStartTime = Date.now() - (sceneProgress * getSceneDurationSecs() * 1000);
    highlightActiveSceneCard();
    drawSceneFrame();

    if (isPlaying) {
      speakSceneNarration();
    }
  }

  function updatePlayPauseUI() {
    if (isPlaying) {
      playIcon.className = 'fa-solid fa-pause';
      speechWaves.style.display = 'block';
    } else {
      playIcon.className = 'fa-solid fa-play';
      speechWaves.style.display = 'none';
    }
  }

  // -------------------------------------------------------------
  // SPEECH NARRATION ENGINE (TTS)
  // -------------------------------------------------------------
  function speakSceneNarration() {
    if (!('speechSynthesis' in window) || isMuted) return;

    stopSpeech();

    const scene = videoData.scenes[activeSceneIndex];
    if (!scene || !scene.narration) return;

    currentUtterance = new SpeechSynthesisUtterance(scene.narration);
    currentUtterance.rate = playbackSpeed;
    currentUtterance.volume = volume;

    const voiceIdx = voiceSelect.value;
    if (voiceIdx !== 'default' && availableVoices[voiceIdx]) {
      currentUtterance.voice = availableVoices[voiceIdx];
    }

    currentUtterance.onstart = () => {
      speechWaves.style.display = 'block';
    };

    currentUtterance.onend = () => {
      speechWaves.style.display = 'none';
    };

    window.speechSynthesis.speak(currentUtterance);
  }

  function stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // -------------------------------------------------------------
  // SIDE PANEL RENDERERS (SCENES, QUIZ, NOTES)
  // -------------------------------------------------------------
  function renderSceneCards(scenes) {
    sceneCardsList.innerHTML = '';
    scenes.forEach((s, idx) => {
      const card = document.createElement('div');
      card.className = `scene-card ${idx === activeSceneIndex ? 'active' : ''}`;
      card.dataset.index = idx;
      card.innerHTML = `
        <div class="scene-card-top">
          <span class="scene-num">Scene ${idx + 1}</span>
          <span class="scene-duration"><i class="fa-regular fa-clock"></i> ${s.duration || 10}s</span>
        </div>
        <div class="scene-card-title">${escapeHtml(s.title)}</div>
        <ul class="scene-bullet-list">
          ${(s.bullets || []).slice(0, 2).map(b => `<li>${escapeHtml(b)}</li>`).join('')}
        </ul>
      `;

      card.addEventListener('click', () => {
        activeSceneIndex = idx;
        sceneProgress = 0;
        sceneStartTime = Date.now();
        highlightActiveSceneCard();
        drawSceneFrame();
        if (isPlaying) speakSceneNarration();
      });

      sceneCardsList.appendChild(card);
    });
  }

  function highlightActiveSceneCard() {
    const cards = sceneCardsList.querySelectorAll('.scene-card');
    cards.forEach((c, idx) => {
      if (idx === activeSceneIndex) c.classList.add('active');
      else c.classList.remove('active');
    });
  }

  function renderQuiz(quizItems) {
    userQuizScore = 0;
    scoreBadge.textContent = `Score: 0 / ${quizItems.length}`;
    quizContainer.innerHTML = '';

    if (!quizItems.length) {
      quizContainer.innerHTML = '<p style="color:var(--text-dim);">No quiz available for this topic.</p>';
      return;
    }

    quizItems.forEach((q, qIdx) => {
      const item = document.createElement('div');
      item.className = 'quiz-item';
      item.innerHTML = `
        <div class="quiz-question">${qIdx + 1}. ${escapeHtml(q.question)}</div>
        <div class="quiz-options">
          ${q.options.map((opt, oIdx) => `
            <button type="button" class="quiz-opt-btn" data-q="${qIdx}" data-o="${oIdx}">
              ${escapeHtml(opt)}
            </button>
          `).join('')}
        </div>
        <div class="quiz-explanation hidden" id="explain_${qIdx}">
          <strong>Explanation:</strong> ${escapeHtml(q.explanation || '')}
        </div>
      `;
      quizContainer.appendChild(item);
    });

    // Attach Quiz Click Handlers
    quizContainer.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const qIdx = parseInt(btn.dataset.q);
        const oIdx = parseInt(btn.dataset.o);
        const qData = quizItems[qIdx];
        const parentOptDiv = btn.closest('.quiz-options');

        if (parentOptDiv.dataset.answered) return; // prevent re-answering
        parentOptDiv.dataset.answered = 'true';

        const optBtns = parentOptDiv.querySelectorAll('.quiz-opt-btn');
        optBtns.forEach((b, i) => {
          if (i === qData.correctIndex) b.classList.add('correct');
          else if (i === oIdx && oIdx !== qData.correctIndex) b.classList.add('wrong');
        });

        if (oIdx === qData.correctIndex) {
          userQuizScore++;
          scoreBadge.textContent = `Score: ${userQuizScore} / ${quizItems.length}`;
        }

        const exp = document.getElementById(`explain_${qIdx}`);
        if (exp) exp.classList.remove('hidden');
      });
    });
  }

  function renderNotes(notesItems) {
    notesContainer.innerHTML = '';
    if (!notesItems.length) {
      notesContainer.innerHTML = '<p style="color:var(--text-dim);">No study notes for this topic.</p>';
      return;
    }

    notesItems.forEach(n => {
      const card = document.createElement('div');
      card.className = 'note-card';
      card.innerHTML = `
        <div class="note-title"><i class="fa-solid fa-feather-pointed"></i> ${escapeHtml(n.title)}</div>
        <div class="note-content">${escapeHtml(n.content)}</div>
      `;
      notesContainer.appendChild(card);
    });
  }

  // Export Notes Download Handler
  if (downloadNotesBtn) {
    downloadNotesBtn.addEventListener('click', () => {
      if (!videoData) return;
      let textContent = `# heyBuddy AI Study Notes\nTopic: ${videoData.topic}\n\n`;

      (videoData.notes || []).forEach(n => {
        textContent += `## ${n.title}\n${n.content}\n\n`;
      });

      textContent += `\n--- Key Video Takeaways ---\n`;
      (videoData.scenes || []).forEach((s, i) => {
        textContent += `Scene ${i+1}: ${s.title}\n`;
        (s.bullets || []).forEach(b => textContent += `- ${b}\n`);
        textContent += `\n`;
      });

      const blob = new Blob([textContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${videoData.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.md`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // -------------------------------------------------------------
  // CANVAS VIDEO RECORDING EXPORT ENGINE
  // -------------------------------------------------------------
  if (exportVideoBtn) {
    exportVideoBtn.addEventListener('click', () => {
      if (!canvas) return;

      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        exportVideoBtn.innerHTML = '<i class="fa-solid fa-download"></i> Download Video';
        return;
      }

      recordedChunks = [];
      const stream = canvas.captureStream(30);

      try {
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
      } catch (e) {
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      }

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(videoData?.topic || 'heyBuddy_lesson').replace(/[^a-z0-9]/gi, '_')}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      };

      mediaRecorder.start();
      exportVideoBtn.innerHTML = '<i class="fa-solid fa-square fa-beat" style="color:#ef4444;"></i> Stop & Export';

      // Auto play video from start for recording
      activeSceneIndex = 0;
      sceneProgress = 0;
      startPlayback();

      alert("Video recording started! Wait until the lesson plays through, or click 'Stop & Export' when finished.");
    });
  }

  // -------------------------------------------------------------
  // DOUBT SOLVER AI CHAT HANDLER
  // -------------------------------------------------------------
  if (chatForm) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const query = chatInput.value.trim();
      if (!query) return;

      // Add user message bubble
      const userBubble = document.createElement('div');
      userBubble.className = 'chat-bubble user';
      userBubble.textContent = query;
      chatMessages.appendChild(userBubble);
      chatInput.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Add loading bubble
      const aiBubble = document.createElement('div');
      aiBubble.className = 'chat-bubble ai';
      aiBubble.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> heyBuddy AI is analyzing your doubt...';
      chatMessages.appendChild(aiBubble);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      try {
        const apiKey = localStorage.getItem('heybuddy_gemini_key') || '';
        const response = await fetch('/api/chat-doubt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: query,
            topic: videoData?.topic || 'Lesson',
            timestamp: currentTimeText.textContent,
            apiKey
          })
        });

        const resData = await response.json();
        aiBubble.innerHTML = formatMarkdownText(resData.answer || 'Thank you for your question!');
      } catch (err) {
        aiBubble.textContent = 'Sorry, failed to process question. Please try again.';
      } finally {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    });
  }

  // -------------------------------------------------------------
  // EVENT LISTENERS & UI HANDLERS
  // -------------------------------------------------------------
  generateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const topic = topicInput.value.trim();
    if (topic) {
      loadVideo(topic, gradeSelect.value, styleSelect.value);
    }
  });

  // Preset chip clicks
  document.querySelectorAll('.topic-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const topic = chip.dataset.topic;
      topicInput.value = topic;
      loadVideo(topic, gradeSelect.value, styleSelect.value);
    });
  });

  // Controls Handlers
  playPauseBtn.addEventListener('click', togglePlayPause);

  prevSceneBtn.addEventListener('click', () => {
    if (activeSceneIndex > 0) {
      activeSceneIndex--;
      sceneProgress = 0;
      sceneStartTime = Date.now();
      highlightActiveSceneCard();
      drawSceneFrame();
      if (isPlaying) speakSceneNarration();
    }
  });

  nextSceneBtn.addEventListener('click', () => {
    if (videoData && activeSceneIndex < videoData.scenes.length - 1) {
      activeSceneIndex++;
      sceneProgress = 0;
      sceneStartTime = Date.now();
      highlightActiveSceneCard();
      drawSceneFrame();
      if (isPlaying) speakSceneNarration();
    }
  });

  timelineSlider.addEventListener('input', (e) => {
    seekToPercent(parseFloat(e.target.value));
  });

  volumeSlider.addEventListener('input', (e) => {
    volume = parseFloat(e.target.value);
    isMuted = volume === 0;
    updateVolumeIcon();
    if (currentUtterance) currentUtterance.volume = volume;
  });

  muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    if (isMuted) {
      stopSpeech();
      volumeIcon.className = 'fa-solid fa-volume-xmark';
    } else {
      updateVolumeIcon();
      if (isPlaying) speakSceneNarration();
    }
  });

  function updateVolumeIcon() {
    if (isMuted || volume === 0) volumeIcon.className = 'fa-solid fa-volume-xmark';
    else if (volume < 0.5) volumeIcon.className = 'fa-solid fa-volume-low';
    else volumeIcon.className = 'fa-solid fa-volume-high';
  }

  // Speed Handlers
  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      playbackSpeed = parseFloat(btn.dataset.speed);
      if (isPlaying) {
        speakSceneNarration();
      }
    });
  });

  // Tabs Switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const targetTab = document.getElementById(btn.dataset.tab);
      if (targetTab) targetTab.classList.add('active');
    });
  });

  // Fullscreen Handler
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      canvasWrapper.requestFullscreen().catch(err => alert(err.message));
    } else {
      document.exitFullscreen();
    }
  });

  // Navigation Links
  document.getElementById('navStudioBtn')?.addEventListener('click', () => {
    studioSection.classList.remove('hidden');
    workspaceSection.classList.remove('hidden');
    librarySection.classList.add('hidden');
    setActiveNav('navStudioBtn');
  });

  document.getElementById('navLibraryBtn')?.addEventListener('click', () => {
    studioSection.classList.add('hidden');
    workspaceSection.classList.add('hidden');
    librarySection.classList.remove('hidden');
    setActiveNav('navLibraryBtn');
    loadLibraryGrid();
  });

  document.getElementById('navSettingsBtn')?.addEventListener('click', () => {
    apiModal.classList.remove('hidden');
  });

  apiKeyModalBtn?.addEventListener('click', () => {
    apiModal.classList.remove('hidden');
  });

  closeModalBtn?.addEventListener('click', () => {
    apiModal.classList.add('hidden');
  });

  saveKeyBtn?.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    localStorage.setItem('heybuddy_gemini_key', key);
    alert('Gemini API Key saved successfully!');
    apiModal.classList.add('hidden');
  });

  clearKeyBtn?.addEventListener('click', () => {
    localStorage.removeItem('heybuddy_gemini_key');
    apiKeyInput.value = '';
    alert('Gemini API Key cleared. System will use built-in procedural AI engine.');
    apiModal.classList.add('hidden');
  });

  function setActiveNav(btnId) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(btnId)?.classList.add('active');
  }

  // Load Library Grid
  async function loadLibraryGrid() {
    try {
      const res = await fetch('/api/sample-topics');
      const sampleTopics = await res.json();
      libraryGrid.innerHTML = '';

      sampleTopics.forEach(t => {
        const card = document.createElement('div');
        card.className = 'library-card';
        card.innerHTML = `
          <div class="card-icon">${t.icon || '📚'}</div>
          <div class="card-title">${escapeHtml(t.title)}</div>
          <div class="card-category">${escapeHtml(t.category)}</div>
        `;
        card.addEventListener('click', () => {
          document.getElementById('navStudioBtn')?.click();
          topicInput.value = t.title;
          loadVideo(t.title, gradeSelect.value, styleSelect.value);
        });
        libraryGrid.appendChild(card);
      });
    } catch (err) {
      console.error('Failed to load library topics', err);
    }
  }

  // Helper Utility Functions
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function formatMarkdownText(text) {
    if (!text) return '';
    let formatted = escapeHtml(text);
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/•\s?(.*?)\n/g, '• $1<br/>');
    formatted = formatted.replace(/\n/g, '<br/>');
    return formatted;
  }

  // LOAD INITIAL DEFAULT TOPIC (Photosynthesis)
  loadVideo("Photosynthesis & Light Reactions", "High School", "Visual");
});
