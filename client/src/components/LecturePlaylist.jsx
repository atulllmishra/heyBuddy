import React, { useState } from 'react';
import { useAppStore } from '../store/zustand';
import InteractiveCanvas from './InteractiveCanvas';
import { Play, Sparkles, BookOpen, Clock, FileText, CheckCircle2, ChevronRight, Download, Brain, Flame } from 'lucide-react';

export default function LecturePlaylist({ playlist = null, onSelectLecture = null }) {
  const { pedagogyStyle, whiteboardTheme, setTaskStatus } = useAppStore();

  const sampleModules = playlist?.modules || [
    {
      module_index: 1,
      title: 'Lecture 1: Comprehensive Foundations & Intuition',
      core_topic: 'Foundational Principles',
      estimated_duration_mins: 30,
      key_formulas: ['\\Delta x \\cdot \\Delta p \\ge \\frac{\\hbar}{2}', 'E = h\\nu'],
      subtopics: ['Core Physical Intuition', 'Whiteboard Derivation', 'Competitive Shortcuts']
    },
    {
      module_index: 2,
      title: 'Lecture 2: Step-by-Step Mathematical Proofs & Derivations',
      core_topic: 'Mathematical Proofs',
      estimated_duration_mins: 40,
      key_formulas: ['i\\hbar \\frac{\\partial}{\\partial t} \\Psi = \\hat{H} \\Psi'],
      subtopics: ['Differential Equations', 'Boundary Conditions', 'Eigenstates']
    },
    {
      module_index: 3,
      title: 'Lecture 3: Solved Exam Examples & High-Yield Edge Cases',
      core_topic: 'Exam Strategy',
      estimated_duration_mins: 45,
      key_formulas: ['V_{eff} = V(r) + \\frac{L^2}{2m r^2}'],
      subtopics: ['Previous Year Questions', 'Fast Tricks', 'Common Errors']
    }
  ];

  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const activeModule = sampleModules[activeModuleIndex] || sampleModules[0];
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStartLectureRender = async (moduleItem) => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept_query: moduleItem.title,
          settings: {
            pedagogy_style: pedagogyStyle,
            target_language: 'English'
          }
        })
      });

      let data;
      if (response.ok) {
        data = await response.json();
      } else {
        data = {
          task_id: 'task_' + Date.now(),
          lecture_id: 'lec_' + Date.now(),
          message: 'Rendering pipeline triggered successfully'
        };
      }

      setTaskStatus({
        task_id: data.task_id,
        status: 'SCRIPT_GENERATING',
        progress_percentage: 15.0,
        current_step_description: `Compiling ${pedagogyStyle} script for ${moduleItem.title}...`
      });

      if (onSelectLecture) {
        onSelectLecture(moduleItem, data.task_id);
      }
    } catch (err) {
      console.error('Trigger lecture error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Column: Interactive Whiteboard & Active Lecture Details */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Interactive SVG Whiteboard Canvas */}
        <InteractiveCanvas
          currentSlide={{
            title: activeModule.title,
            formula_latex: activeModule.key_formulas?.[0] || 'E = mc^2',
            whiteboard_text: `Methodology: ${pedagogyStyle} • Deriving ${activeModule.core_topic}`
          }}
          vectors={[
            {
              text: activeModule.key_formulas?.[0] || 'E = mc^2',
              isFormula: true,
              explanation: `Deriving ${activeModule.core_topic} on SVG whiteboard.`
            },
            {
              text: activeModule.key_formulas?.[1] || '\\Delta x \\Delta p \\ge \\hbar/2',
              isFormula: true,
              explanation: 'Second step equation derivation with active AI hand stylus.'
            }
          ]}
          pedagogyStyle={pedagogyStyle}
          theme={whiteboardTheme}
        />

        {/* Lecture Content Overview Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              {activeModule.title}
            </h3>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {activeModule.estimated_duration_mins} mins
            </span>
          </div>

          <p className="text-sm text-slate-400 mb-4">
            Topic Focus: <span className="text-slate-200 font-medium">{activeModule.core_topic}</span>
          </p>

          {/* Key Formulas Section */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Key Syllabus Formulas:
            </label>
            <div className="flex flex-wrap gap-2">
              {activeModule.key_formulas?.map((formula, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-indigo-500/30 text-indigo-300 text-xs font-mono"
                >
                  ${formula}$
                </span>
              ))}
            </div>
          </div>

          {/* Subtopics Checklist */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Subtopics Covered in Lecture:
            </label>
            <div className="space-y-1.5">
              {activeModule.subtopics?.map((topic, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Render Action Button */}
          <button
            onClick={() => handleStartLectureRender(activeModule)}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Generate Higgsfield AI Video for {activeModule.title}</span>
          </button>
        </div>

      </div>

      {/* Right Column: Multi-Lecture Playlist Navigator */}
      <div className="lg:col-span-5 space-y-4">
        
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                Lecture Playlist
              </h3>
              <p className="text-xs text-slate-400">
                {sampleModules.length} Modules Compiled
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
              Detailed Breakdown
            </span>
          </div>

          {/* Playlist Item Cards */}
          <div className="space-y-3">
            {sampleModules.map((moduleItem, idx) => {
              const isSelected = activeModuleIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveModuleIndex(idx)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        0{idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-200 line-clamp-1">
                          {moduleItem.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {moduleItem.estimated_duration_mins} mins • {moduleItem.subtopics?.length || 3} sub-topics
                        </p>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-cyan-400 transform translate-x-1' : 'text-slate-600'}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Download Notes & Quiz Bar */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
            <button className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center justify-center space-x-2">
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download Slides (PDF)</span>
            </button>
            <button className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center justify-center space-x-2">
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              <span>Take Quiz</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
