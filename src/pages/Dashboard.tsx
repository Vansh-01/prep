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
import { User, LogOut, TrendingUp, Calendar, Award, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
    }
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
    }
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
