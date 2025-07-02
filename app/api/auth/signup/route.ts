import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  console.log("=== SIGNUP REQUEST START ===")

  try {
    // Parse request body
    let body
    try {
      body = await request.json()
      console.log("Request body parsed:", { ...body, password: "[HIDDEN]" })
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { name, email, password } = body

    // Validate input
    if (!name || !email || !password) {
      console.log("Missing required fields:", { name: !!name, email: !!email, password: !!password })
      return NextResponse.json({ error: "Please provide name, email, and password" }, { status: 400 })
    }

    if (password.length < 6) {
      console.log("Password too short")
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Connect to database
    console.log("Connecting to database...")
    await connectDB()
    console.log("Database connected successfully")

    // Check if user exists
    console.log("Checking if user exists with email:", email)
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      console.log("User already exists")
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 })
    }

    // Create user
    console.log("Creating new user...")
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    })
    console.log("User created successfully with ID:", user._id)

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

    console.log("=== SIGNUP SUCCESS ===")
    return NextResponse.json(
      {
        message: "User created successfully",
        token,
        user: userData,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("=== SIGNUP ERROR ===")
    console.error("Error details:", error)
    console.error("Error stack:", error.stack)

    if (error.code === 11000) {
      console.log("Duplicate key error")
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 })
    }

    if (error.name === "ValidationError") {
      console.log("Validation error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
