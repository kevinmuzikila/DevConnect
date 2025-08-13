"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle2, Clock, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useUser } from "@clerk/nextjs"
import { formatDistanceToNow, parseISO } from "date-fns"
// Sample data for application stats
const applicationStats = {
  total: 0,
  pending: 0,
  interviews: 0,
  rejected: 0,
  offers: 0,
}

// Sample data for recent applications
const recentApplications = [

]


//============================
export function UserDashboardOverview( ) {
   const [applications, setApplications] = useState([]);
   const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const [stats, setStats] = useState({
      total: 0,
      pending: 0,
      interviews: 0,
      rejected: 0,
      offers: 0,
    });
    const userId = user?.id;
  
//=================================================================

useEffect(() => {
  if (!userId) return;

  const fetchApps = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/applications/${userId}`);
      const json = await res.json();
      if (json.success) {
        setApplications(json.data);
        console.log("data", json.data)
      } else {
        console.warn("Failed to load applications");
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

 

  fetchApps();
}, [userId]);
//==========================================================
useEffect(() => {
  if (!userId) return;

  const fetchStats = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/applications/stats/${userId}`);
      const data = await res.json();
      setStats(data);
      console.log("stats", data)
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  fetchStats();
}, [userId]);
//================================================================
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.firstName || "User"}</p>
      </div>


      {/* Application Stats */}
      <div className="">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardHeader>
            <CardTitle>Application Overview</CardTitle>
            <CardDescription>Track your job application progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Total Applications</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/applications">View All</Link>
                  </Button>

                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Pending Review</span>
                  <span className="font-medium">{stats.pending}</span>
                </div>
                <Progress value={(stats.pending / stats.total) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Interviews</span>
                  <span className="font-medium">{stats.interviews}</span>
                </div>
                <Progress value={(stats.interviews / stats.total) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Rejected</span>
                  <span className="font-medium">{stats.rejected}</span>
                </div>
                <Progress value={(stats.rejected / stats.total) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Offers</span>
                  <span className="font-medium">{stats.offers}</span>
                </div>
                <Progress value={(stats.offers / stats.total) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Your most recent job applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 rounded-md">
                    <AvatarImage src={application.logo || "/placeholder.svg"} alt={application.company} />
                    <AvatarFallback className="rounded-md bg-slate-100 text-slate-800">
                      {application.jobId?.company.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{application.jobId?.title}</p>
                    <p className="text-sm text-slate-500">{application.jobId?.company}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          application.status === "interview"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : application.status === "pending"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : application.status === "offer"
                              ? "bg-teal-100 text-teal-700 border-teal-200"
                              : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {application.status === "interview" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                        {application.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                        {application.status === "rejected" && <XCircle className="mr-1 h-3 w-3" />}
                        {application.status === "offer" && <XCircle className="mr-1 h-3 w-3" />}
                        {application.status === "interview"
                          ? "Interview Scheduled"
                          : application.status === "pending"
                            ? "Under Review"
                            : application.status === "offer" ? "Offer Received"
                            : "Not Selected"}
                      </Badge>
                      <span className="text-xs text-slate-500">~ Applied: {formatDistanceToNow(parseISO(application.createdAt), { addSuffix: true })}</span>
                    </div>
                    {application.upcoming && (
                      <p className="text-xs text-green-600 mt-1 font-medium">{application.upcoming}</p>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <Link href={`/dashboard/jobs/${application.jobId?._id}`}>
                    View <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-slate-50">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/dashboard/applications">
              View All Applications
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>



      {/* Profile Completion */}
      
    </div>
  )
}
