-- Create profiles table for volunteers
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  volunteer_hours INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create reports table for child protection cases
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type TEXT NOT NULL CHECK (report_type IN ('homeless_child', 'out_of_school', 'abuse', 'appointment')),
  child_name TEXT,
  child_age INTEGER NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Reports policies - anyone can submit reports
CREATE POLICY "Anyone can submit reports"
  ON public.reports FOR INSERT
  WITH CHECK (true);

-- Create waiting_list table for children needing services
CREATE TABLE public.waiting_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_name TEXT NOT NULL,
  child_age INTEGER NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('shelter', 'education', 'rehabilitation', 'all')),
  guardian_name TEXT,
  guardian_phone TEXT,
  guardian_email TEXT,
  location TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'contacted', 'enrolled', 'declined')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on waiting_list
ALTER TABLE public.waiting_list ENABLE ROW LEVEL SECURITY;

-- Waiting list policies - anyone can add to waiting list
CREATE POLICY "Anyone can add to waiting list"
  ON public.waiting_list FOR INSERT
  WITH CHECK (true);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('caps_curriculum', 'online', 'vocational', 'life_skills')),
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration_weeks INTEGER,
  capacity INTEGER,
  enrolled_count INTEGER DEFAULT 0,
  start_date DATE,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Courses policies - public can view
CREATE POLICY "Anyone can view courses"
  ON public.courses FOR SELECT
  USING (true);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for all tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_waiting_list_updated_at
  BEFORE UPDATE ON public.waiting_list
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample courses
INSERT INTO public.courses (title, description, category, level, duration_weeks, capacity, start_date, status) VALUES
('Basic Computer Skills', 'Introduction to computers, internet, and basic software applications', 'vocational', 'beginner', 8, 20, '2025-11-01', 'open'),
('CAPS Mathematics Grade 10', 'Comprehensive mathematics curriculum aligned with CAPS standards', 'caps_curriculum', 'intermediate', 40, 30, '2025-10-15', 'open'),
('Professional Communication', 'Develop effective communication skills for the workplace', 'life_skills', 'beginner', 6, 25, '2025-11-10', 'open'),
('Web Development Fundamentals', 'Learn HTML, CSS, and JavaScript basics through Coursera partnership', 'online', 'beginner', 12, 15, '2025-11-20', 'open');
