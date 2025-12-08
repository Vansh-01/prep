import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Loader2, Sparkles, CheckCircle, ArrowLeft, X, TrendingUp, AlertCircle, Shield, Target, Zap, Tag, Briefcase, ClipboardList } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ATSAnalysis {
  score: number;
  status: "excellent" | "good" | "needs_work" | "poor";
  parsingIssues: string[];
  missingKeywords: string[];
  foundKeywords: string[];
  recommendations: string[];
}

interface IndustryInsights {
  industry: string;
  relevanceScore: number;
  keySkillsForIndustry: string[];
  industryTrends: string[];
  competitiveAdvantages: string[];
  gapsToAddress: string[];
}

interface JobMatch {
  matchScore: number;
  matchedRequirements: string[];
  missingRequirements: string[];
  keywordMatches: string[];
  keywordGaps: string[];
  tailoringTips: string[];
}

interface ResumeAnalysis {
  overallScore: number;
  categories: {
    name: string;
    score: number;
    feedback: string;
  }[];
  atsAnalysis: ATSAnalysis;
  industryInsights: IndustryInsights;
  jobMatch?: JobMatch;
  strengths: string[];
  improvements: string[];
  summary: string;
}

const ResumeAnalyzer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [profile, setProfile] = useState<{ job_profile: string | null; experience_level: string | null } | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [showJobDescription, setShowJobDescription] = useState(false);
  const [jobDescFile, setJobDescFile] = useState<File | null>(null);
  const [jobDescDragOver, setJobDescDragOver] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to use the Resume Analyzer.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("job_profile, experience_level, resume_url")
        .eq("id", session.user.id)
        .single();

      if (data) {
        setProfile({ job_profile: data.job_profile, experience_level: data.experience_level });
        if (data.resume_url) {
          setResumeUrl(data.resume_url);
        }
      }
    };

    checkAuthAndLoadProfile();
  }, [navigate, toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  }, []);

  const validateAndSetFile = (selectedFile: File) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, DOC, or DOCX file.",
        variant: "destructive",
      });
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    setAnalysis(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const uploadAndAnalyze = async () => {
    if (!file) return;

    setUploading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to upload your resume.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${session.user.id}/resume.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      setResumeUrl(publicUrl);

      await supabase
        .from('profiles')
        .update({ resume_url: publicUrl })
        .eq('id', session.user.id);

      toast({
        title: "Resume Uploaded",
        description: "Your resume has been uploaded successfully. Starting analysis...",
      });

      setUploading(false);
      analyzeResume(publicUrl);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload resume.",
        variant: "destructive",
      });
      setUploading(false);
    }
  };

  const analyzeResume = async (url?: string) => {
    const urlToAnalyze = url || resumeUrl;
    if (!urlToAnalyze) {
      toast({
        title: "No Resume",
        description: "Please upload a resume first.",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    setAnalysis(null);

    try {
      // If job description file is uploaded, read its content
      let jobDescText = jobDescription.trim();
      if (jobDescFile && !jobDescText) {
        if (jobDescFile.type === 'text/plain') {
          jobDescText = await jobDescFile.text();
        } else {
          // For PDF/DOC files, convert to base64 and send to backend
          const reader = new FileReader();
          const base64Content = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(jobDescFile);
          });
          
          const { data, error } = await supabase.functions.invoke('analyze-resume', {
            body: {
              resumeUrl: urlToAnalyze,
              jobProfile: profile?.job_profile || 'General',
              experienceLevel: profile?.experience_level || 'fresher',
              jobDescriptionFile: base64Content,
              jobDescriptionFileName: jobDescFile.name
            }
          });

          if (error) throw error;
          setAnalysis(data.analysis);
          toast({
            title: "Analysis Complete",
            description: "Your resume has been analyzed successfully!",
          });
          setAnalyzing(false);
          return;
        }
      }

      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: {
          resumeUrl: urlToAnalyze,
          jobProfile: profile?.job_profile || 'General',
          experienceLevel: profile?.experience_level || 'fresher',
          jobDescription: jobDescText || undefined
        }
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed successfully!",
      });
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze resume.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setAnalysis(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getATSStatusColor = (status: ATSAnalysis["status"]) => {
    switch (status) {
      case "excellent": return "bg-green-500";
      case "good": return "bg-yellow-500";
      case "needs_work": return "bg-orange-500";
      case "poor": return "bg-red-500";
    }
  };

  const getATSStatusLabel = (status: ATSAnalysis["status"]) => {
    switch (status) {
      case "excellent": return "ATS Ready";
      case "good": return "Good Compatibility";
      case "needs_work": return "Needs Optimization";
      case "poor": return "Poor Compatibility";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/interview-mode")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Practice Modes
          </Button>

          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Resume Analyzer</h1>
            <p className="text-muted-foreground">
              Get AI-powered feedback to make your resume stand out
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            {/* Upload Section */}
            <Card className="h-fit lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Resume
                </CardTitle>
                <CardDescription>
                  Drag and drop your resume or click to browse
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`
                    border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
                    ${isDragOver 
                      ? 'border-primary bg-primary/5 scale-[1.02]' 
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }
                    ${file ? 'border-green-500 bg-green-500/5' : ''}
                  `}
                  onClick={() => document.getElementById('resume-input')?.click()}
                >
                  <input
                    id="resume-input"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {file ? (
                    <div className="space-y-2">
                      <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearFile();
                        }}
                        className="mt-2"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
                      <p className="font-medium">Drop your resume here</p>
                      <p className="text-sm text-muted-foreground">
                        PDF, DOC, or DOCX (max 5MB)
                      </p>
                    </div>
                  )}
                </div>

                {file && (
                  <Button
                    onClick={uploadAndAnalyze}
                    disabled={uploading || analyzing}
                    className="w-full"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Upload & Analyze
                      </>
                    )}
                  </Button>
                )}

                {!file && resumeUrl && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="text-sm">Previous resume on file</span>
                    </div>
                    <Button
                      onClick={() => analyzeResume()}
                      disabled={analyzing}
                      className="w-full"
                    >
                      {analyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Analyze Existing Resume
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Job Description Section */}
            <Card className="h-fit lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Briefcase className="w-5 h-5" />
                  Job Description (Optional)
                </CardTitle>
                <CardDescription>
                  Upload a file or paste text for tailored matching
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Collapsible open={showJobDescription} onOpenChange={setShowJobDescription}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <ClipboardList className="w-4 h-4" />
                        {jobDescription || jobDescFile ? "Edit Job Description" : "Add Job Description"}
                      </span>
                      {(jobDescription || jobDescFile) && (
                        <Badge variant="secondary" className="ml-2">Added</Badge>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 space-y-4">
                    {/* File Upload Option */}
                    <div
                      onDragOver={(e) => { e.preventDefault(); setJobDescDragOver(true); }}
                      onDragLeave={(e) => { e.preventDefault(); setJobDescDragOver(false); }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setJobDescDragOver(false);
                        const droppedFile = e.dataTransfer.files[0];
                        if (droppedFile) {
                          const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
                          if (!allowedTypes.includes(droppedFile.type)) {
                            toast({
                              title: "Invalid File Type",
                              description: "Please upload a PDF, DOC, DOCX, or TXT file.",
                              variant: "destructive",
                            });
                            return;
                          }
                          if (droppedFile.size > 2 * 1024 * 1024) {
                            toast({
                              title: "File Too Large",
                              description: "Please upload a file smaller than 2MB.",
                              variant: "destructive",
                            });
                            return;
                          }
                          setJobDescFile(droppedFile);
                          setJobDescription("");
                        }
                      }}
                      onClick={() => document.getElementById('job-desc-input')?.click()}
                      className={`
                        border-2 border-dashed rounded-lg p-4 text-center transition-all cursor-pointer
                        ${jobDescDragOver 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }
                        ${jobDescFile ? 'border-green-500 bg-green-500/5' : ''}
                      `}
                    >
                      <input
                        id="job-desc-input"
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => {
                          const selectedFile = e.target.files?.[0];
                          if (selectedFile) {
                            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
                            if (!allowedTypes.includes(selectedFile.type)) {
                              toast({
                                title: "Invalid File Type",
                                description: "Please upload a PDF, DOC, DOCX, or TXT file.",
                                variant: "destructive",
                              });
                              return;
                            }
                            if (selectedFile.size > 2 * 1024 * 1024) {
                              toast({
                                title: "File Too Large",
                                description: "Please upload a file smaller than 2MB.",
                                variant: "destructive",
                              });
                              return;
                            }
                            setJobDescFile(selectedFile);
                            setJobDescription("");
                          }
                        }}
                        className="hidden"
                      />
                      {jobDescFile ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-green-500" />
                            <span className="text-sm font-medium truncate max-w-[150px]">{jobDescFile.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setJobDescFile(null);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <Upload className="w-6 h-6 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Drop file or click (PDF, DOC, TXT)
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">or paste text</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>

                    <Textarea
                      placeholder="Paste the job description here..."
                      value={jobDescription}
                      onChange={(e) => {
                        setJobDescription(e.target.value);
                        if (e.target.value) setJobDescFile(null);
                      }}
                      className="min-h-[120px] resize-y"
                      maxLength={5000}
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{jobDescription.length}/5000 characters</span>
                      {(jobDescription || jobDescFile) && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setJobDescription("");
                            setJobDescFile(null);
                          }}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Clear All
                        </Button>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>

            {/* Analysis Section */}
            <div className="lg:col-span-3 space-y-6">
              {analyzing ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="text-lg font-medium">Analyzing your resume...</p>
                    <p className="text-sm text-muted-foreground">This may take a moment</p>
                  </CardContent>
                </Card>
              ) : analysis ? (
                <>
                  {/* Overall Score Card */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <span>Overall Score</span>
                        <span className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                          {analysis.overallScore}
                        </span>
                      </CardTitle>
                      <CardDescription>{analysis.summary}</CardDescription>
                    </CardHeader>
                  </Card>

                  {/* Tabbed Analysis Sections */}
                  <Tabs defaultValue="breakdown" className="w-full">
                    <TabsList className={`grid w-full ${analysis.jobMatch ? 'grid-cols-4' : 'grid-cols-3'}`}>
                      <TabsTrigger value="breakdown" className="flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4" />
                        <span className="hidden sm:inline">Breakdown</span>
                      </TabsTrigger>
                      <TabsTrigger value="ats" className="flex items-center gap-1.5">
                        <Shield className="w-4 h-4" />
                        <span className="hidden sm:inline">ATS</span>
                      </TabsTrigger>
                      <TabsTrigger value="industry" className="flex items-center gap-1.5">
                        <Target className="w-4 h-4" />
                        <span className="hidden sm:inline">Industry</span>
                      </TabsTrigger>
                      {analysis.jobMatch && (
                        <TabsTrigger value="jobmatch" className="flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4" />
                          <span className="hidden sm:inline">Job Match</span>
                        </TabsTrigger>
                      )}
                    </TabsList>

                    {/* Score Breakdown Tab */}
                    <TabsContent value="breakdown" className="space-y-4 mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Score Breakdown
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {analysis.categories.map((category, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{category.name}</span>
                                <span className={`font-bold ${getScoreColor(category.score)}`}>
                                  {category.score}/100
                                </span>
                              </div>
                              <div className="relative">
                                <Progress value={category.score} className="h-2" />
                                <div 
                                  className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(category.score)}`}
                                  style={{ width: `${category.score}%` }}
                                />
                              </div>
                              <p className="text-sm text-muted-foreground">{category.feedback}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Strengths & Improvements */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="w-5 h-5" />
                              Strengths
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {analysis.strengths.map((strength, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-amber-600">
                              <AlertCircle className="w-5 h-5" />
                              Improvements
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {analysis.improvements.map((improvement, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <AlertCircle className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" />
                                  {improvement}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    {/* ATS Check Tab */}
                    <TabsContent value="ats" className="space-y-4 mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Shield className="w-5 h-5" />
                              ATS Compatibility
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={`${getATSStatusColor(analysis.atsAnalysis.status)} text-white`}>
                                {getATSStatusLabel(analysis.atsAnalysis.status)}
                              </Badge>
                              <span className={`text-2xl font-bold ${getScoreColor(analysis.atsAnalysis.score)}`}>
                                {analysis.atsAnalysis.score}%
                              </span>
                            </div>
                          </CardTitle>
                          <CardDescription>
                            How well your resume will perform with Applicant Tracking Systems
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Keywords Section */}
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-3">
                              <h4 className="font-medium flex items-center gap-2 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                Keywords Found
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {analysis.atsAnalysis.foundKeywords.map((keyword, index) => (
                                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    <Tag className="w-3 h-3 mr-1" />
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-3">
                              <h4 className="font-medium flex items-center gap-2 text-red-600">
                                <AlertCircle className="w-4 h-4" />
                                Missing Keywords
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {analysis.atsAnalysis.missingKeywords.map((keyword, index) => (
                                  <Badge key={index} variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                    <Tag className="w-3 h-3 mr-1" />
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Parsing Issues */}
                          {analysis.atsAnalysis.parsingIssues.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="font-medium flex items-center gap-2 text-amber-600">
                                <AlertCircle className="w-4 h-4" />
                                Potential Parsing Issues
                              </h4>
                              <ul className="space-y-2">
                                {analysis.atsAnalysis.parsingIssues.map((issue, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <X className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" />
                                    {issue}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Recommendations */}
                          <div className="space-y-3">
                            <h4 className="font-medium flex items-center gap-2">
                              <Zap className="w-4 h-4 text-primary" />
                              ATS Optimization Tips
                            </h4>
                            <ul className="space-y-2">
                              {analysis.atsAnalysis.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <Sparkles className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Industry Insights Tab */}
                    <TabsContent value="industry" className="space-y-4 mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Target className="w-5 h-5" />
                              {analysis.industryInsights.industry} Insights
                            </div>
                            <span className={`text-2xl font-bold ${getScoreColor(analysis.industryInsights.relevanceScore)}`}>
                              {analysis.industryInsights.relevanceScore}%
                            </span>
                          </CardTitle>
                          <CardDescription>
                            Industry-specific analysis for your target role
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="relative">
                            <Progress value={analysis.industryInsights.relevanceScore} className="h-3" />
                            <div 
                              className={`absolute top-0 left-0 h-3 rounded-full transition-all ${getProgressColor(analysis.industryInsights.relevanceScore)}`}
                              style={{ width: `${analysis.industryInsights.relevanceScore}%` }}
                            />
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            {/* Key Skills */}
                            <div className="space-y-3">
                              <h4 className="font-medium flex items-center gap-2">
                                <Zap className="w-4 h-4 text-primary" />
                                Key Skills for This Industry
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {analysis.industryInsights.keySkillsForIndustry.map((skill, index) => (
                                  <Badge key={index} variant="outline" className="border-primary/50">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Industry Trends */}
                            <div className="space-y-3">
                              <h4 className="font-medium flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-blue-500" />
                                Current Industry Trends
                              </h4>
                              <ul className="space-y-1">
                                {analysis.industryInsights.industryTrends.map((trend, index) => (
                                  <li key={index} className="text-sm text-muted-foreground">
                                    • {trend}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            {/* Competitive Advantages */}
                            <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2 text-green-700 dark:text-green-400">
                                  <CheckCircle className="w-4 h-4" />
                                  Your Competitive Advantages
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2">
                                  {analysis.industryInsights.competitiveAdvantages.map((adv, index) => (
                                    <li key={index} className="text-sm flex items-start gap-2">
                                      <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                                      {adv}
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>

                            {/* Gaps to Address */}
                            <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2 text-amber-700 dark:text-amber-400">
                                  <AlertCircle className="w-4 h-4" />
                                  Gaps to Address
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2">
                                  {analysis.industryInsights.gapsToAddress.map((gap, index) => (
                                    <li key={index} className="text-sm flex items-start gap-2">
                                      <AlertCircle className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" />
                                      {gap}
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Job Match Tab */}
                    {analysis.jobMatch && (
                      <TabsContent value="jobmatch" className="space-y-4 mt-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Briefcase className="w-5 h-5" />
                                Job Description Match
                              </div>
                              <span className={`text-2xl font-bold ${getScoreColor(analysis.jobMatch.matchScore)}`}>
                                {analysis.jobMatch.matchScore}%
                              </span>
                            </CardTitle>
                            <CardDescription>
                              How well your resume matches the job requirements
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="relative">
                              <Progress value={analysis.jobMatch.matchScore} className="h-3" />
                              <div 
                                className={`absolute top-0 left-0 h-3 rounded-full transition-all ${getProgressColor(analysis.jobMatch.matchScore)}`}
                                style={{ width: `${analysis.jobMatch.matchScore}%` }}
                              />
                            </div>

                            {/* Keywords Match */}
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-3">
                                <h4 className="font-medium flex items-center gap-2 text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                  Matched Keywords
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {analysis.jobMatch.keywordMatches.map((keyword, index) => (
                                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                      <Tag className="w-3 h-3 mr-1" />
                                      {keyword}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-3">
                                <h4 className="font-medium flex items-center gap-2 text-red-600">
                                  <AlertCircle className="w-4 h-4" />
                                  Missing Keywords
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {analysis.jobMatch.keywordGaps.map((keyword, index) => (
                                    <Badge key={index} variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                      <Tag className="w-3 h-3 mr-1" />
                                      {keyword}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Requirements Match */}
                            <div className="grid gap-4 sm:grid-cols-2">
                              <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base flex items-center gap-2 text-green-700 dark:text-green-400">
                                    <CheckCircle className="w-4 h-4" />
                                    Met Requirements
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <ul className="space-y-2">
                                    {analysis.jobMatch.matchedRequirements.map((req, index) => (
                                      <li key={index} className="text-sm flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                                        {req}
                                      </li>
                                    ))}
                                  </ul>
                                </CardContent>
                              </Card>

                              <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base flex items-center gap-2 text-red-700 dark:text-red-400">
                                    <AlertCircle className="w-4 h-4" />
                                    Missing Requirements
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <ul className="space-y-2">
                                    {analysis.jobMatch.missingRequirements.map((req, index) => (
                                      <li key={index} className="text-sm flex items-start gap-2">
                                        <X className="w-4 h-4 mt-0.5 text-red-500 shrink-0" />
                                        {req}
                                      </li>
                                    ))}
                                  </ul>
                                </CardContent>
                              </Card>
                            </div>

                            {/* Tailoring Tips */}
                            <div className="space-y-3">
                              <h4 className="font-medium flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                Resume Tailoring Tips
                              </h4>
                              <ul className="space-y-2">
                                {analysis.jobMatch.tailoringTips.map((tip, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm p-2 bg-muted rounded-lg">
                                    <Zap className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    )}
                  </Tabs>
                </>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16 space-y-2 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground/50" />
                    <p className="text-lg text-muted-foreground">No analysis yet</p>
                    <p className="text-sm text-muted-foreground">
                      Upload a resume to get AI-powered feedback with detailed scoring
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Tips Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Tips for a Great Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                  Use action verbs to describe achievements
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                  Quantify your accomplishments with numbers
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                  Tailor your resume for each job application
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                  Keep it concise and well-formatted
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;