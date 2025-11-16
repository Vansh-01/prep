import { Upload, Sparkles, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload & Analyze",
    description: "Upload your resume and paste the job description. Our AI analyzes both to generate personalized interview questions.",
  },
  {
    icon: Sparkles,
    title: "Practice with AI",
    description: "Take realistic mock interviews with AI avatars. Answer HR and technical questions while our system monitors your performance.",
  },
  {
    icon: CheckCircle2,
    title: "Get Feedback & Improve",
    description: "Receive detailed scorecards with concrete feedback, improvement tips, and shareable certificates to boost your profile.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get interview-ready in three simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary to-secondary"></div>
              )}
              
              <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-large">
                <step.icon className="w-10 h-10 text-primary-foreground" />
              </div>
              
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-primary/10 rounded-full blur-xl"></div>
              
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
