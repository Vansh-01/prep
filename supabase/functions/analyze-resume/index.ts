import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeUrl, jobProfile, experienceLevel } = await req.json();
    
    console.log("Analyzing resume:", { resumeUrl, jobProfile, experienceLevel });

    if (!resumeUrl) {
      return new Response(
        JSON.stringify({ error: "No resume URL provided" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format job profile for prompt
    const formattedJobProfile = jobProfile?.startsWith('other:') 
      ? jobProfile.replace('other:', '') 
      : jobProfile?.replace(/_/g, ' ') || 'general';

    const experienceLevelText = experienceLevel === 'fresher' 
      ? 'entry-level/fresher' 
      : 'experienced professional';

    const systemPrompt = `You are an expert career coach and resume reviewer with 15+ years of experience in HR and recruitment. Your task is to analyze resumes and provide constructive, actionable feedback.

When analyzing a resume, evaluate:
1. **Overall Structure & Format** - Is it well-organized, easy to read, and professionally formatted?
2. **Content Quality** - Are achievements quantified? Are descriptions clear and impactful?
3. **Keywords & ATS Optimization** - Does it contain relevant industry keywords?
4. **Skills Alignment** - How well do the skills match the target role?
5. **Experience Relevance** - Is the experience relevant and well-presented?
6. **Improvements Needed** - What specific changes would strengthen the resume?

Provide your analysis in a structured format with clear sections and actionable recommendations.`;

    const userPrompt = `Please analyze this resume for a ${experienceLevelText} candidate targeting a ${formattedJobProfile} position.

Resume URL: ${resumeUrl}

Since I cannot directly view the document, please provide:
1. A general framework for what makes a strong ${formattedJobProfile} resume for ${experienceLevelText} candidates
2. Key skills and keywords to include
3. Common mistakes to avoid
4. Recommended structure and sections
5. Tips for standing out to recruiters in this field

Please provide comprehensive, actionable advice tailored to this specific role and experience level.`;

    console.log("Calling Lovable AI gateway...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to analyze resume" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content;

    console.log("Resume analysis completed successfully");

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error analyzing resume:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
