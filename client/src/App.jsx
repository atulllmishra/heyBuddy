import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';
import SettingsModal from './components/SettingsModal';

import HomePage from './pages/HomePage';
import StudioPage from './pages/StudioPage';
import WatchPage from './pages/WatchPage';
import LibraryPage from './pages/LibraryPage';
import HistoryPage from './pages/HistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

import { API_BASE_URL } from './config';

export default function App() {
  // Navigation & Layout State
  const [activeNav, setActiveNav] = useState('home'); // 'home' | 'studio' | 'watch' | 'library' | 'history' | 'analytics' | 'settings'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudioTopic, setSelectedStudioTopic] = useState('');

  // User Auth & Preference State
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);

  // Video Masterclass State
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [activeSideTab, setActiveSideTab] = useState('scenes');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [currentAvatarId, setCurrentAvatarId] = useState('Daisy-in-suit');
  const [isHeyGenGenerating, setIsHeyGenGenerating] = useState(false);

  // Load User Session on Mount
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

  // Web Speech Synthesis
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

  // Generate Masterclass from Backend API
  const handleGenerate = async ({ topic, gradeLevel, streamDomain, methodology, language, style, apiKey, openaiKey, useHeyGen, avatarId }) => {
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
          methodology,
          language,
          style,
          apiKey: apiKey || localStorage.getItem('heybuddy_gemini_key') || '',
          openaiKey: openaiKey || localStorage.getItem('heybuddy_openai_key') || ''
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setVideoData(json.data);
        setActiveSceneIndex(0);
        setIsPlaying(true);
        setActiveNav('watch');

        const currentScene = json.data.scenes?.[0];
        if (currentScene) speakNarration(currentScene.narration);

        // Record into Backend History API
        fetch(`${API_BASE_URL}/api/history`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: json.data.topic,
            methodology: methodology || 'Feynman Technique',
            language: language || 'Hinglish',
            duration: '10 min'
          })
        }).catch(err => console.warn('Failed to log history:', err));

      } else {
        alert(json.error || 'Failed to generate lecture script.');
      }
    } catch (err) {
      console.error('[App] Generation error:', err);
      alert('Could not connect to backend server. Make sure node server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTopicFromHome = (topicTitle) => {
    handleGenerate({ topic: topicTitle });
  };

  const handleNavigateStudio = (topicTitle = '') => {
    setSelectedStudioTopic(topicTitle);
    setActiveNav('studio');
  };

  const handleSaveToLibrary = (data) => {
    fetch(`${API_BASE_URL}/api/library`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: data.topic,
        category: data.subject || 'General',
        summary: data.summary || 'Custom generated AI Masterclass lecture.'
      })
    }).catch(err => console.warn('Failed to save to library:', err));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    handleGenerate({ topic: searchQuery });
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans">
      {/* Top Fixed Header */}
      <Header
        activeNav={activeNav}
        onSelectNav={setActiveNav}
        user={user}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenSettings={() => setShowKeyModal(true)}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeNav={activeNav}
          onSelectNav={setActiveNav}
          isCollapsed={isSidebarCollapsed}
        />

        {/* Center Page Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {activeNav === 'home' && (
            <HomePage
              onSelectTopic={handleSelectTopicFromHome}
              onNavigateStudio={handleNavigateStudio}
            />
          )}

          {activeNav === 'studio' && (
            <StudioPage
              onGenerate={handleGenerate}
              loading={loading}
              initialTopic={selectedStudioTopic}
            />
          )}

          {activeNav === 'watch' && (
            <WatchPage
              videoData={videoData}
              isPlaying={isPlaying}
              togglePlay={togglePlay}
              activeSceneIndex={activeSceneIndex}
              setActiveSceneIndex={setActiveSceneIndex}
              sceneProgress={sceneProgress}
              playbackSpeed={playbackSpeed}
              setPlaybackSpeed={setPlaybackSpeed}
              volume={volume}
              setVolume={setVolume}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
              showCaptions={showCaptions}
              setShowCaptions={setShowCaptions}
              isTheaterMode={isTheaterMode}
              setIsTheaterMode={setIsTheaterMode}
              activeSideTab={activeSideTab}
              setActiveSideTab={setActiveSideTab}
              currentAvatarId={currentAvatarId}
              setCurrentAvatarId={setCurrentAvatarId}
              isHeyGenGenerating={isHeyGenGenerating}
              onSaveToLibrary={handleSaveToLibrary}
              onBackToHome={() => setActiveNav('home')}
            />
          )}

          {activeNav === 'library' && (
            <LibraryPage
              onSelectTopic={handleSelectTopicFromHome}
            />
          )}

          {activeNav === 'history' && (
            <HistoryPage
              onSelectTopic={handleSelectTopicFromHome}
            />
          )}

          {activeNav === 'analytics' && (
            <AnalyticsPage />
          )}

          {activeNav === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>

      {/* Global Auth & Settings Modals */}
      {showAuthModal && (
        <AuthModal
          user={user}
          onLogin={(userData) => {
            setUser(userData);
            localStorage.setItem('heybuddy_user', JSON.stringify(userData));
            setShowAuthModal(false);
          }}
          onLogout={() => {
            setUser(null);
            localStorage.removeItem('heybuddy_user');
            setShowAuthModal(false);
          }}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {showKeyModal && (
        <SettingsModal
          onClose={() => setShowKeyModal(false)}
        />
      )}
    </div>
  );
}
