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
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  const STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "shortlisted", label: "Shortlisted" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-muted text-muted-foreground",
    shortlisted: "bg-primary/10 text-primary border-primary/20",
    accepted: "bg-green-500/10 text-green-700 border-green-500/20",
    rejected: "bg-destructive/10 text-destructive border-destructive/20",
  };

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

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    setUpdatingId(applicationId);
    const { error } = await supabase
      .from("job_applications")
      .update({ status: newStatus })
      .eq("id", applicationId);

    if (error) {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    } else {
      setApplicants((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: newStatus } : a))
      );
      toast({ title: "Status updated", description: `Application marked as ${newStatus}.` });
    }
    setUpdatingId(null);
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
          className="flex flex-col gap-3 p-4 rounded-lg border bg-card"
        >
          <div className="flex items-center gap-3">
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
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Status:</span>
            <Select
              value={applicant.status}
              onValueChange={(val) => handleStatusChange(applicant.id, val)}
              disabled={updatingId === applicant.id}
            >
              <SelectTrigger className={`w-[140px] h-8 text-xs ${statusColors[applicant.status] || ""}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}
    </div>
  );
}
