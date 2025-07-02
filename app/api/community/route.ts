import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import CommunityPost from "@/models/CommunityPost"
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

    const { content, tags } = await request.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Please provide content for the post" }, { status: 400 })
    }

    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const post = await CommunityPost.create({
      userId: decoded.userId,
      content: content.trim(),
      authorName: user.name,
      tags: tags || [],
    })

    user.totalPoints += 5
    await user.save()

    return NextResponse.json({
      message: "Post created successfully",
      post: {
        id: post._id.toString(),
        content: post.content,
        authorName: post.authorName,
        likes: post.likes.length,
        tags: post.tags,
        createdAt: post.createdAt,
        timestamp: "Just now",
      },
    })
  } catch (error) {
    console.error("Create post error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectDB()

    const posts = await CommunityPost.find().populate("userId", "name").sort({ createdAt: -1 }).limit(20)

    const formattedPosts = posts.map((post) => ({
      id: post._id.toString(),
      content: post.content,
      authorName: post.authorName || post.userId?.name || "Anonymous",
      likes: post.likes.length,
      tags: post.tags,
      createdAt: post.createdAt,
      timestamp: getDetailedTimeAgo(post.createdAt),
    }))

    return NextResponse.json({ posts: formattedPosts })
  } catch (error) {
    console.error("Get posts error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function getDetailedTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 1) {
    return "Just now"
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })
  }
}
