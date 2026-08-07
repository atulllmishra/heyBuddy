/**
 * User & Content Management Controller - Library, History, Analytics, and Settings Profile
 */

// In-Memory Storage (Simulating DB Persistence)
let libraryItems = [
  {
    id: 'photosynthesis',
    title: 'Photosynthesis & Light Reactions',
    category: 'Biology',
    gradeLevel: 'High School',
    duration: '10 min',
    savedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    icon: '🌱',
    summary: 'Detailed step-by-step breakdown of chloroplast thylakoid light absorption and ATP synthesis.'
  },
  {
    id: 'newton',
    title: "Newton's 3 Laws of Motion",
    category: 'Physics',
    gradeLevel: 'High School / AP',
    duration: '12 min',
    savedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    icon: '🚀',
    summary: 'Vector mechanics, F=ma proofs, and action-reaction pair analysis.'
  },
  {
    id: 'quantum',
    title: 'Quantum Entanglement & Superposition',
    category: 'Quantum Physics',
    gradeLevel: 'University',
    duration: '15 min',
    savedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    icon: '⚛️',
    summary: 'EPR Paradox, Wavefunction collapse, and Quantum Teleportation fundamentals.'
  }
];

let historyItems = [
  {
    id: 'hist_1',
    topic: 'Calculus: Derivatives & Chain Rule',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    methodology: 'Feynman Technique',
    language: 'Hinglish',
    status: 'Completed',
    duration: '8 min'
  },
  {
    id: 'hist_2',
    topic: 'Organic Chemistry: Reaction Mechanisms',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    methodology: 'First Principles',
    language: 'English',
    status: 'Completed',
    duration: '11 min'
  }
];

let userProfile = {
  name: 'Alex Rivera',
  email: 'alex@heybuddy.edu',
  role: 'Student / Researcher',
  gradeLevel: 'High School / AP',
  targetStream: 'STEM / Physical Sciences',
  learningGoal: 'Master Calculus & Quantum Physics before Semester Finals',
  geminiKeySet: false,
  openaiKeySet: false
};

// 1. Library Endpoints
exports.getLibrary = (req, res) => {
  res.json({ success: true, count: libraryItems.length, data: libraryItems });
};

exports.addToLibrary = (req, res) => {
  const item = req.body;
  if (!item || !item.title) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const newItem = {
    id: item.id || 'lib_' + Math.random().toString(36).substring(2, 9),
    title: item.title,
    category: item.category || 'General',
    gradeLevel: item.gradeLevel || 'High School',
    duration: item.duration || '10 min',
    savedAt: new Date().toISOString(),
    icon: item.icon || '📚',
    summary: item.summary || 'Custom generated AI Masterclass lecture.'
  };

  libraryItems.unshift(newItem);
  res.status(201).json({ success: true, message: 'Saved to Library', data: newItem });
};

exports.removeFromLibrary = (req, res) => {
  const { id } = req.params;
  libraryItems = libraryItems.filter(item => item.id !== id);
  res.json({ success: true, message: 'Removed from Library', remaining: libraryItems.length });
};

// 2. History Endpoints
exports.getHistory = (req, res) => {
  res.json({ success: true, count: historyItems.length, data: historyItems });
};

exports.addHistory = (req, res) => {
  const { topic, methodology, language, duration } = req.body;
  if (!topic) return res.status(400).json({ error: 'Topic is required' });

  const newLog = {
    id: 'hist_' + Math.random().toString(36).substring(2, 9),
    topic,
    createdAt: new Date().toISOString(),
    methodology: methodology || 'Feynman Technique',
    language: language || 'Hinglish',
    status: 'Completed',
    duration: duration || '10 min'
  };

  historyItems.unshift(newLog);
  res.status(201).json({ success: true, data: newLog });
};

exports.clearHistory = (req, res) => {
  historyItems = [];
  res.json({ success: true, message: 'History cleared' });
};

// 3. Analytics Endpoint
exports.getAnalytics = (req, res) => {
  const analyticsData = {
    studyStreakDays: 7,
    totalWatchTimeHours: 14.8,
    masterclassesCompleted: libraryItems.length + historyItems.length + 5,
    doubtsSolved: 34,
    topicMastery: [
      { subject: 'Biology', score: 92, status: 'Mastered', color: '#10B981' },
      { subject: 'Physics', score: 85, status: 'Proficient', color: '#3B82F6' },
      { subject: 'Chemistry', score: 78, status: 'Developing', color: '#F59E0B' },
      { subject: 'Mathematics', score: 88, status: 'Proficient', color: '#8B5CF6' }
    ],
    weeklyActivity: [
      { day: 'Mon', minutes: 45 },
      { day: 'Tue', minutes: 60 },
      { day: 'Wed', minutes: 30 },
      { day: 'Thu', minutes: 75 },
      { day: 'Fri', minutes: 90 },
      { day: 'Sat', minutes: 120 },
      { day: 'Sun', minutes: 50 }
    ]
  };

  res.json({ success: true, data: analyticsData });
};

// 4. User Profile Endpoints
exports.getProfile = (req, res) => {
  res.json({ success: true, data: userProfile });
};

exports.updateProfile = (req, res) => {
  const updates = req.body;
  userProfile = { ...userProfile, ...updates };
  res.json({ success: true, message: 'Profile updated', data: userProfile });
};
