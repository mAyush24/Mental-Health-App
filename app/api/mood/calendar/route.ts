import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import MoodEntry from "@/models/MoodEntry"
import { verifyToken, getTokenFromHeaders } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const token = getTokenFromHeaders(request.headers)
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const url = new URL(request.url)
    const year = Number.parseInt(url.searchParams.get("year") || new Date().getFullYear().toString())
    const month = Number.parseInt(url.searchParams.get("month") || (new Date().getMonth() + 1).toString())

    // Get mood entries for the specified month
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const moodEntries = await MoodEntry.find({
      userId: decoded.userId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ date: 1 })

    // Format data for calendar
    const calendarData = {}
    moodEntries.forEach((entry) => {
      const dateKey = entry.date.toISOString().split("T")[0]
      calendarData[dateKey] = {
        emoji: entry.mood.emoji,
        label: entry.mood.label,
        intensity: entry.intensity,
      }
    })

    return NextResponse.json({ calendarData })
  } catch (error) {
    console.error("Get calendar data error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
