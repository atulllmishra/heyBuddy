/**
 * AI Orchestrator Service - Prompt Chains, Teaching Methodologies, Translations, Avatar Data & RAG Context
 */

const METHODOLOGIES = {
  Feynman: "Feynman Technique: Use simple everyday language, clear analogies, zero unnecessary jargon, and focus on fundamental intuition.",
  Socratic: "Socratic Dialogue: Structure explanation as a series of guiding questions, encouraging active reasoning and self-discovery.",
  Analogy: "Analogy & Metaphor: Relate complex concepts to engaging real-world stories, sports, cooking, or relatable daily life scenarios.",
  FirstPrinciples: "First Principles Thinking: Deconstruct the topic down to its most basic, undeniable truths and build up logically from foundational axioms.",
  ELI5: "Explain Like I'm 5: Ultra-playful, visual, simple words, exciting step-by-step storytelling."
};

const LANGUAGES = {
  English: "English",
  Hindi: "Hindi (हिंदी)",
  Spanish: "Spanish (Español)",
  French: "French (Français)",
  German: "German (Deutsch)",
  Japanese: "Japanese (日本語)",
  Chinese: "Mandarin Chinese (中文)",
  Arabic: "Arabic (العربية)"
};

const STYLES = {
  Minimalist: { bgGradient: ["#050505", "#141414"], primaryColor: "#FFFFFF", accentColor: "#888888" },
  Technical: { bgGradient: ["#020617", "#0F172A"], primaryColor: "#38BDF8", accentColor: "#A78BFA" },
  Chalkboard: { bgGradient: ["#0B1311", "#13231F"], primaryColor: "#FDE047", accentColor: "#34D399" },
  DataFlow: { bgGradient: ["#0A0A0F", "#1A1A2E"], primaryColor: "#EC4899", accentColor: "#06B6D4" }
};

// Built-in Procedural Library for instant showcase
const BASE_TOPICS = {
  "photosynthesis": {
    topic: "Photosynthesis & Light-Dependent Reactions",
    subject: "Biology / Biochemistry",
    durationSeconds: 40,
    summary: "How plant chloroplasts transform light energy into chemical glucose.",
    scenes: [
      {
        id: 1,
        title: "The Solar Factory of Nature",
        duration: 10,
        narration: "Welcome to heyBuddy AI! Photosynthesis takes place inside plant chloroplasts, turning sunlight, water, and carbon dioxide into oxygen and glucose.",
        visualType: "diagram",
        canvasData: {
          bgGradient: ["#050505", "#141414"],
          mainTitle: "Photosynthesis Overview",
          elements: [
            { type: "sun", x: 150, y: 120, radius: 45, color: "#FFFFFF", glow: true, label: "Sunlight (hν)" },
            { type: "leaf", x: 480, y: 260, width: 220, height: 160, color: "#EAEAEA" },
            { type: "molecule", x: 180, y: 320, name: "6 H₂O", color: "#CCCCCC" },
            { type: "molecule", x: 180, y: 380, name: "6 CO₂", color: "#AAAAAA" },
            { type: "arrow", from: [220, 150], to: [420, 240], color: "#FFFFFF", label: "Light Energy" },
            { type: "output", x: 700, y: 240, name: "6 O₂ (Oxygen Released)", color: "#FFFFFF" },
            { type: "output", x: 700, y: 340, name: "C₆H₁₂O₆ (Glucose)", color: "#CCCCCC" }
          ]
        },
        bullets: ["Location: Chloroplast Thylakoids", "Inputs: Light + Water + CO₂", "Outputs: Oxygen + Glucose"]
      },
      {
        id: 2,
        title: "Inside Chloroplast Thylakoids",
        duration: 10,
        narration: "Inside the thylakoid membrane, light photons excite electrons in Photosystem II, triggering the photolysis splitting of water molecules.",
        visualType: "particle_flow",
        canvasData: {
          bgGradient: ["#050505", "#141414"],
          mainTitle: "Thylakoid Membrane & Photosystem II",
          elements: [
            { type: "complex", x: 260, y: 230, width: 90, height: 100, name: "Photosystem II", color: "#FFFFFF" },
            { type: "complex", x: 480, y: 230, width: 90, height: 100, name: "Electron Transport", color: "#CCCCCC" },
            { type: "complex", x: 700, y: 230, width: 90, height: 100, name: "ATP Synthase", color: "#AAAAAA" },
            { type: "electron_pulse", path: [[260, 200], [480, 200], [700, 200]], color: "#FFFFFF" }
          ]
        },
        bullets: ["Photolysis: 2H₂O → 4H⁺ + O₂ + 4e⁻", "Excited electron transport", "Proton accumulation in lumen"]
      },
      {
        id: 3,
        title: "ATP & NADPH Energy Generation",
        duration: 10,
        narration: "Proton movement drives ATP Synthase rotation, creating high-energy ATP and NADPH molecules to fuel the Calvin Cycle.",
        visualType: "formula_demo",
        canvasData: {
          bgGradient: ["#050505", "#141414"],
          mainTitle: "Energy Synthesis",
          elements: [
            { type: "math_formula", text: "ADP + Pi + Energy → ATP", x: 240, y: 200, color: "#FFFFFF" },
            { type: "math_formula", text: "NADP⁺ + H⁺ + 2e⁻ → NADPH", x: 240, y: 280, color: "#CCCCCC" }
          ]
        },
        bullets: ["Chemiosmotic proton gradient", "ATP and NADPH travel to Stroma", "Powers carbon fixation"]
      },
      {
        id: 4,
        title: "Summary & Equation",
        duration: 10,
        narration: "To recap: Sunlight splits water to release oxygen and forms ATP and NADPH, which convert carbon dioxide into sugar!",
        visualType: "summary_card",
        canvasData: {
          bgGradient: ["#050505", "#141414"],
          mainTitle: "Photosynthesis Summary",
          elements: [
            { type: "formula_banner", text: "6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂", x: 140, y: 240, color: "#FFFFFF" }
          ]
        },
        bullets: ["Light Reactions in Thylakoid", "Calvin Cycle in Stroma", "Essential for Earth's biosphere"]
      }
    ],
    quiz: [
      {
        question: "Where do the light-dependent reactions of photosynthesis occur?",
        options: ["Stroma", "Thylakoid Membrane", "Mitochondria", "Cell Wall"],
        correctIndex: 1,
        explanation: "Light-dependent reactions take place in the thylakoid membrane inside chloroplasts."
      },
      {
        question: "What gas is released during the photolysis of water?",
        options: ["Carbon Dioxide", "Glucose", "Oxygen (O₂)", "Nitrogen"],
        correctIndex: 2,
        explanation: "Splitting 2 H₂O molecules releases oxygen gas (O₂) as a vital byproduct."
      }
    ],
    notes: [
      { title: "Net Chemical Reaction", content: "6 CO₂ + 6 H₂O + Light Energy → C₆H₁₂O₆ + 6 O₂" },
      { title: "Key Enzymes & Photosystems", content: "PSII (P680) and PSI (P700) drive electron flow to generate ATP and NADPH." }
    ]
  }
};

async function generateScriptAndVisuals({ topic, gradeLevel, methodology = 'Feynman', language = 'English', style = 'Minimalist', apiKey }) {
  const cleanTopic = topic.trim();
  const lowerTopic = cleanTopic.toLowerCase();
  const styleConfig = STYLES[style] || STYLES.Minimalist;

  // Check if topic is in base procedural library
  let baseData = null;
  const matchKey = Object.keys(BASE_TOPICS).find(k => lowerTopic.includes(k));
  
  if (matchKey) {
    baseData = JSON.parse(JSON.stringify(BASE_TOPICS[matchKey]));
  } else {
    // Generate custom procedural structure
    baseData = {
      topic: cleanTopic,
      subject: "AI EdTech Course",
      gradeLevel: gradeLevel || "Standard",
      durationSeconds: 40,
      summary: `Concept breakdown of ${cleanTopic} using ${methodology} methodology.`,
      scenes: [
        {
          id: 1,
          title: `Introduction: ${cleanTopic}`,
          duration: 10,
          narration: `Welcome to heyBuddy! Today we are exploring ${cleanTopic} using the ${methodology} perspective. Let's break down the foundational intuition step by step.`,
          visualType: "diagram",
          canvasData: {
            bgGradient: styleConfig.bgGradient,
            mainTitle: cleanTopic,
            elements: [
              { type: "concept_node", x: 450, y: 250, label: cleanTopic, color: styleConfig.primaryColor, r: 65 },
              { type: "branch_node", x: 220, y: 180, label: "Core Axiom", color: styleConfig.accentColor },
              { type: "branch_node", x: 680, y: 180, label: "Key Process", color: styleConfig.primaryColor },
              { type: "branch_node", x: 450, y: 400, label: "Real Impact", color: styleConfig.accentColor }
            ]
          },
          bullets: [`Core definition of ${cleanTopic}`, "Foundational intuition", "Why this concept matters"]
        },
        {
          id: 2,
          title: "System Mechanics & Flow",
          duration: 10,
          narration: `Examining the inner workings: how variables interact to drive the primary outcome in ${cleanTopic}.`,
          visualType: "process_flow",
          canvasData: {
            bgGradient: styleConfig.bgGradient,
            mainTitle: "Process Mechanics",
            elements: [
              { type: "flow_step", x: 180, y: 270, title: "Input Signal", color: styleConfig.primaryColor },
              { type: "flow_step", x: 450, y: 270, title: "Transformation", color: styleConfig.accentColor },
              { type: "flow_step", x: 720, y: 270, title: "Final Output", color: styleConfig.primaryColor }
            ]
          },
          bullets: ["Sequential operation steps", "Conservation of energy/data", "Input-Output relation"]
        },
        {
          id: 3,
          title: "Deep Dive & Core Principles",
          duration: 10,
          narration: `Here is the mathematical and analytical representation powering ${cleanTopic}.`,
          visualType: "formula_demo",
          canvasData: {
            bgGradient: styleConfig.bgGradient,
            mainTitle: "Mathematical Derivation",
            elements: [
              { type: "formula_banner", text: `f(${cleanTopic.slice(0, 8)}) = Σ(Inputs · Weights)`, x: 200, y: 230, color: styleConfig.primaryColor }
            ]
          },
          bullets: ["Analytical breakdown", "Key variables defined", "Exam tips & pitfalls"]
        },
        {
          id: 4,
          title: "Summary & Takeaways",
          duration: 10,
          narration: `In summary, mastering ${cleanTopic} gives you a fundamental tool in your learning journey. Test your knowledge in the quiz tab!`,
          visualType: "summary_card",
          canvasData: {
            bgGradient: styleConfig.bgGradient,
            mainTitle: "Key Takeaways",
            elements: [
              { type: "summary_grid", items: ["1. Remember Core Axiom", "2. Master Step-by-Step Flow", "3. Complete Quiz Questions"] }
            ]
          },
          bullets: ["Primary intuition locked in", "Ready for quiz assessment", "Use AI Chat for doubts"]
        }
      ],
      quiz: [
        {
          question: `What is the primary principle behind ${cleanTopic}?`,
          options: [`It defines the core mechanism of ${cleanTopic}`, "It is an invalid concept", "It requires no inputs", "It only works at absolute zero"],
          correctIndex: 0,
          explanation: `${cleanTopic} relies on a structured sequence of transformations to generate outcomes.`
        }
      ],
      notes: [
        { title: "Core Summary", content: `Essential overview of ${cleanTopic} tailored for ${gradeLevel || 'students'}.` }
      ]
    };
  }

  // Apply visual style colors across scenes
  baseData.scenes.forEach(s => {
    if (s.canvasData) {
      s.canvasData.bgGradient = styleConfig.bgGradient;
    }
  });

  // Call Gemini API if key is available
  const effectiveKey = apiKey || process.env.GEMINI_API_KEY;
  if (effectiveKey) {
    try {
      const prompt = `You are heyBuddy, an expert AI EdTech Video Producer. Generate a structured JSON response for a video explaining "${cleanTopic}" tailored for ${gradeLevel} using teaching methodology: "${METHODOLOGIES[methodology] || methodology}" in Language: "${language}".
Respond ONLY with valid JSON conforming to this schema:
{
  "topic": "${cleanTopic}",
  "subject": "STEM / General",
  "gradeLevel": "${gradeLevel}",
  "durationSeconds": 40,
  "summary": "Summary in ${language}",
  "scenes": [
    {
      "id": 1,
      "title": "Scene 1 Title",
      "duration": 10,
      "narration": "Speech script in ${language} explaining the concept using ${methodology} approach.",
      "bullets": ["Bullet 1 in ${language}", "Bullet 2 in ${language}"]
    },
    {
      "id": 2,
      "title": "Scene 2 Title",
      "duration": 10,
      "narration": "Speech script in ${language} for step 2.",
      "bullets": ["Bullet 1", "Bullet 2"]
    },
    {
      "id": 3,
      "title": "Scene 3 Title",
      "duration": 10,
      "narration": "Speech script in ${language} for deep dive.",
      "bullets": ["Bullet 1", "Bullet 2"]
    },
    {
      "id": 4,
      "title": "Summary Title",
      "duration": 10,
      "narration": "Summary script in ${language}.",
      "bullets": ["Bullet 1", "Bullet 2"]
    }
  ],
  "quiz": [
    {
      "question": "Question in ${language}?",
      "options": ["Opt 1", "Opt 2", "Opt 3", "Opt 4"],
      "correctIndex": 0,
      "explanation": "Explanation in ${language}"
    }
  ],
  "notes": [
    { "title": "Note Title", "content": "Content in ${language}" }
  ]
}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      if (res.ok) {
        const data = await res.json();
        let textRes = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        textRes = textRes.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(textRes);

        if (parsed.scenes && parsed.scenes.length === baseData.scenes.length) {
          parsed.scenes.forEach((s, idx) => {
            baseData.scenes[idx].title = s.title;
            baseData.scenes[idx].narration = s.narration;
            baseData.scenes[idx].bullets = s.bullets;
          });
        }
        if (parsed.quiz) baseData.quiz = parsed.quiz;
        if (parsed.notes) baseData.notes = parsed.notes;
      }
    } catch (e) {
      console.warn('[aiOrchestrator] Gemini call failed, returning procedural engine result:', e.message);
    }
  }

  baseData.methodology = methodology;
  baseData.language = language;
  baseData.style = style;
  return baseData;
}

/**
 * On-the-Fly Live Script Translation for current Video
 */
async function translateScriptOnTheFly({ videoData, targetLanguage, apiKey }) {
  if (!videoData) return null;
  const copy = JSON.parse(JSON.stringify(videoData));
  copy.language = targetLanguage;

  const effectiveKey = apiKey || process.env.GEMINI_API_KEY;
  if (effectiveKey) {
    try {
      const prompt = `Translate the narrations and bullets of this educational script to ${targetLanguage}.
Respond ONLY with JSON:
{
  "scenes": [
    { "id": 1, "title": "Translated Title", "narration": "Translated Narration", "bullets": ["Translated Bullet 1"] },
    { "id": 2, "title": "Translated Title", "narration": "Translated Narration", "bullets": ["Translated Bullet 1"] },
    { "id": 3, "title": "Translated Title", "narration": "Translated Narration", "bullets": ["Translated Bullet 1"] },
    { "id": 4, "title": "Translated Title", "narration": "Translated Narration", "bullets": ["Translated Bullet 1"] }
  ]
}
Original scenes narrations: ${JSON.stringify(videoData.scenes.map(s => ({ title: s.title, narration: s.narration, bullets: s.bullets })))}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      if (res.ok) {
        const data = await res.json();
        let textRes = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        textRes = textRes.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(textRes);
        if (parsed.scenes && parsed.scenes.length === copy.scenes.length) {
          parsed.scenes.forEach((s, idx) => {
            copy.scenes[idx].title = s.title;
            copy.scenes[idx].narration = s.narration;
            copy.scenes[idx].bullets = s.bullets;
          });
          return copy;
        }
      }
    } catch (err) {
      console.warn('[aiOrchestrator] On-the-fly translation error:', err.message);
    }
  }

  // Fallback translation tag
  copy.scenes.forEach(s => {
    s.narration = `[${targetLanguage}] ` + s.narration;
  });
  return copy;
}

module.exports = {
  generateScriptAndVisuals,
  translateScriptOnTheFly,
  METHODOLOGIES,
  LANGUAGES,
  STYLES
};
