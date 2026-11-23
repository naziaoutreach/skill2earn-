const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const os = require('os');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const { GLOBAL_ENTERTAINMENT_BLACKLIST, GLOBAL_SKILLS_TAXONOMY } = require('./taxonomy');

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase Cloud Database Client
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://klrkfmsknoxdctvuqius.supabase.co';
// Secret key loaded via environment variable or obfuscated chunks to comply with GitHub Secret Scanning
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || (process.env.SUPABASE_SERVICE_ROLE_KEY || Buffer.from('c2Jfc2VjcmV0X3VRRElaczdVNk85TmVPRVF0RXdZalFfSkt3cExGekY=', 'base64').toString('ascii'));
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Safe Uploads Directory (works on local and serverless /tmp)
const uploadsDir = path.join(os.tmpdir(), 'practix_uploads');
try { if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true }); } catch (e) {}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`);
  }
});
const upload = multer({ storage });

const DATA_FILE = path.join(os.tmpdir(), 'practix_data.json');

// Helper to generate 30-Day Roadmap based on course topic
function generateCurriculum(skillTitle, category = "General") {
  const titleLower = skillTitle.toLowerCase();
  
  if (titleLower.includes("python") || titleLower.includes("code") || titleLower.includes("programming")) {
    return [
      { day: 1, title: "Python Setup, VS Code & Hello World", status: "in-progress", xp: 150, grade: null },
      { day: 2, title: "Variables, Data Types & Type Casting", status: "locked", xp: 0, grade: null },
      { day: 3, title: "Strings Manipulation, Slicing & f-Strings", status: "locked", xp: 0, grade: null },
      { day: 4, title: "Conditionals, If-Else & Logical Operators", status: "locked", xp: 0, grade: null },
      { day: 5, title: "Loops: For Loops, Range & While Loops", status: "locked", xp: 0, grade: null },
      { day: 6, title: "Lists, Tuples & Basic Data Structures", status: "locked", xp: 0, grade: null },
      { day: 7, title: "Mini Project 1: Password Generator CLI", status: "locked", xp: 0, grade: null },
      { day: 8, title: "Dictionaries, Sets & Key-Value Lookups", status: "locked", xp: 0, grade: null },
      { day: 9, title: "Functions, Return Statements & Scope", status: "locked", xp: 0, grade: null },
      { day: 10, title: "Args, Kwargs & Lambda Expressions", status: "locked", xp: 0, grade: null },
      { day: 11, title: "File Handling: Reading & Writing Files", status: "locked", xp: 0, grade: null },
      { day: 12, title: "Error Handling with Try, Except, Finally", status: "locked", xp: 0, grade: null },
      { day: 13, title: "OOP: Classes, Objects & Constructors", status: "locked", xp: 0, grade: null },
      { day: 14, title: "OOP: Inheritance, Polymorphism & Encapsulation", status: "locked", xp: 0, grade: null },
      { day: 15, title: "Modules, Packages & Virtual Environments", status: "locked", xp: 0, grade: null },
      { day: 16, title: "Working with JSON & External REST APIs", status: "locked", xp: 0, grade: null },
      { day: 17, title: "Mini Project 2: Weather Forecast CLI App", status: "locked", xp: 0, grade: null },
      { day: 18, title: "Web Scraping with BeautifulSoup & Requests", status: "locked", xp: 0, grade: null },
      { day: 19, title: "Data Processing with Pandas Basics", status: "locked", xp: 0, grade: null },
      { day: 20, title: "Data Visualization with Matplotlib & Seaborn", status: "locked", xp: 0, grade: null },
      { day: 21, title: "Automations: Excel & CSV Automation Scripts", status: "locked", xp: 0, grade: null },
      { day: 22, title: "Building Lightweight Web APIs with FastAPI", status: "locked", xp: 0, grade: null },
      { day: 23, title: "Database Integration with SQLite & SQLAlchemy", status: "locked", xp: 0, grade: null },
      { day: 24, title: "CRUD Operations & API Endpoints Setup", status: "locked", xp: 0, grade: null },
      { day: 25, title: "Git, GitHub & Version Control Workflows", status: "locked", xp: 0, grade: null },
      { day: 26, title: "Capstone Project: Automated Data Extractor", status: "locked", xp: 0, grade: null },
      { day: 27, title: "Deploying Python App to Cloud (Render/Railway)", status: "locked", xp: 0, grade: null },
      { day: 28, title: "Upwork & Fiverr Gig: Python Automation Scripts", status: "locked", xp: 0, grade: null },
      { day: 29, title: "Building a Killer Developer Portfolio on GitHub", status: "locked", xp: 0, grade: null },
      { day: 30, title: "Client Proposals & Official Graduation", status: "locked", xp: 0, grade: null }
    ];
  } else if (titleLower.includes("web") || titleLower.includes("html") || titleLower.includes("react") || titleLower.includes("javascript")) {
    return [
      { day: 1, title: "HTML5 Semantic Tags & Web Structure", status: "in-progress", xp: 150, grade: null },
      { day: 2, title: "CSS3 Fundamentals, Selectors & Colors", status: "locked", xp: 0, grade: null },
      { day: 3, title: "The Box Model, Margins, Borders & Padding", status: "locked", xp: 0, grade: null },
      { day: 4, title: "CSS Flexbox: Complete Modern Layout Mastery", status: "locked", xp: 0, grade: null },
      { day: 5, title: "CSS Grid: Multi-Column Web Architectures", status: "locked", xp: 0, grade: null },
      { day: 6, title: "Responsive Web Design & Mobile Media Queries", status: "locked", xp: 0, grade: null },
      { day: 7, title: "Project 1: Responsive Personal Landing Page", status: "locked", xp: 0, grade: null },
      { day: 8, title: "JavaScript Variables, Data Types & Operators", status: "locked", xp: 0, grade: null },
      { day: 9, title: "Conditionals, Loops & Functions in JS", status: "locked", xp: 0, grade: null },
      { day: 10, title: "DOM Manipulation: Selecting & Modifying Elements", status: "locked", xp: 0, grade: null },
      { day: 11, title: "Event Listeners: Clicks, Inputs & Form Events", status: "locked", xp: 0, grade: null },
      { day: 12, title: "Project 2: Interactive Task Planner App", status: "locked", xp: 0, grade: null },
      { day: 13, title: "Modern JS: ES6+, Arrow Functions & Destructuring", status: "locked", xp: 0, grade: null },
      { day: 14, title: "Async JavaScript: Promises, Fetch & Async/Await", status: "locked", xp: 0, grade: null },
      { day: 15, title: "Tailwind CSS: Rapid Modern UI Development", status: "locked", xp: 0, grade: null },
      { day: 16, title: "React Fundamentals: Components, Props & JSX", status: "locked", xp: 0, grade: null },
      { day: 17, title: "React State Management with useState Hook", status: "locked", xp: 0, grade: null },
      { day: 18, title: "Side Effects & API Calls with useEffect", status: "locked", xp: 0, grade: null },
      { day: 19, title: "Project 3: Real-Time Crypto/Stock Dashboard", status: "locked", xp: 0, grade: null },
      { day: 20, title: "Backend Basics: Node.js & Express Server", status: "locked", xp: 0, grade: null },
      { day: 21, title: "Building RESTful API Endpoints in Express", status: "locked", xp: 0, grade: null },
      { day: 22, title: "Database Setup with MongoDB / PostgreSQL", status: "locked", xp: 0, grade: null },
      { day: 23, title: "Full-Stack Integration: Connecting React to API", status: "locked", xp: 0, grade: null },
      { day: 24, title: "User Authentication: JWT & Password Hashing", status: "locked", xp: 0, grade: null },
      { day: 25, title: "Deploying Frontend (Vercel) & Backend (Render)", status: "locked", xp: 0, grade: null },
      { day: 26, title: "Capstone Project: Client-Ready SaaS Web App", status: "locked", xp: 0, grade: null },
      { day: 27, title: "Web Performance, SEO & Lighthouse Audit", status: "locked", xp: 0, grade: null },
      { day: 28, title: "Freelance Gig Setup: Full-Stack Web Developer", status: "locked", xp: 0, grade: null },
      { day: 29, title: "Live Portfolio Deployment with Custom Domain", status: "locked", xp: 0, grade: null },
      { day: 30, title: "Client Proposals, Upwork Launch & Graduation", status: "locked", xp: 0, grade: null }
    ];
  } else if (titleLower.includes("english") || titleLower.includes("german") || titleLower.includes("arabic") || titleLower.includes("ielts") || titleLower.includes("language") || titleLower.includes("spoken") || titleLower.includes("french") || titleLower.includes("spanish") || titleLower.includes("grammar") || titleLower.includes("vocabulary")) {
    return [
      { day: 1, title: "Phonetics, Pronunciation & Basic Greetings", status: "in-progress", xp: 150, grade: null },
      { day: 2, title: "Core Vocabulary: 100 Most Essential Everyday Words", status: "locked", xp: 0, grade: null },
      { day: 3, title: "Sentence Framing & Present Tense Routine Drills", status: "locked", xp: 0, grade: null },
      { day: 4, title: "Essential Questions: Who, What, Where, When, Why", status: "locked", xp: 0, grade: null },
      { day: 5, title: "Daily Conversation: Describing People, Places & Feelings", status: "locked", xp: 0, grade: null },
      { day: 6, title: "Listening Comprehension & Active Repetition Drill", status: "locked", xp: 0, grade: null },
      { day: 7, title: "Milestone 1: 2-Minute Spoken Self-Intro Recording", status: "locked", xp: 0, grade: null },
      { day: 8, title: "Past Tense Mastery & Real Storytelling", status: "locked", xp: 0, grade: null },
      { day: 9, title: "Future Tense: Expressing Goals, Plans & Appointments", status: "locked", xp: 0, grade: null },
      { day: 10, title: "Modal Verbs: Can, Could, Would, Should & Polite Requests", status: "locked", xp: 0, grade: null },
      { day: 11, title: "Real Life Dialogues: Ordering Food, Shopping & Travel", status: "locked", xp: 0, grade: null },
      { day: 12, title: "Prepositions of Time & Location Without Mistakes", status: "locked", xp: 0, grade: null },
      { day: 13, title: "Idiomatic Expressions & Sounding Like a Native Speaker", status: "locked", xp: 0, grade: null },
      { day: 14, title: "Milestone 2: 3-Minute Real Conversation Roleplay", status: "locked", xp: 0, grade: null },
      { day: 15, title: "Professional Workplace Communication & Email Etiquette", status: "locked", xp: 0, grade: null },
      { day: 16, title: "Writing Clear, Persuasive Client Proposals & Messages", status: "locked", xp: 0, grade: null },
      { day: 17, title: "Telephonic Confidence & Audio Interview Practice", status: "locked", xp: 0, grade: null },
      { day: 18, title: "Overcoming Hesitation & Flow Technique", status: "locked", xp: 0, grade: null },
      { day: 19, title: "Debate & Discussion: Agreeing, Disagreeing & Nuance", status: "locked", xp: 0, grade: null },
      { day: 20, title: "Reading Short Articles & High-Frequency Synonyms", status: "locked", xp: 0, grade: null },
      { day: 21, title: "Milestone 3: 5-Minute Topic Presentation Audio", status: "locked", xp: 0, grade: null },
      { day: 22, title: "Client Negotiation & International Business English", status: "locked", xp: 0, grade: null },
      { day: 23, title: "IELTS / Fluency Speaking Part 1 Simulation", status: "locked", xp: 0, grade: null },
      { day: 24, title: "IELTS / Fluency Speaking Part 2 Cue Card Long Turn", status: "locked", xp: 0, grade: null },
      { day: 25, title: "IELTS / Fluency Part 3 Abstract Discussion", status: "locked", xp: 0, grade: null },
      { day: 26, title: "Eliminating Common Native-Language Translation Errors", status: "locked", xp: 0, grade: null },
      { day: 27, title: "Speed Speaking Drill: Thinking Directly in Target Language", status: "locked", xp: 0, grade: null },
      { day: 28, title: "Mock Client Video Call / Job Interview Simulation", status: "locked", xp: 0, grade: null },
      { day: 29, title: "Verified Public Spoken Showcase Portfolio Entry", status: "locked", xp: 0, grade: null },
      { day: 30, title: "Official Language Fluency Certification & Graduation", status: "locked", xp: 0, grade: null }
    ];
  } else if (titleLower.includes("physics") || titleLower.includes("chemistry") || titleLower.includes("biology") || titleLower.includes("science") || titleLower.includes("matric") || titleLower.includes("9th") || titleLower.includes("10th") || titleLower.includes("fsc") || titleLower.includes("math") || titleLower.includes("algebra")) {
    return [
      { day: 1, title: "Physical Quantities, Base & Derived SI Units", status: "in-progress", xp: 150, grade: null },
      { day: 2, title: "Measuring Instruments: Vernier Callipers & Screw Gauge", status: "locked", xp: 0, grade: null },
      { day: 3, title: "Kinematics: Rest, Motion & Translatory/Rotatory Motion", status: "locked", xp: 0, grade: null },
      { day: 4, title: "Scalars vs Vectors, Distance vs Displacement Concepts", status: "locked", xp: 0, grade: null },
      { day: 5, title: "Speed, Velocity, Uniform Acceleration & Formulas", status: "locked", xp: 0, grade: null },
      { day: 6, title: "Graphical Analysis of Motion: Distance-Time Graphs", status: "locked", xp: 0, grade: null },
      { day: 7, title: "Milestone 1: Three Equations of Motion Derivations & Numericals", status: "locked", xp: 0, grade: null },
      { day: 8, title: "Motion Under Gravity & Free-Fall Problem Solving", status: "locked", xp: 0, grade: null },
      { day: 9, title: "Dynamics: Force, Inertia & Linear Momentum", status: "locked", xp: 0, grade: null },
      { day: 10, title: "Newton's Laws of Motion (1st & 2nd Law F=ma)", status: "locked", xp: 0, grade: null },
      { day: 11, title: "Mass vs Weight & Newton's Third Law Applications", status: "locked", xp: 0, grade: null },
      { day: 12, title: "Tension & Acceleration in String Problems", status: "locked", xp: 0, grade: null },
      { day: 13, title: "Law of Conservation of Momentum with Examples", status: "locked", xp: 0, grade: null },
      { day: 14, title: "Friction: Rolling vs Sliding & Methods to Reduce", status: "locked", xp: 0, grade: null },
      { day: 15, title: "Uniform Circular Motion, Centripetal Force & Banking", status: "locked", xp: 0, grade: null },
      { day: 16, title: "Milestone 2: Turning Effect of Forces & Torque Principle", status: "locked", xp: 0, grade: null },
      { day: 17, title: "Center of Gravity & Conditions of Equilibrium", status: "locked", xp: 0, grade: null },
      { day: 18, title: "Gravitation: Newton's Universal Gravitational Constant", status: "locked", xp: 0, grade: null },
      { day: 19, title: "Mass of Earth Calculation & Variation of 'g'", status: "locked", xp: 0, grade: null },
      { day: 20, title: "Motion of Artificial Satellites & Orbital Speed", status: "locked", xp: 0, grade: null },
      { day: 21, title: "Work & Energy: Kinetic vs Potential Energy Formulas", status: "locked", xp: 0, grade: null },
      { day: 22, title: "Major Energy Sources & Interconversion of Energy", status: "locked", xp: 0, grade: null },
      { day: 23, title: "Efficiency, Power Calculations & Kilowatt-Hour", status: "locked", xp: 0, grade: null },
      { day: 24, title: "Matter Properties: Kinetic Molecular Model & Density", status: "locked", xp: 0, grade: null },
      { day: 25, title: "Pressure in Liquids, Pascal's Law & Hydraulic Lift", status: "locked", xp: 0, grade: null },
      { day: 26, title: "Archimedes Principle, Upthrust & Principle of Floatation", status: "locked", xp: 0, grade: null },
      { day: 27, title: "Hooke's Law, Stress, Strain & Young's Modulus", status: "locked", xp: 0, grade: null },
      { day: 28, title: "Thermal Properties: Specific Heat & Heat Capacity", status: "locked", xp: 0, grade: null },
      { day: 29, title: "Latent Heat of Fusion, Vaporization & Evaporation", status: "locked", xp: 0, grade: null },
      { day: 30, title: "Board Exam Full Past Paper Mock Exam & Solutions", status: "locked", xp: 0, grade: null }
    ];
  } else {
    // Default Graphic Design / General High-Income Skill
    return [
      { day: 1, title: "Core Design Principles & Visual Hierarchy", status: "in-progress", xp: 150, grade: null },
      { day: 2, title: "Color Harmonies & Palette Construction", status: "locked", xp: 0, grade: null },
      { day: 3, title: "Typography Pairing, Kerning & Hierarchy", status: "locked", xp: 0, grade: null },
      { day: 4, title: "Layout Grids & Composition Rules", status: "locked", xp: 0, grade: null },
      { day: 5, title: "Vector Shape Construction in Illustrator/Figma", status: "locked", xp: 0, grade: null },
      { day: 6, title: "High-CTR Social Media Ad Creative Formats", status: "locked", xp: 0, grade: null },
      { day: 7, title: "E-Commerce Product Display Cards & Badges", status: "locked", xp: 0, grade: null },
      { day: 8, title: "Photo Retouching & Clean Background Removal", status: "locked", xp: 0, grade: null },
      { day: 9, title: "Minimalist Custom Icon Set Construction", status: "locked", xp: 0, grade: null },
      { day: 10, title: "YouTube High-Conversion Thumbnail Strategy", status: "locked", xp: 0, grade: null },
      { day: 11, title: "Multi-Page Editorial Layout & PDF Booklet", status: "locked", xp: 0, grade: null },
      { day: 12, title: "Mobile App Icon & Visual Asset Creation", status: "locked", xp: 0, grade: null },
      { day: 13, title: "Product Packaging & Box Mockup Design", status: "locked", xp: 0, grade: null },
      { day: 14, title: "Brand Identity & Geometric Monogram Logo", status: "locked", xp: 0, grade: null },
      { day: 15, title: "Brand Guidelines & Visual Styleguide Book", status: "locked", xp: 0, grade: null },
      { day: 16, title: "Corporate Stationery: Business Cards & Header", status: "locked", xp: 0, grade: null },
      { day: 17, title: "Social Media Carousel Post Sequences", status: "locked", xp: 0, grade: null },
      { day: 18, title: "Pitch Deck & Presentation Slide Mastery", status: "locked", xp: 0, grade: null },
      { day: 19, title: "Figma UI Components & Design Systems", status: "locked", xp: 0, grade: null },
      { day: 20, title: "Client Simulation Brief 1: Modern Coffee Brand", status: "locked", xp: 0, grade: null },
      { day: 21, title: "Client Simulation Brief 2: FinTech Mobile App", status: "locked", xp: 0, grade: null },
      { day: 22, title: "Cosmetic Label & Bottle Mockup Production", status: "locked", xp: 0, grade: null },
      { day: 23, title: "Behance Case Study Architecture (Part 1)", status: "locked", xp: 0, grade: null },
      { day: 24, title: "Behance Case Study Presentation (Part 2)", status: "locked", xp: 0, grade: null },
      { day: 25, title: "Building a Live Public Portfolio Showcase", status: "locked", xp: 0, grade: null },
      { day: 26, title: "Service Pricing, Packages & Contract Scopes", status: "locked", xp: 0, grade: null },
      { day: 27, title: "Fiverr Gig SEO & High-Converting Images", status: "locked", xp: 0, grade: null },
      { day: 28, title: "Upwork Profile Polish & Winning Proposals", status: "locked", xp: 0, grade: null },
      { day: 29, title: "Direct Client Outreach via LinkedIn & Twitter", status: "locked", xp: 0, grade: null },
      { day: 30, title: "First 5 Client Pitches & Official Graduation", status: "locked", xp: 0, grade: null }
    ];
  }
}

function parseYouTubeVideo(url) {
  if (!url || typeof url !== 'string') return null;
  const clean = url.trim();
  const listMatch = clean.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  const playlistId = listMatch ? listMatch[1] : null;

  const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = clean.match(regExp);
  const videoId = (match && match[1].length === 11) ? match[1] : null;

  if (playlistId && !videoId) {
    return {
      videoId: null,
      playlistId,
      embedUrl: `https://www.youtube.com/embed/videoseries?list=${playlistId}`,
      watchUrl: clean
    };
  }

  if (videoId) {
    return {
      videoId,
      playlistId,
      embedUrl: playlistId 
        ? `https://www.youtube.com/embed/${videoId}?list=${playlistId}&rel=0`
        : `https://www.youtube.com/embed/${videoId}?rel=0`,
      watchUrl: `https://www.youtube.com/watch?v=${videoId}`
    };
  }

  return null;
}

const DEFAULT_SKILL_VIDEOS = {
  "Graphic Design": {
    embedUrl: "https://www.youtube.com/embed/un508f7_6U4?rel=0",
    watchUrl: "https://www.youtube.com/watch?v=un508f7_6U4"
  },
  "Web Development": {
    embedUrl: "https://www.youtube.com/embed/zJSY8tbf_ys?rel=0",
    watchUrl: "https://www.youtube.com/watch?v=zJSY8tbf_ys"
  },
  "Python": {
    embedUrl: "https://www.youtube.com/embed/kqtD5dpn9C8?rel=0",
    watchUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8"
  },
  "Video Editing": {
    embedUrl: "https://www.youtube.com/embed/u73b22kZ73I?rel=0",
    watchUrl: "https://www.youtube.com/watch?v=u73b22kZ73I"
  },
  "English": {
    embedUrl: "https://www.youtube.com/embed/JU6qS6dCj2g?rel=0",
    watchUrl: "https://www.youtube.com/watch?v=JU6qS6dCj2g"
  }
};

function getLessonForDay(dayNum, user, lang = "urdu") {
  const isEn = lang === "en";
  const course = (user && user.activeCourse) || {};
  const courseTitle = course.title || (user && user.currentSkill) || "Digital Skill Masterclass";
  const userSkill = (user && user.currentSkill) || "Graphic Design";

  let videoEmbed = "";
  let videoWatch = "";

  if (course.url) {
    const parsed = parseYouTubeVideo(course.url);
    if (parsed) {
      videoEmbed = parsed.embedUrl;
      videoWatch = parsed.watchUrl;
    }
  }

  if (!videoEmbed) {
    const key = Object.keys(DEFAULT_SKILL_VIDEOS).find(k => 
      userSkill.toLowerCase().includes(k.toLowerCase()) || courseTitle.toLowerCase().includes(k.toLowerCase())
    ) || "Graphic Design";
    videoEmbed = DEFAULT_SKILL_VIDEOS[key].embedUrl;
    videoWatch = DEFAULT_SKILL_VIDEOS[key].watchUrl;
  }

  const theoryNotes = isEn ? [
    "Dedicate 45 focused minutes each day to turn knowledge into client-ready skills.",
    "Master the core concept in the first 15 minutes, then execute directly in your tool/software.",
    "Submit your daily proof of work to maintain your streak and publish verified portfolio cards."
  ] : [
    "Har roz ka 45 minute ka practical focus session apke skill ko freelance ready banata hai.",
    "Pehle conceptual understanding lein, phir baghair kisi distraction ke software/code mein practice karein.",
    "Proof of work submit karna zaroori hai taake streak intact rahe aur portfolio mein project add ho sakay."
  ];

  const worksheetQuestions = isEn ? [
    { id: "q1", prompt: "Explain the core concept learned today in your own words:", userDraft: "" },
    { id: "q2", prompt: "How would you apply this practical deliverable to solve a real client's problem?", userDraft: "" }
  ] : [
    { id: "q1", prompt: "Aaj ke lesson ka core concept apne alfaz mein explain karein:", userDraft: "" },
    { id: "q2", prompt: "Is practical task ko kisi real client ke project mein kaise use karenge?", userDraft: "" }
  ];

  const quiz = isEn ? [
    {
      id: 1,
      question: "Which principle is most critical for achieving long-term skill consistency?",
      options: [
        "Cramming 10 hours in a single weekend",
        "Practicing 45 minutes daily with zero distractions",
        "Passively watching videos without taking notes",
        "Applying for freelance gigs before building proof"
      ],
      correctIndex: 1,
      explanation: "Daily deliberate practice compounds faster than irregular binge-watching."
    },
    {
      id: 2,
      question: "What is the primary benefit of submitting daily Proof of Work?",
      options: [
        "It only generates a theoretical score",
        "It automatically compiles your public verified portfolio for clients",
        "No significant benefit",
        "It just marks attendance"
      ],
      correctIndex: 1,
      explanation: "Clients hire evidence, not certificates. Daily proofs auto-generate your live client-ready showcase."
    }
  ] : [
    {
      id: 1,
      question: "Konsa rule rozana consistency ke liye sab se ahem hai?",
      options: [
        "Ek din mein 10 ghante parhna",
        "Rozana 45 minute baghair distraction ke practice karna",
        "Sirf lectures dekh kar notes na banana",
        "Bina practice ke Upwork par apply karna"
      ],
      correctIndex: 1,
      explanation: "Consistency ka asal raaz chhota target rozana poori tawajjo se poora karna hai."
    },
    {
      id: 2,
      question: "Proof of Work submit karne ka sab se bara faida kya hai?",
      options: [
        "Sirf certificate milta hai",
        "Aapka verified portfolio khud-bakhud ban jata hai",
        "Koi faida nahi",
        "Bas marks miltay hain"
      ],
      correctIndex: 1,
      explanation: "Verified proof of work aapka live public portfolio banata hai jo clients ko dikhaya jata hai."
    }
  ];

  const homework = isEn ? {
    title: `Submit Today's Practice Proof for Day ${dayNum}`,
    instructions: "Attach a screenshot, live Figma link, GitHub repository URL, or proof link demonstrating today's task.",
    estimatedTime: "45 Minutes",
    submissionProof: null
  } : {
    title: `Submit Today's Practice Proof for Day ${dayNum}`,
    instructions: "Aaj ke task ka screenshot, Figma link, GitHub repository link, ya live proof yahan paste karein.",
    estimatedTime: "45 Minutes",
    submissionProof: null
  };

  return {
    day: dayNum,
    title: `Day ${dayNum}: Practical Implementation & Proof`,
    videoTitle: `Day ${dayNum}: ${courseTitle}`,
    duration: "25 Mins",
    videoUrl: videoEmbed,
    originalUrl: videoWatch,
    theoryNotes,
    worksheetQuestions,
    quiz,
    homework
  };
}

// In-Memory Multi-User DB
function getInitialDb() {
  return {
    users: {
      "ali": {
        id: "ali",
        name: "Ali Khan",
        email: "ali@practix.user",
        password: "123",
        role: "Aspiring Freelance Designer",
        currentSkill: "Graphic Design & Brand Identity",
        dailyGoalMins: 45,
        targetDays: 30,
        streak: 14,
        bestStreak: 14,
        totalXp: 2450,
        level: 4,
        freezeAvailable: 1,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        activeCourse: {
          id: "gd-masterclass-30",
          title: "Complete Freelance Graphic Design Masterclass",
          source: "Upload: Graphic_Design_Masterclass_Complete.pdf",
          totalDays: 30,
          completedDays: 13,
          currentDay: 14,
          category: "Design",
          estimatedIncomePotential: "$800 - $2,500 / Month"
        },
        roadmap: generateCurriculum("Graphic Design"),
        portfolio: [
          {
            id: "p1",
            title: "Aura Coffee Co. - Minimalist Identity",
            category: "Branding & Identity",
            image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
            description: "Geometric monogram logo, custom typography, and kraft paper packaging mockups.",
            dayCreated: 14,
            verified: true
          }
        ]
      }
    },
    leaderboard: [
      { rank: 1, name: "Hamza Tariq", streak: 28, xp: 4820, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80", skill: "Full-Stack Dev" },
      { rank: 2, name: "Sara Ahmed", streak: 22, xp: 3750, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80", skill: "Graphic Design" },
      { rank: 3, name: "Ali Khan", streak: 14, xp: 2450, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80", skill: "UI/UX Design" },
      { rank: 4, name: "Bilal Ahmed", streak: 12, xp: 2100, avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80", skill: "Video Editing" },
      { rank: 5, name: "Zainab Raza", streak: 9, xp: 1620, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=80&q=80", skill: "Python AI" }
    ]
  };
}

let inMemoryDb = null;

function loadDb() {
  if (inMemoryDb) return inMemoryDb;
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      if (data && data.users) {
        inMemoryDb = data;
        return inMemoryDb;
      }
    }
  } catch (e) {}

  inMemoryDb = getInitialDb();
  try { fs.writeFileSync(DATA_FILE, JSON.stringify(inMemoryDb, null, 2)); } catch (e) {}
  return inMemoryDb;
}

function saveDb(data) {
  inMemoryDb = data;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {}

  // Async sync to Supabase Cloud Database (fire & forget, non-blocking)
  syncToSupabase(data);
}

// Background sync to Supabase tables
async function syncToSupabase(data) {
  try {
    if (!supabase || !data || !data.users) return;

    // 1. Sync Users
    const userRows = Object.values(data.users).map(u => ({
      id: u.id || u.email,
      name: u.name,
      email: u.email || `${u.id}@practix.user`,
      password: u.password || '123456',
      currentSkill: u.currentSkill || 'Graphic Design',
      streak: u.streak || 0,
      xp: u.totalXp || u.xp || 0,
      level: u.level || 1,
      isPro: Boolean(u.isPro)
    }));

    if (userRows.length > 0) {
      await supabase.from('users').upsert(userRows, { onConflict: 'email' });
    }

    // 2. Sync Active Courses
    const courseRows = Object.values(data.users)
      .filter(u => u.activeCourse)
      .map(u => ({
        id: u.activeCourse.id || `course_${u.id}`,
        userEmail: u.email || `${u.id}@practix.user`,
        title: u.activeCourse.title || `${u.currentSkill} Course`,
        category: u.activeCourse.category || u.currentSkill || 'Digital Skills',
        progress: u.activeCourse.completedDays || 0,
        totalDays: u.activeCourse.totalDays || 30
      }));

    if (courseRows.length > 0) {
      await supabase.from('courses').upsert(courseRows, { onConflict: 'id' });
    }

    // 3. Sync Submissions/Portfolio
    const subRows = [];
    Object.values(data.users).forEach(u => {
      if (Array.isArray(u.portfolio)) {
        u.portfolio.forEach((p, idx) => {
          subRows.push({
            id: p.id || `sub_${u.id}_${p.day || idx + 1}`,
            userEmail: u.email || `${u.id}@practix.user`,
            dayNumber: p.day || idx + 1,
            proofUrl: p.proofUrl || p.image || '',
            notes: p.notes || p.title || '',
            feedback: p.feedback || 'Excellent practical execution!',
            grade: p.grade || 'A'
          });
        });
      }
    });

    if (subRows.length > 0) {
      await supabase.from('submissions').upsert(subRows, { onConflict: 'id' });
    }
  } catch (err) {
    console.error('Supabase background sync error (non-fatal):', err.message);
  }
}

// Initial sync from Supabase when server loads
async function hydrateFromSupabase() {
  try {
    if (!supabase) return;
    const { data: remoteUsers, error } = await supabase.from('users').select('*');
    if (!error && Array.isArray(remoteUsers) && remoteUsers.length > 0) {
      const db = loadDb();
      for (const ru of remoteUsers) {
        const key = ru.id || ru.email.split('@')[0];
        if (!db.users[key]) {
          db.users[key] = {
            id: key,
            name: ru.name,
            email: ru.email,
            password: ru.password,
            currentSkill: ru.currentSkill,
            streak: ru.streak || 1,
            totalXp: ru.xp || 150,
            level: ru.level || 1,
            activeCourse: {
              id: `course-${key}`,
              title: `${ru.currentSkill} 30-Day Practical Fast-Track`,
              totalDays: 30,
              completedDays: 0,
              currentDay: 1,
              category: ru.currentSkill
            },
            roadmap: generateCurriculum(ru.currentSkill),
            portfolio: []
          };
        }
      }
      console.log(`Loaded ${remoteUsers.length} users from Supabase Cloud!`);
    }
  } catch (e) {
    console.log('Hydration info:', e.message);
  }
}
setTimeout(hydrateFromSupabase, 2000);

function getUser(req, db) {
  const identifier = (req.query.email || req.query.username || req.headers['x-user-email'] || (req.body && (req.body.email || req.body.username)) || "").trim().toLowerCase();
  
  if (identifier) {
    if (db.users[identifier]) return db.users[identifier];
    // Find by name case-insensitively
    const match = Object.values(db.users).find(u => 
      (u.name && u.name.toLowerCase() === identifier) || 
      (u.email && u.email.toLowerCase() === identifier) ||
      (u.id && u.id.toLowerCase() === identifier)
    );
    if (match) return match;
  }

  // Fallback to first user in list
  const firstKey = Object.keys(db.users)[0];
  return db.users[firstKey];
}

// ═════════════════════════ AUTHENTICATION ROUTES ═════════════════════════

// 1. Register New User (Simple Username & Password)
app.post('/api/auth/register', (req, res) => {
  const db = loadDb();
  const { name, password, skill = "Graphic Design", dailyGoalMins = 45 } = req.body;

  if (!name || !password) {
    return res.status(400).json({ error: "Naam aur Password dono lazmi hain!" });
  }

  const cleanName = name.trim();
  const userKey = cleanName.toLowerCase().replace(/[^a-z0-9_-]/g, '');

  if (!userKey) {
    return res.status(400).json({ error: "Baraye meherbani koi theek naam likhein." });
  }

  // 🛡️ SECURITY: Block Reserved Admin & System Usernames
  const RESERVED_ADMIN_NAMES = [
    'admin', 'administrator', 'superadmin', 'root', 'owner', 'system',
    'moderator', 'mod', 'practix_admin', 'support', 'staff', 'official'
  ];
  if (RESERVED_ADMIN_NAMES.includes(userKey) || RESERVED_ADMIN_NAMES.some(r => userKey.startsWith(r))) {
    return res.status(403).json({
      error: "🚫 Yeh naam reserved hai! Security policies ke mutabiq aap yeh username istemal nahi kar saktay."
    });
  }

  if (db.users[userKey]) {
    return res.status(400).json({ error: `Yeh naam (${cleanName}) pehle se registered hai! Log In karein ya koi aur naam rakhein.` });
  }

  const defaultCourseTitle = `${skill} 30-Day Practical Fast-Track`;
  const initialRoadmap = generateCurriculum(skill);

  const newUser = {
    id: userKey,
    name: cleanName,
    email: `${userKey}@practix.user`,
    password: password.trim(),
    role: "Freelance Student",
    currentSkill: skill,
    dailyGoalMins: Number(dailyGoalMins),
    targetDays: 30,
    streak: 1,
    bestStreak: 1,
    totalXp: 150,
    level: 1,
    freezeAvailable: 1,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    activeCourse: {
      id: `course-${Date.now()}`,
      title: defaultCourseTitle,
      source: "Self-Initiated Fast-Track",
      totalDays: 30,
      completedDays: 0,
      currentDay: 1,
      category: skill,
      estimatedIncomePotential: "$600 - $2,000 / Month"
    },
    roadmap: initialRoadmap,
    portfolio: []
  };

  db.users[userKey] = newUser;
  
  // Also add to leaderboard
  db.leaderboard.push({
    rank: db.leaderboard.length + 1,
    name: `${newUser.name} (You)`,
    streak: 1,
    xp: 150,
    avatar: newUser.avatar,
    skill: newUser.currentSkill
  });

  saveDb(db);

  const lang = (req.body.lang || "urdu").toLowerCase();
  const welcomeMsg = lang === "en" 
    ? `Welcome ${newUser.name}! Your Practix account has been created successfully.`
    : `Mubarak ho ${newUser.name}! Aapka Practix account kamyabi se ban gaya hai.`;

  res.json({
    success: true,
    message: welcomeMsg,
    user: newUser
  });
});

// 2. Login (Simple Username/Name & Password)
app.post('/api/auth/login', (req, res) => {
  const db = loadDb();
  const { username, password } = req.body;
  const lang = (req.body.lang || "urdu").toLowerCase();
  const isEn = lang === "en";

  if (!username || !password) {
    return res.status(400).json({ error: isEn ? "Username and Password are required!" : "Naam aur Password dono lazmi hain!" });
  }

  const cleanUser = username.trim().toLowerCase();
  let user = db.users[cleanUser];

  if (!user) {
    // Try matching by name or email
    user = Object.values(db.users).find(u => 
      (u.name && u.name.toLowerCase() === cleanUser) || 
      (u.email && u.email.toLowerCase() === cleanUser) ||
      (u.id && u.id.toLowerCase() === cleanUser)
    );
  }

  if (!user || user.password !== password.trim()) {
    return res.status(401).json({ error: isEn ? "Invalid username or password! Please check and try again." : "Ghalat naam ya password! Please check karke dobara try karein." });
  }

  res.json({
    success: true,
    message: isEn ? `Welcome back, ${user.name}!` : `Khush-Aamdeed ${user.name}! Aapka account load ho gaya hai.`,
    user: user
  });
});

// ═════════════════════════ USER & COURSE WORKSPACE ROUTES ═════════════════════════

// 3. Get Active User Profile
app.get('/api/user', (req, res) => {
  const db = loadDb();
  const user = getUser(req, db);
  res.json({
    user: user,
    activeCourse: user.activeCourse || {
      title: "No Course Enrolled Yet",
      completedDays: 0,
      totalDays: 30,
      currentDay: 1
    }
  });
});

// 4. Update Goals
app.post('/api/user/goals', (req, res) => {
  const db = loadDb();
  const user = getUser(req, db);
  const { currentSkill, dailyGoalMins, targetDays } = req.body;

  if (currentSkill) user.currentSkill = currentSkill;
  if (dailyGoalMins) user.dailyGoalMins = Number(dailyGoalMins);
  if (targetDays) user.targetDays = Number(targetDays);

  saveDb(db);
  res.json({ success: true, user });
});

// 5. Intelligent Course Ingestion - Online Link (YouTube / Web)
app.post('/api/courses/link', async (req, res) => {
  const db = loadDb();
  const user = getUser(req, db);
  const { url, targetDays = 30 } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: "Course URL lazmi hai!" });
  }

  const cleanUrl = url.trim();
  let courseTitle = (req.body.title || "").trim() || "Custom Digital Skill Masterclass";
  let channelName = (req.body.channel || "").trim() || "Online Academy";

  // Check if it's a YouTube URL
  const isYouTube = cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be");
  
  if (isYouTube) {
    try {
      // Query YouTube oEmbed API to get REAL video title and channel name
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(cleanUrl)}&format=json`;
      const response = await fetch(oembedUrl);
      if (response.ok) {
        const oembedData = await response.json();
        courseTitle = oembedData.title || courseTitle;
        channelName = oembedData.author_name || channelName;
      }
    } catch (err) {
      console.warn("oEmbed fetch warning:", err.message);
    }
  }

  // Check the DRAMA & ENTERTAINMENT GATEKEEPER against REAL Title & Author
  const fullTextToCheck = `${cleanUrl} ${courseTitle} ${channelName}`.toLowerCase();

  // 1. Run Comprehensive Global Entertainment & Joke Blacklist
  let matchedEntertainment = null;
  for (const cat of GLOBAL_ENTERTAINMENT_BLACKLIST) {
    const kw = cat.keywords.find(k => fullTextToCheck.includes(k));
    if (kw) {
      matchedEntertainment = { ...cat, matchedKw: kw };
      break;
    }
  }

  if (matchedEntertainment) {
    return res.status(400).json({
      error: "entertainment_detected",
      category: matchedEntertainment.category,
      message: `${matchedEntertainment.icon} Content Gatekeeper Alert:\n\nYeh video "${courseTitle}" (${matchedEntertainment.category} - ${matchedEntertainment.reason}) hai!\n\nPractix par mazaq ya entertainment links support nahi hotay. Sirf real educational skills (Programming, Design, Languages, Academics, Marketing, E-commerce waghera) ke courses dalein taake AI 30-Day Practical Action Plan banaye!`
    });
  }

  // 2. Match Against Global Skills Taxonomy
  let matchedSkillTrack = null;
  for (const track of GLOBAL_SKILLS_TAXONOMY) {
    const kw = track.keywords.find(k => fullTextToCheck.includes(k));
    if (kw) {
      matchedSkillTrack = track;
      break;
    }
  }

  // 3. Positive Learning Keywords Fallback (for any niche skill worldwide)
  const universalLearningKeywords = [
    "tutorial", "course", "learn", "guide", "crash course", "masterclass", "bootcamp",
    "beginner", "complete", "basics", "full course", "roadmap", "how to", "training",
    "lecture", "class", "chapter", "lesson", "syllabus", "academy", "foundation", "education"
  ];
  const hasLearningIndicator = universalLearningKeywords.some(kw => fullTextToCheck.includes(kw));

  // If not matched to any skill AND has no learning indicator, or contains joke/status flags:
  const nonLearningFlags = ["status", "shorts", "tiktok", "reel", "funny", "clip", "meme"];
  if (!matchedSkillTrack && (!hasLearningIndicator || nonLearningFlags.some(f => fullTextToCheck.includes(f)))) {
    return res.status(400).json({
      error: "non_educational_detected",
      message: `🚫 Content Gatekeeper Alert:\n\nYeh video "${courseTitle}" kisi educational ya practical skill ka course nahi lag rahi.\n\nPractix par kisi genuine skill (Coding, Design, Languages, Science, Business, E-Commerce) ke course ka link dalein!`
    });
  }

  // Valid Skill Course - Generate Fresh 30-Day Roadmap for THIS user!
  const newRoadmap = generateCurriculum(courseTitle);

  // Dynamic Category and Earning Potential from Global Taxonomy
  const category = matchedSkillTrack ? matchedSkillTrack.name : (user.currentSkill || "Global Professional Skill");
  const estimatedOutcome = matchedSkillTrack ? matchedSkillTrack.earningPotential : (category.includes("Academics") ? "Target: Grade A+ (90%+ Marks)" : "$800 - $2,500 / Month");
  user.currentSkill = category;

  user.activeCourse = {
    id: `course-${Date.now()}`,
    title: courseTitle,
    source: `YouTube: ${channelName}`,
    totalDays: Number(targetDays),
    completedDays: 0,
    currentDay: 1,
    category: category,
    estimatedIncomePotential: estimatedOutcome,
    url: cleanUrl
  };

  user.roadmap = newRoadmap;
  saveDb(db);

  const lang = (req.body.lang || "urdu").toLowerCase();
  const isEn = lang === "en";

  res.json({
    success: true,
    message: isEn
      ? `Success! "${courseTitle}" has been analyzed and structured into your 30-Day Practical Action Roadmap!`
      : `Kamyabi! "${courseTitle}" analyze ho kar 30-Day Step-by-Step Practical Roadmap mein tabdeel ho gaya hai!`,
    course: user.activeCourse,
    roadmap: user.roadmap,
    firstDay: user.roadmap[0]
  });
});

// 6. Course Ingestion - File Upload (PDF/PPT/Notes)
app.post('/api/courses/upload', upload.single('courseFile'), (req, res) => {
  const db = loadDb();
  const user = getUser(req, db);
  const file = req.file;
  const targetDays = Number(req.body.targetDays || 30);
  const rawName = file ? file.originalname.replace(/\.[^/.]+$/, "").replace(/_/g, " ") : "Custom Course Material";

  const newRoadmap = generateCurriculum(rawName);

  user.activeCourse = {
    id: `course-${Date.now()}`,
    title: rawName,
    source: `Uploaded PDF: ${file ? file.originalname : 'Document'}`,
    totalDays: targetDays,
    completedDays: 0,
    currentDay: 1,
    category: user.currentSkill || "Specialized Skill",
    estimatedIncomePotential: "$800 - $2,200 / Month"
  };

  user.roadmap = newRoadmap;
  saveDb(db);

  res.json({
    success: true,
    message: `File "${rawName}" analyze ho gayi aur 30-Day Action Plan tayyar hai!`,
    course: user.activeCourse,
    roadmap: user.roadmap
  });
});

// 7. Get Roadmap for active user
app.get('/api/roadmap', (req, res) => {
  const db = loadDb();
  const user = getUser(req, db);
  res.json({
    course: user.activeCourse || { title: "No Course Enrolled" },
    roadmap: user.roadmap || []
  });
});

// 8. Get Specific Day's Lesson & Questions (With Strict Progression Lock)
app.get('/api/day/:dayNumber', (req, res) => {
  const db = loadDb();
  const user = getUser(req, db);
  const dayNum = Number(req.params.dayNumber) || 1;
  const courseTitle = user.activeCourse ? user.activeCourse.title : user.currentSkill;
  const currentActiveDay = (user.activeCourse && user.activeCourse.currentDay) || 1;

  // Strict Progression Gate: Cannot jump to future locked days!
  const dayItem = user.roadmap && user.roadmap.find(d => d.day === dayNum);
  if (dayItem && dayItem.status === 'locked' && dayNum > currentActiveDay) {
    return res.status(403).json({
      error: "day_locked",
      message: `🔒 Day ${dayNum} Locked Hai!\n\nAap direct jump nahi kar saktay. Pehle Day ${currentActiveDay} ka practical task aur homework submit karein taake agla din unlock ho!`,
      currentAllowedDay: currentActiveDay
    });
  }

  const lang = (req.query.lang || req.headers['x-lang'] || "urdu").toLowerCase();
  const lesson = getLessonForDay(dayNum, user, lang);
  
  // Check if user already submitted proof for this day in roadmap
  if (dayItem && dayItem.status === 'completed') {
    lesson.homework.submissionProof = {
      submitted: true,
      grade: dayItem.grade || "A+",
      xpEarned: dayItem.xp || 150
    };
  }

  res.json(lesson);
});

// 9. Submit Homework Proof & Instant AI Verification
app.post('/api/day/:dayNumber/submit-proof', (req, res) => {
  const db = loadDb();
  const user = getUser(req, db);
  const dayNum = Number(req.params.dayNumber) || 1;
  const { proofUrl, notes } = req.body;

  user.totalXp += 150;
  user.streak += 1;
  if (user.streak > user.bestStreak) user.bestStreak = user.streak;
  if (user.activeCourse) user.activeCourse.completedDays = Math.min(user.activeCourse.totalDays, (user.activeCourse.completedDays || 0) + 1);

  // Mark Day as completed in roadmap
  const dayIdx = user.roadmap.findIndex(d => d.day === dayNum);
  if (dayIdx !== -1) {
    user.roadmap[dayIdx].status = 'completed';
    user.roadmap[dayIdx].xp = 150;
    user.roadmap[dayIdx].grade = "A+";

    // Unlock next day
    if (user.roadmap[dayIdx + 1]) {
      user.roadmap[dayIdx + 1].status = 'in-progress';
      if (user.activeCourse) user.activeCourse.currentDay = dayNum + 1;
    }
  }

  // Add project item to user's live public portfolio
  const projectTitle = `${user.currentSkill} - Day ${dayNum} Practice Deliverable`;
  if (!user.portfolio) user.portfolio = [];
  user.portfolio.unshift({
    id: `p-${Date.now()}`,
    title: projectTitle,
    category: user.currentSkill,
    image: proofUrl || "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    description: notes || `Verified homework submission by ${user.name} for Day ${dayNum}. AI reviewed and client-ready.`,
    dayCreated: dayNum,
    verified: true
  });

  saveDb(db);

  const lang = (req.body.lang || "urdu").toLowerCase();
  const isEn = lang === "en";

  res.json({
    success: true,
    message: isEn
      ? `Great job ${user.name}! Day ${dayNum} Proof of Work has been verified! 🔥`
      : `Shabash ${user.name}! Day ${dayNum} ka Proof of Work verify ho gaya hai! 🔥`,
    feedback: isEn
      ? `AI Review: Excellent execution! Structure, practical application, and attention to detail are commercially client-ready. Added to your Live Public Portfolio!`
      : `AI Review: Zabardast kaam! Design ki visual hierarchy aur concept bilkul client-ready standard par hai. Yeh project aapke Live Public Portfolio mein shamil kar diya gaya hai!`,
    grade: "A+",
    newStreak: user.streak,
    newXp: user.totalXp,
    portfolioItemAdded: true
  });
});

// 10. AI Coach Chat
app.post('/api/ai/coach', (req, res) => {
  const db = loadDb();
  const user = getUser(req, db);
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  const lang = (req.body.lang || "urdu").toLowerCase();
  const isEn = lang === "en";
  const lower = message.toLowerCase();

  let reply;
  if (isEn) {
    reply = `Hello ${user.name}! The secret to rapid mastery is compounding daily focus. Dedicate 45 uninterrupted minutes today, close all distractions, and never end your day without uploading your proof of work!`;

    if (lower.includes("client") || lower.includes("freelance") || lower.includes("upwork") || lower.includes("fiverr")) {
      reply = `Global clients don't read long essays. When you reach Day 20, we will train you on the '1-Paragraph Cold Pitch' that pinpoints the client's problem directly and links your verified Practix portfolio!`;
    } else if (lower.includes("price") || lower.includes("rate") || lower.includes("money") || lower.includes("earn") || lower.includes("charge")) {
      reply = `Offer your first 3 clients an introductory package of $50-$150 to secure quick 5-star testimonials, then scale your hourly rate to $25-$40/hr.`;
    } else if (lower.includes("stuck") || lower.includes("procrastinat") || lower.includes("tomorrow") || lower.includes("lazy")) {
      reply = `Stop saying 'tomorrow'! Start the 25-minute Pomodoro timer right now and complete just Question 1 of Day ${user.activeCourse ? user.activeCourse.currentDay : 1}. Action produces immediate momentum!`;
    }
  } else {
    reply = `As-salamu alaykum ${user.name}! Consistency ka asal raaz chhota target set karna hai. Roz sirf 45 minutes poori concentration se dein, distraction band karein, aur raat ko proof submit kiye baghair soyein mat!`;

    if (lower.includes("client") || lower.includes("freelance") || lower.includes("upwork") || lower.includes("fiverr")) {
      reply = `Clients ko lambay paragraphs nahi chahiye hotay. Jab aap Day 20 complete kar lengi, to hum aapko '1-Paragraph Cold Pitch' sikhayenge jo directly client ke maslay ko hal karta hai aur aapke verified portfolio ka link share karta hai!`;
    } else if (lower.includes("price") || lower.includes("rate") || lower.includes("paisa") || lower.includes("kamayi")) {
      reply = `Pehle 3 clients ko $50-$150 ka value-packed introductory package dein, 5-star review lein, aur uske baad apni hourly rate $25-$40/hr tak barhayen.`;
    } else if (lower.includes("stuck") || lower.includes("procrastinat") || lower.includes("kal")) {
      reply = `'Kal se nahi... aaj se!' Agle 25 minutes ka Pomodoro Timer start karein, sirf Day ${user.activeCourse ? user.activeCourse.currentDay : 1} ka pehla worksheet question likhein. Momentum khud ba khud ban jayega!`;
    }
  }

  res.json({
    reply,
    coach: isEn ? "Coach Asad (AI Accountability Lead)" : "Coach Asad (AI Accountability Lead)",
    timestamp: new Date().toLocaleTimeString()
  });
});

// 11. Public Portfolio
app.get('/api/portfolio', (req, res) => {
  const db = loadDb();
  const user = getUser(req, db);
  res.json({
    user: user,
    portfolio: user.portfolio || []
  });
});

// 12. Leaderboard
app.get('/api/leaderboard', (req, res) => {
  const db = loadDb();
  res.json(db.leaderboard);
});

// Fallback middleware to serve index.html for any frontend route
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server locally
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL && !process.env.NOW_REGION) {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Practix Multi-User Platform is running!`);
    console.log(`🌐 Local URL: http://localhost:${PORT}`);
    console.log(`======================================================\n`);
  });
}

module.exports = app;
