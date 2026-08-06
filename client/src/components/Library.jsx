import React, { useEffect, useState } from 'react';

export default function Library({ onSelectTopic }) {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetch('/api/topics/sample')
      .then(res => res.json())
      .then(data => setTopics(data))
      .catch(err => console.error('Failed to load courses', err));
  }, []);

  return (
    <div className="studio-card" style={{ textAlign: 'left' }}>
      <div className="badge-mono"><i className="fa-solid fa-compass"></i> FEATURED COURSES</div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Explore Pre-Generated Lessons</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Select any course to load its AI video script instantly.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
        {topics.map((t) => (
          <div
            key={t.id}
            className="scene-item"
            style={{ padding: '1.25rem', cursor: 'pointer' }}
            onClick={() => onSelectTopic(t.title)}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.2rem' }}>{t.title}</div>
            <span className="badge-mono" style={{ margin: 0, fontSize: '0.7rem' }}>{t.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
