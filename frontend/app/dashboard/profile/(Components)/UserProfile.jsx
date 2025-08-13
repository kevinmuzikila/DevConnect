"use client"

import { useEffect, useState } from "react"
import {
  Camera,
  CheckCircle2,
  Edit,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Save,
  Twitter,
  Phone,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ProfileCompletion } from "./ProfileCompletion"
import { ProfileTips } from "./ProfileTips"
import { useUser } from "@clerk/nextjs"



export function UserProfile() {
  const [profile, setProfile] = useState({
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
  
  const [isEditing, setIsEditing] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const [activeTab, setActiveTab] = useState("profile")
  const [loading, setLoading] = useState(true);
  const { user } = useUser()
  const userId = user?.id;

  const validateProfile = () => {
    const errors = []

    if (!profile.name.trim()) errors.push("Name is required")
    if (!profile.email.trim()) errors.push("Email is required")
    if (!profile.email.includes("@")) errors.push("Valid email is required")
    if (!profile.title.trim()) errors.push("Professional title is required")

    return errors
  }

  // Handle adding a new skill
  const handleAddSkill = () => {
    if (newSkill.trim() !== "" && !profile.skills.includes(newSkill)) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill],
      })
      setNewSkill("")
    }
  }

  // Handle removing a skill
  const handleRemoveSkill = (skill) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skill),
    })
  }

  // Handle saving profile changes
  const handleSaveProfile = () => {
    const errors = validateProfile()
    if (errors.length > 0) {
      alert("Please fix the following errors:\n" + errors.join("\n"))
      return
    }

    setIsEditing(false)
    // In a real app, you would save the profile to the backend here
    console.log("Profile saved:", profile)
  }
 //=====================================================================================================
 const handleSave = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...profile }), // profile is your form state
    });

    const data = await res.json();
    if (res.ok) {
      alert("Profile saved!");
      setProfile(data);
    } else {
      alert("Failed to save profile");
    }
  } catch (err) {
    console.error("Save error:", err);
  }
};
//============================================================================================================
useEffect(() => {
  if (!userId) return;

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/profile/${userId}`);
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
      } else {
        console.warn("No profile found");
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, [userId]);




//============================================================================================================
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal and professional information</p>
        </div>
        <div>
          {isEditing ? (
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <ProfileCompletion profile={profile} onSectionClick={(section) => setActiveTab(section)} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6 mt-6">
              {/* Profile Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="/placeholder.svg?height=96&width=96" alt={profile.name} />
                        <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {(user?.firstName?.[0] || "") + (user?.lastName?.[0] || "")}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="avatar-upload"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                // In a real app, you would upload the file and get a URL
                                console.log("File selected:", file.name)
                              }
                            }}
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white"
                            onClick={() => document.getElementById("avatar-upload")?.click()}
                          >
                            <Camera className="h-4 w-4" />
                            <span className="sr-only">Change profile picture</span>
                          </Button>
                        </>
                      )}
                    </div>
                    <div className="flex-1 space-y-4">
                      {isEditing ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Full Name</Label>
                              <Input
                                id="name"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="title">Professional Title</Label>
                              <Input
                                id="title"
                                value={profile.title}
                                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={profile.email }
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone</Label>
                              <Input
                                id="phone"
                                value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              value={profile.location}
                              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <h2 className="text-2xl font-bold">{profile.name || user?.fullName}</h2>
                            <p className="text-lg text-slate-600">{profile.title || "N/A"}</p>
                            <div className="flex items-center gap-2 mt-2 text-slate-500">
                              <MapPin className="h-4 w-4" />
                              <span>{profile.location || "N/A"}</span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-slate-500" />
                              <p className="text-blue-600 hover:underline">
                                {profile.email || user?.emailAddresses?.[0]?.emailAddress }
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-slate-500" />
                              <span>{profile.phone || "N/A"}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {profile.social.linkedin && (
                              <Button variant="outline" size="icon" asChild>
                                <a
                                  href={`https://${profile.social.linkedin}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Linkedin className="h-4 w-4" />
                                  <span className="sr-only">LinkedIn</span>
                                </a>
                              </Button>
                            )}
                            {profile.social.github && (
                              <Button variant="outline" size="icon" asChild>
                                <a href={`https://${profile.social.github}`} target="_blank" rel="noopener noreferrer">
                                  <Github className="h-4 w-4" />
                                  <span className="sr-only">GitHub</span>
                                </a>
                              </Button>
                            )}
                            {profile.social.twitter && (
                              <Button variant="outline" size="icon" asChild>
                                <a href={`https://${profile.social.twitter}`} target="_blank" rel="noopener noreferrer">
                                  <Twitter className="h-4 w-4" />
                                  <span className="sr-only">Twitter</span>
                                </a>
                              </Button>
                            )}
                            {profile.social.website && (
                              <Button variant="outline" size="icon" asChild>
                                <a href={`https://${profile.social.website}`} target="_blank" rel="noopener noreferrer">
                                  <Globe className="h-4 w-4" />
                                  <span className="sr-only">Website</span>
                                </a>
                              </Button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                  <CardDescription>Tell employers about yourself</CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={profile.about}
                      onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                      className="min-h-[150px]"
                    />
                  ) : (
                    <p className="text-slate-600">{profile.about}</p>
                  )}
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                  <CardDescription>Your technical and professional skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 py-1.5 pl-3 pr-2 flex items-center gap-1"
                        >
                          {skill}
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 rounded-full hover:bg-blue-100"
                              onClick={() => handleRemoveSkill(skill)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove {skill}</span>
                            </Button>
                          )}
                        </Badge>
                      ))}
                    </div>

                    {isEditing && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a skill..."
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              handleAddSkill()
                            }
                          }}
                        />
                        <Button type="button" onClick={handleAddSkill}>
                          Add
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              {isEditing && (
                <Card>
                  <CardHeader>
                    <CardTitle>Social Links</CardTitle>
                    <CardDescription>Connect your professional profiles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                              linkedin.com/in/
                            </span>
                            <Input
                              id="linkedin"
                              value={profile.social.linkedin.replace("linkedin.com/in/", "")}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  social: { ...profile.social, linkedin: `linkedin.com/in/${e.target.value}` },
                                })
                              }
                              className="rounded-l-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="github">GitHub</Label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                              github.com/
                            </span>
                            <Input
                              id="github"
                              value={profile.social.github.replace("github.com/", "")}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  social: { ...profile.social, github: `github.com/${e.target.value}` },
                                })
                              }
                              className="rounded-l-none"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="twitter">Twitter</Label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                              twitter.com/
                            </span>
                            <Input
                              id="twitter"
                              value={profile.social.twitter.replace("twitter.com/", "")}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  social: { ...profile.social, twitter: `twitter.com/${e.target.value}` },
                                })
                              }
                              className="rounded-l-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Personal Website</Label>
                          <Input
                            id="website"
                            value={profile.social.website}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                social: { ...profile.social, website: e.target.value },
                              })
                            }
                            placeholder="example.com"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-6 mt-6">
              {/* Work Experience */}
              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                  <CardDescription>Your professional history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {profile.experience.map((exp) => (
                      <div key={exp.id} className="border-b border-slate-200 last:border-0 pb-6 last:pb-0">
                        {isEditing ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`title-${exp.id}`}>Job Title</Label>
                                <Input
                                  id={`title-${exp.id}`}
                                  value={exp.title}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      experience: profile.experience.map((item) =>
                                        item.id === exp.id ? { ...item, title: e.target.value } : item,
                                      ),
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`company-${exp.id}`}>Company</Label>
                                <Input
                                  id={`company-${exp.id}`}
                                  value={exp.company}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      experience: profile.experience.map((item) =>
                                        item.id === exp.id ? { ...item, company: e.target.value } : item,
                                      ),
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`location-${exp.id}`}>Location</Label>
                                <Input
                                  id={`location-${exp.id}`}
                                  value={exp.location}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      experience: profile.experience.map((item) =>
                                        item.id === exp.id ? { ...item, location: e.target.value } : item,
                                      ),
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`start-${exp.id}`}>Start Date</Label>
                                <Input
                                  id={`start-${exp.id}`}
                                  value={exp.startDate}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      experience: profile.experience.map((item) =>
                                        item.id === exp.id ? { ...item, startDate: e.target.value } : item,
                                      ),
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`end-${exp.id}`}>End Date</Label>
                                <Input
                                  id={`end-${exp.id}`}
                                  value={exp.endDate}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      experience: profile.experience.map((item) =>
                                        item.id === exp.id ? { ...item, endDate: e.target.value } : item,
                                      ),
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`description-${exp.id}`}>Description</Label>
                              <Textarea
                                id={`description-${exp.id}`}
                                value={exp.description}
                                onChange={(e) =>
                                  setProfile({
                                    ...profile,
                                    experience: profile.experience.map((item) =>
                                      item.id === exp.id ? { ...item, description: e.target.value } : item,
                                    ),
                                  })
                                }
                                className="min-h-[100px]"
                              />
                            </div>
                            <div className="flex justify-end">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this experience?")) {
                                    setProfile({
                                      ...profile,
                                      experience: profile.experience.filter((item) => item.id !== exp.id),
                                    })
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold">{exp.title}</h3>
                              <div className="text-sm text-slate-500">
                                {exp.startDate} - {exp.endDate}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 mb-2">
                              <span className="font-medium">{exp.company}</span>
                              <span>•</span>
                              <span>{exp.location}</span>
                            </div>
                            <p className="text-slate-600">{exp.description}</p>
                          </div>
                        )}
                      </div>
                    ))}

                    {isEditing && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          setProfile({
                            ...profile,
                            experience: [
                              ...profile.experience,
                              {
                                id: Date.now(),
                                title: "",
                                company: "",
                                location: "",
                                startDate: "",
                                endDate: "",
                                description: "",
                              },
                            ],
                          })
                        }
                      >
                        Add Work Experience
                      </Button>
                      
                    )}
                    
                  </div>
                </CardContent>
                
              </Card>
              <div className="flex ">
                <div>

                </div>
         
              </div>           
              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>Your educational background</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {profile.education.map((edu) => (
                      <div key={edu.id} className="border-b border-slate-200 last:border-0 pb-6 last:pb-0">
                        {isEditing ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                                <Input
                                  id={`degree-${edu.id}`}
                                  value={edu.degree}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      education: profile.education.map((item) =>
                                        item.id === edu.id ? { ...item, degree: e.target.value } : item,
                                      ),
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`institution-${edu.id}`}>Institution</Label>
                                <Input
                                  id={`institution-${edu.id}`}
                                  value={edu.institution}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      education: profile.education.map((item) =>
                                        item.id === edu.id ? { ...item, institution: e.target.value } : item,
                                      ),
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`edu-location-${edu.id}`}>Location</Label>
                                <Input
                                  id={`edu-location-${edu.id}`}
                                  value={edu.location}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      education: profile.education.map((item) =>
                                        item.id === edu.id ? { ...item, location: e.target.value } : item,
                                      ),
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`edu-start-${edu.id}`}>Start Date</Label>
                                <Input
                                  id={`edu-start-${edu.id}`}
                                  value={edu.startDate}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      education: profile.education.map((item) =>
                                        item.id === edu.id ? { ...item, startDate: e.target.value } : item,
                                      ),
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`edu-end-${edu.id}`}>End Date</Label>
                                <Input
                                  id={`edu-end-${edu.id}`}
                                  value={edu.endDate}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      education: profile.education.map((item) =>
                                        item.id === edu.id ? { ...item, endDate: e.target.value } : item,
                                      ),
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this education?")) {
                                    setProfile({
                                      ...profile,
                                      education: profile.education.filter((item) => item.id !== edu.id),
                                    })
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold">{edu.degree}</h3>
                              <div className="text-sm text-slate-500">
                                {edu.startDate} - {edu.endDate}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              <span className="font-medium">{edu.institution}</span>
                              <span>•</span>
                              <span>{edu.location}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {isEditing && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          setProfile({
                            ...profile,
                            education: [
                              ...profile.education,
                              {
                                id: Date.now(),
                                degree: "",
                                institution: "",
                                location: "",
                                startDate: "",
                                endDate: "",
                              },
                            ],
                          })
                        }
                      >
                        Add Education
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Preferences</CardTitle>
                  <CardDescription>Set your job search preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="job-alerts">Job Alerts</Label>
                        <p className="text-sm text-slate-500">Receive notifications about new job postings</p>
                      </div>
                      <Switch
                        id="job-alerts"
                        checked={profile.preferences.jobAlerts}
                        onCheckedChange={(checked) =>
                          setProfile({
                            ...profile,
                            preferences: { ...profile.preferences, jobAlerts: checked },
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="remote-only">Remote Only</Label>
                        <p className="text-sm text-slate-500">Only show remote job opportunities</p>
                      </div>
                      <Switch
                        id="remote-only"
                        checked={profile.preferences.remoteOnly}
                        onCheckedChange={(checked) =>
                          setProfile({
                            ...profile,
                            preferences: { ...profile.preferences, remoteOnly: checked },
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="job-type">Job Type</Label>
                      <Select
                        value={profile.preferences.jobType}
                        onValueChange={(value) =>
                          setProfile({
                            ...profile,
                            preferences: { ...profile.preferences, jobType: value },
                          })
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger id="job-type">
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Freelance">Freelance</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="salary">Expected Salary Range</Label>
                      <Select
                        value={profile.preferences.salary}
                        onValueChange={(value) =>
                          setProfile({
                            ...profile,
                            preferences: { ...profile.preferences, salary: value },
                          })
                        }
                        disabled={!isEditing}
                      >
                        <SelectTrigger id="salary">
                          <SelectValue placeholder="Select salary range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="$50,000 - $80,000">R50,000 - R80,000</SelectItem>
                          <SelectItem value="$80,000 - $100,000">R80,000 - R100,000</SelectItem>
                          <SelectItem value="$100,000 - $120,000">R100,000 - R120,000</SelectItem>
                          <SelectItem value="$120,000 - $150,000">R120,000 - R150,000</SelectItem>
                          <SelectItem value="$150,000+">R150,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="locations">Preferred Locations</Label>
                      <Input id="locations" placeholder="e.g. New York, Remote, San Francisco" disabled={!isEditing} />
                      <p className="text-xs text-slate-500">Enter multiple locations separated by commas</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-slate-50">
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Preferences last </span>
                    </div>
                    {isEditing && <Button onClick={handleSaveProfile}>Save Preferences</Button>}
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control your profile visibility and data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="profile-visibility">Profile Visibility</Label>
                        <p className="text-sm text-slate-500">Make your profile visible to employers</p>
                      </div>
                      <Switch id="profile-visibility" defaultChecked disabled={!isEditing} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="resume-visibility">Resume Visibility</Label>
                        <p className="text-sm text-slate-500">Allow employers to download your resume</p>
                      </div>
                      <Switch id="resume-visibility" defaultChecked disabled={!isEditing} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="contact-info">Contact Information</Label>
                        <p className="text-sm text-slate-500">Show contact information to employers</p>
                      </div>
                      <Switch id="contact-info" defaultChecked disabled={!isEditing} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="lg:col-span-1">
          <ProfileTips />
        </div>
      </div>
    </div>
  )
}
