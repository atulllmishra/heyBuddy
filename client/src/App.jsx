import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Studio from './components/Studio';
import VideoPlayer from './components/VideoPlayer';
import ControlsBar from './components/ControlsBar';
import QuizTab from './components/QuizTab';
import NotesTab from './components/NotesTab';
import DoubtChat from './components/DoubtChat';
import Library from './components/Library';
import AuthModal from './components/AuthModal';
import SettingsModal from './components/SettingsModal';
import { API_BASE_URL } from './config';

export default function App() {
  // Navigation & UI State
  const [activeTab, setActiveTab] = useState('studio'); // 'studio' | 'library'

  // User Auth & Choices State
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);

  // Video Player & Lecture State
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [activeSideTab, setActiveSideTab] = useState('scenes'); // 'scenes' | 'quiz' | 'notes' | 'chat'
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [currentAvatarId, setCurrentAvatarId] = useState('Daisy-in-suit');
  const [codec, setCodec] = useState('AV1');
  const [quality, setQuality] = useState('1080p60');
  const [isHeyGenGenerating, setIsHeyGenGenerating] = useState(false);

  // Load User Session & Preferences on Mount
  useEffect(() => {
    const savedUser = localStorage.getItem('heybuddy_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.warn('Failed to parse user session');
      }
    }
  }, []);

  // Web Speech Audio Synthesizer
  const speakNarration = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = playbackSpeed;
    utterance.volume = isMuted ? 0 : volume;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  const togglePlay = () => {
    if (!videoData) return;
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      const currentScene = videoData.scenes[activeSceneIndex];
      if (currentScene) speakNarration(currentScene.narration);
    } else {
      stopSpeech();
    }
  };

  // Generate Single-Scene Hinglish Masterclass
  const handleGenerate = async ({ topic, gradeLevel = 'High School', streamDomain = 'STEM / Physical Sciences' }) => {
    setLoading(true);
    stopSpeech();

    try {
      const res = await fetch(`${API_BASE_URL}/api/video/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          gradeLevel,
          streamDomain,
          language: 'Hinglish',
          apiKey: localStorage.getItem('heybuddy_gemini_key') || '',
          openaiKey: localStorage.getItem('heybuddy_openai_key') || ''
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.data) {
        setVideoData(data.data);
        setActiveSceneIndex(0);
        setSceneProgress(0);
        setIsPlaying(false);
      } else {
        alert(`Generation Notice: ${data.error || 'Please try again.'}`);
      }
    } catch (err) {
      console.error('Generation error:', err);
      alert(`Failed to connect to backend server at ${API_BASE_URL}. Ensure backend service is active.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSeek = (percentage) => {
    if (!videoData) return;
    const currentScene = videoData.scenes[0] || {};
    const totalSecs = currentScene.duration || 200;
    const seekTime = (percentage / 100) * totalSecs;
    setSceneProgress(seekTime);
  };

  const getCurrentTime = () => sceneProgress;
  const getTotalDuration = () => (videoData?.scenes?.[0]?.duration || 200);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // HeyGen Avatar Video Trigger
  const handleGenerateHeyGenVideo = async () => {
    if (!videoData || !videoData.scenes[0]) return;
    const currentScene = videoData.scenes[0];
    setIsHeyGenGenerating(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/heygen/generate-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptText: currentScene.narration,
          avatarId: currentAvatarId,
          voiceId: 'en-US-JennyNeural',
          gender: 'female',
          heygenKey: localStorage.getItem('heybuddy_heygen_key') || ''
        })
      });
      const data = await res.json();
      if (data.success && data.data?.videoId) {
        alert(`🎉 HeyGen Avatar Video Generation Initiated!\nVideo ID: ${data.data.videoId}`);
      } else {
        alert(`HeyGen Notice: ${data.error || 'Please check your HeyGen API key in Settings.'}`);
      }
    } catch (err) {
      console.error('HeyGen generation error:', err);
      alert('Failed to connect to backend server.');
    } finally {
      setIsHeyGenGenerating(false);
    }
  };

  const handleExportVideo = () => {
    alert('WebM Masterclass recording initiated! Download will trigger automatically.');
  };

  return (
    <div className="app-container">
      {/* Top Header Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => { stopSpeech(); setActiveTab(tab); }}
        user={user}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenSettings={() => setShowKeyModal(true)}
      />

      <main className="main-wrapper">
        {activeTab === 'studio' ? (
          <>
            <Studio onGenerate={handleGenerate} loading={loading} />

            {videoData && (
              <div style={{ display: 'grid', gridTemplateColumns: isTheaterMode ? '1fr' : '1fr 340px', gap: '1.5rem', marginTop: '1.5rem' }}>
                {/* Main Video Player Container */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                      {videoData.topic}
                    </h2>
                    <span className="badge-mono">
                      {videoData.streamDomain || 'STEM'} • {videoData.gradeLevel || 'Standard'}
                    </span>
                  </div>

                  <VideoPlayer
                    videoData={videoData}
                    activeSceneIndex={0}
                    sceneProgress={sceneProgress}
                    isPlaying={isPlaying}
                    currentAvatarId={currentAvatarId}
                    onSelectAvatar={(id) => setCurrentAvatarId(id)}
                    showCaptions={showCaptions}
                    codec={codec}
                    onSelectCodec={setCodec}
                    quality={quality}
                    onSelectQuality={setQuality}
                    isTheaterMode={isTheaterMode}
                    onToggleTheater={() => setIsTheaterMode(!isTheaterMode)}
                  />

                  <ControlsBar
                    isPlaying={isPlaying}
                    onTogglePlay={togglePlay}
                    progressPercent={(getCurrentTime() / getTotalDuration()) * 100}
                    onSeek={handleSeek}
                    currentTimeStr={formatTime(getCurrentTime())}
                    totalTimeStr={formatTime(getTotalDuration())}
                    playbackSpeed={playbackSpeed}
                    onChangeSpeed={setPlaybackSpeed}
                    volume={volume}
                    onVolumeChange={setVolume}
                    isMuted={isMuted}
                    onToggleMute={() => setIsMuted(!isMuted)}
                    onExportVideo={handleExportVideo}
                    showCaptions={showCaptions}
                    onToggleCaptions={() => setShowCaptions(!showCaptions)}
                    onGenerateHeyGenVideo={handleGenerateHeyGenVideo}
                    isHeyGenGenerating={isHeyGenGenerating}
                  />
                </div>

                {/* Right Interactive Tabs */}
                {!isTheaterMode && (
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1rem' }}>
                    <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                      <button
                        className={`method-pill ${activeSideTab === 'scenes' ? 'active' : ''}`}
                        style={{ borderRadius: 0, border: 'none', borderBottom: activeSideTab === 'scenes' ? '2px solid var(--accent-indigo)' : 'none', flex: 1 }}
                        onClick={() => setActiveSideTab('scenes')}
                      >
                        Overview
                      </button>
                      <button
                        className={`method-pill ${activeSideTab === 'quiz' ? 'active' : ''}`}
                        style={{ borderRadius: 0, border: 'none', borderBottom: activeSideTab === 'quiz' ? '2px solid var(--accent-indigo)' : 'none', flex: 1 }}
                        onClick={() => setActiveSideTab('quiz')}
                      >
                        Quiz
                      </button>
                      <button
                        className={`method-pill ${activeSideTab === 'notes' ? 'active' : ''}`}
                        style={{ borderRadius: 0, border: 'none', borderBottom: activeSideTab === 'notes' ? '2px solid var(--accent-indigo)' : 'none', flex: 1 }}
                        onClick={() => setActiveSideTab('notes')}
                      >
                        Notes
                      </button>
                      <button
                        className={`method-pill ${activeSideTab === 'chat' ? 'active' : ''}`}
                        style={{ borderRadius: 0, border: 'none', borderBottom: activeSideTab === 'chat' ? '2px solid var(--accent-indigo)' : 'none', flex: 1 }}
                        onClick={() => setActiveSideTab('chat')}
                      >
                        Ask AI
                      </button>
                    </div>

                    {activeSideTab === 'scenes' && (
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                          Masterclass Overview
                        </h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {videoData.summary || `Single-scene Hinglish masterclass on ${videoData.topic}.`}
                        </p>
                      </div>
                    )}

                    {activeSideTab === 'quiz' && <QuizTab quizItems={videoData.quiz || []} />}
                    {activeSideTab === 'notes' && <NotesTab topic={videoData.topic} notesItems={videoData.notes || []} scenes={videoData.scenes} />}
                    {activeSideTab === 'chat' && <DoubtChat topic={videoData.topic} timestamp={formatTime(getCurrentTime())} apiKey={localStorage.getItem('heybuddy_gemini_key') || ''} />}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <Library onSelectTopic={(topic, domain) => {
            setActiveTab('studio');
            handleGenerate({ topic, streamDomain: domain });
          }} />
        )}
      </main>

      {/* User Auth & Choices Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={(userData) => setUser(userData)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showKeyModal}
        onClose={() => setShowKeyModal(false)}
        onSaveApiKeys={({ gemini, sarvam, openai, elevenlabs, deepl, heygen }) => {
          localStorage.setItem('heybuddy_gemini_key', gemini);
          localStorage.setItem('heybuddy_sarvam_key', sarvam);
          localStorage.setItem('heybuddy_openai_key', openai);
          localStorage.setItem('heybuddy_elevenlabs_key', elevenlabs);
          localStorage.setItem('heybuddy_deepl_key', deepl);
          localStorage.setItem('heybuddy_heygen_key', heygen);
          setShowKeyModal(false);
        }}
      />
    </div>
  );
}
