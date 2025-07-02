"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, Target, Calendar, TrendingUp, Award, Star, Zap } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function ProgressPage() {
  const { user, loading, getAuthHeaders } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState(null)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    } else if (user) {
      fetchStats()
    }
  }, [user, loading, router])

  const fetchStats = async () => {
    setLoadingStats(true)
    try {
      const response = await fetch("/api/user/stats", {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoadingStats(false)
    }
  }

  if (loading || !user || loadingStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your progress...</p>
        </div>
      </div>
    )
  }

  const weeklyGoals = [
    { name: "Daily Mood Tracking", current: Math.min(stats?.stats.totalMoodEntries || 0, 7), target: 7, unit: "days" },
    { name: "Community Interactions", current: Math.min(stats?.stats.totalPosts || 0, 3), target: 3, unit: "posts" },
    { name: "Mindful Moments", current: Math.min(user.currentStreak, 7), target: 7, unit: "days" },
    { name: "Wellness Points", current: Math.min(user.totalPoints, 100), target: 100, unit: "points" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/50">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Your Progress
            </h1>
            <p className="text-slate-600">Track your wellness journey and achievements</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "achievements", label: "Achievements", icon: Award },
            { id: "goals", label: "Goals", icon: Target },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-600 hover:bg-white/50"
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
                <CardContent className="p-4 text-center">
                  <Zap className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{user.totalPoints}</div>
                  <div className="text-sm opacity-90">Total Points</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-br from-green-400 to-emerald-500 text-white">
                <CardContent className="p-4 text-center">
                  <Star className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{user.currentStreak}</div>
                  <div className="text-sm opacity-90">Current Streak</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-400 to-cyan-500 text-white">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">😊</div>
                  <div className="text-2xl font-bold">{stats?.stats.averageMood || 0}</div>
                  <div className="text-sm opacity-90">Avg Mood</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-400 to-pink-500 text-white">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">📝</div>
                  <div className="text-2xl font-bold">{stats?.stats.totalMoodEntries || 0}</div>
                  <div className="text-sm opacity-90">Check-ins</div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Stats */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Wellness Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Longest Streak</span>
                    <span className="font-semibold text-slate-800">{user.longestStreak} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Community Posts</span>
                    <span className="font-semibold text-slate-800">{stats?.stats.totalPosts || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Likes Received</span>
                    <span className="font-semibold text-slate-800">{stats?.stats.totalLikes || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Member Since</span>
                    <span className="font-semibold text-slate-800">
                      {stats?.stats.joinedDate ? new Date(stats.stats.joinedDate).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-800">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="text-xl">✅</div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">Mood tracked</p>
                        <p className="text-sm text-slate-600">Keep up the great work!</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl">🏆</div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">Achievement unlocked</p>
                        <p className="text-sm text-slate-600">You're making progress!</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="text-xl">💬</div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">Community engagement</p>
                        <p className="text-sm text-slate-600">Thanks for sharing!</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Your Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {stats?.achievements?.map((achievement, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        achievement.earned
                          ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 shadow-lg"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`text-4xl ${achievement.earned ? "" : "grayscale opacity-50"}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`font-semibold text-lg ${achievement.earned ? "text-slate-800" : "text-slate-500"}`}
                          >
                            {achievement.name}
                          </h3>
                          <p className={`text-sm ${achievement.earned ? "text-slate-600" : "text-slate-400"}`}>
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.earned && (
                          <Badge className="bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-lg">
                            Earned ✨
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === "goals" && (
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                  Weekly Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {weeklyGoals.map((goal, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-slate-800">{goal.name}</h3>
                        <span className="text-sm font-medium text-slate-600">
                          {goal.current}/{goal.target} {goal.unit}
                        </span>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} className="h-3 bg-slate-100" />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span className="font-medium">{Math.round((goal.current / goal.target) * 100)}% complete</span>
                        <span>
                          {Math.max(0, goal.target - goal.current)} {goal.unit} remaining
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Motivational Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="font-semibold text-slate-800 mb-2 text-xl">Keep Going!</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  You're doing amazing on your wellness journey. Every small step counts towards building healthier
                  habits and a happier you.
                </p>
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg">
                  <Target className="w-4 h-4 mr-2" />
                  Set New Goals
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
