import React, { useState } from 'react';
import { FileText, Download, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function NotesTab({ topic, currentScene, notesItems = [], scenes = [] }) {
  const [customNotes, setCustomNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const noteObj = {
      id: Date.now(),
      sceneTitle: currentScene?.title || 'General Note',
      content: newNoteText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setCustomNotes(prev => [noteObj, ...prev]);
    setNewNoteText('');
  };

  const handleDeleteNote = (id) => {
    setCustomNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleExportNotes = () => {
    let md = `# heyBuddy Masterclass Study Notes\n**Topic:** ${topic || 'Lesson'}\n**Export Date:** ${new Date().toLocaleDateString()}\n\n`;

    if (customNotes.length > 0) {
      md += `## Personal Study Notes\n`;
      customNotes.forEach(n => {
        md += `- [${n.timestamp}] **${n.sceneTitle}**: ${n.content}\n`;
      });
      md += `\n`;
    }

    if (currentScene?.bullets) {
      md += `## Key Scene Highlights (${currentScene.title})\n`;
      currentScene.bullets.forEach(b => {
        md += `- ${b}\n`;
      });
      md += `\n`;
    }

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(topic || 'lesson').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Notes Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-400" /> Smart Study Notes
          </h3>
          <p className="text-[11px] text-slate-400">Timestamped notes & scene takeaways</p>
        </div>

        <button
          onClick={handleExportNotes}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-semibold transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Export MD
        </button>
      </div>

      {/* Add New Note Input */}
      <form onSubmit={handleAddNote} className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={`Add note for ${currentScene?.title || 'current scene'}...`}
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            className="flex-1 px-3.5 py-2.5 rounded-xl glass-input text-white text-xs placeholder-slate-500"
          />
          <button
            type="submit"
            className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </form>

      {/* Key Scene Bullets */}
      {currentScene?.bullets && (
        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Scene Key Takeaways
          </h4>
          <ul className="space-y-1.5">
            {currentScene.bullets.map((b, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* User Notes List */}
      <div className="space-y-2">
        {customNotes.map((note) => (
          <div key={note.id} className="glass-panel p-3 rounded-xl border border-slate-800 flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="font-semibold text-emerald-400">{note.sceneTitle}</span>
                <span>• {note.timestamp}</span>
              </div>
              <p className="text-xs text-slate-200">{note.content}</p>
            </div>

            <button
              onClick={() => handleDeleteNote(note.id)}
              className="p-1 text-slate-500 hover:text-red-400 transition-colors"
              title="Delete note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
