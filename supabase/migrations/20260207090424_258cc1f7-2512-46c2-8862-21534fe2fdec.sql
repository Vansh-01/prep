
-- Create company_profiles table
CREATE TABLE public.company_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own company profile"
ON public.company_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own company profile"
ON public.company_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own company profile"
ON public.company_profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_company_profiles_updated_at
BEFORE UPDATE ON public.company_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
