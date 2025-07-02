"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ProfileCard } from "@/components/ProfileCard"
import { PersonalizedSuggestions } from "@/components/PersonalizedSuggestions"
import { ExportDataDialog } from "@/components/ExportDataDialog"
import {
  Heart,
  Calendar,
  Users,
  TrendingUp,
  Settings,
  Wind,
  Sparkles,
  Target,
  Award,
  Zap,
  Star,
  ArrowRight,
  Activity,
  BookOpen,
  CheckCircle,
  Clock,
  Trophy,
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [dailyProgress, setDailyProgress] = useState(null)
  const [loadingProgress, setLoadingProgress] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    } else if (user) {
      fetchDailyProgress()
    }
  }, [user, loading, router])

  const fetchDailyProgress = async () => {
    try {
      const response = await fetch("/api/user/daily-progress", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setDailyProgress(data)
      }
    } catch (error) {
      console.error("Error fetching daily progress:", error)
    } finally {
      setLoadingProgress(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your wellness dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const quickActions = [
    {
      title: "Track Mood",
      description: "Log how you're feeling today",
      href: "/mood-tracker",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      bgColor: "from-pink-50 to-rose-50",
    },
    {
      title: "Breathing Exercise",
      description: "Practice mindful breathing",
      href: "/breathing",
      icon: Wind,
      color: "from-cyan-500 to-blue-500",
      bgColor: "from-cyan-50 to-blue-50",
    },
    {
      title: "View Calendar",
      description: "See your mood patterns",
      href: "/calendar",
      icon: Calendar,
      color: "from-blue-500 to-indigo-500",
      bgColor: "from-blue-50 to-indigo-50",
    },
    {
      title: "Community",
      description: "Connect with others",
      href: "/community",
      icon: Users,
      color: "from-purple-500 to-indigo-500",
      bgColor: "from-purple-50 to-indigo-50",
    },
    {
      title: "Progress",
      description: "Track your journey",
      href: "/progress",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
    },
    {
      title: "Settings",
      description: "Customize your experience",
      href: "/settings",
      icon: Settings,
      color: "from-slate-500 to-gray-500",
      bgColor: "from-slate-50 to-gray-50",
    },
  ]

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const getWellnessLevel = () => {
    const totalActivity = user.currentStreak + Math.floor(user.totalPoints / 100)
    if (totalActivity >= 50) return { level: "Expert", color: "text-purple-600", progress: 100 }
    if (totalActivity >= 25) return { level: "Advanced", color: "text-indigo-600", progress: 75 }
    if (totalActivity >= 10) return { level: "Intermediate", color: "text-blue-600", progress: 50 }
    return { level: "Beginner", color: "text-green-600", progress: 25 }
  }

  const wellnessLevel = getWellnessLevel()

  const getProgressMessage = (completedGoals, totalGoals) => {
    const percentage = (completedGoals / totalGoals) * 100
    if (percentage === 100)
      return { message: "Amazing! You've completed all your daily goals! 🎉", color: "text-green-600" }
    if (percentage >= 75) return { message: "Great progress! You're almost there! 💪", color: "text-blue-600" }
    if (percentage >= 50) return { message: "Good work! Keep it up! 👍", color: "text-indigo-600" }
    if (percentage >= 25) return { message: "Nice start! Let's keep going! 🌟", color: "text-purple-600" }
    return { message: "Ready to start your wellness journey today? 🚀", color: "text-slate-600" }
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">MindfulMe</h1>
                  <p className="text-sm text-slate-600">Your wellness companion</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ExportDataDialog />
              <ProfileCard />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-slate-800">
              {getGreeting()}, {user.name.split(" ")[0]}! 👋
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Ready to continue your wellness journey? Let's make today amazing together.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">Total Points</p>
                    <p className="text-3xl font-bold">{user.totalPoints.toLocaleString()}</p>
                  </div>
                  <Zap className="w-8 h-8 text-yellow-100" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-400 to-emerald-500 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Current Streak</p>
                    <p className="text-3xl font-bold">{user.currentStreak}</p>
                  </div>
                  <Star className="w-8 h-8 text-green-100" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-400 to-pink-500 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Best Streak</p>
                    <p className="text-3xl font-bold">{user.longestStreak}</p>
                  </div>
                  <Award className="w-8 h-8 text-purple-100" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-400 to-blue-500 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm font-medium">Wellness Level</p>
                    <p className="text-xl font-bold">{wellnessLevel.level}</p>
                  </div>
                  <Target className="w-8 h-8 text-indigo-100" />
                </div>
                <div className="mt-3">
                  <Progress value={wellnessLevel.progress} className="h-2 bg-white/20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Today's Progress */}
          {!loadingProgress && dailyProgress && (
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-1"></div>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                      <Activity className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-slate-800">Today's Progress</CardTitle>
                      <CardDescription className="text-base mt-1">
                        {getProgressMessage(dailyProgress.completedGoals, dailyProgress.totalGoals).message}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-indigo-600">
                      {Math.round((dailyProgress.completedGoals / dailyProgress.totalGoals) * 100)}%
                    </div>
                    <div className="text-sm text-slate-500">Complete</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">Daily Goals Progress</span>
                    <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      {dailyProgress.completedGoals} of {dailyProgress.totalGoals} completed
                    </span>
                  </div>
                  <div className="relative">
                    <Progress
                      value={(dailyProgress.completedGoals / dailyProgress.totalGoals) * 100}
                      className="h-4 bg-slate-100"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-white drop-shadow-sm">
                        {Math.round((dailyProgress.completedGoals / dailyProgress.totalGoals) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Goals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dailyProgress.goals.map((goal) => (
                    <div
                      key={goal.id}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        goal.completed
                          ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm"
                          : "bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200 hover:border-indigo-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${goal.completed ? "bg-green-100" : "bg-slate-100"}`}>
                          {goal.completed ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-slate-400 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{goal.icon}</span>
                            <h4 className={`font-semibold ${goal.completed ? "text-green-800" : "text-slate-700"}`}>
                              {goal.name}
                            </h4>
                          </div>
                          <p className={`text-sm ${goal.completed ? "text-green-600" : "text-slate-500"}`}>
                            {goal.description}
                          </p>
                          {goal.completed && (
                            <div className="flex items-center gap-1 mt-2">
                              <Trophy className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-green-600 font-medium">Completed!</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Activities */}
                {dailyProgress.recentActivities && dailyProgress.recentActivities.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-indigo-500" />
                      <h3 className="font-semibold text-slate-800">Recent Activities</h3>
                      <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
                    </div>
                    <div className="space-y-3">
                      {dailyProgress.recentActivities.slice(0, 3).map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100"
                        >
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <span className="text-lg">{activity.icon}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-800">{activity.title}</h4>
                            <p className="text-sm text-slate-600">{activity.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-indigo-600">{formatTime(activity.time)}</div>
                            <div className="text-xs text-slate-500">Today</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Motivational Section */}
                <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border border-indigo-100">
                  <div className="text-center space-y-3">
                    <div className="text-2xl">🌟</div>
                    <h3 className="font-semibold text-slate-800">Keep Going!</h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      Every small step counts towards your wellness journey. You're doing great!
                    </p>
                    {dailyProgress.completedGoals < dailyProgress.totalGoals && (
                      <div className="flex justify-center gap-2 mt-4">
                        <Link href="/mood-tracker">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            Track Mood
                          </Button>
                        </Link>
                        <Link href="/breathing">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-indigo-200 hover:bg-indigo-50 bg-transparent"
                          >
                            <Wind className="w-4 h-4 mr-2" />
                            Breathe
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading State for Progress */}
          {loadingProgress && (
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center justify-center space-y-4">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading your daily progress...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-800">Quick Actions</h3>
              <Link href="/activities">
                <Button
                  variant="outline"
                  className="bg-white/80 backdrop-blur-sm hover:bg-white border-slate-200 hover:border-indigo-300 transition-all"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  All Activities
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon
                return (
                  <Link key={index} href={action.href}>
                    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden cursor-pointer">
                      <div className={`h-1 bg-gradient-to-r ${action.color}`} />
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-xl bg-gradient-to-br ${action.bgColor} group-hover:scale-110 transition-transform`}
                          >
                            <IconComponent className="w-6 h-6 text-slate-700" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                              {action.title}
                            </h4>
                            <p className="text-sm text-slate-600">{action.description}</p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Personalized Suggestions */}
          <PersonalizedSuggestions />

          {/* Motivational Quote */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">✨</div>
              <blockquote className="text-xl font-medium text-slate-800 mb-4">
                "The greatest revolution of our generation is the discovery that human beings, by changing the inner
                attitudes of their minds, can change the outer aspects of their lives."
              </blockquote>
              <cite className="text-slate-600">— William James</cite>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
