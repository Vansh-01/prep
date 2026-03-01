import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { JobPosting } from "./JobListings";

interface EditJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: JobPosting;
  onJobUpdated: () => void;
}

const JOB_TYPES = [
  { value: "full-time", label: "Full-Time" },
  { value: "part-time", label: "Part-Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "remote", label: "Remote" },
];

const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "lead", label: "Lead / Manager" },
];

export default function EditJobDialog({
  open,
  onOpenChange,
  job,
  onJobUpdated,
}: EditJobDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    job_type: "full-time",
    experience_level: "entry",
    salary_min: "",
    salary_max: "",
    skills: [] as string[],
  });

  useEffect(() => {
    if (open && job) {
      setForm({
        title: job.title,
        description: job.description,
        location: job.location,
        job_type: job.job_type,
        experience_level: job.experience_level,
        salary_min: job.salary_min?.toString() ?? "",
        salary_max: job.salary_max?.toString() ?? "",
        skills: job.skills ?? [],
      });
      setSkillInput("");
    }
  }, [open, job]);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !form.skills.includes(trimmed) && form.skills.length < 15) {
      setForm({ ...form, skills: [...form.skills, trimmed] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim() || !form.location.trim()) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    const salaryMin = form.salary_min ? parseInt(form.salary_min) : null;
    const salaryMax = form.salary_max ? parseInt(form.salary_max) : null;

    if (salaryMin !== null && salaryMax !== null && salaryMin > salaryMax) {
      toast({ title: "Invalid salary range", description: "Minimum salary cannot be greater than maximum.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase
      .from("job_postings")
      .update({
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        job_type: form.job_type,
        experience_level: form.experience_level,
        salary_min: salaryMin,
        salary_max: salaryMax,
        skills: form.skills,
      })
      .eq("id", job.id);

    if (error) {
      toast({ title: "Error", description: "Failed to update job posting.", variant: "destructive" });
    } else {
      toast({ title: "Job updated!", description: "Your job listing has been updated successfully." });
      onOpenChange(false);
      onJobUpdated();
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Job Posting</DialogTitle>
          <DialogDescription>Update your job listing details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-job-title">Job Title *</Label>
            <Input id="edit-job-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={200} required disabled={isSubmitting} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-job-location">Location *</Label>
            <Input id="edit-job-location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} maxLength={200} required disabled={isSubmitting} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Job Type</Label>
              <Select value={form.job_type} onValueChange={(v) => setForm({ ...form, job_type: v })} disabled={isSubmitting}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map((t) => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Experience Level</Label>
              <Select value={form.experience_level} onValueChange={(v) => setForm({ ...form, experience_level: v })} disabled={isSubmitting}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((l) => (<SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-salary-min">Min Salary (optional)</Label>
              <Input id="edit-salary-min" type="number" value={form.salary_min} onChange={(e) => setForm({ ...form, salary_min: e.target.value })} min={0} disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-salary-max">Max Salary (optional)</Label>
              <Input id="edit-salary-max" type="number" value={form.salary_max} onChange={(e) => setForm({ ...form, salary_max: e.target.value })} min={0} disabled={isSubmitting} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Skills (optional)</Label>
            <div className="flex gap-2">
              <Input placeholder="Type a skill and press Enter" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleSkillKeyDown} maxLength={50} disabled={isSubmitting} />
              <Button type="button" variant="outline" size="icon" onClick={addSkill} disabled={isSubmitting || !skillInput.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {form.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="ml-1 hover:text-destructive"><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-job-description">Description *</Label>
            <Textarea id="edit-job-description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={6} maxLength={5000} required disabled={isSubmitting} />
            <p className="text-xs text-muted-foreground text-right">{form.description.length}/5000</p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
