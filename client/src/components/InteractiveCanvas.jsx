import React, { useState, useEffect } from 'react';
import { useHandwritingAnimation } from '../hooks/useHandwritingAnimation';
import { Sparkles, Play, Pause, RotateCcw, PenTool, Brain, CheckCircle2 } from 'lucide-react';

export default function InteractiveCanvas({ 
  currentSlide = null, 
  vectors = [],
  pedagogyStyle = 'Feynman',
  theme = 'Dark Slate'
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeVectorIndex, setActiveVectorIndex] = useState(0);

  // Active vector item or default formula sample
  const activeVector = vectors[activeVectorIndex] || {
    text: currentSlide?.formula_latex || 'E = \\int_{0}^{\\infty} \\psi(x) e^{-i \\omega t} dx',
    isFormula: true,
    title: currentSlide?.title || 'Whiteboard Derivation & Proof',
    explanation: currentSlide?.whiteboard_text || 'Active AI Hand writing formulas live on virtual whiteboard...'
  };

  const { pathRef, pathData, progress, handPosition, isCompleted } = useHandwritingAnimation({
    text: activeVector.text || 'Derivation Step',
    isFormula: activeVector.isFormula !== false,
    duration: 5000,
    isPlaying: isPlaying,
    startX: 70,
    startY: 180
  });

  // Cycle through vector lines automatically when stroke completes
  useEffect(() => {
    if (isCompleted && vectors.length > 1) {
      const timer = setTimeout(() => {
        setActiveVectorIndex((prev) => (prev + 1) % vectors.length);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, vectors]);

  const themeClasses = {
    'Dark Slate': 'bg-slate-950 border-slate-800 text-slate-100',
    'Midnight Blue': 'bg-indigo-950 border-indigo-900 text-indigo-100',
    'Emerald Glass': 'bg-emerald-950 border-emerald-900 text-emerald-100',
    'Cyberpunk Neon': 'bg-black border-pink-900 text-pink-100'
  }[theme] || 'bg-slate-950 border-slate-800 text-slate-100';

  return (
    <div className={`relative w-full rounded-2xl border ${themeClasses} p-6 shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-500`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <PenTool className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-base tracking-wide flex items-center gap-2">
              Virtual AI Whiteboard Layer
              <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live SVG Handwriting
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Methodology: <span className="text-indigo-400 font-medium">{pedagogyStyle}</span> • Theme: <span className="text-cyan-400 font-medium">{theme}</span>
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title={isPlaying ? "Pause Writing" : "Play Writing"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setActiveVectorIndex(0)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Restart Whiteboard"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas SVG Drawing Area */}
      <div className="relative w-full h-[320px] bg-slate-900/60 rounded-xl border border-slate-800/80 p-4 overflow-hidden flex flex-col justify-between">
        
        {/* Grid Background Effect */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #94a3b8 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Slide Heading */}
        <div className="relative z-10">
          <h4 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            {currentSlide?.title || "1. Foundational Concept & Equation Derivation"}
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {activeVector.explanation}
          </p>
        </div>

        {/* Interactive SVG Whiteboard Surface */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* SVG Handwriting Guide Path */}
          <path
            ref={pathRef}
            d={pathData}
            fill="none"
            stroke="url(#strokeGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1000"
            strokeDashoffset={1000 * (1 - progress)}
            filter="url(#glow)"
            className="transition-all duration-75"
          />

          {/* Written LaTeX / Concept Text Overlay */}
          <text
            x="70"
            y="230"
            fill="#f8fafc"
            fontSize="18"
            fontFamily="monospace"
            className="font-mono tracking-widest fill-cyan-200 drop-shadow-md"
          >
            {activeVector.text}
          </text>
        </svg>

        {/* AI GENERATED HAND WITH MARKER STYLUS OVERLAY */}
        {/* Dynamic (x, y) tip coordinate tracking leading edge */}
        <div
          className="absolute z-20 pointer-events-none transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${handPosition.x - 12}px, ${handPosition.y - 85}px)`
          }}
        >
          <div className="relative">
            {/* Ink Sparkle Effect at Tip */}
            <div className="absolute top-[80px] left-[12px] w-3 h-3 rounded-full bg-cyan-400 animate-ping opacity-75" />
            
            {/* SVG AI Hand holding Stylus Marker */}
            <svg width="60" height="90" viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Stylus Pen Body */}
              <rect x="24" y="20" width="8" height="55" rx="3" transform="rotate(-25 24 20)" fill="url(#penGrad)"/>
              <polygon points="12,78 18,84 10,88" fill="#38bdf8"/>
              
              {/* AI Robotic / Futuristic Hand Asset Overlay */}
              <path d="M 25 15 C 35 10, 48 20, 42 35 C 50 40, 45 55, 32 50 Z" fill="#475569" opacity="0.9" />
              <path d="M 28 18 Q 40 22 36 36" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
              <circle cx="34" cy="26" r="3" fill="#38bdf8" />
              
              <defs>
                <linearGradient id="penGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Bottom Slide Indicators */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>AI Stroke Progress: <strong className="text-slate-200">{Math.round(progress * 100)}%</strong></span>
          </div>

          <div className="flex items-center space-x-3">
            {vectors.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveVectorIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  activeVectorIndex === idx ? 'bg-cyan-400 w-6' : 'bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
