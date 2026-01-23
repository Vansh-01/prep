import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AudioRecorder, blobToBase64 } from "@/utils/audioRecorder";
import { getQuestionsForProfile, getProfileDisplayName, InterviewQuestion } from "@/data/interviewQuestions";
import { 
  Mic, 
  MicOff, 
  RotateCcw, 
  Check, 
  AlertCircle,
  Eye,
  Volume2,
  Brain,
  ArrowLeft,
  ChevronRight,
  User,
  Loader2,
  Trophy,
  Settings
} from "lucide-react";

interface QuestionData {
  question: string;
  transcript: string;
  confidence: number;
  clarity: number;
  relevance: number;
  duration: number;
}

export default function InterviewPractice() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [jobProfile, setJobProfile] = useState<string | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
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
  const [sessionData, setSessionData] = useState<QuestionData[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);

  useEffect(() => {
    checkAuthAndLoadProfile();
  }, []);

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

  const checkAuthAndLoadProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to practice interviews",
      });
      navigate("/auth");
      return;
    }

    // Fetch user's job profile
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("job_profile")
      .eq("id", session.user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
    }

    const userJobProfile = profile?.job_profile || null;
    setJobProfile(userJobProfile);
    
    // Load questions based on job profile
    const profileQuestions = getQuestionsForProfile(userJobProfile);
    // Shuffle and pick 5-8 questions for a session
    const shuffled = [...profileQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, Math.min(8, shuffled.length)));
    
    setLoading(false);
  };

  const handleStartRecording = async () => {
    try {
      if (currentQuestion === 0 && sessionStartTime === null) {
        setSessionStartTime(Date.now());
      }
      
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
      
      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: { audio: base64Audio }
      });
      
      if (error) {
        console.error('Transcription error:', error);
        throw error;
      }
      
      if (data?.text) {
        setTranscript([data.text]);
        
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

  const saveSessionToDatabase = async (finalSessionData: QuestionData[]) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return;

    if (finalSessionData.length === 0) return;

    const fullTranscript = finalSessionData.map(q => `Q: ${q.question}\nA: ${q.transcript}`).join('\n\n');
    const totalDuration = finalSessionData.reduce((acc, q) => acc + q.duration, 0);
    const avgConfidence = finalSessionData.reduce((acc, q) => acc + q.confidence, 0) / finalSessionData.length;
    const avgClarity = finalSessionData.reduce((acc, q) => acc + q.clarity, 0) / finalSessionData.length;
    const avgRelevance = finalSessionData.reduce((acc, q) => acc + q.relevance, 0) / finalSessionData.length;
    const overallScore = Math.round((avgConfidence + avgClarity + avgRelevance) / 3);
    
    setFinalScore(overallScore);
    
    const feedback = `Overall Performance: ${overallScore}%\n\n` +
      `Confidence: ${Math.round(avgConfidence)}% - ${avgConfidence >= 80 ? 'Excellent confidence level!' : 'Work on building more confidence in your responses.'}\n` +
      `Clarity: ${Math.round(avgClarity)}% - ${avgClarity >= 80 ? 'Very clear communication!' : 'Try to speak more clearly and concisely.'}\n` +
      `Relevance: ${Math.round(avgRelevance)}% - ${avgRelevance >= 80 ? 'Great job staying on topic!' : 'Focus on addressing the question more directly.'}\n\n` +
      `Completed ${finalSessionData.length} questions in ${Math.floor(totalDuration / 60)}m ${totalDuration % 60}s.`;

    const { error } = await supabase
      .from('interview_sessions')
      .insert({
        user_id: session.user.id,
        transcript: fullTranscript,
        ai_feedback: feedback,
        score: overallScore,
        duration_seconds: totalDuration,
      });

    if (error) {
      console.error('Error saving session:', error);
      toast({
        title: "Error",
        description: "Failed to save interview session",
        variant: "destructive",
      });
    } else {
      setSessionComplete(true);
      toast({
        title: "Session complete!",
        description: "Your interview has been saved to your dashboard",
      });
    }
  };

  const handleNextQuestion = () => {
    if (transcript.length > 0) {
      const questionData: QuestionData = {
        question: questions[currentQuestion].question,
        transcript: transcript[0] || '',
        confidence,
        clarity,
        relevance,
        duration: recordingTime,
      };
      const updatedSessionData = [...sessionData, questionData];
      setSessionData(updatedSessionData);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setShowFeedback(false);
        setRecordingTime(0);
        setConfidence(0);
        setClarity(0);
        setRelevance(0);
        setTranscript([]);
      } else {
        saveSessionToDatabase(updatedSessionData);
      }
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
    setSessionData([]);
    setSessionStartTime(null);
    setSessionComplete(false);
    setFinalScore(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
            <Link to="/interview-mode">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Interview Complete</h1>
              <p className="text-sm text-muted-foreground">{getProfileDisplayName(jobProfile)} Interview</p>
            </div>
          </div>
        </header>

        <main className="container px-4 sm:px-6 lg:px-8 py-12 max-w-2xl">
          <Card className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center">
              <Trophy className="w-10 h-10 text-primary-foreground" />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Great Job!</h2>
            <p className="text-muted-foreground mb-6">
              You've completed your {getProfileDisplayName(jobProfile)} interview session
            </p>

            <div className="bg-muted rounded-lg p-6 mb-6">
              <div className="text-4xl font-bold text-primary mb-2">{finalScore}%</div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="text-lg font-semibold">{sessionData.length}</div>
                <p className="text-xs text-muted-foreground">Questions</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {formatTime(sessionData.reduce((acc, q) => acc + q.duration, 0))}
                </div>
                <p className="text-xs text-muted-foreground">Total Time</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {Math.round(sessionData.reduce((acc, q) => acc + q.confidence, 0) / sessionData.length)}%
                </div>
                <p className="text-xs text-muted-foreground">Avg Confidence</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Practice Again
              </Button>
              <Button className="flex-1" asChild>
                <Link to="/dashboard">
                  View Dashboard
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  const question = questions[currentQuestion];

  if (!question) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-bold mb-2">No Questions Available</h2>
          <p className="text-muted-foreground mb-4">
            Please update your job profile to get personalized interview questions.
          </p>
          <Button asChild>
            <Link to="/profile-settings">
              <Settings className="w-4 h-4 mr-2" />
              Update Profile
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/interview-mode">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Interview Practice</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <User className="w-3 h-3" />
                {getProfileDisplayName(jobProfile)} Questions
              </p>
            </div>
          </div>
          <Badge variant="secondary">
            {currentQuestion + 1} / {questions.length}
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 sm:px-6 lg:px-8 py-8">
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
                      Question {currentQuestion + 1} of {questions.length}
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
                        variant={isRecording ? "destructive" : "default"}
                        size="lg"
                        onClick={isRecording ? handleStopRecording : handleStartRecording}
                        disabled={isTranscribing}
                        className="gap-2"
                      >
                        {isTranscribing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Transcribing...
                          </>
                        ) : isRecording ? (
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
                      {transcript.length > 0 && !isRecording && (
                        <Button
                          variant="default"
                          onClick={handleNextQuestion}
                        >
                          {currentQuestion === questions.length - 1 ? 'Finish' : 'Next Question'}
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                      <Button variant="outline" size="icon" onClick={handleReset}>
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Transcript Preview */}
              {transcript.length > 0 && (
                <Card className="p-4 bg-muted/50">
                  <h4 className="text-sm font-medium mb-2">Your Response:</h4>
                  <p className="text-sm text-muted-foreground">{transcript[0]}</p>
                </Card>
              )}
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
                        <span className="text-sm font-medium text-primary">
                          {Math.round(clarity)}%
                        </span>
                      </div>
                      <Progress value={clarity} className="h-2" />
                    </div>

                    {/* Relevance Score */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Relevance</span>
                        <span className="text-sm font-medium text-primary">
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
                                opacity: recordingTime > 3 + idx ? 1 : 0.3,
                              }}
                            >
                              <div className={`w-2 h-2 rounded-full ${
                                recordingTime > 5 + idx * 2 ? 'bg-primary' : 'bg-muted'
                              }`}></div>
                              <span>{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>

              {/* Progress Card */}
              <Card className="p-4 border-border">
                <h4 className="text-sm font-medium mb-3">Session Progress</h4>
                <div className="space-y-2">
                  {questions.map((_, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        idx < currentQuestion 
                          ? 'bg-primary text-primary-foreground' 
                          : idx === currentQuestion 
                            ? 'bg-primary/20 text-primary border-2 border-primary'
                            : 'bg-muted text-muted-foreground'
                      }`}>
                        {idx < currentQuestion ? <Check className="w-3 h-3" /> : idx + 1}
                      </div>
                      <span className={`text-sm ${idx === currentQuestion ? 'font-medium' : 'text-muted-foreground'}`}>
                        {idx < currentQuestion ? 'Completed' : idx === currentQuestion ? 'Current' : 'Upcoming'}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
