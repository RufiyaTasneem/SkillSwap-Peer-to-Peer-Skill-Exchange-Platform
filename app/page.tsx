"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { GraduationCap, Sparkles, Users, TrendingUp } from "lucide-react"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground text-primary font-bold text-xl">
              SS
            </div>
            <span className="text-2xl font-bold">SkillSwap</span>
          </div>

          <h1 className="text-5xl font-bold mb-6 text-balance leading-tight">
            Learn from peers.
            <br />
            Teach your skills.
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-12 text-pretty leading-relaxed">
            Join a community where students exchange knowledge, earn credits, and grow together through AI-powered skill
            matching.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">AI Matching</h3>
                <p className="text-sm text-primary-foreground/80 leading-relaxed">
                  Smart algorithm finds perfect learning partners
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Community Circles</h3>
                <p className="text-sm text-primary-foreground/80 leading-relaxed">
                  Join groups and collaborate with peers
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Earn Credits</h3>
                <p className="text-sm text-primary-foreground/80 leading-relaxed">
                  Teach skills to earn, learn skills to spend
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Badges & Awards</h3>
                <p className="text-sm text-primary-foreground/80 leading-relaxed">
                  Unlock achievements as you progress
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-primary-foreground/70">Built for students, by students</div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
                SS
              </div>
              <span className="text-xl font-bold">SkillSwap</span>
            </div>
            <CardTitle className="text-2xl">{isLogin ? "Welcome back" : "Create account"}</CardTitle>
            <CardDescription>
              {isLogin ? "Sign in to continue your learning journey" : "Start teaching and learning with peers"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Alex Chen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="alex@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" required />
              </div>
              <Button type="submit" className="w-full" size="lg">
                {isLogin ? "Sign in" : "Create account"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline">
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            <div className="mt-4 p-3 bg-muted rounded-lg text-xs text-muted-foreground text-center">
              Demo app - Any email and password will work
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
