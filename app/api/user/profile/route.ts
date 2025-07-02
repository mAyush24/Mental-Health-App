import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
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

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        totalPoints: user.totalPoints,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        lastCheckIn: user.lastCheckIn,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
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

    const { name, email } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ error: "Please provide name and email" }, { status: 400 })
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
      _id: { $ne: decoded.userId },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email is already taken" }, { status: 400 })
    }

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      {
        name: name.trim(),
        email: email.toLowerCase().trim(),
      },
      { new: true },
    )

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        totalPoints: user.totalPoints,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
      },
    })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
