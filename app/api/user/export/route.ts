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

    const url = new URL(request.url)
    const format = url.searchParams.get("format") || "json"
    const dateRange = url.searchParams.get("range") || "all"

    // Get user data
    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Calculate date range
    let startDate = new Date(0) // Beginning of time
    const endDate = new Date()

    switch (dateRange) {
      case "week":
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        break
      case "month":
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        break
      case "year":
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
        break
      case "all":
      default:
        startDate = new Date(0)
        break
    }

    // Fetch all user data
    const moodEntries = await MoodEntry.find({
      userId: decoded.userId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 })

    const communityPosts = await CommunityPost.find({
      userId: decoded.userId,
      createdAt: { $gte: startDate, $lte: endDate },
    }).sort({ createdAt: -1 })

    // Prepare export data
    const exportData = {
      user: {
        name: user.name,
        email: user.email,
        totalPoints: user.totalPoints,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        memberSince: user.createdAt,
        lastCheckIn: user.lastCheckIn,
      },
      summary: {
        totalMoodEntries: moodEntries.length,
        totalCommunityPosts: communityPosts.length,
        averageMood:
          moodEntries.length > 0
            ? Math.round((moodEntries.reduce((sum, entry) => sum + entry.intensity, 0) / moodEntries.length) * 10) / 10
            : 0,
        exportDate: new Date().toISOString(),
        dateRange: {
          from: startDate.toISOString(),
          to: endDate.toISOString(),
          range: dateRange,
        },
      },
      moodEntries: moodEntries.map((entry) => ({
        date: entry.date,
        mood: entry.mood,
        intensity: entry.intensity,
        journalEntry: entry.journalEntry || "",
        tags: entry.tags || [],
      })),
      communityPosts: communityPosts.map((post) => ({
        content: post.content,
        likes: post.likes.length,
        tags: post.tags,
        createdAt: post.createdAt,
      })),
      achievements: calculateAchievements(user, moodEntries, communityPosts),
    }

    // Return data based on format
    switch (format) {
      case "csv":
        return generateCSVResponse(exportData)
      case "json":
      default:
        return NextResponse.json(exportData, {
          headers: {
            "Content-Disposition": `attachment; filename="mindfulme-data-${new Date().toISOString().split("T")[0]}.json"`,
          },
        })
    }
  } catch (error) {
    console.error("Export data error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function calculateAchievements(user: any, moodEntries: any[], communityPosts: any[]) {
  const achievements = []

  if (user.currentStreak >= 7) {
    achievements.push({ name: "Week Warrior", icon: "🔥", description: "7-day streak", earned: true })
  }
  if (user.currentStreak >= 30) {
    achievements.push({ name: "Streak Master", icon: "⭐", description: "30-day streak", earned: true })
  }
  if (moodEntries.length >= 1) {
    achievements.push({ name: "First Steps", icon: "🌱", description: "First mood entry", earned: true })
  }
  if (moodEntries.length >= 10) {
    achievements.push({ name: "Mindful Moment", icon: "🧘", description: "10 mood entries", earned: true })
  }
  if (communityPosts.length >= 1) {
    achievements.push({ name: "Community Helper", icon: "🤝", description: "First community post", earned: true })
  }
  if (communityPosts.length >= 5) {
    achievements.push({ name: "Social Butterfly", icon: "🦋", description: "5 community posts", earned: true })
  }
  if (user.totalPoints >= 1000) {
    achievements.push({ name: "Wellness Warrior", icon: "💪", description: "Reach 1000 points", earned: true })
  }

  return achievements
}

function generateCSVResponse(data: any) {
  let csvContent = ""

  // User Summary
  csvContent += "USER SUMMARY\n"
  csvContent += "Name,Email,Total Points,Current Streak,Longest Streak,Member Since\n"
  csvContent += `"${data.user.name}","${data.user.email}",${data.user.totalPoints},${data.user.currentStreak},${data.user.longestStreak},"${new Date(data.user.memberSince).toLocaleDateString()}"\n\n`

  // Mood Entries
  csvContent += "MOOD ENTRIES\n"
  csvContent += "Date,Mood Emoji,Mood Label,Intensity,Journal Entry,Tags\n"
  data.moodEntries.forEach((entry: any) => {
    const tags = Array.isArray(entry.tags) ? entry.tags.join("; ") : ""
    const journalEntry = (entry.journalEntry || "").replace(/"/g, '""') // Escape quotes
    csvContent += `"${new Date(entry.date).toLocaleDateString()}","${entry.mood.emoji}","${entry.mood.label}",${entry.intensity},"${journalEntry}","${tags}"\n`
  })

  csvContent += "\nCOMMUNITY POSTS\n"
  csvContent += "Date,Content,Likes,Tags\n"
  data.communityPosts.forEach((post: any) => {
    const tags = Array.isArray(post.tags) ? post.tags.join("; ") : ""
    const content = (post.content || "").replace(/"/g, '""') // Escape quotes
    csvContent += `"${new Date(post.createdAt).toLocaleDateString()}","${content}",${post.likes},"${tags}"\n`
  })

  csvContent += "\nACHIEVEMENTS\n"
  csvContent += "Name,Description,Earned\n"
  data.achievements.forEach((achievement: any) => {
    csvContent += `"${achievement.name}","${achievement.description}",${achievement.earned ? "Yes" : "No"}\n`
  })

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="mindfulme-data-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  })
}
