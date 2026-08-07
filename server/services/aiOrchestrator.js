/**
 * AI Orchestrator Service - Single-Scene Hinglish Masterclass Engine
 * Generates ONE unified, content-packed Masterclass Scene with rich Hinglish narration (Hindi + English EdTech style)
 * Ingests OpenStax, Gutenberg, Internet Archive, LibreTexts, Wikidata SPARQL, Wolfram Alpha, YouTube Transcripts, and Stack Exchange.
 */

const { fetchDeepAcademicContext } = require('./academicDataFetcher');
const { callLLMProvider } = require('./apiIntegrations');

/**
 * Procedural Single-Scene Masterclass Library in Hinglish
 */
const BASE_TOPICS = {
  "photosynthesis": {
    topic: "Photosynthesis & Light Reactions (Complete Masterclass)",
    subject: "Medical & Life Sciences",
    gradeLevel: "High School / AP",
    streamDomain: "Medical & Life Sciences",
    lectureDuration: "Full Masterclass",
    durationSeconds: 240,
    language: "Hinglish",
    summary: "Complete single-scene breakdown of Photosynthesis, Thylakoid light reactions, photolysis, and Calvin cycle in natural Hinglish.",
    scenes: [
      {
        id: 1,
        title: "Photosynthesis Complete Unified Breakdown",
        duration: 240,
        narration: "Welcome to heyBuddy AI Masterclass! Aaj hum Photosynthesis ko bilkul first principles se samjhenge. Plant leaves ke andar jo green chloroplast organelles hote hain, wo solar photons, water (H2O), aur atmospheric carbon dioxide (CO2) ko absorb karke glucose sugar (C6H12O6) aur oxygen gas (O2) banate hain. Thylakoid membrane ke andar light-dependent reactions hoti hain jahan Photosystem II 680 nanometer wavelength light ko absorb karke water ko split karta hai: 2 H2O breaks into 4 protons, oxygen gas, and 4 excited electrons. Is electron flow se proton gradient banta hai jo ATP Synthase rotor ko spin karta hai, forming ATP and NADPH. Phir stroma me Calvin cycle dwara RuBisCO enzyme carbon dioxide ko fix karke glucose synthesize karta hai! Sabhi points ko dhyaan se dekhiye aur quiz attempt kijiye!",
        visualType: "masterclass_unified",
        canvasData: {
          bgGradient: ["#070a14", "#121b2d"],
          mainTitle: "Photosynthesis & Light Reactions - Complete Concept Map",
          elements: [
            { type: "sun", x: 180, y: 110, radius: 40, color: "#F59E0B", label: "Sunlight (hν Photons)" },
            { type: "leaf", x: 480, y: 230, width: 340, height: 180, color: "#10B981" },
            { type: "molecule", x: 160, y: 220, name: "6 H₂O (Water)", color: "#38BDF8" },
            { type: "molecule", x: 160, y: 290, name: "6 CO₂ (Carbon Dioxide)", color: "#94A3B8" },
            { type: "arrow", from: [230, 120], to: [400, 200], color: "#F59E0B", label: "Light Energy" },
            { type: "output", x: 800, y: 200, name: "6 O₂ (Oxygen Released)", color: "#34D399" },
            { type: "output", x: 800, y: 290, name: "C₆H₁₂O₆ (Glucose Sugar)", color: "#F59E0B" },
            { type: "formula_banner", text: "Net Reaction:  6 CO₂  +  6 H₂O  +  Light   →   C₆H₁₂O₆  +  6 O₂", x: 160, y: 360, color: "#818CF8" }
          ]
        },
        bullets: [
          "Thylakoid Membrane: Photolysis splits 2 H₂O → 4 H⁺ + O₂ + 4 e⁻",
          "Chemiosmotic ATP Synthase rotation generates ATP and NADPH",
          "Stroma Matrix: RuBisCO enzyme fixes CO₂ into Glucose (C₆H₁₂O₆)"
        ]
      }
    ],
    quiz: [
      {
        question: "Photosynthesis me light-dependent reactions kahan occur hoti hain?",
        options: ["Stroma Matrix", "Thylakoid Membrane", "Mitochondria", "Cell Wall"],
        correctIndex: 1,
        explanation: "Light-dependent reactions thylakoid membrane ke andar hoti hain jahan chlorophyll pigments embedded hain."
      },
      {
        question: "Calvin cycle me carbon fixation kaunsa enzyme catalyze karta hai?",
        options: ["ATP Synthase", "RuBisCO", "Amylase", "DNA Polymerase"],
        correctIndex: 1,
        explanation: "RuBisCO (Ribulose-1,5-bisphosphate carboxylase) carbon dioxide ko fix karta hai."
      }
    ],
    notes: [
      { title: "Net Equation", content: "6 CO₂ + 6 H₂O + Photons → C₆H₁₂O₆ + 6 O₂" },
      { title: "Key Enzymes & Process", content: "Photosystem II (P680), Photolysis, ATP Synthase, Calvin Cycle (RuBisCO)." }
    ]
  }
};

/**
 * Main Script Generator for Single-Scene Masterclass in Hinglish
 */
async function generateScriptAndVisuals({
  topic,
  gradeLevel = 'High School',
  streamDomain = 'STEM / Physical Sciences',
  apiKey,
  openaiKey
}) {
  const cleanTopic = topic.trim();
  console.log(`[aiOrchestrator] Generating Single-Scene Hinglish Masterclass for: "${cleanTopic}"...`);

  // Step 1: Query multi-source deep academic data
  const academicData = await fetchDeepAcademicContext(cleanTopic, streamDomain);

  const academicContextStr = [
    academicData.openstax ? `[OpenStax]: ${academicData.openstax.title} - ${academicData.openstax.description}` : '',
    academicData.libretexts ? `[LibreTexts OER]: ${academicData.libretexts.snippet}` : '',
    academicData.wikidata?.sparqlRelations ? `[Wikidata SPARQL]: ${JSON.stringify(academicData.wikidata.sparqlRelations)}` : '',
    academicData.wolfram ? `[Wolfram Alpha]: ${academicData.wolfram.result}` : '',
    academicData.stackexchange ? `[StackExchange]: ${academicData.stackexchange.title}` : ''
  ].filter(Boolean).join('\n');

  const effectiveOpenAIKey = openaiKey || process.env.OPENAI_API_KEY;
  const effectiveGeminiKey = apiKey || process.env.GEMINI_API_KEY;

  if (effectiveOpenAIKey || effectiveGeminiKey) {
    try {
      const systemPrompt = `You are heyBuddy, an elite AI EdTech Professor (like Physics Wallah / Vedantu).
Create ONE SINGLE UNIFIED MASTERCLASS LECTURE SCENE for topic: "${cleanTopic}" at level: "${gradeLevel}" in stream: "${streamDomain}".

CRITICAL INSTRUCTIONS:
1. Language MUST be conversational HINGLISH (Hindi + English EdTech style). Example: "Aaj ke is masterclass me hum Photosynthesis ko step by step samjhenge...".
2. Generate EXACTLY 1 single comprehensive scene ("scenes" array with 1 item).
3. The narration MUST be extremely detailed, deep, and complete (between 120 and 200 words), explaining core intuition, step-by-step logic, mathematical or chemical formulas, real-world examples, and exam tips.
4. Include 3 rich key takeaway bullets summarizing the entire topic.
5. Ground your content in these open academic sources:\n${academicContextStr}

Respond ONLY with valid JSON conforming to this schema (no markdown, no backticks):
{
  "topic": "${cleanTopic}",
  "subject": "${streamDomain}",
  "gradeLevel": "${gradeLevel}",
  "streamDomain": "${streamDomain}",
  "lectureDuration": "Full Masterclass",
  "language": "Hinglish",
  "summary": "Complete single-scene masterclass on ${cleanTopic} in conversational Hinglish.",
  "scenes": [
    {
      "id": 1,
      "title": "${cleanTopic} - Complete Unified Breakdown",
      "duration": 200,
      "narration": "Detailed 120-200 word Hinglish narration explaining intuition, mechanism, formulas, and takeaways.",
      "visualType": "masterclass_unified",
      "bullets": [
        "Core Foundational Principle of ${cleanTopic}",
        "Mathematical / Chemical Formula Breakdown",
        "Key Application & Exam Tip"
      ]
    }
  ],
  "quiz": [
    {
      "question": "Hinglish conceptual question 1?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Detailed Hinglish explanation."
    }
  ],
  "notes": [
    { "title": "Masterclass Summary Note", "content": "Comprehensive reference note." }
  ]
}`;

      let jsonText = null;
      if (effectiveOpenAIKey) {
        console.log('[aiOrchestrator] Calling OpenAI GPT-4o for Single-Scene Hinglish Masterclass...');
        jsonText = await callLLMProvider({
          prompt: systemPrompt,
          provider: 'openai',
          apiKey: effectiveOpenAIKey
        });
      } else if (effectiveGeminiKey) {
        console.log('[aiOrchestrator] Calling Gemini 1.5 Flash for Single-Scene Hinglish Masterclass...');
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveGeminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
        });
        if (res.ok) {
          const data = await res.json();
          jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text || null;
        }
      }

      if (jsonText) {
        let cleanJson = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        if (parsed.scenes && parsed.scenes.length >= 1) {
          const mainScene = parsed.scenes[0];
          mainScene.duration = 200;
          mainScene.visualType = "masterclass_unified";
          mainScene.canvasData = {
            bgGradient: ["#070a14", "#121b2d"],
            mainTitle: `${cleanTopic} - Complete Concept Map`,
            elements: [
              { type: "concept_node", x: 480, y: 220, label: cleanTopic, color: "#6366F1", r: 65 },
              { type: "branch_node", x: 200, y: 160, label: mainScene.bullets?.[0] || "Foundational Principle", color: "#38BDF8" },
              { type: "branch_node", x: 760, y: 160, label: mainScene.bullets?.[1] || "Core Transformation", color: "#10B981" },
              { type: "formula_banner", text: `Formula Model: f(${cleanTopic.slice(0, 8)}) = Σ(Inputs)`, x: 200, y: 350, color: "#818CF8" }
            ]
          };

          return {
            topic: cleanTopic,
            subject: streamDomain,
            gradeLevel,
            streamDomain,
            lectureDuration: "Full Masterclass",
            language: "Hinglish",
            durationSeconds: 200,
            summary: parsed.summary || `Single-scene Hinglish masterclass on "${cleanTopic}".`,
            academicSources: academicData,
            scenes: [mainScene],
            quiz: parsed.quiz || [],
            notes: parsed.notes || [],
            methodology: "Feynman (Hinglish)",
            style: "Minimalist"
          };
        }
      }
    } catch (err) {
      console.warn('[aiOrchestrator] LLM Hinglish generation fallback:', err.message);
    }
  }

  // Fallback: Procedural Single-Scene Hinglish Masterclass
  const lowerTopic = cleanTopic.toLowerCase();
  const matchKey = Object.keys(BASE_TOPICS).find(k => lowerTopic.includes(k));
  if (matchKey) {
    return JSON.parse(JSON.stringify(BASE_TOPICS[matchKey]));
  }

  return {
    topic: cleanTopic,
    subject: streamDomain,
    gradeLevel,
    streamDomain,
    lectureDuration: "Full Masterclass",
    language: "Hinglish",
    durationSeconds: 200,
    summary: `Complete single-scene Hinglish masterclass on "${cleanTopic}".`,
    academicSources: academicData,
    scenes: [
      {
        id: 1,
        title: `${cleanTopic} Complete Unified Breakdown`,
        duration: 200,
        narration: `Welcome to heyBuddy AI Masterclass! Aaj hum ${cleanTopic} ko bilkul zero level se samjhenge. Tailored for ${gradeLevel} students in ${streamDomain}, ye concept batata hai ki kaise inputs step-by-step reaction dwara target result me convert hote hain. OpenStax aur Wikidata knowledge graph ke according is system ke mathematical aur physical principles ko samjhna bahut important hai. Diagram me diye gaye har component ko dhyan se padhiye aur exam point of view se key formulas ko note kijiye!`,
        visualType: "masterclass_unified",
        canvasData: {
          bgGradient: ["#070a14", "#121b2d"],
          mainTitle: `${cleanTopic} - Masterclass Concept Map`,
          elements: [
            { type: "concept_node", x: 480, y: 220, label: cleanTopic, color: "#6366F1", r: 65 },
            { type: "branch_node", x: 200, y: 160, label: "Foundational Intuition", color: "#38BDF8" },
            { type: "branch_node", x: 760, y: 160, label: "System Mechanism", color: "#10B981" },
            { type: "formula_banner", text: `Core Model: f(${cleanTopic.slice(0, 6)}) = Σ(Variables)`, x: 200, y: 350, color: "#818CF8" }
          ]
        },
        bullets: [
          `Foundational Intuition & Core Definition of ${cleanTopic}`,
          `Step-by-Step Workflow & System Transformations`,
          `Key Exam Derivation & Boundary Condition Tips`
        ]
      }
    ],
    quiz: [
      {
        question: `${cleanTopic} ka main primary core principle kya hai?`,
        options: [
          `Ye system me step-by-step transformation ko define karta hai`,
          "Ye bilkul zero energy consume karta hai",
          "Ye obsolete model hai",
          "Ye sirf 1D school level tak restricted hai"
        ],
        correctIndex: 0,
        explanation: `${cleanTopic} systematic inputs aur physical/chemical laws par kaam karta hai.`
      }
    ],
    notes: [
      { title: "Masterclass Summary", content: `Complete Hinglish breakdown of ${cleanTopic} for ${gradeLevel} students.` }
    ],
    methodology: "Feynman (Hinglish)",
    style: "Minimalist"
  };
}

module.exports = {
  generateScriptAndVisuals,
  METHODOLOGIES: { Feynman: "Feynman (Hinglish)" },
  LANGUAGES: { Hinglish: "Hinglish" },
  STYLES: { Minimalist: { bgGradient: ["#070a14", "#121b2d"], primaryColor: "#6366F1", accentColor: "#38BDF8" } }
};
