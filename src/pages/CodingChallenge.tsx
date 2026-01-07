import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Editor from "@monaco-editor/react";
import { Play, Home, CheckCircle, Trash2, Terminal, Clock, Pause, RotateCcw, ChevronLeft, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { highlightConsoleOutput } from "@/utils/consoleSyntaxHighlight";
import { supabase } from "@/integrations/supabase/client";
import { codingChallenges, getDifficultyColor, type CodingChallenge as ChallengeType, type Difficulty } from "@/data/codingChallenges";

const TIMER_OPTIONS = [
  { label: "15 min", value: 15 * 60 },
  { label: "30 min", value: 30 * 60 },
  { label: "45 min", value: 45 * 60 },
  { label: "60 min", value: 60 * 60 },
];

const CodingChallenge = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Challenge selection state
  const [showChallengeList, setShowChallengeList] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeType>(codingChallenges[0]);
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "All">("All");
  
  // Code editor state
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(codingChallenges[0].templates.javascript);
  const [userInput, setUserInput] = useState("");
  const [testResults, setTestResults] = useState<string[]>([]);
  const [standardOutput, setStandardOutput] = useState<string[]>([]);
  const [errorOutput, setErrorOutput] = useState<string[]>([]);
  
  // Timer state
  const [timerDuration, setTimerDuration] = useState(30 * 60);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            toast({
              title: "Time's up!",
              description: "Your interview time has ended.",
              variant: "destructive",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeRemaining, toast]);

  const handleStartTimer = () => {
    setTimerStarted(true);
    setIsTimerRunning(true);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResumeTimer = () => {
    if (timeRemaining > 0) {
      setIsTimerRunning(true);
    }
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerStarted(false);
    setTimeRemaining(timerDuration);
  };

  const handleTimerDurationChange = (value: string) => {
    const newDuration = parseInt(value);
    setTimerDuration(newDuration);
    if (!timerStarted) {
      setTimeRemaining(newDuration);
    }
  };

  const getTimerColor = () => {
    const percentage = (timeRemaining / timerDuration) * 100;
    if (percentage <= 10) return "text-destructive";
    if (percentage <= 25) return "text-orange-500";
    return "text-primary";
  };

  const handleSelectChallenge = (challenge: ChallengeType) => {
    setSelectedChallenge(challenge);
    setCode(challenge.templates[language] || challenge.templates.javascript);
    setShowChallengeList(false);
    setUserInput("");
    setTestResults([]);
    setStandardOutput([]);
    setErrorOutput([]);
    handleResetTimer();
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(selectedChallenge.templates[newLanguage] || selectedChallenge.templates.javascript);
    setUserInput("");
    setTestResults([]);
    setStandardOutput([]);
    setErrorOutput([]);
  };

  const handleRunTests = async () => {
    setTestResults(["Running tests..."]);
    setStandardOutput([]);
    setErrorOutput([]);

    try {
      const { data, error } = await supabase.functions.invoke('execute-code', {
        body: { code, language, stdin: userInput }
      });

      if (error) throw error;

      const stdout = data.stdout ? data.stdout.trim().split('\n').filter((line: string) => line) : [];
      const stderr = data.stderr ? data.stderr.trim().split('\n').filter((line: string) => line) : [];

      setStandardOutput(stdout.length > 0 ? stdout : ["Code executed successfully!"]);
      setErrorOutput(stderr);
      setTestResults(["✓ Code executed - Check console output for results"]);
      
      toast({
        title: "Success",
        description: "Code executed successfully",
      });
    } catch (error) {
      setTestResults([]);
      setStandardOutput([]);
      setErrorOutput([`Error: ${error instanceof Error ? error.message : "Unknown error"}`]);
      toast({
        title: "Error",
        description: "Failed to execute code",
        variant: "destructive",
      });
    }
  };

  const filteredChallenges = difficultyFilter === "All" 
    ? codingChallenges 
    : codingChallenges.filter(c => c.difficulty === difficultyFilter);

  // Challenge Selection View
  if (showChallengeList) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Coding Challenges</h1>
              <p className="text-muted-foreground mt-1">Select a challenge to practice your coding skills</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/interview-mode")}>
              <Home className="w-4 h-4 mr-2" />
              Back to Modes
            </Button>
          </div>

          {/* Difficulty Filter */}
          <div className="flex gap-2 mb-6">
            {(["All", "Easy", "Medium", "Hard"] as const).map((difficulty) => (
              <Button
                key={difficulty}
                variant={difficultyFilter === difficulty ? "default" : "outline"}
                size="sm"
                onClick={() => setDifficultyFilter(difficulty)}
              >
                {difficulty}
              </Button>
            ))}
          </div>

          {/* Challenge Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChallenges.map((challenge) => (
              <Card
                key={challenge.id}
                className="p-6 cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleSelectChallenge(challenge)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg">{challenge.title}</h3>
                  <Badge className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {challenge.description}
                </p>
                <div className="mt-4 flex items-center text-xs text-muted-foreground">
                  <span>{Object.keys(challenge.templates).length} languages supported</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Challenge Solving View
  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setShowChallengeList(true)}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              <List className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{selectedChallenge.title}</h1>
              <Badge className={`mt-2 ${getDifficultyColor(selectedChallenge.difficulty)}`}>
                {selectedChallenge.difficulty}
              </Badge>
            </div>
          </div>
          
          {/* Timer Section */}
          <div className="flex items-center gap-4">
            <Card className="flex items-center gap-3 px-4 py-2">
              <Clock className={`w-5 h-5 ${getTimerColor()}`} />
              <span className={`text-2xl font-mono font-bold ${getTimerColor()}`}>
                {formatTime(timeRemaining)}
              </span>
              
              <div className="flex items-center gap-2 ml-2 border-l pl-3">
                {!timerStarted ? (
                  <>
                    <Select value={timerDuration.toString()} onValueChange={handleTimerDurationChange}>
                      <SelectTrigger className="w-[90px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMER_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="default" onClick={handleStartTimer}>
                      <Play className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    {isTimerRunning ? (
                      <Button size="sm" variant="outline" onClick={handlePauseTimer}>
                        <Pause className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="default" onClick={handleResumeTimer} disabled={timeRemaining === 0}>
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={handleResetTimer}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </Card>
            
            <Button variant="outline" onClick={() => navigate("/interview-mode")}>
              <Home className="w-4 h-4 mr-2" />
              Back to Modes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <Tabs defaultValue="description">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <p className="text-muted-foreground">{selectedChallenge.description}</p>
              </TabsContent>
              <TabsContent value="examples" className="mt-4">
                {selectedChallenge.examples.map((example, index) => (
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
                  language={language === "cpp" ? "cpp" : language}
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

            {(testResults.length > 0 || standardOutput.length > 0 || errorOutput.length > 0) && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Test Results
                </h2>
                <div className="space-y-2 mb-6">
                  {testResults.length === 0 ? (
                    <p className="text-muted-foreground">Run tests to see results...</p>
                  ) : (
                    testResults.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg font-mono text-sm ${
                          result.startsWith("✓")
                            ? "bg-green-500/10 text-green-700 dark:text-green-400"
                            : result.startsWith("✗")
                            ? "bg-red-500/10 text-red-700 dark:text-red-400"
                            : "bg-muted"
                        }`}
                      >
                        {result}
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Console</h3>
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
                    {/* User Input */}
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-muted-foreground flex items-center gap-2">
                        <Terminal className="w-4 h-4" />
                        Input (stdin)
                      </h4>
                      <Textarea
                        placeholder="Enter input for your program here (each line is a separate input)..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="font-mono text-sm min-h-[80px] bg-muted"
                      />
                    </div>

                    {/* Standard Output */}
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-muted-foreground">Standard Output</h4>
                      <div className="bg-muted rounded-lg p-4 min-h-[100px] max-h-[150px] font-mono text-sm overflow-auto">
                        {standardOutput.length === 0 ? (
                          <div className="text-muted-foreground">No output</div>
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
                      <h4 className="text-sm font-medium mb-2 text-destructive">Errors & Warnings</h4>
                      <div className="bg-muted rounded-lg p-4 min-h-[80px] max-h-[120px] font-mono text-sm overflow-auto">
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
