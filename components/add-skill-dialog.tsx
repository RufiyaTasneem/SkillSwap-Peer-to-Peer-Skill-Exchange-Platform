"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { allSkills, type Skill } from "@/lib/mock-data"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { skillsAPI } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

interface AddSkillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "teach" | "learn"
}

export function AddSkillDialog({ open, onOpenChange, type }: AddSkillDialogProps) {
  const [skillName, setSkillName] = useState("")
  const [skillLevel, setSkillLevel] = useState<string>("")
  const [category, setCategory] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>("")
  const router = useRouter()
  const { addSkillToTeach, addSkillToLearn } = useAuth()

  // Reset form when dialog closes
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setSkillName("")
      setSkillLevel("")
      setCategory("")
      setError("")
    }
    onOpenChange(open)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    
    try {
      if (type === "teach") {
        // Try to call backend API first
        try {
          const response = await skillsAPI.addTeachingSkill({
            name: skillName,
            level: skillLevel,
            category: category,
          })

          if (response.success) {
            // Store skill info temporarily and redirect to test
            sessionStorage.setItem("pendingSkill", JSON.stringify({ 
              skillId: response.data.id,
              skillName, 
              skillLevel, 
              category 
            }))
            handleDialogChange(false)
            router.push(`/skill-test?skill=${encodeURIComponent(skillName)}`)
            return
          }
        } catch (apiError: any) {
          // If backend is not available, use mock service (fallback)
          // This allows the app to work without backend
          console.log("Backend not available, using local storage:", apiError.message)
        }

        // Fallback: Add skill locally (for demo/testing when backend is not available)
        const newSkill: Skill = {
          id: `skill_${Date.now()}`,
          name: skillName,
          level: skillLevel as Skill["level"],
          category: category,
        }
        addSkillToTeach(newSkill)
        handleDialogChange(false)
      } else {
        // For "learn" type, add directly to context
        const newSkill: Skill = {
          id: `skill_${Date.now()}`,
          name: skillName,
          level: skillLevel as Skill["level"],
          category: category,
        }
        addSkillToLearn(newSkill)
        handleDialogChange(false)
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to add skill. Please try again."
      setError(errorMessage)
      console.error("Error adding skill:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Skill {type === "teach" ? "to Teach" : "to Learn"}</DialogTitle>
          <DialogDescription>
            {type === "teach"
              ? "Share your expertise and earn credits by teaching others"
              : "Find mentors who can help you master new skills"}
          </DialogDescription>
        </DialogHeader>

        {type === "teach" && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You'll need to pass an AI skill test before you can teach this skill. This ensures quality teaching for our community.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skill-name">Skill Name</Label>
            <Input
              id="skill-name"
              placeholder="e.g., React Development"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              list="skills-list"
              required
            />
            <datalist id="skills-list">
              {allSkills.map((skill) => (
                <option key={skill} value={skill} />
              ))}
            </datalist>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skill-level">Proficiency Level</Label>
            <Select value={skillLevel} onValueChange={setSkillLevel} required>
              <SelectTrigger id="skill-level">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Coding">Coding</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="AI/ML">AI/ML</SelectItem>
                <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                <SelectItem value="Creative">Creative</SelectItem>
                <SelectItem value="Language">Language</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : type === "teach" ? "Take Skill Test" : "Add Skill"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
