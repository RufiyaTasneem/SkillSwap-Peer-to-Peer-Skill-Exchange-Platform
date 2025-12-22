"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/navigation"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { Award, TrendingUp, Star, Zap, Sparkles } from "lucide-react"
import { useState } from "react"
import { RateSessionDialog } from "@/components/rate-session-dialog"

// Available badges to earn
const allBadges = [
  {
    id: "b1",
    name: "Top Mentor",
    description: "Taught 10+ sessions",
    icon: "🏆",
    requirement: "Teach 10 sessions",
    progress: 10,
    total: 10,
    earned: true,
    earnedAt: "2024-01-15",
  },
  {
    id: "b2",
    name: "Fast Learner",
    description: "Completed 5 skills",
    icon: "⚡",
    requirement: "Learn 5 different skills",
    progress: 5,
    total: 5,
    earned: true,
    earnedAt: "2024-02-20",
  },
  {
    id: "b3",
    name: "Community Leader",
    description: "Active in 3+ circles",
    icon: "👥",
    requirement: "Join 3 communities",
    progress: 5,
    total: 3,
    earned: true,
    earnedAt: "2024-03-10",
  },
  {
    id: "b4",
    name: "5-Star Mentor",
    description: "Maintain 4.5+ rating",
    icon: "⭐",
    requirement: "Get 4.5+ average rating",
    progress: 4.8,
    total: 4.5,
    earned: false,
    earnedAt: null,
  },
  {
    id: "b5",
    name: "Session Marathon",
    description: "Complete 50 sessions",
    icon: "🎯",
    requirement: "Complete 50 total sessions",
    progress: 24,
    total: 50,
    earned: false,
    earnedAt: null,
  },
  {
    id: "b6",
    name: "Credit Millionaire",
    description: "Earn 1000 credits",
    icon: "💰",
    requirement: "Accumulate 1000 credits",
    progress: 250,
    total: 1000,
    earned: false,
    earnedAt: null,
  },
  {
    id: "b7",
    name: "Early Adopter",
    description: "Joined in first month",
    icon: "🚀",
    requirement: "Be among first users",
    progress: 1,
    total: 1,
    earned: false,
    earnedAt: null,
  },
  {
    id: "b8",
    name: "Polyglot",
    description: "Learn 3+ languages",
    icon: "🗣️",
    requirement: "Learn 3 different languages",
    progress: 1,
    total: 3,
    earned: false,
    earnedAt: null,
  },
]

export default function BadgesPage() {
  const { user } = useAuth()
  const [showRating, setShowRating] = useState(false)

  if (!user) return null

  const earnedBadges = allBadges.filter((b) => b.earned)
  const inProgressBadges = allBadges.filter((b) => !b.earned)

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="mb-4 flex items-center gap-4">
            <BackButton />
            <h1 className="text-3xl font-bold text-balance mb-2">Badges & Credits</h1>
          </div>
          <p className="text-muted-foreground text-pretty">Track your achievements and credit balance</p>
        </div>

        {/* Credits Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Credit Balance</CardTitle>
                  <CardDescription>Earn by teaching, spend by learning</CardDescription>
                </div>
                <div className="p-3 rounded-lg bg-accent/10">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-accent">{user.credits}</span>
                  <span className="text-muted-foreground">credits</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Earned This Month</p>
                    <p className="text-2xl font-semibold text-accent">+125</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Spent This Month</p>
                    <p className="text-2xl font-semibold text-primary">-75</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How Credits Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Award className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm">Teach Sessions</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Earn 25 credits per session</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Learn Sessions</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Spend 20 credits per session</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-chart-3/10">
                  <Sparkles className="h-4 w-4 text-chart-3" />
                </div>
                <div>
                  <p className="font-medium text-sm">Bonus Credits</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Earn extra for high ratings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Earned Badges */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-balance">Earned Badges</h2>
              <p className="text-sm text-muted-foreground">
                You've earned {earnedBadges.length} out of {allBadges.length} badges
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {earnedBadges.map((badge) => (
              <Card key={badge.id} className="bg-accent/5 border-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent/10 text-3xl">
                      {badge.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{badge.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                          Earned
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(badge.earnedAt!).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* In Progress Badges */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-balance">Badges in Progress</h2>

          <div className="grid gap-4 md:grid-cols-2">
            {inProgressBadges.map((badge) => {
              const progressPercent = Math.min((badge.progress / badge.total) * 100, 100)
              return (
                <Card key={badge.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-muted text-2xl grayscale opacity-60">
                        {badge.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1">{badge.name}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{badge.requirement}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {badge.progress} / {badge.total}
                        </span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest credit transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "earned", amount: 25, description: "Taught React Development session", date: "2 hours ago" },
                {
                  type: "spent",
                  amount: 20,
                  description: "Learned Machine Learning Basics",
                  date: "Yesterday",
                },
                { type: "earned", amount: 30, description: "Taught UI/UX Design (5-star rating)", date: "2 days ago" },
                { type: "earned", amount: 25, description: "Taught Public Speaking", date: "3 days ago" },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${activity.type === "earned" ? "bg-accent/10" : "bg-primary/10"
                        }`}
                    >
                      {activity.type === "earned" ? (
                        <TrendingUp className="h-5 w-5 text-accent" />
                      ) : (
                        <Zap className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${activity.type === "earned" ? "text-accent" : "text-primary"}`}>
                      {activity.type === "earned" ? "+" : "-"}
                      {activity.amount}
                    </p>
                    <p className="text-xs text-muted-foreground">credits</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rate Session CTA */}
        <Card className="bg-primary text-primary-foreground border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Have a completed session?</h3>
                <p className="text-sm text-primary-foreground/90 leading-relaxed">
                  Rate your experience to earn bonus credits and help others find great mentors
                </p>
              </div>
              <Button variant="secondary" onClick={() => setShowRating(true)}>
                Rate Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <RateSessionDialog open={showRating} onOpenChange={setShowRating} />
    </div>
  )
}
