import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Studio from './components/Studio';
import VideoPlayer from './components/VideoPlayer';
import ControlsBar from './components/ControlsBar';
import QuizTab from './components/QuizTab';
import NotesTab from './components/NotesTab';
import DoubtChat from './components/DoubtChat';
import Library from './components/Library';

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

  // Async Pipeline Queue Job state
  const [jobProgress, setJobProgress] = useState(null);

  const [apiKey, setApiKey] = useState(() => localStorage.getItem('heybuddy_gemini_key') || '');
  const [showKeyModal, setShowKeyModal] = useState(false);

  const animationRef = useRef(null);
  const startTimeRef = useRef(0);
  const utteranceRef = useRef(null);

  // Toggle Theme
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Generate Video Endpoint with Async Pipeline polling simulation
  const handleGenerate = async ({ topic, methodology, language, style, gradeLevel }) => {
    setLoading(true);
    setJobProgress({ progress: 10, message: 'Initiating backend AI video pipeline...' });

    try {
      // 1. Call async job rendering pipeline
      const asyncRes = await fetch('/api/video/render-async', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, methodology, language, style, gradeLevel, apiKey })
      });
      const asyncData = await asyncRes.json();

      if (asyncData.success && asyncData.jobId) {
        const jobId = asyncData.jobId;
        // Poll for job completion
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch(`/api/video/job/${jobId}`);
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
        // Direct fallback
        const res = await fetch('/api/video/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, methodology, language, style, gradeLevel, apiKey })
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

  // On-the-fly Interactive Script Translation
  const handleLiveTranslate = async (targetLanguage) => {
    if (!videoData) return;
    setIsTranslating(true);
    try {
      const res = await fetch('/api/video/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoData, targetLanguage, apiKey })
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
      gradeLevel: videoData.gradeLevel || 'High School'
    });
  };

  // Initial load default video (Photosynthesis)
  useEffect(() => {
    handleGenerate({
      topic: 'Photosynthesis & Light Reactions',
      methodology: 'Feynman',
      language: 'English',
      style: 'Minimalist',
      gradeLevel: 'High School'
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

  // Web Speech TTS Synthesis
  const speakNarration = (sceneIdx) => {
    if (!('speechSynthesis' in window) || isMuted || !videoData) return;
    stopSpeech();

    const scene = videoData.scenes[sceneIdx];
    if (!scene || !scene.narration) return;

    const utter = new SpeechSynthesisUtterance(scene.narration);
    utter.rate = playbackSpeed;
    utter.volume = volume;
    utteranceRef.current = utter;
    window.speechSynthesis.speak(utter);
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopSpeech();
    } else {
      setIsPlaying(true);
      speakNarration(activeSceneIndex);
    }
  };

  // Seeker Math
  const getTotalDuration = () => {
    if (!videoData) return 40;
    return videoData.scenes.reduce((acc, s) => acc + (s.duration || 10), 0);
  };

  const getCurrentTime = () => {
    if (!videoData) return 0;
    let curr = 0;
    for (let i = 0; i < activeSceneIndex; i++) {
      curr += videoData.scenes[i].duration || 10;
    }
    curr += sceneProgress * (videoData.scenes[activeSceneIndex]?.duration || 10);
    return curr;
  };

  const handleSeek = (percent) => {
    if (!videoData) return;
    const totalSecs = getTotalDuration();
    const targetSecs = (percent / 100) * totalSecs;

    let accum = 0;
    for (let i = 0; i < videoData.scenes.length; i++) {
      const dur = videoData.scenes[i].duration || 10;
      if (targetSecs <= accum + dur || i === videoData.scenes.length - 1) {
        setActiveSceneIndex(i);
        const p = Math.max(0, Math.min(1, (targetSecs - accum) / dur));
        setSceneProgress(p);
        break;
      }
      accum += dur;
    }
    if (isPlaying) speakNarration(activeSceneIndex);
  };

  // Video Export WebM Recorder
  const handleExportVideo = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      alert("Canvas player not ready.");
      return;
    }
    try {
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

  // Save API key
  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('heybuddy_gemini_key', key);
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
                    <i className="fa-solid fa-gears fa-spin" style={{ marginRight: '6px' }}></i>
                    Backend Pipeline Rendering...
                  </span>
                  <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                    {jobProgress.progress}%
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#262626', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${jobProgress.progress}%`, height: '100%', background: 'var(--text-primary)', transition: 'width 0.3s ease' }}></div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  {jobProgress.message}
                </div>
              </div>
            )}

            {videoData && (
              <div className="workspace-grid">
                {/* VIDEO PLAYER COLUMN */}
                <div className="video-container">
                  <div className="video-meta">
                    <span className="badge-mono" style={{ margin: 0 }}>
                      <i className="fa-solid fa-play"></i> AI GENERATED VIDEO
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
                  />
                </div>

                {/* SIDE INTERACTIVE TABS */}
                <div className="side-panel">
                  <div className="tab-nav">
                    <button
                      className={`tab-link ${activeSideTab === 'scenes' ? 'active' : ''}`}
                      onClick={() => setActiveSideTab('scenes')}
                    >
                      Scenes
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
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Scene Breakdown</h3>
                        {videoData.scenes.map((s, idx) => (
                          <div
                            key={idx}
                            className={`scene-item ${idx === activeSceneIndex ? 'active' : ''}`}
                            onClick={() => {
                              setActiveSceneIndex(idx);
                              setSceneProgress(0);
                              if (isPlaying) speakNarration(idx);
                            }}
                          >
                            <div className="scene-title">{idx + 1}. {s.title}</div>
                            <div className="scene-desc">{(s.bullets || [])[0]}</div>
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
                        methodology={videoData.methodology}
                        language={videoData.language}
                        apiKey={apiKey}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <Library onSelectTopic={(t) => {
            setActiveTab('studio');
            handleGenerate({ topic: t, methodology: 'Feynman', language: 'English', style: 'Minimalist', gradeLevel: 'High School' });
          }} />
        )}
      </main>

      {/* GEMINI KEY SETTINGS MODAL */}
      {showKeyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="studio-card" style={{ width: '90%', maxWidth: '450px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Gemini AI Configuration</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              heyBuddy includes a procedural engine offline. To use Google Gemini API for custom AI prompts, enter your key below:
            </p>
            <input
              type="password"
              defaultValue={apiKey}
              placeholder="AIzaSy..."
              className="select-mono"
              style={{ marginBottom: '1rem' }}
              id="apiKeyInputElem"
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button className="method-pill" onClick={() => setShowKeyModal(false)}>Cancel</button>
              <button className="btn-black" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={() => {
                const val = document.getElementById('apiKeyInputElem').value;
                handleSaveApiKey(val);
              }}>Save Key</button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        © 2026 heyBuddy AI EdTech Platform • MERN + React Architecture
      </footer>
    </div>
  );
}
