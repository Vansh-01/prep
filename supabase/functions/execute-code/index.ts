import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, language, stdin } = await req.json();

    // Map language names to Piston API language identifiers and versions
    const languageConfig: Record<string, { language: string; version: string }> = {
      javascript: { language: 'javascript', version: '18.15.0' },
      typescript: { language: 'typescript', version: '5.0.3' },
      python: { language: 'python', version: '3.10.0' },
      java: { language: 'java', version: '15.0.2' },
      cpp: { language: 'c++', version: '10.2.0' },
      c: { language: 'c', version: '10.2.0' },
      go: { language: 'go', version: '1.16.2' },
      rust: { language: 'rust', version: '1.68.2' },
    };

    const config = languageConfig[language] || { language, version: '*' };

    // Try multiple Piston API endpoints
    const endpoints = [
      'https://emkc.org/api/v2/piston/execute',
      'https://piston-api.vercel.app/api/v2/execute',
    ];

    let lastError: string = '';
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language: config.language,
            version: config.version,
            files: [
              {
                content: code,
              },
            ],
            stdin: stdin || '',
          }),
        });

        if (response.ok) {
          const result = await response.json();
          return new Response(
            JSON.stringify({
              stdout: result.run?.stdout || '',
              stderr: result.run?.stderr || '',
              output: result.run?.output || '',
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
        
        lastError = `${endpoint}: ${response.status}`;
      } catch (e) {
        lastError = `${endpoint}: ${e instanceof Error ? e.message : 'Unknown error'}`;
      }
    }

    // If all Piston endpoints fail, fall back to JS/TS execution in Deno
    if (language === 'javascript' || language === 'typescript') {
      try {
        const logs: string[] = [];
        const errors: string[] = [];
        
        // Create a simple sandbox using eval for JS
        const sandbox = `
          const __logs = [];
          const __errors = [];
          const console = {
            log: (...args) => __logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
            error: (...args) => __errors.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
            warn: (...args) => __logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
            info: (...args) => __logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
          };
          try {
            ${code}
          } catch(e) {
            __errors.push(e.toString());
          }
          ({ stdout: __logs.join('\\n'), stderr: __errors.join('\\n') });
        `;
        
        const result = eval(sandbox);
        
        return new Response(
          JSON.stringify({
            stdout: result.stdout || '',
            stderr: result.stderr || '',
            output: result.stdout || '',
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } catch (evalError) {
        return new Response(
          JSON.stringify({
            stdout: '',
            stderr: evalError instanceof Error ? evalError.message : 'Execution error',
            output: '',
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    throw new Error(`Code execution service unavailable. Last error: ${lastError}`);
  } catch (error) {
    console.error('Error executing code:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        stderr: error instanceof Error ? error.message : 'Unknown error',
        stdout: '',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
