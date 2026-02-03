import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { 
  Building2, 
  Users, 
  BarChart3, 
  FileSearch, 
  Zap, 
  Shield, 
  CheckCircle2,
  Send 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ForCompaniesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const companyFeatures = [
  {
    icon: Users,
    title: "Bulk Candidate Screening",
    description: "Screen hundreds of candidates simultaneously with AI-powered interviews",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Get detailed insights on candidate performance with customizable reports",
  },
  {
    icon: FileSearch,
    title: "JD-Based Assessment",
    description: "Auto-generate interview questions based on your job descriptions",
  },
  {
    icon: Zap,
    title: "API Integration",
    description: "Seamlessly integrate with your existing ATS and HR systems",
  },
  {
    icon: Shield,
    title: "Anti-Cheating Measures",
    description: "Ensure interview integrity with proctoring and plagiarism detection",
  },
  {
    icon: Building2,
    title: "White-Label Solution",
    description: "Custom branding to match your company's identity",
  },
];

export const ForCompaniesDialog = ({ open, onOpenChange }: ForCompaniesDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    employeeCount: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Request Submitted!",
      description: "Our sales team will contact you within 24 hours.",
    });

    setFormData({
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      employeeCount: "",
      message: "",
    });
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            PrepMaster for Companies
          </DialogTitle>
          <DialogDescription>
            Transform your hiring process with AI-powered candidate assessment
          </DialogDescription>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-6 mt-4">
          {/* Features Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Enterprise Features</h3>
            <div className="grid gap-3">
              {companyFeatures.map((feature, index) => (
                <Card key={index} className="p-3 flex items-start gap-3 hover:shadow-md transition-shadow">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Trusted by 500+ Companies
              </h4>
              <p className="text-sm text-muted-foreground">
                From startups to Fortune 500, companies use PrepMaster to hire smarter and faster.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Get in Touch</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="Acme Inc."
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactName">Your Name *</Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    placeholder="John Doe"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeCount">Company Size *</Label>
                <Input
                  id="employeeCount"
                  name="employeeCount"
                  placeholder="e.g., 50-200 employees"
                  value={formData.employeeCount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">How can we help?</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your hiring needs..."
                  rows={3}
                  value={formData.message}
                  onChange={handleInputChange}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                variant="gradient"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Request Demo
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By submitting, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
