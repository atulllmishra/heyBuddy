const { generateScriptAndVisuals, translateScriptOnTheFly, METHODOLOGIES, LANGUAGES, STYLES } = require('../services/aiOrchestrator');

// In-memory queue store for Celery/Redis background pipeline simulation
const jobQueue = new Map();

exports.generateVideo = async (req, res) => {
  try {
    const { topic, gradeLevel, methodology, language, style, apiKey } = req.body;
    if (!topic || topic.trim() === '') {
      return res.status(400).json({ error: 'Topic is required.' });
    }

    const videoData = await generateScriptAndVisuals({
      topic,
      gradeLevel,
      methodology,
      language,
      style,
      apiKey
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
  const { topic, gradeLevel, methodology, language, style, apiKey } = req.body;

  jobQueue.set(jobId, {
    jobId,
    progress: 10,
    stage: 'parsing_prompt',
    message: 'Analyzing topic and selecting teaching methodology prompt chain...',
    payload: { topic, gradeLevel, methodology, language, style, apiKey },
    result: null
  });

  // Background pipeline step progression simulation
  setTimeout(() => {
    const job = jobQueue.get(jobId);
    if (job) {
      job.progress = 35;
      job.stage = 'llm_scripting';
      job.message = `LLM (${methodology}) generating structured narration in ${language}...`;
    }
  }, 1000);

  setTimeout(() => {
    const job = jobQueue.get(jobId);
    if (job) {
      job.progress = 70;
      job.stage = 'tts_and_avatar';
      job.message = 'Synthesizing voice audio & lip-syncing AI avatar presenter...';
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
    const { videoData, targetLanguage, apiKey } = req.body;
    if (!videoData || !targetLanguage) {
      return res.status(400).json({ error: 'videoData and targetLanguage are required.' });
    }

    const translated = await translateScriptOnTheFly({ videoData, targetLanguage, apiKey });
    res.json({ success: true, data: translated });
  } catch (err) {
    console.error('[videoController] Translation error:', err);
    res.status(500).json({ error: 'Failed to translate video script.' });
  }
};
