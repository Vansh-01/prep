-- Allow anyone authenticated to see company names (needed for job board join)
CREATE POLICY "Anyone can view company names"
ON public.company_profiles
FOR SELECT
USING (true);
