import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, LogOut, TrendingUp, Calendar, Award, Clock, Sparkles, Mic, BarChart3, Target, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InterviewSession {
  id: string;
  transcript: string | null;
  ai_feedback: string | null;
  score: number | null;
  duration_seconds: number | null;
  created_at: string;
}

interface Profile {
  username: string | null;
  avatar_url: string | null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ username: "", avatar_url: "" });
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    totalTime: 0,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    await Promise.all([
      fetchProfile(session.user.id),
      fetchSessions(session.user.id)
    ]);
    
    setLoading(false);
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", userId)
      .single();
    
    if (data) {
      setProfile(data);
      
      // Check if profile is incomplete
      const hasSeenProfilePrompt = localStorage.getItem('hasSeenProfilePrompt');
      if ((!data.username || !data.avatar_url) && !hasSeenProfilePrompt) {
        setShowProfilePrompt(true);
        setProfileForm({
          username: data.username || "",
          avatar_url: data.avatar_url || ""
        });
      }
    }
  };

  const handleUpdateProfile = async () => {
    if (!profileForm.username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username",
        variant: "destructive",
      });
      return;
    }

    setUpdatingProfile(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        username: profileForm.username.trim(),
        avatar_url: profileForm.avatar_url.trim() || null
      })
      .eq("id", session.user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      setUpdatingProfile(false);
      return;
    }

    setProfile({
      username: profileForm.username.trim(),
      avatar_url: profileForm.avatar_url.trim() || null
    });
    
    localStorage.setItem('hasSeenProfilePrompt', 'true');
    setShowProfilePrompt(false);
    setUpdatingProfile(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

  const handleSkipProfile = () => {
    localStorage.setItem('hasSeenProfilePrompt', 'true');
    setShowProfilePrompt(false);
  };

  const fetchSessions = async (userId: string) => {
    const { data, error } = await supabase
      .from("interview_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load interview history",
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setSessions(data);
      calculateStats(data);
      
      // Show welcome dialog for first-time users
      if (data.length === 0) {
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
        if (!hasSeenWelcome) {
          setShowWelcome(true);
        }
      }
    }
  };

  const handleCloseWelcome = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcome(false);
  };

  const calculateStats = (sessions: InterviewSession[]) => {
    const totalInterviews = sessions.length;
    const scores = sessions.filter(s => s.score !== null).map(s => s.score!);
    const averageScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
    const totalTime = sessions
      .filter(s => s.duration_seconds !== null)
      .reduce((acc, s) => acc + (s.duration_seconds || 0), 0);

    setStats({ totalInterviews, averageScore, totalTime });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Completion Prompt */}
      <Dialog open={showProfilePrompt} onOpenChange={setShowProfilePrompt}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <AlertCircle className="w-5 h-5 text-primary" />
              Complete Your Profile
            </DialogTitle>
            <DialogDescription>
              Add your details to personalize your experience
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={profileForm.username}
                onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="avatar_url">Avatar URL (optional)</Label>
              <Input
                id="avatar_url"
                placeholder="https://example.com/avatar.jpg"
                value={profileForm.avatar_url}
                onChange={(e) => setProfileForm({ ...profileForm, avatar_url: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Add a profile picture URL to display your avatar
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleUpdateProfile} 
                disabled={updatingProfile}
                className="flex-1"
              >
                {updatingProfile ? "Saving..." : "Save Profile"}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSkipProfile}
                disabled={updatingProfile}
              >
                Skip for now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Welcome Dialog */}
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="w-6 h-6 text-primary" />
              Welcome to Interview Coach AI!
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Let's get you started on your journey to interview mastery
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mic className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Practice Realistic Interviews</h3>
                <p className="text-muted-foreground">
                  Answer AI-generated questions using your voice. Our system transcribes and analyzes your responses in real-time.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Get Instant Feedback</h3>
                <p className="text-muted-foreground">
                  Receive detailed analysis on your confidence, clarity, and relevance. Track your scores over time to see your improvement.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Land Your Dream Job</h3>
                <p className="text-muted-foreground">
                  Build confidence through practice. Review your transcripts and feedback to continuously improve your interview skills.
                </p>
              </div>
            </div>

            {/* CTA */}
            <Card className="bg-gradient-primary/5 border-primary/20 p-6">
              <div className="text-center space-y-3">
                <h4 className="font-semibold text-lg">Ready to start?</h4>
                <p className="text-sm text-muted-foreground">
                  Head to the home page and click "Try the AI Interview Experience" to begin your first practice session!
                </p>
                <div className="flex gap-2 justify-center pt-2">
                  <Link to="/">
                    <Button variant="default" className="gap-2">
                      <Mic className="w-4 h-4" />
                      Start First Interview
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={handleCloseWelcome}>
                    Got it!
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="border-b bg-card">
        <div className="container px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Interview Coach AI
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={profile?.avatar_url || ""} alt={profile?.username || "User"} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {(profile?.username || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{profile?.username || "User"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card z-50">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your interview practice progress and improvement over time
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInterviews}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Practice sessions completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.averageScore >= 80 ? "Excellent performance!" : "Keep practicing!"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Practice Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(stats.totalTime)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total time practicing
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Score Progress Chart */}
        {sessions.length > 0 && sessions.some(s => s.score !== null) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Score Progress</CardTitle>
              <CardDescription>
                Track your improvement over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={sessions
                    .filter(s => s.score !== null)
                    .reverse()
                    .map(s => ({
                      date: format(new Date(s.created_at), "MMM d"),
                      score: s.score,
                    }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      color: "hsl(var(--foreground))"
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Interview History */}
        <Card>
          <CardHeader>
            <CardTitle>Interview History</CardTitle>
            <CardDescription>
              Review your past interview sessions and track your progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No interviews yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start practicing to see your interview history here
                </p>
                <Link to="/">
                  <Button>Start Your First Interview</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <Card key={session.id} className="border-l-4 border-l-primary">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            Interview Session
                          </CardTitle>
                          <CardDescription>
                            {format(new Date(session.created_at), "PPP 'at' p")}
                          </CardDescription>
                        </div>
                        {session.score !== null && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {session.score}%
                            </div>
                            <div className="text-xs text-muted-foreground">Score</div>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {session.duration_seconds && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>Duration: {formatDuration(session.duration_seconds)}</span>
                          </div>
                        )}
                        
                        {session.ai_feedback && (
                          <div className="mt-3">
                            <h4 className="font-semibold text-sm mb-1">AI Feedback:</h4>
                            <p className="text-sm text-muted-foreground">{session.ai_feedback}</p>
                          </div>
                        )}
                        
                        {session.transcript && (
                          <div className="mt-3">
                            <h4 className="font-semibold text-sm mb-1">Transcript:</h4>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {session.transcript}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
