"use client"

import Link from "next/link"
import { ArrowRight, Briefcase, FileText, User } from "lucide-react"
import { useState, useEffect } from "react"
import { formatDistanceToNow, parseISO } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Define the Job type
interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  isRemote: boolean;
  createdAt: string;
  applications?: number;
}

// Sample data for recent applications
const recentApplications = [

]

export function AdminDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState([])
  const [count, setCount] = useState(0)
//=============================================================================
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/jobs');
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

//====================================================================
useEffect(() => {
  const fetchApplications = async () => {
    const res = await fetch("http://localhost:5000/api/applications/all");
    const json = await res.json();
    console.log("✅ Fetched from frontend:", json);
    setCount(json.count)
    setApplications(json.data); // check that .data exists!
  };

  fetchApplications();
}, []);

//===================================================================
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Post jobs and manage applications</p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Post a New Job</h3>
                <p className="text-sm text-slate-600">Create a new job listing for developers</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-white/50 px-6 py-3">
            <Button className="w-full" asChild>
              <Link href="/admin/post-job">Post Job</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">View Applications</h3>
                <p className="text-sm text-slate-600">Review and download CVs from applicants</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-white/50 px-6 py-3">
            <Button className="w-full" variant="outline" asChild>
              <Link href="/admin/applications">View Applications</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Briefcase className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="text-2xl font-bold">{jobs.length}</h3>
              <p className="text-sm text-muted-foreground">Active Job Listings</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <User className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="text-2xl font-bold">{count}</h3>
              <p className="text-sm text-muted-foreground">Total Applications</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <FileText className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="text-2xl font-bold">0</h3>
              <p className="text-sm text-muted-foreground">New Applications</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Job Listings</CardTitle>
          <CardDescription>Currently active job postings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-4">Loading jobs...</div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No active job listings</div>
            ) : (
              jobs.map((job) => (
                <div
                  key={job._id}
                  className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <h4 className="font-medium">{job.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                        {job.jobType}
                      </Badge>
                      {job.isRemote && (
                        <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
                          Remote
                        </Badge>
                      )}
                      <span className="text-xs text-slate-500">Posted {formatDate(job.createdAt)}</span>
                      <span className="text-xs text-slate-500">• {job.location}</span>
                    </div>
                  </div>
                  <Link href={`/admin/jobs/${job._id}`}>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View <ArrowRight className="h-4 w-4" />
                  </Button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-slate-50">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/admin/post-job">Post Another Job</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Latest candidates who applied</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <h4 className="font-medium">{application.fullName}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500">Applied for {application.jobId.title}</span>
                    <span className="text-xs text-slate-500">• {application.createdAt}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  View CV <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-slate-50">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/admin/applications">View All Applications</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
