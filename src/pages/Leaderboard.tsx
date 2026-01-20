import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Trophy, Clock, Target, Medal, Crown, Award } from "lucide-react";
import { codingChallenges } from "@/data/codingChallenges";

interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url: string | null;
  total_points: number;
  challenges_completed: number;
  avg_completion_time: number;
}

interface ChallengeLeaderEntry {
  user_id: string;
  username: string;
  avatar_url: string | null;
  completion_time_seconds: number;
  points: number;
  created_at: string;
}

const Leaderboard = () => {
  const navigate = useNavigate();
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [challengeLeaderboard, setChallengeLeaderboard] = useState<ChallengeLeaderEntry[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("global");

  useEffect(() => {
    fetchGlobalLeaderboard();
  }, []);

  useEffect(() => {
    if (selectedChallenge) {
      fetchChallengeLeaderboard(selectedChallenge);
    }
  }, [selectedChallenge]);

  const fetchGlobalLeaderboard = async () => {
    setLoading(true);
    try {
      // Get all completions with user profiles
      const { data: completions, error } = await supabase
        .from("challenge_completions")
        .select("user_id, points, completion_time_seconds");

      if (error) throw error;

      // Aggregate by user
      const userStats: Record<string, { total_points: number; challenges_completed: number; total_time: number }> = {};
      
      completions?.forEach((c) => {
        if (!userStats[c.user_id]) {
          userStats[c.user_id] = { total_points: 0, challenges_completed: 0, total_time: 0 };
        }
        userStats[c.user_id].total_points += c.points;
        userStats[c.user_id].challenges_completed += 1;
        userStats[c.user_id].total_time += c.completion_time_seconds;
      });

      // Get user profiles
      const userIds = Object.keys(userStats);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      const leaderboard: LeaderboardEntry[] = Object.entries(userStats)
        .map(([userId, stats]) => {
          const profile = profileMap.get(userId);
          return {
            user_id: userId,
            username: profile?.username || "Anonymous",
            avatar_url: profile?.avatar_url || null,
            total_points: stats.total_points,
            challenges_completed: stats.challenges_completed,
            avg_completion_time: Math.round(stats.total_time / stats.challenges_completed),
          };
        })
        .sort((a, b) => b.total_points - a.total_points)
        .slice(0, 50);

      setGlobalLeaderboard(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChallengeLeaderboard = async (challengeId: string) => {
    try {
      const { data: completions, error } = await supabase
        .from("challenge_completions")
        .select("user_id, completion_time_seconds, points, created_at")
        .eq("challenge_id", challengeId)
        .order("completion_time_seconds", { ascending: true })
        .limit(20);

      if (error) throw error;

      const userIds = completions?.map((c) => c.user_id) || [];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      const leaderboard: ChallengeLeaderEntry[] = (completions || []).map((c) => {
        const profile = profileMap.get(c.user_id);
        return {
          user_id: c.user_id,
          username: profile?.username || "Anonymous",
          avatar_url: profile?.avatar_url || null,
          completion_time_seconds: c.completion_time_seconds,
          points: c.points,
          created_at: c.created_at,
        };
      });

      setChallengeLeaderboard(leaderboard);
    } catch (error) {
      console.error("Error fetching challenge leaderboard:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return <span className="text-muted-foreground font-bold w-6 text-center">{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border-yellow-500/30";
    if (rank === 2) return "bg-gradient-to-r from-gray-400/20 to-gray-400/5 border-gray-400/30";
    if (rank === 3) return "bg-gradient-to-r from-amber-600/20 to-amber-600/5 border-amber-600/30";
    return "";
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate("/coding-challenge")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Challenges
          </Button>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-10 w-10 text-yellow-500" />
            <h1 className="text-4xl font-bold">Leaderboard</h1>
          </div>
          <p className="text-muted-foreground">Top performers ranked by points and completion times</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="global">Global Rankings</TabsTrigger>
            <TabsTrigger value="challenge">By Challenge</TabsTrigger>
          </TabsList>

          <TabsContent value="global">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading leaderboard...</div>
                ) : globalLeaderboard.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No completions yet. Be the first to complete a challenge!</p>
                    <Button className="mt-4" onClick={() => navigate("/coding-challenge")}>
                      Start a Challenge
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {globalLeaderboard.map((entry, index) => (
                      <div
                        key={entry.user_id}
                        className={`flex items-center gap-4 p-4 rounded-lg border ${getRankBg(index + 1)}`}
                      >
                        <div className="flex items-center justify-center w-8">
                          {getRankIcon(index + 1)}
                        </div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={entry.avatar_url || undefined} />
                          <AvatarFallback>{entry.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">{entry.username}</p>
                          <p className="text-sm text-muted-foreground">
                            {entry.challenges_completed} challenges completed
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-primary">{entry.total_points} pts</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                            <Clock className="h-3 w-3" />
                            avg {formatTime(entry.avg_completion_time)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenge">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Select Challenge</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
                  {codingChallenges.map((challenge) => (
                    <Button
                      key={challenge.id}
                      variant={selectedChallenge === challenge.id ? "default" : "ghost"}
                      className="w-full justify-start text-left"
                      onClick={() => setSelectedChallenge(challenge.id)}
                    >
                      <span className="truncate">{challenge.title}</span>
                      <Badge
                        variant="outline"
                        className={`ml-auto ${
                          challenge.difficulty === "Easy"
                            ? "text-green-500"
                            : challenge.difficulty === "Medium"
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      >
                        {challenge.difficulty}
                      </Badge>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {selectedChallenge
                      ? codingChallenges.find((c) => c.id === selectedChallenge)?.title
                      : "Select a challenge"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!selectedChallenge ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Select a challenge to see its leaderboard
                    </div>
                  ) : challengeLeaderboard.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No completions for this challenge yet
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {challengeLeaderboard.map((entry, index) => (
                        <div
                          key={entry.user_id}
                          className={`flex items-center gap-4 p-4 rounded-lg border ${getRankBg(index + 1)}`}
                        >
                          <div className="flex items-center justify-center w-8">
                            {getRankIcon(index + 1)}
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={entry.avatar_url || undefined} />
                            <AvatarFallback>{entry.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-semibold">{entry.username}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(entry.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg flex items-center gap-1 justify-end">
                              <Clock className="h-4 w-4" />
                              {formatTime(entry.completion_time_seconds)}
                            </p>
                            <p className="text-sm text-primary">{entry.points} pts</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Leaderboard;
