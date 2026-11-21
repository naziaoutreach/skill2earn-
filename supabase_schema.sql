-- Practix Production Database Schema for Supabase

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  "currentSkill" TEXT DEFAULT 'Graphic Design',
  streak INTEGER DEFAULT 0,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  "isPro" BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  "userEmail" TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Digital Skills',
  progress INTEGER DEFAULT 0,
  "totalDays" INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Submissions Table
CREATE TABLE IF NOT EXISTS public.submissions (
  id TEXT PRIMARY KEY,
  "userEmail" TEXT NOT NULL,
  "dayNumber" INTEGER NOT NULL,
  "proofUrl" TEXT,
  notes TEXT,
  feedback TEXT,
  grade TEXT DEFAULT 'A',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Roadmaps Table
CREATE TABLE IF NOT EXISTS public.roadmaps (
  id TEXT PRIMARY KEY,
  "userEmail" TEXT NOT NULL,
  "dayNumber" INTEGER NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'locked',
  "xpReward" INTEGER DEFAULT 50,
  "estimatedMinutes" INTEGER DEFAULT 45,
  "isPracticalMilestone" BOOLEAN DEFAULT FALSE,
  "milestoneName" TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on row level security or allow read/write for service role
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow public access to courses" ON public.courses FOR ALL USING (true);
CREATE POLICY "Allow public access to submissions" ON public.submissions FOR ALL USING (true);
CREATE POLICY "Allow public access to roadmaps" ON public.roadmaps FOR ALL USING (true);
