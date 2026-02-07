import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Users, 
  BarChart3, 
  FileSearch, 
  Zap, 
  Shield, 
  ArrowLeft,
  Send,
  LogIn
} from "lucide-react";

const companyFeatures = [
  {
    icon: Users,
    title: "Bulk Candidate Screening",
    description: "Screen hundreds of candidates simultaneously with AI-powered interviews",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Detailed insights on candidate performance with customizable reports",
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

export default function CompanyAuth() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // Contact/Demo form state
  const [contactData, setContactData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    employeeCount: "",
    message: "",
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate company login
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Company Login",
      description: "Company portal is coming soon! We'll notify you when it's ready.",
    });
    setIsLoading(false);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Request Submitted!",
      description: "Our sales team will contact you within 24 hours.",
    });

    setContactData({
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      employeeCount: "",
      message: "",
    });
    setIsLoading(false);
  };

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="py-6">
        <div className="container px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">PrepMaster</span>
          </Link>
          <Link to="/auth">
            <Button variant="outline" size="sm">Student Login</Button>
          </Link>
        </div>
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Enterprise Solutions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            PrepMaster for{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">Companies</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Transform your hiring process with AI-powered candidate assessment and screening
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* Left: Features */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Enterprise Features</h2>
            <div className="grid gap-3">
              {companyFeatures.map((feature, index) => (
                <Card key={index} className="p-4 flex items-start gap-3 hover:shadow-medium transition-shadow border-border/60">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-4 bg-primary/5 border-primary/20">
              <p className="text-sm font-semibold mb-1 flex items-center gap-2">
                <span className="text-primary">✦</span> Trusted by 500+ Companies
              </p>
              <p className="text-sm text-muted-foreground">
                From startups to Fortune 500, companies use PrepMaster to hire smarter and faster.
              </p>
            </Card>
          </div>

          {/* Right: Login / Request Demo */}
          <div>
            <Card className="shadow-large">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Company Portal
                </CardTitle>
                <CardDescription>
                  Sign in to your company account or request a demo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="demo">Request Demo</TabsTrigger>
                  </TabsList>

                  {/* Company Login Tab */}
                  <TabsContent value="login">
                    <form onSubmit={handleLoginSubmit} className="space-y-4 mt-2">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Work Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="you@company.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData((p) => ({ ...p, email: e.target.value }))}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          value={loginData.password}
                          onChange={(e) => setLoginData((p) => ({ ...p, password: e.target.value }))}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <Button type="submit" className="w-full" variant="gradient" disabled={isLoading}>
                        {isLoading ? "Signing in..." : (
                          <>
                            <LogIn className="w-4 h-4 mr-2" />
                            Sign In
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        Don't have a company account?{" "}
                        <span className="text-primary cursor-pointer">Contact Sales</span>
                      </p>
                    </form>
                  </TabsContent>

                  {/* Request Demo Tab */}
                  <TabsContent value="demo">
                    <form onSubmit={handleContactSubmit} className="space-y-4 mt-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Company Name *</Label>
                          <Input
                            id="companyName"
                            name="companyName"
                            placeholder="Acme Inc."
                            value={contactData.companyName}
                            onChange={handleContactChange}
                            required
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactName">Your Name *</Label>
                          <Input
                            id="contactName"
                            name="contactName"
                            placeholder="John Doe"
                            value={contactData.contactName}
                            onChange={handleContactChange}
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="contact-email">Work Email *</Label>
                          <Input
                            id="contact-email"
                            name="email"
                            type="email"
                            placeholder="john@company.com"
                            value={contactData.email}
                            onChange={handleContactChange}
                            required
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={contactData.phone}
                            onChange={handleContactChange}
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="employeeCount">Company Size *</Label>
                        <Input
                          id="employeeCount"
                          name="employeeCount"
                          placeholder="e.g., 50-200 employees"
                          value={contactData.employeeCount}
                          onChange={handleContactChange}
                          required
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">How can we help?</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us about your hiring needs..."
                          rows={3}
                          value={contactData.message}
                          onChange={handleContactChange}
                          disabled={isLoading}
                        />
                      </div>

                      <Button type="submit" className="w-full" variant="gradient" disabled={isLoading}>
                        {isLoading ? "Submitting..." : (
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
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
