import React, { useState } from 'react';

const METHODOLOGIES = [
  { id: 'Feynman', label: 'Feynman Technique', icon: '🧠' },
  { id: 'Socratic', label: 'Socratic Dialogue', icon: '💬' },
  { id: 'Analogy', label: 'Analogy & Metaphor', icon: '🎨' },
  { id: 'FirstPrinciples', label: 'First Principles', icon: '⚡' },
  { id: 'ELI5', label: 'Explain Like I\'m 5', icon: '🎈' }
];

const LANGUAGES = [
  'English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Arabic'
];

const STYLES = [
  { id: 'Minimalist', label: 'Minimalist Monochrome' },
  { id: 'Technical', label: 'Technical Blueprint' },
  { id: 'Chalkboard', label: 'Chalkboard Vector' },
  { id: 'DataFlow', label: 'Data Flow Neon' }
];

export default function Studio({ onGenerate, loading }) {
  const [topic, setTopic] = useState('');
  const [methodology, setMethodology] = useState('Feynman');
  const [language, setLanguage] = useState('English');
  const [style, setStyle] = useState('Minimalist');
  const [gradeLevel, setGradeLevel] = useState('High School');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onGenerate({ topic, methodology, language, style, gradeLevel });
  };

  const handlePresetClick = (presetTopic) => {
    setTopic(presetTopic);
    onGenerate({ topic: presetTopic, methodology, language, style, gradeLevel });
  };

  return (
    <div className="studio-card">
      <div className="badge-mono">
        <i className="fa-solid fa-wand-magic-sparkles"></i> AI CONCEPT VIDEO STUDIO
      </div>
      <h1 className="studio-title">Learn Any Concept in Seconds</h1>
      <p className="studio-subtitle">
        Enter any school or college topic. Select your preferred **Teaching Methodology**, **Language**, and **Visual Style**.
      </p>

      <form onSubmit={handleSubmit} className="prompt-form">
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--text-secondary)', marginRight: '0.75rem' }}></i>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. How does Photosynthesis work? or Explain Newton's 2nd Law"
            required
          />
          <button type="submit" className="btn-black" disabled={loading}>
            {loading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i> Generating...
              </>
            ) : (
              <>
                <i className="fa-solid fa-play"></i> Generate AI Video
              </>
            )}
          </button>
        </div>

        {/* Methodology Pills */}
        <div className="methodology-row">
          {METHODOLOGIES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`method-pill ${methodology === m.id ? 'active' : ''}`}
              onClick={() => setMethodology(m.id)}
            >
              <span>{m.icon}</span> {m.label}
            </button>
          ))}
        </div>

        {/* Customization Options Grid */}
        <div className="controls-grid">
          <div className="control-item">
            <label><i className="fa-solid fa-language"></i> Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="select-mono"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div className="control-item">
            <label><i className="fa-solid fa-paint-roller"></i> Visual Style:</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="select-mono"
            >
              {STYLES.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="control-item">
            <label><i className="fa-solid fa-graduation-cap"></i> Level:</label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="select-mono"
            >
              <option value="High School">High School (Grades 9-12)</option>
              <option value="Middle School">Middle School (Grades 6-8)</option>
              <option value="College">College / University</option>
              <option value="Advanced / Exam">Exam Preparation</option>
            </select>
          </div>
        </div>

        {/* Preset Badges */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Trending:</span>
          <button type="button" className="method-pill" onClick={() => handlePresetClick("Photosynthesis & Light Reactions")}>🌱 Photosynthesis</button>
          <button type="button" className="method-pill" onClick={() => handlePresetClick("Newton's Three Laws of Motion")}>🚀 Newton's Laws</button>
          <button type="button" className="method-pill" onClick={() => handlePresetClick("Quantum Entanglement & Superposition")}>⚛️ Quantum Entanglement</button>
        </div>
      </form>
    </div>
  );
}
