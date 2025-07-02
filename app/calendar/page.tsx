"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function MoodCalendar() {
  const { user, loading, getAuthHeaders } = useAuth()
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarData, setCalendarData] = useState({})
  const [loadingData, setLoadingData] = useState(true)
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    } else if (user) {
      fetchCalendarData()
    }
  }, [user, loading, router, currentDate])

  const fetchCalendarData = async () => {
    setLoadingData(true)
    try {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1

      const response = await fetch(`/api/mood/calendar?year=${year}&month=${month}`, {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        setCalendarData(data.calendarData)
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error)
    } finally {
      setLoadingData(false)
    }
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const getMoodColor = (intensity) => {
    if (intensity >= 8) return "bg-green-100 border-green-300"
    if (intensity >= 6) return "bg-yellow-100 border-yellow-300"
    if (intensity >= 4) return "bg-orange-100 border-orange-300"
    return "bg-red-100 border-red-300"
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

  const days = getDaysInMonth(currentDate)
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

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
            <h1 className="text-2xl font-bold text-slate-800">Mood Calendar</h1>
            <p className="text-slate-600">Track your emotional journey over time</p>
          </div>
        </div>

        {/* Calendar */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateMonth(-1)}
                  className="rounded-full hover:bg-indigo-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateMonth(1)}
                  className="rounded-full hover:bg-indigo-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <>
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {dayNames.map((day) => (
                    <div key={day} className="text-center text-sm font-semibold text-slate-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-2">
                  {days.map((day, index) => {
                    if (!day) {
                      return <div key={index} className="aspect-square"></div>
                    }

                    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day)
                    const mood = calendarData[dateKey]
                    const isToday =
                      new Date().toDateString() ===
                      new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()

                    return (
                      <div
                        key={day}
                        onClick={() => setSelectedDate(mood ? { day, mood } : null)}
                        className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 ${
                          mood
                            ? `${getMoodColor(mood.intensity)} hover:shadow-md`
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                        } ${isToday ? "ring-2 ring-indigo-400" : ""}`}
                      >
                        <div className={`text-sm font-medium mb-1 ${isToday ? "text-indigo-600" : "text-slate-700"}`}>
                          {day}
                        </div>
                        {mood && (
                          <div className="flex flex-col items-center">
                            <div className="text-lg">{mood.emoji}</div>
                            <div className="text-xs text-slate-500">{mood.intensity}/10</div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        {selectedDate && (
          <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{selectedDate.mood.emoji}</div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {monthNames[currentDate.getMonth()]} {selectedDate.day}
                  </h3>
                  <p className="text-slate-600">
                    Feeling {selectedDate.mood.label} - Intensity: {selectedDate.mood.intensity}/10
                  </p>
                </div>
                <Button variant="ghost" onClick={() => setSelectedDate(null)} className="ml-auto">
                  ✕
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mood Legend */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-800">Mood Intensity Scale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-200 border border-red-300"></div>
                <span className="text-sm text-slate-600">Low (1-3)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-200 border border-orange-300"></div>
                <span className="text-sm text-slate-600">Mild (4-5)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-200 border border-yellow-300"></div>
                <span className="text-sm text-slate-600">Good (6-7)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-200 border border-green-300"></div>
                <span className="text-sm text-slate-600">Great (8-10)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
