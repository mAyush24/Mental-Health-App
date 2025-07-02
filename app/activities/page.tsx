"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Heart,
  Calendar,
  Users,
  TrendingUp,
  Settings,
  Wind,
  Search,
  ArrowRight,
  Clock,
  Target,
  Award,
  BookOpen,
  ArrowLeft,
  Music,
  Smile,
  Sun,
  Moon,
  TreePine,
  Dumbbell,
  Phone,
  PenTool,
  Utensils,
  Zap,
} from "lucide-react"

export default function AllActivities() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const activities = [
    
    // Additional Wellness Activities
    {
      id: "meditation",
      title: "Meditation Sessions",
      description: "Guided meditation for mindfulness and peace",
      longDescription:
        "Practice mindfulness with guided meditation sessions. Choose from various themes including stress relief, sleep, focus, and loving-kindness.",
      href: "/meditation",
      icon: Sun,
      color: "from-orange-500 to-amber-500",
      bgColor: "from-orange-50 to-amber-50",
      category: "Wellness",
      features: ["Guided sessions", "Multiple themes", "Timer options", "Progress tracking"],
      estimatedTime: "5-30 min",
      isCore: false,
    },
    {
      id: "gratitude",
      title: "Gratitude Journal",
      description: "Practice daily gratitude and positive thinking",
      longDescription:
        "Cultivate a positive mindset by recording things you're grateful for. Research shows gratitude practice improves mental health and life satisfaction.",
      href: "/gratitude",
      icon: Smile,
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-50 to-orange-50",
      category: "Wellness",
      features: ["Daily prompts", "Gratitude streaks", "Reflection insights", "Mood correlation"],
      estimatedTime: "3-10 min",
      isCore: false,
    },
    {
      id: "sleep-tracker",
      title: "Sleep Tracker",
      description: "Monitor and improve your sleep patterns",
      longDescription:
        "Track your sleep quality, duration, and patterns. Get insights into how sleep affects your mood and receive personalized recommendations for better rest.",
      href: "/sleep",
      icon: Moon,
      color: "from-indigo-500 to-purple-500",
      bgColor: "from-indigo-50 to-purple-50",
      category: "Tracking",
      features: ["Sleep logging", "Quality assessment", "Pattern analysis", "Mood correlation"],
      estimatedTime: "2-5 min",
      isCore: false,
    },
    {
      id: "nature-sounds",
      title: "Nature Sounds",
      description: "Relaxing sounds for focus and stress relief",
      longDescription:
        "Listen to calming nature sounds including rain, ocean waves, forest ambience, and more. Perfect for relaxation, focus, or sleep preparation.",
      href: "/nature-sounds",
      icon: TreePine,
      color: "from-green-500 to-teal-500",
      bgColor: "from-green-50 to-teal-50",
      category: "Wellness",
      features: ["Multiple soundscapes", "Timer function", "Mix & match", "Offline playback"],
      estimatedTime: "10-60 min",
      isCore: false,
    },
    {
      id: "exercise-tracker",
      title: "Exercise Tracker",
      description: "Log physical activities and their mood impact",
      longDescription:
        "Track your physical activities and see how exercise affects your mental well-being. Set goals, log workouts, and discover the mood-boosting power of movement.",
      href: "/exercise",
      icon: Dumbbell,
      color: "from-red-500 to-pink-500",
      bgColor: "from-red-50 to-pink-50",
      category: "Tracking",
      features: ["Activity logging", "Mood correlation", "Goal setting", "Progress charts"],
      estimatedTime: "3-8 min",
      isCore: false,
    },
    {
      id: "crisis-support",
      title: "Crisis Support",
      description: "Immediate help and emergency resources",
      longDescription:
        "Access crisis hotlines, emergency contacts, and immediate coping strategies. This feature provides quick access to professional help when you need it most.",
      href: "/crisis-support",
      icon: Phone,
      color: "from-red-600 to-red-500",
      bgColor: "from-red-50 to-red-100",
      category: "Support",
      features: ["Crisis hotlines", "Emergency contacts", "Coping strategies", "Quick access"],
      estimatedTime: "Immediate",
      isCore: false,
    },
    {
      id: "therapy-notes",
      title: "Therapy Notes",
      description: "Private notes for therapy sessions and insights",
      longDescription:
        "Keep private notes about your therapy sessions, insights, and progress. Organize thoughts before appointments and track therapeutic goals.",
      href: "/therapy-notes",
      icon: PenTool,
      color: "from-purple-500 to-violet-500",
      bgColor: "from-purple-50 to-violet-50",
      category: "Tracking",
      features: ["Private notes", "Session tracking", "Goal setting", "Progress insights"],
      estimatedTime: "5-15 min",
      isCore: false,
    },
    {
      id: "mood-music",
      title: "Mood Music",
      description: "Curated playlists to match and improve your mood",
      longDescription:
        "Listen to carefully curated music playlists designed to match your current mood or help you transition to a better emotional state.",
      href: "/mood-music",
      icon: Music,
      color: "from-violet-500 to-purple-500",
      bgColor: "from-violet-50 to-purple-50",
      category: "Wellness",
      features: ["Mood-based playlists", "Transition music", "Personalized recommendations", "Mood tracking"],
      estimatedTime: "15-60 min",
      isCore: false,
    },
    {
      id: "nutrition-mood",
      title: "Nutrition & Mood",
      description: "Track how food affects your mental well-being",
      longDescription:
        "Log your meals and discover how different foods impact your mood and energy levels. Get insights into the connection between nutrition and mental health.",
      href: "/nutrition",
      icon: Utensils,
      color: "from-emerald-500 to-green-500",
      bgColor: "from-emerald-50 to-green-50",
      category: "Tracking",
      features: ["Meal logging", "Mood correlation", "Nutrition insights", "Pattern recognition"],
      estimatedTime: "3-10 min",
      isCore: false,
    },
    {
      id: "energy-tracker",
      title: "Energy Tracker",
      description: "Monitor daily energy levels and patterns",
      longDescription:
        "Track your energy levels throughout the day and identify patterns. Understand what activities, foods, or situations boost or drain your energy.",
      href: "/energy",
      icon: Zap,
      color: "from-yellow-500 to-amber-500",
      bgColor: "from-yellow-50 to-amber-50",
      category: "Tracking",
      features: ["Energy logging", "Pattern analysis", "Activity correlation", "Optimization tips"],
      estimatedTime: "2-5 min",
      isCore: false,
    },
  ]

  const categories = ["All", "Tracking", "Wellness", "Analytics", "Social", "Support", "Configuration"]

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || activity.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Separate core and additional activities
  const coreActivities = filteredActivities.filter((activity) => activity.isCore)
  const additionalActivities = filteredActivities.filter((activity) => !activity.isCore)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="h-12 w-12 border-b-2 border-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading activities...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push("/auth")
    return null
  }

  const handleActivityClick = (activity: any) => {
    if (activity.isCore) {
      router.push(activity.href)
    } else {
      // For non-core activities, show a coming soon message or placeholder
      alert(
        `${activity.title} is coming soon! 🚀\n\n${activity.longDescription}\n\nStay tuned for this exciting feature!`,
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 py-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">All Activities 🎯</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explore all the wellness tools and features available to support your mental health journey
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-slate-200 focus:border-indigo-300 focus:ring-indigo-200"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-indigo-500 text-white shadow-lg"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Core Activities */}
        {coreActivities.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-800">Core Features</h2>
              <Badge className="bg-indigo-100 text-indigo-700">Essential</Badge>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {coreActivities.map((activity) => {
                const IconComponent = activity.icon
                return (
                  <Card
                    key={activity.id}
                    className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden cursor-pointer"
                    onClick={() => handleActivityClick(activity)}
                  >
                    <div className={`h-2 bg-gradient-to-r ${activity.color}`} />
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${activity.bgColor} mb-4`}>
                          <IconComponent className="w-6 h-6 text-slate-700" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {activity.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {activity.title}
                      </CardTitle>
                      <CardDescription className="text-slate-600 leading-relaxed">
                        {activity.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-slate-600 leading-relaxed">{activity.longDescription}</p>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock className="w-4 h-4" />
                          <span>Estimated time: {activity.estimatedTime}</span>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Key Features
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {activity.features.map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-slate-50">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        className={`w-full mt-4 bg-gradient-to-r ${activity.color} text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2 group`}
                      >
                        Start Activity
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Additional Activities */}
        {additionalActivities.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-800">Additional Wellness Tools</h2>
              <Badge className="bg-amber-100 text-amber-700">Coming Soon</Badge>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {additionalActivities.map((activity) => {
                const IconComponent = activity.icon
                return (
                  <Card
                    key={activity.id}
                    className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm overflow-hidden cursor-pointer relative"
                    onClick={() => handleActivityClick(activity)}
                  >
                    <div className={`h-2 bg-gradient-to-r ${activity.color} opacity-60`} />
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-amber-100 text-amber-700 text-xs">Coming Soon</Badge>
                    </div>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${activity.bgColor} mb-4 opacity-80`}>
                          <IconComponent className="w-6 h-6 text-slate-700" />
                        </div>
                        <Badge variant="secondary" className="text-xs opacity-60">
                          {activity.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                        {activity.title}
                      </CardTitle>
                      <CardDescription className="text-slate-500 leading-relaxed">
                        {activity.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-slate-500 leading-relaxed">{activity.longDescription}</p>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>Estimated time: {activity.estimatedTime}</span>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Planned Features
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {activity.features.map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-slate-50 opacity-60">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        className={`w-full mt-4 bg-gradient-to-r ${activity.color} text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2 group opacity-60`}
                      >
                        Preview Feature
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No activities found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" />
            Your Wellness Journey
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{user.currentStreak}</div>
              <div className="text-sm text-slate-600">Current Streak</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{user.totalPoints}</div>
              <div className="text-sm text-slate-600">Total Points</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{user.longestStreak}</div>
              <div className="text-sm text-slate-600">Best Streak</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-cyan-600">{coreActivities.length}</div>
              <div className="text-sm text-slate-600">Available Now</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
