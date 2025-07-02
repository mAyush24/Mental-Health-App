import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import BreathingSession from "@/models/BreathingSession"
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

    const { technique, duration, cycles } = await request.json()

    if (!technique || !cycles) {
      return NextResponse.json({ error: "Please provide technique and cycles" }, { status: 400 })
    }

    // Create breathing session record
    const session = await BreathingSession.create({
      userId: decoded.userId,
      technique,
      duration: duration || 0,
      cycles,
      completedAt: new Date(),
    })

    // Award points to user
    const user = await User.findById(decoded.userId)
    if (user) {
      user.totalPoints += 10 // Award 10 points for completing a breathing session
      await user.save()
    }

    return NextResponse.json({
      message: "Breathing session saved successfully",
      session: {
        id: session._id.toString(),
        technique: session.technique,
        duration: session.duration,
        cycles: session.cycles,
        completedAt: session.completedAt,
      },
      pointsEarned: 10,
      totalPoints: user?.totalPoints || 0,
    })
  } catch (error) {
    console.error("Save breathing session error:", error)
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

    // Get user's breathing sessions
    const sessions = await BreathingSession.find({ userId: decoded.userId }).sort({ completedAt: -1 }).limit(20)

    // Calculate statistics
    const totalSessions = sessions.length
    const totalCycles = sessions.reduce((sum, session) => sum + session.cycles, 0)
    const totalDuration = sessions.reduce((sum, session) => sum + (session.duration || 0), 0)

    const techniqueStats = sessions.reduce(
      (acc, session) => {
        acc[session.technique] = (acc[session.technique] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const recentSessions = sessions.slice(0, 5).map((session) => ({
      id: session._id.toString(),
      technique: session.technique,
      duration: session.duration,
      cycles: session.cycles,
      completedAt: session.completedAt,
    }))

    return NextResponse.json({
      sessions: recentSessions,
      stats: {
        totalSessions,
        totalCycles,
        totalDuration,
        techniqueStats,
        averageCycles: totalSessions > 0 ? Math.round(totalCycles / totalSessions) : 0,
        averageDuration: totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0,
      },
    })
  } catch (error) {
    console.error("Get breathing sessions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
