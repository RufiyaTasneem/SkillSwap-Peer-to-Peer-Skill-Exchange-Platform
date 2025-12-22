"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/navigation"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { aiMatches } from "@/lib/mock-data"
import { Sparkles, Star, Search, Filter, ArrowRight } from "lucide-react"
import { useState } from "react"
import { RequestSessionDialog } from "@/components/request-session-dialog"

export default function MatchesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedMatch, setSelectedMatch] = useState<(typeof aiMatches)[0] | null>(null)

  const filteredMatches = aiMatches.filter((match) => {
    const matchesSearch =
      match.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.mentor.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || match.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <div className="mb-4 flex items-center gap-4">
                <BackButton />
                <h1 className="text-3xl font-bold text-balance">AI-Powered Matches</h1>
              </div>
            </div>
            <p className="text-muted-foreground text-pretty">
              Based on your learning goals, we've found the perfect mentors for you
            </p>
          </div>
        </div>

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

        {/* Matches Grid */}
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
                        <CardDescription className="truncate">{match.skill}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${match.matchScore >= 90
                            ? "bg-accent text-accent-foreground"
                            : match.matchScore >= 85
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                            }`}
                        >
                          {match.matchScore}% match
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium">{match.mentor.rating}</span>
                      </div>
                      <Badge variant="outline">{match.proficiency}</Badge>
                      <Badge variant="secondary">{match.category}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
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
                    Perfect match for your {match.skill.toLowerCase()} learning goal. This mentor's teaching style
                    aligns with your preferences.
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

        {filteredMatches.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">No matches found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filters to find more mentors
                  </p>
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
