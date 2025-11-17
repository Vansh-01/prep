import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-interview.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
      
      {/* Header with Sign In */}
      <div className="absolute top-0 left-0 right-0 z-20 py-6">
        <div className="container px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Interview Coach AI
          </div>
          <Link to="/auth">
            <Button variant="outline">Sign In</Button>
          </Link>
        </div>
      </div>
      
      <div className="container px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Interview Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Master Your Interview Skills with{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">AI Precision</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              Practice realistic interviews with AI avatars, get instant feedback, and land your dream job. 
              Built for freshers, trusted by companies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl" className="group">
                Start Practicing Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl" className="border-2">
                For Companies
              </Button>
            </div>
            
            <div className="mt-12 flex flex-wrap gap-8 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>10,000+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>500+ Companies</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>95% Success Rate</span>
              </div>
            </div>
          </div>
          
          {/* Right content - Image */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative rounded-2xl overflow-hidden shadow-large">
              <img 
                src={heroImage} 
                alt="AI Interview Platform Interface" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
            </div>
            
            {/* Floating cards */}
            <div className="absolute -top-6 -right-6 bg-card border border-border rounded-xl shadow-large p-4 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="text-2xl font-bold text-primary">98%</div>
              <div className="text-xs text-muted-foreground">Interview Score</div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-xl shadow-large p-4 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>
              <div className="text-2xl font-bold text-secondary">2.5k+</div>
              <div className="text-xs text-muted-foreground">Interviews Today</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
