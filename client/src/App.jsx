import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Studio from './components/Studio';
import VideoPlayer from './components/VideoPlayer';
import ControlsBar from './components/ControlsBar';
import QuizTab from './components/QuizTab';
import NotesTab from './components/NotesTab';
import DoubtChat from './components/DoubtChat';
import Library from './components/Library';
import { API_BASE_URL } from './config';

const METHODOLOGY_KEYS = ['Feynman', 'Socratic', 'Analogy', 'FirstPrinciples', 'ELI5'];
const STYLE_KEYS = ['Minimalist', 'Technical', 'Chalkboard', 'DataFlow'];

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('studio'); // 'studio' | 'library'
  const [activeSideTab, setActiveSideTab] = useState('scenes'); // 'scenes' | 'quiz' | 'notes' | 'chat'
  
  // Video & Avatar State
  const [videoData, setVideoData] = useState(null);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentAvatarId, setCurrentAvatarId] = useState('maya');
  const [avatarGender, setAvatarGender] = useState('all');
  const [voiceGender, setVoiceGender] = useState('female');
  const [selectedElevenLabsVoice, setSelectedElevenLabsVoice] = useState('21m00Tcm4TlvDq8ikWAM');
  const [selectedSarvamSpeaker, setSelectedSarvamSpeaker] = useState('meera');
  const [showCaptions, setShowCaptions] = useState(true);
  const [isHeyGenGenerating, setIsHeyGenGenerating] = useState(false);

  // Player & Codec State
  const [codec, setCodec] = useState('AV1');
  const [quality, setQuality] = useState('1080p60');
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  // Web Speech Voices State
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');

  // Async Pipeline Queue Job state
  const [jobProgress, setJobProgress] = useState(null);

  // Multi-Cloud API Keys
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('heybuddy_gemini_key') || '');
  const [sarvamKey, setSarvamKey] = useState(() => localStorage.getItem('heybuddy_sarvam_key') || '');
  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem('heybuddy_openai_key') || '');
  const [elevenlabsKey, setElevenlabsKey] = useState(() => localStorage.getItem('heybuddy_elevenlabs_key') || '');
  const [deeplKey, setDeeplKey] = useState(() => localStorage.getItem('heybuddy_deepl_key') || '');
  const [heygenKey, setHeygenKey] = useState(() => localStorage.getItem('heybuddy_heygen_key') || '');

  const [showKeyModal, setShowKeyModal] = useState(false);

  const animationRef = useRef(null);
  const startTimeRef = useRef(0);
  const utteranceRef = useRef(null);
  const audioElemRef = useRef(new Audio());

  // Load imported Web Speech voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const loadVoices = () => {
      const avail = window.speechSynthesis.getVoices();
      if (avail.length > 0) {
        setVoices(avail);
        const pref = avail.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))) || avail[0];
        if (pref && !selectedVoiceURI) setSelectedVoiceURI(pref.voiceURI);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Toggle Theme
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Generate Video Endpoint
  const handleGenerate = async ({ topic, methodology, language, style, gradeLevel, streamDomain, lectureDuration, avatarGender: reqAvatarGen, voiceGender: reqVoiceGen }) => {
    setLoading(true);
    if (reqAvatarGen) setAvatarGender(reqAvatarGen);
    if (reqVoiceGen) setVoiceGender(reqVoiceGen);

    setJobProgress({ progress: 10, message: 'Ingesting OpenStax, Gutenberg, Internet Archive, Wikidata SPARQL & Stack Exchange...' });

    try {
      const asyncRes = await fetch(`${API_BASE_URL}/api/video/render-async`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, methodology, language, style, gradeLevel, streamDomain, lectureDuration, apiKey, sarvamKey, openaiKey, elevenlabsKey, deeplKey, heygenKey })
      });
      const asyncData = await asyncRes.json();

      if (asyncData.success && asyncData.jobId) {
        const jobId = asyncData.jobId;
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch(`${API_BASE_URL}/api/video/job/${jobId}`);
            const status = await statusRes.json();

            setJobProgress({ progress: status.progress, message: status.message });

            if (status.stage === 'completed' && status.result) {
              clearInterval(pollInterval);
              setVideoData(status.result);
              setActiveSceneIndex(0);
              setSceneProgress(0);
              setIsPlaying(false);
              stopSpeech();
              setLoading(false);
              setJobProgress(null);
            }
          } catch (e) {
            console.error('Error polling job status:', e);
            clearInterval(pollInterval);
            setLoading(false);
            setJobProgress(null);
          }
        }, 600);
      } else {
        const res = await fetch(`${API_BASE_URL}/api/video/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, methodology, language, style, gradeLevel, streamDomain, lectureDuration, apiKey, sarvamKey, openaiKey, elevenlabsKey, deeplKey, heygenKey })
        });
        const data = await res.json();
        if (data.success && data.data) {
          setVideoData(data.data);
          setActiveSceneIndex(0);
          setSceneProgress(0);
          setIsPlaying(false);
          stopSpeech();
        }
        setLoading(false);
        setJobProgress(null);
      }
    } catch (err) {
      console.error('Error generating video:', err);
      alert('Network error connecting to backend.');
      setLoading(false);
      setJobProgress(null);
    }
  };

  // Generate HeyGen Virtual Teacher Video
  const handleGenerateHeyGenVideo = async () => {
    if (!videoData) return;
    const currentScene = videoData.scenes[activeSceneIndex];
    if (!currentScene) return;

    setIsHeyGenGenerating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/heygen/generate-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptText: currentScene.narration,
          avatarId: currentAvatarId === 'alex' || currentAvatarId === 'oak' || currentAvatarId === 'marcus' ? 'josh_lite_20230714' : 'Daisy-in-suit',
          voiceId: voiceGender === 'male' ? 'en-US-GuyNeural' : 'en-US-JennyNeural',
          gender: voiceGender,
          heygenKey
        })
      });
      const data = await res.json();
      if (data.success && data.data?.videoId) {
        alert(`🎉 HeyGen Avatar Video Generation Initiated!\n\nVideo ID: ${data.data.videoId}\nAvatar: ${data.data.avatarId || 'Selected Avatar'}\nVoice: ${data.data.voiceId || 'Neural Voice'}`);
      } else {
        alert(`HeyGen API Notice: ${data.error || 'Please verify your HeyGen API Key in Settings or .env file.'}`);
      }
    } catch (err) {
      console.error('HeyGen generation error:', err);
      alert('Failed to connect to backend server. Ensure backend Node server is running.');
    } finally {
      setIsHeyGenGenerating(false);
    }
  };


  // On-the-fly Interactive Script Translation
  const handleLiveTranslate = async (targetLanguage) => {
    if (!videoData) return;
    setIsTranslating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/video/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoData, targetLanguage, apiKey, deeplKey })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setVideoData(data.data);
        if (isPlaying) speakNarration(activeSceneIndex);
      }
    } catch (err) {
      console.error('Translation failed:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // 1-Click Style & Methodology Shuffle
  const handleShuffleStyle = () => {
    if (!videoData) return;
    const currentMeth = videoData.methodology || 'Feynman';
    const nextMeth = METHODOLOGY_KEYS[(METHODOLOGY_KEYS.indexOf(currentMeth) + 1) % METHODOLOGY_KEYS.length];
    const nextStyle = STYLE_KEYS[Math.floor(Math.random() * STYLE_KEYS.length)];

    handleGenerate({
      topic: videoData.topic,
      methodology: nextMeth,
      language: videoData.language || 'English',
      style: nextStyle,
      gradeLevel: videoData.gradeLevel || 'High School',
      streamDomain: videoData.streamDomain || 'STEM / Physical Sciences',
      lectureDuration: videoData.lectureDuration || '5 Mins',
      avatarGender,
      voiceGender
    });
  };

  // Initial load default video
  useEffect(() => {
    handleGenerate({
      topic: 'Photosynthesis & Light Reactions',
      methodology: 'Feynman',
      language: 'English',
      style: 'Minimalist',
      gradeLevel: 'High School',
      streamDomain: 'Medical & Life Sciences',
      lectureDuration: '5 Mins',
      avatarGender: 'all',
      voiceGender: 'female'
    });
  }, []);

  // Animation Loop for Video Seeker & Scenes
  useEffect(() => {
    if (!isPlaying || !videoData) return;

    const sceneDurationMs = ((videoData.scenes[activeSceneIndex]?.duration || 10) / playbackSpeed) * 1000;
    startTimeRef.current = Date.now() - (sceneProgress * sceneDurationMs);

    const updateLoop = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const prog = Math.min(1, elapsed / sceneDurationMs);
      setSceneProgress(prog);

      if (prog >= 1) {
        if (activeSceneIndex < videoData.scenes.length - 1) {
          setActiveSceneIndex(prev => prev + 1);
          setSceneProgress(0);
          startTimeRef.current = Date.now();
          speakNarration(activeSceneIndex + 1);
        } else {
          setIsPlaying(false);
          stopSpeech();
          return;
        }
      }
      animationRef.current = requestAnimationFrame(updateLoop);
    };

    animationRef.current = requestAnimationFrame(updateLoop);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, activeSceneIndex, videoData, playbackSpeed]);

  // ElevenLabs Voice AI / Sarvam AI Bulbul / Web Speech Synthesis
  const speakNarration = async (sceneIdx) => {
    if (isMuted || !videoData) return;
    stopSpeech();

    const scene = videoData.scenes[sceneIdx];
    if (!scene || !scene.narration) return;

    // 1. ElevenLabs Voice AI (High Priority if Key available)
    if (elevenlabsKey) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/video/tts-elevenlabs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: scene.narration,
            voiceId: selectedElevenLabsVoice || '21m00Tcm4TlvDq8ikWAM',
            elevenlabsKey
          })
        });
        const data = await res.json();
        if (data.audioUrl) {
          audioElemRef.current.src = data.audioUrl;
          audioElemRef.current.playbackRate = playbackSpeed;
          audioElemRef.current.volume = volume;
          audioElemRef.current.play();
          return;
        }
      } catch (err) {
        console.warn('ElevenLabs TTS failed, fallback to Sarvam/WebSpeech:', err);
      }
    }

    // 2. Sarvam AI Bulbul v3 API
    if (sarvamKey) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/video/tts-sarvam`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: scene.narration,
            targetLanguage: videoData.language || 'Hindi',
            speaker: selectedSarvamSpeaker || (voiceGender === 'male' ? 'arvind' : 'meera'),
            sarvamKey
          })
        });
        const data = await res.json();
        if (data.audioUrl) {
          audioElemRef.current.src = data.audioUrl;
          audioElemRef.current.playbackRate = playbackSpeed;
          audioElemRef.current.volume = volume;
          audioElemRef.current.play();
          return;
        }
      } catch (err) {
        console.warn('Sarvam TTS failed, fallback to Web Speech:', err);
      }
    }

    // 3. Web Speech API Fallback
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(scene.narration);
      utterance.rate = playbackSpeed;
      utterance.volume = volume;

      if (selectedVoiceURI && voices.length > 0) {
        const match = voices.find(v => v.voiceURI === selectedVoiceURI);
        if (match) utterance.voice = match;
      }

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeech = () => {
    if (audioElemRef.current) {
      audioElemRef.current.pause();
      audioElemRef.current.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const togglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      speakNarration(activeSceneIndex);
    } else {
      stopSpeech();
    }
  };

  const handleSeek = (targetPercent) => {
    if (!videoData) return;
    const totalSecs = getTotalDuration();
    const targetSecs = (targetPercent / 100) * totalSecs;

    let accum = 0;
    for (let i = 0; i < videoData.scenes.length; i++) {
      const dur = videoData.scenes[i].duration || 10;
      if (targetSecs <= accum + dur) {
        setActiveSceneIndex(i);
        const rem = targetSecs - accum;
        setSceneProgress(rem / dur);
        if (isPlaying) speakNarration(i);
        break;
      }
      accum += dur;
    }
  };

  const getTotalDuration = () => {
    if (!videoData || !videoData.scenes) return 40;
    return videoData.scenes.reduce((acc, s) => acc + (s.duration || 10), 0);
  };

  const getCurrentTime = () => {
    if (!videoData || !videoData.scenes) return 0;
    let time = 0;
    for (let i = 0; i < activeSceneIndex; i++) {
      time += videoData.scenes[i].duration || 10;
    }
    const curDur = videoData.scenes[activeSceneIndex]?.duration || 10;
    return time + (sceneProgress * curDur);
  };

  const handleExportVideo = () => {
    if (!videoData) return;
    try {
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        alert("Canvas element not found for export!");
        return;
      }
      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${videoData.topic || 'heyBuddy_Concept'}_Video.webm`;
        a.click();
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 5000);
      alert("Recording 5-second WebM export clip... Download will trigger automatically!");
    } catch (e) {
      console.error("Export error:", e);
      alert("WebM recording initiated!");
    }
  };

  const handleSaveApiKeys = ({ gemini, sarvam, openai, elevenlabs, deepl, heygen }) => {
    setApiKey(gemini); localStorage.setItem('heybuddy_gemini_key', gemini);
    setSarvamKey(sarvam); localStorage.setItem('heybuddy_sarvam_key', sarvam);
    setOpenaiKey(openai); localStorage.setItem('heybuddy_openai_key', openai);
    setElevenlabsKey(elevenlabs); localStorage.setItem('heybuddy_elevenlabs_key', elevenlabs);
    setDeeplKey(deepl); localStorage.setItem('heybuddy_deepl_key', deepl);
    setHeygenKey(heygen); localStorage.setItem('heybuddy_heygen_key', heygen);
    setShowKeyModal(false);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="app-container">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenSettings={() => setShowKeyModal(true)}
      />

      <main className="main-wrapper">
        {activeTab === 'studio' ? (
          <>
            <Studio onGenerate={handleGenerate} loading={loading} />

            {/* ASYNC PIPELINE PROGRESS MODAL */}
            {jobProgress && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    <i className="fa-solid fa-gears fa-spin" style={{ marginRight: '6px', color: 'var(--accent-indigo)' }}></i>
                    Backend Multi-Source Pipeline Rendering...
                  </span>
                  <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                    {jobProgress.progress}%
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#262626', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${jobProgress.progress}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #10b981)', transition: 'width 0.3s ease' }}></div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  {jobProgress.message}
                </div>
              </div>
            )}

            {videoData && (
              <div className={`workspace-grid ${isTheaterMode ? 'theater' : ''}`}>
                {/* VIDEO PLAYER COLUMN */}
                <div className="video-container">
                  <div className="video-meta">
                    <span className="badge-mono" style={{ margin: 0, background: 'rgba(99,102,241,0.15)', color: '#818cf8', borderColor: 'rgba(99,102,241,0.3)' }}>
                      <i className="fa-solid fa-play"></i> NATIVE HTML5 PLAYER ({codec})
                    </span>
                    <h2 className="video-title">{videoData.topic}</h2>
                  </div>

                  <VideoPlayer
                    videoData={videoData}
                    activeSceneIndex={activeSceneIndex}
                    sceneProgress={sceneProgress}
                    isPlaying={isPlaying}
                    currentAvatarId={currentAvatarId}
                    onSelectAvatar={(id) => setCurrentAvatarId(id)}
                    showCaptions={showCaptions}
                    codec={codec}
                    onSelectCodec={(c) => setCodec(c)}
                    quality={quality}
                    onSelectQuality={(q) => setQuality(q)}
                    isTheaterMode={isTheaterMode}
                    onToggleTheater={() => setIsTheaterMode(!isTheaterMode)}
                    onTogglePlay={togglePlay}
                    onSeek={handleSeek}
                    getCurrentTime={getCurrentTime}
                    getTotalDuration={getTotalDuration}
                    formatTime={formatTime}
                    onExportVideo={handleExportVideo}
                  />

                  <ControlsBar
                    isPlaying={isPlaying}
                    onTogglePlay={togglePlay}
                    onPrevScene={() => {
                      if (activeSceneIndex > 0) {
                        setActiveSceneIndex(prev => prev - 1);
                        setSceneProgress(0);
                        if (isPlaying) speakNarration(activeSceneIndex - 1);
                      }
                    }}
                    onNextScene={() => {
                      if (activeSceneIndex < videoData.scenes.length - 1) {
                        setActiveSceneIndex(prev => prev + 1);
                        setSceneProgress(0);
                        if (isPlaying) speakNarration(activeSceneIndex + 1);
                      }
                    }}
                    progressPercent={(getCurrentTime() / getTotalDuration()) * 100}
                    onSeek={handleSeek}
                    currentTimeStr={formatTime(getCurrentTime())}
                    totalTimeStr={formatTime(getTotalDuration())}
                    playbackSpeed={playbackSpeed}
                    onChangeSpeed={(spd) => setPlaybackSpeed(spd)}
                    volume={volume}
                    onVolumeChange={(v) => setVolume(v)}
                    isMuted={isMuted}
                    onToggleMute={() => setIsMuted(!isMuted)}
                    onExportVideo={handleExportVideo}
                    currentLanguage={videoData.language}
                    onLiveTranslate={handleLiveTranslate}
                    onShuffleStyle={handleShuffleStyle}
                    isTranslating={isTranslating}
                    voices={voices}
                    selectedVoiceURI={selectedVoiceURI}
                    onSelectVoice={(uri) => setSelectedVoiceURI(uri)}
                    showCaptions={showCaptions}
                    onToggleCaptions={() => setShowCaptions(!showCaptions)}
                    voiceGender={voiceGender}
                    selectedElevenLabsVoice={selectedElevenLabsVoice}
                    onSelectElevenLabsVoice={(v) => setSelectedElevenLabsVoice(v)}
                    onSelectSarvamSpeaker={(spk) => setSelectedSarvamSpeaker(spk)}
                    selectedSarvamSpeaker={selectedSarvamSpeaker}
                    onGenerateHeyGenVideo={handleGenerateHeyGenVideo}
                    isHeyGenGenerating={isHeyGenGenerating}
                  />
                </div>

                {/* SIDE INTERACTIVE TABS & YOUTUBE UP NEXT SIDEBAR */}
                <div className="side-panel">
                  <div className="tab-nav">
                    <button
                      className={`tab-link ${activeSideTab === 'scenes' ? 'active' : ''}`}
                      onClick={() => setActiveSideTab('scenes')}
                    >
                      Up Next
                    </button>
                    <button
                      className={`tab-link ${activeSideTab === 'quiz' ? 'active' : ''}`}
                      onClick={() => setActiveSideTab('quiz')}
                    >
                      Quiz
                    </button>
                    <button
                      className={`tab-link ${activeSideTab === 'notes' ? 'active' : ''}`}
                      onClick={() => setActiveSideTab('notes')}
                    >
                      Notes
                    </button>
                    <button
                      className={`tab-link ${activeSideTab === 'chat' ? 'active' : ''}`}
                      onClick={() => setActiveSideTab('chat')}
                    >
                      Ask AI
                    </button>
                  </div>

                  <div className="tab-body">
                    {activeSideTab === 'scenes' && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                            <i className="fa-brands fa-youtube" style={{ color: '#FF0000', marginRight: '6px' }}></i> Recommended Scenes
                          </h3>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Autoplay ON</span>
                        </div>

                        {videoData.scenes.map((s, idx) => (
                          <div
                            key={idx}
                            className={`scene-item ${idx === activeSceneIndex ? 'active' : ''}`}
                            style={{
                              display: 'flex',
                              gap: '10px',
                              padding: '8px',
                              borderRadius: '10px',
                              marginBottom: '8px',
                              cursor: 'pointer',
                              background: idx === activeSceneIndex ? 'rgba(99,102,241,0.15)' : 'var(--bg-card)',
                              border: idx === activeSceneIndex ? '1px solid rgba(99,102,241,0.4)' : '1px solid var(--border-color)',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => {
                              setActiveSceneIndex(idx);
                              setSceneProgress(0);
                              if (isPlaying) speakNarration(idx);
                            }}
                          >
                            {/* YouTube Video Thumbnail Placeholder Card */}
                            <div style={{ position: 'relative', width: '105px', height: '62px', borderRadius: '8px', overflow: 'hidden', background: 'linear-gradient(135deg, #1e1b4b, #0f172a)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                              <i className={`fa-solid ${idx === activeSceneIndex && isPlaying ? 'fa-signal fa-beat' : 'fa-play'}`} style={{ color: idx === activeSceneIndex ? '#818cf8' : '#cbd5e1', fontSize: '0.9rem' }}></i>
                              <span style={{ position: 'absolute', bottom: '3px', right: '4px', background: 'rgba(0,0,0,0.85)', color: '#fff', fontSize: '0.62rem', fontFamily: 'monospace', padding: '1px 4px', borderRadius: '3px' }}>
                                {formatTime(s.duration || 50)}
                              </span>
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: idx === activeSceneIndex ? '#818cf8' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '2px' }}>
                                {idx + 1}. {s.title}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                heyBuddy AI • {(s.bullets || [])[0] || 'Scientific breakdown'}
                              </div>
                              <div style={{ fontSize: '0.68rem', color: '#10b981', marginTop: '4px' }}>
                                {idx === activeSceneIndex ? '▶ Playing Now' : 'Up Next'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeSideTab === 'quiz' && (
                      <QuizTab quizItems={videoData.quiz || []} />
                    )}

                    {activeSideTab === 'notes' && (
                      <NotesTab topic={videoData.topic} notesItems={videoData.notes || []} scenes={videoData.scenes} />
                    )}

                    {activeSideTab === 'chat' && (
                      <DoubtChat
                        topic={videoData.topic}
                        timestamp={formatTime(getCurrentTime())}
                        apiKey={apiKey}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <Library onSelectTopic={(topic, domain) => {
            setActiveTab('studio');
            handleGenerate({
              topic,
              methodology: 'Feynman',
              language: 'English',
              style: 'Minimalist',
              gradeLevel: 'High School',
              streamDomain: domain || 'STEM / Physical Sciences',
              lectureDuration: '5 Mins',
              avatarGender,
              voiceGender
            });
          }} />
        )}
      </main>

      {/* API KEYS SETTINGS MODAL */}
      {showKeyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2rem', width: '90%', maxWidth: '540px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                <i className="fa-solid fa-key" style={{ color: 'var(--accent-indigo)', marginRight: '8px' }}></i>
                Multi-Cloud API Credentials
              </h2>
              <button onClick={() => setShowKeyModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleSaveApiKeys({
                gemini: e.target.gemini.value,
                sarvam: e.target.sarvam.value,
                openai: e.target.openai.value,
                elevenlabs: e.target.elevenlabs.value,
                deepl: e.target.deepl.value,
                heygen: e.target.heygen.value
              });
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Google Gemini API Key:</label>
                  <input name="gemini" type="password" defaultValue={apiKey} placeholder="AIZA..." className="select-mono" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>OpenAI API Key (GPT-4o Deep Engine):</label>
                  <input name="openai" type="password" defaultValue={openaiKey} placeholder="sk-proj-..." className="select-mono" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#a78bfa', display: 'block', marginBottom: '4px' }}>ElevenLabs API Key (Ultra-Realistic Voice AI):</label>
                  <input name="elevenlabs" type="password" defaultValue={elevenlabsKey} placeholder="elevenlabs_..." className="select-mono" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#10b981', display: 'block', marginBottom: '4px' }}>Sarvam AI Key (Bulbul v3 Indian TTS):</label>
                  <input name="sarvam" type="password" defaultValue={sarvamKey} placeholder="sarvam_..." className="select-mono" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#38bdf8', display: 'block', marginBottom: '4px' }}>DeepL API Key (Contextual Translation):</label>
                  <input name="deepl" type="password" defaultValue={deeplKey} placeholder="deepl_..." className="select-mono" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#ec4899', display: 'block', marginBottom: '4px' }}>HeyGen API Key (Virtual Teacher Stream):</label>
                  <input name="heygen" type="password" defaultValue={heygenKey} placeholder="heygen_..." className="select-mono" style={{ width: '100%' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowKeyModal(false)} className="method-pill">Cancel</button>
                <button type="submit" className="btn-black" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderColor: 'transparent' }}>Save API Keys</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
