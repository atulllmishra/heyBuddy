import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, Award, RotateCcw } from 'lucide-react';

export default function QuizTab({ topic, currentScene, quizItems = [] }) {
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);

  // Default procedural questions if scene has no explicit items
  const questions = quizItems.length > 0 ? quizItems : [
    {
      question: `What is the primary objective of studying ${topic || 'this concept'}?`,
      options: [
        'To observe energy transfer and balance principles',
        'To increase systemic entropy without bound',
        'To eliminate initial condition variables',
        'To bypass physical conservation laws'
      ],
      correctIndex: 0,
      explanation: 'Core physical and biological systems operate on principles of energy conservation and equilibrium.'
    },
    {
      question: `In ${currentScene?.title || 'this scene'}, what role does the key mechanism play?`,
      options: [
        'Acts as a passive bystander',
        'Drives the primary transformation process',
        'Inhibits all secondary reactions',
        'Causes irreversible structural collapse'
      ],
      correctIndex: 1,
      explanation: 'The central mechanism regulates energy/information throughput within the model.'
    }
  ];

  const handleSelectOption = (qIdx, oIdx, correctIdx) => {
    if (userAnswers[qIdx] !== undefined) return;
    setUserAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
    if (oIdx === correctIdx) {
      setScore(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setScore(0);
  };

  return (
    <div className="space-y-4">
      {/* Quiz Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-purple-400" /> Comprehension Check
          </h3>
          <p className="text-[11px] text-slate-400">Evaluate your understanding of the scene</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
            Score: {score} / {questions.length}
          </span>
          {Object.keys(userAnswers).length > 0 && (
            <button
              onClick={handleReset}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset Quiz"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, qIdx) => {
          const answered = userAnswers[qIdx] !== undefined;
          const selected = userAnswers[qIdx];

          return (
            <div key={qIdx} className="glass-card p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white leading-relaxed">
                {qIdx + 1}. {q.question}
              </h4>

              <div className="space-y-2">
                {q.options.map((opt, oIdx) => {
                  let btnStyle = 'glass-panel text-slate-300 hover:bg-slate-800 border-slate-800';
                  if (answered) {
                    if (oIdx === q.correctIndex) {
                      btnStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-semibold';
                    } else if (oIdx === selected && selected !== q.correctIndex) {
                      btnStyle = 'bg-red-500/20 text-red-300 border-red-500/50 font-semibold';
                    } else {
                      btnStyle = 'opacity-50 border-slate-800';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={answered}
                      onClick={() => handleSelectOption(qIdx, oIdx, q.correctIndex)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {answered && oIdx === q.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {answered && oIdx === selected && selected !== q.correctIndex && (
                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <span className="font-bold text-indigo-400">Explanation:</span> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
