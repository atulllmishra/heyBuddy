const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Pre-built rich procedural templates for popular topics (Instant fallback)
const PROCEDURAL_TOPICS = {
  "photosynthesis": {
    topic: "Photosynthesis & Light-Dependent Reactions",
    subject: "Biology / Biochemistry",
    gradeLevel: "High School / College",
    durationSeconds: 45,
    summary: "How plants transform light energy into chemical energy stored in glucose.",
    scenes: [
      {
        id: 1,
        title: "The Solar Factory of Nature",
        duration: 10,
        narration: "Welcome to heyBuddy AI Biology! Photosynthesis occurs inside plant chloroplasts, turning sunlight, water, and carbon dioxide into oxygen and sugar.",
        visualType: "diagram",
        canvasData: {
          bgGradient: ["#091E12", "#052E16"],
          mainTitle: "Photosynthesis Overview",
          elements: [
            { type: "sun", x: 150, y: 120, radius: 45, color: "#FBBF24", glow: true, label: "Sunlight (hν)" },
            { type: "leaf", x: 480, y: 260, width: 220, height: 160, color: "#10B981" },
            { type: "molecule", x: 180, y: 320, name: "6 H₂O", color: "#3B82F6" },
            { type: "molecule", x: 180, y: 380, name: "6 CO₂", color: "#9CA3AF" },
            { type: "arrow", from: [220, 150], to: [420, 240], color: "#FBBF24", label: "Light Energy" },
            { type: "arrow", from: [230, 320], to: [400, 300], color: "#60A5FA", label: "Absorption" },
            { type: "output", x: 700, y: 240, name: "6 O₂ (Oxygen Released)", color: "#34D399" },
            { type: "output", x: 700, y: 340, name: "C₆H₁₂O₆ (Glucose Sugar)", color: "#F59E0B" }
          ]
        },
        bullets: ["Location: Chloroplast Thylakoids & Stroma", "Inputs: Light + Water + CO₂", "Outputs: Oxygen + Glucose Sugar"]
      },
      {
        id: 2,
        title: "Inside the Chloroplast & Thylakoids",
        duration: 12,
        narration: "Zooming inside the plant cell, we find disc-like thylakoids stacked into grana. Light hits chlorophyll pigments in Photosystem II, exciting electrons to high energy states.",
        visualType: "particle_flow",
        canvasData: {
          bgGradient: ["#022C22", "#064E3B"],
          mainTitle: "Thylakoid Membrane & Photosystem II",
          elements: [
            { type: "membrane", y: 280, color: "#059669", label: "Thylakoid Membrane" },
            { type: "complex", x: 260, y: 230, width: 90, height: 100, name: "Photosystem II (P680)", color: "#10B981" },
            { type: "complex", x: 480, y: 230, width: 90, height: 100, name: "Electron Transport", color: "#0D9488" },
            { type: "complex", x: 700, y: 230, width: 90, height: 100, name: "ATP Synthase", color: "#F59E0B" },
            { type: "electron_pulse", path: [[260, 200], [480, 200], [700, 200]], color: "#FDE047" },
            { type: "water_split", x: 240, y: 370, label: "2H₂O  →  4H⁺ + O₂ + 4e⁻" }
          ]
        },
        bullets: ["Photolysis: Water molecules split releasing O₂", "Chlorophyll P680 absorbs photon wavelength 680nm", "Excited electrons jump along Electron Transport Chain"]
      },
      {
        id: 3,
        title: "Generating ATP & NADPH for Calvin Cycle",
        duration: 11,
        narration: "As electrons move, hydrogen ions build up a chemical gradient. ATP Synthase spins like a nano-turbine, forging ATP and NADPH energy carriers to power sugar creation.",
        visualType: "turbine_synth",
        canvasData: {
          bgGradient: ["#111827", "#1E1B4B"],
          mainTitle: "Chemiosmosis & Energy Charge",
          elements: [
            { type: "gradient_box", x: 150, y: 150, w: 500, h: 220, label: "Proton Gradient (H+ Accumulation)" },
            { type: "math_formula", text: "ADP + Pi + Energy  →  ATP", x: 220, y: 220, color: "#F59E0B" },
            { type: "math_formula", text: "NADP⁺ + H⁺ + 2e⁻  →  NADPH", x: 220, y: 280, color: "#EC4899" }
          ]
        },
        bullets: ["Proton motive force drives ATP Synthase rotation", "ATP and NADPH travel to Calvin Cycle in the stroma", "Light-independent phase uses CO₂ to construct Glucose"]
      },
      {
        id: 4,
        title: "Key Takeaways & Summary",
        duration: 12,
        narration: "To recap: Light energy splits water, releases oxygen, generates ATP and NADPH, which then convert carbon dioxide into life-sustaining sugar!",
        visualType: "summary_card",
        canvasData: {
          bgGradient: ["#0F172A", "#1E293B"],
          mainTitle: "Photosynthesis Equation Summary",
          elements: [
            { type: "formula_banner", text: "6 CO₂  +  6 H₂O  +  Light   →   C₆H₁₂O₆  +  6 O₂", x: 120, y: 240, color: "#6366F1" }
          ]
        },
        bullets: ["Light Reactions: Thylakoid (Produces O₂, ATP, NADPH)", "Calvin Cycle: Stroma (Fixes CO₂ into Glucose)", "Essential for all life on Earth"]
      }
    ],
    quiz: [
      {
        question: "Where do the light-dependent reactions of photosynthesis take place?",
        options: ["Stroma", "Thylakoid Membrane", "Mitochondria", "Cell Wall"],
        correctIndex: 1,
        explanation: "Light-dependent reactions occur within the thylakoid membranes where chlorophyll pigments are embedded."
      },
      {
        question: "What byproduct is released when water molecules split during photolysis?",
        options: ["Carbon Dioxide", "Glucose", "Oxygen Gas (O₂)", "Nitrogen"],
        correctIndex: 2,
        explanation: "When 2 H₂O molecules split at Photosystem II, 4 electrons, 4 protons, and O₂ oxygen gas are produced."
      },
      {
        question: "What two energy-rich products from light reactions power the Calvin Cycle?",
        options: ["ATP & NADPH", "Glucose & Pyruvate", "DNA & RNA", "CO₂ & Water"],
        correctIndex: 0,
        explanation: "ATP and NADPH chemical energy carriers generated during light reactions fuel carbon fixation in the Calvin Cycle."
      }
    ],
    notes: [
      { title: "Net Chemical Reaction", content: "6 CO₂ + 6 H₂O + Light Energy → C₆H₁₂O₆ + 6 O₂" },
      { title: "Photosystem II & I", content: "PSII absorbs 680nm light; PSI absorbs 700nm light. Both operate in tandem." },
      { title: "Chemiosmosis", content: "Proton accumulation in thylakoid lumen drives ATP Synthase rotor." }
    ]
  },
  "newton": {
    topic: "Newton's Three Laws of Motion & Vector Mechanics",
    subject: "Physics",
    gradeLevel: "High School / College",
    durationSeconds: 40,
    summary: "Master Inertia, F=ma force vectors, and Action-Reaction pair dynamics.",
    scenes: [
      {
        id: 1,
        title: "First Law: The Law of Inertia",
        duration: 10,
        narration: "Welcome to Physics with heyBuddy AI! Newton's First Law states an object remains at rest or in uniform motion unless acted upon by a net external force.",
        visualType: "physics_inertia",
        canvasData: {
          bgGradient: ["#0F172A", "#1E1B4B"],
          mainTitle: "1st Law: Inertia (ΣF = 0)",
          elements: [
            { type: "surface", y: 360, color: "#475569" },
            { type: "box", x: 280, y: 280, w: 120, h: 80, color: "#6366F1", label: "Mass (m)" },
            { type: "vector_arrow", from: [340, 320], to: [340, 420], color: "#EF4444", label: "Fg = mg (Gravity)" },
            { type: "vector_arrow", from: [340, 320], to: [340, 220], color: "#10B981", label: "Fn (Normal Force)" },
            { type: "equation", text: "Net Force ΣF = Fn - Fg = 0 N", x: 500, y: 280 }
          ]
        },
        bullets: ["Objects resist changes in velocity", "Inertia is directly proportional to mass", "Zero Net Force = Constant Velocity"]
      },
      {
        id: 2,
        title: "Second Law: Force, Mass & Acceleration (F = ma)",
        duration: 10,
        narration: "Newton's Second Law quantifies motion. Acceleration is directly proportional to net force and inversely proportional to mass: F equals m times a.",
        visualType: "force_vectors",
        canvasData: {
          bgGradient: ["#172554", "#1E3A8A"],
          mainTitle: "2nd Law: F = m · a",
          elements: [
            { type: "box_animated", x: 300, y: 260, w: 100, h: 80, color: "#3B82F6", label: "m = 5 kg" },
            { type: "vector_arrow", from: [400, 300], to: [600, 300], color: "#F59E0B", label: "F_applied = 50 N →" },
            { type: "vector_arrow", from: [300, 300], to: [220, 300], color: "#EC4899", label: "F_friction = 10 N ←" },
            { type: "math_formula", text: "F_net = 50 - 10 = 40 N", x: 260, y: 160 },
            { type: "math_formula", text: "a = F_net / m = 40 / 5 = 8 m/s²", x: 260, y: 210, color: "#10B981" }
          ]
        },
        bullets: ["Double the force → Double the acceleration", "Double the mass → Half the acceleration", "Vector quantities: Direction matters!"]
      },
      {
        id: 3,
        title: "Third Law: Action & Reaction Pairs",
        duration: 10,
        narration: "For every action force, there is an equal and opposite reaction force. Forces always occur in simultaneous interaction pairs on separate bodies.",
        visualType: "action_reaction",
        canvasData: {
          bgGradient: ["#2E1065", "#4C1D95"],
          mainTitle: "3rd Law: Action = -Reaction",
          elements: [
            { type: "rocket", x: 420, y: 180, w: 80, h: 180 },
            { type: "thrust_particles", x: 460, y: 360, color: "#F97316" },
            { type: "vector_arrow", from: [460, 360], to: [460, 460], color: "#EF4444", label: "Action: Exhaust Gas Pushed Down" },
            { type: "vector_arrow", from: [460, 200], to: [460, 90], color: "#10B981", label: "Reaction: Rocket Thrust Pushed Up" }
          ]
        },
        bullets: ["Forces act on TWO DIFFERENT objects", "Equal in magnitude | Opposite in direction", "Enables rocket propulsion in vacuum space"]
      },
      {
        id: 4,
        title: "Summary & Practical Applications",
        duration: 10,
        narration: "From car seatbelts using inertia, to rocket engine launch vectors, Newton's laws govern all classical mechanical physics!",
        visualType: "summary_card",
        canvasData: {
          bgGradient: ["#0F172A", "#1E293B"],
          mainTitle: "Newtonian Dynamics Summary",
          elements: [
            { type: "summary_grid", items: ["1st: Inertia (Maintain State)", "2nd: F = m·a (Force Equation)", "3rd: F₁₂ = -F₂₁ (Interaction Pairs)"] }
          ]
        },
        bullets: ["SI Unit of Force: Newton (1 N = 1 kg·m/s²)", "Key for engineers, astrophysicists, and sports dynamics"]
      }
    ],
    quiz: [
      {
        question: "If a net force of 30 N is applied to a 6 kg object, what is its acceleration?",
        options: ["180 m/s²", "5 m/s²", "0.2 m/s²", "36 m/s²"],
        correctIndex: 1,
        explanation: "Using F = m·a → a = F / m = 30 N / 6 kg = 5 m/s²."
      },
      {
        question: "Why don't action-reaction force pairs cancel each other out to zero motion?",
        options: [
          "Because one force is always stronger",
          "Because they act at different times",
          "Because they act on two different bodies",
          "Because friction absorbs one of the forces"
        ],
        correctIndex: 2,
        explanation: "Action and reaction forces act on separate objects, so they do not add together on a single free body diagram."
      }
    ],
    notes: [
      { title: "Newton's 1st Law", content: "Law of Inertia: Equilibrium occurs when ΣF = 0." },
      { title: "Newton's 2nd Law", content: "F_net = m · a. Acceleration is in the direction of net force vector." },
      { title: "Newton's 3rd Law", content: "F_A_on_B = -F_B_on_A." }
    ]
  },
  "quantum": {
    topic: "Quantum Entanglement & Superposition",
    subject: "Quantum Physics",
    gradeLevel: "College / Advanced",
    durationSeconds: 45,
    summary: "Discover spooky action at a distance, wave function collapse, and qubit entanglement.",
    scenes: [
      {
        id: 1,
        title: "The Mystery of Superposition",
        duration: 11,
        narration: "Welcome to Quantum Physics! Before measurement, a quantum particle like an electron exists in a superposition of multiple states simultaneously, described by a probability wave function |Ψ⟩.",
        visualType: "wavefunction",
        canvasData: {
          bgGradient: ["#030712", "#1E1B4B"],
          mainTitle: "Quantum Superposition: |Ψ⟩ = α|0⟩ + β|1⟩",
          elements: [
            { type: "quantum_particle", x: 450, y: 260, r: 40, spin: "both", color: "#8B5CF6" },
            { type: "wave_sine", x: 150, y: 380, width: 600, color: "#06B6D4" },
            { type: "label_box", text: "Spin-Up |↑⟩ & Spin-Down |↓⟩ coexist until measured", x: 280, y: 150 }
          ]
        },
        bullets: ["Schrödinger equation governs wave function evolution", "Probability amplitudes α and β where |α|² + |β|² = 1", "Measurement forces collapse into a definite eigenstate"]
      },
      {
        id: 2,
        title: "Creating Entangled Photons",
        duration: 11,
        narration: "When two subatomic particles interact, their quantum states can become inextricably linked. Measuring state A instantly determines state B, even across light-years!",
        visualType: "entangled_pair",
        canvasData: {
          bgGradient: ["#090514", "#2E1065"],
          mainTitle: "Bell State: (|00⟩ + |11⟩) / √2",
          elements: [
            { type: "particle", x: 260, y: 270, color: "#EC4899", label: "Particle A (Alice)" },
            { type: "particle", x: 640, y: 270, color: "#3B82F6", label: "Particle B (Bob)" },
            { type: "entangle_beam", from: [260, 270], to: [640, 270], color: "#F43F5E" },
            { type: "equation", text: "Correlation Coefficient = 100%", x: 340, y: 160 }
          ]
        },
        bullets: ["Einstein called it 'Spooky Action at a Distance'", "Violates local realism (Bell's Theorem)", "Fundamental basis for Quantum Computing & Cryptography"]
      },
      {
        id: 3,
        title: "Wave Function Collapse & Teleportation",
        duration: 11,
        narration: "If Alice measures particle A as Spin-Up, Bob's entangled particle B instantly collapses into Spin-Down. No faster-than-light data is sent, preserving special relativity!",
        visualType: "collapse_demo",
        canvasData: {
          bgGradient: ["#020617", "#0F172A"],
          mainTitle: "Quantum Measurement & State Collapse",
          elements: [
            { type: "detector", x: 260, y: 230, label: "Detector: Spin-Up ↑" },
            { type: "instant_arrow", from: [300, 270], to: [600, 270], label: "Instantaneous Correlation" },
            { type: "collapsed_state", x: 640, y: 270, label: "Spin-Down ↓ (Determined)" }
          ]
        },
        bullets: ["No FTL communication: Quantum Information requires classical channel", "Basis of QKD (Quantum Key Distribution)", "No-Cloning Theorem prevents copying unknown quantum states"]
      },
      {
        id: 4,
        title: "Summary & Quantum Technologies",
        duration: 12,
        narration: "Quantum entanglement powers future technology: quantum computers, ultra-secure encryption, and atomic clock synchronization!",
        visualType: "summary_card",
        canvasData: {
          bgGradient: ["#0F172A", "#1E293B"],
          mainTitle: "Quantum Mechanics Summary",
          elements: [
            { type: "tech_list", items: ["1. Qubits (Superposition)", "2. Bell States (Entanglement)", "3. Quantum Cryptography"] }
          ]
        },
        bullets: ["Bell Test Experiments won 2022 Nobel Prize in Physics", "Superposition allows 2^N state computing parallelism"]
      }
    ],
    quiz: [
      {
        question: "What happens to an entangled particle B when particle A is measured?",
        options: [
          "Particle B takes 1 second to update",
          "Particle B instantly collapses into a correlated quantum state",
          "Particle B gets destroyed",
          "Nothing happens until Bob turns on his machine"
        ],
        correctIndex: 1,
        explanation: "Measuring particle A instantly collapses the joint wave function, determining particle B's outcome."
      }
    ],
    notes: [
      { title: "Superposition", content: "|Ψ⟩ = α|0⟩ + β|1⟩ where probabilities sum to 1." },
      { title: "Entanglement", content: "Composite state cannot be factored into individual particle states." }
    ]
  }
};

// Generic generator for custom user prompts if topic is not pre-packaged
function createCustomProceduralVideo(topic, gradeLevel, style) {
  const cleanTopic = topic.trim();
  return {
    topic: cleanTopic,
    subject: "Custom AI Course",
    gradeLevel: gradeLevel || "School / College",
    durationSeconds: 40,
    summary: `Interactive AI Video Breakdown for "${cleanTopic}" tailored for ${gradeLevel || 'all learning levels'}.`,
    scenes: [
      {
        id: 1,
        title: `Introduction to ${cleanTopic}`,
        duration: 10,
        narration: `Hello and welcome to heyBuddy AI! Today we are exploring ${cleanTopic}. Let's break down the foundational concepts step by step.`,
        visualType: "diagram",
        canvasData: {
          bgGradient: ["#0F172A", "#1E1B4B"],
          mainTitle: cleanTopic,
          elements: [
            { type: "concept_node", x: 450, y: 250, label: cleanTopic, color: "#6366F1", r: 65 },
            { type: "branch_node", x: 220, y: 180, label: "Core Principles", color: "#3B82F6" },
            { type: "branch_node", x: 680, y: 180, label: "Key Components", color: "#10B981" },
            { type: "branch_node", x: 450, y: 400, label: "Real-World Impact", color: "#EC4899" }
          ]
        },
        bullets: [`Definition and core context of ${cleanTopic}`, "Key terminology and baseline parameters", "Why this concept is crucial in modern study"]
      },
      {
        id: 2,
        title: "Mechanism & Core Principles",
        duration: 10,
        narration: `Understanding how ${cleanTopic} operates requires looking at the step-by-step workflow and underlying system mechanics.`,
        visualType: "process_flow",
        canvasData: {
          bgGradient: ["#022C22", "#0F172A"],
          mainTitle: "System Mechanics & Dynamics",
          elements: [
            { type: "flow_step", x: 180, y: 270, title: "Step 1: Input / Trigger", color: "#F59E0B" },
            { type: "flow_step", x: 450, y: 270, title: "Step 2: Processing / Core Reaction", color: "#6366F1" },
            { type: "flow_step", x: 720, y: 270, title: "Step 3: Final Output / Result", color: "#10B981" },
            { type: "arrow", from: [280, 270], to: [360, 270], color: "#94A3B8" },
            { type: "arrow", from: [550, 270], to: [630, 270], color: "#94A3B8" }
          ]
        },
        bullets: ["Sequential operation flow", "Interactions between active variables", "Key energy or information conversion"]
      },
      {
        id: 3,
        title: "Deep Dive & Examples",
        duration: 10,
        narration: `Let's examine a practical example of ${cleanTopic} in action to cement your intuition.`,
        visualType: "formula_demo",
        canvasData: {
          bgGradient: ["#172554", "#311B92"],
          mainTitle: "Analytical Breakdown & Examples",
          elements: [
            { type: "formula_banner", text: `Formula / Model: f(${cleanTopic.slice(0, 5)}) = Σ(Inputs)`, x: 220, y: 220, color: "#38BDF8" },
            { type: "example_box", text: "Case Study: Applied in problem-solving & exam scenarios", x: 220, y: 310, color: "#A78BFA" }
          ]
        },
        bullets: ["Formula / Logic derivation", "Common pitfalls to avoid in exams", "Analogy for quick retention"]
      },
      {
        id: 4,
        title: "Key Summary & Review",
        duration: 10,
        narration: `In summary, mastering ${cleanTopic} gives you a powerful tool for your studies. Review the notes and attempt the quiz below!`,
        visualType: "summary_card",
        canvasData: {
          bgGradient: ["#0F172A", "#1E293B"],
          mainTitle: `${cleanTopic} - Key Takeaways`,
          elements: [
            { type: "summary_grid", items: ["1. Remember Core Concept", "2. Master Step-by-Step Flow", "3. Practice Quiz Problems"] }
          ]
        },
        bullets: ["Main takeaway points locked in", "Ready for quiz assessment", "Use heyBuddy AI Chat for follow-up questions"]
      }
    ],
    quiz: [
      {
        question: `What is the primary core principle of ${cleanTopic}?`,
        options: [
          `It defines the core mechanism and step-by-step operation of ${cleanTopic}`,
          "It is an obsolete rule with no modern application",
          "It only applies to historical events",
          "It requires zero input energy or variables"
        ],
        correctIndex: 0,
        explanation: `Understanding ${cleanTopic} relies on identifying its primary mechanism and core variables.`
      },
      {
        question: `How does ${cleanTopic} transform inputs into final results?`,
        options: [
          "Through a structured multi-step process",
          "By random chance without any pattern",
          "It cannot produce any output",
          "Only when stored at absolute zero temperature"
        ],
        correctIndex: 0,
        explanation: `${cleanTopic} follows systematic processing steps to generate consistent outputs.`
      }
    ],
    notes: [
      { title: `Core Overview`, content: `Summary breakdown of ${cleanTopic} for ${gradeLevel || 'students'}.` },
      { title: `Exam Formula / Tip`, content: `Remember to state assumptions clearly and trace input-output vectors.` }
    ]
  };
}

// API Routes
app.post('/api/generate-video', async (req, res) => {
  try {
    const { topic, gradeLevel = 'High School', style = 'Visual', apiKey } = req.body;
    
    if (!topic || topic.trim() === '') {
      return res.status(400).json({ error: 'Please enter a valid topic or question.' });
    }

    const lowerTopic = topic.toLowerCase();

    // Check if user topic matches our rich pre-built topics
    let matchingKey = Object.keys(PROCEDURAL_TOPICS).find(k => lowerTopic.includes(k));
    
    if (matchingKey) {
      console.log(`[heyBuddy] Serving procedural topic: ${matchingKey}`);
      return res.json({ success: true, data: PROCEDURAL_TOPICS[matchingKey], source: 'procedural_library' });
    }

    // Try Gemini API if key is provided (or process.env.GEMINI_API_KEY)
    const effectiveKey = apiKey || process.env.GEMINI_API_KEY;
    if (effectiveKey) {
      try {
        console.log(`[heyBuddy] Calling Gemini API for custom topic: ${topic}`);
        const prompt = `You are heyBuddy, an expert AI EdTech Video Producer. Generate a complete structured JSON response for an educational video explaining the topic "${topic}" tailored for ${gradeLevel} students with learning style "${style}".
Respond ONLY with valid JSON (no markdown fences, no extra text) conforming to this exact schema:
{
  "topic": "${topic}",
  "subject": "STEM / Science / General",
  "gradeLevel": "${gradeLevel}",
  "durationSeconds": 40,
  "summary": "Brief summary",
  "scenes": [
    {
      "id": 1,
      "title": "Scene 1 Title",
      "duration": 10,
      "narration": "Speech script to be read by voice narrator explaining this step.",
      "visualType": "diagram",
      "canvasData": {
        "bgGradient": ["#0F172A", "#1E1B4B"],
        "mainTitle": "Scene Title",
        "elements": [
          { "type": "concept_node", "x": 450, "y": 250, "label": "Main Idea", "color": "#6366F1", "r": 60 },
          { "type": "branch_node", "x": 250, "y": 200, "label": "Detail A", "color": "#3B82F6" },
          { "type": "branch_node", "x": 650, "y": 200, "label": "Detail B", "color": "#10B981" }
        ]
      },
      "bullets": ["Bullet point 1", "Bullet point 2"]
    },
    {
      "id": 2,
      "title": "Scene 2 Title",
      "duration": 10,
      "narration": "Narration for step 2",
      "visualType": "process_flow",
      "canvasData": {
        "bgGradient": ["#022C22", "#0F172A"],
        "mainTitle": "Process Flow",
        "elements": [
          { "type": "flow_step", "x": 200, "y": 270, "title": "Start", "color": "#F59E0B" },
          { "type": "flow_step", "x": 500, "y": 270, "title": "Transform", "color": "#6366F1" },
          { "type": "flow_step", "x": 750, "y": 270, "title": "Output", "color": "#10B981" }
        ]
      },
      "bullets": ["Step 1 explanation", "Step 2 explanation"]
    },
    {
      "id": 3,
      "title": "Scene 3 Title",
      "duration": 10,
      "narration": "Narration for key formula or deep dive",
      "visualType": "formula_demo",
      "canvasData": {
        "bgGradient": ["#172554", "#311B92"],
        "mainTitle": "Formula & Equation",
        "elements": [
          { "type": "formula_banner", "text": "Core Equation", "x": 250, "y": 240, "color": "#38BDF8" }
        ]
      },
      "bullets": ["Formula component 1", "Formula component 2"]
    },
    {
      "id": 4,
      "title": "Summary & Takeaways",
      "duration": 10,
      "narration": "Summary narration wrapping up the lesson.",
      "visualType": "summary_card",
      "canvasData": {
        "bgGradient": ["#0F172A", "#1E293B"],
        "mainTitle": "Key Takeaways",
        "elements": [
          { "type": "summary_grid", "items": ["Key Point 1", "Key Point 2", "Key Point 3"] }
        ]
      },
      "bullets": ["Final takeaway 1", "Final takeaway 2"]
    }
  ],
  "quiz": [
    {
      "question": "Sample Question 1?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why Option A is correct."
    }
  ],
  "notes": [
    { "title": "Summary Note 1", "content": "Important note content." }
  ]
}`;

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          let textRes = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
          textRes = textRes.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(textRes);
          return res.json({ success: true, data: parsed, source: 'gemini_ai' });
        }
      } catch (err) {
        console.warn(`[heyBuddy] Gemini API call failed or parse error, falling back to procedural engine:`, err.message);
      }
    }

    // Fallback to custom procedural video generator
    console.log(`[heyBuddy] Generating custom procedural video for: ${topic}`);
    const customVideo = createCustomProceduralVideo(topic, gradeLevel, style);
    return res.json({ success: true, data: customVideo, source: 'procedural_engine' });

  } catch (error) {
    console.error('[heyBuddy] Error generating video:', error);
    res.status(500).json({ error: 'Failed to generate AI video. Please try again.' });
  }
});

// Doubt Solver AI Endpoint
app.post('/api/chat-doubt', async (req, res) => {
  try {
    const { question, topic, timestamp, apiKey } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const effectiveKey = apiKey || process.env.GEMINI_API_KEY;
    if (effectiveKey) {
      try {
        const prompt = `You are heyBuddy, an enthusiastic, friendly AI tutor. A student is watching an AI video on "${topic || 'General Topic'}" (around timestamp ${timestamp || '0:00'}) and has asked this doubt:
"${question}"

Give a clear, encouraging 2-3 paragraph explanation using intuitive analogies, bullet points, and step-by-step clarity. Keep your tone engaging and easy to digest!`;

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return res.json({ answer: text });
          }
        }
      } catch (err) {
        console.warn('[heyBuddy] Gemini chat failed, using intelligent tutor template:', err.message);
      }
    }

    // Intelligent Fallback Tutor Response
    const fallbackAnswer = `Great question! When studying **${topic || 'this concept'}** around ${timestamp || 'this scene'}, it's helpful to remember:

• **Core Intuition:** Think of this step as an exchange where energy or information is transferred cleanly between states.
• **Key Concept:** The reason this occurs is to maintain balance (equilibrium or conservation principles).
• **Exam Tip:** Whenever you encounter questions about "${question.slice(0, 30)}...", always trace the initial inputs first, then check the net forces or chemical balance!

Feel free to ask me to elaborate on any specific step or formula! 🚀`;

    res.json({ answer: fallbackAnswer });

  } catch (error) {
    res.status(500).json({ error: 'Failed to process doubt chat.' });
  }
});

// Curated Sample Topics Endpoint
app.get('/api/sample-topics', (req, res) => {
  res.json([
    { id: 'photosynthesis', title: 'Photosynthesis & Light Reactions', category: 'Biology', icon: '🌱' },
    { id: 'newton', title: "Newton's 3 Laws of Motion", category: 'Physics', icon: '🚀' },
    { id: 'quantum', title: 'Quantum Entanglement & Superposition', category: 'Quantum Physics', icon: '⚛️' }
  ]);
});

app.listen(PORT, () => {
  console.log(`\n🚀 heyBuddy AI EdTech Platform running at http://localhost:${PORT}`);
});
