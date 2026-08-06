exports.handleDoubtChat = async (req, res) => {
  try {
    const { question, topic, timestamp, methodology, language, apiKey } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const effectiveKey = apiKey || process.env.GEMINI_API_KEY;
    if (effectiveKey) {
      try {
        const prompt = `You are heyBuddy AI Tutor. A student learning "${topic || 'General'}" asked this question at timestamp ${timestamp || '0:00'} using methodology "${methodology || 'Feynman'}":
"${question}"

Provide a clear 2-paragraph response in ${language || 'English'}. Use intuitive examples and bullet points.`;

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return res.json({ answer: text });
        }
      } catch (err) {
        console.warn('[chatController] Gemini fallback:', err.message);
      }
    }

    const answer = `Great question! When studying **${topic || 'this concept'}** (${timestamp || 'current scene'}):

• **Intuition:** Keep in mind how inputs directly balance with outputs.
• **Methodology Tip:** Under the ${methodology || 'Feynman'} lens, imagine explaining this to a peer using simple analogies.
• **Exam Advice:** Trace initial conditions and state assumptions clearly!`;

    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process chat doubt.' });
  }
};
