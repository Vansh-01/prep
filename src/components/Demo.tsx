import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AudioRecorder, blobToBase64 } from "@/utils/audioRecorder";
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  AlertCircle,
  Eye,
  Volume2,
  Brain
} from "lucide-react";

const mockQuestions = [
  {
    id: 1,
    type: "HR",
    question: "Tell me about yourself and why you're interested in this role?",
    expectedPoints: ["Background", "Skills", "Motivation", "Career Goals"],
  },
  {
    id: 2,
    type: "Technical",
    question: "Can you explain the difference between let, const, and var in JavaScript?",
    expectedPoints: ["Scope", "Hoisting", "Reassignment", "Best Practices"],
  },
  {
    id: 3,
    type: "Behavioral",
    question: "Describe a challenging project you worked on and how you overcame obstacles.",
    expectedPoints: ["Problem Definition", "Solution", "Teamwork", "Outcome"],
  },
];

export const Demo = () => {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [clarity, setClarity] = useState(0);
  const [relevance, setRelevance] = useState(0);
  const [faceDetected, setFaceDetected] = useState(true);
  const [eyeContact, setEyeContact] = useState(true);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
        
        // Simulate real-time feedback updates
        if (recordingTime > 2) {
          setConfidence(Math.min(85, confidence + Math.random() * 5));
          setClarity(Math.min(90, clarity + Math.random() * 4));
          setRelevance(Math.min(80, relevance + Math.random() * 6));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, recordingTime, confidence, clarity, relevance]);

  const handleStartRecording = async () => {
    try {
      audioRecorderRef.current = new AudioRecorder();
      await audioRecorderRef.current.start();
      setIsRecording(true);
      setShowFeedback(true);
      setRecordingTime(0);
      setConfidence(0);
      setClarity(0);
      setRelevance(0);
      setTranscript([]);
      
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording failed",
        description: "Please allow microphone access and try again",
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = async () => {
    if (!audioRecorderRef.current) return;
    
    try {
      setIsRecording(false);
      setIsTranscribing(true);
      
      const audioBlob = await audioRecorderRef.current.stop();
      const base64Audio = await blobToBase64(audioBlob);
      
      console.log('Sending audio for transcription...');
      
      // Send to transcription endpoint
      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: { audio: base64Audio }
      });
      
      if (error) {
        console.error('Transcription error:', error);
        throw error;
      }
      
      if (data?.text) {
        console.log('Transcription received:', data.text);
        setTranscript([data.text]);
        
        // Simulate feedback based on transcript length
        const wordCount = data.text.split(' ').length;
        setConfidence(Math.min(95, 60 + wordCount * 2));
        setClarity(Math.min(92, 70 + wordCount * 1.5));
        setRelevance(Math.min(88, 65 + wordCount * 1.8));
        
        toast({
          title: "Transcription complete",
          description: "Your response has been analyzed",
        });
      }
      
      setIsTranscribing(false);
    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsTranscribing(false);
      toast({
        title: "Transcription failed",
        description: "Please try recording again",
        variant: "destructive",
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowFeedback(false);
      setRecordingTime(0);
      setConfidence(0);
      setClarity(0);
      setRelevance(0);
    }
  };

  const handleReset = () => {
    if (audioRecorderRef.current?.isRecording()) {
      audioRecorderRef.current.stop();
    }
    setCurrentQuestion(0);
    setIsRecording(false);
    setShowFeedback(false);
    setRecordingTime(0);
    setConfidence(0);
    setClarity(0);
    setRelevance(0);
    setTranscript([]);
    setIsTranscribing(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const question = mockQuestions[currentQuestion];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Play className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Interactive Demo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Try the{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">AI Interview</span>
            {" "}Experience
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how our AI conducts realistic interviews with real-time feedback and analysis
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Panel - Interview Screen */}
            <div className="lg:col-span-2 space-y-4">
              {/* AI Avatar Area */}
              <Card className="p-6 bg-gradient-card border-border">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center animate-pulse">
                      <Brain className="w-12 h-12 text-primary-foreground" />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Volume2 className="w-4 h-4 text-primary animate-pulse" />
                      <span className="font-medium">AI Interviewer</span>
                    </div>
                  </div>
                  
                  {/* Anti-cheat indicators */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge variant={faceDetected ? "default" : "destructive"} className="gap-1">
                      <Eye className="w-3 h-3" />
                      {faceDetected ? "Face Detected" : "No Face"}
                    </Badge>
                    <Badge variant={eyeContact ? "default" : "destructive"} className="gap-1">
                      <Check className="w-3 h-3" />
                      {eyeContact ? "Good Posture" : "Look Away"}
                    </Badge>
                  </div>
                </div>

                {/* Question Display */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      Question {currentQuestion + 1} of {mockQuestions.length}
                    </Badge>
                    <Badge 
                      variant={question.type === "Technical" ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {question.type}
                    </Badge>
                  </div>
                  
                  <Card className="p-4 bg-background">
                    <p className="text-lg font-medium">{question.question}</p>
                  </Card>

                  {/* Recording Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant={isRecording ? "destructive" : "gradient"}
                        size="lg"
                        onClick={isRecording ? handleStopRecording : handleStartRecording}
                        className="gap-2"
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="w-5 h-5" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="w-5 h-5" />
                            Start Recording
                          </>
                        )}
                      </Button>
                      
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-destructive animate-pulse' : 'bg-muted'}`}></div>
                        <span className="text-sm font-mono font-medium">
                          {formatTime(recordingTime)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {recordingTime > 5 && !isRecording && (
                        <Button
                          variant="secondary"
                          onClick={handleNextQuestion}
                          disabled={currentQuestion === mockQuestions.length - 1}
                        >
                          Next Question
                        </Button>
                      )}
                      <Button variant="outline" size="icon" onClick={handleReset}>
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Panel - Real-time Feedback */}
            <div className="space-y-4">
              <Card className="p-6 border-border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Real-time Analysis
                </h3>

                {!showFeedback ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Start recording to see live feedback</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Confidence Score */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Confidence</span>
                        <span className="text-sm font-medium text-primary">
                          {Math.round(confidence)}%
                        </span>
                      </div>
                      <Progress value={confidence} className="h-2" />
                    </div>

                    {/* Clarity Score */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Speech Clarity</span>
                        <span className="text-sm font-medium text-secondary">
                          {Math.round(clarity)}%
                        </span>
                      </div>
                      <Progress value={clarity} className="h-2" />
                    </div>

                    {/* Relevance Score */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Relevance</span>
                        <span className="text-sm font-medium text-accent">
                          {Math.round(relevance)}%
                        </span>
                      </div>
                      <Progress value={relevance} className="h-2" />
                    </div>

                    {/* Expected Points */}
                    {recordingTime > 3 && (
                      <div className="pt-4 border-t">
                        <h4 className="text-sm font-medium mb-3">Key Points to Cover</h4>
                        <div className="space-y-2">
                          {question.expectedPoints.map((point, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-sm"
                              style={{ 
                                animationDelay: `${idx * 0.5}s`,
                                opacity: recordingTime > 3 + idx ? 1 : 0.3,
                              }}
                            >
                              <div className={`w-2 h-2 rounded-full ${
                                recordingTime > 5 + idx * 2 ? 'bg-primary' : 'bg-muted'
                              }`}></div>
                              <span className={recordingTime > 5 + idx * 2 ? 'text-foreground' : 'text-muted-foreground'}>
                                {point}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Live Tips */}
                    {isRecording && recordingTime > 8 && (
                      <Card className="p-3 bg-primary/5 border-primary/20 animate-fade-in">
                        <p className="text-xs text-primary font-medium flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Try to include specific examples from your experience</span>
                        </p>
                      </Card>
                    )}
                  </div>
                )}
              </Card>

              {/* Live Transcript Preview */}
              <Card className="p-6 border-border">
                <h3 className="text-lg font-semibold mb-4">Transcript</h3>
                {isTranscribing ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span>Transcribing your response...</span>
                  </div>
                ) : transcript.length > 0 ? (
                  <div className="text-sm space-y-2">
                    {transcript.map((text, idx) => (
                      <p key={idx} className="animate-fade-in">
                        "{text}"
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {isRecording 
                      ? "Recording... Stop recording to see your transcript" 
                      : "Your responses will appear here after recording"}
                  </p>
                )}
              </Card>
            </div>
          </div>

          {/* Demo Notice */}
          <Card className="mt-6 p-4 bg-primary/5 border-primary/20">
            <p className="text-sm text-center text-muted-foreground">
              <strong>Real voice recording enabled!</strong> Your audio is transcribed using OpenAI Whisper. 
              Sign up to access full interview analytics, detailed feedback reports, and progress tracking.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};
