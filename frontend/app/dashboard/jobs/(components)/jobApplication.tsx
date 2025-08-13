"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, FileText, Loader2} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useUser } from "@clerk/nextjs"


import { screenApplication } from "@/lib/ai-screening"
import type { JobRequirements, ApplicationData, ScreeningResult } from "@/lib/ai-screening"

// Sample job data - same as in job-details
const jobData = {
  1: {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechFlow",
    logo: "/placeholder.svg?height=40&width=40",
    location: "Remote",
    type: "Full-time",
    salary: "$120,000 - $150,000",
  },
}

interface JobApplicationProps {
  jobId: string
}

// Define types for job and profile to avoid 'never' errors
interface Job {
  id: string;
  title: string;
  description: string,
  company: string;
  logo?: string;
  location?: string;
  type?: string;
  salary?: string;
  salaryRange?: { min: number; max: number };
  requirements?: string;
  techStack?: string[];
  experienceLevel?: string;
  education?: string;
  jobType?: string;
}
interface Profile {
  _id?: string;
  profileId: string;
  name: string;
  email: string;
  title: string;
  phone: string;
  location: string;
  about: string;
  skills: string[];
  experience: any[];
  education: string[];
  social: {
    linkedin: string;
    github: string;
    twitter: string;
    website: string;
  };
  preferences: {
    jobAlerts: boolean;
    remoteOnly: boolean;
    salary: string;
    jobType: string;
  };
}

export function JobApplication({ jobId }: JobApplicationProps) {
  const router = useRouter()
  const { user } = useUser()
  const userId = user?.id;
  const [resumeOption, setResumeOption] = useState("database") // or "database" depending on your default
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    jobId: jobId,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    linkedinUrl: "",
    portfolioUrl: "",
    coverLetter: "",
    experience: "",
    availability: "",
    useProfileResume: "",
    salaryExpectation: "",
    workAuthorization: "",
    willingToRelocate: false,
    agreedToTerms: false,
    skills: "", // <-- Added
    about: "",  // <-- Added
  })
  const [profile, setProfile] = useState<Profile>({
    profileId: "",
    name: "",
    email: "",
    title: "",
    phone: "",
    location: "",
    about: "",
    skills: [],
    experience: [],
    education: [],
    social: {
      linkedin: "",
      github: "",
      twitter: "",
      website: "",
    },
    preferences: {
      jobAlerts: false,
      remoteOnly: false,
      salary: "",
      jobType: "",
    },
  });
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null)
  const [isScreening, setIsScreening] = useState(false)

//===============================================================================
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
//=============================================================================
useEffect(() => {
  if (!userId) return;

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/profile/${userId}`);
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
        console.log("Profile", data)
      } else {
        console.warn("No profile found");
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  fetchProfile();
}, [userId]);

//===============================================


//=================================================

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Job Not Found</h1>
          <p className="text-slate-600 mb-4">The job you're trying to apply for doesn't exist.</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }
  //=============================================================================================

//==================================================================================================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsScreening(true);
    setScreeningResult(null);

    // Prepare application data for AI screening
    const applicationData: ApplicationData = {
      experience: formData.experience, // or derive from profile.experience if you have a summary
      skills: profile.skills.length > 0
        ? profile.skills
        : formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
      education: profile.education?.[0] || undefined,
      location: profile.location || formData.location,
      about: profile.about || "undefined"
      // about: profile.about || formData.about, // Only if your AI expects this field
    }

    // Prepare job requirements for AI screening
    const jobRequirements: JobRequirements | null = job && job.requirements ? {
      position: job.title || "",
      requiredSkills: Array.isArray(job.techStack) ? job.techStack : [],
      experienceLevel: job.experienceLevel || "",
      description: job.description || undefined,
      location: job.location || undefined,
      jobType: job.type || undefined,
    } : null;

    let screeningPassed = true;
    let screeningData = null;
    if (jobRequirements) {
      try {
        const result = await screenApplication(jobRequirements, applicationData);
        setScreeningResult(result);
        screeningPassed = result.qualified;
        screeningData = result;
      } catch (err) {
        console.error("AI screening failed", err);
        screeningPassed = true; // fallback: allow submission
      }
    }
    setIsScreening(false);

    // Simulate API call to submit application
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In real app, save to database with screening result
    console.log("Application submitted with screening result:", {
      applicationData,
      screeningResult: screeningData,
      status: screeningPassed ? "pending" : "rejected",
    });

    const status = screeningPassed ? "pending" : "rejected";

    // Continue with your existing API call
    const payload = {
      userId,
      jobId, // Make sure this is defined
      profileId: profile._id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      availability: formData.availability,
      portfolioUrl: formData.portfolioUrl,
      // ... include all other fields
      screeningResult: screeningData,
      status, // <-- Add this line
    };
    try {
      const res = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setIsSubmitted(true);
        console.log("✅ Application submitted successfully", data);
      } else {
        alert(data.message || "Failed to apply");
      }
    } catch (err) {
      console.error("❌ Submission failed:", err);
      alert("An error occurred while submitting your application");
    } finally {
      setIsSubmitting(false);
    }
  };
//==============================================================================================
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
//===================================================================================================

//============================================================================================================

//===============================================================================================

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }



  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Application Submitted!</h2>
            <p className="text-slate-600 mb-6">
              Thank you for applying to the {job.title} position at {job.company}. We'll review your application and get
              back to you soon.
            </p>
            <div className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/dashboard/applications">View My Applications</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/jobs">Browse More Jobs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
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
                <Link href="/dashboard/jobs" className="hover:text-blue-600">
                  Jobs
                </Link>
                <span className="mx-2">/</span>
                <Link href={`/jobs/${job.id}`} className="hover:text-blue-600">
                  {job.title}
                </Link>
                <span className="mx-2">/</span>
                <span>Apply</span>
              </nav>
            </div>
          </div>

          {/* Job Summary */}
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 rounded-lg">
              <AvatarImage src={job.logo || "/placeholder.svg"} alt={job.company} />
              <AvatarFallback className="rounded-lg bg-slate-100 text-slate-800">
                {job.company.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{job.title}</h1>
              <div className="flex items-center gap-4 text-slate-600">
                <span className="font-medium">{job.company}</span>
                <span>•</span>
                <span>{job.location}</span>
                <span>•</span>
                <span>{job.type}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Tell us about yourself</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Current Location *</Label>
                      <Input
                        id="location"
                        placeholder="City, State/Country"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Professional Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
                    <CardDescription>Share your professional background</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                        <Input
                          id="linkedinUrl"
                          placeholder="https://linkedin.com/in/yourprofile"
                          value={formData.linkedinUrl}
                          onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="portfolioUrl">Portfolio/Website</Label>
                        <Input
                          id="portfolioUrl"
                          placeholder="https://yourportfolio.com"
                          value={formData.portfolioUrl}
                          onChange={(e) => handleInputChange("portfolioUrl", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience *</Label>
                      <Select
                        value={formData.experience}
                        onValueChange={(value) => handleInputChange("experience", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1">0-1 years</SelectItem>
                          <SelectItem value="2-3">2-3 years</SelectItem>
                          <SelectItem value="4-5">4-5 years</SelectItem>
                          <SelectItem value="6-8">6-8 years</SelectItem>
                          <SelectItem value="9+">9+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Resume Upload */}
                <div className="mb-4">
                  <p className="font-medium mb-2">Choose Resume Source</p>
                  <div className="flex gap-4">

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="resumeOption"
                        value="database"
                        checked={resumeOption === "database"}
                        onChange={() => setResumeOption("database")}
                      />
                      Use My Profile Resume
                    </label>
                  </div>
                </div>

                {resumeOption === "upload" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Resume/CV *</CardTitle>
                      <CardDescription>Upload your most recent resume</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
                        <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-sm font-medium">Upload your resume</p>
                        <p className="text-xs text-slate-500">PDF, DOC, or DOCX (max 5MB)</p>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="mt-4"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {resumeOption === "database" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Resume Preview</CardTitle>
                      <CardDescription>We’ll use your saved resume profile for this application.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600">Name: {profile.name}</p>
                      <p className="text-sm text-slate-600">Title: {profile.title}</p>
                      <p className="text-sm text-slate-600">Experience: {profile.experience?.[0]?.title}</p>
                      {/* Add more preview as needed */}
                    </CardContent>
                  </Card>
                )}




                {/* Additional Questions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                    <CardDescription>Help us understand your preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="availability">When can you start? *</Label>
                      <Select
                        value={formData.availability}
                        onValueChange={(value) => handleInputChange("availability", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediately">Immediately</SelectItem>
                          <SelectItem value="2-weeks">2 weeks notice</SelectItem>
                          <SelectItem value="1-month">1 month</SelectItem>
                          <SelectItem value="2-months">2 months</SelectItem>
                          <SelectItem value="3-months">3+ months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salaryExpectation">Salary Expectation</Label>
                      <Input
                        id="salaryExpectation"
                        placeholder="e.g., R120,000 - R150,000"
                        value={formData.salaryExpectation}
                        onChange={(e) => handleInputChange("salaryExpectation", e.target.value)}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="willingToRelocate"
                        checked={formData.willingToRelocate}
                        onCheckedChange={(checked) => handleInputChange("willingToRelocate", checked as boolean)}
                      />
                      <Label htmlFor="willingToRelocate">I am willing to relocate for this position</Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Terms and Conditions */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreedToTerms"
                        checked={formData.agreedToTerms}
                        onCheckedChange={(checked) => handleInputChange("agreedToTerms", checked as boolean)}
                        required
                      />
                      <Label htmlFor="agreedToTerms" className="text-sm leading-relaxed">
                        I agree to the{" "}
                        <Link href="/terms" className="text-blue-600 hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </Link>
                        . I consent to the collection and processing of my personal data for recruitment purposes.
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Application Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Application Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-slate-500">{job.company}</p>
                      </div>
                      <Separator />
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Location</span>
                          <span>{job.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Type</span>
                          <span>{job.jobType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Salary</span>
                          <span>R{job.salaryRange?.min} - R{job.salaryRange?.max} </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Application Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle>Application Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        <span>Tailor your resume to match the job requirements</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        <span>Write a compelling cover letter that shows your enthusiasm</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        <span>Double-check all information before submitting</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        <span>Follow up within a week if you don't hear back</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <Card>
                  <CardContent className="pt-6">
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting || !formData.agreedToTerms}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting Application...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                    <p className="text-xs text-slate-500 mt-2 text-center">
                      Your application will be sent directly to {job.company}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
      {isScreening && (
        <div className="my-4 text-center text-blue-600">Running AI screening...</div>
      )}
      {screeningResult && (
        <div className="my-4 text-center">
          <div className={`inline-block px-4 py-2 rounded ${screeningResult.qualified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {screeningResult.qualified ? 'You are qualified for this job!' : 'You do not meet all requirements.'}
            <br />
            Score: {screeningResult.score} / 100
            <br />
            {screeningResult.reasoning}
          </div>
        </div>
      )}
    </div>
  )
}
