"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Bookmark,
  BookmarkCheck,
  Filter,

} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

import { Separator } from "@/components/ui/separator"
import { useMobile } from "@/hooks/use-mobile"




const jobListings = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechFlow",
      logo: "/placeholder.svg?height=40&width=40",
      location: "Remote",
      tags: ["React", "TypeScript", "Next.js"],
      description:
        "Join our team to build modern web applications with React and TypeScript. You'll work on challenging projects and collaborate with a talented team.",
      postedDate: "2 days ago",
      isFeatured: true,
      isSaved: false,
    },
    {
      id: 2,
      title: "Backend Engineer",
      company: "DataSphere",
      logo: "/placeholder.svg?height=40&width=40",
      location: "New York, NY",
      tags: ["Node.js", "PostgreSQL", "AWS"],
      description:
        "Looking for an experienced backend developer to help scale our infrastructure and implement new features for our growing platform.",
      postedDate: "1 day ago",
      isFeatured: true,
      isSaved: true,
    },
    {
      id: 3,
      title: "Full Stack Developer",
      company: "InnovateCo",
      logo: "/placeholder.svg?height=40&width=40",
      location: "San Francisco, CA",
      tags: ["JavaScript", "React", "Python", "Django"],
      description:
        "We're seeking a versatile developer who can work across our entire stack. You'll help build new features and maintain existing ones.",
      postedDate: "3 days ago",
      isFeatured: false,
      isSaved: false,
    },
    {
      id: 4,
      title: "DevOps Engineer",
      company: "CloudNative",
      logo: "/placeholder.svg?height=40&width=40",
      location: "Remote",
      tags: ["Kubernetes", "Docker", "CI/CD", "Terraform"],
      description:
        "Help us build and maintain our cloud infrastructure. You'll work with cutting-edge technologies and help scale our platform.",
      postedDate: "5 days ago",
      isFeatured: false,
      isSaved: true,
    },
    {
      id: 5,
      title: "Mobile Developer",
      company: "AppWorks",
      logo: "/placeholder.svg?height=40&width=40",
      location: "Austin, TX",
      tags: ["React Native", "TypeScript", "Firebase"],
      description:
        "Join our mobile team to build cross-platform applications using React Native. You'll work on features that impact thousands of users.",
      postedDate: "1 week ago",
      isFeatured: false,
      isSaved: false,
    },
  ]
  
  // Featured companies
  const featuredCompanies = [
    { name: "TechFlow", logo: "/placeholder.svg?height=40&width=40" },
    { name: "DataSphere", logo: "/placeholder.svg?height=40&width=40" },
    { name: "InnovateCo", logo: "/placeholder.svg?height=40&width=40" },
  ]

function MainContent() {

    const isMobile = useMobile()
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [jobs, setJobs] = useState(jobListings)

  const toggleSaved = (jobId) => {
    setJobs(jobs.map((job) => (job.id === jobId ? { ...job, isSaved: !job.isSaved } : job)))
  }

  const filteredJobs = showSavedOnly ? jobs.filter((job) => job.isSaved) : jobs

  return (
    <div>

<div className=" main_content ">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar - Filters */}


            <main className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-slate-800">Developer Jobs</h1>
                <p className="text-slate-500 text-sm">{filteredJobs.length} jobs available</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={showSavedOnly ? "default" : "outline"}
                  size="sm"
                  className={`gap-2 ${showSavedOnly ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                  onClick={() => setShowSavedOnly(!showSavedOnly)}
                >
                  {showSavedOnly ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  <span className="hidden sm:inline">{showSavedOnly ? "Saved Jobs" : "All Jobs"}</span>
                </Button>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 md:hidden">
                      <Filter className="w-4 h-4" />
                      <span>Filters</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[280px] p-0">
                    <div className="p-4 pt-8">
                      <h2 className="mb-4 text-lg font-semibold">Filters</h2>
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Job Listings */}
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} onSaveToggle={toggleSaved} />
              ))}
            </div>
          </main>

    </div>
    </div>
    </div>
  )
}

export default MainContent

function JobCard({ job, onSaveToggle }) {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardContent className="p-0">
          <div className="p-5">
            <div className="flex items-start gap-4">
              <Image
                src={job.logo || "/placeholder.svg"}
                alt={job.company}
                width={48}
                height={48}
                className="rounded-md"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">{job.title}</h3>
                    <p className="text-sm text-slate-600">
                      {job.company} • {job.location}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`text-slate-400 ${job.isSaved ? "text-blue-600" : ""}`}
                    onClick={() => onSaveToggle(job.id)}
                  >
                    {job.isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {job.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="mt-3 text-sm text-slate-600">{job.description}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-slate-100">
            <span className="text-xs text-slate-500">Posted {job.postedDate}</span>
            <Button className="bg-blue-600 hover:bg-blue-700">Apply Now</Button>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  // Filter Sidebar Component
  function FilterSidebar() {
    return (
      <div className="space-y-6">
        {/* Job Type */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Job Type</h3>
          <div className="space-y-2">
            {["Full-time", "Part-time", "Contract", "Freelance", "Internship"].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox id={`job-type-${type}`} />
                <Label htmlFor={`job-type-${type}`} className="text-sm">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>
  
        <Separator />
  
        {/* Location */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Location</h3>
          <div className="space-y-2">
            {["Remote", "Hybrid", "On-site"].map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox id={`location-${location}`} />
                <Label htmlFor={`location-${location}`} className="text-sm">
                  {location}
                </Label>
              </div>
            ))}
          </div>
        </div>
  
        <Separator />
  
        {/* Experience Level */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Experience Level</h3>
          <div className="space-y-2">
            {["Entry Level", "Mid Level", "Senior", "Lead", "Manager"].map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox id={`level-${level}`} />
                <Label htmlFor={`level-${level}`} className="text-sm">
                  {level}
                </Label>
              </div>
            ))}
          </div>
        </div>
  
        <Separator />
  
        {/* Tech Stack */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "JavaScript",
              "TypeScript",
              "React",
              "Node.js",
              "Python",
              "Java",
              "Go",
              "Ruby",
              "PHP",
              "C#",
              ".NET",
              "AWS",
              "Docker",
              "Kubernetes",
            ].map((tech) => (
              <Badge key={tech} variant="outline" className="cursor-pointer hover:bg-slate-100">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
  
        <Separator />
  
        {/* Salary Range */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Salary Range</h3>
          <div className="space-y-2">
            {["$0 - $50k", "$50k - $100k", "$100k - $150k", "$150k - $200k", "$200k+"].map((range) => (
              <div key={range} className="flex items-center space-x-2">
                <Checkbox id={`salary-${range}`} />
                <Label htmlFor={`salary-${range}`} className="text-sm">
                  {range}
                </Label>
              </div>
            ))}
          </div>
        </div>
  
        <div className="pt-2">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">Apply Filters</Button>
        </div>
      </div>
    )
  }
  