"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, AlertCircle, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProfileData {
  name: string
  title: string
  email: string
  location: string
  phone: string
  about: string
  skills: string[]
  experience: any[]
  education: any[]
  social: {
    linkedin: string
    github: string
    twitter: string
    website: string
  }
}

interface ProfileCompletionProps {
  profile: ProfileData
  onSectionClick: (section: string) => void
}

export function ProfileCompletion({ profile, onSectionClick }: ProfileCompletionProps) {
  const [completionScore, setCompletionScore] = useState(0)
  const [completionDetails, setCompletionDetails] = useState<{
    completed: string[]
    missing: string[]
  }>({ completed: [], missing: [] })

  useEffect(() => {
    calculateCompletion()
  }, [profile])

  const calculateCompletion = () => {
    const checks = [
      {
        key: "basic",
        label: "Basic Information",
        condition: profile.name && profile.title && profile.email && profile.location,
      },
      { key: "contact", label: "Contact Details", condition: profile.phone },
      { key: "about", label: "About Section", condition: profile.about && profile.about.length > 50 },
      { key: "skills", label: "Skills", condition: profile.skills.length >= 3 },
      { key: "experience", label: "Work Experience", condition: profile.experience.length >= 1 },
      { key: "education", label: "Education", condition: profile.education.length >= 1 },
      { key: "social", label: "Professional Links", condition: profile.social.linkedin || profile.social.github },
    ]

    const completed = checks.filter((check) => check.condition).map((check) => check.label)
    const missing = checks.filter((check) => !check.condition).map((check) => check.label)

    const score = Math.round((completed.length / checks.length) * 100)

    setCompletionScore(score)
    setCompletionDetails({ completed, missing })
  }

  const getScoreColor = () => {
    if (completionScore >= 80) return "text-green-600"
    if (completionScore >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = () => {
    if (completionScore >= 80) return "default"
    if (completionScore >= 60) return "secondary"
    return "destructive"
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Completion
            </CardTitle>
            <CardDescription>Complete your profile to increase your chances of getting hired</CardDescription>
          </div>
          <Badge variant={getScoreBadgeVariant()} className="text-lg px-3 py-1">
            {completionScore}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Profile Strength</span>
            <span className={getScoreColor()}>{completionScore}% Complete</span>
          </div>
          <Progress value={completionScore} className="h-2" />
        </div>

        {completionScore < 100 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-amber-700">
              <AlertCircle className="h-4 w-4" />
              Missing Sections
            </div>
            <div className="grid gap-2">
              {completionDetails.missing.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-amber-50 rounded-md">
                  <span className="text-sm text-amber-800">{item}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (item.includes("Basic") || item.includes("Contact")) onSectionClick("profile")
                      else if (item.includes("About") || item.includes("Skills") || item.includes("Professional"))
                        onSectionClick("profile")
                      else if (item.includes("Experience") || item.includes("Education")) onSectionClick("experience")
                    }}
                  >
                    Complete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {completionScore >= 80 && (
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-md">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">Great job!</p>
              <p className="text-xs text-green-600">Your profile is well-optimized for employers</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completionDetails.completed.length}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{completionDetails.missing.length}</div>
            <div className="text-xs text-muted-foreground">Remaining</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
