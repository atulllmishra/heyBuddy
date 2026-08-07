import React from 'react';

export default function AnalyticsDashboard({ user }) {
  const currentUser = user || {
    name: 'Atul Kumar Mishra',
    academicStream: 'STEM & Physics',
    rigorLevel: 'College / Undergrad',
    savedLectures: 4,
    streakDays: 5
  };

  return (
    <div style={{ padding: '0.5rem 0' }}>
      <div style={{ background: 'var(--yt-bg-card)', border: '1px solid var(--yt-border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div className="yt-avatar" style={{ width: '56px', height: '56px', fontSize: '1.5rem' }}>
            {currentUser.name ? currentUser.name[0].toUpperCase() : 'A'}
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, color: 'var(--yt-text-primary)' }}>
              {currentUser.name}'s Learning Dashboard
            </h1>
            <div style={{ fontSize: '0.85rem', color: 'var(--yt-text-secondary)' }}>
              Target Stream: <strong style={{ color: 'var(--yt-blue)' }}>{currentUser.academicStream}</strong> • Rigor: <strong>{currentUser.rigorLevel}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
          <div style={{ background: '#121212', border: '1px solid var(--yt-border)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--yt-text-secondary)' }}>🔥 Masterclass Streak</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>{currentUser.streakDays || 5} Days</div>
          </div>

          <div style={{ background: '#121212', border: '1px solid var(--yt-border)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--yt-text-secondary)' }}>📚 Saved Masterclasses</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#3ea6ff', marginTop: '4px' }}>{currentUser.savedLectures || 4} Courses</div>
          </div>

          <div style={{ background: '#121212', border: '1px solid var(--yt-border)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--yt-text-secondary)' }}>🎯 Quiz Accuracy Rate</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>94.2%</div>
          </div>

          <div style={{ background: '#121212', border: '1px solid var(--yt-border)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--yt-text-secondary)' }}>🧠 Open Data Citations Ingested</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#818cf8', marginTop: '4px' }}>1,480 Docs</div>
          </div>
        </div>
      </div>

      {/* Recommended Topics based on Choices */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.85rem', color: 'var(--yt-text-primary)' }}>
        Recommended for your Stream ({currentUser.academicStream})
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
        <div style={{ background: 'var(--yt-bg-card)', border: '1px solid var(--yt-border)', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--yt-text-primary)', marginBottom: '4px' }}>Thermodynamics & Carnot Engine</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--yt-text-secondary)' }}>OpenStax Physics • Entropy Derivation</div>
        </div>

        <div style={{ background: 'var(--yt-bg-card)', border: '1px solid var(--yt-border)', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--yt-text-primary)', marginBottom: '4px' }}>Maxwell's Equations & Vector Calculus</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--yt-text-secondary)' }}>LibreTexts OER • Electromagnetism</div>
        </div>

        <div style={{ background: 'var(--yt-bg-card)', border: '1px solid var(--yt-border)', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--yt-text-primary)', marginBottom: '4px' }}>Organic Reaction Mechanisms</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--yt-text-secondary)' }}>Wikidata SPARQL • Nucleophilic Substitution</div>
        </div>
      </div>
    </div>
  );
}
