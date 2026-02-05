"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { MatchResult } from "@/lib/matching-service"
import { Star, Calendar, Video, Copy, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { generateGoogleMeetLink } from "@/lib/google-meet"
import { useState } from "react"

interface RequestSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  match: MatchResult | null
}

export function RequestSessionDialog({ open, onOpenChange, match }: RequestSessionDialogProps) {
  const router = useRouter()
  const primarySkill = match?.skills[0]?.skillName || "Skill"
  const [meetLink] = useState(() => generateGoogleMeetLink(primarySkill))
  const [copied, setCopied] = useState(false)

  if (!match) return null

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSchedule = () => {
    // Store the meeting link for the session
    if (typeof window !== "undefined") {
      const sessionData = {
        skill: primarySkill,
        skills: match.skills.map(s => s.skillName),
        mentor: match.mentor.name,
        mentorId: match.mentor.id,
        meetingLink: meetLink,
        timestamp: new Date().toISOString(),
      }
      const existingSessions = JSON.parse(localStorage.getItem("pendingSessions") || "[]")
      existingSessions.push(sessionData)
      localStorage.setItem("pendingSessions", JSON.stringify(existingSessions))
    }
    
    onOpenChange(false)
    router.push("/sessions")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Session</DialogTitle>
          <DialogDescription>Connect with your match to schedule a learning session</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
            <img
              src={match.mentor.avatar || "/placeholder.svg"}
              alt={match.mentor.name}
              className="h-16 w-16 rounded-full bg-background"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{match.mentor.name}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {match.skills.length === 1
                  ? match.skills[0].skillName
                  : `${match.skills.length} matching skills`}
              </p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{match.mentor.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-muted-foreground">{match.matchScore}% compatibility</span>
                {match.isMutual && (
                  <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded">Mutual Match</span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">What happens next?</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary mt-0.5">1.</span>
                <span className="leading-relaxed">We'll notify {match.mentor.name} about your session request</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary mt-0.5">2.</span>
                <span className="leading-relaxed">
                  They'll review your profile and accept or suggest alternative times
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-primary mt-0.5">3.</span>
                <span className="leading-relaxed">Once confirmed, you'll receive session details and meeting link</span>
              </li>
            </ul>
          </div>

          {/* Google Meet Link */}
          <div className="space-y-2 p-4 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <Video className="h-4 w-4 text-primary" />
              <h4 className="font-medium text-sm">Google Meet Link Generated</h4>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-2 rounded-md bg-background border text-sm font-mono truncate">
                {meetLink}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This link will be shared with {match.mentor.name} once the session is confirmed
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSchedule} className="flex-1">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Session
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
