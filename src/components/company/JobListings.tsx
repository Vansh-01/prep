import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Briefcase,
  MapPin,
  Clock,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Plus,
  Pencil,
} from "lucide-react";
import EditJobDialog from "./EditJobDialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export interface JobPosting {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  experience_level: string;
  salary_min: number | null;
  salary_max: number | null;
  skills: string[];
  status: string;
  created_at: string;
}

const TYPE_LABELS: Record<string, string> = {
  "full-time": "Full-Time",
  "part-time": "Part-Time",
  contract: "Contract",
  internship: "Internship",
  remote: "Remote",
};

const LEVEL_LABELS: Record<string, string> = {
  entry: "Entry Level",
  mid: "Mid Level",
  senior: "Senior Level",
  lead: "Lead / Manager",
};

interface JobListingsProps {
  jobs: JobPosting[];
  onRefresh: () => void;
  onCreateClick: () => void;
}

export default function JobListings({ jobs, onRefresh, onCreateClick }: JobListingsProps) {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);

  const handleToggleStatus = async (job: JobPosting) => {
    setTogglingId(job.id);
    const newStatus = job.status === "active" ? "paused" : "active";

    const { error } = await supabase
      .from("job_postings")
      .update({ status: newStatus })
      .eq("id", job.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update job status.",
        variant: "destructive",
      });
    } else {
      toast({
        title: newStatus === "active" ? "Job activated" : "Job paused",
        description: `"${job.title}" is now ${newStatus}.`,
      });
      onRefresh();
    }
    setTogglingId(null);
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    const { error } = await supabase
      .from("job_postings")
      .delete()
      .eq("id", deletingId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete job posting.",
        variant: "destructive",
      });
    } else {
      toast({ title: "Job deleted", description: "The job posting has been removed." });
      onRefresh();
    }
    setDeletingId(null);
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return null;
    const fmt = (n: number) =>
      n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    return `Up to ${fmt(max!)}`;
  };

  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-16">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No job postings yet</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Create your first job listing to start attracting candidates
          </p>
          <Button onClick={onCreateClick} className="gap-2">
            <Plus className="h-4 w-4" />
            Post Your First Job
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card
            key={job.id}
            className={`border-l-4 ${
              job.status === "active" ? "border-l-primary" : "border-l-muted-foreground/30"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <Badge
                      variant={job.status === "active" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {job.status === "active" ? "Active" : "Paused"}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {TYPE_LABELS[job.job_type] || job.job_type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(job.created_at), "MMM d, yyyy")}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingJob(job)}
                    title="Edit listing"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleStatus(job)}
                    disabled={togglingId === job.id}
                    title={job.status === "active" ? "Pause listing" : "Activate listing"}
                  >
                    {job.status === "active" ? (
                      <ToggleRight className="h-5 w-5 text-primary" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingId(job.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{LEVEL_LABELS[job.experience_level] || job.experience_level}</Badge>
                {formatSalary(job.salary_min, job.salary_max) && (
                  <Badge variant="outline">{formatSalary(job.salary_min, job.salary_max)}</Badge>
                )}
              </div>
              {job.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {job.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete job posting?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The job listing will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
