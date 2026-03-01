import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ProfileSettings from "./pages/ProfileSettings";
import InterviewMode from "./pages/InterviewMode";
import InterviewPractice from "./pages/InterviewPractice";
import CodingPractice from "./pages/CodingPractice";
import CodingChallenge from "./pages/CodingChallenge";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Leaderboard from "./pages/Leaderboard";
import ProgressDashboard from "./pages/ProgressDashboard";
import CompanyAuth from "./pages/CompanyAuth";
import CompanyDashboard from "./pages/CompanyDashboard";
import JobBoard from "./pages/JobBoard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/interview-mode" element={<InterviewMode />} />
          <Route path="/interview-practice" element={<InterviewPractice />} />
          <Route path="/coding-practice" element={<CodingPractice />} />
          <Route path="/coding-challenge" element={<CodingChallenge />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/progress" element={<ProgressDashboard />} />
          <Route path="/for-companies" element={<CompanyAuth />} />
          <Route path="/company-dashboard" element={<CompanyDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
