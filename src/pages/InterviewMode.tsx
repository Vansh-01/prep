import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Code, Trophy, FileText, LayoutDashboard, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

const InterviewMode = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
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
      {/* Navigation Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              PrepMaster
            </h2>
            <nav className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/profile-settings")}
                className="gap-2"
              >
                <User className="h-4 w-4" />
                Profile Settings
              </Button>
            </nav>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {userEmail?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-sm">{userEmail || "User"}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/dashboard")} className="md:hidden">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/profile-settings")} className="md:hidden">
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="md:hidden" />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
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
