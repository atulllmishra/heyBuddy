const { generateScriptAndVisuals, translateScriptOnTheFly, METHODOLOGIES, LANGUAGES, STYLES } = require('../services/aiOrchestrator');
const { fetchDeepAcademicContext } = require('../services/academicDataFetcher');
const { getHeyGenAvatarsAndVoices, generateHeyGenAvatarVideo, synthesizeSarvamBulbulTTS, synthesizeElevenLabsTTS } = require('../services/apiIntegrations');

// In-memory queue store for Celery/Redis background pipeline simulation
const jobQueue = new Map();

exports.generateVideo = async (req, res) => {
  try {
    const { topic, gradeLevel, streamDomain, lectureDuration, methodology, language, style, apiKey, openaiKey } = req.body;
    if (!topic || topic.trim() === '') {
      return res.status(400).json({ error: 'Topic is required.' });
    }

    const videoData = await generateScriptAndVisuals({
      topic,
      gradeLevel,
      streamDomain,
      lectureDuration,
      methodology,
      language,
      style,
      apiKey,
      openaiKey
    });

    res.json({ success: true, data: videoData });
  } catch (err) {
    console.error('[videoController] Error:', err);
    res.status(500).json({ error: 'Failed to generate AI video.' });
  }
};

exports.getOptions = (req, res) => {
  res.json({
    methodologies: Object.keys(METHODOLOGIES),
    languages: Object.keys(LANGUAGES),
    styles: Object.keys(STYLES)
  });
};

// Start Async Rendering Job (Celery / Redis pipeline model)
exports.startAsyncJob = async (req, res) => {
  const jobId = 'job_' + Math.random().toString(36).substring(2, 9);
  const { topic, gradeLevel, streamDomain, lectureDuration, methodology, language, style, apiKey, openaiKey } = req.body;

  jobQueue.set(jobId, {
    jobId,
    progress: 10,
    stage: 'parsing_prompt',
    message: 'Ingesting OpenStax, Gutenberg, Internet Archive, Wikidata SPARQL & Stack Exchange...',
    payload: { topic, gradeLevel, streamDomain, lectureDuration, methodology, language, style, apiKey, openaiKey },
    result: null
  });

  // Background pipeline step progression simulation
  setTimeout(() => {
    const job = jobQueue.get(jobId);
    if (job) {
      job.progress = 35;
      job.stage = 'llm_scripting';
      job.message = `LLM (${methodology}) generating deep narration in ${language}...`;
    }
  }, 1000);

  setTimeout(() => {
    const job = jobQueue.get(jobId);
    if (job) {
      job.progress = 70;
      job.stage = 'tts_and_avatar';
      job.message = 'Synthesizing ElevenLabs neural voice & lip-syncing AI avatar presenter...';
    }
  }, 2200);

  setTimeout(async () => {
    const job = jobQueue.get(jobId);
    if (job) {
      const data = await generateScriptAndVisuals(job.payload);
      job.progress = 100;
      job.stage = 'completed';
      job.message = 'Video rendered & stored in S3 Cloud CDN!';
      job.result = data;
    }
  }, 3500);

  res.json({ success: true, jobId });
};

// Check Async Job Status
exports.getJobStatus = (req, res) => {
  const { jobId } = req.params;
  const job = jobQueue.get(jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job ID not found.' });
  }

  res.json(job);
};

// On-The-Fly Interactive Script Translation
exports.translateVideo = async (req, res) => {
  try {
    const { videoData, targetLanguage, apiKey, deeplKey } = req.body;
    if (!videoData || !targetLanguage) {
      return res.status(400).json({ error: 'videoData and targetLanguage are required.' });
    }

    const translated = await translateScriptOnTheFly({ videoData, targetLanguage, apiKey, deeplKey });
    res.json({ success: true, data: translated });
  } catch (err) {
    console.error('[videoController] Translation error:', err);
    res.status(500).json({ error: 'Failed to translate video script.' });
  }
};

// Sarvam AI Bulbul v3 TTS Expressive Synthesizer Endpoint
exports.synthesizeSarvamTTS = async (req, res) => {
  try {
    const { text, targetLanguage, speaker, pace, pitch, sarvamKey } = req.body;

    const audioUrl = await synthesizeSarvamBulbulTTS({
      text,
      targetLanguage: targetLanguage || 'hi-IN',
      speaker: speaker || 'meera',
      pace: pace || 1.05,
      pitch: pitch || 0,
      apiKey: sarvamKey || process.env.SARVAM_API_KEY
    });

    if (audioUrl) {
      res.json({ success: true, audioUrl });
    } else {
      res.status(400).json({ error: 'Sarvam AI TTS synthesis failed or missing API Key.' });
    }
  } catch (err) {
    console.error('[videoController] Sarvam TTS Error:', err);
    res.status(500).json({ error: 'Internal Sarvam AI synthesis error.' });
  }
};

// ElevenLabs Voice AI Synthesizer Endpoint
exports.synthesizeElevenLabs = async (req, res) => {
  try {
    const { text, voiceId, elevenlabsKey } = req.body;

    const audioUrl = await synthesizeElevenLabsTTS({
      text,
      voiceId: voiceId || '21m00Tcm4TlvDq8ikWAM',
      apiKey: elevenlabsKey || process.env.ELEVENLABS_API_KEY
    });

    if (audioUrl) {
      res.json({ success: true, audioUrl });
    } else {
      res.status(400).json({ error: 'ElevenLabs TTS synthesis failed or missing API Key.' });
    }
  } catch (err) {
    console.error('[videoController] ElevenLabs TTS Error:', err);
    res.status(500).json({ error: 'Internal ElevenLabs synthesis error.' });
  }
};

// Deep Academic Context Fetcher Endpoint
exports.getAcademicData = async (req, res) => {
  try {
    const { topic, streamDomain } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic is required.' });

    const context = await fetchDeepAcademicContext(topic, streamDomain);
    res.json({ success: true, data: context });
  } catch (err) {
    console.error('[videoController] Academic Data Error:', err);
    res.status(500).json({ error: 'Failed to fetch academic context.' });
  }
};

// HeyGen & ElevenLabs Avatars & Voices Catalog Endpoint
exports.getHeyGenCatalog = (req, res) => {
  const catalog = getHeyGenAvatarsAndVoices();
  res.json({ success: true, data: catalog });
};

// HeyGen Video Generation Endpoint
exports.generateHeyGenVideo = async (req, res) => {
  try {
    const { scriptText, avatarId, voiceId, gender = 'female', heygenKey } = req.body;
    const effectiveKey = heygenKey || process.env.HEYGEN_API_KEY;

    if (!scriptText) return res.status(400).json({ error: 'Script text is required.' });
    if (!effectiveKey) return res.status(400).json({ error: 'HeyGen API key is required.' });

    const result = await generateHeyGenAvatarVideo({
      scriptText,
      avatarId,
      voiceId,
      gender,
      apiKey: effectiveKey
    });

    if (result && result.videoId) {
      res.json({ success: true, data: result });
    } else {
      res.status(500).json({ error: 'Failed to generate HeyGen avatar video.' });
    }
  } catch (err) {
    console.error('[videoController] HeyGen Video Generation Error:', err);
    res.status(500).json({ error: 'HeyGen video generation failed.' });
  }
};
