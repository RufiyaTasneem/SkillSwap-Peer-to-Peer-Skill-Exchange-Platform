"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, CheckCircle2 } from "lucide-react"

interface RateSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RateSessionDialog({ open, onOpenChange }: RateSessionDialogProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, would submit rating
    console.log("Rating submitted:", { rating, feedback })
    setSubmitted(true)
    setTimeout(() => {
      handleClose()
    }, 2000)
  }

  const handleClose = () => {
    setRating(0)
    setHoveredRating(0)
    setFeedback("")
    setSubmitted(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {!submitted ? (
          <>
            <DialogHeader>
              <DialogTitle>Rate Your Session</DialogTitle>
              <DialogDescription>Share your experience to earn bonus credits and help the community</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <Label>How was your session?</Label>
                <div className="flex items-center justify-center gap-2 py-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-10 w-10 ${
                          star <= (hoveredRating || rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-center text-sm text-muted-foreground">
                    {rating === 5
                      ? "Amazing! 🎉"
                      : rating === 4
                        ? "Great session!"
                        : rating === 3
                          ? "Good experience"
                          : rating === 2
                            ? "Could be better"
                            : "Needs improvement"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback (optional)</Label>
                <Textarea
                  id="feedback"
                  placeholder="Share your thoughts about the session..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="bg-accent/10 rounded-lg p-3 text-sm">
                <p className="font-medium text-accent mb-1">Earn +5 bonus credits!</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Complete ratings help us improve the platform and match you with better mentors
                </p>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Skip
                </Button>
                <Button type="submit" disabled={rating === 0}>
                  Submit Rating
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="py-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <CheckCircle2 className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Thank you!</h3>
            <p className="text-sm text-muted-foreground mb-2">Your rating has been submitted</p>
            <p className="text-lg font-semibold text-accent">+5 bonus credits earned!</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
