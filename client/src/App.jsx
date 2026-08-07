import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomeFeed from './components/HomeFeed';
import Studio from './components/Studio';
import VideoPlayer from './components/VideoPlayer';
import ControlsBar from './components/ControlsBar';
import QuizTab from './components/QuizTab';
import NotesTab from './components/NotesTab';
import DoubtChat from './components/DoubtChat';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AuthModal from './components/AuthModal';
import SettingsModal from './components/SettingsModal';
import { API_BASE_URL } from './config';

export default function App() {
  // Navigation & UI State
  const [activeNav, setActiveNav] = useState('home'); // 'home' | 'studio' | 'library' | 'history' | 'analytics'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
      const res = await fetch(`${API_BASE_URL}/api/generate-lecture`, {
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
        setActiveNav('watch');
      } else {
        alert(`Generation Notice: ${data.error || 'Please try again.'}`);
      }
    } catch (err) {
      console.error('Generation error:', err);
      alert('Failed to connect to backend server. Make sure node server is running on http://localhost:3000.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    handleGenerate({
      topic: searchQuery,
      gradeLevel: user?.rigorLevel || 'College / Undergrad',
      streamDomain: user?.academicStream || 'STEM / Physical Sciences'
    });
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
      {/* Authentic YouTube Top Navigation Bar */}
      <Header
        activeNav={activeNav}
        onSelectNav={(nav) => { stopSpeech(); setActiveNav(nav); }}
        user={user}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenSettings={() => setShowKeyModal(true)}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      <div className="main-layout">
        {/* Authentic YouTube Left Collapsible Sidebar */}
        <Sidebar
          activeNav={activeNav}
          onSelectNav={(nav) => { stopSpeech(); setActiveNav(nav); }}
          isCollapsed={isSidebarCollapsed}
        />

        {/* Content View Container */}
        <main
          className="content-area"
          style={{ marginLeft: isSidebarCollapsed ? '72px' : '240px' }}
        >
          {activeNav === 'home' && (
            <HomeFeed
              onSelectVideo={(topic, domain) => handleGenerate({ topic, streamDomain: domain })}
              onOpenStudio={() => setActiveNav('studio')}
            />
          )}

          {activeNav === 'studio' && (
            <Studio onGenerate={handleGenerate} loading={loading} />
          )}

          {activeNav === 'analytics' && (
            <AnalyticsDashboard user={user} />
          )}

          {(activeNav === 'library' || activeNav === 'history' || activeNav === 'subscriptions') && (
            <div style={{ padding: '1.5rem', background: 'var(--yt-bg-card)', borderRadius: '16px', border: '1px solid var(--yt-border)' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--yt-text-primary)' }}>
                {activeNav === 'library' ? '📚 Your Library & Saved Masterclasses' : activeNav === 'history' ? '🕒 Watch History' : '🔔 Subscriptions'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--yt-text-secondary)' }}>
                Access your bookmarked Hinglish lectures, quiz logs, and open data citations.
              </p>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button className="chip-btn active" onClick={() => setActiveNav('studio')}>
                  + Generate New Masterclass
                </button>
              </div>
            </div>
          )}

          {activeNav === 'watch' && videoData && (
            <div style={{ display: 'grid', gridTemplateColumns: isTheaterMode ? '1fr' : '1fr 360px', gap: '1.5rem' }}>
              {/* Left Column: YouTube Video Player + Description */}
              <div>
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

              {/* Right Column: YouTube Up Next Sidebar + Interactive Tabs */}
              {!isTheaterMode && (
                <div style={{ background: 'var(--yt-bg-card)', border: '1px solid var(--yt-border)', borderRadius: '16px', padding: '1rem' }}>
                  <div style={{ display: 'flex', borderBottom: '1px solid var(--yt-border)', marginBottom: '1rem' }}>
                    <button
                      className={`chip-btn ${activeSideTab === 'scenes' ? 'active' : ''}`}
                      style={{ borderRadius: 0, border: 'none', borderBottom: activeSideTab === 'scenes' ? '2px solid var(--yt-blue)' : 'none', flex: 1 }}
                      onClick={() => setActiveSideTab('scenes')}
                    >
                      Up Next
                    </button>
                    <button
                      className={`chip-btn ${activeSideTab === 'quiz' ? 'active' : ''}`}
                      style={{ borderRadius: 0, border: 'none', borderBottom: activeSideTab === 'quiz' ? '2px solid var(--yt-blue)' : 'none', flex: 1 }}
                      onClick={() => setActiveSideTab('quiz')}
                    >
                      Quiz
                    </button>
                    <button
                      className={`chip-btn ${activeSideTab === 'notes' ? 'active' : ''}`}
                      style={{ borderRadius: 0, border: 'none', borderBottom: activeSideTab === 'notes' ? '2px solid var(--yt-blue)' : 'none', flex: 1 }}
                      onClick={() => setActiveSideTab('notes')}
                    >
                      Notes
                    </button>
                    <button
                      className={`chip-btn ${activeSideTab === 'chat' ? 'active' : ''}`}
                      style={{ borderRadius: 0, border: 'none', borderBottom: activeSideTab === 'chat' ? '2px solid var(--yt-blue)' : 'none', flex: 1 }}
                      onClick={() => setActiveSideTab('chat')}
                    >
                      Ask AI
                    </button>
                  </div>

                  {activeSideTab === 'scenes' && (
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--yt-text-primary)' }}>
                        ▶ Currently Playing Masterclass
                      </div>
                      <div style={{ background: '#121212', border: '1px solid var(--yt-border)', borderRadius: '10px', padding: '0.75rem' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--yt-blue)', marginBottom: '4px' }}>
                          1. {videoData.topic}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--yt-text-secondary)' }}>
                          Hinglish Masterclass • {formatTime(getTotalDuration())}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSideTab === 'quiz' && <QuizTab quizItems={videoData.quiz || []} />}
                  {activeSideTab === 'notes' && <NotesTab topic={videoData.topic} notesItems={videoData.notes || []} scenes={videoData.scenes} />}
                  {activeSideTab === 'chat' && <DoubtChat topic={videoData.topic} timestamp={formatTime(getCurrentTime())} apiKey={localStorage.getItem('heybuddy_gemini_key') || ''} />}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* User Auth & Choices Preferences Modal */}
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
