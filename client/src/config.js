// API Base URL Configuration for decoupled Render (Backend) and Vercel (Frontend)
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://heybuddy-vhfd.onrender.com').replace(/\/$/, '');
