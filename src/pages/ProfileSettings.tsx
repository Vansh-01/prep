import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Upload, FileText, Save, User, Sparkles, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  username: string | null;
  avatar_url: string | null;
  experience_level: string | null;
  job_profile: string | null;
  resume_url: string | null;
}

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [customJobProfile, setCustomJobProfile] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    avatar_url: "",
    experience_level: "",
    job_profile: ""
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeAnalysis, setResumeAnalysis] = useState<string | null>(null);

  useEffect(() => {
    checkAuthAndFetchProfile();
  }, []);

  const checkAuthAndFetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("username, avatar_url, experience_level, job_profile, resume_url")
      .eq("id", session.user.id)
      .maybeSingle();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (data) {
      setProfile(data);
      
      const jobProfile = data.job_profile || "";
      if (jobProfile.startsWith("other:")) {
        setCustomJobProfile(jobProfile.replace("other:", ""));
      }
      
      setFormData({
        username: data.username || "",
        avatar_url: data.avatar_url || "",
        experience_level: data.experience_level || "",
        job_profile: jobProfile
      });
    }
    
    setLoading(false);
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Resume must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setResumeFile(file);
    }
  };

  const handleSave = async () => {
    if (!formData.experience_level) {
      toast({
        title: "Experience Level Required",
        description: "Please select your experience level",
        variant: "destructive",
      });
      return;
    }

    if (!formData.job_profile) {
      toast({
        title: "Job Profile Required",
        description: "Please select your target job profile",
        variant: "destructive",
      });
      return;
    }

    if ((formData.job_profile === "other" || formData.job_profile.startsWith("other:")) && !customJobProfile.trim()) {
      toast({
        title: "Job Profile Required",
        description: "Please specify your job profile",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    let resumeUrl = profile?.resume_url || null;

    if (resumeFile) {
      setUploadingResume(true);
      const fileExt = resumeFile.name.split('.').pop();
      const filePath = `${session.user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, resumeFile);

      if (uploadError) {
        toast({
          title: "Upload Error",
          description: "Failed to upload resume",
          variant: "destructive",
        });
        setSaving(false);
        setUploadingResume(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);
      
      resumeUrl = urlData.publicUrl;
      setUploadingResume(false);
    }

    const finalJobProfile = formData.job_profile === "other" 
      ? `other:${customJobProfile.trim()}` 
      : formData.job_profile;

    const { error } = await supabase
      .from("profiles")
      .update({
        username: formData.username.trim() || null,
        avatar_url: formData.avatar_url.trim() || null,
        experience_level: formData.experience_level,
        job_profile: finalJobProfile,
        resume_url: resumeUrl
      })
      .eq("id", session.user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      setSaving(false);
      return;
    }

    setProfile({
      ...profile,
      username: formData.username.trim() || null,
      avatar_url: formData.avatar_url.trim() || null,
      experience_level: formData.experience_level,
      job_profile: finalJobProfile,
      resume_url: resumeUrl
    });

    setResumeFile(null);
    setSaving(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully",
    });
  };

  const handleAnalyzeResume = async () => {
    if (!profile?.resume_url) {
      toast({
        title: "No Resume",
        description: "Please upload a resume first",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    setResumeAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: {
          resumeUrl: profile.resume_url,
          jobProfile: formData.job_profile,
          experienceLevel: formData.experience_level
        }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setResumeAnalysis(data.analysis);
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed successfully",
      });
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze resume",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const getJobProfileDisplayValue = () => {
    if (formData.job_profile.startsWith("other:")) return "other";
    return formData.job_profile;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link to="/interview-mode">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">Profile Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account information</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 sm:px-6 lg:px-8 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your profile to personalize your interview practice experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            {/* Avatar URL */}
            <div className="space-y-2">
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <Input
                id="avatar_url"
                placeholder="https://example.com/avatar.jpg"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Enter a URL to your profile picture
              </p>
            </div>

            {/* Experience Level */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Experience Level *</Label>
              <RadioGroup
                value={formData.experience_level}
                onValueChange={(value) => setFormData({ ...formData, experience_level: value })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fresher" id="fresher" />
                  <Label htmlFor="fresher" className="cursor-pointer">Fresher / Entry Level</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="experienced" id="experienced" />
                  <Label htmlFor="experienced" className="cursor-pointer">Experienced Professional</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Job Profile */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Target Job Profile *</Label>
              <Select
                value={getJobProfileDisplayValue()}
                onValueChange={(value) => {
                  if (value === "other") {
                    setFormData({ ...formData, job_profile: "other" });
                  } else {
                    setFormData({ ...formData, job_profile: value });
                    setCustomJobProfile("");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your target role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="software_engineer">Software Engineer</SelectItem>
                  <SelectItem value="data_analyst">Data Analyst</SelectItem>
                  <SelectItem value="data_scientist">Data Scientist</SelectItem>
                  <SelectItem value="product_manager">Product Manager</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {(formData.job_profile === "other" || formData.job_profile.startsWith("other:")) && (
                <Input
                  placeholder="Please specify your job profile"
                  value={customJobProfile}
                  onChange={(e) => setCustomJobProfile(e.target.value)}
                  className="mt-2"
                  maxLength={100}
                />
              )}
            </div>

            {/* Resume Upload */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Resume</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  {resumeFile ? (
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <FileText className="w-5 h-5" />
                      <span className="font-medium">{resumeFile.name}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload your resume (PDF, DOC, DOCX)
                      </p>
                      <p className="text-xs text-muted-foreground">Max size: 5MB</p>
                    </div>
                  )}
                </label>
              </div>
              {profile?.resume_url && !resumeFile && (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Resume already uploaded
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAnalyzeResume}
                    disabled={analyzing}
                    className="gap-2"
                  >
                    {analyzing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    {analyzing ? "Analyzing..." : "AI Analysis"}
                  </Button>
                </div>
              )}
            </div>

            {/* Resume Analysis Results */}
            {resumeAnalysis && (
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    AI Resume Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                      {resumeAnalysis}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Save Button */}
            <div className="pt-4">
              <Button 
                onClick={handleSave} 
                disabled={saving || uploadingResume}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {uploadingResume ? "Uploading..." : saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
