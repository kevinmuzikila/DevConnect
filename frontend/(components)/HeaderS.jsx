'use client'
import React from 'react'
import Link from "next/link"
import {
    Bell,
    Bookmark,
    ChevronDown,
    LogOut,
    Menu,
    MessageSquare,
    Search,
    Settings,
 
    User,
  } from "lucide-react"
  import { Button } from "@/components/ui/button"
  import { useMobile } from "@/hooks/use-mobile"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Input } from "@/components/ui/input"
  import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
  import { Checkbox } from "@/components/ui/checkbox"
  import { Label } from "@/components/ui/label"
  import { Separator } from "@/components/ui/separator"
  import { Badge } from "@/components/ui/badge"


function HeaderS() {
const isMobile = useMobile()



  return (
    <div>
              <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <div className="flex items-center gap-2">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] p-0">
                  <div className="p-4 pt-8">
                    <h2 className="mb-4 text-lg font-semibold">Filters</h2>
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>
            )}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center text-white font-bold">
                DC
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DevConnect
              </span>
            </Link>
 
          </div>

        </div>
      </header>


    </div>
  )
}

export default HeaderS


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