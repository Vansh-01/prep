-- Create table to track challenge completions
CREATE TABLE public.challenge_completions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    challenge_id text NOT NULL,
    language text NOT NULL,
    completion_time_seconds integer NOT NULL,
    points integer NOT NULL DEFAULT 0,
    code text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(user_id, challenge_id)
);

-- Enable RLS
ALTER TABLE public.challenge_completions ENABLE ROW LEVEL SECURITY;

-- Users can view all completions (for leaderboard)
CREATE POLICY "Anyone can view completions"
ON public.challenge_completions
FOR SELECT
USING (true);

-- Users can insert their own completions
CREATE POLICY "Users can insert their own completions"
ON public.challenge_completions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own completions (for better times)
CREATE POLICY "Users can update their own completions"
ON public.challenge_completions
FOR UPDATE
USING (auth.uid() = user_id);

-- Create index for leaderboard queries
CREATE INDEX idx_challenge_completions_points ON public.challenge_completions(points DESC);
CREATE INDEX idx_challenge_completions_user ON public.challenge_completions(user_id);