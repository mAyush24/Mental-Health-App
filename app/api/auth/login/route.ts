import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  console.log("=== LOGIN REQUEST START ===")

  try {
    // Parse request body
    let body
    try {
      body = await request.json()
      console.log("Request body parsed:", { email: body.email, password: "[HIDDEN]" })
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { email, password } = body

    // Validate input
    if (!email || !password) {
      console.log("Missing required fields:", { email: !!email, password: !!password })
      return NextResponse.json({ error: "Please provide email and password" }, { status: 400 })
    }

    // Connect to database
    console.log("Connecting to database...")
    await connectDB()
    console.log("Database connected successfully")

    // Find user
    console.log("Finding user with email:", email)
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password")
    if (!user) {
      console.log("User not found")
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }
    console.log("User found with ID:", user._id)

    // Check password
    console.log("Verifying password...")
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      console.log("Invalid password")
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }
    console.log("Password verified successfully")

    // Generate token
    console.log("Generating JWT token...")
    const token = generateToken(user._id.toString())
    console.log("Token generated successfully")

    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      totalPoints: user.totalPoints,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
    }

    console.log("=== LOGIN SUCCESS ===")
    return NextResponse.json({
      message: "Login successful",
      token,
      user: userData,
    })
  } catch (error: any) {
    console.error("=== LOGIN ERROR ===")
    console.error("Error details:", error)
    console.error("Error stack:", error.stack)

    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
