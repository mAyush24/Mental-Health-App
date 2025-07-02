import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import MoodEntry from "@/models/MoodEntry"
import User from "@/models/User"
import { verifyToken, getTokenFromHeaders } from "@/lib/auth"

export async function POST(request: NextRequest) {
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

    const { mood, intensity, journalEntry } = await request.json()

    if (!mood || !intensity) {
      return NextResponse.json({ error: "Please provide mood and intensity" }, { status: 400 })
    }

    const moodEntry = await MoodEntry.create({
      userId: decoded.userId,
      mood,
      intensity,
      journalEntry: journalEntry || "",
    })

    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const today = new Date()
    const lastCheckIn = user.lastCheckIn

    let streakUpdated = false
    if (!lastCheckIn || !isSameDay(lastCheckIn, today)) {
      if (lastCheckIn && isConsecutiveDay(lastCheckIn, today)) {
        user.currentStreak += 1
      } else {
        user.currentStreak = 1
      }

      user.totalPoints += 10
      user.lastCheckIn = today

      if (user.currentStreak > user.longestStreak) {
        user.longestStreak = user.currentStreak
      }

      streakUpdated = true
      await user.save()
    }

    return NextResponse.json({
      message: "Mood entry saved successfully",
      moodEntry,
      streakUpdated,
      currentStreak: user.currentStreak,
      totalPoints: user.totalPoints,
    })
  } catch (error) {
    console.error("Mood entry error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    const moodEntries = await MoodEntry.find({ userId: decoded.userId }).sort({ date: -1 }).limit(30)

    return NextResponse.json({ moodEntries })
  } catch (error) {
    console.error("Get mood entries error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString()
}

function isConsecutiveDay(lastDate: Date, currentDate: Date): boolean {
  const yesterday = new Date(currentDate)
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(lastDate, yesterday)
}
