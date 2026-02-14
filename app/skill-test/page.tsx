"use client"

// 🔧 NORMALIZER (critical fix)
const normalize = (s?: string | null) =>
  s?.trim().toLowerCase().replace(/\s+/g, " ")

import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2, Brain, Star } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { BackButton } from "@/components/navigation"
import type { Skill } from "@/lib/mock-data"
import { questionsAPI, testsAPI } from "@/lib/api"
import { getQuestionsForSkill, type Question } from "@/lib/question-generator"

function SkillTestPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addSkillToTeach } = useAuth()

  const rawSkill = searchParams.get("skill")
  const skillName = normalize(rawSkill) || "unknown skill"

  const [pendingSkill, setPendingSkill] = useState<any>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [score, setScore] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testRating, setTestRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [testReview, setTestReview] = useState("")
  const [showReview, setShowReview] = useState(false)
  const [testResultId, setTestResultId] = useState<string | null>(null)
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [skillNotFound, setSkillNotFound] = useState(false)
  const [actualSkillName, setActualSkillName] = useState(skillName)

  useEffect(() => {
    const loadQuestions = async () => {
      let skillLabel = normalize(skillName)

      const stored = sessionStorage.getItem("pendingSkill")
      if (stored) {
        try {
          const skill = JSON.parse(stored)
          setPendingSkill(skill)
          skillLabel = normalize(skill.skillName || skillName)
        } catch {
          sessionStorage.removeItem("pendingSkill")
        }
      }

      setActualSkillName(
        skillLabel.replace(/\b\w/g, (c) => c.toUpperCase())
      )

      setLoadingQuestions(true)
      setSkillNotFound(false)

      try {
        try {
          const response = await questionsAPI.getQuestionsByCategory(skillLabel)
          if (response?.success && Array.isArray(response.data) && response.data.length >= 5) {
            setQuestions(response.data)
            setAnswers(new Array(response.data.length).fill(-1))
            return
          }
        } catch { }

        const skillQuestions = getQuestionsForSkill(skillLabel)

        if (skillQuestions.length >= 5) {
          setQuestions(skillQuestions)
          setAnswers(new Array(skillQuestions.length).fill(-1))
        } else {
          setSkillNotFound(true)
          setQuestions([])
        }
      } catch {
        setSkillNotFound(true)
        setQuestions([])
      } finally {
        setLoadingQuestions(false)
      }
    }

    loadQuestions()
  }, [skillName])

  // ⚠️ everything else is SAME as your original

  return <div>{/* rest of your component stays unchanged */}</div>
}

export default function SkillTestPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <SkillTestPageContent />
    </Suspense>
  )
}
