import React, { useState, useEffect } from 'react';

export const AVATARS = [
  { id: 'maya', name: 'Dr. Maya', title: 'STEM Specialist', outfitColor: '#6366F1', glasses: true },
  { id: 'alex', name: 'Alex Tech', title: 'Physics & Code Lead', outfitColor: '#10B981', headset: true },
  { id: 'oak', name: 'Prof. Oak', title: 'Master Storyteller', outfitColor: '#F59E0B', coat: true }
];

export default function AIAvatarPresenter({
  isPlaying,
  currentAvatarId = 'maya',
  onSelectAvatar,
  compact = false
}) {
  const [mouthOpen, setMouthOpen] = useState(0); // 0 (closed) to 1 (wide)
  const [blinking, setBlinking] = useState(false);
  const [headTilt, setHeadTilt] = useState(0);

  const activeAvatar = AVATARS.find(a => a.id === currentAvatarId) || AVATARS[0];

  // Lip sync animation simulation when TTS is playing
  useEffect(() => {
    if (!isPlaying) {
      setMouthOpen(0);
      setHeadTilt(0);
      return;
    }

    const interval = setInterval(() => {
      // Randomize mouth opening to simulate speech phonemes
      setMouthOpen(Math.random() * 0.8 + 0.2);
      setHeadTilt((Math.random() - 0.5) * 4); // Slight head movements
    }, 140);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Periodic blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 160);
    }, 3500);

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div className={`avatar-container ${compact ? 'compact' : ''}`}>
      <div className="avatar-header">
        <div className="avatar-badge">
          <span className={`live-dot ${isPlaying ? 'speaking' : ''}`}></span>
          AI TEACHER AVATAR
        </div>
        {!compact && (
          <select
            value={activeAvatar.id}
            onChange={(e) => onSelectAvatar && onSelectAvatar(e.target.value)}
            className="avatar-select"
          >
            {AVATARS.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.title})</option>
            ))}
          </select>
        )}
      </div>

      <div className="avatar-stage">
        <svg
          viewBox="0 0 200 220"
          className="avatar-svg"
          style={{ transform: `rotate(${headTilt}deg)`, transition: 'transform 0.2s ease-out' }}
        >
          <defs>
            <radialGradient id="avatarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={activeAvatar.outfitColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>
            <linearGradient id="shirtGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={activeAvatar.outfitColor} />
              <stop offset="100%" stopColor="#1E1B4B" />
            </linearGradient>
          </defs>

          {/* Background Aura Glow */}
          <circle cx="100" cy="110" r="90" fill="url(#avatarGlow)" />

          {/* Torso / Outfit */}
          <path
            d="M 40 210 Q 100 145 160 210 Z"
            fill="url(#shirtGrad)"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.3"
          />

          {/* Neck */}
          <rect x="88" y="130" width="24" height="25" rx="6" fill="#FCE7F3" />

          {/* Head Base */}
          <ellipse cx="100" cy="95" rx="42" ry="48" fill="#FEF08A" stroke="#EAB308" strokeWidth="1.5" />

          {/* Hair Styling according to avatar */}
          {activeAvatar.id === 'maya' && (
            <path d="M 58 85 Q 100 35 142 85 Q 150 120 145 140 Q 138 95 100 65 Q 62 95 55 140 Z" fill="#312E81" />
          )}
          {activeAvatar.id === 'alex' && (
            <path d="M 58 80 Q 100 45 142 80 Q 148 60 100 50 Q 52 60 58 80 Z" fill="#065F46" />
          )}
          {activeAvatar.id === 'oak' && (
            <path d="M 55 85 Q 100 40 145 85 Q 150 70 100 55 Q 50 70 55 85 Z" fill="#78350F" />
          )}

          {/* Eyes */}
          {blinking ? (
            <>
              <line x1="75" y1="90" x2="90" y2="90" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
              <line x1="110" y1="90" x2="125" y2="90" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Left Eye */}
              <ellipse cx="82.5" cy="90" rx="6" ry="7" fill="#FFFFFF" />
              <circle cx="82.5" cy="90" r="3.5" fill="#0F172A" />
              <circle cx="84" cy="88.5" r="1.2" fill="#FFFFFF" />

              {/* Right Eye */}
              <ellipse cx="117.5" cy="90" rx="6" ry="7" fill="#FFFFFF" />
              <circle cx="117.5" cy="90" r="3.5" fill="#0F172A" />
              <circle cx="119" cy="88.5" r="1.2" fill="#FFFFFF" />
            </>
          )}

          {/* Eyebrows */}
          <path d="M 75 79 Q 82.5 75 90 79" stroke="#475569" strokeWidth="2" fill="none" />
          <path d="M 110 79 Q 117.5 75 125 79" stroke="#475569" strokeWidth="2" fill="none" />

          {/* Glasses for Dr. Maya */}
          {activeAvatar.glasses && (
            <g stroke="#6366F1" strokeWidth="2" fill="none">
              <rect x="73" y="82" width="19" height="15" rx="3" fill="rgba(99,102,241,0.1)" />
              <rect x="108" y="82" width="19" height="15" rx="3" fill="rgba(99,102,241,0.1)" />
              <line x1="92" y1="89" x2="108" y2="89" />
            </g>
          )}

          {/* Headset for Alex */}
          {activeAvatar.headset && (
            <g stroke="#10B981" strokeWidth="2.5" fill="none">
              <path d="M 58 90 Q 100 35 142 90" strokeWidth="3" />
              <rect x="53" y="84" width="8" height="18" rx="3" fill="#10B981" />
              <rect x="139" y="84" width="8" height="18" rx="3" fill="#10B981" />
              <path d="M 61 95 Q 75 118 90 115" stroke="#10B981" strokeWidth="1.5" />
              <circle cx="90" cy="115" r="2.5" fill="#10B981" />
            </g>
          )}

          {/* Nose */}
          <path d="M 100 95 L 97 106 L 103 106" stroke="#CA8A04" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* Animated Lip Sync Mouth */}
          <g transform="translate(100, 120)">
            {mouthOpen < 0.1 ? (
              // Closed Smile
              <path d="M -12 -1 Q 0 6 12 -1" stroke="#991B1B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            ) : (
              // Open Mouth while Speaking
              <path
                d={`M -12 0 Q 0 ${12 * mouthOpen} 12 0 Q 0 ${-4 * mouthOpen} -12 0 Z`}
                fill="#991B1B"
                stroke="#7F1D1D"
                strokeWidth="1.5"
              />
            )}
            {/* Teeth highlight when mouth is wide */}
            {mouthOpen > 0.4 && (
              <rect x="-6" y="0" width="12" height="2.5" rx="1" fill="#FFFFFF" opacity="0.9" />
            )}
          </g>
        </svg>
      </div>

      <div className="avatar-footer">
        <div className="avatar-info">
          <span className="avatar-name">{activeAvatar.name}</span>
          <span className="avatar-role">{activeAvatar.title}</span>
        </div>
        <div className="avatar-status">
          {isPlaying ? (
            <span className="speaking-wave">
              <span></span><span></span><span></span>
            </span>
          ) : (
            <span className="idle-tag">Ready</span>
          )}
        </div>
      </div>
    </div>
  );
}
