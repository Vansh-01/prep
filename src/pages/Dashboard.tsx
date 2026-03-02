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
import { User, LogOut, TrendingUp, Calendar, Award, Clock, Sparkles, Mic, BarChart3, Target, AlertCircle, Upload, FileText, ArrowLeft, Briefcase, LayoutDashboard, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  experience_level: string | null;
  job_profile: string | null;
  resume_url: string | null;
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
  const [profileForm, setProfileForm] = useState({ 
    username: "", 
    avatar_url: "", 
    experience_level: "",
    job_profile: ""
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [customJobProfile, setCustomJobProfile] = useState("");
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
      .select("username, avatar_url, experience_level, job_profile, resume_url")
      .eq("id", userId)
      .single();
    
    if (data) {
      setProfile(data);
      
      // Check if profile is incomplete (missing experience level or job profile)
      const hasSeenProfilePrompt = localStorage.getItem('hasSeenProfilePrompt');
      const isProfileIncomplete = !data.experience_level || !data.job_profile;
      if (isProfileIncomplete && !hasSeenProfilePrompt) {
        setShowProfilePrompt(true);
        
        // Handle custom job profile (stored as "other:custom_value")
        const jobProfile = data.job_profile || "";
        if (jobProfile.startsWith("other:")) {
          setCustomJobProfile(jobProfile.replace("other:", ""));
        }
        
        setProfileForm({
          username: data.username || "",
          avatar_url: data.avatar_url || "",
          experience_level: data.experience_level || "",
          job_profile: jobProfile
        });
      }
    }
  };

  const handleUpdateProfile = async () => {
    if (!profileForm.experience_level) {
      toast({
        title: "Experience Level Required",
        description: "Please select your experience level",
        variant: "destructive",
      });
      return;
    }

    if (!profileForm.job_profile) {
      toast({
        title: "Job Profile Required",
        description: "Please select your target job profile",
        variant: "destructive",
      });
      return;
    }

    // Validate custom job profile if "other" is selected
    if (profileForm.job_profile === "other" && !customJobProfile.trim()) {
      toast({
        title: "Job Profile Required",
        description: "Please specify your job profile",
        variant: "destructive",
      });
      return;
    }

    setUpdatingProfile(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return;

    let resumeUrl = profile?.resume_url || null;

    // Upload resume if selected
    if (resumeFile) {
      setUploadingResume(true);
      const fileExt = resumeFile.name.split('.').pop();
      const filePath = `${session.user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, resumeFile);

      if (uploadError) {
        toast({
          title: "Upload Error",
          description: "Failed to upload resume",
          variant: "destructive",
        });
        setUpdatingProfile(false);
        setUploadingResume(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);
      
      resumeUrl = urlData.publicUrl;
      setUploadingResume(false);
    }

    // Determine final job profile value
    const finalJobProfile = profileForm.job_profile === "other" 
      ? `other:${customJobProfile.trim()}` 
      : profileForm.job_profile;

    const { error } = await supabase
      .from("profiles")
      .update({
        username: profileForm.username.trim() || null,
        avatar_url: profileForm.avatar_url.trim() || null,
        experience_level: profileForm.experience_level,
        job_profile: finalJobProfile,
        resume_url: resumeUrl
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
      username: profileForm.username.trim() || null,
      avatar_url: profileForm.avatar_url.trim() || null,
      experience_level: profileForm.experience_level,
      job_profile: finalJobProfile,
      resume_url: resumeUrl
    });
    
    localStorage.setItem('hasSeenProfilePrompt', 'true');
    setShowProfilePrompt(false);
    setUpdatingProfile(false);
    setResumeFile(null);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Resume must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setResumeFile(file);
    }
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
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <AlertCircle className="w-5 h-5 text-primary" />
              Complete Your Profile
            </DialogTitle>
            <DialogDescription>
              Help us personalize your interview practice experience
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-5 py-4">
            {/* Experience Level */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Experience Level *</Label>
              <RadioGroup
                value={profileForm.experience_level}
                onValueChange={(value) => setProfileForm({ ...profileForm, experience_level: value })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fresher" id="fresher" />
                  <Label htmlFor="fresher" className="cursor-pointer">Fresher / Entry Level</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="experienced" id="experienced" />
                  <Label htmlFor="experienced" className="cursor-pointer">Experienced Professional</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Job Profile */}
            <div className="space-y-2">
              <Label htmlFor="job_profile" className="text-base font-medium">Target Job Profile *</Label>
              <Select
                value={profileForm.job_profile.startsWith("other:") ? "other" : profileForm.job_profile}
                onValueChange={(value) => {
                  if (value === "other") {
                    setProfileForm({ ...profileForm, job_profile: "other" });
                  } else {
                    setProfileForm({ ...profileForm, job_profile: value });
                    setCustomJobProfile("");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your target role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="software_engineer">Software Engineer</SelectItem>
                  <SelectItem value="data_analyst">Data Analyst</SelectItem>
                  <SelectItem value="data_scientist">Data Scientist</SelectItem>
                  <SelectItem value="product_manager">Product Manager</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {(profileForm.job_profile === "other" || profileForm.job_profile.startsWith("other:")) && (
                <Input
                  placeholder="Please specify your job profile"
                  value={customJobProfile}
                  onChange={(e) => setCustomJobProfile(e.target.value)}
                  className="mt-2"
                  maxLength={100}
                />
              )}
            </div>

            {/* Resume Upload */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Upload Resume (optional)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  {resumeFile ? (
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <FileText className="w-5 h-5" />
                      <span className="font-medium">{resumeFile.name}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload your resume (PDF, DOC, DOCX)
                      </p>
                      <p className="text-xs text-muted-foreground">Max size: 5MB</p>
                    </div>
                  )}
                </label>
              </div>
              {profile?.resume_url && !resumeFile && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Resume already uploaded
                </p>
              )}
            </div>

            {/* Username (optional) */}
            <div className="space-y-2">
              <Label htmlFor="username">Username (optional)</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={profileForm.username}
                onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleUpdateProfile} 
                disabled={updatingProfile || uploadingResume}
                className="flex-1"
              >
                {uploadingResume ? "Uploading..." : updatingProfile ? "Saving..." : "Save Profile"}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSkipProfile}
                disabled={updatingProfile || uploadingResume}
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
              Welcome to PrepMaster!
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
          <div className="flex items-center gap-4">
            <Link to="/interview-mode">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/interview-mode" className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              PrepMaster
            </Link>
          </div>
          
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
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link to="/profile-settings">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </Link>
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
