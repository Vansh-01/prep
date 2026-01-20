import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Target, 
  Flame, 
  TrendingUp, 
  ArrowLeft,
  CheckCircle,
  Clock,
  Zap,
  Award
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { codingChallenges, Difficulty } from "@/data/codingChallenges";
import { toast } from "sonner";

interface CompletionRecord {
  id: string;
  challenge_id: string;
  points: number;
  completion_time_seconds: number;
  language: string;
  created_at: string;
}

interface DifficultyStats {
  difficulty: Difficulty;
  completed: number;
  total: number;
  color: string;
}

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Easy: "hsl(142, 76%, 36%)",
  Medium: "hsl(45, 93%, 47%)",
  Hard: "hsl(0, 84%, 60%)"
};

export default function ProgressDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [completions, setCompletions] = useState<CompletionRecord[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    await fetchCompletions(session.user.id);
  };

  const fetchCompletions = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("challenge_completions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCompletions(data || []);
      calculateStreak(data || []);
    } catch (error) {
      console.error("Error fetching completions:", error);
      toast.error("Failed to load progress data");
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (completions: CompletionRecord[]) => {
    if (completions.length === 0) {
      setCurrentStreak(0);
      setLongestStreak(0);
      return;
    }

    // Get unique dates when challenges were completed
    const uniqueDates = [...new Set(
      completions.map(c => new Date(c.created_at).toDateString())
    )].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    // Calculate current streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const firstDate = new Date(uniqueDates[0]);
    firstDate.setHours(0, 0, 0, 0);

    // Check if the most recent completion was today or yesterday
    if (firstDate.getTime() === today.getTime() || firstDate.getTime() === yesterday.getTime()) {
      streak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const currentDate = new Date(uniqueDates[i - 1]);
        const prevDate = new Date(uniqueDates[i]);
        currentDate.setHours(0, 0, 0, 0);
        prevDate.setHours(0, 0, 0, 0);
        
        const diffDays = (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays === 1) {
          streak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    let maxStreak = 1;
    let currentMax = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const currentDate = new Date(uniqueDates[i - 1]);
      const prevDate = new Date(uniqueDates[i]);
      currentDate.setHours(0, 0, 0, 0);
      prevDate.setHours(0, 0, 0, 0);
      
      const diffDays = (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        currentMax++;
        maxStreak = Math.max(maxStreak, currentMax);
      } else {
        currentMax = 1;
      }
    }

    setCurrentStreak(streak);
    setLongestStreak(Math.max(maxStreak, streak));
  };

  // Calculate stats
  const totalPoints = completions.reduce((sum, c) => sum + c.points, 0);
  const uniqueChallengesCompleted = new Set(completions.map(c => c.challenge_id)).size;
  const totalChallenges = codingChallenges.length;
  const completionPercentage = (uniqueChallengesCompleted / totalChallenges) * 100;
  const averageTime = completions.length > 0 
    ? Math.round(completions.reduce((sum, c) => sum + c.completion_time_seconds, 0) / completions.length)
    : 0;

  // Difficulty breakdown
  const difficultyStats: DifficultyStats[] = (["Easy", "Medium", "Hard"] as Difficulty[]).map(difficulty => {
    const challengesOfDifficulty = codingChallenges.filter(c => c.difficulty === difficulty);
    const completedOfDifficulty = challengesOfDifficulty.filter(c => 
      completions.some(comp => comp.challenge_id === c.id)
    );
    return {
      difficulty,
      completed: completedOfDifficulty.length,
      total: challengesOfDifficulty.length,
      color: DIFFICULTY_COLORS[difficulty]
    };
  });

  // Pie chart data for difficulty distribution of completed challenges
  const pieData = difficultyStats
    .filter(d => d.completed > 0)
    .map(d => ({
      name: d.difficulty,
      value: d.completed,
      color: d.color
    }));

  // Bar chart data for progress by difficulty
  const barData = difficultyStats.map(d => ({
    difficulty: d.difficulty,
    completed: d.completed,
    remaining: d.total - d.completed
  }));

  // Language distribution
  const languageStats = completions.reduce((acc, c) => {
    acc[c.language] = (acc[c.language] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const languageData = Object.entries(languageStats).map(([language, count]) => ({
    language: language.charAt(0).toUpperCase() + language.slice(1),
    count
  }));

  // Recent completions
  const recentCompletions = completions.slice(0, 5).map(c => {
    const challenge = codingChallenges.find(ch => ch.id === c.challenge_id);
    return {
      ...c,
      title: challenge?.title || c.challenge_id,
      difficulty: challenge?.difficulty || "Easy"
    };
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading progress...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Progress Dashboard</h1>
              <p className="text-muted-foreground">Track your coding journey</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/leaderboard">View Leaderboard</Link>
            </Button>
            <Button asChild>
              <Link to="/coding-practice">Practice Now</Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalPoints.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">From {completions.length} submissions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Challenges Completed</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{uniqueChallengesCompleted}</div>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={completionPercentage} className="h-2 flex-1" />
                <span className="text-xs text-muted-foreground">{Math.round(completionPercentage)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{currentStreak} days</div>
              <p className="text-xs text-muted-foreground mt-1">Longest: {longestStreak} days</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{formatTime(averageTime)}</div>
              <p className="text-xs text-muted-foreground mt-1">Per challenge</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Difficulty Breakdown Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Difficulty Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                  Complete challenges to see distribution
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress by Difficulty Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Progress by Difficulty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" />
                  <YAxis dataKey="difficulty" type="category" width={60} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="completed" name="Completed" stackId="a" fill="hsl(var(--primary))" />
                  <Bar dataKey="remaining" name="Remaining" stackId="a" fill="hsl(var(--muted))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Language Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Language Preference
              </CardTitle>
            </CardHeader>
            <CardContent>
              {languageData.length > 0 ? (
                <div className="space-y-3">
                  {languageData.map((lang) => {
                    const percentage = (lang.count / completions.length) * 100;
                    return (
                      <div key={lang.language} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{lang.language}</span>
                          <span className="text-muted-foreground">{lang.count} solutions</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No solutions submitted yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Difficulty Progress Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Difficulty Mastery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {difficultyStats.map((stat) => (
                <div key={stat.difficulty} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="outline" 
                      style={{ borderColor: stat.color, color: stat.color }}
                    >
                      {stat.difficulty}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {stat.completed}/{stat.total}
                    </span>
                  </div>
                  <Progress 
                    value={(stat.completed / stat.total) * 100} 
                    className="h-2"
                    style={{ 
                      "--progress-background": stat.color 
                    } as React.CSSProperties}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Recent Completions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentCompletions.length > 0 ? (
                <div className="space-y-3">
                  {recentCompletions.map((completion) => (
                    <div 
                      key={completion.id} 
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{completion.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge 
                            variant="outline" 
                            className="text-xs"
                            style={{ 
                              borderColor: DIFFICULTY_COLORS[completion.difficulty as Difficulty],
                              color: DIFFICULTY_COLORS[completion.difficulty as Difficulty]
                            }}
                          >
                            {completion.difficulty}
                          </Badge>
                          <span>{formatTime(completion.completion_time_seconds)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-primary">+{completion.points}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No completions yet. Start practicing!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
