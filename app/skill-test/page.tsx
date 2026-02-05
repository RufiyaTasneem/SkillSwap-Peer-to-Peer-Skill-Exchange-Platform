"use client"

import React, { useState, useEffect } from "react"
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
import { getQuestionsForSkill, hasQuestionsForSkill, getQuestionCount } from "@/lib/question-generator"
import type { Question } from "@/lib/question-generator"

export default function SkillTestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, addSkillToTeach } = useAuth()
  const skillName = searchParams.get("skill") || "Unknown Skill"

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
    // Load questions based on specific skill name (not category)
    const loadQuestions = async () => {
      const stored = sessionStorage.getItem("pendingSkill")
      let skillLabel = skillName

      if (stored) {
        try {
          const skill = JSON.parse(stored)
          setPendingSkill(skill)
          skillLabel = skill.skillName || skillName
        } catch {
          sessionStorage.removeItem("pendingSkill")
        }
      }

      setActualSkillName(skillLabel)
      setLoadingQuestions(true)
      setSkillNotFound(false)

      try {
        // Try backend API first (by skill name if backend supports it)
        // Note: Backend currently uses category, but we'll try skill name first
        try {
          const response = await questionsAPI.getQuestionsByCategory(skillLabel)
          if (response.success && response.data && Array.isArray(response.data) && response.data.length >= 5) {
            setQuestions(response.data)
            setAnswers(new Array(response.data.length).fill(-1))
            setLoadingQuestions(false)
            return
          }
        } catch {
          // Backend not available or doesn't have questions for this skill
        }

        // Use skill-specific question generator
        const skillQuestions = getQuestionsForSkill(skillLabel)

        if (skillQuestions.length >= 5) {
          setQuestions(skillQuestions)
          setAnswers(new Array(skillQuestions.length).fill(-1))
        } else if (skillQuestions.length > 0) {
          // Has some questions but not enough
          setQuestions(skillQuestions)
          setAnswers(new Array(skillQuestions.length).fill(-1))
          setSubmitError(`Warning: Only ${skillQuestions.length} questions available. Minimum 5 recommended.`)
        } else {
          // No questions found for this skill
          setSkillNotFound(true)
          setQuestions([])
        }
      } catch (error) {
        console.error("Error loading questions:", error)
        setSkillNotFound(true)
        setQuestions([])
      } finally {
        setLoadingQuestions(false)
      }
    }

    loadQuestions()
  }, [router, skillName])

  const handleAnswerSelect = (value: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = parseInt(value)
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setSubmitError(null)

    // Validate minimum questions requirement
    if (questions.length < 5) {
      setSubmitError("A minimum of 5 questions is required for the skill test.")
      return
    }

    if (questions.length === 0 || answers.length !== questions.length) {
      setSubmitError("Please answer all questions before submitting.")
      return
    }

    // Check if all questions are answered
    if (answers.some(a => a === -1)) {
      setSubmitError("Please answer all questions before submitting.")
      return
    }

    setIsSubmitting(true)

    // Pure client-side score calculation: compare selected index with correctAnswerIndex (backend) or correct (legacy)
    let correct = 0
    questions.forEach((q, idx) => {
      const selectedIndex = answers[idx]
      let correctIndex: number | undefined = undefined

      if (typeof (q as any).correctAnswerIndex === "number") {
        correctIndex = (q as any).correctAnswerIndex
      } else if (typeof (q as any).correct === "number") {
        correctIndex = (q as any).correct
      }

      if (typeof correctIndex !== "number") {
        console.error(`Question missing correctAnswerIndex and correct: ${q.question}`)
        return
      }

      if (selectedIndex === correctIndex) {
        correct++
      }
    })

    const percentage = Math.round((correct / questions.length) * 100)
    setScore(percentage)
    setIsSubmitting(false)

    // New pass threshold: 75%
    if (percentage >= 75) {
      // Mark skill as eligible to teach and save in user profile (client-side JSON via auth context)
      const newSkill: Skill = {
        id: pendingSkill?.skillId || `skill_${Date.now()}`,
        name: pendingSkill?.skillName || skillName,
        level: (pendingSkill?.skillLevel as "Beginner" | "Intermediate" | "Advanced" | "Expert") || "Beginner",
        category: pendingSkill?.category || "Other",
        testResult: {
          score: percentage,
          passed: true,
          date: new Date().toISOString(),
        },
      }

      addSkillToTeach(newSkill)
      sessionStorage.removeItem("pendingSkill")
      alert("You are eligible to teach this skill")
      router.push("/dashboard")
    } else {
      // Below threshold: do not allow teaching, stay on page
      setSubmitError("You should pass this test to teach the skill")
    }
  }

  const handleReviewSubmit = async () => {
    if (!pendingSkill) {
      router.push("/dashboard")
      return
    }

    try {
      // Submit feedback to backend API if testResultId exists
      if (testResultId) {
        await testsAPI.submitFeedback({
          testResultId: testResultId,
          rating: testRating,
          review: testReview,
        })
      }

      // Store review locally as well
      const review = {
        skillName: pendingSkill.skillName,
        rating: testRating,
        review: testReview,
        date: new Date().toISOString(),
      }

      const reviews = JSON.parse(localStorage.getItem("skillTestReviews") || "[]")
      reviews.push(review)
      localStorage.setItem("skillTestReviews", JSON.stringify(reviews))

      // Also update the test result with rating and review
      const testResultKey = `skillTest_${pendingSkill.skillName}`
      const existingResult = localStorage.getItem(testResultKey)
      if (existingResult) {
        const result = JSON.parse(existingResult)
        result.testRating = testRating
        result.testReview = testReview
        localStorage.setItem(testResultKey, JSON.stringify(result))
      }

      // Add skill to user's teach list with rating and review
      const newSkill: Skill = {
        id: pendingSkill.skillId || `skill_${Date.now()}`,
        name: pendingSkill.skillName,
        level: pendingSkill.skillLevel as "Beginner" | "Intermediate" | "Advanced" | "Expert",
        category: pendingSkill.category,
        testResult: {
          score: score || 0,
          passed: true,
          date: new Date().toISOString(),
        },
        testRating: testRating > 0 ? testRating : undefined,
        testReview: testReview || undefined,
      }
      addSkillToTeach(newSkill)

      // Clean up session storage
      sessionStorage.removeItem("pendingSkill")

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error submitting feedback:", error)
      // Still redirect even if feedback submission fails
      sessionStorage.removeItem("pendingSkill")
      router.push("/dashboard")
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const canSubmit = answers.every(a => a !== -1) && !isSubmitting
  const passed = score !== null && score >= 75

  // Show loading state
  if (loadingQuestions) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <BackButton />
          <Card className="mt-4">
            <CardContent className="p-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading questions for {actualSkillName}...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show fallback message if skill not found or insufficient questions
  if (skillNotFound || questions.length < 5) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <BackButton />
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Skill Test: {actualSkillName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  <p className="font-medium mb-2">Skill test for "{actualSkillName}" is coming soon!</p>
                  <p className="text-sm text-muted-foreground">
                    We're working on adding questions for this skill. Please check back later or try a different skill.
                  </p>
                </AlertDescription>
              </Alert>
              {questions.length > 0 && questions.length < 5 && (
                <Alert variant="destructive">
                  <AlertDescription>
                    <p className="font-medium mb-2">Insufficient Questions</p>
                    <p className="text-sm">
                      Only {questions.length} question{questions.length !== 1 ? "s" : ""} available.
                      A minimum of 5 questions is required for the skill test.
                    </p>
                  </AlertDescription>
                </Alert>
              )}
              <Button onClick={() => router.push("/dashboard")} className="w-full">
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show loading state while submitting
  if (isSubmitting && score === null) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <BackButton />
          <Card className="mt-4">
            <CardContent className="p-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-lg font-medium">Calculating your score...</p>
              <p className="text-sm text-muted-foreground mt-2">Please wait</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show review form if user passed and review is requested
  if (showReview && passed && pendingSkill) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <BackButton />
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-400" />
                Rate Your AI Skill Test Experience
              </CardTitle>
              <CardDescription>
                Help us improve by sharing your feedback about the test
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>How would you rate this AI skill test?</Label>
                <div className="flex items-center justify-center gap-2 py-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTestRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-10 w-10 ${star <= (hoveredRating || testRating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted-foreground"
                          }`}
                      />
                    </button>
                  ))}
                </div>
                {testRating > 0 && (
                  <p className="text-center text-sm text-muted-foreground">
                    {testRating === 5
                      ? "Amazing! 🎉"
                      : testRating === 4
                        ? "Great test!"
                        : testRating === 3
                          ? "Good experience"
                          : testRating === 2
                            ? "Could be better"
                            : "Needs improvement"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="review">Your Review (Optional)</Label>
                <Textarea
                  id="review"
                  placeholder="Share your thoughts about the test difficulty, question quality, or any suggestions..."
                  value={testReview}
                  onChange={(e) => setTestReview(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="bg-accent/10 rounded-lg p-3 text-sm">
                <p className="font-medium text-accent mb-1">Thank you for your feedback!</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your review helps us improve the AI skill test quality and ensures better matching for our community
                </p>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // Add skill without rating/review when skipping
                    if (pendingSkill && score !== null) {
                      const newSkill: Skill = {
                        id: `skill_${Date.now()}`,
                        name: pendingSkill.skillName,
                        level: pendingSkill.skillLevel as "Beginner" | "Intermediate" | "Advanced" | "Expert",
                        category: pendingSkill.category,
                        testResult: {
                          score: score,
                          passed: true,
                          date: new Date().toISOString(),
                        },
                      }
                      addSkillToTeach(newSkill)
                    }
                    sessionStorage.removeItem("pendingSkill")
                    router.push("/dashboard")
                  }}
                >
                  Skip
                </Button>
                <Button onClick={handleReviewSubmit} disabled={testRating === 0}>
                  Submit Review & Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show score/results only if not showing review form
  if (score !== null && !showReview) {
    const correctCount = questions.reduce((acc, q, idx) => {
      const selectedIndex = answers[idx]
      let correctIndex: number | undefined = undefined

      if (typeof (q as any).correctAnswerIndex === "number") correctIndex = (q as any).correctAnswerIndex
      else if (typeof (q as any).correct === "number") correctIndex = (q as any).correct

      if (typeof correctIndex !== "number") {
        console.error(`Question missing correctAnswerIndex and correct: ${q.question}`)
        return acc
      }

      return acc + (selectedIndex === correctIndex ? 1 : 0)
    }, 0)

    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <BackButton />
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {passed ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                    Test Passed!
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 text-red-500" />
                    Test Failed
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <div className="text-4xl font-bold mb-2">{score}%</div>
                <p className="text-muted-foreground">
                  You got {correctCount} out of {questions.length} questions correct
                </p>
              </div>

              {passed ? (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Congratulations! You can now teach "{skillName}". Your skill has been added to your profile.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    You need at least 75% to pass. You can retake the test to improve your score.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                {!passed && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentQuestion(0)
                      setAnswers(new Array(questions.length).fill(-1))
                      setScore(null)
                      setShowReview(false)
                    }}
                    className="flex-1"
                  >
                    Retake Test
                  </Button>
                )}
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="flex-1"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <BackButton />

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle>AI Skill Test: {actualSkillName}</CardTitle>
            </div>
            <CardDescription>
              Answer all {questions.length} questions to verify your proficiency in {actualSkillName}. You need 75% to pass.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {submitError && (
              <Alert variant="destructive">
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Question {currentQuestion + 1} of {questions.length}</span>
                <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {questions[currentQuestion].question}
              </h3>

              <RadioGroup
                value={answers[currentQuestion] !== -1 ? answers[currentQuestion].toString() : undefined}
                onValueChange={handleAnswerSelect}
              >
                {questions[currentQuestion].options.map((option: string, idx: number) => (
                  <div key={idx} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent/50">
                    <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                    <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex gap-2 justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>

              {currentQuestion < questions.length - 1 ? (
                <Button onClick={handleNext} disabled={answers[currentQuestion] === -1}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!canSubmit}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Test"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
