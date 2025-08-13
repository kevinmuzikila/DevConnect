"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SignIn, SignInButton, SignUp } from "@clerk/nextjs"

export function AuthPage() {
  const router = useRouter()
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  // Form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
 
  //=======================================================================================
  const handleAdminLogin = async (e) => {
    console.log("email" , email)
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        return;
      }
  
      // Store session info or redirect
      console.log("✅ Admin logged in:", data);
      router.push("/admin"); // or your admin dashboard
    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };
  

  //========================================================================================

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-all duration-700 ease-in-out ${showAdminLogin ? "md:flex-row-reverse" : ""}`}>

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
          {showAdminLogin ? (
  <>
    <h2 className="text-xl font-semibold mb-4 text-center">Admin Login</h2>
    <form onSubmit={handleAdminLogin} className="space-y-4">
  <input
    type="email"
    placeholder="Admin email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full px-4 py-2 border rounded"
    required
  />
  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full px-4 py-2 border rounded"
    required
  />
  <button
    type="submit"
    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
  >
    Login as Admin
  </button>
</form>
    <div className="text-center mt-4">
      <button
        onClick={() => setShowAdminLogin(false)}
        className="text-sm text-slate-600 hover:underline"
      >
        Back to Sign Up
      </button>
    </div>
  </>
) : (
  <>
    <SignUp />
   
    <div className="text-center mt-4">
    <button
        onClick={() => setShowAdminLogin(true)}
        className="text-sm text-blue-600 hover:underline transition"
      >
        Or log in as Admin
      </button>
    </div>
  </>
)}
     
      </div>
      </div>
    </div>

    
  )

  

  
}
