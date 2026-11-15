// Global Taxonomy and Classification Engine for Skill2Earn (Worldwide Scale)

const GLOBAL_ENTERTAINMENT_BLACKLIST = [
  // 1. Dramas, TV Series, Movies, Cinema & Streaming Shows
  {
    category: "Dramas, Serials & TV Shows",
    icon: "🎬",
    reason: "Television drama, soap opera, web series ya movie stream",
    keywords: [
      "drama", "episode", "season", "serial", "soap opera", "telenovela", "kdrama", "k-drama", "c-drama",
      "pakistani drama", "indian drama", "turkish drama", "ertugrul", "kurulus", "osman",
      "ary digital", "hum tv", "geo entertainment", "har pal geo", "green entertainment",
      "zee tv", "star plus", "sony liv", "colors tv", "netflix series", "hbo", "amazon prime",
      "teaser", "promo", "ost", "soundtrack", "dar-e-nijaat", "kabhi main", "tere bin",
      "parizaad", "ishq murshid", "humsafar", "zindagi gulzar hai", "khuda aur mohabbat",
      "movie", "film", "cinema", "feature film", "telefilm", "short film", "trailer",
      "behind the scenes", "blooper", "deleted scene", "climax scene", "movie clip",
      "box office", "hollywood", "bollywood", "lollywood", "tollywood"
    ]
  },

  // 2. Music, Songs, Albums, Tracks & Performances
  {
    category: "Music & Songs",
    icon: "🎵",
    reason: "Commercial song, music video, track ya performance",
    keywords: [
      "song", "music", "audio", "lyrics", "remix", "lofi", "lo-fi", "slowed reverb", "8d audio",
      "official video", "music video", "lyric video", "track", "single", "album", "ep",
      "pop", "rock", "hip hop", "rap", "trap", "drill", "r&b", "jazz", "blues", "edm",
      "coke studio", "nescafe basement", "t-series", "speed records", "zee music",
      "ghazal", "qawwali", "bhangra", "punjabi song", "bollywood song", "acoustic cover",
      "karaoke", "instrumental version", "bass boosted", "nightcore", "dj mix", "party mix",
      "singer", "playback singer", "rapper", "boyband", "orchestra concert"
    ]
  },

  // 3. Spiritual / Religious Audio & Recitations (Non-Instructional Listening)
  {
    category: "Spiritual / Religious Listening",
    icon: "🕌",
    reason: "Naat, Nasheed, Tilawat ya Religious recital (Not an instructional course)",
    keywords: [
      "naat", "nasheed", "hamd", "tilawat", "quran recitation", "surah recitation", "mushaira",
      "bayaan", "molana", "mufti", "tariq jameel", "saqib raza", "assubhu", "bada min",
      "trq production", "dars", "spiritual audio", "bhajan", "kirtan", "gospel choir", "hymn",
      "azaan", "athan", "dua recitation", "salawat", "qasida", "manqabat", "nohay", "marsiya"
    ]
  },

  // 4. Comedy, Roasts, Pranks, Memes & Sketches
  {
    category: "Comedy & Entertainment",
    icon: "😂",
    reason: "Prank, comedy roast, standup ya meme video",
    keywords: [
      "prank", "prank call", "gold digger prank", "public prank", "scare prank",
      "roast", "roasting", "carryminati", "ducky bhai roast", "reaction video",
      "comedy", "standup comedy", "stand-up", "comic", "funny moments", "funny clips",
      "try not to laugh", "vines", "memes", "meme compilation", "shitpost", "dank",
      "parody", "spoof", "mimicry", "satire", "sketch comedy", "bloopers", "fails", "fail army"
    ]
  },

  // 5. Daily Vlogs, Family Vlogs, Gossip & Lifestyle
  {
    category: "Vlogs & Paparazzi",
    icon: "📹",
    reason: "Daily vlog, personal lifestyle ya celebrity gossip",
    keywords: [
      "vlog", "daily vlog", "family vlog", "lifestyle vlog", "travel vlog", "couple vlog",
      "morning routine", "night routine", "what i eat in a day", "room tour", "house tour",
      "shopping haul", "zara haul", "shein haul", "unboxing toys", "surprise gift",
      "wedding vlog", "eid vlog", "diwali vlog", "celebrity gossip", "paparazzi", "spotted",
      "street food review", "village food secrets", "mukbang", "asmr eating", "eating show"
    ]
  },

  // 6. Gaming Streams, Let's Plays & Casual Matches
  {
    category: "Gaming Streams & Let's Plays",
    icon: "🎮",
    reason: "Casual gaming stream, funny moments ya gameplay walkthrough",
    keywords: [
      "gameplay", "walkthrough", "let's play", "gaming stream", "live gaming",
      "pubg mobile", "free fire", "gta 5", "gta v", "gta rp", "minecraft survival",
      "roblox", "fortnite battle royale", "valorant montage", "cod warzone", "call of duty",
      "clash of clans", "brawl stars", "apex legends", "funny gaming moments", "rage quit",
      "kill montage", "1v1 clutch", "speedrun", "esports stream"
    ]
  },

  // 7. Sports Highlights, Matches & Knockouts
  {
    category: "Sports Highlights",
    icon: "🏏",
    reason: "Sports highlight, cricket match, football goal ya fight replay",
    keywords: [
      "match highlights", "cricket match", "psl highlights", "ipl highlights", "t20 world cup",
      "odi match", "test match", "wickets", "sixes", "super over", "babar azam batting",
      "virat kohli batting", "football match", "fifa", "premier league", "champions league",
      "el clasico", "ronaldo goals", "messi skills", "penalty shootout",
      "ufc fight", "knockout", "wwe raw", "smackdown", "wrestlemania", "boxing highlights",
      "nba highlights", "slam dunk", "f1 race", "formula 1 race replay"
    ]
  },

  // 8. Political Talk Shows, News Headlines & Sensationalism
  {
    category: "News, Politics & Sensationalism",
    icon: "📰",
    reason: "Political debate, breaking news bulletin ya sensational talk show",
    keywords: [
      "breaking news", "news bulletin", "headline", "talk show", "political debate",
      "press conference", "national assembly", "supreme court live", "court hearing",
      "geo news", "ary news", "express news", "samaa tv", "dunyanews", "bol news",
      "imran khan speech", "nawaz sharif speech", "shahbaz sharif", "pti jalsa",
      "pmln jalsa", "scandal", "controversy", "viral video leak", "exposed"
    ]
  },

  // 9. Short-Form Social Loops & Low-Effort Reposts
  {
    category: "Social Media Shorts & Status Loops",
    icon: "📱",
    reason: "Social media short clip, reels compilation ya whatsapp status",
    keywords: [
      "whatsapp status", "fullscreen status", "sad status", "attitude status", "romantic status",
      "tiktok trend", "viral reel", "reels compilation", "shorts compilation", "douyin"
    ]
  }
];

const GLOBAL_SKILLS_TAXONOMY = [
  // ─────────────────────────────────────────────────────────────────────────
  // TRACK 1: SOFTWARE ENGINEERING, WEB & MOBILE DEVELOPMENT
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "software_web_dev",
    name: "Full-Stack Web & Software Engineering",
    categoryGroup: "Technology & Software",
    earningPotential: "$1,200 - $4,500 / Month",
    keywords: [
      "web development", "full stack", "frontend", "backend", "software engineering", "programming", "coding",
      "html", "html5", "css", "css3", "javascript", "typescript", "es6",
      "react", "react.js", "next.js", "nextjs", "vue", "vue.js", "nuxt", "angular", "svelte",
      "node", "node.js", "express", "express.js", "nest.js", "nestjs", "django", "flask", "fastapi",
      "python", "ruby", "rails", "php", "laravel", "codeigniter", "wordpress development",
      "c#", ".net", "asp.net", "java", "spring boot", "c++", "golang", "go programming", "rust",
      "rest api", "graphql", "websockets", "microservices", "mvc architecture",
      "sql", "mysql", "postgresql", "sqlite", "mongodb", "redis", "firebase", "supabase", "prisma",
      "git", "github", "gitlab", "docker", "kubernetes", "ci/cd", "aws", "azure", "cloud computing"
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TRACK 2: MOBILE APP DEVELOPMENT (IOS / ANDROID / FLUTTER)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "mobile_app_dev",
    name: "Mobile App Engineering (iOS & Android)",
    categoryGroup: "Technology & Software",
    earningPotential: "$1,500 - $5,000 / Month",
    keywords: [
      "mobile app", "app development", "ios development", "android development",
      "flutter", "dart", "react native", "swift", "swiftui", "kotlin", "jetpack compose",
      "xcode", "android studio", "mobile ui", "app store deployment", "play store publishing"
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TRACK 3: ARTIFICIAL INTELLIGENCE, DATA SCIENCE & MACHINE LEARNING
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ai_data_science",
    name: "AI Engineering, Data Science & Machine Learning",
    categoryGroup: "Technology & Software",
    earningPotential: "$1,800 - $6,000 / Month",
    keywords: [
      "artificial intelligence", "machine learning", "deep learning", "data science",
      "python for data science", "pandas", "numpy", "matplotlib", "seaborn", "scikit-learn",
      "tensorflow", "pytorch", "keras", "neural networks", "computer vision", "opencv",
      "nlp", "natural language processing", "llm", "large language models", "prompt engineering",
      "langchain", "llamaindex", "huggingface", "generative ai", "chatgpt api", "gemini api",
      "data analysis", "data analytics", "power bi", "tableau", "excel for data", "sql for data",
      "data engineering", "big data", "spark", "hadoop", "etl pipeline"
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TRACK 4: CYBERSECURITY, ETHICAL HACKING & NETWORKING
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "cybersecurity",
    name: "Cybersecurity, Ethical Hacking & Cloud Security",
    categoryGroup: "Technology & Software",
    earningPotential: "$1,500 - $5,500 / Month",
    keywords: [
      "cybersecurity", "ethical hacking", "penetration testing", "pen testing", "ceh",
      "network security", "information security", "infosec", "kali linux", "wireshark",
      "metasploit", "nmap", "burp suite", "vulnerability assessment", "bug bounty",
      "ccna", "networking", "tcp/ip", "firewalls", "cryptography", "cloud security"
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TRACK 5: GRAPHIC DESIGN, BRAND IDENTITY & ILLUSTRATION
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "graphic_design",
    name: "Graphic Design, Brand Identity & Visual Arts",
    categoryGroup: "Design & Creative Media",
    earningPotential: "$800 - $3,000 / Month",
    keywords: [
      "graphic design", "brand identity", "branding", "logo design", "visual design",
      "adobe photoshop", "photoshop", "adobe illustrator", "illustrator", "vector art",
      "canva", "canva mastery", "coreldraw", "procreate", "digital illustration",
      "typography", "color theory", "poster design", "social media post design",
      "thumbnail design", "youtube thumbnail", "flyer design", "brochure design",
      "packaging design", "label design", "print design", "vector tracing", "infographic"
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TRACK 6: UI/UX DESIGN, PRODUCT DESIGN & FIGMA
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ui_ux_design",
    name: "UI/UX Product Design & Design Systems",
    categoryGroup: "Design & Creative Media",
    earningPotential: "$1,200 - $4,200 / Month",
    keywords: [
      "ui design", "ux design", "ui/ux", "product design", "figma", "figma masterclass",
      "user interface", "user experience", "wireframing", "prototyping", "interactive prototype",
      "design systems", "auto layout", "components and variants", "mobile app design",
      "website redesign", "user research", "usability testing", "persona mapping",
      "information architecture", "micro-interactions", "webflow", "framer"
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TRACK 7: VIDEO EDITING, MOTION GRAPHICS & 3D ANIMATION
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "video_editing_animation",
    name: "Video Editing, Motion Graphics & 3D Visuals",
    categoryGroup: "Design & Creative Media",
    earningPotential: "$1,000 - $4,000 / Month",
    keywords: [
      "video editing", "video editor", "premiere pro", "adobe premiere", "after effects",
      "motion graphics", "davinci resolve", "color grading", "capcut", "capcut pc",
      "final cut pro", "sound design for video", "audio mixing", "visual effects", "vfx",
      "cinematography", "video production", "b-roll editing", "documentary editing",
      "reels editing", "tiktok video editing", "short-form editing", "hormozi style captions",
      "blender", "blender 3d", "3d modeling", "3d animation", "unreal engine", "cinema 4d",
      "maya", "rendering", "character animation", "texturing"
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TRACK 8: GLOBAL LANGUAGES, FLUENCY & EXAM PREPARATION
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "language_communication",
    name: "Global Languages, Fluency & Communication",
    categoryGroup: "Languages & Soft Skills",
    earningPotential: "Fluency & Global Career Mobility",
    keywords: [
      "language learning", "learn english", "spoken english", "english fluency", "english speaking",
      "ielts", "ielts preparation", "ielts speaking", "ielts writing", "toefl", "pte exam",
      "english grammar", "vocabulary building", "pronunciation", "accent training", "american accent", "british accent",
      "learn german", "german a1", "german a2", "german b1", "german language",
      "learn arabic", "spoken arabic", "quranic arabic", "arabic grammar", "fusha",
      "learn french", "french language", "delf", "learn spanish", "spanish language", "dele",
      "learn chinese", "mandarin", "hsk", "learn japanese", "jlpt", "learn korean", "topik",
      "learn italian", "learn russian", "learn turkish", "learn urdu", "urdu grammar",
      "public speaking", "communication skills", "presentation skills", "speech giving",
      "body language", "business communication", "workplace communication", "voice modulation"
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TRACK 9: DIGITAL MARKETING, SEO, COPYWRITING & SALES
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "marketing_sales",
    name: "Digital Marketing, SEO, Copywriting & E-Commerce",
    categoryGroup: "Business, Marketing & Sales",
    earningPotential: "$1,000 - $4,500 / Month",
    keywords: [
      "digital marketing", "social media marketing", "smm", "facebook ads", "meta ads",
      "google ads", "google adwords", "ppc", "pay per click", "tiktok ads", "instagram marketing",
      "seo", "search engine optimization", "on-page seo", "off-page seo", "technical seo",
      "keyword research", "link building", "backlinks", "ahrefs", "semrush",
      "copywriting", "direct response copywriting", "sales copy", "email marketing",
      "klaviyo", "mailchimp", "landing page copywriting", "content writing", "blog writing",
      "sales", "closing deals", "cold calling", "cold emailing", "b2b sales", "negotiation",
      "lead generation", "inbound marketing", "affiliate marketing", "growth hacking"
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TRACK 10: E-COMMERCE, DROPSHIPPING & FREELANCE PLATFORMS
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ecommerce_freelancing",
    name: "E-Commerce, Amazon, Shopify & Freelancing Mastery",
    categoryGroup: "Business, Marketing & Sales",
    earningPotential: "$1,000 - $5,000 / Month",
    keywords: [
      "freelancing", "freelancing guide", "upwork mastery", "upwork proposal writing",
      "fiverr gig creation", "fiverr ranking", "freelancer.com", "toptal", "client management",
      "e-commerce", "ecommerce", "shopify", "shopify store design", "shopify dropshipping",
      "amazon fba", "amazon pl", "amazon private label", "amazon wholesale", "amazon va",
      "virtual assistant", "daraz seller", "product hunting", "product sourcing", "inventory management"
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TRACK 11: FINANCE, ACCOUNTING & INVESTING
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "finance_accounting",
    name: "Accounting, Financial Modeling & Business Analysis",
    categoryGroup: "Business, Marketing & Sales",
    earningPotential: "$1,000 - $3,500 / Month",
    keywords: [
      "accounting", "bookkeeping", "quickbooks", "xero", "financial accounting",
      "managerial accounting", "financial analysis", "financial modeling", "corporate finance",
      "excel for finance", "advanced excel", "financial statements", "tax preparation",
      "personal finance", "budgeting", "investing", "stock market basics", "fundamental analysis"
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TRACK 12: ACADEMICS & K-12 / COLLEGE STEM (PHYSICS, MATH, CHEMISTRY)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "academics_stem",
    name: "Academics & Science (Matric, FSc, O/A Levels, University)",
    categoryGroup: "Academics, Science & STEM",
    earningPotential: "Target: Grade A+ / Distinction",
    keywords: [
      "physics", "class 9 physics", "class 10 physics", "fsc physics", "a level physics", "o level physics",
      "chemistry", "organic chemistry", "inorganic chemistry", "physical chemistry",
      "biology", "botany", "zoology", "anatomy", "physiology", "genetics",
      "mathematics", "math", "algebra", "linear algebra", "geometry", "trigonometry",
      "calculus", "differential equations", "statistics", "probability",
      "matric", "inter", "fsc pre medical", "fsc pre engineering", "mdcat preparation", "ecat preparation",
      "sat preparation", "gre preparation", "gmat", "khan academy course", "ap physics", "ap calculus"
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TRACK 13: VOCATIONAL, MUSIC INSTRUMENTS, PHOTOGRAPHY & HEALTH
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "creative_vocational_lifestyle",
    name: "Photography, Music Instruments & Practical Life Skills",
    categoryGroup: "Practical, Creative & Life Skills",
    earningPotential: "Professional Creative Mastery",
    keywords: [
      "photography", "dslr photography", "portrait photography", "lighting for photography",
      "learn guitar", "acoustic guitar", "electric guitar", "learn piano", "keyboard lessons",
      "music theory", "learn violin", "flute lessons", "drums lessons", "vocal training",
      "fitness training", "calisthenics", "weightlifting form", "workout routine", "nutrition science",
      "baking course", "pastry chef course", "culinary arts", "carpentry", "woodworking",
      "drawing", "sketching", "oil painting", "watercolor painting"
    ]
  }
];

module.exports = {
  GLOBAL_ENTERTAINMENT_BLACKLIST,
  GLOBAL_SKILLS_TAXONOMY
};
