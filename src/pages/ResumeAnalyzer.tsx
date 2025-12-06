import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Loader2, Sparkles, CheckCircle, ArrowLeft, X, TrendingUp, AlertCircle } from "lucide-react";

interface ResumeAnalysis {
  overallScore: number;
  categories: {
    name: string;
    score: number;
    feedback: string;
  }[];
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
      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: {
          resumeUrl: urlToAnalyze,
          jobProfile: profile?.job_profile || 'General',
          experienceLevel: profile?.experience_level || 'fresher'
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

                  {/* Category Breakdown */}
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