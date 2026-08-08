import React, { useState } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import ControlsBar from '../components/ControlsBar';
import DoubtChat from '../components/DoubtChat';
import QuizTab from '../components/QuizTab';
import NotesTab from '../components/NotesTab';
import AIAvatarPresenter from '../components/AIAvatarPresenter';
import { Play, Pause, Layers, HelpCircle, FileText, CheckSquare, Sparkles, Share2, Bookmark, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function WatchPage({
  videoData,
  isPlaying,
  togglePlay,
  activeSceneIndex,
  setActiveSceneIndex,
  sceneProgress,
  playbackSpeed,
  setPlaybackSpeed,
  volume,
  setVolume,
  isMuted,
  setIsMuted,
  showCaptions,
  setShowCaptions,
  isTheaterMode,
  setIsTheaterMode,
  activeSideTab,
  setActiveSideTab,
  currentAvatarId,
  setCurrentAvatarId,
  isHeyGenGenerating,
  onSaveToLibrary,
  onBackToHome
}) {
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!videoData) {
    return (
      <div className="glass-panel p-12 rounded-2xl text-center max-w-xl mx-auto space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
          <Play className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">No Masterclass Loaded</h2>
        <p className="text-slate-400 text-sm">
          Select a masterclass topic from the Home page feed or generate a new one in the AI Studio.
        </p>
        <button
          onClick={onBackToHome}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
        >
          Explore Topics
        </button>
      </div>
    );
  }

  const currentScene = videoData.scenes?.[activeSceneIndex] || videoData.scenes?.[0];

  const handleSave = () => {
    onSaveToLibrary(videoData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-card text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isSaved
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'glass-card text-slate-200 hover:text-white border-slate-700'
            }`}
          >
            <Bookmark className="w-4 h-4" /> {isSaved ? 'Saved in Library!' : 'Save Lecture'}
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Share2 className="w-4 h-4" /> {copied ? 'Link Copied!' : 'Share'}
          </button>
        </div>
      </div>

      {/* Main Video & Interactive Side Panel Split Grid */}
      <div className={`grid grid-cols-1 ${isTheaterMode ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-6`}>
        {/* Left Column: Player & Controls */}
        <div className={`${isTheaterMode ? 'lg:col-span-1' : 'lg:col-span-2'} space-y-4`}>
          <VideoPlayer
            videoData={videoData}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            activeSceneIndex={activeSceneIndex}
            setActiveSceneIndex={setActiveSceneIndex}
            sceneProgress={sceneProgress}
            showCaptions={showCaptions}
            setShowCaptions={setShowCaptions}
            isTheaterMode={isTheaterMode}
            onToggleTheater={() => setIsTheaterMode(!isTheaterMode)}
            playbackSpeed={playbackSpeed}
            setPlaybackSpeed={setPlaybackSpeed}
            volume={volume}
            setVolume={setVolume}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            currentAvatarId={currentAvatarId}
            onSelectAvatar={setCurrentAvatarId}
          />

          <ControlsBar
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            videoData={videoData}
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
          />
        </div>

        {/* Right Column: Interactive Side Tabs */}
        {!isTheaterMode && (
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col h-[650px]">
            {/* Tab Headers */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/80 border border-slate-800 mb-4">
              <button
                onClick={() => setActiveSideTab('scenes')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeSideTab === 'scenes'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Scenes
              </button>
              <button
                onClick={() => setActiveSideTab('chat')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeSideTab === 'chat'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" /> Ask AI
              </button>
              <button
                onClick={() => setActiveSideTab('quiz')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeSideTab === 'quiz'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" /> Quiz
              </button>
              <button
                onClick={() => setActiveSideTab('notes')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeSideTab === 'notes'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Notes
              </button>
            </div>

            {/* Tab Body Contents */}
            <div className="flex-1 overflow-y-auto pr-1">
              {activeSideTab === 'scenes' && (
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Masterclass Breakdown ({videoData.scenes?.length} Scenes)
                  </h3>
                  {videoData.scenes?.map((scene, idx) => (
                    <div
                      key={scene.id || idx}
                      onClick={() => setActiveSceneIndex(idx)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        activeSceneIndex === idx
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'glass-card border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-indigo-400">Scene {idx + 1}</span>
                        <span className="text-xs text-slate-400">{scene.duration}s</span>
                      </div>
                      <h4 className="text-sm font-semibold mb-1">{scene.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{scene.narration}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeSideTab === 'chat' && (
                <DoubtChat topic={videoData.topic} currentScene={currentScene} />
              )}

              {activeSideTab === 'quiz' && (
                <QuizTab topic={videoData.topic} currentScene={currentScene} />
              )}

              {activeSideTab === 'notes' && (
                <NotesTab topic={videoData.topic} currentScene={currentScene} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
