// API Base URL Configuration for decoupled Render (Backend) and Vercel (Frontend)
const isLocal = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
);

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  (isLocal ? 'http://localhost:3000' : 'https://heybuddy-vhfd.onrender.com')
).replace(/\/$/, '');
