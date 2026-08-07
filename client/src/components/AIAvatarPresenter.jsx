import React, { useState, useEffect } from 'react';

export const AVATARS = [
  // Female Avatars
  { id: 'maya', name: 'Dr. Maya Sharma', gender: 'female', title: 'STEM & AI Lead', outfitColor: '#6366F1', glasses: true, hairColor: '#312E81', skinTone: ['#FED7AA', '#FDBA74'] },
  { id: 'priya', name: 'Dr. Priya Nair', gender: 'female', title: 'Medical & Life Sciences Director', outfitColor: '#EC4899', bindi: true, hairColor: '#111827', skinTone: ['#FDE047', '#EAB308'] },
  { id: 'elena', name: 'Prof. Elena Vance', gender: 'female', title: 'Computer Science & Algorithms Chair', outfitColor: '#06B6D4', glasses: true, hairColor: '#0F172A', skinTone: ['#FFEDD5', '#FDBA74'] },
  { id: 'sophia', name: 'Dr. Sophia Dubois', gender: 'female', title: 'Humanities & Social Sciences Dean', outfitColor: '#8B5CF6', hairColor: '#4C1D95', skinTone: ['#FEF08A', '#F59E0B'] },
  
  // Male Avatars
  { id: 'alex', name: 'Alex Mercer', gender: 'male', title: 'Physics & Code Specialist', outfitColor: '#10B981', headset: true, hairColor: '#065F46', skinTone: ['#FDE68A', '#F59E0B'] },
  { id: 'oak', name: 'Prof. Arthur Oak', gender: 'male', title: 'Fellowship & Literature Chair', outfitColor: '#F59E0B', coat: true, hairColor: '#78350F', skinTone: ['#FFEDD5', '#FDBA74'] },
  { id: 'marcus', name: 'Dr. Marcus Vance', gender: 'male', title: 'Astrophysics & Mathematics Lead', outfitColor: '#3B82F6', headset: true, hairColor: '#1E293B', skinTone: ['#FED7AA', '#FDBA74'] },
  { id: 'viktor', name: 'Prof. Viktor Krum', gender: 'male', title: 'Quantum Mechanics Scholar', outfitColor: '#EF4444', hairColor: '#451A03', skinTone: ['#FDE047', '#D97706'] }
];

export default function AIAvatarPresenter({
  isPlaying,
  currentAvatarId = 'maya',
  onSelectAvatar,
  selectedGender = 'all',
  compact = false
}) {
  const [mouthOpen, setMouthOpen] = useState(0); // 0 (closed) to 1 (wide)
  const [blinking, setBlinking] = useState(false);
  const [headTilt, setHeadTilt] = useState(0);

  const filteredAvatars = selectedGender === 'all'
    ? AVATARS
    : AVATARS.filter(a => a.gender === selectedGender);

  const activeAvatar = AVATARS.find(a => a.id === currentAvatarId) || filteredAvatars[0] || AVATARS[0];

  // Lip sync animation simulation when TTS is playing
  useEffect(() => {
    if (!isPlaying) {
      setMouthOpen(0);
      setHeadTilt(0);
      return;
    }

    const interval = setInterval(() => {
      // Randomize mouth opening to simulate speech phonemes
      setMouthOpen(Math.random() * 0.7 + 0.25);
      setHeadTilt((Math.random() - 0.5) * 3); // Subtle head tilt
    }, 130);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Periodic blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    }, 3600);

    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <div className={`avatar-container ${compact ? 'compact' : ''}`}>
      <div className="avatar-header">
        <div className="avatar-badge" style={{ color: activeAvatar.outfitColor }}>
          <span className={`live-dot ${isPlaying ? 'speaking' : ''}`} style={{ backgroundColor: isPlaying ? '#10b981' : activeAvatar.outfitColor }}></span>
          {activeAvatar.gender === 'female' ? '👩 FEMALE' : '👨 MALE'} AI TEACHER AVATAR
        </div>
        {!compact && (
          <select
            value={activeAvatar.id}
            onChange={(e) => onSelectAvatar && onSelectAvatar(e.target.value)}
            className="avatar-select"
          >
            {filteredAvatars.map(a => (
              <option key={a.id} value={a.id}>
                {a.gender === 'female' ? '👩' : '👨'} {a.name} ({a.title})
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="avatar-stage">
        <svg
          viewBox="0 0 200 220"
          className="avatar-svg"
          style={{ transform: `rotate(${headTilt}deg)`, transition: 'transform 0.25s ease-out' }}
        >
          <defs>
            <radialGradient id={`avatarGlow_${activeAvatar.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={activeAvatar.outfitColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`skinGrad_${activeAvatar.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={activeAvatar.skinTone[0]} />
              <stop offset="100%" stopColor={activeAvatar.skinTone[1]} />
            </linearGradient>
            <linearGradient id={`shirtGrad_${activeAvatar.id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={activeAvatar.outfitColor} />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>

          {/* Background Ambient Aura Glow */}
          <circle cx="100" cy="110" r="90" fill={`url(#avatarGlow_${activeAvatar.id})`} />

          {/* Torso / Outfit */}
          <path
            d="M 35 210 Q 100 140 165 210 Z"
            fill={`url(#shirtGrad_${activeAvatar.id})`}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.5"
          />

          {/* Collar Line */}
          <path d="M 85 150 L 100 170 L 115 150" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />

          {/* Neck */}
          <rect x="88" y="128" width="24" height="26" rx="6" fill={`url(#skinGrad_${activeAvatar.id})`} />

          {/* Head Base */}
          <ellipse cx="100" cy="94" rx="42" ry="48" fill={`url(#skinGrad_${activeAvatar.id})`} stroke={activeAvatar.outfitColor} strokeWidth="1" />

          {/* Hair Styling according to active avatar */}
          {(activeAvatar.id === 'maya' || activeAvatar.id === 'elena') && (
            <path d="M 56 85 Q 100 30 144 85 Q 152 125 146 145 Q 138 95 100 65 Q 62 95 54 145 Z" fill={activeAvatar.hairColor} />
          )}
          {(activeAvatar.id === 'alex' || activeAvatar.id === 'marcus') && (
            <path d="M 56 80 Q 100 40 144 80 Q 150 55 100 45 Q 50 55 56 80 Z" fill={activeAvatar.hairColor} />
          )}
          {(activeAvatar.id === 'oak' || activeAvatar.id === 'viktor') && (
            <g>
              <path d="M 54 85 Q 100 35 146 85 Q 152 70 100 50 Q 48 70 54 85 Z" fill={activeAvatar.hairColor} />
              <path d="M 82 125 Q 100 138 118 125" stroke="#78350F" strokeWidth="2.5" fill="none" opacity="0.6" />
            </g>
          )}
          {(activeAvatar.id === 'priya' || activeAvatar.id === 'sophia') && (
            <g>
              <path d="M 55 85 Q 100 25 145 85 Q 150 135 145 150 Q 138 90 100 60 Q 62 90 55 150 Z" fill={activeAvatar.hairColor} />
              {activeAvatar.id === 'priya' && <circle cx="100" cy="74" r="2.2" fill="#E11D48" />}
            </g>
          )}

          {/* Eyes & Expressions */}
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

          {/* Glasses */}
          {activeAvatar.glasses && (
            <g stroke={activeAvatar.outfitColor} strokeWidth="2" fill="none">
              <rect x="72" y="81" width="20" height="16" rx="4" fill="rgba(99,102,241,0.12)" />
              <rect x="108" y="81" width="20" height="16" rx="4" fill="rgba(99,102,241,0.12)" />
              <line x1="92" y1="89" x2="108" y2="89" />
            </g>
          )}

          {/* Headset */}
          {activeAvatar.headset && (
            <g stroke={activeAvatar.outfitColor} strokeWidth="2.5" fill="none">
              <path d="M 56 90 Q 100 32 144 90" strokeWidth="3" />
              <rect x="52" y="84" width="8" height="18" rx="3" fill={activeAvatar.outfitColor} />
              <rect x="140" y="84" width="8" height="18" rx="3" fill={activeAvatar.outfitColor} />
              <path d="M 60 95 Q 75 118 90 115" stroke={activeAvatar.outfitColor} strokeWidth="1.5" />
              <circle cx="90" cy="115" r="2.5" fill={activeAvatar.outfitColor} />
            </g>
          )}

          {/* Nose */}
          <path d="M 100 95 L 97 106 L 103 106" stroke="#D97706" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* Animated Lip Sync Mouth */}
          <g transform="translate(100, 120)">
            {mouthOpen < 0.1 ? (
              <path d="M -11 -1 Q 0 6 11 -1" stroke="#991B1B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            ) : (
              <path
                d={`M -11 0 Q 0 ${12 * mouthOpen} 11 0 Q 0 ${-4 * mouthOpen} -11 0 Z`}
                fill="#991B1B"
                stroke="#7F1D1D"
                strokeWidth="1.5"
              />
            )}
            {mouthOpen > 0.35 && (
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
