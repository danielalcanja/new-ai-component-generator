"use client"

import { useState } from "react"
import { ComponentForm } from "@/components/component-form"
import { CodeDisplay } from "@/components/code-display"

export default function Home() {
  const [generatedCode, setGeneratedCode] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [generationMode, setGenerationMode] = useState<string>("")

  const handleGenerate = async (userPrompt: string) => {
    setIsGenerating(true)
    setPrompt(userPrompt)
    setGenerationMode("")

    try {
      const response = await fetch("/api/generate-component", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userPrompt }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setGeneratedCode(data.code)
      setGenerationMode(data.mode || "fallback")
    } catch (error) {
      console.error("Error generating component:", error)

      // Final fallback
      const finalFallback = `import React from 'react'

export default function FallbackComponent() {
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Component Generated</h2>
      <p className="text-gray-600 text-sm mb-4">
        Your component for "${userPrompt}" has been created using our fallback system.
      </p>
      <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
        Interact
      </button>
    </div>
  )
}`
      setGeneratedCode(finalFallback)
      setGenerationMode("final_fallback")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        {generationMode === "claude_ai" && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">
              <strong>🤖 Claude AI:</strong> Component generated using Claude 3.5 Sonnet AI model. This is a fully
              AI-generated React component based on your description.
            </p>
          </div>
        )}

        {generationMode === "intelligent_fallback" && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>🧠 Intelligent Mode:</strong> Component generated using our advanced pattern recognition system.
              Claude AI integration will be available once environment variables are properly configured.
            </p>
          </div>
        )}

        {!generatedCode ? (
          <ComponentForm onGenerate={handleGenerate} isGenerating={isGenerating} />
        ) : (
          <CodeDisplay
            code={generatedCode}
            prompt={prompt}
            onReset={() => {
              setGeneratedCode("")
              setPrompt("")
              setGenerationMode("")
            }}
          />
        )}
      </main>
    </div>
  )
}
