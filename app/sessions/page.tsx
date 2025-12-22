"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/navigation"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { sessions } from "@/lib/mock-data"
import { Calendar, Clock, MapPin, Video, Plus, CheckCircle2, XCircle, Copy, AlertCircle, Check } from "lucide-react"
import { useState } from "react"
import { ScheduleSessionDialog } from "@/components/schedule-session-dialog"

export default function SessionsPage() {
  const [showSchedule, setShowSchedule] = useState(false)
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null)

  const upcomingSessions = sessions.filter((s) => s.status === "scheduled")
  const completedSessions = sessions.filter((s) => s.status === "completed")

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-4 flex items-center gap-4">
              <BackButton />
              <h1 className="text-3xl font-bold text-balance mb-2">My Sessions</h1>
            </div>
            <p className="text-muted-foreground text-pretty">Manage your upcoming and past learning sessions</p>
          </div>
          <Button onClick={() => setShowSchedule(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Session
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">This Week</p>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground mt-1">2 teaching, 1 learning</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Completed</p>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-xs text-muted-foreground mt-1">+600 credits earned</p>
                </div>
                <div className="p-3 rounded-lg bg-accent/10">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Avg. Rating</p>
                  <p className="text-2xl font-bold">4.8</p>
                  <p className="text-xs text-muted-foreground mt-1">From 18 reviews</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-400/10">
                  <span className="text-xl">⭐</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sessions List */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6 space-y-4">
            {upcomingSessions.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">No upcoming sessions</h3>
                      <p className="text-sm text-muted-foreground mb-4">Schedule a session to start learning!</p>
                      <Button onClick={() => setShowSchedule(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Session
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              upcomingSessions.map((session) => (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{session.skill}</CardTitle>
                          <Badge variant={session.type === "online" ? "default" : "secondary"}>
                            {session.type === "online" ? (
                              <>
                                <Video className="h-3 w-3 mr-1" />
                                Online
                              </>
                            ) : (
                              <>
                                <MapPin className="h-3 w-3 mr-1" />
                                In-Person
                              </>
                            )}
                          </Badge>
                        </div>
                        <CardDescription>
                          with {session.mentor === "Alex Chen" ? session.mentee : session.mentor}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                        Scheduled
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(session.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{session.time}</span>
                      </div>
                      {session.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{session.location}</span>
                        </div>
                      )}
                      {session.type === "online" && session.meetingLink && (
                        <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                              <Video className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                                Google Meet Session
                              </h4>
                              <p className="text-xs text-blue-700 dark:text-blue-300">
                                Click the button below to join the meeting
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-md bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-800">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground mb-1">Meeting Link:</p>
                              <p className="text-sm font-mono text-blue-600 dark:text-blue-400 truncate">
                                {session.meetingLink}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="shrink-0"
                              onClick={() => {
                                navigator.clipboard.writeText(session.meetingLink || "")
                                setCopiedLinkId(session.id)
                                setTimeout(() => setCopiedLinkId(null), 2000)
                              }}
                            >
                              {copiedLinkId === session.id ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <Button 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 text-base"
                            onClick={() => window.open(session.meetingLink, "_blank")}
                            size="lg"
                          >
                            <Video className="h-5 w-5 mr-2" />
                            Join Google Meet Now
                          </Button>
                        </div>
                      )}
                      {session.type === "online" && !session.meetingLink && (
                        <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
                            <AlertCircle className="h-4 w-4" />
                            <p className="text-sm">Meeting link will be shared soon</p>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" className="flex-1 bg-transparent">
                          View Details
                        </Button>
                        <Button variant="outline" size="icon">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6 space-y-4">
            {completedSessions.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">No completed sessions yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Your session history will appear here after you complete your first session
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {completedSessions.map((session) => (
                  <Card key={session.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold mb-1">{session.skill}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            with {session.mentor === "Alex Chen" ? session.mentee : session.mentor}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{new Date(session.date).toLocaleDateString()}</span>
                            <span>{session.time}</span>
                            <Badge variant="outline" className="text-xs">
                              {session.type}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Rate Session
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ScheduleSessionDialog open={showSchedule} onOpenChange={setShowSchedule} />
    </div>
  )
}
