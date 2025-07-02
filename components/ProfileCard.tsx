"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings, LogOut, Save, X, Edit3, Mail, Calendar, User, Sparkles } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"

export function ProfileCard() {
  const { user, logout, getAuthHeaders, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      })
    }
  }, [user])

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Please fill in all fields")
      return
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        updateUser(data.user)
        setSuccess("Profile updated successfully!")
        setTimeout(() => {
          setIsEditing(false)
          setSuccess("")
        }, 1500)
      } else {
        setError(data.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setError("Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    })
    setError("")
    setSuccess("")
    setIsEditing(false)
  }

  if (!user) return null

  const memberSince = new Date(user.createdAt || Date.now()).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getStreakBadge = () => {
    if (user.currentStreak >= 30) return { text: "🔥 Streak Legend", color: "bg-red-100 text-red-700 border-red-200" }
    if (user.currentStreak >= 14)
      return { text: "⭐ Streak Master", color: "bg-purple-100 text-purple-700 border-purple-200" }
    if (user.currentStreak >= 7)
      return { text: "🚀 Week Warrior", color: "bg-orange-100 text-orange-700 border-orange-200" }
    if (user.currentStreak >= 3)
      return { text: "💪 Getting Strong", color: "bg-blue-100 text-blue-700 border-blue-200" }
    return null
  }

  const getPointsBadge = () => {
    if (user.totalPoints >= 1000)
      return { text: "💎 Wellness Master", color: "bg-purple-100 text-purple-700 border-purple-200" }
    if (user.totalPoints >= 500)
      return { text: "🏆 High Achiever", color: "bg-green-100 text-green-700 border-green-200" }
    if (user.totalPoints >= 100)
      return { text: "⭐ Point Collector", color: "bg-blue-100 text-blue-700 border-blue-200" }
    return null
  }

  const getWellnessLevel = () => {
    const totalActivity = user.currentStreak + Math.floor(user.totalPoints / 100)
    if (totalActivity >= 50) return { level: "Expert", color: "text-purple-600", icon: "🌟" }
    if (totalActivity >= 25) return { level: "Advanced", color: "text-indigo-600", icon: "🚀" }
    if (totalActivity >= 10) return { level: "Intermediate", color: "text-blue-600", icon: "📈" }
    return { level: "Beginner", color: "text-green-600", icon: "🌱" }
  }

  const streakBadge = getStreakBadge()
  const pointsBadge = getPointsBadge()
  const wellnessLevel = getWellnessLevel()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 ring-2 ring-white/20 hover:ring-white/40"
        >
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-transparent text-white font-bold text-lg">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          {/* Online indicator */}
          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full animate-pulse" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[420px] p-0" align="end" forceMount>
        {/* Header Section */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-white shadow-xl ring-2 ring-indigo-100">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-2xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-6 w-6  border-3 border-white rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xl text-slate-800">{user.name}</h3>
                <Badge className={`text-xs font-medium ${wellnessLevel.color} bg-transparent border-current`}>
                  {wellnessLevel.icon} {wellnessLevel.level}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="w-4 h-4" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-3 h-3" />
                <span>Member since {memberSince}</span>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-white/50">
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {user.totalPoints.toLocaleString()}
              </div>
              <div className="text-xs text-slate-600 font-medium mt-1">Total Points</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-white/50">
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {user.currentStreak}
              </div>
              <div className="text-xs text-slate-600 font-medium mt-1">Current Streak</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-white/50">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {user.longestStreak}
              </div>
              <div className="text-xs text-slate-600 font-medium mt-1">Best Streak</div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {streakBadge && (
              <Badge className={`text-xs font-medium ${streakBadge.color} border`}>{streakBadge.text}</Badge>
            )}
            {pointsBadge && (
              <Badge className={`text-xs font-medium ${pointsBadge.color} border`}>{pointsBadge.text}</Badge>
            )}
            {user.currentStreak === user.longestStreak && user.currentStreak > 0 && (
              <Badge className="text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                🎯 Personal Best
              </Badge>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer p-3 rounded-lg">
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Edit3 className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">Edit Profile</div>
                    <div className="text-xs text-slate-500">Update your personal information</div>
                  </div>
                  <Sparkles className="h-4 w-4 text-slate-400" />
                </div>
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-xl">Edit Your Profile</div>
                    <div className="text-sm text-slate-500 font-normal">Keep your information up to date</div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Status Messages */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                    <div className="text-red-500 text-lg">❌</div>
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <div className="text-green-500 text-lg">✅</div>
                    <p className="text-sm text-green-700 font-medium">{success}</p>
                  </div>
                )}

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="h-12 border-slate-200 focus:border-indigo-300 focus:ring-indigo-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email address"
                      className="h-12 border-slate-200 focus:border-indigo-300 focus:ring-indigo-200"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                    className="h-12 border-slate-200 hover:bg-slate-50 bg-transparent"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Link href="/settings">
            <DropdownMenuItem className="cursor-pointer p-3 rounded-lg">
              <div className="flex items-center gap-3 w-full">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Settings className="h-4 w-4 text-slate-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-800">Settings</div>
                  <div className="text-xs text-slate-500">Preferences and privacy</div>
                </div>
              </div>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem onClick={logout} className="cursor-pointer p-3 rounded-lg text-red-600 hover:bg-red-50">
            <div className="flex items-center gap-3 w-full">
              <div className="p-2 bg-red-100 rounded-lg">
                <LogOut className="h-4 w-4 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Sign Out</div>
                <div className="text-xs text-red-500">End your current session</div>
              </div>
            </div>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
