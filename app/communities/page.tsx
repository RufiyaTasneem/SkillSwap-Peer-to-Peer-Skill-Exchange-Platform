"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/navigation"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MessageCircle, Users, Search, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { loadAllCommunities } from "@/lib/mock-service"
import { useAuth } from "@/contexts/auth-context"

export default function CommunitiesPage() {
  const { user, joinCommunity, leaveCommunity } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [comms, setComms] = useState<{ id: string; name: string; skillTag: string; membersCount: number }[]>([])

  useEffect(() => {
    const loaded = loadAllCommunities()
    setComms(Object.values(loaded))
  }, [])

  const filteredCommunities = comms.filter(
    (community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.skillTag.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const trendingCommunities = [...comms].sort((a, b) => b.membersCount - a.membersCount).slice(0, 3)

  const isRelated = (communitySkill: string) => {
    if (!user) return false
    const teach = user.skillsTeach.map((s) => s.name.toLowerCase())
    const learn = user.skillsLearn.map((s) => s.name.toLowerCase())
    return teach.includes(communitySkill.toLowerCase()) || learn.includes(communitySkill.toLowerCase())
  }

  const isJoined = (communityId: string) => {
    if (!user) return false
    return Array.isArray(user.joinedCommunities) && user.joinedCommunities.includes(communityId)
  }

  const handleJoin = (id: string) => {
    if (!user) return
    joinCommunity(id)
    // refresh communities list
    setComms(Object.values(loadAllCommunities()))
  }

  const handleLeave = (id: string) => {
    if (!user) return
    leaveCommunity(id)
    setComms(Object.values(loadAllCommunities()))
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="mb-4 flex items-center gap-4">
            <BackButton />
            <h1 className="text-3xl font-bold text-balance mb-2">Knowledge Circles</h1>
          </div>
          <p className="text-muted-foreground text-pretty">
            Join communities to collaborate, share knowledge, and connect with peers
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Your Communities</p>
                  <p className="text-2xl font-bold">{user && Array.isArray(user.joinedCommunities) ? user.joinedCommunities.length : 0}</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Members</p>
                  <p className="text-2xl font-bold">1,357</p>
                </div>
                <div className="p-3 rounded-lg bg-accent/10">
                  <Users className="h-5 w-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Posts This Week</p>
                  <p className="text-2xl font-bold">142</p>
                </div>
                <div className="p-3 rounded-lg bg-chart-3/10">
                  <TrendingUp className="h-5 w-5 text-chart-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Trending Communities */}
        <div>
          {/* Empty state when the user hasn't joined any communities */}
          {user && (!Array.isArray(user.joinedCommunities) || user.joinedCommunities.length === 0) && (
            <Card className="bg-muted/5">
              <CardContent className="p-6 text-center">
                <p className="font-medium mb-1">You haven't joined any communities yet</p>
                <p className="text-sm text-muted-foreground">Join communities related to your skills to get personalized updates and discussions.</p>
              </CardContent>
            </Card>
          )}
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Trending Now</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {trendingCommunities.map((community) => (
              <Card key={community.id} className={`bg-primary/5 border-primary/20 ${isRelated(community.skillTag) ? "ring-2 ring-primary/20" : ""}`}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                      {/* Use first letter of skill as icon */}
                      {community.skillTag.split(" ")[0][0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{community.name}</CardTitle>
                      <CardDescription className="text-xs truncate">{community.membersCount} members</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button onClick={() => (isJoined(community.id) ? handleLeave(community.id) : handleJoin(community.id))} size="sm" className="flex-1">
                      {isJoined(community.id) ? "Joined" : "Join"}
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/communities/${community.id}`}>View</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Communities */}
        <div>
          <h2 className="text-xl font-bold mb-4">All Communities</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCommunities.map((community) => (
              <Card key={community.id} className={`hover:shadow-md transition-shadow ${isRelated(community.skillTag) ? "ring-2 ring-primary/20" : ""}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-2xl">
                        {community.skillTag.split(" ")[0][0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{community.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {community.skillTag}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{community.name}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{community.membersCount} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button onClick={() => (isJoined(community.id) ? handleLeave(community.id) : handleJoin(community.id))} size="sm">
                        {isJoined(community.id) ? "Joined" : "Join"}
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/communities/${community.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCommunities.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">No communities found</h3>
                    <p className="text-sm text-muted-foreground">Try a different search term</p>
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
