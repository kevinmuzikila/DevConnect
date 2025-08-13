"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Common tech stacks for quick selection
const commonTechStacks = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "Node.js",
  "Express",
  "Python",
  "Django",
  "Flask",
  "Ruby",
  "Rails",
  "PHP",
  "Laravel",
  "Java",
  "Spring",
  "C#",
  ".NET",
  "Go",
  "Rust",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "GraphQL",
  "REST API",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "Elasticsearch",
]

export function PostJobForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [techStack, setTechStack] = useState<string[]>([])
  const [customTech, setCustomTech] = useState("")
  const [activeTab, setActiveTab] = useState("details")

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: 'full-time',
    salaryMin: '',
    salaryMax: '',
    description: '',
    isRemote: false,
    experienceLevel: 'mid',
    requirements: '',
    benefits: '',
    isFeatured: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleAddTech = (tech: string) => {
    if (!techStack.includes(tech) && tech.trim() !== "") {
      setTechStack([...techStack, tech])
    }
  }

  const handleRemoveTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech))
  }

  const handleAddCustomTech = () => {
    if (customTech.trim() !== "" && !techStack.includes(customTech)) {
      setTechStack([...techStack, customTech])
      setCustomTech("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        jobType: formData.jobType,
        salaryRange: {
          min: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
          max: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
        },
        description: formData.description,
        isRemote: formData.isRemote,
        experienceLevel: formData.experienceLevel,
        techStack,
        requirements: formData.requirements,
        benefits: formData.benefits,
        isFeatured: formData.isFeatured,
      }

      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      })

      if (!response.ok) {
        const errorData = await response.json(); // 🔥 Get actual error message from backend
        console.error("Job POST failed:", response.status, errorData);
        throw new Error(errorData.message || 'Failed to create job posting');
      }

      router.push('/admin')
      router.refresh()
    } catch (error) {
      console.error('Error creating job frontend:', error)
      // You might want to add proper error handling UI here
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Post a New Job</h1>
        <p className="text-muted-foreground">Create a new job listing for developers</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Job Details</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          
          
        </TabsList>

        <form onSubmit={handleSubmit}>
          <Card className="mt-4 border-t-0 rounded-tl-none rounded-tr-none">
            <TabsContent value="details" className="m-0">
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>Enter the basic information about the job position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input 
                      id="title" 
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Senior Frontend Developer" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input 
                      id="company" 
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="e.g. TechCorp" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g. Remote, New York, NY" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Job Type</Label>
                    <Select 
                      value={formData.jobType}
                      onValueChange={(value) => handleSelectChange('jobType', value)}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salary-min">Salary Range (Min)</Label>
                    <Input 
                      id="salary-min" 
                      name="salaryMin"
                      type="number"
                      value={formData.salaryMin}
                      onChange={handleInputChange}
                      placeholder="e.g. 80000" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary-max">Salary Range (Max)</Label>
                    <Input 
                      id="salary-max" 
                      name="salaryMax"
                      type="number"
                      value={formData.salaryMax}
                      onChange={handleInputChange}
                      placeholder="e.g. 120000" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                    className="min-h-[150px]"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch 
                    id="remote" 
                    checked={formData.isRemote}
                    onCheckedChange={(checked) => handleSwitchChange('isRemote', checked)}
                  />
                  <Label htmlFor="remote">This is a remote position</Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <Button variant="outline" type="button" onClick={() => router.push("/admin")}>
                  Cancel
                </Button>
                <Button type="button" onClick={() => setActiveTab("requirements")}>
                  Next: Requirements
                </Button>
              </CardFooter>
            </TabsContent>

            <TabsContent value="requirements" className="m-0">
              <CardHeader>
                <CardTitle>Job Requirements</CardTitle>
                <CardDescription>Specify the technical requirements and skills needed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select 
                    value={formData.experienceLevel}
                    onValueChange={(value) => handleSelectChange('experienceLevel', value)}
                  >
                    <SelectTrigger id="experience">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                      <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                      <SelectItem value="senior">Senior (5+ years)</SelectItem>
                      <SelectItem value="lead">Lead/Principal (8+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tech Stack</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {techStack.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="gap-1 pl-2 pr-1 py-1 bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {tech}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 rounded-full ml-1 hover:bg-blue-100"
                          onClick={() => handleRemoveTech(tech)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {tech}</span>
                        </Button>
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom technology..."
                      value={customTech}
                      onChange={(e) => setCustomTech(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddCustomTech()
                        }
                      }}
                    />
                    <Button type="button" size="icon" onClick={handleAddCustomTech}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Common technologies:</p>
                    <div className="flex flex-wrap gap-2">
                      {commonTechStacks.slice(0, 15).map((tech) => (
                        <Badge
                          key={tech}
                          variant="outline"
                          className={`cursor-pointer hover:bg-blue-50 ${
                            techStack.includes(tech) ? "bg-blue-50 text-blue-700 border-blue-200" : ""
                          }`}
                          onClick={() => handleAddTech(tech)}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    placeholder="List the requirements for this position (e.g. specific skills, education, certifications)..."
                    className="min-h-[150px]"
                    required
                  />
                  <p className="text-xs text-slate-500">Tip: Use bullet points for better readability</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="benefits">Benefits & Perks</Label>
                  <Textarea
                    id="benefits"
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleInputChange}
                    placeholder="List the benefits and perks offered with this position..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch 
                    id="featured" 
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => handleSwitchChange('isFeatured', checked)}
                  />
                  <Label htmlFor="featured">Feature this job (appears at the top of listings)</Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <Button variant="outline" type="button" onClick={() => setActiveTab("requirements")}>
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting Job...
                    </>
                  ) : (
                    "Post Job"
                  )}
                </Button>
              </CardFooter>
            </TabsContent>

           
          </Card>
        </form>
      </Tabs>
    </div>
  )
}
