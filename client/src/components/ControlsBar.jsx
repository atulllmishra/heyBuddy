import React from 'react';
import { Play, Pause, Volume2, VolumeX, Subtitles, Download, Sparkles, Mic } from 'lucide-react';

export default function ControlsBar({
  isPlaying,
  onTogglePlay,
  progressPercent = 0,
  onSeek,
  currentTimeStr = '0:00',
  totalTimeStr = '0:00',
  playbackSpeed = 1,
  onChangeSpeed,
  volume = 1,
  onVolumeChange,
  isMuted = false,
  onToggleMute,
  onExportVideo,
  showCaptions = true,
  onToggleCaptions,
  onGenerateHeyGenVideo,
  isHeyGenGenerating = false
}) {
  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
      {/* Timeline Slider & Time readout */}
      <div className="flex items-center gap-3">
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progressPercent || 0}
          onChange={(e) => onSeek && onSeek(parseFloat(e.target.value))}
          className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <span className="text-xs font-mono text-slate-400 shrink-0">
          {currentTimeStr} / {totalTimeStr}
        </span>
      </div>

      {/* Buttons & Speed Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Play/Pause & Volume */}
        <div className="flex items-center gap-3">
          <button
            onClick={onTogglePlay}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/30 flex items-center justify-center transition-transform hover:scale-105"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMute}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange && onVolumeChange(parseFloat(e.target.value))}
              className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <button
            onClick={onToggleCaptions}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showCaptions
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30'
                : 'glass-card text-slate-400 border-slate-800'
            }`}
          >
            <Subtitles className="w-3.5 h-3.5" /> CC {showCaptions ? 'On' : 'Off'}
          </button>
        </div>

        {/* Right Speed & Export Actions */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-[11px] font-medium border border-indigo-500/20">
            <Mic className="w-3 h-3" /> Hinglish Voice
          </span>

          {/* Speed Pills */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800">
            {[1, 1.25, 1.5, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => onChangeSpeed && onChangeSpeed(spd)}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  playbackSpeed === spd
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {onExportVideo && (
            <button
              onClick={onExportVideo}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
