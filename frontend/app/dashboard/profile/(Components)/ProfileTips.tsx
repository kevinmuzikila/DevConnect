"use client"

import { Lightbulb, Target, Users, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ProfileTips() {
  const tips = [
    {
      icon: Target,
      title: "Optimize Your Headline",
      description: "Use keywords that recruiters search for in your professional title",
      example: "Instead of 'Developer', try 'Senior React Developer | JavaScript Expert'",
    },
    {
      icon: Users,
      title: "Showcase Your Impact",
      description: "Quantify your achievements with numbers and results",
      example: "Increased website performance by 40% and reduced load time by 2 seconds",
    },
    {
      icon: Zap,
      title: "Keep Skills Current",
      description: "Add trending technologies and remove outdated ones",
      example: "Include modern frameworks like Next.js, TypeScript, and cloud platforms",
    },
    {
      icon: Lightbulb,
      title: "Professional Photo",
      description: "Use a high-quality, professional headshot",
      example: "Clear background, professional attire, and friendly expression",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Profile Tips
        </CardTitle>
        <CardDescription>Improve your profile to stand out to employers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tips.map((tip, index) => (
          <Alert key={index} className="border-l-4 border-l-blue-500">
            <tip.icon className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">{tip.title}</p>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
                <p className="text-xs text-blue-600 italic">{tip.example}</p>
              </div>
            </AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  )
}
