"use client"

import { useState, useEffect} from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Briefcase, Building2, MapPin, Search, Star, TrendingUp, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow, parseISO } from "date-fns"

export function Homepage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [latestJobs, setLatestJobs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  //===========================================================================================
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
        setLatestJobs(data);
        console.log("Latest jobs:", data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLatestJobs([]);
      } finally {
        setIsLoading(false);
      }
    };
    
      fetchJobs();
  }, []);


  //===========================================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}


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

                  <Link href="/auth">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Get Started
              </Button>
            </Link>
   
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



      {/* Latest Jobs Section */}
      <section className="py-16 px-4 bg-white">
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
                  <div className="w-18 h-18 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center text-white font-bold">
              DC
            </div>

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
                          <div className="text-lg font-semibold text-slate-800">R{job.salaryRange.min} - R{job.salaryRange.max}</div>
                          <div className="text-sm text-slate-500">{job.jobType}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-3 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="text-slate-400">•</div>
                        <div>{formatDistanceToNow(parseISO(job.createdAt), { addSuffix: true })}</div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {job.techStack.map((tag, index) => (
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
                    <Link href={`/dashboard/jobs/${job._id}`} className="text-blue-600 hover:text-blue-700 font-medium">
                      View Details
                    </Link>
                    <Link href={`/dashboard/jobs/${job._id}/apply`} >
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Apply Now
                    </Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="dashboard/jobs">
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
              Join thousands of developers who have found their dream jobs through DevConnect. Create your profile today
              and get discovered by top companies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8">
                  Create Account
                </Button>
              </Link>
              <Link href="dashboard/jobs">
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

     
    </div>
  )
}
