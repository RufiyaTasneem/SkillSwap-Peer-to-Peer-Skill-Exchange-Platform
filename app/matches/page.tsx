"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/navigation"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Star, Search, Filter, ArrowRight, Loader2, Brain, TrendingUp, Users, Lightbulb } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { RequestSessionDialog } from "@/components/request-session-dialog"
import { useAuth } from "@/contexts/auth-context"
import { findMatches, getCompatibilityTag, type MatchResult } from "@/lib/matching-service"
import { loadAllUsers } from "@/lib/mock-service"

interface AIMatchResult extends MatchResult {
  compatibilityTag: string
  aiInsights: Array<{
    type: string
    message: string
    priority: 'high' | 'medium' | 'low'
  }>
  recommendedActions: Array<{
    action: string
    label: string
    priority: 'high' | 'medium' | 'low'
  }>
}

export default function MatchesPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedMatch, setSelectedMatch] = useState<AIMatchResult | null>(null)
  const [matches, setMatches] = useState<AIMatchResult[]>([])
  const [loadingMatches, setLoadingMatches] = useState(true)
  const [aiInsights, setAiInsights] = useState<any>(null)

  // Load matches when user data is available
  useEffect(() => {
    if (!authLoading && user) {
      loadAIMatches()
    } else if (!authLoading && !user) {
      setMatches([])
      setLoadingMatches(false)
    }
  }, [user, authLoading])

  const loadAIMatches = async () => {
    if (!user) return

    setLoadingMatches(true)
    try {
      // Try backend AI matching first
      try {
        const response = await fetch('http://localhost:3001/api/matches/find', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            limit: 20
          })
        })

        if (response.ok) {
          const data = await response.json()
          setMatches(data.data.matches)
          return
        }
      } catch (error) {
        console.log('Backend not available, using local AI matching')
      }

      // Fallback to local AI-powered matching
      const foundMatches = findMatches(user)
      const enhancedMatches = foundMatches.map(match => ({
        ...match,
        compatibilityTag: getCompatibilityTag(match.matchScore),
        aiInsights: generateMatchInsights(match),
        recommendedActions: getRecommendedActions(match)
      }))
      setMatches(enhancedMatches)

    } catch (error) {
      console.error("Error finding matches:", error)
      setMatches([])
    } finally {
      setLoadingMatches(false)
    }
  }

  // Filter matches based on search and category
  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const matchesSearch =
        match.skills.some((skill) =>
          skill.skillName.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        match.mentor.name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        categoryFilter === "all" ||
        match.skills.some((skill) => skill.category === categoryFilter)

      return matchesSearch && matchesCategory
    })
  }, [matches, searchQuery, categoryFilter])

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-6 w-6 text-primary" />
              <div className="mb-4 flex items-center gap-4">
                <BackButton />
                <h1 className="text-3xl font-bold text-balance">AI-Powered Matches</h1>
              </div>
            </div>
            <p className="text-muted-foreground text-pretty">
              Discover perfect learning partners using advanced AI algorithms that consider skill compatibility,
              mutual benefits, and user profiles.
            </p>
          </div>
        </div>

        {/* AI Insights Banner */}
        {matches.length > 0 && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Lightbulb className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">AI Match Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Found {matches.length} potential mentors using intelligent matching algorithms.
                    Matches are ranked by compatibility score considering skill alignment, mutual benefits,
                    and user experience factors.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search skills or mentors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="AI/ML">AI/ML</SelectItem>
                <SelectItem value="Creative">Creative</SelectItem>
                <SelectItem value="Language">Language</SelectItem>
                <SelectItem value="Coding">Coding</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Match Score Info */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">How matching works</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Our AI analyzes your learning goals, skill levels, availability, and learning style to find the most
                  compatible mentors. Higher match scores mean better compatibility!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loadingMatches && (
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Finding your perfect matches...</p>
            </CardContent>
          </Card>
        )}

        {/* Matches Grid */}
        {!loadingMatches && filteredMatches.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredMatches.map((match) => (
              <Card key={match.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <img
                      src={match.mentor.avatar || "/placeholder.svg"}
                      alt={match.mentor.name}
                      className="h-16 w-16 rounded-full bg-muted"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate">{match.mentor.name}</CardTitle>
                          <CardDescription className="truncate">
                            {match.skills.length === 1
                              ? match.skills[0].skillName
                              : `${match.skills.length} matching skills`}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <div
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${match.matchScore >= 90
                              ? "bg-accent text-accent-foreground"
                              : match.matchScore >= 75
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground"
                              }`}
                          >
                            {match.matchScore}% match
                          </div>
                          {match.isMutual && (
                            <Badge variant="outline" className="text-xs">
                              Mutual
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm flex-wrap">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium">{match.mentor.rating.toFixed(1)}</span>
                        </div>
                        <Badge variant="secondary">{getCompatibilityTag(match.matchScore)}</Badge>
                        <Badge variant="outline">{match.category}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Matching Skills */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Matching Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {match.skills.slice(0, 3).map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {skill.skillName}
                          </Badge>
                        ))}
                        {match.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{match.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* AI Insights */}
                    {match.aiInsights && match.aiInsights.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <Brain className="h-3 w-3" />
                          AI Insights:
                        </p>
                        <div className="space-y-1">
                          {match.aiInsights.slice(0, 2).map((insight, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs">
                              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${insight.priority === 'high' ? 'bg-accent' :
                                insight.priority === 'medium' ? 'bg-primary' : 'bg-muted'
                                }`} />
                              <span className="text-muted-foreground">{insight.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex-1">
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${match.matchScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {match.isMutual
                        ? `Perfect match! You can teach ${match.mentor.name.split(" ")[0]} while learning from them.`
                        : `Great match for your learning goals. ${match.mentor.name.split(" ")[0]} can help you master these skills.`}
                    </p>
                    <Button onClick={() => setSelectedMatch(match)} className="w-full">
                      Request Session
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loadingMatches && filteredMatches.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    {(() => {
                      // Determine if there are other users in the system
                      const allUsers = Object.values(loadAllUsers())
                      const otherUsers = user ? allUsers.filter(u => u.id !== user.id && u.email !== user.email) : allUsers
                      if (otherUsers.length === 0) return "No matches yet. Invite users or try again later.";
                      return "No compatible matches found."
                    })()}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {(() => {
                      const allUsers = Object.values(loadAllUsers())
                      const otherUsers = user ? allUsers.filter(u => u.id !== user.id && u.email !== user.email) : allUsers
                      if (otherUsers.length === 0) return "No other users exist right now — invite friends or try later.";
                      return "We couldn't find mentors who teach the skills you're looking for. Try adding or refining your skills to learn."
                    })()}
                  </p>
                  {(() => {
                    const allUsers = Object.values(loadAllUsers())
                    const otherUsers = user ? allUsers.filter(u => u.id !== user.id && u.email !== user.email) : allUsers
                    if (matches.length === 0 && user && user.skillsLearn.length === 0) {
                      return (
                        <Button
                          onClick={() => window.location.href = "/dashboard"}
                          variant="outline"
                          className="mt-4"
                        >
                          Add Skills to Learn
                        </Button>
                      )
                    }
                    return null
                  })()}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <RequestSessionDialog
        open={!!selectedMatch}
        onOpenChange={(open) => !open && setSelectedMatch(null)}
        match={selectedMatch}
      />
    </div>
  )
}

function generateMatchInsights(match: MatchResult) {
  const insights: Array<{
    type: string
    message: string
    priority: 'high' | 'medium' | 'low'
  }> = []

  if (match.isMutual) {
    insights.push({
      type: 'mutual_benefit',
      message: 'Perfect mutual exchange opportunity!',
      priority: 'high'
    })
  }

  if (match.matchScore >= 90) {
    insights.push({
      type: 'high_compatibility',
      message: 'Exceptional skill alignment detected',
      priority: 'high'
    })
  }

  if (match.skills.length > 1) {
    insights.push({
      type: 'multiple_skills',
      message: `Can help with ${match.skills.length} different skills`,
      priority: 'medium'
    })
  }

  return insights
}

/**
 * Get recommended actions for a match
 */
function getRecommendedActions(match: MatchResult) {
  const actions: Array<{
    action: string
    label: string
    priority: 'high' | 'medium' | 'low'
  }> = []

  if (match.matchScore >= 80) {
    actions.push({
      action: 'schedule_session',
      label: 'Schedule a session now',
      priority: 'high'
    })
  }

  if (match.isMutual) {
    actions.push({
      action: 'propose_exchange',
      label: 'Propose skill exchange',
      priority: 'high'
    })
  }

  actions.push({
    action: 'view_profile',
    label: 'View full profile',
    priority: 'medium'
  })

  return actions
}
