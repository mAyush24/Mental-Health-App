"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  totalPoints: number
  currentStreak: number
  longestStreak: number
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (userData: User) => void
  getAuthHeaders: () => { Authorization?: string }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
        console.log("User loaded from localStorage")
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    console.log("AuthContext: Starting login process")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log("AuthContext: Login response status:", response.status)

      const data = await response.json()
      console.log("AuthContext: Login response data:", { ...data, token: data.token ? "[TOKEN]" : "NO_TOKEN" })

      if (!response.ok) {
        throw new Error(data.error || `Login failed with status ${response.status}`)
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      setUser(data.user)
      console.log("AuthContext: Login successful")

      return { success: true }
    } catch (error: any) {
      console.error("AuthContext: Login error:", error)
      return { success: false, error: error.message }
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    console.log("AuthContext: Starting signup process")

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      console.log("AuthContext: Signup response status:", response.status)

      const data = await response.json()
      console.log("AuthContext: Signup response data:", { ...data, token: data.token ? "[TOKEN]" : "NO_TOKEN" })

      if (!response.ok) {
        throw new Error(data.error || `Signup failed with status ${response.status}`)
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      setUser(data.user)
      console.log("AuthContext: Signup successful")

      return { success: true }
    } catch (error: any) {
      console.error("AuthContext: Signup error:", error)
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    console.log("AuthContext: Logging out")
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  const updateUser = (userData: User) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUser,
    getAuthHeaders,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
