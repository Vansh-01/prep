import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Briefcase,
  MapPin,
  Clock,
  Search,
  ArrowLeft,
  DollarSign,
  Building2,
} from "lucide-react";
import { format } from "date-fns";

interface JobWithCompany {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  experience_level: string;
  salary_min: number | null;
  salary_max: number | null;
  skills: string[];
  created_at: string;
  company_profiles: { company_name: string } | null;
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

const formatSalary = (min: number | null, max: number | null) => {
  if (!min && !max) return null;
  const fmt = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`);
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
};

export default function JobBoard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobWithCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<JobWithCompany | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      fetchJobs();
    };
    checkAuth();
  }, [navigate]);

  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("job_postings")
      .select("id, title, description, location, job_type, experience_level, salary_min, salary_max, skills, created_at, company_profiles(company_name)")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setJobs(data as unknown as JobWithCompany[]);
    }
    setLoading(false);
  };

  const filtered = jobs.filter((job) => {
    const matchesSearch =
      !search ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase()) ||
      job.skills?.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === "all" || job.job_type === typeFilter;
    const matchesLevel = levelFilter === "all" || job.experience_level === levelFilter;
    return matchesSearch && matchesType && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/interview-mode")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Job Board</h1>
            <p className="text-sm text-muted-foreground">Browse open positions from top companies</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, skill, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="full-time">Full-Time</SelectItem>
              <SelectItem value="part-time">Part-Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
            </SelectContent>
          </Select>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="entry">Entry Level</SelectItem>
              <SelectItem value="mid">Mid Level</SelectItem>
              <SelectItem value="senior">Senior Level</SelectItem>
              <SelectItem value="lead">Lead / Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-16 text-muted-foreground">Loading jobs...</div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{filtered.length} position{filtered.length !== 1 ? "s" : ""} found</p>
            {filtered.map((job) => (
              <Card
                key={job.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedJob(job)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription className="flex items-center gap-3 mt-1 flex-wrap">
                        {job.company_profiles?.company_name && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {job.company_profiles.company_name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(job.created_at), "MMM d, yyyy")}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{TYPE_LABELS[job.job_type] || job.job_type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{LEVEL_LABELS[job.experience_level] || job.experience_level}</Badge>
                    {formatSalary(job.salary_min, job.salary_max) && (
                      <Badge variant="secondary" className="gap-1">
                        <DollarSign className="h-3 w-3" />
                        {formatSalary(job.salary_min, job.salary_max)}
                      </Badge>
                    )}
                  </div>
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Job Detail Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedJob.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-3 flex-wrap pt-1">
                  {selectedJob.company_profiles?.company_name && (
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" />
                      {selectedJob.company_profiles.company_name}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {selectedJob.location}
                  </span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="flex flex-wrap gap-2">
                  <Badge>{TYPE_LABELS[selectedJob.job_type] || selectedJob.job_type}</Badge>
                  <Badge variant="secondary">{LEVEL_LABELS[selectedJob.experience_level] || selectedJob.experience_level}</Badge>
                  {formatSalary(selectedJob.salary_min, selectedJob.salary_max) && (
                    <Badge variant="secondary" className="gap-1">
                      <DollarSign className="h-3 w-3" />
                      {formatSalary(selectedJob.salary_min, selectedJob.salary_max)}
                    </Badge>
                  )}
                </div>

                {selectedJob.skills && selectedJob.skills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJob.skills.map((skill) => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedJob.description}</p>
                </div>

                <p className="text-xs text-muted-foreground">
                  Posted {format(new Date(selectedJob.created_at), "MMMM d, yyyy")}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
