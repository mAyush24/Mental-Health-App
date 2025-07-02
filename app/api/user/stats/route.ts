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

    // Get mood statistics
    const moodEntries = await MoodEntry.find({ userId: decoded.userId }).sort({ date: -1 })
    const totalMoodEntries = moodEntries.length
    const averageMood =
      totalMoodEntries > 0 ? moodEntries.reduce((sum, entry) => sum + entry.intensity, 0) / totalMoodEntries : 0

    // Get community stats
    const communityPosts = await CommunityPost.find({ userId: decoded.userId })
    const totalPosts = communityPosts.length
    const totalLikes = communityPosts.reduce((sum, post) => sum + post.likes.length, 0)

    // Calculate achievements
    const achievements = []

    if (user.currentStreak >= 7) {
      achievements.push({ name: "Week Warrior", icon: "🔥", description: "7-day streak", earned: true })
    }
    if (user.currentStreak >= 30) {
      achievements.push({ name: "Streak Master", icon: "⭐", description: "30-day streak", earned: true })
    }
    if (totalMoodEntries >= 1) {
      achievements.push({ name: "First Steps", icon: "🌱", description: "First mood entry", earned: true })
    }
    if (totalMoodEntries >= 10) {
      achievements.push({ name: "Mindful Moment", icon: "🧘", description: "10 mood entries", earned: true })
    }
    if (totalPosts >= 1) {
      achievements.push({ name: "Community Helper", icon: "🤝", description: "First community post", earned: true })
    }
    if (totalPosts >= 5) {
      achievements.push({ name: "Social Butterfly", icon: "🦋", description: "5 community posts", earned: true })
    }

    // Add unearned achievements
    const allAchievements = [
      { name: "First Steps", icon: "🌱", description: "Complete first mood entry", earned: totalMoodEntries >= 1 },
      { name: "Week Warrior", icon: "🔥", description: "Maintain 7-day streak", earned: user.currentStreak >= 7 },
      { name: "Streak Master", icon: "⭐", description: "Maintain 30-day streak", earned: user.currentStreak >= 30 },
      { name: "Mindful Moment", icon: "🧘", description: "Complete 10 mood entries", earned: totalMoodEntries >= 10 },
      { name: "Community Helper", icon: "🤝", description: "Make first community post", earned: totalPosts >= 1 },
      { name: "Social Butterfly", icon: "🦋", description: "Make 5 community posts", earned: totalPosts >= 5 },
      { name: "Gratitude Guru", icon: "🙏", description: "Write 30 journal entries", earned: false },
      { name: "Wellness Warrior", icon: "💪", description: "Reach 1000 points", earned: user.totalPoints >= 1000 },
    ]

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        totalPoints: user.totalPoints,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        lastCheckIn: user.lastCheckIn,
      },
      stats: {
        totalMoodEntries,
        averageMood: Math.round(averageMood * 10) / 10,
        totalPosts,
        totalLikes,
        joinedDate: user.createdAt,
      },
      achievements: allAchievements,
    })
  } catch (error) {
    console.error("Get user stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
