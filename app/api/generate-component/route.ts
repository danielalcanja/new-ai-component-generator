"use client"

import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Debug: Check environment variables
    console.log("Environment check:", {
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      nodeEnv: process.env.NODE_ENV,
      keyLength: process.env.ANTHROPIC_API_KEY?.length || 0,
    })

    // Check if Anthropic API key is available
    const anthropicKey = process.env.ANTHROPIC_API_KEY
    if (!anthropicKey) {
      console.log("ANTHROPIC_API_KEY not found, using fallback system")
      return generateFallbackComponent(prompt)
    }

    console.log("Using Claude AI to generate component...")

    try {
      // Use Claude 3.5 Sonnet
      const model = anthropic("claude-3-5-sonnet-20241022")

      const systemPrompt = `You are an expert React developer specializing in creating beautiful, functional UI components using React and Tailwind CSS.

Your task is to generate a complete React functional component based on the user's description. Follow these guidelines:

1. **Component Structure:**
   - Use React functional components with TypeScript
   - Include proper imports (React, useState, useEffect if needed)
   - Export as default
   - Use descriptive component names

2. **Styling:**
   - Use only Tailwind CSS classes for styling
   - Make components responsive (use sm:, md:, lg: prefixes)
   - Include hover states and transitions where appropriate
   - Use modern design principles (proper spacing, typography, colors)

3. **Functionality:**
   - Include interactive elements where relevant (buttons, inputs, etc.)
   - Use React hooks (useState, useEffect) when state management is needed
   - Add proper event handlers
   - Include accessibility features (aria-labels, proper semantic HTML)

4. **Code Quality:**
   - Write clean, readable code
   - Use TypeScript interfaces for props when needed
   - Include proper error handling where applicable
   - Follow React best practices

5. **Output Format:**
   - Return ONLY the complete component code
   - No explanations or markdown formatting
   - Start with imports and end with export default

Generate a component that matches the user's description as closely as possible while being production-ready and visually appealing.`

      const { text } = await generateText({
        model,
        system: systemPrompt,
        prompt: `Create a React component: ${prompt}`,
        maxTokens: 2000,
        temperature: 0.7,
      })

      // Clean up the response to ensure it's valid code
      let cleanedCode = text.trim()

      // Remove any markdown code blocks if present
      cleanedCode = cleanedCode.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "")

      // Ensure the code starts with import statements
      if (!cleanedCode.startsWith("import")) {
        cleanedCode = `import React from 'react'\n\n${cleanedCode}`
      }

      console.log("Component generated successfully with Claude AI")

      return Response.json({
        code: cleanedCode,
        prompt: prompt,
        success: true,
        mode: "claude_ai",
      })
    } catch (aiError) {
      console.error("Claude AI generation failed:", aiError)
      console.log("Falling back to intelligent fallback system")
      return generateFallbackComponent(prompt)
    }
  } catch (error) {
    console.error("Error in API route:", error)
    return generateFallbackComponent(prompt)
  }
}

function generateFallbackComponent(prompt: string) {
  console.log("Generating component with intelligent fallback system...")

  const generateIntelligentComponent = (userPrompt: string): string => {
    const lowerPrompt = userPrompt.toLowerCase()

    // Analyze the prompt for component type
    if (lowerPrompt.includes("login") || lowerPrompt.includes("signin")) {
      return `import React, { useState } from 'react'

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Sign In</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-4">
        Don't have an account? <a href="#" className="text-blue-600 hover:underline">Sign up</a>
      </p>
    </div>
  )
}`
    } else if (lowerPrompt.includes("pricing") || lowerPrompt.includes("plan")) {
      return `import React from 'react'

export default function PricingCard() {
  const plans = [
    {
      name: 'Basic',
      price: '$9',
      period: '/month',
      features: ['5 Projects', '10GB Storage', 'Email Support'],
      popular: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      features: ['Unlimited Projects', '100GB Storage', 'Priority Support', 'Advanced Analytics'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      features: ['Everything in Pro', 'Custom Integrations', 'Dedicated Manager', 'SLA'],
      popular: false
    }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Choose Your Plan</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div key={index} className={\`relative bg-white rounded-xl shadow-lg border-2 p-6 \${plan.popular ? 'border-blue-500' : 'border-gray-200'}\`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
              <span className="text-gray-600">{plan.period}</span>
            </div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button className={\`w-full py-2 px-4 rounded-lg transition-colors \${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}\`}>
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}`
    } else if (lowerPrompt.includes("contact") || lowerPrompt.includes("form")) {
      return `import React, { useState } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    }, 1500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-green-900 mb-2">Message Sent!</h3>
        <p className="text-green-700">Thank you for your message. We'll get back to you soon.</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="your@email.com"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your message..."
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            'Send Message'
          )}
        </button>
      </form>
    </div>
  )
}`
    } else if (lowerPrompt.includes("button")) {
      return `import React, { useState } from 'react'

export default function CustomButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setClicked(true)
      setTimeout(() => setClicked(false), 2000)
    }, 1500)
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-8">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Button Component</h2>
        <p className="text-gray-600">Interactive button with loading states and animations</p>
      </div>

      <button
        onClick={handleClick}
        disabled={isLoading}
        className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 flex items-center space-x-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading...</span>
          </>
        ) : clicked ? (
          <>
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Success!</span>
          </>
        ) : (
          <span>Click Me</span>
        )}
      </button>
      
      <div className="flex space-x-3">
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
          Success
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
          Danger
        </button>
        <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
          Secondary
        </button>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
          Outline
        </button>
      </div>
    </div>
  )
}`
    } else {
      // Generic component preview
      return `import React, { useState } from 'react'

export default function GeneratedComponent() {
  const [count, setCount] = useState(0)

  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="text-center">
        <div className="flex justify-center space-x-2 mb-4">
          <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Custom Component</h2>
        <p className="text-gray-600 text-sm mb-6">
          Generated for: "${userPrompt}"
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <span className="text-3xl font-bold text-blue-600">{count}</span>
          <p className="text-gray-500 text-sm">Interactive Counter</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setCount(count - 1)}
            className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
          >
            -
          </button>
          <button
            onClick={() => setCount(0)}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => setCount(count + 1)}
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}`
    }
  }

  const generatedCode = generateIntelligentComponent(prompt)

  return Response.json({
    code: generatedCode,
    prompt: prompt,
    success: true,
    mode: "intelligent_fallback",
  })
}
