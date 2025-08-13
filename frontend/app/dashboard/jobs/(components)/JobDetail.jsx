"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Banknote, Bookmark, BookmarkCheck, Building2, MapPin, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { formatDistanceToNow, parseISO } from "date-fns"
// Sample job data - in a real app, this would be fetched based on the jobId



export function JobDetails({ jobId }) {
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
  //===================================================================================





  //========================================================================================

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
                <Link href="/dashboard/jobs" className="hover:text-blue-600">
                  Jobs
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
                      <Banknote  className="h-4 w-4" />
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
                      <span className="font-medium"> {formatDistanceToNow(parseISO(job.updatedAt), { addSuffix: true })}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Expires in</span>
                      <span className="font-medium">{job.expires}</span>
                    </div>

                    <Separator />
                    <Button className="w-full" size="lg" asChild>
                      <Link href={`/dashboard/jobs/${job._id}/apply`}>Apply for this Job</Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/dashboard/saved-jobs">Save for Later</Link>
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
            <Card>
              <CardHeader>
                <CardTitle>Similar Jobs</CardTitle>
                <CardDescription>Other opportunities you might like</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Frontend Developer", company: "DataSphere", location: "Remote" },
                    { title: "React Developer", company: "InnovateCo", location: "San Francisco" },
                    { title: "Full Stack Developer", company: "CloudNative", location: "Remote" },
                  ].map((similarJob, index) => (
                    <div key={index} className="border rounded-lg p-3 hover:bg-slate-50 cursor-pointer">
                      <h4 className="font-medium text-sm">{similarJob.title}</h4>
                      <p className="text-xs text-slate-500">{similarJob.company}</p>
                      <p className="text-xs text-slate-500">{similarJob.location}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
