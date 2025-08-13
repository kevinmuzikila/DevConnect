"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bookmark, BookmarkCheck, Filter, Search, Calendar} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow, parseISO } from "date-fns"


// Sample data for job listings

export function JobListings() {
    const [jobs, setJobs] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [locationFilter, setLocationFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState("all")

    // Toggle saved status
    const toggleSaved = (jobId) => {
        setJobs(jobs.map((job) => (job.id === jobId ? { ...job, saved: !job.saved } : job)))
    }

    // Filter jobs based on search query, location filter, and type filter
    const filteredJobs = jobs.filter((job) => {
        const matchesSearch =
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesLocation =
            locationFilter === "all" ||
            (locationFilter === "remote" && job.location.toLowerCase() === "remote") ||
            (locationFilter === "onsite" && job.location.toLowerCase() !== "remote")

        const matchesType = typeFilter === "all" || job.type.toLowerCase() === typeFilter.toLowerCase()

        return matchesSearch && matchesLocation && matchesType
    })
    //=========================================================================================================
    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true); // ✅ show loading if needed
            try {
                const response = await fetch('http://localhost:5000/api/jobs');
                if (!response.ok) {
                    throw new Error('Failed to fetch jobs');
                }
                const data = await response.json();
                console.log("✅ Fetched jobs:", data);
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

    //===========================================================================================================

    // Get unique locations for filter
    const locations = Array.from(new Set(jobs.map((job) => (job.location === "Remote" ? "Remote" : "Onsite"))))

    // Get unique job types for filter
    const jobTypes = Array.from(new Set(jobs.map((job) => job.type)))

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Browse Jobs</h1>
                <p className="text-muted-foreground">Explore job opportunities that match your skills</p>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search jobs by title, company, or skills..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select value={locationFilter} onValueChange={setLocationFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Location" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Locations</SelectItem>
                                    <SelectItem value="remote">Remote</SelectItem>
                                    <SelectItem value="onsite">Onsite</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Job Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {jobTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Job Listings */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle>Available Jobs</CardTitle>
                    <CardDescription>
                        Showing {filteredJobs.length} of {jobs.length} jobs
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => (
                                <div key={job.id} className="border rounded-lg overflow-hidden hover:border-blue-200 transition-colors">
                                    <div className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                <Avatar className="h-10 w-10 rounded-md">
                                                    <AvatarImage src={job.logo || "/placeholder.svg"} alt={job.company} />
                                                    <AvatarFallback className="rounded-md bg-slate-100 text-slate-800">
                                                        {job.company.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-semibold text-lg">{job.title}</h3>
                                                    <p className="text-slate-600">{job.company}</p>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="bg-slate-50">
                                                            {job.location}
                                                        </Badge>
                                                        <Badge variant="outline" className="bg-slate-50">
                                                            {job.type}
                                                        </Badge>
                                                        <Badge variant="outline" className="bg-slate-50">
                                                            {job.salary}
                                                        </Badge>
                                                        <Badge variant="outline" className="flex items-center gap-1 text-xs">
                                                            Posted {formatDistanceToNow(parseISO(job.updatedAt), { addSuffix: true })}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={job.saved ? "text-blue-600" : "text-slate-400"}
                                                onClick={() => toggleSaved(job.id)}
                                            >
                                                {job.saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                                                <span className="sr-only">{job.saved ? "Unsave" : "Save"} job</span>
                                            </Button>
                                        </div>
                                        <p className="mt-3 text-slate-600">{job.description}</p>
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {job.techStack.map((tag) => (
                                                <Badge key={tag} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-100">
                                        <span className="text-xs text-slate-500"></span>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/dashboard/jobs/${job._id}`}>View Details</Link>
                                            </Button>
                                            <Button size="sm" asChild>
                                                <Link href={`/dashboard/jobs/${job._id}/apply`}>Apply Now</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-muted-foreground">No jobs found matching your criteria</p>
                                <Button
                                    className="mt-4"
                                    onClick={() => {
                                        setSearchQuery("")
                                        setLocationFilter("all")
                                        setTypeFilter("all")
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
