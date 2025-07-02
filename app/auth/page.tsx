"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login, signup } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", { isLogin, email: formData.email, name: formData.name })

    setError("")
    setLoading(true)

    try {
      let result
      if (isLogin) {
        console.log("Attempting login...")
        result = await login(formData.email, formData.password)
      } else {
        console.log("Attempting signup...")
        result = await signup(formData.name, formData.email, formData.password)
      }

      console.log("Auth result:", result)

      if (result.success) {
        console.log("Auth successful, redirecting...")
        router.push("/")
      } else {
        console.log("Auth failed:", result.error)
        setError(result.error || "Authentication failed")
      }
    } catch (err: any) {
      console.error("Auth error:", err)
      setError("An unexpected error occurred: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 text-indigo-500">💜</div>
            <h1 className="text-2xl font-bold text-slate-800">MindfulMe</h1>
          </div>
          <p className="text-slate-600">Your mental wellness companion</p>
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs">
            <p>
              <strong>Debug Info:</strong>
            </p>
            <p>Mode: {isLogin ? "Login" : "Signup"}</p>
            <p>Email: {formData.email}</p>
            <p>Name: {formData.name}</p>
            <p>Password Length: {formData.password.length}</p>
          </div>
        )}

        {/* Auth Form */}
        <div className="bg-white rounded-xl shadow-lg border-0 p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800">{isLogin ? "Welcome Back" : "Create Account"}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={!isLogin}
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your password"
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {!isLogin && <p className="text-xs text-slate-500">Password must be at least 6 characters</p>}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600">{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError("")
                setFormData({ name: "", email: "", password: "" })
              }}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {isLogin ? "Sign up here" : "Sign in here"}
            </button>
          </div>
        </div>

        {/* Test Connection Button */}
        {process.env.NODE_ENV === "development" && (
          <div className="text-center">
            <button
              onClick={async () => {
                try {
                  const response = await fetch("/api/test-connection")
                  const data = await response.json()
                  alert(JSON.stringify(data, null, 2))
                } catch (err) {
                  alert("Connection test failed: " + err)
                }
              }}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Test Database Connection
            </button>
          </div>
        )}

        {/* Features */}
        <div className="text-center space-y-2">
          <p className="text-sm text-slate-600">Join thousands on their wellness journey</p>
          <div className="flex justify-center gap-6 text-xs text-slate-500">
            <span>🧘 Mood Tracking</span>
            <span>🤝 Community Support</span>
            <span>🏆 Progress Rewards</span>
          </div>
        </div>
      </div>
    </div>
  )
}
