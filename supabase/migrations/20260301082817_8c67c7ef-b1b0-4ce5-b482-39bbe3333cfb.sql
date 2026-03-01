-- Allow any authenticated user to view active job postings
CREATE POLICY "Anyone can view active job postings"
ON public.job_postings
FOR SELECT
USING (status = 'active');
