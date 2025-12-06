import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Code, Trophy, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const InterviewMode = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
      description: "Practice your interview skills with AI-powered voice interviews",
      path: "/",
      action: () => checkAuthAndNavigate("/", true)
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
      path: "/profile-settings",
      action: () => checkAuthAndNavigate("/profile-settings")
    }
  ];

  return (
    <div className="min-h-screen bg-background">
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
