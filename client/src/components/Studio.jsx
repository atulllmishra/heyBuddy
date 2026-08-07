import React, { useState } from 'react';

const DOMAIN_STREAMS = [
  { id: 'STEM / Physical Sciences', label: 'STEM & Physics', icon: '⚛️' },
  { id: 'Computer Science & AI', label: 'Computer Science & AI', icon: '💻' },
  { id: 'Medical & Life Sciences', label: 'Medical & Life Sciences', icon: '🧬' },
  { id: 'Commerce & Economics', label: 'Commerce & Economics', icon: '📈' },
  { id: 'Humanities & Social Sciences', label: 'Humanities & Social Sciences', icon: '📜' }
];

const ADAPTIVE_LEVELS = [
  { id: 'School Level', label: 'Easy School Level (Grades 1-8)' },
  { id: 'High School', label: 'High School / AP (Grades 9-12)' },
  { id: 'College / Undergrad', label: 'College / Undergrad (B.Sc/B.Tech)' },
  { id: 'Masters / Post-Grad', label: 'Masters / Post-Grad (M.Sc/M.Tech)' },
  { id: 'PhD / Fellowship', label: 'Fellowship & PhD Level (Research & Proofs)' }
];

export default function Studio({ onGenerate, loading }) {
  const [topic, setTopic] = useState('');
  const [gradeLevel, setGradeLevel] = useState('High School');
  const [streamDomain, setStreamDomain] = useState('STEM / Physical Sciences');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onGenerate({
      topic,
      gradeLevel,
      streamDomain
    });
  };

  const handlePresetClick = (presetTopic, presetDomain = 'STEM / Physical Sciences') => {
    setTopic(presetTopic);
    setStreamDomain(presetDomain);
    onGenerate({
      topic: presetTopic,
      gradeLevel,
      streamDomain: presetDomain
    });
  };

  return (
    <div className="studio-card" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', boxShadow: 'var(--shadow-md)', padding: '1.75rem' }}>
      <div className="badge-mono" style={{ background: 'rgba(99,102,241,0.14)', color: '#818cf8', borderColor: 'rgba(99,102,241,0.3)', marginBottom: '1.25rem' }}>
        <i className="fa-solid fa-wand-magic-sparkles"></i> SINGLE-SCENE HINGLISH AI MASTERCLASS
      </div>
      
      <h1 className="studio-title" style={{ background: 'linear-gradient(135deg, #f8fafc 30%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '2rem' }}>
        Learn Any Subject in Conversational Hinglish (Hindi + English)
      </h1>
      
      <p className="studio-subtitle" style={{ fontSize: '0.92rem' }}>
        Single unified content-packed masterclass scene powered by <strong>OpenStax • Gutenberg • Internet Archive • LibreTexts • Wikidata SPARQL • Wolfram Alpha • YouTube • StackExchange</strong>.
      </p>

      <form onSubmit={handleSubmit} className="prompt-form">
        {/* Main Prompt Input Box */}
        <div className="search-box" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)' }}>
          <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--accent-indigo)', marginRight: '0.75rem' }}></i>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Photosynthesis, Newton's 3 Laws, Quantum Entanglement, Machine Learning Transformers..."
            required
          />
          <button type="submit" className="btn-black" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderColor: 'transparent' }} disabled={loading}>
            {loading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i> Generating Hinglish Masterclass...
              </>
            ) : (
              <>
                <i className="fa-solid fa-play"></i> Generate Hinglish Masterclass
              </>
            )}
          </button>
        </div>

        {/* Stream Domain Selection */}
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '0.2rem' }}>Stream Domain:</span>
          {DOMAIN_STREAMS.map((domain) => (
            <button
              key={domain.id}
              type="button"
              className={`method-pill ${streamDomain === domain.id ? 'active' : ''}`}
              style={{ fontSize: '0.78rem', padding: '0.35rem 0.8rem' }}
              onClick={() => setStreamDomain(domain.id)}
            >
              <span>{domain.icon}</span> {domain.label}
            </button>
          ))}
        </div>

        {/* Adaptive Options Grid */}
        <div className="controls-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginTop: '0.75rem' }}>
          <div className="control-item">
            <label><i className="fa-solid fa-graduation-cap"></i> Academic Level:</label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="select-mono"
            >
              {ADAPTIVE_LEVELS.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>{lvl.label}</option>
              ))}
            </select>
          </div>

          <div className="control-item">
            <label><i className="fa-solid fa-language"></i> Primary Teaching Language:</label>
            <div className="select-mono" style={{ display: 'flex', alignItems: 'center', background: 'rgba(99,102,241,0.1)', color: '#818cf8', fontWeight: 600, fontSize: '0.82rem' }}>
              🗣️ Hinglish (Hindi + English EdTech Style)
            </div>
          </div>
        </div>

        {/* Preset Badges & Data Sources */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'center', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Trending Lectures:</span>
            <button type="button" className="method-pill" onClick={() => handlePresetClick("Photosynthesis & Light Reactions", "Medical & Life Sciences")}>🌱 Photosynthesis</button>
            <button type="button" className="method-pill" onClick={() => handlePresetClick("Newton's Three Laws of Motion", "STEM / Physical Sciences")}>🚀 Newton's Laws</button>
            <button type="button" className="method-pill" onClick={() => handlePresetClick("Quantum Entanglement & Superposition", "STEM / Physical Sciences")}>⚛️ Quantum Entanglement</button>
            <button type="button" className="method-pill" onClick={() => handlePresetClick("Neural Networks & Deep Learning Transformers", "Computer Science & AI")}>🤖 AI Transformers</button>
          </div>

          {/* Integrated Academic Sources Indicator */}
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', gap: '10px', opacity: 0.9, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span><i className="fa-solid fa-book-open-reader" style={{ color: '#38bdf8' }}></i> OpenStax (Rice)</span>
            <span><i className="fa-solid fa-landmark" style={{ color: '#6366f1' }}></i> Project Gutenberg & Archive</span>
            <span><i className="fa-solid fa-graduation-cap" style={{ color: '#10b981' }}></i> LibreTexts OER</span>
            <span><i className="fa-solid fa-diagram-project" style={{ color: '#f59e0b' }}></i> Wikidata SPARQL</span>
            <span><i className="fa-solid fa-calculator" style={{ color: '#ec4899' }}></i> Wolfram Alpha API</span>
            <span><i className="fa-brands fa-youtube" style={{ color: '#ef4444' }}></i> YouTube Transcripts</span>
            <span><i className="fa-stack-overflow" style={{ color: '#f97316' }}></i> Stack Exchange Q&A</span>
          </div>
        </div>
      </form>
    </div>
  );
}
