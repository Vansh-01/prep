-- Add new columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS experience_level text CHECK (experience_level IN ('fresher', 'experienced')),
ADD COLUMN IF NOT EXISTS job_profile text,
ADD COLUMN IF NOT EXISTS resume_url text;