"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Banknote, Bookmark, BookmarkCheck, Building2, Clock, DollarSign, MapPin, Share2, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useParams } from "next/navigation";
import { formatDistanceToNow, parseISO } from "date-fns"
// Sample job data - in a real app, this would be fetched based on the jobId

interface JobDetailsProps {
  jobId: string;
}

export function AdminView({ jobId }: JobDetailsProps) {
  const router = useRouter()
  const [job, setJob] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(job?.saved || false)


  const toggleSaved = () => {
    setIsSaved(!isSaved)
    // In a real app, you would update this in the backend
  }

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true); // ✅ add loading state at start
      try {
        const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`);
        if (!response.ok) throw new Error("Job not found");
        const data = await response.json();
        setJob(data);
        console.log("✅ fetched job", data);
      } catch (error) {
        console.error("❌ Failed to fetch job:", error);
        setJob(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);
//=======================================================================================
const handleDelete = async () => {
  const confirmDelete = window.confirm("Are you sure you want to delete this job?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      alert("Job deleted successfully");
    } else {
      alert(data.message || "Failed to delete job");
    }
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Something went wrong while deleting");
  }
};
//==================================================================

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Job Not Found</h1>
          <p className="text-slate-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Go back</span>
            </Button>
            <div className="flex-1">
              <nav className="text-sm text-slate-500">
                <Link href="/admin" className="hover:text-blue-600">
                  Admin
                </Link>
                <span className="mx-2">/</span>
                <span>{job.title}</span>
              </nav>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" >
                {isSaved ? <BookmarkCheck className="h-5 w-5 text-blue-600" /> : <Bookmark className="h-5 w-5" />}
                <span className="sr-only">{isSaved ? "Unsave" : "Save"} job</span>
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share job</span>
              </Button>
            </div>
          </div>

          {/* Job Header */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 rounded-lg">
                  <AvatarImage src={job.logo || "/placeholder.svg"} alt={job.company} />
                  <AvatarFallback className="rounded-lg bg-slate-100 text-slate-800 text-lg">
                    {job.company.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-slate-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                     <Banknote/>
                      <span>{job.salaryRange.min} - {job.salaryRange.max} </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.techStack.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Section */}
            <div className="lg:w-80">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Posted</span>
                      <span className="font-medium">{job.createdAt}</span>
                    </div><span className="font-medium"></span>


                    <Separator />
                    <Button variant={"destructive"} onClick={handleDelete}  className="w-full" size="lg" >
                     Delete Job
                    </Button>
 
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Job Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-slate max-w-none">
                  {job.description.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 text-slate-600 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Responsibilities */}


            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-slate-800 mb-3">Required Qualifications</h4>
                    <ul className="space-y-3">
                      {job.requirements
                        .split("\n")
                        .filter((r) => r.trim() !== "")
                        .map((requirement, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                            <span className="text-slate-600">{requirement}</span>
                          </li>
                        ))}
                    </ul>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Benefits & Perks</CardTitle>
              </CardHeader>
              <CardContent>
               
                <ul className="space-y-3">
                      {job.benefits
                        .split("\n")
                        .filter((r) => r.trim() !== "")
                        .map((benefit, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                            <span className="text-slate-600">{benefit}</span>
                          </li>
                        ))}
                    </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Similar Jobs */}

          </div>
        </div>
      </div>
    </div>
  )
}
