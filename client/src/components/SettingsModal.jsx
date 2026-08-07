import React, { useState, useEffect } from 'react';
import { X, Key, Shield, CheckCircle } from 'lucide-react';

export default function SettingsModal({ onClose }) {
  const [gemini, setGemini] = useState('');
  const [openai, setOpenai] = useState('');
  const [sarvam, setSarvam] = useState('');
  const [heygen, setHeygen] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setGemini(localStorage.getItem('heybuddy_gemini_key') || '');
    setOpenai(localStorage.getItem('heybuddy_openai_key') || '');
    setSarvam(localStorage.getItem('heybuddy_sarvam_key') || '');
    setHeygen(localStorage.getItem('heybuddy_heygen_key') || '');
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (gemini) localStorage.setItem('heybuddy_gemini_key', gemini);
    if (openai) localStorage.setItem('heybuddy_openai_key', openai);
    if (sarvam) localStorage.setItem('heybuddy_sarvam_key', sarvam);
    if (heygen) localStorage.setItem('heybuddy_heygen_key', heygen);

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 max-w-lg w-full space-y-6 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-400" /> Platform Credentials & Keys
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Keys are saved in your local browser storage and used directly for API synthesis requests.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">Google Gemini API Key</label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={gemini}
              onChange={(e) => setGemini(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">OpenAI API Key (Optional Fallback)</label>
            <input
              type="password"
              placeholder="sk-proj-..."
              value={openai}
              onChange={(e) => setOpenai(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">Sarvam AI API Key (TTS)</label>
            <input
              type="password"
              placeholder="sk_..."
              value={sarvam}
              onChange={(e) => setSarvam(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-white text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
          >
            {saved ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Keys Saved!
              </>
            ) : (
              'Save Credentials & Close'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
