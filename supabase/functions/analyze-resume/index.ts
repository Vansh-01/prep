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

    const systemPrompt = `You are an expert career coach and resume reviewer with 15+ years of experience in HR and recruitment. Analyze resumes and provide scores with actionable feedback.`;

    const userPrompt = `Analyze this resume for a ${experienceLevelText} candidate targeting a ${formattedJobProfile} position.

Resume URL: ${resumeUrl}

Provide a comprehensive analysis with scores (0-100) for each category and detailed feedback.`;

    console.log("Calling Lovable AI gateway with tool calling...");

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
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_resume",
              description: "Provide resume analysis with scores and feedback",
              parameters: {
                type: "object",
                properties: {
                  overallScore: {
                    type: "number",
                    description: "Overall resume score from 0-100"
                  },
                  categories: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Category name" },
                        score: { type: "number", description: "Score from 0-100" },
                        feedback: { type: "string", description: "Brief feedback for this category" }
                      },
                      required: ["name", "score", "feedback"]
                    },
                    description: "Scoring breakdown by category: Formatting, Keywords & ATS, Experience, Skills Match, Impact & Achievements"
                  },
                  strengths: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of 3-5 key strengths"
                  },
                  improvements: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of 3-5 specific improvements needed"
                  },
                  summary: {
                    type: "string",
                    description: "Overall summary and recommendations (2-3 sentences)"
                  }
                },
                required: ["overallScore", "categories", "strengths", "improvements", "summary"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "analyze_resume" } }
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
    console.log("AI response:", JSON.stringify(data, null, 2));

    // Extract tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "analyze_resume") {
      console.error("No valid tool call in response");
      return new Response(
        JSON.stringify({ error: "Failed to get structured analysis" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const analysisData = JSON.parse(toolCall.function.arguments);
    console.log("Resume analysis completed successfully");

    return new Response(
      JSON.stringify({ analysis: analysisData }),
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
