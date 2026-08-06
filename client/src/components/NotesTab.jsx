import React from 'react';

export default function NotesTab({ topic, notesItems = [], scenes = [] }) {

  const handleExportNotes = () => {
    let md = `# heyBuddy Study Notes\nTopic: ${topic || 'Lesson'}\n\n`;
    notesItems.forEach(n => {
      md += `## ${n.title}\n${n.content}\n\n`;
    });

    md += `## Scene Breakdown & Bullet Points\n`;
    scenes.forEach((s, idx) => {
      md += `### Scene ${idx + 1}: ${s.title}\n`;
      (s.bullets || []).forEach(b => md += `- ${b}\n`);
      md += `\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(topic || 'lesson').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Smart Notes</h3>
        <button className="btn-black" style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem' }} onClick={handleExportNotes}>
          <i className="fa-solid fa-file-arrow-down"></i> Export Markdown
        </button>
      </div>

      {!notesItems.length ? (
        <p style={{ color: 'var(--text-muted)' }}>No study notes for this lesson.</p>
      ) : (
        notesItems.map((n, idx) => (
          <div key={idx} className="quiz-card" style={{ borderLeft: '3px solid var(--text-primary)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.3rem' }}>{n.title}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{n.content}</div>
          </div>
        ))
      )}
    </div>
  );
}
