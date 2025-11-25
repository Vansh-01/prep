import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, Home, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { highlightConsoleOutput } from "@/utils/consoleSyntaxHighlight";

const languageTemplates: Record<string, string> = {
  javascript: `// Write your code here
function solution() {
  // Your solution
  return "Hello, World!";
}

// Test your code
console.log(solution());`,
  python: `# Write your code here
def solution():
    # Your solution
    return "Hello, World!"

# Test your code
print(solution())`,
  java: `public class Solution {
    public static void main(String[] args) {
        // Write your code here
        System.out.println(solution());
    }
    
    public static String solution() {
        // Your solution
        return "Hello, World!";
    }
}`,
  cpp: `#include <iostream>
#include <string>
using namespace std;

string solution() {
    // Your solution
    return "Hello, World!";
}

int main() {
    // Test your code
    cout << solution() << endl;
    return 0;
}`,
  c: `#include <stdio.h>
#include <string.h>

char* solution() {
    // Your solution
    return "Hello, World!";
}

int main() {
    // Test your code
    printf("%s\\n", solution());
    return 0;
}`,
  typescript: `// Write your code here
function solution(): string {
  // Your solution
  return "Hello, World!";
}

// Test your code
console.log(solution());`,
  go: `package main

import "fmt"

func solution() string {
    // Your solution
    return "Hello, World!"
}

func main() {
    // Test your code
    fmt.Println(solution())
}`,
  rust: `fn solution() -> String {
    // Your solution
    String::from("Hello, World!")
}

fn main() {
    // Test your code
    println!("{}", solution());
}`,
};

const CodingPractice = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(languageTemplates.javascript);
  const [standardOutput, setStandardOutput] = useState<string[]>([]);
  const [errorOutput, setErrorOutput] = useState<string[]>([]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(languageTemplates[newLanguage]);
    setStandardOutput([]);
    setErrorOutput([]);
  };

  const handleRunCode = () => {
    if (language !== "javascript" && language !== "typescript") {
      setStandardOutput([]);
      setErrorOutput([
        `Note: Direct execution is only supported for JavaScript and TypeScript.`,
        `For ${language.toUpperCase()}, this editor provides syntax highlighting and code writing practice.`,
        `To run ${language.toUpperCase()} code, you would need to use a compiler/interpreter on your local machine or an online judge platform.`
      ]);
      toast({
        title: "Information",
        description: `${language.toUpperCase()} execution requires external tools`,
      });
      return;
    }

    try {
      // Capture console.log output
      const logs: string[] = [];
      const errors: string[] = [];
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      
      console.log = (...args) => {
        logs.push(args.join(" "));
      };
      console.error = (...args) => {
        errors.push(args.join(" "));
      };
      console.warn = (...args) => {
        errors.push(`Warning: ${args.join(" ")}`);
      };

      // Execute the code
      if (language === "typescript") {
        // For TypeScript, we'll just eval it as JavaScript (simplified)
        eval(code.replace(/: \w+/g, "").replace(/public |private |protected /g, ""));
      } else {
        eval(code);
      }

      // Restore console methods
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;

      setStandardOutput(logs.length > 0 ? logs : ["Code executed successfully!"]);
      setErrorOutput(errors);
      
      toast({
        title: "Success",
        description: "Code executed successfully",
      });
    } catch (error) {
      setStandardOutput([]);
      setErrorOutput([`Error: ${error instanceof Error ? error.message : "Unknown error"}`]);
      toast({
        title: "Error",
        description: "Failed to execute code",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setCode(languageTemplates[language]);
    setStandardOutput([]);
    setErrorOutput([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Coding Practice</h1>
          <Button variant="outline" onClick={() => navigate("/interview-mode")}>
            <Home className="w-4 h-4 mr-2" />
            Back to Modes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Code Editor</h2>
              <div className="flex gap-2">
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                    <SelectItem value="c">C</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                    <SelectItem value="rust">Rust</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button size="sm" onClick={handleRunCode}>
                  <Play className="w-4 h-4 mr-2" />
                  Run Code
                </Button>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Editor
                height="500px"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Console Output</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setStandardOutput([]);
                  setErrorOutput([]);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Console
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {/* Standard Output */}
              <div>
                <h3 className="text-sm font-medium mb-2 text-muted-foreground">Standard Output</h3>
                <div className="bg-muted rounded-lg p-4 min-h-[230px] font-mono text-sm overflow-auto">
                  {standardOutput.length === 0 ? (
                    <div className="text-muted-foreground">Run your code to see the output here...</div>
                  ) : (
                          standardOutput.map((line, index) => (
                            <div key={index} className="flex gap-4 hover:bg-accent/50">
                              <span className="text-muted-foreground select-none min-w-[2rem] text-right">{index + 1}</span>
                              <span className="flex-1">{highlightConsoleOutput(line)}</span>
                            </div>
                          ))
                  )}
                </div>
              </div>

              {/* Error Output */}
              <div>
                <h3 className="text-sm font-medium mb-2 text-destructive">Errors & Warnings</h3>
                <div className="bg-muted rounded-lg p-4 min-h-[230px] font-mono text-sm overflow-auto">
                  {errorOutput.length === 0 ? (
                    <div className="text-muted-foreground">No errors</div>
                  ) : (
                          errorOutput.map((line, index) => (
                            <div key={index} className="flex gap-4 hover:bg-accent/50">
                              <span className="text-muted-foreground select-none min-w-[2rem] text-right">{index + 1}</span>
                              <span className="flex-1 text-destructive">{highlightConsoleOutput(line)}</span>
                            </div>
                          ))
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CodingPractice;
