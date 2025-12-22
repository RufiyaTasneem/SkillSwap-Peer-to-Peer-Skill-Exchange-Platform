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

// Mock questions based on skill category
const getQuestionsForSkill = (skillName: string, category: string) => {
  const baseQuestions: Record<string, Array<{ question: string; options: string[]; correct: number }>> = {
    Coding: [
      {
        question: "What is the primary purpose of version control systems like Git?",
        options: ["To compile code", "To track changes and collaborate on code", "To run tests", "To deploy applications"],
        correct: 1,
      },
      {
        question: "Which of these is NOT a JavaScript framework?",
        options: ["React", "Vue", "Angular", "Python"],
        correct: 3,
      },
      {
        question: "What does API stand for?",
        options: ["Application Programming Interface", "Advanced Program Integration", "Automated Process Interface", "Application Process Integration"],
        correct: 0,
      },
      {
        question: "What is the difference between 'let' and 'var' in JavaScript?",
        options: ["No difference", "'let' has block scope, 'var' has function scope", "'var' is newer", "They're different languages"],
        correct: 1,
      },
      {
        question: "What is the purpose of CSS?",
        options: ["To add interactivity", "To style web pages", "To store data", "To run servers"],
        correct: 1,
      },
    ],
    Design: [
      {
        question: "What does UX stand for?",
        options: ["User Experience", "User Extension", "Universal Experience", "User Exchange"],
        correct: 0,
      },
      {
        question: "Which color combination is generally considered most accessible?",
        options: ["Red on blue", "Yellow on white", "Black on white", "Green on red"],
        correct: 2,
      },
      {
        question: "What is the purpose of a wireframe?",
        options: ["Final design", "Layout structure planning", "Color scheme", "Animation"],
        correct: 1,
      },
    ],
    "AI/ML": [
      {
        question: "What is machine learning?",
        options: ["Manual programming", "Systems that learn from data", "Database management", "Web development"],
        correct: 1,
      },
      {
        question: "What is a neural network?",
        options: ["A database", "A computing system inspired by biological neural networks", "A programming language", "A design pattern"],
        correct: 1,
      },
    ],
    Default: [
      {
        question: "What is the most important aspect of teaching?",
        options: ["Speed", "Understanding your student", "Complexity", "Length"],
        correct: 1,
      },
      {
        question: "How do you ensure effective learning?",
        options: ["Lecture only", "Interactive practice and feedback", "Reading only", "Watching videos"],
        correct: 1,
      },
    ],
  }

  return baseQuestions[category] || baseQuestions.Default
}

export default function SkillTestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, addSkillToTeach } = useAuth()
  const skillName = searchParams.get("skill") || "Unknown Skill"
  
  const [pendingSkill, setPendingSkill] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
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

  useEffect(() => {
    // Get pending skill from sessionStorage and fetch questions from API
    const loadQuestions = async () => {
      const stored = sessionStorage.getItem("pendingSkill")

      // If user opened this page directly or refreshed, there will be no pending skill
      if (!stored) {
        alert("No skill test found. Please add a skill from the dashboard first.")
        router.push("/dashboard")
        return
      }

      try {
        const skill = JSON.parse(stored)
        setPendingSkill(skill)
        
        // Fetch questions from API
        setLoadingQuestions(true)
        try {
          const response = await questionsAPI.getQuestionsByCategory(skill.category)
          if (response.success && response.data) {
            setQuestions(response.data)
            setAnswers(new Array(response.data.length).fill(-1))
          } else {
            // Fallback to local questions if API fails
            const qs = getQuestionsForSkill(skill.skillName, skill.category)
            setQuestions(qs)
            setAnswers(new Array(qs.length).fill(-1))
          }
        } catch (error) {
          console.error("Error loading questions:", error)
          // Fallback to local questions
          const qs = getQuestionsForSkill(skill.skillName, skill.category)
          setQuestions(qs)
          setAnswers(new Array(qs.length).fill(-1))
        } finally {
          setLoadingQuestions(false)
        }
      } catch (error) {
        // Invalid JSON or corrupted data – clean up and send user back
        sessionStorage.removeItem("pendingSkill")
        alert("There was a problem loading your skill test. Please add the skill again from the dashboard.")
        router.push("/dashboard")
      }
    }
    
    loadQuestions()
  }, [router])

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
    if (!pendingSkill || !pendingSkill.skillId) {
      // If this happens, the user is on the test page without a skill selected
      alert("No pending skill found. Please add a skill to teach from the dashboard, then take the test.")
      router.push("/dashboard")
      return
    }

    setIsSubmitting(true)
    
    try {
      // Submit test to backend API
      const response = await testsAPI.submitTest({
        skillId: pendingSkill.skillId,
        answers: answers,
        category: pendingSkill.category,
      })

      if (response.success && response.data) {
        const result = response.data
        setScore(result.score)
        setTestResultId(result.id)
        
        // Store test result locally as well
        const testResult = {
          skillName: pendingSkill.skillName,
          skillLevel: pendingSkill.skillLevel,
          category: pendingSkill.category,
          score: result.score,
          passed: result.passed,
          date: result.testDate,
        }
        localStorage.setItem(`skillTest_${pendingSkill.skillName}`, JSON.stringify(testResult))
        
        // Pass threshold is 70%
        if (result.passed) {
          // Show loading state briefly, then show review form
          setTimeout(() => {
            setIsSubmitting(false)
            setShowReview(true)
          }, 1500)
        } else {
          setIsSubmitting(false)
        }
      } else {
        throw new Error(response.message || "Failed to submit test")
      }
    } catch (error: any) {
      console.error("Error submitting test:", error)
      // Fallback to local calculation
      let correct = 0
      questions.forEach((q, idx) => {
        if (answers[idx] === q.correct) correct++
      })
      const percentage = Math.round((correct / questions.length) * 100)
      setScore(percentage)
      setIsSubmitting(false)
      
      if (percentage >= 70) {
        setTimeout(() => {
          setShowReview(true)
        }, 1500)
      }
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
  const passed = score !== null && score >= 70

  if (loadingQuestions || questions.length === 0) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <BackButton />
          <Card className="mt-4">
            <CardContent className="p-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>{loadingQuestions ? "Loading questions..." : "Loading test..."}</p>
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
                        className={`h-10 w-10 ${
                          star <= (hoveredRating || testRating)
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
                  You got {answers.filter((a, idx) => a === questions[idx].correct).length} out of {questions.length} questions correct
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
                    You need at least 70% to pass. You can retake the test to improve your score.
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
              <CardTitle>AI Skill Test: {skillName}</CardTitle>
            </div>
            <CardDescription>
              Answer all questions to verify your proficiency. You need 70% to pass.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
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
