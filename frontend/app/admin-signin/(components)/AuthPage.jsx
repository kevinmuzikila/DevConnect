"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SignIn, SignUp } from "@clerk/nextjs"

export function AuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [userType, setUserType] = useState("user")

  // Form validation states
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [nameError, setNameError] = useState("")

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError("Email is required")
      return false
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address")
      return false
    }
    setEmailError("")
    return true
  }

  const validatePassword = (password) => {
    if (!password) {
      setPasswordError("Password is required")
      return false
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters")
      return false
    }
    setPasswordError("")
    return true
  }

  const validateName = (name) => {
    if (!name) {
      setNameError("Name is required")
      return false
    }
    setNameError("")
    return true
  }

  const handleLogin = (e) => {
    e.preventDefault()

    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (!isEmailValid || !isPasswordValid) {
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to dashboard based on user type
      if (userType === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/")
      }
    }, 1500)
  }

  const handleSignup = (e) => {
    e.preventDefault()

    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)
    const isNameValid = validateName(name)

    if (!isEmailValid || !isPasswordValid || !isNameValid) {
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to dashboard based on user type
      if (userType === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/")
      }
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Illustration */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 p-12 text-white flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center text-blue-600 font-bold">
              DC
            </div>
            <span className="text-2xl font-semibold">DevConnect</span>
          </Link>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold">Find your dream developer job</h1>
          <p className="text-xl opacity-90">
            Connect with top tech companies and startups looking for talent like you.
          </p>
          <div className="flex flex-col space-y-3 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">✓</div>
              <p>Access to thousands of developer jobs</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">✓</div>
              <p>Create a professional developer profile</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">✓</div>
              <p>Get matched with companies that fit your skills</p>
            </div>
          </div>
        </div>

        <div className="text-sm opacity-80">© 2025 DevConnect. All rights reserved.</div>
      </div>

      {/* Right side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md">
      <div className="flex justify-center mb-8 md:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center text-white font-bold">
                DC
              </div>
              <span className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DevConnect
              </span>
            </Link>
          </div>
       
      
      </div>
      </div>
    </div>
  )
}
