import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import MoodEntry from "@/models/MoodEntry"
import CommunityPost from "@/models/CommunityPost"
import User from "@/models/User"
import { verifyToken, getTokenFromHeaders } from "@/lib/auth"

const baseSuggestions = [
  {
    type: "breathing",
    title: "Guided Breathing Exercise",
    description: "Try a guided breathing technique to reduce stress and improve focus.",
    icon: "🫁",
    action: "Start Breathing",
    color: "from-cyan-400 to-blue-500",
    category: "mindfulness",
    priority: 1,
  },
  {
    type: "gratitude",
    title: "Gratitude Journaling",
    description: "Write down three things you're grateful for today.",
    icon: "🙏",
    action: "Start Journaling",
    color: "from-green-400 to-emerald-500",
    category: "reflection",
    priority: 2,
  },
  {
    type: "meditation",
    title: "Mindfulness Meditation",
    description: "Take 10 minutes to practice mindfulness and center yourself.",
    icon: "🧘",
    action: "Start Meditation",
    color: "from-purple-400 to-indigo-500",
    category: "mindfulness",
    priority: 3,
  },
  {
    type: "walk",
    title: "Nature Walk",
    description: "Step outside for a refreshing walk to boost your mood.",
    icon: "🚶",
    action: "Plan Walk",
    color: "from-green-400 to-teal-500",
    category: "physical",
    priority: 4,
  },
  {
    type: "music",
    title: "Calming Music",
    description: "Listen to soothing music to help relax your mind.",
    icon: "🎵",
    action: "Play Music",
    color: "from-pink-400 to-rose-500",
    category: "relaxation",
    priority: 5,
  },
  {
    type: "stretch",
    title: "Gentle Stretching",
    description: "Do some light stretches to release tension in your body.",
    icon: "🤸",
    action: "Start Stretching",
    color: "from-orange-400 to-yellow-500",
    category: "physical",
    priority: 6,
  },
  {
    type: "social",
    title: "Connect with Community",
    description: "Share your thoughts or support others in the community.",
    icon: "👥",
    action: "Visit Community",
    color: "from-indigo-400 to-purple-500",
    category: "social",
    priority: 7,
  },
  {
    type: "mood-track",
    title: "Track Your Mood",
    description: "Take a moment to check in with yourself and log your mood.",
    icon: "💝",
    action: "Track Mood",
    color: "from-pink-400 to-purple-500",
    category: "tracking",
    priority: 8,
  },
  {
    type: "progress",
    title: "Review Your Progress",
    description: "Look at your achievements and celebrate your journey.",
    icon: "📊",
    action: "View Progress",
    color: "from-cyan-400 to-blue-500",
    category: "reflection",
    priority: 9,
  },
]

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

    // Get recent mood entries (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentMoods = await MoodEntry.find({
      userId: decoded.userId,
      date: { $gte: sevenDaysAgo },
    }).sort({ date: -1 })

    // Get today's data
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

    const todayMoodEntry = await MoodEntry.findOne({
      userId: decoded.userId,
      date: { $gte: startOfDay, $lt: endOfDay },
    })

    const todayPosts = await CommunityPost.find({
      userId: decoded.userId,
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    })

    // Analyze user patterns and generate personalized suggestions
    const personalizedSuggestions = generatePersonalizedSuggestions({
      user,
      recentMoods,
      todayMoodEntry,
      todayPosts,
    })

    return NextResponse.json({
      suggestions: personalizedSuggestions,
      personalizedMessage: getPersonalizedMessage({
        user,
        recentMoods,
        todayMoodEntry,
        todayPosts,
      }),
      analytics: {
        recentMoodCount: recentMoods.length,
        averageRecentMood:
          recentMoods.length > 0
            ? Math.round((recentMoods.reduce((sum, mood) => sum + mood.intensity, 0) / recentMoods.length) * 10) / 10
            : 0,
        hasTrackedToday: !!todayMoodEntry,
        hasPostedToday: todayPosts.length > 0,
        currentStreak: user.currentStreak,
      },
    })
  } catch (error) {
    console.error("Get AI suggestions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generatePersonalizedSuggestions({ user, recentMoods, todayMoodEntry, todayPosts }) {
  const suggestions = []
  const suggestionTypes = new Set()

  // Priority 1: Daily tracking if not done
  if (!todayMoodEntry) {
    const moodSuggestion = baseSuggestions.find((s) => s.type === "mood-track")
    if (moodSuggestion) {
      suggestions.push({
        ...moodSuggestion,
        description: "You haven't tracked your mood today. Take a moment to check in with yourself.",
        priority: 1,
        reason: "daily_tracking",
      })
      suggestionTypes.add("mood-track")
    }
  }

  // Priority 2: Community engagement if not active
  if (todayPosts.length === 0 && user.totalPoints < 50) {
    const socialSuggestion = baseSuggestions.find((s) => s.type === "social")
    if (socialSuggestion) {
      suggestions.push({
        ...socialSuggestion,
        description: "Connect with others who understand your journey. Share or support someone today.",
        priority: 2,
        reason: "community_engagement",
      })
      suggestionTypes.add("social")
    }
  }

  // Analyze recent mood patterns
  if (recentMoods.length > 0) {
    const averageIntensity = recentMoods.reduce((sum, mood) => sum + mood.intensity, 0) / recentMoods.length
    const recentMoodLabels = recentMoods.map((mood) => mood.mood.label.toLowerCase())
    const lastMood = recentMoods[0]

    // Low mood suggestions
    if (averageIntensity < 5) {
      if (!suggestionTypes.has("breathing")) {
        const breathingSuggestion = baseSuggestions.find((s) => s.type === "breathing")
        suggestions.push({
          ...breathingSuggestion,
          description: "Your recent moods suggest you might benefit from some calming breathing exercises.",
          priority: 3,
          reason: "low_mood_pattern",
        })
        suggestionTypes.add("breathing")
      }

      if (!suggestionTypes.has("music") && suggestions.length < 3) {
        const musicSuggestion = baseSuggestions.find((s) => s.type === "music")
        suggestions.push({
          ...musicSuggestion,
          description: "Some soothing music might help lift your spirits and provide comfort.",
          priority: 4,
          reason: "mood_support",
        })
        suggestionTypes.add("music")
      }
    }

    // High mood suggestions
    if (averageIntensity > 7) {
      if (!suggestionTypes.has("gratitude")) {
        const gratitudeSuggestion = baseSuggestions.find((s) => s.type === "gratitude")
        suggestions.push({
          ...gratitudeSuggestion,
          description: "You're feeling great! Capture this positive energy with some gratitude journaling.",
          priority: 3,
          reason: "positive_mood",
        })
        suggestionTypes.add("gratitude")
      }

      if (!suggestionTypes.has("walk") && suggestions.length < 3) {
        const walkSuggestion = baseSuggestions.find((s) => s.type === "walk")
        suggestions.push({
          ...walkSuggestion,
          description: "Your positive energy is perfect for an energizing walk outside!",
          priority: 4,
          reason: "energy_boost",
        })
        suggestionTypes.add("walk")
      }
    }

    // Specific mood-based suggestions
    if (recentMoodLabels.includes("anxious") || recentMoodLabels.includes("stressed")) {
      if (!suggestionTypes.has("meditation")) {
        const meditationSuggestion = baseSuggestions.find((s) => s.type === "meditation")
        suggestions.push({
          ...meditationSuggestion,
          description: "Feeling anxious? A short meditation can help calm your mind and reduce stress.",
          priority: 2,
          reason: "anxiety_support",
        })
        suggestionTypes.add("meditation")
      }
    }

    if (recentMoodLabels.includes("tired") || recentMoodLabels.includes("exhausted")) {
      if (!suggestionTypes.has("stretch")) {
        const stretchSuggestion = baseSuggestions.find((s) => s.type === "stretch")
        suggestions.push({
          ...stretchSuggestion,
          description: "Feeling tired? Some gentle stretches can help energize your body and mind.",
          priority: 3,
          reason: "energy_boost",
        })
        suggestionTypes.add("stretch")
      }
    }
  }

  // Streak-based suggestions
  if (user.currentStreak >= 7 && !suggestionTypes.has("progress")) {
    const progressSuggestion = baseSuggestions.find((s) => s.type === "progress")
    suggestions.push({
      ...progressSuggestion,
      description: `Amazing ${user.currentStreak}-day streak! Take a moment to celebrate your consistency.`,
      priority: 5,
      reason: "streak_celebration",
    })
    suggestionTypes.add("progress")
  }

  // Fill remaining slots with general suggestions
  while (suggestions.length < 3) {
    const availableSuggestions = baseSuggestions.filter((s) => !suggestionTypes.has(s.type))
    if (availableSuggestions.length === 0) break

    const randomSuggestion = availableSuggestions[Math.floor(Math.random() * availableSuggestions.length)]
    suggestions.push({
      ...randomSuggestion,
      priority: 10,
      reason: "general_wellness",
    })
    suggestionTypes.add(randomSuggestion.type)
  }

  // Sort by priority and return top 3
  return suggestions.sort((a, b) => a.priority - b.priority).slice(0, 3)
}

function getPersonalizedMessage({ user, recentMoods, todayMoodEntry, todayPosts }) {
  const timeOfDay = new Date().getHours()
  let greeting = "Hello"

  if (timeOfDay < 12) greeting = "Good morning"
  else if (timeOfDay < 17) greeting = "Good afternoon"
  else greeting = "Good evening"

  if (!todayMoodEntry) {
    return `${greeting}, ${user.name}! Ready to start your wellness journey today?`
  }

  if (recentMoods.length === 0) {
    return `${greeting}! Here are some activities to support your wellbeing.`
  }

  const averageIntensity = recentMoods.reduce((sum, mood) => sum + mood.intensity, 0) / recentMoods.length

  if (averageIntensity < 5) {
    return `${greeting}, ${user.name}. I've noticed you've been having some challenging days. Here are some gentle activities that might help.`
  }

  if (averageIntensity > 7) {
    return `${greeting}, ${user.name}! You've been feeling great lately. Let's keep that positive momentum going!`
  }

  if (user.currentStreak >= 7) {
    return `${greeting}, ${user.name}! Your ${user.currentStreak}-day streak is impressive. Here are some ways to maintain your wellness routine.`
  }

  return `${greeting}, ${user.name}! Based on your recent activity, here are some personalized suggestions for you.`
}
