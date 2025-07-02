"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ExternalLink, RefreshCw, TrendingUp, Target } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

interface Suggestion {
  type: string
  title: string
  description: string
  icon: string
  action: string
  color: string
  priority: number
  reason: string
}

interface SuggestionsData {
  suggestions: Suggestion[]
  personalizedMessage: string
  analytics: {
    recentMoodCount: number
    averageRecentMood: number
    hasTrackedToday: boolean
    hasPostedToday: boolean
    currentStreak: number
  }
}

export function PersonalizedSuggestions() {
  const { getAuthHeaders } = useAuth()
  const router = useRouter()
  const [suggestionsData, setSuggestionsData] = useState<SuggestionsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchSuggestions = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const response = await fetch("/api/ai/suggestions", {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        setSuggestionsData(data)
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchSuggestions()
  }, [])

  const handleSuggestionClick = (suggestion: Suggestion) => {
    switch (suggestion.type) {
      case "mood-track":
        router.push("/mood-tracker")
        break
      case "social":
        router.push("/community")
        break
      case "progress":
        router.push("/progress")
        break
      case "breathing":
        router.push("/breathing")
        break
      case "meditation":
      case "gratitude":
      case "walk":
      case "music":
      case "stretch":
        // For now, show an encouraging message
        alert(`Great choice! ${suggestion.description} Remember to take your time and be gentle with yourself. 🌟`)
        break
      default:
        break
    }
  }

  const getReasonBadge = (reason: string) => {
    const badges = {
      daily_tracking: { text: "Daily Goal", color: "bg-blue-100 text-blue-700" },
      community_engagement: { text: "Social", color: "bg-purple-100 text-purple-700" },
      low_mood_pattern: { text: "Mood Support", color: "bg-orange-100 text-orange-700" },
      positive_mood: { text: "Celebrate", color: "bg-green-100 text-green-700" },
      anxiety_support: { text: "Calm", color: "bg-cyan-100 text-cyan-700" },
      energy_boost: { text: "Energize", color: "bg-yellow-100 text-yellow-700" },
      streak_celebration: { text: "Achievement", color: "bg-pink-100 text-pink-700" },
      mood_support: { text: "Comfort", color: "bg-indigo-100 text-indigo-700" },
      general_wellness: { text: "Wellness", color: "bg-slate-100 text-slate-700" },
    }
    return badges[reason] || badges.general_wellness
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Personalized Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-purple-500" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!suggestionsData) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardContent className="p-8 text-center">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Unable to load suggestions</h3>
          <p className="text-slate-600 mb-4">We couldn't fetch your personalized recommendations right now.</p>
          <Button onClick={() => fetchSuggestions()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Personalized Suggestions
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchSuggestions(true)}
            disabled={refreshing}
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <div className="space-y-2">
          <p className="text-slate-600">{suggestionsData.personalizedMessage}</p>
          {suggestionsData.analytics && (
            <div className="flex flex-wrap gap-2 text-xs">
              {suggestionsData.analytics.hasTrackedToday && (
                <Badge className="bg-green-100 text-green-700 border-0">✅ Mood Tracked</Badge>
              )}
              {suggestionsData.analytics.currentStreak > 0 && (
                <Badge className="bg-orange-100 text-orange-700 border-0">
                  🔥 {suggestionsData.analytics.currentStreak} Day Streak
                </Badge>
              )}
              {suggestionsData.analytics.averageRecentMood > 0 && (
                <Badge className="bg-blue-100 text-blue-700 border-0">
                  📊 Avg Mood: {suggestionsData.analytics.averageRecentMood}/10
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {suggestionsData.suggestions.map((suggestion, index) => {
            const reasonBadge = getReasonBadge(suggestion.reason)
            return (
              <div
                key={index}
                className={`rounded-xl bg-gradient-to-br ${suggestion.color} p-4 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer relative overflow-hidden`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {/* Priority indicator */}
                {suggestion.priority <= 2 && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}

                <div className="mb-3 flex items-center justify-between">
                  <div className="text-2xl">{suggestion.icon}</div>
                  <Badge className={`text-xs ${reasonBadge.color} border-0`}>{reasonBadge.text}</Badge>
                </div>

                <h4 className="mb-2 font-semibold text-lg">{suggestion.title}</h4>
                <p className="mb-4 text-sm opacity-90 leading-relaxed">{suggestion.description}</p>

                <div className="flex items-center justify-between">
                  <Button
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSuggestionClick(suggestion)
                    }}
                  >
                    {suggestion.action}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>

                  {suggestion.priority <= 2 && (
                    <div className="flex items-center gap-1 text-xs opacity-75">
                      <Target className="w-3 h-3" />
                      Priority
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Insights Section */}
        {suggestionsData.analytics && (
          <div className="mt-6 p-4 bg-white/50 backdrop-blur-sm rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <h4 className="font-semibold text-slate-800">Your Wellness Insights</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="text-center">
                <div className="font-bold text-purple-600">{suggestionsData.analytics.recentMoodCount}</div>
                <div className="text-slate-600">Recent Entries</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-600">
                  {suggestionsData.analytics.averageRecentMood > 0
                    ? `${suggestionsData.analytics.averageRecentMood}/10`
                    : "N/A"}
                </div>
                <div className="text-slate-600">Avg Mood</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-600">
                  {suggestionsData.analytics.hasTrackedToday ? "✅" : "⏳"}
                </div>
                <div className="text-slate-600">Today's Mood</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-600">
                  {suggestionsData.analytics.hasPostedToday ? "✅" : "⏳"}
                </div>
                <div className="text-slate-600">Community</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
