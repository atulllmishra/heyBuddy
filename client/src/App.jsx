import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';
import SettingsModal from './components/SettingsModal';

import DynamicStateControls from './components/DynamicStateControls';
import SyllabusScanner from './components/SyllabusScanner';
import LecturePlaylist from './components/LecturePlaylist';
import PipelineMonitor from './components/PipelineMonitor';

import HomePage from './pages/HomePage';
import StudioPage from './pages/StudioPage';
import WatchPage from './pages/WatchPage';
import LibraryPage from './pages/LibraryPage';
import HistoryPage from './pages/HistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

import { useAppStore } from './store/zustand';
import { API_BASE_URL } from './config';
import { Sparkles, Scan, PlayCircle, Layers } from 'lucide-react';

export default function App() {
  const { activeSyllabus, activePlaylist, activeTaskId } = useAppStore();

  // Navigation State
  const [activeNav, setActiveNavState] = useState(() => {
    const hash = window.location.hash.replace('#/', '');
    const validPages = ['home', 'syllabus', 'studio', 'watch', 'library', 'history', 'analytics', 'settings'];
    return validPages.includes(hash) ? hash : 'home';
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudioTopic, setSelectedStudioTopic] = useState('');

  const handleSelectNav = (newNav) => {
    setActiveNavState(newNav);
    if (window.location.hash !== `#/${newNav}`) {
      window.location.hash = `#/${newNav}`;
    }
  };

  useEffect(() => {
    const syncNavFromHash = () => {
      const hash = window.location.hash.replace('#/', '');
      const validPages = ['home', 'syllabus', 'studio', 'watch', 'library', 'history', 'analytics', 'settings'];
      if (validPages.includes(hash)) {
        setActiveNavState(hash);
      }
    };

    window.addEventListener('hashchange', syncNavFromHash);
    window.addEventListener('popstate', syncNavFromHash);
    return () => {
      window.removeEventListener('hashchange', syncNavFromHash);
      window.removeEventListener('popstate', syncNavFromHash);
    };
  }, []);

  // User Auth & Session
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);

  // Video State
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

  const handleGenerate = async ({ topic, gradeLevel, streamDomain, methodology, language, style, apiKey, openaiKey }) => {
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
        handleSelectNav('watch');

        const currentScene = json.data.scenes?.[0];
        if (currentScene) speakNarration(currentScene.narration);
      } else {
        alert(json.error || 'Failed to generate lecture script.');
      }
    } catch (err) {
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTopicFromHome = (topicTitle) => {
    handleGenerate({ topic: topicTitle });
  };

  const handleNavigateStudio = (topicTitle = '') => {
    setSelectedStudioTopic(topicTitle);
    handleSelectNav('studio');
  };

  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans">
      {/* Fixed Header */}
      <Header
        activeNav={activeNav}
        onSelectNav={handleSelectNav}
        user={user}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenSettings={() => setShowKeyModal(true)}
        onToggleSidebar={handleToggleSidebar}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={(e) => {
          e.preventDefault();
          if (searchQuery.trim()) handleGenerate({ topic: searchQuery });
        }}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeNav={activeNav}
          onSelectNav={handleSelectNav}
          onSelectDomain={setSelectedDomain}
          selectedDomain={selectedDomain}
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-16 min-h-[calc(100vh-3.5rem)] space-y-6">
          
          {/* Dynamic Pedagogy, Language & Voice Accent Controls Bar */}
          <DynamicStateControls />

          {/* Real-time Celery Pipeline Progress Monitor */}
          {activeTaskId && <PipelineMonitor />}

          {/* Navigation Views */}
          {activeNav === 'home' && (
            <div className="space-y-8">
              <SyllabusScanner onSyllabusParsed={() => handleSelectNav('syllabus')} />
              <HomePage
                onSelectTopic={handleSelectTopicFromHome}
                onNavigateStudio={handleNavigateStudio}
                selectedDomain={selectedDomain}
                onSelectDomain={setSelectedDomain}
              />
            </div>
          )}

          {activeNav === 'syllabus' && (
            <div className="space-y-8">
              <SyllabusScanner />
              {activePlaylist && <LecturePlaylist playlist={activePlaylist} />}
            </div>
          )}

          {activeNav === 'studio' && (
            <StudioPage
              onGenerate={handleGenerate}
              loading={loading}
              initialTopic={selectedStudioTopic}
            />
          )}

          {activeNav === 'watch' && (
            <div className="space-y-6">
              <LecturePlaylist playlist={activePlaylist} />
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
                onBackToHome={() => handleSelectNav('home')}
              />
            </div>
          )}

          {activeNav === 'library' && <LibraryPage onSelectTopic={handleSelectTopicFromHome} />}
          {activeNav === 'history' && <HistoryPage onSelectTopic={handleSelectTopicFromHome} />}
          {activeNav === 'analytics' && <AnalyticsPage />}
          {activeNav === 'settings' && <SettingsPage />}

        </main>
      </div>

      {/* Global Modals */}
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
        <SettingsModal onClose={() => setShowKeyModal(false)} />
      )}
    </div>
  );
}
