"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { communities, communityPosts } from "@/lib/mock-data"
import { Users, Heart, MessageSquare, Send, ArrowLeft } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function CommunityDetailPage() {
  const params = useParams()
  const [newPost, setNewPost] = useState("")
  const [joined, setJoined] = useState(false)

  const community = communities.find((c) => c.id === params.id)

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

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, would create post
    console.log("New post:", newPost)
    setNewPost("")
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
                  {community.icon}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{community.name}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{community.description}</CardDescription>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{community.members} members</span>
                    </div>
                    <Badge>{community.category}</Badge>
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

          {communityPosts.map((post) => (
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
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {communityPosts.length === 0 && (
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
