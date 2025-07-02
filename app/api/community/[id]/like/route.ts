import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import CommunityPost from "@/models/CommunityPost"
import { verifyToken, getTokenFromHeaders } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    const postId = params.id

    const post = await CommunityPost.findById(postId)
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const existingLike = post.likes.find((like) => like.userId.toString() === decoded.userId)

    if (existingLike) {
      post.likes = post.likes.filter((like) => like.userId.toString() !== decoded.userId)
    } else {
      post.likes.push({ userId: decoded.userId as any, createdAt: new Date() })
    }

    await post.save()

    return NextResponse.json({
      message: existingLike ? "Like removed" : "Post liked",
      likes: post.likes.length,
      liked: !existingLike,
    })
  } catch (error) {
    console.error("Like post error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
