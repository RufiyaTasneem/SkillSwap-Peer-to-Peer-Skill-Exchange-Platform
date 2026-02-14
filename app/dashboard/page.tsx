"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Plus, Edit, TrendingUp, Award, Calendar, Users } from "lucide-react"
import { useState } from "react"
import { AddSkillDialog } from "@/components/add-skill-dialog"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const [showAddTeach, setShowAddTeach] = useState(false)
  const [showAddLearn, setShowAddLearn] = useState(false)

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-10 w-64" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    )
  }

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
      label: "Skills Teaching",
      value: user.skillsTeach.length,
      icon: Calendar,
      description: "Skills you can teach",
      bgColor: "bg-chart-3/10",
      iconColor: "text-chart-3",
    },
    {
      label: "Skills Learning",
      value: user.skillsLearn.length,
      icon: Users,
      description: "Skills you're learning",
      bgColor: "bg-chart-2/10",
      iconColor: "text-chart-2",
    },
  ]

  return (
    <div className="p-4 md:p-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back, {user.name.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">
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
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl md:text-3xl font-bold mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
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
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="h-20 w-20 rounded-full bg-muted"
                />
                <div>
                  <CardTitle className="text-xl md:text-2xl">
                    {user.name}
                  </CardTitle>
                  <CardDescription className="break-words">
                    {user.email}
                  </CardDescription>

                  <div className="flex gap-2 mt-2 flex-wrap">
                    {user.badges.length > 0 ? (
                      user.badges.slice(0, 3).map((badge) => (
                        <span key={badge.id} className="text-xl" title={badge.name}>
                          {badge.icon}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No badges earned yet
                      </span>
                    )}
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
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Skills I Can Teach</CardTitle>
                  <CardDescription>
                    Share your expertise with peers
                  </CardDescription>
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
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg border bg-card"
                >
                  <div>
                    <p className="font-medium">{skill.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {skill.category}
                    </p>
                  </div>

                  <Badge
                    variant={
                      skill.level === "Expert"
                        ? "default"
                        : skill.level === "Advanced"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {skill.level}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skills I Want to Learn */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Skills I Want to Learn</CardTitle>
                  <CardDescription>
                    Discover and master new abilities
                  </CardDescription>
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
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg border bg-card"
                >
                  <div>
                    <p className="font-medium">{skill.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {skill.category}
                    </p>
                  </div>
                  <Badge variant="outline">{skill.level}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>

      <AddSkillDialog open={showAddTeach} onOpenChange={setShowAddTeach} type="teach" />
      <AddSkillDialog open={showAddLearn} onOpenChange={setShowAddLearn} type="learn" />
    </div>
  )
}
