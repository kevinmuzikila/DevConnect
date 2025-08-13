"use client"

import { useState, useEffect} from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Bookmark,
  BookmarkCheck,
  Filter,

} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

import { Separator } from "@/components/ui/separator"
import { useMobile } from "@/hooks/use-mobile"


  // Featured companies
  const featuredCompanies = [

  ]

function MainContent() {

  const isMobile = useMobile()
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(false)


  //================================================================================================================
 useEffect(() => {
  console.log("useEffect running"); // Add this line
  const fetchJobs = async () => {
    console.log("Fetching jobs...");
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/jobs');
      console.log("Fetch response:", response);
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      console.log("Fetched jobs:", data);
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };
  
    fetchJobs();
}, []);

const toggleSaved = (jobId) => {
  setJobs(jobs.map((job) => (job._id === jobId ? { ...job, isSaved: !job.isSaved } : job)))
}

const filteredJobs = showSavedOnly ? jobs.filter((job) => job.isSaved) : jobs
//===========================================================================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    {/* Header */}
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center text-white font-bold">
            JD
          </div>
          <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            DevJobs
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/jobs" className="text-slate-600 hover:text-blue-600 transition-colors">
            Find Jobs
          </Link>
          <Link href="/companies" className="text-slate-600 hover:text-blue-600 transition-colors">
            Companies
          </Link>
          <Link href="/about" className="text-slate-600 hover:text-blue-600 transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/auth">
            <Button variant="ghost" className="text-slate-600">
              Sign In
            </Button>
          </Link>
          <Link href="/auth">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>

    {/* Hero Section */}
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
            Find Your Dream{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Developer Job
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Connect with top tech companies and discover opportunities that match your skills. Join thousands of
            developers who found their perfect role through DevJobs.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-xl shadow-lg border border-slate-200">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search for jobs, companies, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-0 focus-visible:ring-0 text-lg h-12"
                />
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <Input placeholder="Location" className="pl-10 border-0 focus-visible:ring-0 h-12 w-40" />
                </div>
                <Button className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Search Jobs
                </Button>
              </div>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="flex flex-wrap justify-center gap-2 mb-16">
            <span className="text-sm text-slate-500 mr-2">Popular:</span>
            {["React Developer", "Node.js", "Python", "Remote", "Senior"].map((term) => (
              <Badge
                key={term}
                variant="secondary"
                className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 transition-colors"
              >
                {term}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Stats Section */}
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-2">{stat.value}</div>
              <div className="text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Latest Jobs Section */}
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Latest Job Opportunities</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Discover the newest openings from top tech companies. Updated every hour.
          </p>
        </div>

        <div className="grid gap-6 max-w-4xl mx-auto">
          {latestJobs.map((job) => (
            <Card
              key={job.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Image
                    src={job.logo || "/placeholder.svg"}
                    alt={job.company}
                    width={56}
                    height={56}
                    className="rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-semibold text-slate-800">{job.title}</h3>
                          {job.isNew && <Badge className="bg-green-100 text-green-700 hover:bg-green-100">New</Badge>}
                        </div>
                        <p className="text-slate-600 font-medium">{job.company}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-slate-800">{job.salary}</div>
                        <div className="text-sm text-slate-500">{job.type}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="text-slate-400">•</div>
                      <div>{job.postedDate}</div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                <div className="flex items-center justify-between w-full">
                  <Link href={`/jobs/${job.id}`} className="text-blue-600 hover:text-blue-700 font-medium">
                    View Details
                  </Link>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Apply Now
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/jobs">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
            >
              View All Jobs
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of developers who have found their dream jobs through DevJobs. Create your profile today
            and get discovered by top companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8">
                Create Account
              </Button>
            </Link>
            <Link href="/jobs">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 bg-transparent"
              >
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-slate-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center text-white font-bold">
                JD
              </div>
              <span className="text-xl font-semibold">DevJobs</span>
            </div>
            <p className="text-slate-400 mb-4">
              The premier platform for connecting talented developers with innovative companies.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-700">
                <Star className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-700">
                <Star className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-700">
                <Star className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Developers</h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/jobs" className="hover:text-white">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-white">
                  Companies
                </Link>
              </li>
              <li>
                <Link href="/salary" className="hover:text-white">
                  Salary Guide
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Employers</h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/post-job" className="hover:text-white">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/talent" className="hover:text-white">
                  Browse Talent
                </Link>
              </li>
              <li>
                <Link href="/enterprise" className="hover:text-white">
                  Enterprise
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2025 DevJobs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
    )
  }
  