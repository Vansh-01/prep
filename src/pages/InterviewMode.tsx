import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageSquare, Code, Trophy, FileText, BarChart3, User, LogOut } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  username: string | null;
  avatar_url: string | null;
}

const InterviewMode = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", session.user.id)
        .single();
      setProfile(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const checkAuthAndNavigate = async (path: string, scrollToDemo = false) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access practice modes.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    navigate(path);
    if (scrollToDemo) {
      setTimeout(() => {
        document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const modes = [
    {
      icon: MessageSquare,
      title: "Interview Practice",
      description: "Practice your interview skills with AI-powered voice interviews tailored to your job profile",
      path: "/interview-practice",
      action: () => checkAuthAndNavigate("/interview-practice")
    },
    {
      icon: Code,
      title: "Start Practicing",
      description: "Write code in a VS Code-like environment and practice coding",
      path: "/coding-practice",
      action: () => checkAuthAndNavigate("/coding-practice")
    },
    {
      icon: Trophy,
      title: "Coding Challenge",
      description: "Take on coding challenges and test your skills",
      path: "/coding-challenge",
      action: () => checkAuthAndNavigate("/coding-challenge")
    },
    {
      icon: FileText,
      title: "Resume Analyzer",
      description: "Get AI-powered feedback on your resume to stand out",
      path: "/resume-analyzer",
      action: () => checkAuthAndNavigate("/resume-analyzer")
    }
  ];

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
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link to="/progress" className="flex items-center">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  <span>View Your Stats & History</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link to="/profile-settings" className="flex items-center">
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

      <div className="container px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Choose Your Practice Mode
            </h1>
            <p className="text-lg text-muted-foreground">
              Select how you want to practice and improve your skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modes.map((mode, index) => (
              <Card 
                key={index}
                className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={mode.action}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <mode.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{mode.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {mode.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewMode;
