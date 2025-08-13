"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Calendar, CheckCircle2, Clock, Download, Filter, MessageSquare, Search, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@clerk/nextjs"
import { formatDistanceToNow, parseISO } from "date-fns"
// Sample data for applications


export function ApplicationsTracker() {
  const [applications, setApplications] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(true);
  const { user } = useUser()
  const userId = user?.id;
  //===============================================================================]
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
  //========================================================================================


  //==================================================================================
  // Filter applications based on search query, status filter, and active tab
  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      application.jobId?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.jobId?.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.jobId?.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || application.status === statusFilter

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && application.status === "pending") ||
      (activeTab === "interview" && application.status === "interview") ||
      (activeTab === "offer" && application.status === "offer") ||
      (activeTab === "rejected" && application.status === "rejected")

    return matchesSearch && matchesStatus && matchesTab
  })



  // Handle opening application details
  const handleViewDetails = (application) => {
    setSelectedApplication(application)
    setNotes(application.notes || "")
    setIsDetailsDialogOpen(true)
  }



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Applications</h1>
        <p className="text-muted-foreground">Track and manage your job applications</p>
      </div>

      {/* Filters and Search */}
      <Card className="">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search applications..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Job Applications</CardTitle>
          <CardDescription>
            Showing {filteredApplications.length} of {applications.length} applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="interview">Interviews</TabsTrigger>
              <TabsTrigger value="offer">Offers</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="m-0">
              <div className="space-y-4">
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((application) => (
                    <div
                      key={application.id}
                      className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 rounded-md">
                          <AvatarImage src={application.logo || "/placeholder.svg"} alt={application.jobId?.company} />
                          <AvatarFallback className="rounded-md bg-slate-100 text-slate-800">
                            {application.jobId?.company.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{application.jobId?.title}</p>
                          <p className="text-sm text-slate-500">{application.jobId?.company}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className={`text-xs ${application.status === "interview"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : application.status === "pending"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : application.status === "offer"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                                }`}
                            >
                              {application.status === "interview" && <Clock className="mr-1 h-3 w-3" />}
                              {application.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                              {application.status === "offer" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                              {application.status === "rejected" && <XCircle className="mr-1 h-3 w-3" />}
                              {application.status === "interview"
                                ? "Interview"
                                : application.status === "pending"
                                  ? "Pending"
                                  : application.status === "offer"
                                    ? "Offer Received"
                                    : "Not Selected"}
                            </Badge>
                            <span className="text-xs text-slate-500">{application.jobId?.location}</span>
                            <span className="text-xs text-slate-500">~ Applied: {formatDistanceToNow(parseISO(application.createdAt), { addSuffix: true })}</span>
                          </div>
                          {application.upcoming && (
                            <p className="text-xs text-green-600 mt-1 font-medium">
                              {application.upcoming.type} on {application.upcoming.date} at {application.upcoming.time}
                            </p>
                          )}
                          {application.offer && (
                            <p className="text-xs text-green-600 mt-1 font-medium">
                              Offer: {application.offer.salary} • Deadline: {application.offer.deadline}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <Button size="sm" className="gap-1" onClick={() => handleViewDetails(application)}>
                          View Details
                          <ArrowRight className="h-4 w-4" />
                        </Button>

                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No applications found</p>
                    <Button className="mt-4" asChild>
                      <Link href="/">Browse Jobs</Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Application Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>View and manage your application</DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12 rounded-md">
                  <AvatarImage src={selectedApplication.logo || "/placeholder.svg"} alt={selectedApplication.company} />
                  <AvatarFallback className="rounded-md bg-slate-100 text-slate-800">
                    {selectedApplication.jobId.company.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedApplication.jobId.title}</h3>
                  <p className="text-slate-500">{selectedApplication.jobId.company}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className={`${selectedApplication.status === "interview"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : selectedApplication.status === "pending"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : selectedApplication.status === "offer"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                    >
                      {selectedApplication.status === "interview"
                        ? "Interview"
                        : selectedApplication.status === "pending"
                          ? "Pending"
                          : selectedApplication.status === "offer"
                            ? "Offer Received"
                            : "Not Selected"}
                    </Badge>
                    <span className="text-sm text-slate-500">{selectedApplication.jobId.location}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Applied On</p>
                  <p className="font-medium">
                    {selectedApplication?.createdAt
                      ? new Date(selectedApplication.createdAt).toLocaleDateString("en-GB")
                      : "—"}
                  </p>
                </div>
              </div>

              {selectedApplication.interviewDate && selectedApplication.status === "interview" && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <h4 className="font-medium text-blue-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Interview Date
                  </h4>
                  <div>
                  <p className="text-slate-500">Interview Scheduled</p>
                  <p className="font-medium">
                    {selectedApplication?.interviewDate
                      ? new Date(selectedApplication.interviewDate).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : "—"}
                  </p>
                </div>
                </div>
              )}

              {selectedApplication.offerDetails && selectedApplication.status === "offer" && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <h4 className="font-medium text-green-700 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Offer Details
                  </h4>
                  <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                    <div>
                      <p className="text-slate-500">Salary</p>
                      <p className="font-medium">{selectedApplication.offerDetails.salary}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Start Date</p>
                      <p className="font-medium">
                    {selectedApplication?.offerDetails?.startDate
                      ? new Date(selectedApplication.offerDetails.startDate).toLocaleDateString("en-GB")
                      : "—"}
                  </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                  </div>
                </div>
              )}

              {selectedApplication.feedback && (
                <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Feedback
                  </h4>
                  <p className="text-sm mt-1">{selectedApplication.feedback}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Message</h4>
                <p className="text-sm mt-1">{selectedApplication.adminMessage}</p>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/jobs/${selectedApplication.jobId._id}`}>View Job Posting</Link>
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
