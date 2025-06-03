"use client"

import { useState } from "react"
import { Search, Globe, Sun, Moon, ChevronDown, Heart } from "lucide-react"

export function Navigation() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {/* Three-circle logo */}
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>

            {/* App name with dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-1 text-lg font-semibold text-gray-900 hover:text-gray-700"
              >
                <span>AI Component Gen</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Dashboard
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Templates
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Settings
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="flex items-center space-x-4">
          <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 cursor-pointer" />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium">
            Subscribe
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <Search className="w-5 h-5 text-gray-600 hover:text-gray-800 cursor-pointer" />
          <Globe className="w-5 h-5 text-gray-600 hover:text-gray-800 cursor-pointer" />

          {/* Dark/Light mode toggle */}
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-1 text-gray-600 hover:text-gray-800">
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button className="text-gray-700 hover:text-gray-900 font-medium">Log In</button>

          <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors font-medium">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  )
}
