"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Plus, Edit, TrendingUp, Award, Calendar, Users } from "lucide-react"
import { useState } from "react"
import { AddSkillDialog } from "@/components/add-skill-dialog"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()
  const [showAddTeach, setShowAddTeach] = useState(false)
  const [showAddLearn, setShowAddLearn] = useState(false)

  if (!user) return null

  const stats = [
    {
      label: "Total Credits",
      value: user.credits,
      icon: TrendingUp,
      description: "Earn by teaching",
      bgColor: "bg-accent/10",
      iconColor: "text-accent",
    },
    {
      label: "Badges Earned",
      value: user.badges.length,
      icon: Award,
      description: "Keep achieving!",
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Sessions This Week",
      value: 3,
      icon: Calendar,
      description: "2 teaching, 1 learning",
      bgColor: "bg-chart-3/10",
      iconColor: "text-chart-3",
    },
    {
      label: "Community Circles",
      value: 5,
      icon: Users,
      description: "Active member",
      bgColor: "bg-chart-2/10",
      iconColor: "text-chart-2",
    },
  ]

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-balance mb-2">Welcome back, {user.name.split(" ")[0]}!</h1>
          <p className="text-muted-foreground text-pretty">
            Ready to learn something new or share your knowledge today?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`${stat.iconColor} h-5 w-5`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="h-20 w-20 rounded-full bg-muted"
                />
                <div>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                  <div className="flex gap-2 mt-2">
                    {user.badges.slice(0, 3).map((badge) => (
                      <span key={badge.id} className="text-xl" title={badge.name}>
                        {badge.icon}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Skills Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Skills I Can Teach */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Skills I Can Teach</CardTitle>
                  <CardDescription>Share your expertise with peers</CardDescription>
                </div>
                <Button size="sm" onClick={() => setShowAddTeach(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.skillsTeach.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{skill.name}</p>
                    <p className="text-sm text-muted-foreground">{skill.category}</p>
                  </div>
                  <Badge
                    variant={
                      skill.level === "Expert" ? "default" : skill.level === "Advanced" ? "secondary" : "outline"
                    }
                  >
                    {skill.level}
                  </Badge>
                </div>
              ))}
              {user.skillsTeach.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="mb-2">No skills added yet</p>
                  <p className="text-sm">Add skills you can teach to start earning credits!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills I Want to Learn */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Skills I Want to Learn</CardTitle>
                  <CardDescription>Discover and master new abilities</CardDescription>
                </div>
                <Button size="sm" onClick={() => setShowAddLearn(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.skillsLearn.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{skill.name}</p>
                    <p className="text-sm text-muted-foreground">{skill.category}</p>
                  </div>
                  <Badge variant="outline">{skill.level}</Badge>
                </div>
              ))}
              {user.skillsLearn.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="mb-2">No skills added yet</p>
                  <p className="text-sm">Add skills you want to learn to get AI-matched mentors!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-primary text-primary-foreground border-primary/20">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Find a Mentor</h3>
              <p className="text-sm text-primary-foreground/90 mb-4 leading-relaxed">
                AI will match you with the perfect teacher for your learning goals
              </p>
              <Button asChild variant="secondary" size="sm">
                <Link href="/matches">Browse Matches</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-accent text-accent-foreground border-accent/20">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Schedule a Session</h3>
              <p className="text-sm text-accent-foreground/90 mb-4 leading-relaxed">
                Book online or in-person learning sessions with your matches
              </p>
              <Button asChild variant="secondary" size="sm">
                <Link href="/sessions">View Sessions</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-secondary text-secondary-foreground border-border">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Join Communities</h3>
              <p className="text-sm text-secondary-foreground/90 mb-4 leading-relaxed">
                Connect with peers in knowledge circles and discussion groups
              </p>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="bg-transparent border-primary/20 hover:bg-primary/10"
              >
                <Link href="/communities">Explore Communities</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddSkillDialog open={showAddTeach} onOpenChange={setShowAddTeach} type="teach" />
      <AddSkillDialog open={showAddLearn} onOpenChange={setShowAddLearn} type="learn" />
    </div>
  )
}
