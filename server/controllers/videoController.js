const { generateScriptAndVisuals, METHODOLOGIES, LANGUAGES, STYLES } = require('../services/aiOrchestrator');

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
