import React, { useState } from 'react';

export default function QuizTab({ quizItems = [] }) {
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);

  const handleSelectOption = (qIdx, oIdx, correctIdx) => {
    if (userAnswers[qIdx] !== undefined) return;

    setUserAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
    if (oIdx === correctIdx) {
      setScore(prev => prev + 1);
    }
  };

  if (!quizItems.length) {
    return <p style={{ color: 'var(--text-muted)' }}>No quiz questions available.</p>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Test Your Knowledge</h3>
        <span className="badge-mono" style={{ margin: 0 }}>Score: {score} / {quizItems.length}</span>
      </div>

      {quizItems.map((q, qIdx) => {
        const answered = userAnswers[qIdx] !== undefined;
        const selected = userAnswers[qIdx];

        return (
          <div key={qIdx} className="quiz-card">
            <div className="quiz-q">{qIdx + 1}. {q.question}</div>
            <div>
              {q.options.map((opt, oIdx) => {
                let btnClass = 'quiz-btn';
                if (answered) {
                  if (oIdx === q.correctIndex) btnClass += ' correct';
                  else if (oIdx === selected && selected !== q.correctIndex) btnClass += ' wrong';
                }

                return (
                  <button
                    key={oIdx}
                    className={btnClass}
                    onClick={() => handleSelectOption(qIdx, oIdx, q.correctIndex)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {answered && (
              <div style={{ marginTop: '0.6rem', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-surface)', padding: '0.5rem', borderRadius: '4px' }}>
                <strong>Explanation:</strong> {q.explanation}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
