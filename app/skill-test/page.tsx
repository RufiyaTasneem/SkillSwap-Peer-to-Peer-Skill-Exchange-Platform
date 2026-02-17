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
          if (
            response?.success &&
            Array.isArray(response.data) &&
            response.data.length >= 5
          ) {
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

  const handleAnswerSelect = (value: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = parseInt(value)
    setAnswers(newAnswers)
  }

  const handleNext = () =>
    currentQuestion < questions.length - 1 &&
    setCurrentQuestion((q) => q + 1)

  const handlePrevious = () =>
    currentQuestion > 0 && setCurrentQuestion((q) => q - 1)

  const handleSubmit = async () => {
    setSubmitError(null)

    if (questions.length < 5) {
      setSubmitError("A minimum of 5 questions is required.")
      return
    }

    if (answers.some((a) => a === -1)) {
      setSubmitError("Please answer all questions.")
      return
    }

    setIsSubmitting(true)

    let correct = 0
    questions.forEach((q, idx) => {
      const selectedIndex = answers[idx]
      const correctIndex = (q as any).correctAnswer

      if (selectedIndex === correctIndex) correct++
    })

    const percentage = Math.round((correct / questions.length) * 100)
    setScore(percentage)
    setIsSubmitting(false)

    if (percentage >= 75) {
      const newSkill: Skill = {
        id: `skill_${Date.now()}`,
        name: actualSkillName,
        level: pendingSkill?.level || "Beginner",
        category: "Other",
        testResult: {
          score: percentage,
          passed: true,
          date: new Date().toISOString(),
        },
      }

      addSkillToTeach(newSkill)
      sessionStorage.removeItem("pendingSkill")
      alert("You are eligible to teach this skill!")
      router.push("/dashboard")
    } else {
      setSubmitError("You should pass this test to teach.")
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const canSubmit = answers.every((a) => a !== -1) && !isSubmitting
  const passed = score !== null && score >= 75

  if (loadingQuestions) {
    return (
      <div className="min-h-screen p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        Loading questions for {actualSkillName}...
      </div>
    )
  }

  if (skillNotFound || questions.length < 5) {
    return (
      <div className="min-h-screen p-8 text-center">
        <p>Skill test for "{actualSkillName}" is coming soon!</p>
        <Button onClick={() => router.push("/dashboard")}>Back</Button>
      </div>
    )
  }

  if (score !== null) {
    return (
      <div className="min-h-screen p-8 text-center">
        <h1 className="text-4xl font-bold">{score}%</h1>
        <p>{passed ? "Passed 🎉" : "Failed 😢"}</p>
        <Button onClick={() => router.push("/dashboard")}>Back</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <BackButton />
      <Card>
        <CardHeader>
          <CardTitle>AI Skill Test: {actualSkillName}</CardTitle>
          <CardDescription>
            Answer all questions. You need 75% to pass.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={progress} />
          <h3 className="font-semibold">
            {questions[currentQuestion].question}
          </h3>

          <RadioGroup onValueChange={handleAnswerSelect}>
            {questions[currentQuestion].options.map(
              (opt: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <RadioGroupItem value={idx.toString()} />
                  <Label>{opt}</Label>
                </div>
              )
            )}
          </RadioGroup>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            {currentQuestion < questions.length - 1 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canSubmit}>
                Submit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SkillTestPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <SkillTestPageContent />
    </Suspense>
  )
}
