import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config';

export default function DoubtChat({ topic, methodology, language, apiKey }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: `Hello! 👋 Ask me any questions or doubts about **${topic || 'this lesson'}**.` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize SpeechRecognition if browser supports it
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'Hindi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Try Chrome or Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput('');
      recognitionRef.current.start();
    }
  };

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
      <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Ask heyBuddy AI</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time contextual doubt solver</p>
        </div>
        {isListening && (
          <span style={{ fontSize: '0.72rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite' }}></span>
            Listening...
          </span>
        )}
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
        <button
          type="button"
          onClick={toggleVoiceInput}
          className={`ctrl-btn-mono ${isListening ? 'active' : ''}`}
          style={{ width: '38px', height: '38px', borderRadius: '50%', borderColor: isListening ? '#ef4444' : 'var(--border-color)', color: isListening ? '#ef4444' : 'var(--text-primary)' }}
          title="Voice Speech to Text Input"
        >
          <i className={`fa-solid ${isListening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? "Speak now..." : "Ask a doubt by typing or speaking..."}
          required
        />
        <button type="submit" className="btn-black" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: 'var(--accent-indigo)' }}>
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
}
