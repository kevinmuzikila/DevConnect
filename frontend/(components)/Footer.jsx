import React from 'react'
import Link from 'next/link'

function Footer() {
  return (
    <div>
              <footer className="bg-white border-t border-slate-200 mt-8">
        <div className="container px-4 py-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center text-white font-bold text-xs">
                DC
              </div>
              <span className="text-sm font-semibold">DevConnect</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-600">
              <Link href="#" className="hover:text-blue-600">
                About
              </Link>
              <Link href="#" className="hover:text-blue-600">
                Privacy
              </Link>
              <Link href="#" className="hover:text-blue-600">
                Terms
              </Link>
              <Link href="#" className="hover:text-blue-600">
                Contact
              </Link>
            </div>
            <div className="text-xs text-slate-500">© 2025 DevJobs. All rights reserved.</div>
          </div>
        </div>
      </footer>


    </div>
  )
}

export default Footer