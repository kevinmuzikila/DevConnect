"use client"

import { useEffect, useState } from "react"
import { Download, FileText, Filter, Search, Star,   Calendar,
  Mail,
  CheckCircle,
  XCircle,
  MessageSquare,
  Brain,
  RotateCcw,} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatDistanceToNow, parseISO } from "date-fns"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
// Sample data for applications
const applicationsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    position: "Senior Frontend Developer",
    experience: "5 years",
    applied: "May 2, 2025",
    status: "new",
    skills: ["React", "TypeScript", "Next.js"],
    avatar: "/placeholder.svg?height=40&width=40",
    starred: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.c@example.com",
    position: "Backend Engineer",
    experience: "3 years",
    applied: "May 1, 2025",
    status: "reviewed",
    skills: ["Node.js", "Express", "MongoDB"],
    avatar: "/placeholder.svg?height=40&width=40",
    starred: false,
  },
  {
    id: 3,
    name: "Emma Wilson",
    email: "emma.w@example.com",
    position: "Full Stack Developer",
    experience: "4 years",
    applied: "Apr 30, 2025",
    status: "contacted",
    skills: ["React", "Node.js", "PostgreSQL"],
    avatar: "/placeholder.svg?height=40&width=40",
    starred: true,
  },
  {
    id: 4,
    name: "David Rodriguez",
    email: "david.r@example.com",
    position: "DevOps Engineer",
    experience: "6 years",
    applied: "Apr 29, 2025",
    status: "new",
    skills: ["Docker", "Kubernetes", "AWS"],
    avatar: "/placeholder.svg?height=40&width=40",
    starred: false,
  },
  {
    id: 5,
    name: "Olivia Taylor",
    email: "olivia.t@example.com",
    position: "Mobile Developer",
    experience: "2 years",
    applied: "Apr 28, 2025",
    status: "rejected",
    skills: ["React Native", "TypeScript", "Firebase"],
    avatar: "/placeholder.svg?height=40&width=40",
    starred: false,
  },
  {
    id: 6,
    name: "James Wilson",
    email: "james.w@example.com",
    position: "UI/UX Designer",
    experience: "4 years",
    applied: "Apr 27, 2025",
    status: "reviewed",
    skills: ["Figma", "Adobe XD", "HTML/CSS"],
    avatar: "/placeholder.svg?height=40&width=40",
    starred: false,
  },
  {
    id: 7,
    name: "Sophia Martinez",
    email: "sophia.m@example.com",
    position: "Data Scientist",
    experience: "3 years",
    applied: "Apr 26, 2025",
    status: "new",
    skills: ["Python", "TensorFlow", "SQL"],
    avatar: "/placeholder.svg?height=40&width=40",
    starred: true,
  },
]

export function ApplicationsManager() {
  const [applications, setApplications] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [positionFilter, setPositionFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true);
  const [responseDialog, setResponseDialog] = useState<{
    isOpen: boolean
    type: "approve" | "interview" | "offer" | "reject" | null
    application: any
  }>({
    isOpen: false,
    type: null,
    application: null,
  })
  const [responseMessage, setResponseMessage] = useState("")
  const [interviewDate, setInterviewDate] = useState("")
  const [offerDetails, setOfferDetails] = useState({
    salary: "",
    startDate: "",
    benefits: "",
  })

  
  const [aiResultsDialog, setAiResultsDialog] = useState<{
    isOpen: boolean
    application: any
  }>({
    isOpen: false,
    application: null,
  })

  //===========================================================================================

  useEffect(() => {
    const fetchApplications = async () => {
      const res = await fetch("http://localhost:5000/api/applications/all");
      const json = await res.json();
      console.log("✅ Fetched from frontend:", json);
      setApplications(json.data); // check that .data exists!
    };

    fetchApplications();
  }, []);
//=======================================================================
 // Open response dialog
 const openResponseDialog = (type: "approve" | "interview" | "offer" | "reject", application: any) => {
  setResponseDialog({ isOpen: true, type, application })
  setResponseMessage("")
  setInterviewDate("")
  setOfferDetails({ salary: "", startDate: "", benefits: "" })
}

//====================================================================================
const handleResponseSubmit = async () => {
  const { type, application } = responseDialog;

  // Map V0 status type to real DB values
  let newStatus = "pending";
  if (type === "approve") newStatus = "approved";
  if (type === "interview") newStatus = "interview";
  if (type === "offer") newStatus = "offer";
  if (type === "reject") newStatus = "rejected";

  // Build response payload
  const payload = {
    status: newStatus,
    adminMessage: responseMessage || "",
    interviewDate: type === "interview" ? interviewDate : null,
    offerDetails: type ==="offer" ? offerDetails : null,
  };

  try {
    const res = await fetch(`http://localhost:5000/api/applications/${application._id}/respond`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (res.ok) {
      console.log(`✅ ${type} response sent to ${application.fullName}`, result);
      alert("Response sent successfully");

      // Optionally: Refresh applications list or state here
    } else {
      alert(result.message || "Failed to send response");
    }
  } catch (err) {
    console.error("❌ Error sending response:", err);
    alert("Something went wrong while sending the response.");
  }

  // Close dialog
  setResponseDialog({ isOpen: false, type: null, application: null });
};

//========================================================================================
  // Filter applications based on search query, position filter, and status filter
  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      application.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.jobId.techStack.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesPosition = positionFilter === "all" || application.position === positionFilter
    const matchesStatus = statusFilter === "all" || application.status === statusFilter

    return matchesSearch && matchesPosition && matchesStatus
  })

  // Toggle star status
  const toggleStar = (id: number) => {
    setApplications(applications.map((app) => (app.id === id ? { ...app, starred: !app.starred } : app)))
  }

  // Update application status
  const updateStatus = (id: number, status: string) => {
    setApplications(applications.map((app) => (app.id === id ? { ...app, status } : app)))
  }

  // Get unique positions for filter
  const positions = Array.from(new Set(applications.map((app) => app.position)))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground">Review and manage job applications</p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, email, or skills..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {positions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
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

      {/* Applications Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>All Applications</CardTitle>
          <CardDescription>
            Showing {filteredApplications.length} of {applications.length} total applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Candidate</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>AI Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Skills Match</TableHead>
               
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">

                        <Avatar>
                          <AvatarImage src={application.avatar || "/placeholder.svg"} alt={application.name} />
                          <AvatarFallback className="bg-slate-100 text-slate-800">
                            {application.fullName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{application.fullName}</p>
                          <p className="text-xs text-muted-foreground">{application.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{application.jobId.title}</p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {formatDistanceToNow(parseISO(application.createdAt), { addSuffix: true })}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            application.screeningResult.score >= 80
                              ? "bg-green-50 text-green-700 border-green-200"
                              : application.screeningResult.score >= 60
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-red-50 text-red-700 border-red-200"
                          }
                        >
                          {application.screeningResult.score}/100
                        </Badge>
                        <Brain className="h-4 w-4 text-blue-500" />
                    
                      </div>
                    </TableCell>


                    <TableCell>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-900 border-yellow-200">
                        {application.status}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-1">
                          {application.screeningResult.matchedSkills.slice(0, 2).map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200 text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {application.screeningResult.matchedSkills.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{application.screeningResult.matchedSkills.length - 2}
                            </Badge>
                          )}
                        </div>
                        {application.screeningResult.missingSkills.length > 0 && (
                          <p className="text-xs text-red-600">
                            Missing: {application.screeningResult.missingSkills.slice(0, 2).join(", ")}
                            {application.screeningResult.missingSkills.length > 2 && "..."}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1"
                          onClick={() => {
                            setSelectedApplication(application)
                            setIsViewDialogOpen(true)
                          }}
                        >
                          <FileText className="h-4 w-4" />
                          View Application
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 text-purple-600 hover:text-purple-700 bg-transparent"
                          onClick={() => {
                            setAiResultsDialog({ isOpen: true, application })
                          }}
                        >
                          <Brain className="h-4 w-4" />
                          AI Results
                        </Button>

                      </div>
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 gap-1">
                              <MessageSquare className="h-4 w-4" />
                              Respond
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openResponseDialog("interview", application)}>
                              <Calendar className="mr-2 h-4 w-4 text-blue-600" />
                              Schedule Interview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openResponseDialog("offer", application)}>
                              <Mail className="mr-2 h-4 w-4 text-purple-600" />
                              Make Offer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openResponseDialog("reject", application)}>
                              <XCircle className="mr-2 h-4 w-4 text-red-600" />
                              Reject Application
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Application Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[800px] overflow-auto">

          {selectedApplication && (
            <div className="">
              <div className="md:col-span-1 space-y-4">
                <div className="space-y-2">

                </div>


              </div>

              <div className="md:col-span-2 space-y-6">
                <div className="space-y-2">
                  <h4 className="font-medium">Resume Preview</h4>
                  <Badge variant={"outline"} className="bg-yellow-200 ">Application Status : {selectedApplication.status}</Badge>
                  <div className="border rounded-md p-4 bg-slate-50 min-h-[400px] overflow-auto">
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-xl font-bold">{selectedApplication.profileId.name}</h2>
                        <p className="text-sm text-slate-600">
                          {selectedApplication.profileId.title} • {selectedApplication.experience} experience
                        </p>
                      </div>

                      <div>
                        <h3 className="text-md font-semibold border-b pb-1">Summary</h3>
                        <p className="mt-2 text-sm">
                          {selectedApplication.profileId.about}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-md font-semibold border-b pb-1">Skills</h3>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {selectedApplication.profileId.skills.map((skill: string) => (
                            <Badge key={skill} variant="outline" className="bg-white">
                              {skill}
                            </Badge>
                          ))}

                        </div>
                      </div>

                      <div>
                        <h3 className="text-md font-semibold border-b pb-1">Experience</h3>
                        <div className="mt-2 space-y-4">
                          {selectedApplication?.profileId?.experience?.map((exp, index) => (
                            <div key={index}>
                              <div className="flex justify-between">
                                <p className="font-medium">{exp.title}</p>
                                <p className="text-sm text-slate-500">{exp.startDate} - {exp.endDate}</p>
                              </div>
                              <p className="text-sm">{exp.company}</p>
                              {exp.description && (
                                <ul className="mt-1 text-sm list-disc pl-5 space-y-1">
                                  {exp.description.split("\n").map((point, i) => (
                                    <li key={i}>{point}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-md font-semibold border-b pb-1">Education</h3>
                        <div className="mt-2 space-y-4">
                          {selectedApplication?.profileId?.education?.map((edu, index) => (
                            <div key={index}>
                              <div className="flex justify-between">
                                <p className="font-medium">{edu.degree}</p>
                                <p className="text-sm text-slate-500">{edu.startDate} - {edu.endDate}</p>
                              </div>
                              <p className="text-sm">{edu.institution}</p>
                            </div>
                          ))}
                        </div>
                      </div>



                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      
      {/* Response Dialog */}
      <Dialog
        open={responseDialog.isOpen}
        onOpenChange={(open) => setResponseDialog((prev) => ({ ...prev, isOpen: open }))}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {responseDialog.type === "approve" && "Approve Application"}
              {responseDialog.type === "interview" && "Schedule Interview"}
              {responseDialog.type === "offer" && "Make Job Offer"}
              {responseDialog.type === "reject" && "Reject Application"}
            </DialogTitle>
            <DialogDescription>
              Send a response to {responseDialog.application?.name} regarding their application for{" "}
              {responseDialog.application?.position}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {responseDialog.type === "interview" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Interview Date & Time</label>
                <Input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full"
                />
              </div>
            )}

            {responseDialog.type === "offer" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Salary Offer</label>
                    <Input
                      placeholder="e.g., $80,000"
                      value={offerDetails.salary}
                      onChange={(e) => setOfferDetails((prev) => ({ ...prev, salary: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <Input
                      type="date"
                      value={offerDetails.startDate}
                      onChange={(e) => setOfferDetails((prev) => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {responseDialog.type === "reject" ? "Rejection Reason (Optional)" : "Message"}
              </label>
              <Textarea
                placeholder={
                  responseDialog.type === "approve"
                    ? "Congratulations! We'd like to move forward..."
                    : responseDialog.type === "interview"
                      ? "We'd like to schedule an interview..."
                      : responseDialog.type === "offer"
                        ? "We're excited to extend this offer..."
                        : "Thank you for your interest. Unfortunately..."
                }
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setResponseDialog({ isOpen: false, type: null, application: null })}
              >
                Cancel
              </Button>
              <Button onClick={handleResponseSubmit}>
                {responseDialog.type === "approve" && "Send Approval"}
                {responseDialog.type === "interview" && "Schedule Interview"}
                {responseDialog.type === "offer" && "Send Offer"}
                {responseDialog.type === "reject" && "Send Rejection"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={aiResultsDialog.isOpen}
        onOpenChange={(open) => setAiResultsDialog((prev) => ({ ...prev, isOpen: open }))}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              AI Screening Results
            </DialogTitle>
            <DialogDescription>
              Detailed AI analysis for {aiResultsDialog.application?.fullName}'s application
            </DialogDescription>
          </DialogHeader>

          {aiResultsDialog.application && (
            <div className="space-y-6">
              {/* Candidate Info */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={aiResultsDialog.application.avatar || "/placeholder.svg"}
                    alt={aiResultsDialog.application.fullName}
                  />
                  <AvatarFallback className="bg-slate-100 text-slate-800">
                    {aiResultsDialog.application.fullName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{aiResultsDialog.application.fullName}</h3>
                </div>
              </div>

              {/* Overall Score */}
              <div className="text-center p-6 border rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl font-bold">{aiResultsDialog.application.screeningResult.score}/100</span>
                  <Badge
                    variant="outline"
                    className={
                      aiResultsDialog.application.screeningResult.score >= 80
                        ? "bg-green-50 text-green-700 border-green-200"
                        : aiResultsDialog.application.screeningResult.score >= 60
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-red-50 text-red-700 border-red-200"
                    }
                  >
                    {aiResultsDialog.application.screeningResult.qualified ? "QUALIFIED" : "NOT QUALIFIED"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Compatibility Score</p>
              </div>

              {/* Skills Analysis */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Matched Skills ({aiResultsDialog.application.screeningResult.matchedSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {aiResultsDialog.application.screeningResult.matchedSkills.map((skill: string) => (
                      <Badge key={skill} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {aiResultsDialog.application.screeningResult.missingSkills.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Missing Skills ({aiResultsDialog.application.screeningResult.missingSkills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {aiResultsDialog.application.screeningResult.missingSkills.map((skill: string) => (
                        <Badge key={skill} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* AI Reasoning */}
              <div>
                <h4 className="font-medium mb-2">AI Analysis</h4>
                <Alert>
                  <MessageSquare className="h-4 w-4" />
                  <AlertDescription className="text-sm leading-relaxed">
                    {aiResultsDialog.application.screeningResult.reasoning}
                  </AlertDescription>
                </Alert>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4 border-t">
                <div>
                    {aiResultsDialog.application.status === "ai-rejected" && (
                    <Button
                      variant="outline"
                      className="gap-2 bg-transparent"
                      onClick={() => {
                    
                        setAiResultsDialog({ isOpen: false, application: null })
                      }}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Override AI Decision
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setAiResultsDialog({ isOpen: false, application: null })}>
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedApplication(aiResultsDialog.application)
                      setAiResultsDialog({ isOpen: false, application: null })
                      setIsViewDialogOpen(true)
                    }}
                  >
                    View Full Application
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
