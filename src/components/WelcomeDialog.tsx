 import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
 } from "@/components/ui/dialog";
 import { Button } from "@/components/ui/button";
 import { Sparkles, Mic, BarChart3, Target } from "lucide-react";
 import { useNavigate } from "react-router-dom";
 
 interface WelcomeDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
 }
 
 const WelcomeDialog = ({ open, onOpenChange }: WelcomeDialogProps) => {
   const navigate = useNavigate();
 
   const features = [
     {
       icon: Mic,
       title: "Practice Realistic Interviews",
       description:
         "Answer AI-generated questions using your voice. Our system transcribes and analyzes your responses in real-time.",
     },
     {
       icon: BarChart3,
       title: "Get Instant Feedback",
       description:
         "Receive detailed analysis on your confidence, clarity, and relevance. Track your scores over time to see your improvement.",
     },
     {
       icon: Target,
       title: "Land Your Dream Job",
       description:
         "Build confidence through practice. Review your transcripts and feedback to continuously improve your interview skills.",
     },
   ];
 
   const handleStartInterview = () => {
     onOpenChange(false);
     navigate("/interview-practice");
   };
 
   const handleDismiss = () => {
     onOpenChange(false);
   };
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="sm:max-w-lg">
         <DialogHeader>
           <DialogTitle className="flex items-center gap-2 text-2xl">
             <Sparkles className="h-6 w-6 text-primary" />
             Welcome to PrepMaster!
           </DialogTitle>
           <DialogDescription>
             Let's get you started on your journey to interview mastery
           </DialogDescription>
         </DialogHeader>
 
         <div className="space-y-4 py-4">
           {features.map((feature, index) => (
             <div key={index} className="flex gap-4">
               <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                 <feature.icon className="h-5 w-5 text-primary" />
               </div>
               <div>
                 <h4 className="font-semibold text-foreground">{feature.title}</h4>
                 <p className="text-sm text-muted-foreground">{feature.description}</p>
               </div>
             </div>
           ))}
         </div>
 
         <div className="mt-4 p-4 rounded-lg bg-muted/50 border text-center">
           <h4 className="font-semibold mb-1">Ready to start?</h4>
           <p className="text-sm text-muted-foreground mb-4">
             Head to the home page and click "Try the AI Interview Experience" to begin your first practice session!
           </p>
           <div className="flex gap-3 justify-center">
             <Button onClick={handleStartInterview} className="gap-2">
               <Mic className="h-4 w-4" />
               Start First Interview
             </Button>
             <Button variant="outline" onClick={handleDismiss}>
               Got it!
             </Button>
           </div>
         </div>
       </DialogContent>
     </Dialog>
   );
 };
 
 export default WelcomeDialog;