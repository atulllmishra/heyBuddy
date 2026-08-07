import React, { useState } from 'react';

const CATEGORY_CHIPS = [
  'All',
  'STEM & Physics',
  'Computer Science & AI',
  'Medical & Life Sciences',
  'Commerce & Economics',
  'Humanities & Social Sciences'
];

const SHOWCASE_VIDEOS = [
  {
    id: 'photosynthesis',
    topic: 'Photosynthesis & Light Reactions (Complete Masterclass)',
    domain: 'Medical & Life Sciences',
    gradeLevel: 'High School / AP',
    views: '142,500 views',
    timeAgo: '2 days ago',
    duration: '4:10',
    thumbnail: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop&q=80',
    channel: 'heyBuddy AI Professor',
    verified: true
  },
  {
    id: 'newton_laws',
    topic: "Newton's Three Laws of Motion & Orbital Mechanics",
    domain: 'STEM & Physics',
    gradeLevel: 'College / Undergrad',
    views: '289,100 views',
    timeAgo: '5 days ago',
    duration: '5:30',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    channel: 'heyBuddy AI Professor',
    verified: true
  },
  {
    id: 'quantum_entanglement',
    topic: 'Quantum Entanglement, Bell Inequalities & Superposition',
    domain: 'STEM & Physics',
    gradeLevel: 'Fellowship & PhD',
    views: '512,000 views',
    timeAgo: '1 week ago',
    duration: '8:45',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    channel: 'heyBuddy Quantum Lab',
    verified: true
  },
  {
    id: 'ai_transformers',
    topic: 'Neural Networks & Deep Learning Transformer Attention',
    domain: 'Computer Science & AI',
    gradeLevel: 'College / Undergrad',
    views: '340,200 views',
    timeAgo: '3 days ago',
    duration: '6:15',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
    channel: 'heyBuddy CS Institute',
    verified: true
  },
  {
    id: 'ddl_dml_sql',
    topic: 'Relational Database SQL: DDL, DML & Schema Normalization',
    domain: 'Computer Science & AI',
    gradeLevel: 'College / Undergrad',
    views: '198,400 views',
    timeAgo: '4 days ago',
    duration: '4:50',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    channel: 'heyBuddy CS Institute',
    verified: true
  },
  {
    id: 'macroeconomics',
    topic: 'Macroeconomic Principles: Inflation, GDP & Central Banks',
    domain: 'Commerce & Economics',
    gradeLevel: 'High School / AP',
    views: '94,300 views',
    timeAgo: '6 days ago',
    duration: '3:55',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
    channel: 'heyBuddy Econ Academy',
    verified: true
  }
];

export default function HomeFeed({ onSelectVideo, onOpenStudio }) {
  const [selectedChip, setSelectedChip] = useState('All');

  const filteredVideos = SHOWCASE_VIDEOS.filter(video => {
    if (selectedChip === 'All') return true;
    return video.domain === selectedChip;
  });

  return (
    <div>
      {/* Category Chips Filter Bar */}
      <div className="chips-bar">
        {CATEGORY_CHIPS.map(chip => (
          <button
            key={chip}
            className={`chip-btn ${selectedChip === chip ? 'active' : ''}`}
            onClick={() => setSelectedChip(chip)}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Main Video Feed Grid */}
      <div className="video-grid">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="yt-card"
            onClick={() => onSelectVideo(video.topic, video.domain)}
          >
            <div className="yt-thumbnail-wrapper">
              <img src={video.thumbnail} alt={video.topic} loading="lazy" />
              <span className="yt-duration-badge">{video.duration}</span>
            </div>

            <div className="yt-card-meta">
              <div className="yt-avatar">🎓</div>
              <div className="yt-card-details">
                <div className="yt-card-title">{video.topic}</div>
                <div className="yt-card-channel">
                  {video.channel}
                  {video.verified && <i className="fa-solid fa-circle-check" style={{ color: '#3ea6ff', fontSize: '0.75rem' }}></i>}
                </div>
                <div className="yt-card-subtext">
                  {video.views} • {video.timeAgo}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
