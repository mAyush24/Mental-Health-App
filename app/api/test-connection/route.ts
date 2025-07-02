import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"

export async function GET() {
  try {
    console.log("Testing MongoDB connection...")
    await connectDB()
    console.log("MongoDB connected successfully!")

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
