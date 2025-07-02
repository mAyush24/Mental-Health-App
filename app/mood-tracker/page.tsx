"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Save, Sparkles, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function MoodTracker() {
  const { user, loading, getAuthHeaders, updateUser } = useAuth()
  const router = useRouter()
  const [selectedMood, setSelectedMood] = useState(null)
  const [moodIntensity, setMoodIntensity] = useState([5])
  const [journalEntry, setJournalEntry] = useState("")
  const [selectedTags, setSelectedTags] = useState([])
  const [saving, setSaving] = useState(false)
  const [recentMoods, setRecentMoods] = useState([])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    } else if (user) {
      fetchRecentMoods()
    }
  }, [user, loading, router])

  const fetchRecentMoods = async () => {
    try {
      const response = await fetch("/api/mood", {
        headers: getAuthHeaders(),
      })
      if (response.ok) {
        const data = await response.json()
        setRecentMoods(data.moodEntries.slice(0, 5))
      }
    } catch (error) {
      console.error("Error fetching recent moods:", error)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  const moods = [
    {
      emoji: "😊",
      label: "Happy",
      color: "bg-yellow-100 hover:bg-yellow-200 border-yellow-300",
      description: "Feeling joyful and content",
    },
    {
      emoji: "😌",
      label: "Calm",
      color: "bg-blue-100 hover:bg-blue-200 border-blue-300",
      description: "Peaceful and relaxed",
    },
    {
      emoji: "😔",
      label: "Sad",
      color: "bg-gray-100 hover:bg-gray-200 border-gray-300",
      description: "Feeling down or melancholy",
    },
    {
      emoji: "😰",
      label: "Anxious",
      color: "bg-orange-100 hover:bg-orange-200 border-orange-300",
      description: "Worried or stressed",
    },
    {
      emoji: "😴",
      label: "Tired",
      color: "bg-purple-100 hover:bg-purple-200 border-purple-300",
      description: "Exhausted or sleepy",
    },
    {
      emoji: "😤",
      label: "Frustrated",
      color: "bg-red-100 hover:bg-red-200 border-red-300",
      description: "Annoyed or irritated",
    },
    {
      emoji: "🤗",
      label: "Grateful",
      color: "bg-green-100 hover:bg-green-200 border-green-300",
      description: "Thankful and appreciative",
    },
    {
      emoji: "😐",
      label: "Neutral",
      color: "bg-slate-100 hover:bg-slate-200 border-slate-300",
      description: "Neither good nor bad",
    },
  ]

  const moodTags = ["Work", "Family", "Health", "Exercise", "Sleep", "Social", "Weather", "Food", "Travel", "Hobby"]

  const intensityLabels = {
    1: "Very Low",
    2: "Low",
    3: "Mild",
    4: "Moderate",
    5: "Average",
    6: "Good",
    7: "High",
    8: "Very High",
    9: "Excellent",
    10: "Amazing",
  }

  const handleSaveMood = async () => {
    if (!selectedMood) return

    setSaving(true)
    try {
      const response = await fetch("/api/mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          mood: selectedMood,
          intensity: moodIntensity[0],
          journalEntry,
          tags: selectedTags,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        updateUser({
          ...user,
          totalPoints: data.totalPoints,
          currentStreak: data.currentStreak,
        })

        // Show success message
        const pointsEarned = data.streakUpdated ? 10 : 0
        alert(`Mood saved successfully! 🎉${pointsEarned > 0 ? ` +${pointsEarned} points earned!` : ""}`)
        router.push("/")
      } else {
        alert(data.error || "Failed to save mood")
      }
    } catch (error) {
      console.error("Error saving mood:", error)
      alert("Failed to save mood. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const toggleTag = (tag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

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
              <Sparkles className="w-6 h-6 text-indigo-500" />
              How are you feeling?
            </h1>
            <p className="text-slate-600">Track your mood and reflect on your day</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Mood Tracking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mood Selection */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <div className="text-indigo-500">😊</div>
                  Select Your Mood
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {moods.map((mood, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedMood(mood)}
                      className={`p-4 rounded-xl transition-all border-2 ${mood.color} ${
                        selectedMood?.label === mood.label
                          ? "ring-2 ring-indigo-500 scale-105 shadow-lg"
                          : "hover:scale-102"
                      }`}
                    >
                      <div className="text-3xl mb-2">{mood.emoji}</div>
                      <div className="text-sm font-semibold text-slate-700 mb-1">{mood.label}</div>
                      <div className="text-xs text-slate-500">{mood.description}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mood Intensity */}
            {selectedMood && (
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-500" />
                    How intense is this feeling?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="px-4">
                    <Slider
                      value={moodIntensity}
                      onValueChange={setMoodIntensity}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-slate-600 px-4">
                    <span>Very Low</span>
                    <div className="text-center">
                      <div className="font-bold text-lg text-slate-800">{moodIntensity[0]}/10</div>
                      <div className="text-xs">{intensityLabels[moodIntensity[0]]}</div>
                    </div>
                    <span>Amazing</span>
                  </div>

                  {/* Visual intensity indicator */}
                  <div className="flex justify-center">
                    <div
                      className={`text-4xl transition-all duration-300 ${
                        moodIntensity[0] <= 3 ? "grayscale" : moodIntensity[0] <= 6 ? "opacity-75" : "drop-shadow-lg"
                      }`}
                    >
                      {selectedMood.emoji}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800">What's influencing your mood?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {moodTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        selectedTags.includes(tag)
                          ? "bg-indigo-500 text-white shadow-lg"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <div className="mt-3 text-sm text-slate-600">Selected: {selectedTags.join(", ")}</div>
                )}
              </CardContent>
            </Card>

            {/* Journal Entry */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <div className="text-indigo-500">📝</div>
                  Journal Entry (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="What's on your mind today? Share your thoughts, experiences, or anything you'd like to remember..."
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  className="min-h-[120px] border-slate-200 focus:border-indigo-300 focus:ring-indigo-200 resize-none"
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-slate-500">{500 - journalEntry.length} characters remaining</div>
                  <div className="text-xs text-slate-500">+5 bonus points for journaling</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Moods */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                  Recent Moods
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentMoods.length > 0 ? (
                  <div className="space-y-3">
                    {recentMoods.map((mood, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                        <div className="text-2xl">{mood.mood.emoji}</div>
                        <div className="flex-1">
                          <div className="font-medium text-slate-800">{mood.mood.label}</div>
                          <div className="text-xs text-slate-500">{new Date(mood.date).toLocaleDateString()}</div>
                        </div>
                        <div className="text-sm font-medium text-slate-600">{mood.intensity}/10</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-3xl mb-2">📊</div>
                    <p className="text-sm text-slate-600">No recent moods yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mood Tips */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-indigo-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl mb-3">💡</div>
                  <h3 className="font-semibold text-slate-800 mb-2">Mood Tracking Tips</h3>
                  <ul className="text-sm text-slate-600 space-y-1 text-left">
                    <li>• Be honest about your feelings</li>
                    <li>• Track consistently for better insights</li>
                    <li>• Note what influences your mood</li>
                    <li>• Use journaling for deeper reflection</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center pb-8">
          <Button
            onClick={handleSaveMood}
            disabled={!selectedMood || saving}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium shadow-xl hover:shadow-2xl transition-all"
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? "Saving..." : "Save Mood Entry"}
          </Button>
        </div>
      </div>
    </div>
  )
}
