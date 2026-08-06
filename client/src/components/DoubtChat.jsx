import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

export default function DoubtChat({ topic, methodology, language, apiKey }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hello! 👋 Ask me any questions or doubts about **${topic || 'this lesson'}**.` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat/doubt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userText,
          topic,
          methodology,
          language,
          apiKey
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.answer || 'Thank you for your question!' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, failed to connect to AI tutor.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Ask heyBuddy AI</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time contextual doubt solver</p>
      </div>

      <div className="chat-list" style={{ flex: 1, overflowY: 'auto' }}>
        {messages.map((m, idx) => (
          <div key={idx} className={`msg-bubble ${m.role}`}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="msg-bubble ai">
            <i className="fa-solid fa-circle-notch fa-spin"></i> Analyzing your doubt...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="chat-input-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          required
        />
        <button type="submit" className="btn-black" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
}
