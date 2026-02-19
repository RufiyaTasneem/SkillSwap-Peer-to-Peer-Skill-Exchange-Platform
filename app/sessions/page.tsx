"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/navigation"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Video, Plus } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { ScheduleSessionDialog } from "@/components/schedule-session-dialog"
import { useAuth } from "@/contexts/auth-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  loadSessionsForUser,
  markSessionCompleted,
  markSessionInProgress,
  saveSessionsForUser,
} from "@/lib/session-service"

export default function SessionsPage() {
  const { user, updateCredits } = useAuth()

  const [showSchedule, setShowSchedule] = useState(false)
  const [mentorLink, setMentorLink] = useState("")
  const [selectedSkill, setSelectedSkill] = useState("")
  const [userSessions, setUserSessions] = useState<any[]>([])

  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)

  const userId = user?.email || "guest"
  const teachingCreditAward = 25

  const upcomingSessions = userSessions.filter((s) => s.status !== "completed")
  const completedSessions = userSessions.filter((s) => s.status === "completed")

  const eligibleSkills = useMemo(() => {
    if (!user?.skillsTeach) return []
    return user.skillsTeach.filter((s) => s.testResult?.passed && (s.testResult?.score || 0) >= 75)
  }, [user?.skillsTeach])

  useEffect(() => {
    const stored = loadSessionsForUser(userId)
    setUserSessions(stored)
  }, [userId])

  // ✅ SAVE MENTOR SESSION
  const saveMentorSession = () => {
    setSaveError(null)
    setSaveSuccess(null)

    if (!selectedSkill) {
      setSaveError("Choose a skill")
      return
    }

    if (!mentorLink.startsWith("https://meet.google.com/")) {
      setSaveError("Meeting link must start with https://meet.google.com/")
      return
    }

    const now = new Date()

    const newSession = {
      id: Date.now().toString(),
      skill: selectedSkill,
      mentor: user?.name || "Mentor",
      type: "online",
      date: now.toISOString(),
      time: now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      meetingLink: mentorLink,
      status: "scheduled",
    }

    const updated = [...userSessions, newSession]
    setUserSessions(updated)
    saveSessionsForUser(userId, updated)

    setMentorLink("")
    setSelectedSkill("")
    setSaveSuccess("Session created successfully")
  }

  const handleJoin = (id: string, link?: string) => {
    const updated = markSessionInProgress(userId, id)
    setUserSessions(updated)
    if (link) window.open(link, "_blank")
  }

  const handleComplete = (id: string) => {
    const { sessions: updated, creditsAwarded } =
      markSessionCompleted(userId, id, teachingCreditAward)

    setUserSessions(updated)

    if (user) {
      updateCredits((user.credits || 0) + creditsAwarded)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <BackButton />
              <h1 className="text-3xl font-bold">My Sessions</h1>
            </div>
            <p className="text-muted-foreground">
              Manage your upcoming and past learning sessions
            </p>
          </div>

          <Button onClick={() => setShowSchedule(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Session
          </Button>
        </div>

        {/* Mentor Setup */}
        {eligibleSkills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Mentor Session</CardTitle>
              <CardDescription>Share a Google Meet link</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3 items-end">
              <div className="space-y-2">
                <Label>Select Skill</Label>
                <select
                  className="w-full border rounded-md px-3 py-2 bg-background"
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                >
                  <option value="">Choose a skill</option>
                  {eligibleSkills.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Google Meet Link</Label>
                <Input
                  placeholder="https://meet.google.com/xxx-yyyy-zzz"
                  value={mentorLink}
                  onChange={(e) => setMentorLink(e.target.value)}
                />
              </div>

              <Button onClick={saveMentorSession}>
                Save Mentor Link
              </Button>

              {saveError && <p className="text-red-500 text-sm">{saveError}</p>}
              {saveSuccess && <p className="text-green-500 text-sm">{saveSuccess}</p>}
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="upcoming">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          {/* UPCOMING */}
          <TabsContent value="upcoming" className="mt-6 space-y-4">
            {upcomingSessions.map((session) => (
              <Card
                key={session.id}
                className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {session.skill}
                      </CardTitle>
                      <CardDescription>
                        with {session.mentor}
                      </CardDescription>
                    </div>

                    <Badge
                      variant="outline"
                      className="text-green-400 border-green-400"
                    >
                      {session.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">

                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(session.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {session.time}
                  </div>

                  {/* Meeting Box */}
                  {session.meetingLink && (
                    <div className="border border-blue-500 rounded-lg p-4 bg-blue-950/30 space-y-3">
                      <p className="font-medium text-blue-400">
                        Google Meet Session
                      </p>

                      <div className="bg-slate-900 p-3 rounded text-sm break-all">
                        {session.meetingLink}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          onClick={() => handleJoin(session.id, session.meetingLink)}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Google Meet Now
                        </Button>

                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleComplete(session.id)}
                        >
                          Mark Session as Completed
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* PAST */}
          <TabsContent value="past" className="mt-6 space-y-4">
            {completedSessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-6">
                  <h3 className="font-semibold">{session.skill}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(session.date).toLocaleDateString()} at {session.time}
                  </p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <ScheduleSessionDialog open={showSchedule} onOpenChange={setShowSchedule} />
    </div>
  )
}
