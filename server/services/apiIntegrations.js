/**
 * External API Integration Service - Sarvam AI Bulbul v3, ElevenLabs Voice AI, OpenAI GPT-4o, Anthropic, DeepL, HeyGen
 * Includes Scientific Math & Chemistry Equation Speech Preprocessor for fluent Professor-level verbalization.
 */

/**
 * Preprocessor to convert complex mathematical equations, calculus expressions, and chemical formulas into human-spoken phonemes.
 */
function verbalizeScientificEquation(text) {
  if (!text) return '';
  let spoken = text;

  // 1. Chemical Equations & Molecules
  spoken = spoken
    .replace(/6\s*CO₂\s*\+\s*6\s*H₂O\s*(→|->|\=)\s*C₆H₁₂O₆\s*\+\s*6\s*O₂/gi, "six molecules of carbon dioxide plus six molecules of water react under sunlight to yield one molecule of glucose and six molecules of oxygen gas")
    .replace(/2\s*H₂O\s*(→|->|\=)\s*4\s*H⁺\s*\+\s*O₂\s*\+\s*4\s*e⁻/gi, "two water molecules split into four protons, oxygen gas, and four electrons")
    .replace(/ADP\s*\+\s*Pi\s*\+\s*Energy\s*(→|->|\=)\s*ATP/gi, "A D P plus inorganic phosphate and energy forms A T P")
    .replace(/NADP⁺\s*\+\s*H⁺\s*\+\s*2e⁻\s*(→|->|\=)\s*NADPH/gi, "N A D P plus hydrogen and two electrons forms N A D P H")
    .replace(/\bC₆H₁₂O₆\b/g, "glucose, C 6 H 12 O 6,")
    .replace(/\bCO₂\b/gi, "carbon dioxide")
    .replace(/\bH₂O\b/gi, "water")
    .replace(/\bO₂\b/gi, "oxygen gas")
    .replace(/\bNaCl\b/g, "sodium chloride salt")
    .replace(/\bH₂SO₄\b/g, "sulfuric acid")
    .replace(/\bATP\b/g, "A T P energy currency")
    .replace(/\bNADPH\b/g, "N A D P H carrier");

  // 2. Calculus, Derivatives, Integrals & Physics Equations
  spoken = spoken
    .replace(/∇\s*×\s*F/g, "the curl of vector field F")
    .replace(/∇\s*·\s*F/g, "the divergence of vector field F")
    .replace(/∂\s*([a-zA-ZΨψ])\s*\/\s*∂\s*t/g, "the partial derivative of $1 with respect to time")
    .replace(/\\frac\{d\}\{dx\}\((.*?)\)\s*=\s*(.*)/g, "the derivative with respect to x of $1 equals $2")
    .replace(/\\frac\{d\}\{dx\}/g, "the derivative with respect to x of")
    .replace(/\\frac\{(.*?)\}\{(.*?)\}/g, "$1 over $2")
    .replace(/\\int_\{(.*?)\}\^\{(.*?)\}/g, "the definite integral from $1 to $2 of")
    .replace(/\\int/g, "the integral of")
    .replace(/\\sum_\{i=1\}\^\{(.*?)\}/g, "the sum from i equals 1 to $1 of")
    .replace(/f\(x\)\s*=\s*/g, "function f of x equals ")
    .replace(/E\s*=\s*m\s*c\^2/gi, "Energy equals mass times the speed of light squared")
    .replace(/F\s*=\s*m\s*·\s*a|F\s*=\s*ma/gi, "Force equals mass times acceleration")
    .replace(/F_\{net\}\s*=\s*m\s*a/gi, "Net force equals mass times acceleration")
    .replace(/\|Ψ⟩|\|Psi⟩/gi, "state vector Psi")
    .replace(/\|0⟩/g, "state zero")
    .replace(/\|1⟩/g, "state one")
    .replace(/x\^2/g, "x squared")
    .replace(/x\^3/g, "x cubed")
    .replace(/x\^n/g, "x to the power of n")
    .replace(/r\^2/g, "radius squared");

  return spoken;
}

// ElevenLabs Curated Male & Female Neural Voices Catalog
const ELEVENLABS_VOICES = {
  female: [
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (Expressive Female)', gender: 'female' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (Warm Academic Female)', gender: 'female' },
    { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica (Professional Female)', gender: 'female' }
  ],
  male: [
    { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni (Technical Male)', gender: 'male' },
    { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh (Deep Academic Male)', gender: 'male' },
    { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold (Narrator Male)', gender: 'male' }
  ]
};

// HeyGen Curated Male & Female Avatars and Voices Catalog
const HEYGEN_AVATARS = {
  female: [
    { id: 'Daisy-in-suit', name: 'Daisy (Corporate Blazer)', gender: 'female', previewUrl: 'https://files2.heygen.ai/avatar/v3/daisy.jpg' },
    { id: 'monica_in_office_20230818', name: 'Monica (Office Executive)', gender: 'female', previewUrl: 'https://files2.heygen.ai/avatar/v3/monica.jpg' },
    { id: 'sarah_in_blazer_20230818', name: 'Dr. Sarah (Research Lead)', gender: 'female', previewUrl: 'https://files2.heygen.ai/avatar/v3/sarah.jpg' },
    { id: 'ann_in_sweater_20230818', name: 'Ann (University Instructor)', gender: 'female', previewUrl: 'https://files2.heygen.ai/avatar/v3/ann.jpg' }
  ],
  male: [
    { id: 'josh_lite_20230714', name: 'Josh (AI Tech Lead)', gender: 'male', previewUrl: 'https://files2.heygen.ai/avatar/v3/josh.jpg' },
    { id: 'erik_in_suit_20230620', name: 'Prof. Erik (Academic Chair)', gender: 'male', previewUrl: 'https://files2.heygen.ai/avatar/v3/erik.jpg' },
    { id: 'wayne_20230818', name: 'Wayne (Physics Presenter)', gender: 'male', previewUrl: 'https://files2.heygen.ai/avatar/v3/wayne.jpg' },
    { id: 'tyler_in_suit_20230818', name: 'Tyler (STEM Scholar)', gender: 'male', previewUrl: 'https://files2.heygen.ai/avatar/v3/tyler.jpg' }
  ]
};

const HEYGEN_VOICES = {
  female: [
    { id: 'en-US-JennyNeural', name: 'Jenny (US Female Neural)', gender: 'female', lang: 'en-US' },
    { id: '2f41ab7108764725b0e0176d65452f44', name: 'Sarah (Expressive Female)', gender: 'female', lang: 'en-US' },
    { id: 'hi-IN-SwaraNeural', name: 'Swara (Hindi Female)', gender: 'female', lang: 'hi-IN' }
  ],
  male: [
    { id: 'en-US-GuyNeural', name: 'Guy (US Male Neural)', gender: 'male', lang: 'en-US' },
    { id: '2d22f785ee5942f1ab003c00ed8363c4', name: 'Erik (Academic Male)', gender: 'male', lang: 'en-US' },
    { id: '077ab11b14f04563882955780d667ef3', name: 'Josh (Deep Male Scholar)', gender: 'male', lang: 'en-US' },
    { id: 'hi-IN-MadhurNeural', name: 'Madhur (Hindi Male)', gender: 'male', lang: 'hi-IN' }
  ]
};

/**
 * Sarvam AI Text-to-Speech API (bulbul:v3 model)
 */
async function synthesizeSarvamBulbulTTS({ text, targetLanguage = 'hi-IN', speaker = 'meera', pace = 1.05, pitch = 0, apiKey }) {
  const effectiveKey = apiKey || process.env.SARVAM_API_KEY;
  if (!effectiveKey) return null;

  // Verbalize scientific math & chemistry equations first
  const verbalizedText = verbalizeScientificEquation(text);

  try {
    let langCode = 'hi-IN';
    if (targetLanguage === 'English' || targetLanguage === 'en-IN') {
      langCode = 'en-IN';
    } else if (targetLanguage === 'Hindi' || targetLanguage === 'Hinglish' || targetLanguage === 'hi-IN') {
      langCode = 'hi-IN';
    }

    const res = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'api-subscription-key': effectiveKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: [verbalizedText],
        target_language_code: langCode,
        speaker: speaker || 'meera',
        pitch: pitch || 0,
        pace: pace || 1.05,
        loudness: 1.5,
        speech_sample_rate: 22050,
        enable_preprocessing: true,
        model: 'bulbul:v3'
      })
    });

    if (res.ok) {
      const data = await res.json();
      const base64Audio = data.audios?.[0];
      if (base64Audio) {
        return `data:audio/mp3;base64,${base64Audio}`;
      }
    } else {
      const errText = await res.text();
      console.warn('[Sarvam AI Bulbul v3] API Error response:', errText);
    }
  } catch (err) {
    console.warn('[Sarvam AI Bulbul v3] API Call Exception:', err.message);
  }
  return null;
}

/**
 * ElevenLabs Voice AI Text-to-Speech Synthesizer with Emotional Parameter Tuning
 */
async function synthesizeElevenLabsTTS({ text, voiceId = '21m00Tcm4TlvDq8ikWAM', apiKey }) {
  const effectiveKey = apiKey || process.env.ELEVENLABS_API_KEY;
  if (!effectiveKey) return null;

  // Verbalize scientific math & chemistry equations for natural professor delivery
  const verbalizedText = verbalizeScientificEquation(text);

  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': effectiveKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: verbalizedText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.80,
          style: 0.35,
          use_speaker_boost: true
        }
      })
    });

    if (res.ok) {
      const buffer = await res.arrayBuffer();
      const base64Audio = Buffer.from(buffer).toString('base64');
      return `data:audio/mp3;base64,${base64Audio}`;
    } else {
      const errText = await res.text();
      console.warn('[ElevenLabs API] Synthesis Error:', errText);
    }
  } catch (err) {
    console.warn('[ElevenLabs API] Synthesis Exception:', err.message);
  }
  return null;
}

/**
 * OpenAI GPT-4o / Anthropic Prompt Rewriter & Tutor
 */
async function callLLMProvider({ prompt, provider = 'openai', apiKey, systemPrompt }) {
  const effectiveKey = apiKey || process.env.OPENAI_API_KEY;
  if (!effectiveKey) return null;

  try {
    if (provider === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': effectiveKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4096,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      if (res.ok) {
        const data = await res.json();
        return data.content?.[0]?.text || null;
      }
    } else {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${effectiveKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt || 'You are heyBuddy, an elite AI EdTech Professor creating deep, long-form academic masterclass lectures.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 4096
        })
      });
      if (res.ok) {
        const data = await res.json();
        return data.choices?.[0]?.message?.content || null;
      } else {
        const err = await res.text();
        console.warn('[OpenAI API Error]:', err);
      }
    }
  } catch (err) {
    console.warn(`[LLMProvider ${provider}] API call error:`, err.message);
  }
  return null;
}

/**
 * DeepL Contextual Translation API
 */
async function translateDeepL({ text, targetLang = 'ES', apiKey }) {
  const effectiveKey = apiKey || process.env.DEEPL_API_KEY;
  if (!effectiveKey) return null;
  try {
    const res = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${effectiveKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang.toUpperCase()
      })
    });
    if (res.ok) {
      const data = await res.json();
      return data.translations?.[0]?.text || null;
    }
  } catch (err) {
    console.warn('[DeepL API] Translation error:', err.message);
  }
  return null;
}

/**
 * HeyGen Virtual Teacher Video Stream API with Male & Female Voice & Avatar Support
 */
async function generateHeyGenAvatarVideo({ scriptText, avatarId = 'Daisy-in-suit', voiceId = 'en-US-JennyNeural', gender = 'female', apiKey }) {
  const effectiveKey = apiKey || process.env.HEYGEN_API_KEY;
  if (!effectiveKey) return null;

  let finalAvatarId = avatarId;
  let finalVoiceId = voiceId;

  if (gender === 'male' && avatarId === 'Daisy-in-suit') {
    finalAvatarId = 'josh_lite_20230714';
    finalVoiceId = 'en-US-GuyNeural';
  }

  // Verbalize scientific math & chemistry equations for HeyGen lip-sync narration
  const verbalizedText = verbalizeScientificEquation(scriptText);

  try {
    const res = await fetch('https://api.heygen.com/v2/video/generate', {
      method: 'POST',
      headers: {
        'X-Api-Key': effectiveKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        video_inputs: [{
          character: { type: 'avatar', avatar_id: finalAvatarId, avatar_style: 'normal' },
          voice: { type: 'text', input_text: verbalizedText, voice_id: finalVoiceId }
        }],
        dimension: { width: 1280, height: 720 }
      })
    });
    if (res.ok) {
      const data = await res.json();
      return {
        videoId: data.data?.video_id || null,
        avatarId: finalAvatarId,
        voiceId: finalVoiceId,
        gender
      };
    } else {
      const errText = await res.text();
      console.warn('[HeyGen API] Error response:', errText);
    }
  } catch (err) {
    console.warn('[HeyGen API] Video generation request error:', err.message);
  }
  return null;
}

function getHeyGenAvatarsAndVoices() {
  return {
    avatars: HEYGEN_AVATARS,
    voices: HEYGEN_VOICES,
    elevenLabsVoices: ELEVENLABS_VOICES
  };
}

module.exports = {
  synthesizeSarvamBulbulTTS,
  synthesizeElevenLabsTTS,
  callLLMProvider,
  translateDeepL,
  generateHeyGenAvatarVideo,
  getHeyGenAvatarsAndVoices,
  verbalizeScientificEquation,
  ELEVENLABS_VOICES,
  HEYGEN_AVATARS,
  HEYGEN_VOICES
};
