"use client"

import type React from "react"

import { useState } from "react"
import { Wand2, Loader2, Sparkles, Lightbulb } from "lucide-react"

interface ComponentFormProps {
  onGenerate: (prompt: string) => void
  isGenerating: boolean
}

export function ComponentForm({ onGenerate, isGenerating }: ComponentFormProps) {
  const [prompt, setPrompt] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt.trim())
    }
  }

  const examplePrompts = [
    "a modern login form with email and password fields",
    "a pricing card with features list and CTA button",
    "a user profile card with avatar and social links",
    "a search input with autocomplete suggestions",
    "a navigation menu with dropdown submenus",
    "a progress bar with percentage indicator",
    "a modal dialog with close button",
    "a file upload component with drag and drop",
    "a testimonial card with star rating",
    "a dashboard widget showing statistics",
  ]

  return (
    <div className="max-w-3xl mx-auto text-center">
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Sparkles className="w-8 h-8 text-blue-500" />
          <h1 className="text-4xl font-bold text-gray-900">AI-Powered Component Generator</h1>
          <Sparkles className="w-8 h-8 text-blue-500" />
        </div>
        <p className="text-xl text-gray-600">Describe the component you want to create</p>
        <p className="text-sm text-gray-500 mt-2">
          Powered by Claude AI & OpenAI for intelligent React component generation
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your component in detail... e.g., 'a modern contact form with name, email, message fields, validation, and a submit button with loading state'"
            className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-none"
            rows={3}
            disabled={isGenerating}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">{prompt.length}/500</div>
        </div>

        <button
          type="submit"
          disabled={!prompt.trim() || isGenerating || prompt.length > 500}
          className="inline-flex items-center space-x-2 bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating with AI...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>Generate Component</span>
            </>
          )}
        </button>
      </form>

      {/* Enhanced Example prompts */}
      <div className="mt-12">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <p className="text-lg font-medium text-gray-700">Need inspiration? Try these examples:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => setPrompt(example)}
              className="p-3 text-sm bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 transition-all duration-200 text-left border border-gray-200 hover:border-blue-300"
              disabled={isGenerating}
            >
              <span className="font-medium">💡</span> {example}
            </button>
          ))}
        </div>

        <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Pro tip:</strong> Be specific about styling, functionality, and interactions for better results.
            Mention colors, sizes, hover effects, and any special features you want.
          </p>
        </div>
      </div>
    </div>
  )
}
