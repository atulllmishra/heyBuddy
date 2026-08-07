import React, { useState, useEffect } from 'react';

export default function SettingsModal({ isOpen, onClose, onSaveApiKeys }) {
  const [gemini, setGemini] = useState('');
  const [sarvam, setSarvam] = useState('');
  const [openai, setOpenai] = useState('');
  const [elevenlabs, setElevenlabs] = useState('');
  const [deepl, setDeepl] = useState('');
  const [heygen, setHeygen] = useState('');

  useEffect(() => {
    setGemini(localStorage.getItem('heybuddy_gemini_key') || '');
    setSarvam(localStorage.getItem('heybuddy_sarvam_key') || '');
    setOpenai(localStorage.getItem('heybuddy_openai_key') || '');
    setElevenlabs(localStorage.getItem('heybuddy_elevenlabs_key') || '');
    setDeepl(localStorage.getItem('heybuddy_deepl_key') || '');
    setHeygen(localStorage.getItem('heybuddy_heygen_key') || '');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveApiKeys({ gemini, sarvam, openai, elevenlabs, deepl, heygen });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--yt-text-primary)' }}>
            ⚙️ Platform API Settings & Credentials
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--yt-text-secondary)', fontSize: '1.2rem', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--yt-text-secondary)', marginBottom: '1rem' }}>
          Your keys are securely stored locally in your browser session. If left blank, server-side defaults will be used.
        </p>

        <form onSubmit={handleSave}>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--yt-text-secondary)', display: 'block', marginBottom: '4px' }}>Google Gemini API Key:</label>
            <input type="password" value={gemini} onChange={(e) => setGemini(e.target.value)} placeholder="AQ.Ab8RN6J5oGYsP22gsFs..." className="auth-input" />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--yt-text-secondary)', display: 'block', marginBottom: '4px' }}>OpenAI API Key (GPT-4o Engine):</label>
            <input type="password" value={openai} onChange={(e) => setOpenai(e.target.value)} placeholder="sk-proj-..." className="auth-input" />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--yt-text-secondary)', display: 'block', marginBottom: '4px' }}>Sarvam AI API Key (bulbul:v3 Hindi TTS):</label>
            <input type="password" value={sarvam} onChange={(e) => setSarvam(e.target.value)} placeholder="sk_8uzsnjso_..." className="auth-input" />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--yt-text-secondary)', display: 'block', marginBottom: '4px' }}>ElevenLabs API Key (Neural Voice AI):</label>
            <input type="password" value={elevenlabs} onChange={(e) => setElevenlabs(e.target.value)} placeholder="d1a3a41c0b206073b..." className="auth-input" />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--yt-text-secondary)', display: 'block', marginBottom: '4px' }}>HeyGen API Key (Virtual Teacher Video):</label>
            <input type="password" value={heygen} onChange={(e) => setHeygen(e.target.value)} placeholder="sk_V2_hgu_..." className="auth-input" />
          </div>

          <button type="submit" className="auth-btn-primary" style={{ marginTop: '0.5rem' }}>
            Save Credentials & Close
          </button>
        </form>
      </div>
    </div>
  );
}
