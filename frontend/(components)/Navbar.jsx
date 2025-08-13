"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Features", href: "#" },
    { name: "How It Works", href: "#" },
    { name: "Testimonials", href: "#" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold mr-2">
                JI
              </div>
              <span className="text-2xl font-bold text-primary">JobIntel</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <a key={index} href={link.href} className="text-primary hover:text-coral font-medium transition-colors">
                {link.name}
              </a>
            ))}
          </nav>

          {/* CTA Button (Desktop) */}
          <div className="hidden md:block">
            <Button className="bg-coral hover:bg-coral/90 text-white rounded-xl px-6 py-2 shadow-md hover:shadow-lg transition-all">
              Sign Up Free
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg bg-white text-primary hover:bg-peach/20 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 px-2 bg-white rounded-2xl shadow-lg mb-4 animate-accordion-down">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-primary hover:text-coral font-medium px-4 py-2 rounded-lg hover:bg-peach/10 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-2 px-4">
                <Button className="bg-coral hover:bg-coral/90 text-white rounded-xl w-full shadow-md hover:shadow-lg transition-all">
                  Sign Up Free
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
