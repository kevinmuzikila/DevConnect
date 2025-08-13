"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Bell,
 
    Briefcase,
    FileText,
    Home,

    Menu,
    MessageSquare,
    Search,
    Settings,
    User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
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
import { Badge } from "@/components/ui/badge"
import { SignOutButton, useUser } from "@clerk/nextjs"

export function UserDashboardLayout({ children }) {
    const pathname = usePathname()
    const { user } = useUser();

    const isActive = (path) => {
        return pathname === path
    }

    const navigationItems = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: Home,
        },
        {
            name: "Applications",
            href: "/dashboard/applications",
            icon: Briefcase,
    
        },
        {
            name: "Jobs",
            href: "/dashboard/jobs",
            icon: FileText,
        },
        {
            name: "Profile",
            href: "/dashboard/profile",
            icon: User,
        },
    ]

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar for desktop */}
            <aside className="hidden md:flex md:w-64 md:flex-col border-r border-slate-200">
                <div className="flex flex-col flex-1">
                    <div className="flex h-16 items-center border-b border-slate-200 px-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center text-white font-bold">
                                DC
                            </div>
                            <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                DevConnect
                            </span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-4">
                        <nav className="space-y-1 px-4">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center justify-between px-3 py-2 rounded-md text-sm ${isActive(item.href) ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="h-5 w-5" />
                                        <span>{item.name}</span>
                                    </div>
                                    {item.badge && <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{item.badge}</Badge>}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="border-t border-slate-200 p-4">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                    {(user?.firstName?.[0] || "") + (user?.lastName?.[0] || "")}
                                </AvatarFallback>

                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium">{user?.fullName}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.emailAddresses?.[0]?.emailAddress}</p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                        <span className="sr-only">Open user menu</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                                            <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                                        </svg>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/profile">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/settings">
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <SignOutButton/>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile header */}
            <div className="flex flex-1 flex-col">
                <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-4 md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[280px] p-0">
                            <div className="p-4 border-b">
                                <Link href="/" className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center text-white font-bold">
                                        DC
                                    </div>
                                    <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        DevConnect
                                    </span>
                                </Link>
                            </div>
                            <div className="p-4">
                                <nav className="space-y-2">
                                    {navigationItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center justify-between px-3 py-2 rounded-md text-sm ${isActive(item.href) ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon className="h-5 w-5" />
                                                <span>{item.name}</span>
                                            </div>
                                            {item.badge && (
                                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{item.badge}</Badge>
                                            )}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center text-white font-bold">
                            DC
                        </div>
                        <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            DevConnect
                        </span>
                    </Link>

                    <div className="flex flex-1 items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="text-slate-600">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-600">
                            <MessageSquare className="h-5 w-5" />
                        </Button>
                        <Avatar>
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">JD</AvatarFallback>
                        </Avatar>
                    </div>
                </header>

                {/* Search bar for mobile */}
                <div className="p-3 md:hidden bg-white border-t border-slate-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input placeholder="Search jobs..." className="pl-9 bg-slate-50 border-slate-200" />
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1 p-4 md:p-6">{children}</main>
            </div>
        </div>
    )
}
