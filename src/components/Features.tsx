import { Brain, Video, Shield, Trophy, MessageSquare, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Interviews",
    description: "Practice with intelligent AI avatars that conduct realistic HR and technical interviews tailored to your role.",
  },
  {
    icon: Video,
    title: "Real-time Analysis",
    description: "Get instant feedback on your communication skills, body language, and technical knowledge during the interview.",
  },
  {
    icon: Shield,
    title: "Anti-Cheat System",
    description: "Advanced proctoring with face detection, gaze tracking, and behavior monitoring ensures authentic practice.",
  },
  {
    icon: Trophy,
    title: "Company Challenges",
    description: "Compete in real company-hosted coding challenges and showcase your skills on public leaderboards.",
  },
  {
    icon: MessageSquare,
    title: "JD/Resume Parsing",
    description: "Automatically analyze job descriptions and your resume to generate personalized interview questions.",
  },
  {
    icon: BarChart3,
    title: "Detailed Scorecards",
    description: "Receive comprehensive reports with scores, improvement suggestions, and shareable certificates.",
  },
];

export const Features = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">Ace Your Interview</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform combines cutting-edge AI technology with proven interview techniques to prepare you for success.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 hover:shadow-large transition-all duration-300 hover:-translate-y-1 border-border bg-gradient-card animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
