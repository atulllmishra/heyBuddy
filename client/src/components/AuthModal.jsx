import React, { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [academicStream, setAcademicStream] = useState('STEM & Physics');
  const [rigorLevel, setRigorLevel] = useState('College / Undergrad (B.Sc/B.Tech)');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in your email and password.');
      return;
    }

    const userData = {
      name: name || email.split('@')[0],
      email,
      academicStream,
      rigorLevel,
      avatarChar: (name || email)[0].toUpperCase(),
      savedLectures: 3,
      streakDays: 4
    };

    localStorage.setItem('heybuddy_user', JSON.stringify(userData));
    if (onLoginSuccess) onLoginSuccess(userData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: '#FF0000', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 800, fontSize: '0.75rem' }}>
              heyBuddy
            </span>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--yt-text-primary)' }}>
              {isSignUp ? 'Create your Account' : 'Sign in to heyBuddy AI'}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--yt-text-secondary)', fontSize: '1.2rem', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--yt-text-secondary)', marginBottom: '1.25rem' }}>
          {isSignUp
            ? 'Set your academic choices and preferences for customized AI Masterclasses.'
            : 'Sign in to access your saved masterclasses, watch history, and academic preferences.'}
        </p>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--yt-text-secondary)', display: 'block', marginBottom: '4px' }}>Full Name:</label>
              <input
                type="text"
                placeholder="e.g. Atul Kumar Mishra"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="auth-input"
                required
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--yt-text-secondary)', display: 'block', marginBottom: '4px' }}>Email Address:</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--yt-text-secondary)', display: 'block', marginBottom: '4px' }}>Password:</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
          </div>

          {isSignUp && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--yt-text-secondary)', display: 'block', marginBottom: '4px' }}>Academic Stream Choice:</label>
                <select
                  value={academicStream}
                  onChange={(e) => setAcademicStream(e.target.value)}
                  className="auth-input"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="STEM & Physics">STEM & Physics</option>
                  <option value="Computer Science & AI">Computer Science & AI</option>
                  <option value="Medical & Life Sciences">Medical & Life Sciences</option>
                  <option value="Commerce & Economics">Commerce & Economics</option>
                  <option value="Humanities & Social Sciences">Humanities & Social Sciences</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--yt-text-secondary)', display: 'block', marginBottom: '4px' }}>Preferred Rigor Level:</label>
                <select
                  value={rigorLevel}
                  onChange={(e) => setRigorLevel(e.target.value)}
                  className="auth-input"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="Easy School Level (Grades 1-8)">Easy School Level (Grades 1-8)</option>
                  <option value="High School / AP (Grades 9-12)">High School / AP (Grades 9-12)</option>
                  <option value="College / Undergrad (B.Sc/B.Tech)">College / Undergrad (B.Sc/B.Tech)</option>
                  <option value="Fellowship & PhD Level (Research)">Fellowship & PhD Level (Research)</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" className="auth-btn-primary">
            {isSignUp ? 'Create Account & Save Choices' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--yt-text-secondary)' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: 'none', border: 'none', color: 'var(--yt-blue)', fontWeight: 700, cursor: 'pointer' }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
