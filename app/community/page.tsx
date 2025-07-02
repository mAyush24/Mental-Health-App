"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, MessageCircle, Send, Plus, Users, Sparkles } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function Community() {
  const { user, loading, getAuthHeaders, updateUser } = useAuth()
  const router = useRouter()
  const [newPost, setNewPost] = useState("")
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [likedPosts, setLikedPosts] = useState(new Set())

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    } else if (user) {
      fetchPosts()
    }
  }, [user, loading, router])

  const fetchPosts = async () => {
    setLoadingPosts(true)
    try {
      const response = await fetch("/api/community", {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      } else {
        console.error("Failed to fetch posts:", response.status)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoadingPosts(false)
    }
  }

  const handleSubmitPost = async () => {
    if (!newPost.trim() || submitting) return

    setSubmitting(true)
    try {
      const response = await fetch("/api/community", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          content: newPost.trim(),
          tags: [],
        }),
      })

      if (response.ok) {
        const data = await response.json()

        // Add the new post to the beginning of the posts array
        const newPostData = {
          id: data.post.id,
          content: data.post.content,
          authorName: data.post.authorName,
          likes: 0,
          tags: data.post.tags,
          createdAt: data.post.createdAt,
          timestamp: "Just now",
        }

        setPosts([newPostData, ...posts])
        setNewPost("")

        // Update user points
        if (user) {
          updateUser({
            ...user,
            totalPoints: user.totalPoints + 5,
          })
        }
      } else {
        const errorData = await response.json()
        alert(errorData.error || "Failed to create post")
      }
    } catch (error) {
      console.error("Error creating post:", error)
      alert("Failed to create post. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`/api/community/${postId}/like`, {
        method: "POST",
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        const data = await response.json()

        // Update the posts array with new like count
        setPosts(posts.map((post) => (post.id === postId ? { ...post, likes: data.likes } : post)))

        // Update liked posts set
        const newLikedPosts = new Set(likedPosts)
        if (data.liked) {
          newLikedPosts.add(postId)
        } else {
          newLikedPosts.delete(postId)
        }
        setLikedPosts(newLikedPosts)
      }
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/50">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-500" />
              Community Support
            </h1>
            <p className="text-slate-600">Share and connect with others on their wellness journey</p>
          </div>
        </div>

        {/* Community Guidelines */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🌱</div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-green-500" />
                  Safe Space Guidelines
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  This is a supportive, anonymous community. Please be kind, respectful, and remember that everyone is
                  on their own unique wellness journey. Share positivity and encouragement! 💚
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Post */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-800 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-500" />
              Share Your Thoughts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Share something positive, ask for support, or offer encouragement to others... ✨"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[120px] border-slate-200 focus:border-indigo-300 focus:ring-indigo-200 resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <p className="text-xs text-slate-500">
                  Posts are anonymous • {500 - newPost.length} characters remaining
                </p>
                <div className="text-xs text-slate-500">+5 points for posting</div>
              </div>
              <Button
                onClick={handleSubmitPost}
                disabled={!newPost.trim() || submitting}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitting ? "Sharing..." : "Share"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        {loadingPosts ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">No posts yet</h3>
                  <p className="text-slate-600">Be the first to share something with the community!</p>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <Card
                  key={post.id}
                  className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                            {post.authorName?.charAt(0) || "A"}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{post.authorName || "Anonymous"}</p>
                            <p className="text-sm text-slate-500">{post.timestamp}</p>
                          </div>
                        </div>
                      </div>

                      <p className="text-slate-700 leading-relaxed text-base">{post.content}</p>

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className={`transition-colors ${
                            likedPosts.has(post.id)
                              ? "text-red-500 hover:text-red-600 hover:bg-red-50"
                              : "text-slate-600 hover:text-red-500 hover:bg-red-50"
                          }`}
                        >
                          <Heart className={`w-4 h-4 mr-1 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                          {post.likes || 0}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-600 hover:text-blue-500 hover:bg-blue-50"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Load More */}
        {posts.length > 0 && (
          <div className="text-center py-8">
            <Button
              variant="outline"
              className="border-slate-200 text-slate-600 hover:bg-white/50 bg-transparent shadow-lg"
              onClick={fetchPosts}
            >
              Refresh Posts
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
