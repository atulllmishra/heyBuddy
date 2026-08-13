import React, { useEffect } from 'react';
import { useAppStore } from '../store/zustand';
import { Loader2, CheckCircle2, AlertCircle, Video, Music, PenTool, Sparkles, Layers } from 'lucide-react';

export default function PipelineMonitor() {
  const { activeTaskId, taskStatus, setTaskStatus } = useAppStore();

  useEffect(() => {
    if (!activeTaskId) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/tasks/${activeTaskId}`);
        if (response.ok) {
          const data = await response.json();
          setTaskStatus(data);
          if (data.status === 'COMPLETED' || data.status === 'FAILED') {
            clearInterval(pollInterval);
          }
        }
      } catch (err) {
        console.error('Task poll error:', err);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [activeTaskId, setTaskStatus]);

  if (!taskStatus) return null;

  const PIPELINE_STEPS = [
    { id: 'PENDING', label: '1. Request Received', icon: Sparkles },
    { id: 'SCRIPT_GENERATING', label: '2. LLM Script & LaTeX', icon: Layers },
    { id: 'AUDIO_SYNTHESIS', label: '3. ElevenLabs TTS', icon: Music },
    { id: 'WHITEBOARD_STREAMS_GENERATING', label: '4. SVG Whiteboard', icon: PenTool },
    { id: 'HIGGSFIELD_VIDEO_COMPILING', label: '5. Higgsfield AI Video', icon: Video },
    { id: 'COMPLETED', label: '6. Master Manifest Ready', icon: CheckCircle2 }
  ];

  const currentStepIndex = PIPELINE_STEPS.findIndex((s) => s.id === taskStatus.status);

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              Async Media Orchestration Pipeline
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono">
                {taskStatus.progress_percentage}% Complete
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {taskStatus.current_step_description}
            </p>
          </div>
        </div>

        {taskStatus.manifest_url && (
          <a
            href={taskStatus.manifest_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-1"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Open Rendered Video Payload</span>
          </a>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-2 mb-6 overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 h-full transition-all duration-500 ease-out"
          style={{ width: `${taskStatus.progress_percentage}%` }}
        />
      </div>

      {/* Pipeline Steps Tracker */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {PIPELINE_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = currentStepIndex > idx || taskStatus.status === 'COMPLETED';
          const isCurrent = currentStepIndex === idx && taskStatus.status !== 'COMPLETED';

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border text-center transition-all ${
                isDone
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : isCurrent
                  ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300 shadow-md shadow-cyan-500/10 animate-pulse'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}
            >
              <Icon className={`w-4 h-4 mx-auto mb-1.5 ${isDone ? 'text-emerald-400' : isCurrent ? 'text-cyan-400 animate-bounce' : 'text-slate-600'}`} />
              <div className="text-[11px] font-medium line-clamp-1">{step.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
