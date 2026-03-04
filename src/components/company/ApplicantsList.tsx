import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Applicant {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  profile: {
    username: string | null;
    experience_level: string | null;
    job_profile: string | null;
    resume_url: string | null;
  } | null;
}

interface ApplicantsListProps {
  jobId: string;
}

export default function ApplicantsList({ jobId }: ApplicantsListProps) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("job_applications")
      .select("id, user_id, status, created_at")
      .eq("job_id", jobId)
      .order("created_at", { ascending: false });

    if (error || !data) {
      setLoading(false);
      return;
    }

    // Fetch profiles for each applicant
    const userIds = data.map((a) => a.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, experience_level, job_profile, resume_url")
      .in("id", userIds);

    const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

    const enriched: Applicant[] = data.map((app) => ({
      ...app,
      profile: profileMap.get(app.user_id) || null,
    }));

    setApplicants(enriched);
    setLoading(false);
  };

  const handleViewResume = async (resumeUrl: string) => {
    // resumeUrl is the storage path like "user-id/filename.pdf"
    const { data } = await supabase.storage
      .from("resumes")
      .createSignedUrl(resumeUrl, 300); // 5 min signed URL

    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
  };

  const formatJobProfile = (profile: string | null) => {
    if (!profile) return null;
    if (profile.startsWith("other:")) return profile.replace("other:", "");
    return profile;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (applicants.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-muted-foreground">
        No applications yet for this position.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-muted-foreground">
        {applicants.length} applicant{applicants.length !== 1 ? "s" : ""}
      </p>
      {applicants.map((applicant) => (
        <div
          key={applicant.id}
          className="flex items-center gap-4 p-3 rounded-lg border bg-card"
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {(applicant.profile?.username || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {applicant.profile?.username || "Anonymous User"}
            </p>
            <div className="flex items-center gap-2 flex-wrap mt-0.5">
              {applicant.profile?.experience_level && (
                <Badge variant="outline" className="text-xs">
                  {applicant.profile.experience_level === "fresher" ? "Fresher" : "Experienced"}
                </Badge>
              )}
              {formatJobProfile(applicant.profile?.job_profile ?? null) && (
                <Badge variant="secondary" className="text-xs">
                  {formatJobProfile(applicant.profile?.job_profile ?? null)}
                </Badge>
              )}
              <Badge
                variant={applicant.status === "pending" ? "outline" : "default"}
                className="text-xs"
              >
                {applicant.status}
              </Badge>
            </div>
          </div>

          {applicant.profile?.resume_url && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 shrink-0"
              onClick={() => handleViewResume(applicant.profile!.resume_url!)}
            >
              <FileText className="h-3.5 w-3.5" />
              Resume
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
