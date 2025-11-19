import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Editor from "@monaco-editor/react";
import { Play, Home, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const challengeTemplates: Record<string, string> = {
  javascript: `function twoSum(nums, target) {
  // Write your solution here
  
}`,
  python: `def two_sum(nums, target):
    # Write your solution here
    pass`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
    }
}`,
  cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        
    }
};`,
  c: `#include <stdlib.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    // Write your solution here
    
}`,
  typescript: `function twoSum(nums: number[], target: number): number[] {
  // Write your solution here
  
}`,
};

const CodingChallenge = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(challengeTemplates.javascript);
  const [testResults, setTestResults] = useState<string[]>([]);

  const challenge = {
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]"
      }
    ],
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] },
      { input: [[3, 3], 6], expected: [0, 1] }
    ]
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(challengeTemplates[newLanguage]);
    setTestResults([]);
  };

  const handleRunTests = () => {
    if (language !== "javascript" && language !== "typescript") {
      setTestResults([`Note: Automated testing is only supported for JavaScript and TypeScript.
For ${language.toUpperCase()}, please test your solution manually or use an external compiler/interpreter.`]);
      toast({
        title: "Information",
        description: `${language.toUpperCase()} testing requires external tools`,
      });
      return;
    }

    try {
      const results: string[] = [];
      
      // Execute code and get the function
      if (language === "typescript") {
        eval(code.replace(/: \w+(\[\])?/g, "").replace(/public |private |protected /g, ""));
      } else {
        eval(code);
      }
      const fn = eval("twoSum");

      challenge.testCases.forEach((test, index) => {
        const result = fn(...test.input);
        const passed = JSON.stringify(result) === JSON.stringify(test.expected);
        results.push(
          passed
            ? `✓ Test ${index + 1}: Passed`
            : `✗ Test ${index + 1}: Failed (Expected: ${JSON.stringify(test.expected)}, Got: ${JSON.stringify(result)})`
        );
      });

      setTestResults(results);
      
      const allPassed = results.every(r => r.startsWith("✓"));
      toast({
        title: allPassed ? "All Tests Passed!" : "Some Tests Failed",
        description: allPassed ? "Great job! Challenge completed." : "Keep trying, you're getting there!",
        variant: allPassed ? "default" : "destructive",
      });
    } catch (error) {
      setTestResults([`Error: ${error instanceof Error ? error.message : "Unknown error"}`]);
      toast({
        title: "Error",
        description: "Failed to execute tests",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{challenge.title}</h1>
            <span className="inline-block px-3 py-1 mt-2 text-sm rounded-full bg-primary/10 text-primary">
              {challenge.difficulty}
            </span>
          </div>
          <Button variant="outline" onClick={() => navigate("/interview-mode")}>
            <Home className="w-4 h-4 mr-2" />
            Back to Modes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <Tabs defaultValue="description">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <p className="text-muted-foreground">{challenge.description}</p>
              </TabsContent>
              <TabsContent value="examples" className="mt-4">
                {challenge.examples.map((example, index) => (
                  <div key={index} className="mb-4">
                    <p className="font-semibold">Example {index + 1}:</p>
                    <div className="bg-muted p-3 rounded-lg mt-2 font-mono text-sm">
                      <p>Input: {example.input}</p>
                      <p>Output: {example.output}</p>
                      <p className="text-muted-foreground mt-2">{example.explanation}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Solution</h2>
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
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={handleRunTests}>
                    <Play className="w-4 h-4 mr-2" />
                    Run Tests
                  </Button>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <Editor
                  height="300px"
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

            {testResults.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Test Results
                </h2>
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg font-mono text-sm ${
                        result.startsWith("✓")
                          ? "bg-green-500/10 text-green-700 dark:text-green-400"
                          : "bg-red-500/10 text-red-700 dark:text-red-400"
                      }`}
                    >
                      {result}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingChallenge;
