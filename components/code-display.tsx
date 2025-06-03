"use client"

import { useState, useMemo } from "react"
import { Copy, Check, RotateCcw, Eye, Code, Download, ExternalLink } from "lucide-react"

interface CodeDisplayProps {
  code: string
  prompt: string
  onReset: () => void
}

export function CodeDisplay({ code, prompt, onReset }: CodeDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview")
  const [previewError, setPreviewError] = useState<string>("")

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy code:", error)
    }
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "GeneratedComponent.tsx"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const openInCodeSandbox = () => {
    const files = {
      "package.json": {
        content: {
          dependencies: {
            react: "^18.0.0",
            "react-dom": "^18.0.0",
            "react-scripts": "^5.0.0",
            tailwindcss: "^3.0.0",
          },
        },
      },
      "src/App.js": {
        content: `import React from 'react'
import GeneratedComponent from './GeneratedComponent'
import './index.css'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Generated Component Preview</h1>
        <GeneratedComponent />
      </div>
    </div>
  )
}`,
      },
      "src/GeneratedComponent.tsx": {
        content: code,
      },
      "src/index.css": {
        content: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
      },
      "tailwind.config.js": {
        content: `module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
}`,
      },
    }

    const parameters = {
      files,
      template: "create-react-app-typescript",
    }

    const url = `https://codesandbox.io/api/v1/sandboxes/define?parameters=${btoa(JSON.stringify(parameters))}`
    window.open(url, "_blank")
  }

  // Replace the LivePreview useMemo implementation with:
  const componentType = useMemo(() => {
    const lowerCode = code.toLowerCase()

    if (lowerCode.includes("form") || (lowerCode.includes("input") && lowerCode.includes("submit"))) {
      return "form"
    } else if (lowerCode.includes("button") && !lowerCode.includes("form")) {
      return "button"
    } else if (lowerCode.includes("card") || (lowerCode.includes("div") && lowerCode.includes("shadow"))) {
      return "card"
    } else if (lowerCode.includes("modal") || lowerCode.includes("dialog")) {
      return "modal"
    } else if (lowerCode.includes("pricing") || (lowerCode.includes("plan") && lowerCode.includes("price"))) {
      return "pricing"
    } else if (lowerCode.includes("dashboard") || (lowerCode.includes("stat") && lowerCode.includes("chart"))) {
      return "dashboard"
    } else if (lowerCode.includes("nav") || lowerCode.includes("menu")) {
      return "navigation"
    } else {
      return "generic"
    }
  }, [code])

  // Replace the renderPreview function with:
  const renderPreview = () => {
    // Extract component name if possible
    const componentMatch = code.match(/export default function (\w+)/) || code.match(/function (\w+)/)
    const componentName = componentMatch ? componentMatch[1] : "Component"

    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <div className="text-xs text-gray-500">Preview Mode</div>
          </div>

          {componentType === "form" && (
            <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{componentName}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="john@example.com"
                  />
                </div>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Submit</button>
              </div>
            </div>
          )}

          {componentType === "button" && (
            <div className="p-6 flex flex-col items-center justify-center space-y-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                {componentName}
              </button>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Success</button>
                <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Danger</button>
              </div>
            </div>
          )}

          {componentType === "card" && (
            <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{componentName}</h3>
                <p className="text-gray-600 mb-4">This is a preview of the card component you generated.</p>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Learn More</button>
              </div>
            </div>
          )}

          {componentType === "modal" && (
            <div className="relative p-8 bg-white rounded-lg shadow-lg border border-gray-200 max-w-md mx-auto">
              <div className="absolute top-3 right-3">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{componentName}</h3>
              <p className="text-gray-600 mb-6">This is a preview of the modal dialog component you generated.</p>
              <div className="flex space-x-3">
                <button className="flex-1 bg-gray-100 text-gray-900 py-2 px-4 rounded-lg">Cancel</button>
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg">Confirm</button>
              </div>
            </div>
          )}

          {componentType === "pricing" && (
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h3 className="text-lg font-bold mb-2">Basic</h3>
                  <div className="mb-4">
                    <span className="text-2xl font-bold">$9</span>
                    <span className="text-gray-600">/mo</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Feature 1
                    </li>
                    <li className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Feature 2
                    </li>
                  </ul>
                  <button className="w-full py-2 px-4 bg-gray-100 text-gray-900 rounded-lg">Choose</button>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-500 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">Popular</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Pro</h3>
                  <div className="mb-4">
                    <span className="text-2xl font-bold">$29</span>
                    <span className="text-gray-600">/mo</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Feature 1
                    </li>
                    <li className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Feature 2
                    </li>
                    <li className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Feature 3
                    </li>
                  </ul>
                  <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg">Choose</button>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h3 className="text-lg font-bold mb-2">Enterprise</h3>
                  <div className="mb-4">
                    <span className="text-2xl font-bold">$99</span>
                    <span className="text-gray-600">/mo</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      All Features
                    </li>
                    <li className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Priority Support
                    </li>
                  </ul>
                  <button className="w-full py-2 px-4 bg-gray-100 text-gray-900 rounded-lg">Choose</button>
                </div>
              </div>
            </div>
          )}

          {componentType === "dashboard" && (
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Total Users</h3>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold text-gray-900">12,345</span>
                    <span className="text-sm font-medium text-green-600">+12%</span>
                  </div>
                  <div className="mt-4 bg-gray-100 rounded-full h-2">
                    <div className="h-2 rounded-full bg-green-500" style={{ width: "60%" }}></div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Revenue</h3>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold text-gray-900">$45,678</span>
                    <span className="text-sm font-medium text-green-600">+8%</span>
                  </div>
                  <div className="mt-4 bg-gray-100 rounded-full h-2">
                    <div className="h-2 rounded-full bg-green-500" style={{ width: "75%" }}></div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Monthly Trend</h3>
                <div className="h-32 flex items-end space-x-2">
                  <div className="flex-1 bg-blue-100 hover:bg-blue-200 rounded-t" style={{ height: "40%" }}></div>
                  <div className="flex-1 bg-blue-100 hover:bg-blue-200 rounded-t" style={{ height: "60%" }}></div>
                  <div className="flex-1 bg-blue-100 hover:bg-blue-200 rounded-t" style={{ height: "30%" }}></div>
                  <div className="flex-1 bg-blue-100 hover:bg-blue-200 rounded-t" style={{ height: "70%" }}></div>
                  <div className="flex-1 bg-blue-100 hover:bg-blue-200 rounded-t" style={{ height: "50%" }}></div>
                  <div className="flex-1 bg-blue-100 hover:bg-blue-200 rounded-t" style={{ height: "80%" }}></div>
                  <div className="flex-1 bg-blue-500 hover:bg-blue-600 rounded-t" style={{ height: "65%" }}></div>
                </div>
              </div>
            </div>
          )}

          {componentType === "navigation" && (
            <div className="bg-white shadow">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 flex items-center">
                      <div className="h-8 w-8 bg-blue-600 rounded-md"></div>
                      <span className="ml-2 text-xl font-bold">Logo</span>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                      <a
                        href="#"
                        className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                      >
                        Home
                      </a>
                      <a
                        href="#"
                        className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                      >
                        Features
                      </a>
                      <a
                        href="#"
                        className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                      >
                        Pricing
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">Sign Up</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {componentType === "generic" && (
            <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{componentName}</h2>
              <p className="text-gray-600 text-sm mb-4">This is a preview of your generated component.</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-500 text-sm">Based on your prompt: "{prompt}"</p>
              </div>
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Interactive Button
              </button>
            </div>
          )}
        </div>

        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-blue-800 text-sm flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            This is a visual preview based on your component type. For a fully interactive version, use CodeSandbox.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Generated Component</h2>
          <p className="text-gray-600 mt-1">Based on: "{prompt}"</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onReset}
            className="inline-flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Component</span>
          </button>

          <button
            onClick={downloadCode}
            className="inline-flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>

          <button
            onClick={openInCodeSandbox}
            className="inline-flex items-center space-x-2 px-4 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>CodeSandbox</span>
          </button>

          <button
            onClick={handleCopy}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied!" : "Copy Code"}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-4">
        <button
          onClick={() => setActiveTab("preview")}
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "preview"
              ? "bg-blue-100 text-blue-700"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Preview</span>
        </button>

        <button
          onClick={() => setActiveTab("code")}
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "code" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Code</span>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {activeTab === "preview" ? (
          <div className="p-6">{renderPreview()}</div>
        ) : (
          <div className="relative">
            <pre className="p-6 text-sm overflow-x-auto bg-gray-900 text-gray-100 leading-relaxed">
              <code className="language-tsx">{code}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Enhanced Usage Instructions */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <Code className="w-5 h-5 mr-2" />
            How to use this component:
          </h3>
          <ol className="text-blue-800 text-sm space-y-2 list-decimal list-inside">
            <li>Copy the code or download the file</li>
            <li>Create a new .tsx file in your React project</li>
            <li>Paste the code and save the file</li>
            <li>Import and use the component in your app</li>
            <li>Customize styling and functionality as needed</li>
          </ol>
        </div>

        <div className="p-6 bg-green-50 rounded-xl border border-green-200">
          <h3 className="font-semibold text-green-900 mb-3 flex items-center">
            <ExternalLink className="w-5 h-5 mr-2" />
            Quick Start Options:
          </h3>
          <div className="space-y-2 text-sm">
            <button
              onClick={openInCodeSandbox}
              className="block w-full text-left p-2 text-green-800 hover:bg-green-100 rounded transition-colors"
            >
              • Open in CodeSandbox for instant testing
            </button>
            <button
              onClick={downloadCode}
              className="block w-full text-left p-2 text-green-800 hover:bg-green-100 rounded transition-colors"
            >
              • Download as .tsx file
            </button>
            <button
              onClick={handleCopy}
              className="block w-full text-left p-2 text-green-800 hover:bg-green-100 rounded transition-colors"
            >
              • Copy to clipboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
