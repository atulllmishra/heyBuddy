import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  // Pedagogy & Language Controls
  pedagogyStyle: 'Feynman', // 'Feynman', 'Socratic', 'Analogical', 'Deep Dive Academic'
  targetLanguage: 'English',
  voiceAccent: 'American Enthusiastic',
  personaAvatar: 'Professor AI Scientist',
  whiteboardTheme: 'Dark Slate',

  // Exam & Syllabus Scanner Controls
  examCategory: 'College', // 'College', 'Competitive Exam', 'School'
  examTarget: 'JEE Advanced / College University Standard',
  activeSyllabus: null,
  activePlaylist: null,
  activeLecture: null,

  // Render Job State
  activeTaskId: null,
  taskStatus: null,
  isRendering: false,

  // Actions
  setPedagogyStyle: (style) => set({ pedagogyStyle: style }),
  setTargetLanguage: (lang) => set({ targetLanguage: lang }),
  setExamCategory: (cat) => set({ examCategory: cat }),
  setExamTarget: (target) => set({ examTarget: target }),
  setActiveSyllabus: (syllabus) => set({ activeSyllabus: syllabus }),
  setActivePlaylist: (playlist) => set({ activePlaylist: playlist }),
  setActiveLecture: (lecture) => set({ activeLecture: lecture }),
  setTaskStatus: (statusObj) => set({ 
    taskStatus: statusObj,
    isRendering: statusObj?.status && statusObj.status !== 'COMPLETED' && statusObj.status !== 'FAILED'
  }),

  // "Style Shuffle" Button Action
  shuffleStyles: () => {
    const styles = ['Feynman', 'Socratic', 'Analogical', 'Deep Dive Academic'];
    const accents = ['American Enthusiastic', 'British Academic', 'Indian Tech Leader', 'Australian Mentor'];
    const avatars = ['Professor AI Scientist', 'Quantum Tutor Maya', 'Dr. Socratic Alan', 'Storyteller Elena'];
    const themes = ['Dark Slate', 'Midnight Blue', 'Emerald Glass', 'Cyberpunk Neon'];

    const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const newStyle = randomChoice(styles);
    const newAccent = randomChoice(accents);
    const newAvatar = randomChoice(avatars);
    const newTheme = randomChoice(themes);

    set({
      pedagogyStyle: newStyle,
      voiceAccent: newAccent,
      personaAvatar: newAvatar,
      whiteboardTheme: newTheme
    });

    return { newStyle, newAccent, newAvatar, newTheme };
  }
}));
