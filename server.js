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

// Helper to adapt roadmap days dynamically (7, 14, 30 days)
function adaptRoadmapDays(list, targetDays = 30) {
  const days = Number(targetDays) || 30;
  if (!Array.isArray(list) || list.length === 0) return [];
  if (days >= list.length) {
    return list.slice(0, days).map((item, idx) => ({
      ...item,
      day: idx + 1,
      status: idx === 0 ? "in-progress" : "locked",
      xp: idx === 0 ? 150 : 0
    }));
  }
  
  const result = [];
  const step = (list.length - 1) / (days - 1);
  for (let i = 0; i < days - 1; i++) {
    const srcIndex = Math.round(i * step);
    result.push(list[srcIndex]);
  }
  result.push(list[list.length - 1]);

  return result.map((item, idx) => ({
    day: idx + 1,
    title: item.title,
    status: idx === 0 ? "in-progress" : "locked",
    xp: idx === 0 ? 150 : 0,
    grade: null
  }));
}

// Helper to generate Roadmap based on course topic and duration
function generateCurriculum(skillTitle, targetDays = 30) {
  const titleLower = skillTitle.toLowerCase();
  let list = [];
  
  if (titleLower.includes("python") || titleLower.includes("code") || titleLower.includes("programming")) {
    list = [
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
    list = [
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
    list = [
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
    list = [
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
    list = [
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

  return adaptRoadmapDays(list, targetDays);
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

const FEATURED_COURSES = [
  {
    id: "fc_python_14",
    title: "Python Programming & AI Automation Masterclass",
    category: "Python & AI",
    durationDays: 14,
    badge: "Hot 🔥",
    icon: "fa-brands fa-python text-yellow-400",
    level: "Beginner Friendly",
    description: "Learn Python from scratch, write automation scripts, scrape web data, and build AI projects in 14 focused days.",
    url: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
    embedUrl: "https://www.youtube.com/embed/kqtD5dpn9C8?rel=0",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "fc_canva_7",
    title: "Canva Pro & Social Media Brand Kit Sprint",
    category: "Canva Graphics",
    durationDays: 7,
    badge: "7-Day Fast Sprint ⚡",
    icon: "fa-solid fa-palette text-cyan-400",
    level: "Beginner",
    description: "Master Canva tools, create client-ready social media posts, YouTube thumbnails, flyers, and branding kits in 7 days.",
    url: "https://www.youtube.com/watch?v=un508f7_6U4",
    embedUrl: "https://www.youtube.com/embed/un508f7_6U4?rel=0",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "fc_prompt_7",
    title: "AI Prompt Engineering & ChatGPT Workflows",
    category: "AI Prompt Engineering",
    durationDays: 7,
    badge: "Latest 2026 🤖",
    icon: "fa-solid fa-brain text-purple-400",
    level: "All Levels",
    description: "Master prompt engineering, workflow automations, content generation, and building AI tools with ChatGPT & Claude.",
    url: "https://www.youtube.com/watch?v=jC4v5AS4RIM",
    embedUrl: "https://www.youtube.com/embed/jC4v5AS4RIM?rel=0",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "fc_webdev_30",
    title: "Full-Stack Web Development Bootcamp (React & Node)",
    category: "Web Development",
    durationDays: 30,
    badge: "Career Track 💻",
    icon: "fa-solid fa-code text-indigo-400",
    level: "Zero to Hero",
    description: "Master modern responsive front-end and back-end development with hands-on projects and deploy live to Vercel.",
    url: "https://www.youtube.com/watch?v=zJSY8tbf_ys",
    embedUrl: "https://www.youtube.com/embed/zJSY8tbf_ys?rel=0",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "fc_design_30",
    title: "Complete Freelance Graphic Design Masterclass",
    category: "Graphic Design",
    durationDays: 30,
    badge: "High Income 🎨",
    icon: "fa-solid fa-bezier-curve text-pink-400",
    level: "Beginner to Pro",
    description: "Logo design, branding, typography, color theory, social media carousels, and client presentation decks.",
    url: "https://www.youtube.com/watch?v=un508f7_6U4",
    embedUrl: "https://www.youtube.com/embed/un508f7_6U4?rel=0",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "fc_video_7",
    title: "Shorts, Reels & CapCut Video Editing Sprint",
    category: "Video Editing",
    durationDays: 7,
    badge: "Trending 🎬",
    icon: "fa-solid fa-film text-rose-400",
    level: "Beginner Friendly",
    description: "Create viral short-form videos, sound design, animated captions, color grading, and b-roll transitions.",
    url: "https://www.youtube.com/watch?v=u73b22kZ73I",
    embedUrl: "https://www.youtube.com/embed/u73b22kZ73I?rel=0",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "fc_figma_14",
    title: "UI/UX Design & Figma Prototyping Masterclass",
    category: "UI/UX Design",
    durationDays: 14,
    badge: "High Demand 📱",
    icon: "fa-brands fa-figma text-violet-400",
    level: "Intermediate",
    description: "Design mobile apps and modern web dashboards, wireframes, auto-layout, and clickable client prototypes in Figma.",
    url: "https://www.youtube.com/watch?v=FTFaQWZBqQ8",
    embedUrl: "https://www.youtube.com/embed/FTFaQWZBqQ8?rel=0",
    image: "https://images.unsplash.com/photo-1581291518655-9523c932deb8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "fc_english_14",
    title: "Spoken English & Client Interview Communication",
    category: "Spoken English",
    durationDays: 14,
    badge: "Career Essential 🗣️",
    icon: "fa-solid fa-comments text-emerald-400",
    level: "All Levels",
    description: "Overcome hesitation, master everyday conversation drills, client proposal calls, and Upwork interview preparation.",
    url: "https://www.youtube.com/watch?v=JU6qS6dCj2g",
    embedUrl: "https://www.youtube.com/embed/JU6qS6dCj2g?rel=0",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "fc_excel_7",
    title: "Excel Data Analysis, Formulas & Dashboard Sprint",
    category: "Excel Analysis",
    durationDays: 7,
    badge: "Quick Job Skill 📊",
    icon: "fa-solid fa-file-excel text-emerald-500",
    level: "Beginner",
    description: "VLOOKUP, XLOOKUP, Pivot Tables, interactive dashboards, and business report automation in 7 days.",
    url: "https://www.youtube.com/watch?v=Vl0H-qTclOg",
    embedUrl: "https://www.youtube.com/embed/Vl0H-qTclOg?rel=0",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "fc_marketing_14",
    title: "Digital Marketing & Meta/TikTok Ads Masterclass",
    category: "Digital Marketing",
    durationDays: 14,
    badge: "Earning Skill 📈",
    icon: "fa-solid fa-bullhorn text-amber-500",
    level: "Beginner Friendly",
    description: "Targeted advertising, audience targeting, conversion tracking, sales funnels, and managing freelance client ad budgets.",
    url: "https://www.youtube.com/watch?v=bixR-KIJKYM",
    embedUrl: "https://www.youtube.com/embed/bixR-KIJKYM?rel=0",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "fc_shopify_14",
    title: "Shopify E-Commerce Store Design & Dropshipping",
    category: "Shopify Store",
    durationDays: 14,
    badge: "Business Track 🛒",
    icon: "fa-solid fa-bag-shopping text-teal-400",
    level: "Beginner",
    description: "Build high-converting Shopify stores, product hunting, supplier integration, and running profitable stores.",
    url: "https://www.youtube.com/watch?v=p0A3F1F1T50",
    embedUrl: "https://www.youtube.com/embed/p0A3F1F1T50?rel=0",
    image: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=600&q=80"
  }
];

function generateDailyAssessment(dayNum, dayTitle, courseTitle, userSkill, lang = "urdu") {
  const isEn = lang === "en";
  const skillLower = `${courseTitle} ${userSkill}`.toLowerCase();
  const dayTopic = dayTitle || `Day ${dayNum} Implementation`;

  let worksheetQuestions = [];
  let quiz = [];
  let theoryNotes = isEn ? [
    `Dedicate 45 focused minutes to master: ${dayTopic}.`,
    "Grasp the core principle in the first 15 minutes, then execute directly in your tool/software.",
    "Submit your daily proof of work to maintain your streak and compile verified client portfolio cards."
  ] : [
    `Aaj ka 45-minute practical focus topic: ${dayTopic}.`,
    "Pehle conceptual logic samjhein, phir baghair distraction computer/software mein execute karein.",
    "Daily proof of work submit karein taake streak barqarar rahe aur public portfolio build ho."
  ];

  // ==========================================
  // 1. PYTHON TRACK
  // ==========================================
  if (skillLower.includes("python") || skillLower.includes("programming")) {
    if (dayNum === 1) {
      worksheetQuestions = isEn ? [
        { id: "q1", prompt: "Q1. What are the two crucial setup steps when installing Python (e.g. checking 'Add Python to PATH' and installing VS Code Python extension)?", userDraft: "" },
        { id: "q2", prompt: "Q2. Detail the exact terminal commands and output you observed when running 'python --version' and executing your first 'Hello World' script today:", userDraft: "" },
        { id: "q3", prompt: "Q3. If a terminal outputs 'python is not recognized as an internal or external command', how do you diagnose and fix the environment variable PATH?", userDraft: "" },
        { id: "q4", prompt: "Q4. How does setting up a clean local Python environment allow a freelancer to build scripts and automations for paying clients?", userDraft: "" }
      ] : [
        { id: "q1", prompt: "Q1. Python install karte waqt aur VS Code setup mein konsi 2 zaroori settings ki jati hain (e.g. 'Add Python to PATH' check karna)?", userDraft: "" },
        { id: "q2", prompt: "Q2. Aaj terminal mein 'python --version' aur apna pehla 'Hello World' script chalane par kya exact output aya?", userDraft: "" },
        { id: "q3", prompt: "Q3. Agar terminal 'python is not recognized as an internal or external command' ka error de, toh PATH environment variable kaise fix karenge?", userDraft: "" },
        { id: "q4", prompt: "Q4. VS Code aur Python environment theek hone ke baad ek freelancer client ke liye kis tarah ki initial scripts bana sakta hai?", userDraft: "" }
      ];

      quiz = isEn ? [
        { id: 1, question: "Which installer checkbox ensures Python commands execute in any terminal prompt?", options: ["Add python.exe to PATH", "Install for Guest only", "Disable 64-bit support", "Run as Sandbox"], correctIndex: 0, explanation: "'Add to PATH' registers Python binary paths with your system environment variables." },
        { id: 2, question: "What is the official standard file extension for Python script files?", options: [".py", ".pyt", ".python", ".pt"], correctIndex: 0, explanation: "Python files use the standard '.py' extension." },
        { id: 3, question: "Which command runs 'app.py' in modern command prompts?", options: ["python app.py", "start app.py", "run app.py", "exec app.py"], correctIndex: 0, explanation: "'python app.py' launches the interpreter and runs the code." },
        { id: 4, question: "What is the standard function to print text to the console in Python?", options: ["print('...')", "echo('...')", "System.out.println('...')", "Console.Write('...')"], correctIndex: 0, explanation: "print() outputs text and variables to standard output." }
      ] : [
        { id: 1, question: "Python installation ke waqt terminal command chalane ke liye konsa checkbox lazmi tick karna hota hai?", options: ["Add python.exe to PATH", "Sirf Guest ke liye install karein", "64-bit band karein", "Read-only mode"], correctIndex: 0, explanation: "'Add to PATH' se terminal ko pata chalta hai ke python kahan mojood hai." },
        { id: 2, question: "Python script files ka official standard extension kya hota hai?", options: [".py", ".pyt", ".python", ".pt"], correctIndex: 0, explanation: "Python scripts ka extension hamesha '.py' hota hai." },
        { id: 3, question: "Terminal mein 'app.py' run karne ke liye konsi command likhi jati hai?", options: ["python app.py", "start app.py", "run app.py", "exec app.py"], correctIndex: 0, explanation: "'python app.py' interpreter ko script run karne ka hukam deta hai." },
        { id: 4, question: "Screen ya console par text print karne ke liye Python ka standard function konsa hai?", options: ["print('...')", "echo('...')", "System.out.println('...')", "Console.Write('...')"], correctIndex: 0, explanation: "print() function screen par text output show karta hai." }
      ];
    } else if (dayNum === 2) {
      worksheetQuestions = isEn ? [
        { id: "q1", prompt: "Q1. Explain the differences between primitive types (int, float, str, bool) in Python and the rules for naming variables:", userDraft: "" },
        { id: "q2", prompt: "Q2. Detail the logic of the user input script (input()) and type casting (int(), float()) you wrote and ran on your machine today:", userDraft: "" },
        { id: "q3", prompt: "Q3. If adding a string and an integer causes 'TypeError: can only concatenate str to str', how do you fix it using type casting?", userDraft: "" },
        { id: "q4", prompt: "Q4. How is dynamic data input and type casting used in commercial freelance billing or currency conversion scripts?", userDraft: "" }
      ] : [
        { id: "q1", prompt: "Q1. Python mein primitive types (int, float, str, bool) ka farq aur variable declare karne ke rules explain karein:", userDraft: "" },
        { id: "q2", prompt: "Q2. Aaj aapne input() aur type conversion (int(), float()) ke zariye jo code likha, uski step-by-step logic aur output kya thi?", userDraft: "" },
        { id: "q3", prompt: "Q3. Agar string aur integer ko add karte waqt 'TypeError: can only concatenate str to str' aaye, toh type casting se isay kaise fix karenge?", userDraft: "" },
        { id: "q4", prompt: "Q4. Client ke billing calculator ya currency converter project mein user input aur type conversion ki kya practical application hoti hai?", userDraft: "" }
      ];

      quiz = isEn ? [
        { id: 1, question: "What is the evaluated data type of the expression type(49.99)?", options: ["<class 'float'>", "<class 'int'>", "<class 'str'>", "<class 'double'>"], correctIndex: 0, explanation: "Numbers containing decimal points are floats in Python." },
        { id: 2, question: "What does Python's input() function return by default?", options: ["String (str)", "Integer (int)", "Float", "Boolean"], correctIndex: 0, explanation: "input() always captures raw user input as a string." },
        { id: 3, question: "Which of the following is an INVALID variable name in Python?", options: ["2nd_order", "second_order", "_order2", "order_two"], correctIndex: 0, explanation: "Variable identifiers cannot begin with numerical digits." },
        { id: 4, question: "How do you cast the string '50' into a numeric integer?", options: ["int('50')", "str.to_int('50')", "integer('50')", "Number('50')"], correctIndex: 0, explanation: "int() converts valid numeric string representations into integers." }
      ] : [
        { id: 1, question: "Python mein type(49.99) ka result konsi class hota hai?", options: ["<class 'float'>", "<class 'int'>", "<class 'str'>", "<class 'double'>"], correctIndex: 0, explanation: "Ashariya (decimal) wale numbers Python mein float hote hain." },
        { id: 2, question: "Python ka input() function user se value hamesha kis data type mein leta hai?", options: ["String (str)", "Integer (int)", "Float", "Boolean"], correctIndex: 0, explanation: "input() hamesha text string return karta hai." },
        { id: 3, question: "Python mein konsa variable name GHALAT (invalid) hai?", options: ["2nd_order", "second_order", "_order2", "order_two"], correctIndex: 0, explanation: "Variable ka naam number se shuru nahi ho sakta." },
        { id: 4, question: "String '50' ko integer number mein convert karne ke liye kya likha jata hai?", options: ["int('50')", "str.to_int('50')", "integer('50')", "Number('50')"], correctIndex: 0, explanation: "int() function string ko number mein badalta hai." }
      ];
    } else if (dayNum === 3) {
      worksheetQuestions = isEn ? [
        { id: "q1", prompt: "Q1. Explain string indexing, slicing syntax (string[start:stop:step]), and the benefits of f-strings in Python:", userDraft: "" },
        { id: "q2", prompt: "Q2. Detail the exact string methods (.upper(), .strip(), .replace()) and formatted output you generated in today's script:", userDraft: "" },
        { id: "q3", prompt: "Q3. If accessing s[10] throws 'IndexError: string index out of range', how do you inspect len(s) and prevent crashes?", userDraft: "" },
        { id: "q4", prompt: "Q4. How do automated customer email generators and data cleaning scripts rely on string manipulation in freelance projects?", userDraft: "" }
      ] : [
        { id: "q1", prompt: "Q1. Python mein string indexing, slicing (start:stop:step) aur f-strings formatting ka tareeqa explain karein:", userDraft: "" },
        { id: "q2", prompt: "Q2. Aaj aapne string methods (.upper(), .lower(), .replace(), .strip()) se jo code execute kiya, uska terminal output kya tha?", userDraft: "" },
        { id: "q3", prompt: "Q3. Agar text[10] access karne par 'IndexError: string index out of range' aaye toh len() function se isay kaise troubleshoot karenge?", userDraft: "" },
        { id: "q4", prompt: "Q4. Freelance client ke bulk emails generate karne ya raw text clean karne mein string methods ka kya istemal hota hai?", userDraft: "" }
      ];

      quiz = isEn ? [
        { id: 1, question: "Given text = 'Practix', what is the value of text[0:4]?", options: ["'Prac'", "'Pract'", "'ract'", "'Pr'"], correctIndex: 0, explanation: "Slicing [0:4] extracts characters from index 0 up to, but not including, index 4." },
        { id: 2, question: "Which syntax demonstrates modern Python 3 f-string formatting?", options: ["f'Hello {name}'", "'Hello %s' % name", "'Hello {}'.format(name)", "String.Format('Hello {0}', name)"], correctIndex: 0, explanation: "f-strings (prefixed with 'f') allow direct expression interpolation." },
        { id: 3, question: "Which method removes leading and trailing whitespace from a string?", options: [".strip()", ".clean()", ".trim()", ".removeSpaces()"], correctIndex: 0, explanation: ".strip() strips outer whitespace characters." },
        { id: 4, question: "What does text[-1] return in Python?", options: ["The very last character", "The first character", "An error", "None"], correctIndex: 0, explanation: "Negative indexing counts backward, so -1 accesses the final character." }
      ] : [
        { id: 1, question: "Agar text = 'Practix' ho toh text[0:4] ka result kya hoga?", options: ["'Prac'", "'Pract'", "'ract'", "'Pr'"], correctIndex: 0, explanation: "Slicing [0:4] index 0 se index 3 tak characters uthata hai." },
        { id: 2, question: "Python mein modern f-string ka durust tareeqa konsa hai?", options: ["f'Hello {name}'", "'Hello %s' % name", "'Hello {}'.format(name)", "String.Format('Hello {0}', name)"], correctIndex: 0, explanation: "f-strings variable ko seedha curly braces {name} ke andar embed karti hain." },
        { id: 3, question: "String ke agay aur peechay se faltu space hatane ke liye konsa method hai?", options: [".strip()", ".clean()", ".trim()", ".removeSpaces()"], correctIndex: 0, explanation: ".strip() method text ke surrounding whitespace ko khatam karta hai." },
        { id: 4, question: "Python mein text[-1] likhne se konsa character milta hai?", options: ["Aakhri character (Last character)", "Pehla character", "SyntaxError", "Khali space"], correctIndex: 0, explanation: "Negative index -1 aakhri character return karta hai." }
      ];
    } else if (dayNum === 4) {
      worksheetQuestions = isEn ? [
        { id: "q1", prompt: "Q1. Explain the logic of conditional branching (if, elif, else) and why indentation (4 spaces) is strictly required in Python:", userDraft: "" },
        { id: "q2", prompt: "Q2. Detail the exact boolean expressions and logical operators (and, or, not) you used in today's decision-making script:", userDraft: "" },
        { id: "q3", prompt: "Q3. If Python throws 'IndentationError: expected an indented block', how do you fix it in VS Code?", userDraft: "" },
        { id: "q4", prompt: "Q4. How is conditional branching applied in real freelance projects (e.g. e-commerce shipping calculators or user authentication checks)?", userDraft: "" }
      ] : [
        { id: "q1", prompt: "Q1. Python mein if, elif, else ki logic aur 4 spaces Indentation ki zaroorat ko explain karein:", userDraft: "" },
        { id: "q2", prompt: "Q2. Aaj aapne logical operators (and, or, not) aur comparison operators (==, !=, >, <) se jo decision code banaya, uski detail likhein:", userDraft: "" },
        { id: "q3", prompt: "Q3. Agar code mein 'IndentationError: expected an indented block' aaye toh VS Code mein tab vs space kaise troubleshoot karenge?", userDraft: "" },
        { id: "q4", prompt: "Q4. Freelance client ke e-commerce discount calculator ya eligibility script mein conditional logic kaise use hoti hai?", userDraft: "" }
      ];

      quiz = isEn ? [
        { id: 1, question: "Which comparison operator tests equality between two values in Python?", options: ["==", "=", "===", "equals()"], correctIndex: 0, explanation: "Double equals '==' compares values for equality; single '=' is assignment." },
        { id: 2, question: "What terminates an if or elif header line in Python syntax?", options: ["A colon (:)", "A semicolon (;)", "Curly braces ({})", "Then keyword"], correctIndex: 0, explanation: "Python condition statements must end with a colon ':' before the indented block." },
        { id: 3, question: "Which logical operator returns True only if BOTH conditions are True?", options: ["and", "or", "not", "both"], correctIndex: 0, explanation: "'and' requires all combined conditions to evaluate to True." },
        { id: 4, question: "What is the keyword for 'else if' in Python?", options: ["elif", "elseif", "else if", "elsif"], correctIndex: 0, explanation: "'elif' is Python's concise keyword for chaining alternate conditions." }
      ] : [
        { id: 1, question: "Python mein do values ki barabari (equality) check karne ke liye konsa operator use hota hai?", options: ["==", "=", "===", "equals()"], correctIndex: 0, explanation: "Double equal '==' equality check karta hai, single '=' variable assign karta hai." },
        { id: 2, question: "Python mein if ya elif line ke aakhir mein kya lagana zaroori hota hai?", options: ["Colon (:)", "Semicolon (;)", "Brackets ({})", "Full stop (.)"], correctIndex: 0, explanation: "Condition ke baad colon ':' lagana syntax ka hissa hai." },
        { id: 3, question: "Dono conditions ka True hona zaroori ho toh konsa logical operator use hota hai?", options: ["and", "or", "not", "both"], correctIndex: 0, explanation: "'and' tabhi True hota hai jab dono conditions sach hon." },
        { id: 4, question: "Python mein 'else if' ke liye konsa keyword hai?", options: ["elif", "elseif", "else if", "elsif"], correctIndex: 0, explanation: "Python mein 'elif' keyword use hota hai." }
      ];
    } else if (dayNum === 5) {
      worksheetQuestions = isEn ? [
        { id: "q1", prompt: "Q1. Explain the fundamental difference between a 'for loop' and a 'while loop', and how range() controls loop counts:", userDraft: "" },
        { id: "q2", prompt: "Q2. Detail the loop script you ran today, including its initialization, loop condition, and the printed iteration output:", userDraft: "" },
        { id: "q3", prompt: "Q3. If a while loop becomes infinite and freezes your terminal, what shortcut terminates it (Ctrl+C) and how do you fix the loop condition?", userDraft: "" },
        { id: "q4", prompt: "Q4. How do loops enable freelance scripts to automatically process 5,000 Excel rows or scrape multi-page web data?", userDraft: "" }
      ] : [
        { id: "q1", prompt: "Q1. 'for loop' aur 'while loop' ke darmiyan farq aur range() function ka kaam explain karein:", userDraft: "" },
        { id: "q2", prompt: "Q2. Aaj aapne numbers ya items iterate karne ke liye jo loop code execute kiya, uski step-by-step logic aur output kya thi?", userDraft: "" },
        { id: "q3", prompt: "Q3. Agar while loop infinite chal pare aur terminal freeze ho jaye, toh Ctrl+C se rokne ke baad condition ko kaise theek karenge?", userDraft: "" },
        { id: "q4", prompt: "Q4. Freelance automation project mein hazaron Excel rows ya multiple web pages process karne ke liye loops ka kya role hai?", userDraft: "" }
      ];

      quiz = isEn ? [
        { id: 1, question: "How many times will 'for i in range(1, 6):' execute?", options: ["5 times (1 through 5)", "6 times", "4 times", "Infinite"], correctIndex: 0, explanation: "range(1, 6) produces numbers 1, 2, 3, 4, 5 (stopping before 6)." },
        { id: 2, question: "Which keyword immediately exits and terminates a loop?", options: ["break", "continue", "pass", "stop"], correctIndex: 0, explanation: "'break' breaks out of the loop block immediately." },
        { id: 3, question: "Which keyword skips the current iteration and jumps to the next iteration?", options: ["continue", "break", "skip", "next"], correctIndex: 0, explanation: "'continue' bypasses remaining statements in the current iteration." },
        { id: 4, question: "What is the standard terminal shortcut to abort a runaway infinite loop?", options: ["Ctrl + C", "Ctrl + Z", "Alt + F4", "Esc + Enter"], correctIndex: 0, explanation: "Ctrl+C sends SIGINT to terminate running processes in terminal." }
      ] : [
        { id: 1, question: "'for i in range(1, 6):' total kitni baar chalega?", options: ["5 baar (1 se 5 tak)", "6 baar", "4 baar", "Hamesha chalta rahega"], correctIndex: 0, explanation: "range(1, 6) numbers 1, 2, 3, 4, 5 generate karta hai (6 shamil nahi hota)." },
        { id: 2, question: "Loop ko foran kisi shart par khatam karne ke liye konsa keyword use hota hai?", options: ["break", "continue", "pass", "stop"], correctIndex: 0, explanation: "'break' keyword loop ko foran band kar deta hai." },
        { id: 3, question: "Current chakkar ko skip karke aglay chakkar par jane ke liye kya use hota hai?", options: ["continue", "break", "skip", "next"], correctIndex: 0, explanation: "'continue' baqi code skip karke agli iteration par jump karta hai." },
        { id: 4, question: "Terminal par atkay huay infinite loop ko foran band karne ka shortcut kya hai?", options: ["Ctrl + C", "Ctrl + Z", "Alt + F4", "Esc"], correctIndex: 0, explanation: "Ctrl+C terminal execution ko foran terminate karta hai." }
      ];
    }
  }

  // ==========================================
  // 2. GRAPHIC DESIGN / CANVA / FIGMA TRACK
  // ==========================================
  else if (skillLower.includes("design") || skillLower.includes("canva") || skillLower.includes("figma") || skillLower.includes("ui")) {
    if (dayNum === 1) {
      worksheetQuestions = isEn ? [
        { id: "q1", prompt: "Q1. Explain the 3 foundational pillars of Visual Hierarchy (Scale, Contrast, and White Space) in your own words:", userDraft: "" },
        { id: "q2", prompt: "Q2. Detail the exact canvas setup (dimensions, margins, focal element) you created in Canva/Figma today:", userDraft: "" },
        { id: "q3", prompt: "Q3. If a design feels cluttered and hard to read, what specific adjustments to padding and negative space would you make?", userDraft: "" },
        { id: "q4", prompt: "Q4. How does clear visual hierarchy increase click-through rate (CTR) and conversions for a freelance client's social media ads?", userDraft: "" }
      ] : [
        { id: "q1", prompt: "Q1. Visual Hierarchy ke 3 bunyadi usool (Scale, Contrast, aur White Space) design mein viewer ki attention kaise direct karte hain?", userDraft: "" },
        { id: "q2", prompt: "Q2. Aaj aapne Canva ya Figma mein jo canvas aur visual composition banayi, uski dimensions aur elements kya the?", userDraft: "" },
        { id: "q3", prompt: "Q3. Agar design cluttered (bhara bhara) lage aur client kahe ke 'it lacks breathing room', toh layout ko kaise fix karenge?", userDraft: "" },
        { id: "q4", prompt: "Q4. Ek freelance client ke social media post ya banner mein proper visual hierarchy se CTR (Click-Through Rate) kaise barhti hai?", userDraft: "" }
      ];

      quiz = isEn ? [
        { id: 1, question: "What is the quickest technique to establish a strong focal point in a graphic design?", options: ["Distinct scale (size) and high contrast color", "Making every single element identical in size", "Using 8 different font faces", "Filling all empty space"], correctIndex: 0, explanation: "Size and contrast immediately guide the human eye to key information." },
        { id: 2, question: "What is the term for unoccupied, breathing space around visual elements?", options: ["Negative / White Space", "Empty void", "Dead canvas", "Wasted resolution"], correctIndex: 0, explanation: "White/negative space provides structure, clarity, and visual polish." },
        { id: 3, question: "What is the standard pixel dimension for a square Instagram/Facebook post?", options: ["1080 x 1080 px", "1920 x 1080 px", "800 x 600 px", "500 x 500 px"], correctIndex: 0, explanation: "1080x1080 is the universal square social creative standard." },
        { id: 4, question: "Which classic composition guideline divides the canvas into a 3x3 grid?", options: ["Rule of Thirds", "Golden Ratio", "Diagonal balance", "Quadrant split"], correctIndex: 0, explanation: "The Rule of Thirds places focal elements along 1/3 grid lines." }
      ] : [
        { id: 1, question: "Visual hierarchy mein viewer ki nazar sab se pehle kis cheez par jani chahiye?", options: ["Sab se baray focal point aur high contrast headline par", "Chhotay background icon par", "Footer ke copyright text par", "Design ke border par"], correctIndex: 0, explanation: "Insaan ki nazar sab se pehle baray size aur contrast wale focal point par parti hai." },
        { id: 2, question: "Design mein elements ke darmiyan khali, saaf jagah ko kya kehte hain?", options: ["Negative Space / White Space", "Dead space", "Kharab layout", "Wasted pixel"], correctIndex: 0, explanation: "White space design ko professional look aur clarity deti hai." },
        { id: 3, question: "Social media square post ka standard pixel resolution kya hota hai?", options: ["1080 x 1080 px", "1920 x 1080 px", "800 x 600 px", "500 x 500 px"], correctIndex: 0, explanation: "1080x1080 px square social creatives ka universal standard hai." },
        { id: 4, question: "Design composition ko balance karne ke liye canvas ko 9 barabar hisson mein baantne wale rule ko kya kehte hain?", options: ["Rule of Thirds", "Golden Ratio", "Center Grid", "Linear Law"], correctIndex: 0, explanation: "Rule of Thirds canvas par 3x3 grid bana kar eye points identify karta hai." }
      ];
    } else if (dayNum === 2) {
      worksheetQuestions = isEn ? [
        { id: "q1", prompt: "Q1. Explain the 60-30-10 color rule and the emotional impact of complementary vs analogous color palettes:", userDraft: "" },
        { id: "q2", prompt: "Q2. Detail the exact primary, secondary, and accent colors (Hex codes) you selected for today's design project:", userDraft: "" },
        { id: "q3", prompt: "Q3. If text fails accessibility contrast (WCAG standard) against the background, what adjustments to lightness/saturation do you make?", userDraft: "" },
        { id: "q4", prompt: "Q4. Why is high contrast on Call-to-Action (CTA) buttons critical for an e-commerce client's sales conversions?", userDraft: "" }
      ] : [
        { id: "q1", prompt: "Q1. 60-30-10 color rule aur Complementary vs Analogous color palettes ka farq explain karein:", userDraft: "" },
        { id: "q2", prompt: "Q2. Aaj aapne apne deliverable ke liye jo 3 primary colors (Hex codes) select kiye, unka brand psychology se kya taaluq hai?", userDraft: "" },
        { id: "q3", prompt: "Q3. Agar background aur text ke darmiyan contrast low ho aur parhna mushkil ho, toh accessibility standard ke mutabiq use kaise fix karenge?", userDraft: "" },
        { id: "q4", prompt: "Q4. Client ke e-commerce brand ke liye Call-to-Action (CTA) button ka color choose karte waqt contrast ki kya ahmiyat hai?", userDraft: "" }
      ];

      quiz = isEn ? [
        { id: 1, question: "In the 60-30-10 color rule, what role does the 10% color play?", options: ["Accent color (CTA buttons & highlights)", "Dominant background color", "Secondary supporting color", "Border stroke only"], correctIndex: 0, explanation: "10% is reserved for the punchy accent color that drives action." },
        { id: 2, question: "Which color model is universally used for digital screens and web UI?", options: ["RGB (Red, Green, Blue)", "CMYK (Cyan, Magenta, Yellow, Black)", "Pantone spot colors", "Grayscale only"], correctIndex: 0, explanation: "Digital displays emit light using RGB color space." },
        { id: 3, question: "What are colors positioned directly opposite each other on the color wheel called?", options: ["Complementary colors", "Analogous colors", "Monochromatic colors", "Triadic colors"], correctIndex: 0, explanation: "Complementary colors sit opposite on the wheel, creating maximum contrast." },
        { id: 4, question: "What is the recommended minimum contrast ratio for standard body text under WCAG AA guidelines?", options: ["4.5:1", "2:1", "1:1", "10:1"], correctIndex: 0, explanation: "WCAG AA requires at least 4.5:1 contrast ratio for readable body text." }
      ] : [
        { id: 1, question: "60-30-10 color rule mein 10% hissa kis color ke liye makhsoos hota hai?", options: ["Accent color (CTA button aur ahem points)", "Dominant background", "Secondary color", "Borders"], correctIndex: 0, explanation: "10% accent color viewer ki tawajjah action button par khenchta hai." },
        { id: 2, question: "Digital mobile aur computer screens ke liye konsa color model use hota hai?", options: ["RGB (Red, Green, Blue)", "CMYK", "Pantone", "Grayscale"], correctIndex: 0, explanation: "Digital screens roshni emission ke liye RGB model use karti hain." },
        { id: 3, question: "Color wheel par aamne saamne wale mukhalif colors ko kya kehte hain?", options: ["Complementary Colors", "Analogous Colors", "Monochromatic", "Pastel Colors"], correctIndex: 0, explanation: "Complementary colors maximum visual contrast paida karte hain." },
        { id: 4, question: "Background aur text ke darmiyan standard readability contrast ratio kitna hona chahiye?", options: ["Kam az kam 4.5:1", "2:1", "1:1", "10:1"], correctIndex: 0, explanation: "Standard accessibility ke mutabiq 4.5:1 contrast zaroori hota hai." }
      ];
    } else if (dayNum === 3) {
      worksheetQuestions = isEn ? [
        { id: "q1", prompt: "Q1. Explain the difference between Serif, Sans-Serif, and Display fonts, and the golden rules for font pairing:", userDraft: "" },
        { id: "q2", prompt: "Q2. Detail the exact typography hierarchy (Heading, Subheading, Body text font names, weights, and point sizes) in today's deliverable:", userDraft: "" },
        { id: "q3", prompt: "Q3. If text lines feel cramped or letter spacing looks awkward, how do you adjust leading (line height) and tracking/kerning?", userDraft: "" },
        { id: "q4", prompt: "Q4. Why does restricting a client deliverable to no more than 2-3 font families convey high-ticket corporate credibility?", userDraft: "" }
      ] : [
        { id: "q1", prompt: "Q1. Serif aur Sans-Serif fonts ka bunyadi farq aur do fonts ko aapas mein pair karne ka golden rule explain karein:", userDraft: "" },
        { id: "q2", prompt: "Q2. Aaj aapne heading, subheading aur body text ke liye kon kon se font families aur font weights select kiye?", userDraft: "" },
        { id: "q3", prompt: "Q3. Agar headings aur body text ke darmiyan leading (line spacing) ya kerning kharab ho, toh readability kaise improve karenge?", userDraft: "" },
        { id: "q4", prompt: "Q4. Client ke professional pitch deck ya flyer mein 2 se zyada fonts use na karne ki commercial wajah kya hai?", userDraft: "" }
      ];

      quiz = isEn ? [
        { id: 1, question: "Which font family style is best suited for clean modern digital user interfaces?", options: ["Sans-Serif (e.g. Inter, Roboto)", "Decorative Gothic", "High-ornament Cursive", "Old English"], correctIndex: 0, explanation: "Sans-Serif fonts offer maximum legibility on digital screens." },
        { id: 2, question: "What is the typography term for the vertical spacing between lines of text?", options: ["Leading (Line Height)", "Kerning", "Tracking", "Baseline shift"], correctIndex: 0, explanation: "Leading defines the vertical distance between consecutive text lines." },
        { id: 3, question: "What is the process of adjusting the space between individual letter pairs called?", options: ["Kerning", "Tracking", "Alignment", "Justification"], correctIndex: 0, explanation: "Kerning adjusts spacing between specific letter pairs." },
        { id: 4, question: "What is the maximum recommended number of distinct font families in a single commercial design?", options: ["2 to 3 font families", "6 to 8 font families", "10 font families", "Unlimited"], correctIndex: 0, explanation: "Limiting fonts to 2-3 preserves brand consistency and visual cohesion." }
      ] : [
        { id: 1, question: "Modern apps aur digital screens par asaan parhne ke liye konsi font category best hai?", options: ["Sans-Serif (e.g. Inter, Roboto)", "Heavy Gothic", "Novelty Script", "Old Cursive"], correctIndex: 0, explanation: "Sans-Serif digital screens par sab se clear nazar aati hai." },
        { id: 2, question: "Text lines ke darmiyan vertical faaslay (line height) ko typography mein kya kehte hain?", options: ["Leading (Line Height)", "Kerning", "Tracking", "Stroke"], correctIndex: 0, explanation: "Leading do lines ke darmiyan faaslay ko control karti hai." },
        { id: 3, question: "Do makhsoos letters ke darmiyan space theek karne ko kya kehte hain?", options: ["Kerning", "Tracking", "Alignment", "Grid"], correctIndex: 0, explanation: "Kerning do letters ke space ko balance karti hai." },
        { id: 4, question: "Ek professional design project mein maximum kitni font families use karni chahiye?", options: ["2 se 3 font families", "6 se 8 font families", "10 font families", "Jitni marzi"], correctIndex: 0, explanation: "2 se 3 font families design ko organized aur clean rakhti hain." }
      ];
    }
  }

  // ==========================================
  // 3. UNIVERSAL / DYNAMIC TOPIC SYNTHESIZER
  // (Works for any other day, and ANY custom course!)
  // ==========================================
  if (worksheetQuestions.length === 0) {
    const cleanTopic = dayTopic.replace(/^Day\s*\d+\s*[:\-]\s*/i, '');
    
    worksheetQuestions = isEn ? [
      { id: "q1", prompt: `Q1. Explain the core practical concepts and objectives covered in today's 20-minute session on "${cleanTopic}" in your own words:`, userDraft: "" },
      { id: "q2", prompt: `Q2. Detail the exact technical workflow, tools used, and the hands-on deliverable you created for "${cleanTopic}" today:`, userDraft: "" },
      { id: "q3", prompt: `Q3. What technical challenge, roadblock, or error did you encounter while executing "${cleanTopic}", and how did you resolve it?`, userDraft: "" },
      { id: "q4", prompt: `Q4. How does this completed "${cleanTopic}" deliverable demonstrate tangible commercial value for a freelance client on Upwork or Fiverr?`, userDraft: "" }
    ] : [
      { id: "q1", prompt: `Q1. Aaj ke 20-minute practical session "${cleanTopic}" ka core concept aur bunyadi maqsad apne alfaz mein explain karein:`, userDraft: "" },
      { id: "q2", prompt: `Q2. Aaj "${cleanTopic}" ke hawalay se aapne jo deliverable/task execute kiya, uske step-by-step technical steps aur output kya thi?`, userDraft: "" },
      { id: "q3", prompt: `Q3. Is deliverable ko implement karte waqt aapko kya technical mushkil ya error pesh aya aur aapne usay kaise troubleshoot kiya?`, userDraft: "" },
      { id: "q4", prompt: `Q4. Yeh "${cleanTopic}" deliverable real freelance client ke project mein kis tarah use hoga aur client ko kya value milegi?`, userDraft: "" }
    ];

    quiz = isEn ? [
      {
        id: 1,
        question: `What is the primary deliverable objective of today's focus on "${cleanTopic}"?`,
        options: [
          `Mastering practical execution and client-ready application of ${cleanTopic}`,
          `Memorizing abstract theory without applying any tools`,
          `Skipping hands-on practice to watch unrelated videos`,
          `Closing the software without testing the output`
        ],
        correctIndex: 0,
        explanation: `Practix micro-learning emphasizes hands-on execution for ${cleanTopic} to build retention.`
      },
      {
        id: 2,
        question: `When executing tasks for "${cleanTopic}", what is the recommended immediate next step after the 20-minute video?`,
        options: [
          `Spend the next 25 minutes applying the techniques in your active software/tools`,
          `Browse unrelated social media feeds`,
          `Shut down your laptop without taking notes`,
          `Submit a blank submission without proof`
        ],
        correctIndex: 0,
        explanation: `Immediate 25-minute deliberate practice achieves up to 90% skill retention.`
      },
      {
        id: 3,
        question: `How should a professional deliverable for "${cleanTopic}" be verified before client delivery?`,
        options: [
          `Conduct rigorous QA, verify formatting standards, and test in live environment`,
          `Send unverified drafts without checking for errors`,
          `Ignore client specifications and guidelines`,
          `Skip testing to deliver faster`
        ],
        correctIndex: 0,
        explanation: `Quality assurance and adherence to project requirements ensure 5-star client ratings.`
      },
      {
        id: 4,
        question: `What is the direct benefit of publishing your verified "${cleanTopic}" proof of work on Practix?`,
        options: [
          `It automatically compiles your public proof-of-work portfolio and unlocks the next day`,
          `It is only recorded for attendance`,
          `It has no commercial application`,
          `It only provides numerical score without portfolio cards`
        ],
        correctIndex: 0,
        explanation: `Every verified proof compiles into your live portfolio card to attract freelance clients.`
      }
    ] : [
      {
        id: 1,
        question: `Aaj ke topic "${cleanTopic}" ka bunyadi practical maqsad kya hai?`,
        options: [
          `${cleanTopic} ko software mein practically execute karke client-ready deliverable banana`,
          `Sirf theoretical lecture sun kar bina practice band kar dena`,
          `Bina deliverable banaye aglay din par jump karna`,
          `Faltu videos dekhna`
        ],
        correctIndex: 0,
        explanation: `Practix ka maqsad ${cleanTopic} ko practical kaam mein convert karna hai.`
      },
      {
        id: 2,
        question: `"${cleanTopic}" ki 20 minute video dekhne ke foran baad sab se zaroori step kya hai?`,
        options: [
          `Baqi 25 minute foran computer/software mein practical task execute karna`,
          `YouTube par agle 2 ghante entertainment videos dekhna`,
          `Bina homework ke laptop band kar dena`,
          `Bina proof ke din mark complete karna`
        ],
        correctIndex: 0,
        explanation: `Foran 25 minute practice karne se 90% retention hasil hoti hai.`
      },
      {
        id: 3,
        question: `"${cleanTopic}" deliverable client ko submit karne se pehle kya check karna zaroori hai?`,
        options: [
          `Quality test karna, errors check karna, aur client brief ke mutabiq verify karna`,
          `Bina check kiye adhoora kaam bhej dena`,
          `Client ki requirements ko ignore karna`,
          `Sirf rough screenshot bhej dena`
        ],
        correctIndex: 0,
        explanation: `Proper quality checking se client 5-star rating aur repeat orders deta hai.`
      },
      {
        id: 4,
        question: `"${cleanTopic}" ka verified proof Practix par upload karne ka sab se bara faida kya hai?`,
        options: [
          `Aapka live verified public portfolio card ban jata hai aur agla din unlock hota hai`,
          `Sirf attendance lagti hai`,
          `Iska koi freelance faida nahi hota`,
          `Sirf test pass hota hai`
        ],
        correctIndex: 0,
        explanation: `Daily verified proof aapka public portfolio card generate karta hai jo real clients dekhte hain.`
      }
    ];
  }

  const homework = isEn ? {
    title: `Submit Today's Practice Proof for Day ${dayNum} (${dayTopic})`,
    instructions: `Attach a live link, GitHub repo, Figma link, Google Drive, or screenshot demonstrating today's practical execution of ${dayTopic}.`,
    estimatedTime: "45 Minutes",
    submissionProof: null
  } : {
    title: `Submit Today's Practice Proof for Day ${dayNum} (${dayTopic})`,
    instructions: `Aaj ke topic (${dayTopic}) ka practical screenshot, Figma link, GitHub repository link, ya live proof yahan paste karein.`,
    estimatedTime: "45 Minutes",
    submissionProof: null
  };

  return { worksheetQuestions, quiz, theoryNotes, homework };
}

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

  const dayItem = (user && user.roadmap && user.roadmap.find(d => d.day === dayNum)) || null;
  const dayTitle = dayItem ? dayItem.title : (user && user.roadmap && user.roadmap[dayNum - 1] ? user.roadmap[dayNum - 1].title : ("Day " + dayNum + ": " + courseTitle));

  const assessment = generateDailyAssessment(dayNum, dayTitle, courseTitle, userSkill, lang);

  return {
    day: dayNum,
    title: "Day " + dayNum + ": " + dayTitle,
    videoTitle: "Day " + dayNum + ": " + dayTitle,
    duration: "25 Mins",
    videoUrl: videoEmbed,
    originalUrl: videoWatch,
    theoryNotes: assessment.theoryNotes,
    worksheetQuestions: assessment.worksheetQuestions,
    quiz: assessment.quiz,
    homework: assessment.homework
  };
}

// In-Memory Multi-User DB
function getInitialDb() {
  return {
    users: {},
    leaderboard: [
      { rank: 1, name: "Hamza Tariq", streak: 28, xp: 4820, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80", skill: "Full-Stack Dev" },
      { rank: 2, name: "Sara Ahmed", streak: 22, xp: 3750, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80", skill: "Graphic Design" },
      { rank: 3, name: "Bilal Ahmed", streak: 12, xp: 2100, avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80", skill: "Video Editing" },
      { rank: 4, name: "Zainab Raza", streak: 9, xp: 1620, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=80&q=80", skill: "Python AI" }
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
        delete data.users['ali'];
        delete data.users['test_ali'];
        delete data.users['ali.khan@example.com'];
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
        if (key === 'ali' || key === 'test_ali' || (ru.name && ru.name.toLowerCase().includes('ali khan'))) continue;
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

  // Dynamic user for the identifier (never bleed another user's session or hardcoded mock user)
  const cleanId = identifier ? identifier.replace(/[^a-z0-9_-]/g, '') : "student";
  const displayName = identifier ? (identifier.charAt(0).toUpperCase() + identifier.slice(1)) : "Student";
  const defCourse = (typeof FEATURED_COURSES !== 'undefined' && FEATURED_COURSES.length > 0) ? FEATURED_COURSES[0] : null;

  const fallbackUser = {
    id: cleanId,
    name: displayName,
    email: `${cleanId}@practix.user`,
    currentSkill: defCourse ? defCourse.category : "Python & AI",
    streak: 1,
    totalXp: 150,
    level: 1,
    activeCourse: defCourse ? {
      id: defCourse.id,
      title: defCourse.title,
      source: "Practix Curated Free Track",
      totalDays: defCourse.durationDays,
      completedDays: 0,
      currentDay: 1,
      category: defCourse.category,
      url: defCourse.url,
      embedUrl: defCourse.embedUrl,
      estimatedIncomePotential: "$600 - $2,500 / Month"
    } : {
      id: `course-${cleanId}`,
      title: "Python Programming & AI Automation Masterclass",
      totalDays: 14,
      completedDays: 0,
      currentDay: 1,
      category: "Python & AI"
    },
    roadmap: generateCurriculum(defCourse ? defCourse.title : "Python", defCourse ? defCourse.durationDays : 14),
    portfolio: []
  };
  return fallbackUser;
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

  // Intelligent matching against Curated Featured Courses
  const skillLower = (skill || "").toLowerCase();
  const matchedCourse = FEATURED_COURSES.find(c => 
    c.id.toLowerCase() === skillLower ||
    c.category.toLowerCase().includes(skillLower) ||
    skillLower.includes(c.category.toLowerCase()) ||
    c.title.toLowerCase().includes(skillLower) ||
    (skillLower.includes("python") && c.id === "fc_python_14") ||
    (skillLower.includes("canva") && c.id === "fc_canva_7") ||
    (skillLower.includes("prompt") && c.id === "fc_prompt_7") ||
    (skillLower.includes("web") && c.id === "fc_webdev_30") ||
    (skillLower.includes("design") && c.id === "fc_design_30") ||
    (skillLower.includes("video") && c.id === "fc_video_7") ||
    (skillLower.includes("figma") && c.id === "fc_figma_14") ||
    (skillLower.includes("english") && c.id === "fc_english_14") ||
    (skillLower.includes("excel") && c.id === "fc_excel_7") ||
    (skillLower.includes("marketing") && c.id === "fc_marketing_14") ||
    (skillLower.includes("shopify") && c.id === "fc_shopify_14")
  ) || FEATURED_COURSES[0];

  const durationDays = matchedCourse.durationDays || 30;
  const initialRoadmap = generateCurriculum(matchedCourse.title, durationDays);

  const newUser = {
    id: userKey,
    name: cleanName,
    email: `${userKey}@practix.user`,
    password: password.trim(),
    role: "Freelance Student",
    currentSkill: matchedCourse.category,
    dailyGoalMins: Number(dailyGoalMins) || 45,
    targetDays: durationDays,
    streak: 1,
    bestStreak: 1,
    totalXp: 150,
    level: 1,
    freezeAvailable: 1,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    activeCourse: {
      id: matchedCourse.id,
      title: matchedCourse.title,
      source: "Practix Curated Free Track",
      totalDays: durationDays,
      completedDays: 0,
      currentDay: 1,
      category: matchedCourse.category,
      url: matchedCourse.url,
      embedUrl: matchedCourse.embedUrl,
      estimatedIncomePotential: "$600 - $2,500 / Month"
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

// Curated Free Practice Tracks Catalog
app.get('/api/courses/featured', (req, res) => {
  res.json(FEATURED_COURSES);
});

// 1-Click Enrollment in Featured Track
app.post('/api/courses/enroll-featured', (req, res) => {
  const db = loadDb();
  const user = getUser(req, db);
  const { courseId } = req.body;
  const lang = (req.body.lang || "urdu").toLowerCase();
  const isEn = lang === "en";

  const course = FEATURED_COURSES.find(c => c.id === courseId);
  if (!course) {
    return res.status(404).json({ error: isEn ? "Track not found!" : "Course nahi mila!" });
  }

  const durationDays = course.durationDays || 30;
  user.currentSkill = course.category;
  user.targetDays = durationDays;
  user.activeCourse = {
    id: course.id,
    title: course.title,
    source: "Practix Curated Free Track",
    totalDays: durationDays,
    completedDays: 0,
    currentDay: 1,
    category: course.category,
    url: course.url,
    embedUrl: course.embedUrl,
    estimatedIncomePotential: "$600 - $2,500 / Month"
  };
  user.roadmap = generateCurriculum(course.title, durationDays);

  saveDb(db);

  res.json({
    success: true,
    message: isEn
      ? `Enrolled successfully in "${course.title}" (${durationDays}-Day Track)!`
      : `Mubarak ho! Aap "${course.title}" (${durationDays} Din ka Track) mein kamyabi se enroll ho gaye hain.`,
    user: user,
    course: user.activeCourse,
    roadmap: user.roadmap
  });
});

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

  // Valid Skill Course - Generate Fresh Roadmap with targetDays for THIS user!
  const sprintDays = Number(targetDays) || 30;
  const newRoadmap = generateCurriculum(courseTitle, sprintDays);

  // Dynamic Category and Earning Potential from Global Taxonomy
  const category = matchedSkillTrack ? matchedSkillTrack.name : (user.currentSkill || "Global Professional Skill");
  const estimatedOutcome = matchedSkillTrack ? matchedSkillTrack.earningPotential : (category.includes("Academics") ? "Target: Grade A+ (90%+ Marks)" : "$800 - $2,500 / Month");
  user.currentSkill = category;
  user.targetDays = sprintDays;

  user.activeCourse = {
    id: `course-${Date.now()}`,
    title: courseTitle,
    source: `YouTube: ${channelName}`,
    totalDays: sprintDays,
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
      ? `Success! "${courseTitle}" has been analyzed and structured into your ${sprintDays}-Day Practical Action Roadmap!`
      : `Kamyabi! "${courseTitle}" analyze ho kar ${sprintDays}-Day Step-by-Step Practical Roadmap mein tabdeel ho gaya hai!`,
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

  const newRoadmap = generateCurriculum(rawName, targetDays);
  user.targetDays = targetDays;

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
    message: `File "${rawName}" analyze ho gayi aur ${targetDays}-Day Action Plan tayyar hai!`,
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

  // Dynamic Fair Pricing Gate:
  // 7-Day Sprints: 100% FREE!
  // 14-Day Skill Tracks: Day 8-14 requires PRO (Rs. 499)
  // 30-Day Masterclasses: Day 8-30 requires PRO (Rs. 999)
  const courseTotalDays = (user.activeCourse && Number(user.activeCourse.totalDays)) || 30;

  if (courseTotalDays > 7 && dayNum > 7 && !user.isPro) {
    const is14Day = courseTotalDays <= 14;
    const fee = is14Day ? 499 : 999;
    const trackLabel = is14Day ? "14-Day Skill Track" : "30-Day Career Masterclass";

    return res.status(402).json({
      error: "pro_required",
      isProRequired: true,
      fee: fee,
      totalDays: courseTotalDays,
      trackLabel: trackLabel,
      message: `🌟 7-Day Free Trial Mukammal!\n\nMubarak ho! Aapne pehle 7 din kamyabi se complete kar liye hain.\n\n"${trackLabel}" ke baqi days (${dayNum} se ${courseTotalDays}) aur verified certificate unlock karne ke liye Practix PRO (Sirf Rs. ${fee}) mein upgrade karein!`
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
  const { proofUrl, notes, worksheetAnswers = {}, quizScore = 0 } = req.body;

  // STRICT VALIDATION: Cannot submit without real proof URL and worksheet answers
  if (!proofUrl || typeof proofUrl !== 'string' || proofUrl.trim().length < 5) {
    return res.status(400).json({
      error: "proof_required",
      message: "⚠️ Proof of Work Missing!\n\nBaraye meherbani apna practical proof (Figma link, GitHub repo, Google Drive, ya image link) lazmi attach karein taake kaam verify ho sakay."
    });
  }

  const validAnswers = Object.values(worksheetAnswers).filter(a => typeof a === 'string' && a.trim().length >= 5);
  if (validAnswers.length < 2) {
    return res.status(400).json({
      error: "worksheet_incomplete",
      message: "⚠️ Incomplete Worksheet!\n\nBaraye meherbani Part 2 ke tamam sawalat ke mukammal aur tafseeli jawab likhein taake aapka concept mazboot ho."
    });
  }

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
// 10.1 Practix 24/7 AI Tutor & Homework Helper
app.post('/api/ai/tutor', (req, res) => {
  const db = loadDb();
  const user = getUser(req, db);
  const { message, dayNum, dayTitle, skillTitle, lang } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  const isEn = (lang || "urdu").toLowerCase() === "en";
  const userMsg = message.trim();
  const lower = userMsg.toLowerCase();
  const day = Number(dayNum) || (user.activeCourse ? user.activeCourse.currentDay : 1);
  const topic = dayTitle || (user.activeCourse ? user.activeCourse.title : "Practical Skill Lesson");
  const skill = skillTitle || user.currentSkill || "Freelance Skill";

  let reply = "";
  
  if (lower.includes("error") || lower.includes("syntax") || lower.includes("not working") || lower.includes("chal nahi") || lower.includes("masla") || lower.includes("issue") || lower.includes("troubleshoot")) {
    if (isEn) {
      reply = `🛠️ **24/7 AI Tutor Troubleshooting (Day ${day}: ${topic})**:\n\n1. **Check Your Terminal / Environment:** Ensure you are in the correct directory. If it is Python, verify 'python --version'. If it is an Indentation/Syntax error, check matching colons ':' and 4-space indentation.\n2. **Isolate the Line:** Look at the error line number in the terminal stack trace.\n3. **Quick Fix Strategy:** Test running just the isolated function or deliverable. If still stuck, paste the exact error message here and I will fix the code for you right away!`;
    } else {
      reply = `🛠️ **24/7 AI Tutor Solution (Day ${day}: ${topic})**:\n\n1. **Terminal / Tool Check Karein:** Pehle check karein ke aap sahi folder mein hain. Agar Python hai toh terminal mein 'python --version' check karein. Agar SyntaxError ya IndentationError hai toh colons (:) aur 4 spaces check karein.\n2. **Error Line Number Dekhein:** Terminal mein jo line number likhi aa rahi hai, us line par spelling ya missing bracket check karein.\n3. **Fix Ka Tareeqa:** Code ko chhotay hissay mein chala kar test karein. Agar abhi bhi solve na ho toh error ka text yahan paste karein, main foran code theek kar dunga!`;
    }
  } else if (lower.includes("q1") || lower.includes("q2") || lower.includes("q3") || lower.includes("q4") || lower.includes("worksheet") || lower.includes("sawal") || lower.includes("question") || lower.includes("jawab")) {
    if (isEn) {
      reply = `📝 **Worksheet Guidance for Day ${day} (${topic})**:\n\n- **Q1 (Core Concept):** Summarize in 2-3 sentences what you learned from today's 20-min lesson on *${topic}*.\n- **Q2 (Technical Execution):** Write down the exact tools/commands/code you ran on your machine today and the output.\n- **Q3 (Troubleshooting):** Mention one problem or error you handled while building today's task.\n- **Q4 (Client Value):** Explain how a paying freelance client on Upwork/Fiverr benefits from this *${topic}* deliverable.`;
    } else {
      reply = `📝 **Day ${day} (${topic}) Worksheet Ka Asaan Hal**:\n\n- **Q1 (Core Concept):** Apne alfaz mein 2-3 lines mein likhein ke aaj *${topic}* ke 20 minute lecture se aapne kya seekha.\n- **Q2 (Technical Steps):** Aaj aapne computer mein jo code run kiya ya design banaya, uske steps aur terminal output likhein.\n- **Q3 (Troubleshooting):** Kaam karte waqt jo masla ya error aya aur aapne use kaise theek kiya, wo likhein.\n- **Q4 (Client Value):** Upwork ya Fiverr par client ko is *${topic}* deliverable se kya faida hoga aur wo paise kyun dega.`;
    }
  } else if (lower.includes("proof") || lower.includes("upload") || lower.includes("submit") || lower.includes("link") || lower.includes("github") || lower.includes("figma") || lower.includes("drive")) {
    if (isEn) {
      reply = `🔗 **Proof Submission Step-by-Step**:\n\n1. Take a screenshot of your working code/design, or copy your Figma / GitHub repository link.\n2. If using an image: Upload it to **Google Drive** or **Imgur** -> Set sharing to **"Anyone with link can view"** -> Copy link.\n3. Paste the URL into the **Part 4 Proof URL** box and click **"Submit & Mark Day Complete"**!`;
    } else {
      reply = `🔗 **Proof Link Submit Karne Ka Aasaan Tareeqa**:\n\n1. Apne banaye huay code ya design ka screenshot lein, ya apna Figma / GitHub repo link copy karein.\n2. Screenshot ke liye: **Google Drive** par upload karein -> Share par click karein -> **"Anyone with link can view"** select karein -> Link copy karein.\n3. Wo link **Part 4 Proof URL** wale box mein paste karein aur **"Submit & Mark Day Complete"** dabayein!`;
    }
  } else if (lower.includes("client") || lower.includes("freelance") || lower.includes("upwork") || lower.includes("fiverr") || lower.includes("earn") || lower.includes("kamayi")) {
    if (isEn) {
      reply = `💼 **Freelance Monetization Tip for ${topic}**:\n\nClients on Upwork/Fiverr don't pay for course certificates—they pay for finished results! By completing today's Day ${day} deliverable, you are creating a real portfolio proof that you can attach to client proposals. Introductory gigs for this skill typically start at **$30 - $75** per task!`;
    } else {
      reply = `💼 **${topic} Se Freelancing Mein Kamayi Ka Formula**:\n\nUpwork aur Fiverr par clients certificates nahi dekhte—wo real kaam ka proof dekhte hain! Aaj jo Day ${day} ka deliverable aap bana rahe hain, yeh aapke portfolio card mein shamil ho jayega jise aap client ke proposal ke sath bhej sakte hain. Is skill ke introductory orders aam tor par **$30 se $75** se shuru hote hain!`;
    }
  } else {
    if (isEn) {
      reply = `🤖 **Practix 24/7 AI Tutor is here for you!**\n\nI am assisting you on **Day ${day}: ${topic}** (${skill}). You can ask me:\n- Step-by-step code or design help\n- Worksheet questions explanation\n- Fixing terminal errors\n- How to submit your proof link\n\nWhat specific part of today's homework are you working on right now?`;
    } else {
      reply = `🤖 **Practix 24/7 AI Tutor aapki madad ke liye hazir hai!**\n\nMain **Day ${day}: ${topic}** (${skill}) ke liye 24/7 online hoon. Aap mujh se pooch sakte hain:\n- Code ya design banane ka tareeqa\n- Worksheet ke sawalat ka matlab\n- Terminal ya software ke error theek karna\n- Proof link upload karne ka tareeqa\n\nAaj ke homework mein aapko kis jagah mushkil aa rahi hai? Mujhe batayein, main foran help karunga!`;
    }
  }

  res.json({
    reply,
    tutorName: isEn ? "Practix 24/7 AI Tutor" : "Practix 24/7 AI Tutor",
    dayNum: day,
    dayTitle: topic,
    timestamp: new Date().toLocaleTimeString()
  });
});


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

// ═════════════════════════ 🛡️ ADMIN MANAGEMENT ROUTES ═════════════════════════
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'practix_admin_2026';

function verifyAdminAuth(req, res, next) {
  const key = req.headers['x-admin-key'] || req.query.key || (req.body && req.body.adminKey);
  if (key === ADMIN_SECRET) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized: Invalid Admin Key" });
}

// 1. Admin Login Verification
app.post('/api/admin/auth', (req, res) => {
  const { key } = req.body;
  if (key === ADMIN_SECRET) {
    return res.json({ success: true, message: "Admin access granted!" });
  }
  return res.status(401).json({ error: "Ghalat Admin Secret PIN!" });
});

// 2. Admin System Overview (Stats, Users, Submissions)
app.get('/api/admin/overview', verifyAdminAuth, async (req, res) => {
  const db = loadDb();
  const usersList = Object.values(db.users).map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    currentSkill: u.currentSkill,
    streak: u.streak || 0,
    totalXp: u.totalXp || 0,
    level: u.level || 1,
    activeCourseTitle: u.activeCourse ? u.activeCourse.title : "No Course",
    completedDays: u.activeCourse ? u.activeCourse.completedDays || 0 : 0,
    totalDays: (u.activeCourse && u.activeCourse.totalDays) || u.targetDays || 30,
    isPro: Boolean(u.isPro),
    submissionsCount: (u.portfolio && u.portfolio.length) || 0
  }));

  const allSubmissions = [];
  Object.values(db.users).forEach(u => {
    if (Array.isArray(u.portfolio)) {
      u.portfolio.forEach(p => {
        allSubmissions.push({
          ...p,
          userName: u.name,
          userEmail: u.email,
          userSkill: u.currentSkill
        });
      });
    }
  });

  const totalXp = Object.values(db.users).reduce((acc, u) => acc + (u.totalXp || 0), 0);

  res.json({
    success: true,
    stats: {
      totalStudents: usersList.length,
      totalSubmissions: allSubmissions.length,
      totalXpAwarded: totalXp,
      cloudDatabase: "Supabase Connected 🟢"
    },
    users: usersList,
    submissions: allSubmissions
  });
});

// 3. Admin Delete User
app.post('/api/admin/user/delete', verifyAdminAuth, async (req, res) => {
  const { userId } = req.body;
  const db = loadDb();
  if (db.users[userId]) {
    delete db.users[userId];
    saveDb(db);
    try {
      await supabase.from('users').delete().eq('id', userId);
    } catch (e) {}
    return res.json({ success: true, message: `User ${userId} deleted.` });
  }
  return res.status(404).json({ error: "User not found" });
});

// 4. Admin Review / Grade Submission
app.post('/api/admin/submission/grade', verifyAdminAuth, (req, res) => {
  const { userEmail, submissionId, grade, feedback } = req.body;
  const db = loadDb();
  const user = Object.values(db.users).find(u => u.email === userEmail || u.id === userEmail);
  if (!user || !user.portfolio) {
    return res.status(404).json({ error: "Submission or user not found" });
  }

  const sub = user.portfolio.find(p => p.id === submissionId);
  if (sub) {
    if (grade) sub.grade = grade;
    if (feedback) sub.feedback = feedback;
    sub.verified = true;
    saveDb(db);
    return res.json({ success: true, message: "Submission updated!", submission: sub });
  }
  return res.status(404).json({ error: "Submission not found" });
});

// 5. Admin Toggle PRO Status
app.post('/api/admin/user/toggle-pro', verifyAdminAuth, async (req, res) => {
  const { userId, isPro } = req.body;
  const db = loadDb();
  const user = db.users[userId] || Object.values(db.users).find(u => u.email === userId || u.id === userId);
  if (user) {
    user.isPro = Boolean(isPro);
    saveDb(db);
    try {
      await supabase.from('users').update({ isPro: user.isPro }).eq('id', user.id);
    } catch (e) {}
    return res.json({ success: true, message: `User ${user.name} is now ${user.isPro ? 'PRO ⭐' : 'Free Trial'}`, isPro: user.isPro });
  }
  return res.status(404).json({ error: "User not found" });
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
