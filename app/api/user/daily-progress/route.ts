import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import MoodEntry from "@/models/MoodEntry"
import CommunityPost from "@/models/CommunityPost"
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

    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get today's date range
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

    // Check today's activities
    const todayMoodEntry = await MoodEntry.findOne({
      userId: decoded.userId,
      date: { $gte: startOfDay, $lt: endOfDay },
    })

    const todayPosts = await CommunityPost.find({
      userId: decoded.userId,
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    })

    // Check today's breathing sessions
    const BreathingSession = require("@/models/BreathingSession").default
    const todayBreathingSessions = await BreathingSession.find({
      userId: decoded.userId,
      completedAt: { $gte: startOfDay, $lt: endOfDay },
    })

    // Calculate progress
    const goals = [
      {
        id: "mood",
        name: "Track Mood",
        completed: !!todayMoodEntry,
        icon: "💝",
        description: "Log your daily mood",
      },
      {
        id: "journal",
        name: "Journal Entry",
        completed: !!(todayMoodEntry && todayMoodEntry.journalEntry),
        icon: "📝",
        description: "Write in your journal",
      },
      {
        id: "community",
        name: "Community Post",
        completed: todayPosts.length > 0,
        icon: "👥",
        description: "Share with community",
      },
      {
        id: "breathing",
        name: "Breathing Exercise",
        completed: todayBreathingSessions.length > 0,
        icon: "🫁",
        description: "Practice mindful breathing",
      },
    ]

    const completedGoals = goals.filter((goal) => goal.completed).length
    const progressPercentage = Math.round((completedGoals / goals.length) * 100)

    // Recent activities
    const recentActivities = []

    if (todayMoodEntry) {
      recentActivities.push({
        type: "mood",
        title: "Mood tracked",
        description: `Feeling ${todayMoodEntry.mood.label} (${todayMoodEntry.intensity}/10)`,
        time: todayMoodEntry.date,
        icon: todayMoodEntry.mood.emoji,
      })
    }

    if (todayPosts.length > 0) {
      recentActivities.push({
        type: "community",
        title: "Community post shared",
        description: "Thanks for contributing to the community!",
        time: todayPosts[0].createdAt,
        icon: "💬",
      })
    }

    if (user.currentStreak > (user.previousStreak || 0)) {
      recentActivities.push({
        type: "streak",
        title: "Streak updated",
        description: `${user.currentStreak} day streak maintained!`,
        time: user.lastCheckIn || new Date(),
        icon: "🔥",
      })
    }

    if (todayBreathingSessions.length > 0) {
      recentActivities.push({
        type: "breathing",
        title: "Breathing exercise completed",
        description: `Completed ${todayBreathingSessions[0].cycles} cycles of ${todayBreathingSessions[0].technique} breathing`,
        time: todayBreathingSessions[0].completedAt,
        icon: "🫁",
      })
    }

    return NextResponse.json({
      goals,
      progressPercentage,
      completedGoals,
      totalGoals: goals.length,
      recentActivities: recentActivities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()),
    })
  } catch (error) {
    console.error("Get daily progress error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
