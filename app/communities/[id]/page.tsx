"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { loadAllCommunities } from "@/lib/mock-service"
import { communityPosts } from "@/lib/mock-data"
import { Users, Heart, MessageSquare, Send, ArrowLeft } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function CommunityDetailPage() {
  const params = useParams()
  const [newPost, setNewPost] = useState("")
  const [joined, setJoined] = useState(false)
  const [posts, setPosts] = useState(communityPosts)

  // Normalize params.id to handle string | string[] and ensure string type
  const communityId = String(Array.isArray(params.id) ? params.id[0] : params.id)

  // Load communities from the same source as the list page
  // Convert Record to array since loadAllCommunities() returns Record<string, Community>
  const communities = Object.values(loadAllCommunities())

  const community = communities.find((c) => c.id === communityId)

  if (!community) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold mb-2">Community not found</h2>
              <p className="text-muted-foreground mb-4">The community you're looking for doesn't exist</p>
              <Button asChild>
                <Link href="/communities">Back to Communities</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Derive UI-friendly fields from the stored community shape
  const communityIcon = community.skillTag.split(" ")[0][0]
  const communityDescription = `${community.skillTag} community for discussion and resources.`

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.trim()) return

    // Create new post object with mock values
    const newPostObject = {
      id: `post_${Date.now()}`,
      author: "You",
      content: newPost,
      timestamp: "just now",
      avatar: "/placeholder-user.jpg",
      likes: 0,
      comments: 0,
    }

    // Add new post to the beginning of the posts array
    setPosts([newPostObject, ...posts])
    setNewPost("")
  }

  const handleLike = (postId: string) => {
    setPosts(posts.map((post) =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ))
  }

  const handleComment = (postId: string) => {
    console.log("Comment on post:", postId)
    // Placeholder: would open comment dialog in a full app
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" asChild>
          <Link href="/communities">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Communities
          </Link>
        </Button>

        {/* Community Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-3xl">
                  {communityIcon}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{community.name}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{communityDescription}</CardDescription>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{community.membersCount} members</span>
                    </div>
                    <Badge>{community.skillTag}</Badge>
                  </div>
                </div>
              </div>
              <Button onClick={() => setJoined(!joined)}>{joined ? "Leave" : "Join Community"}</Button>
            </div>
          </CardHeader>
        </Card>

        {/* Create Post */}
        <Card>
          <CardHeader>
            <CardTitle>Share with the community</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitPost} className="space-y-3">
              <Textarea
                placeholder="What's on your mind? Share tips, ask questions, or start a discussion..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={!newPost.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Post
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Recent Posts</h2>

          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {post.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{post.author}</span>
                      <span className="text-sm text-muted-foreground">{post.timestamp}</span>
                    </div>
                    <p className="text-sm leading-relaxed mb-4">{post.content}</p>
                    <div className="flex items-center gap-4">
                      <button onClick={() => handleLike(post.id)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </button>
                      <button onClick={() => handleComment(post.id)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {posts.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">No posts yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Be the first to share something with this community!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
