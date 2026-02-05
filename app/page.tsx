"use client"

import type React from "react"
import dynamic from "next/dynamic"
import { GraduationCap, Sparkles, Users, TrendingUp } from "lucide-react"

// Dynamically import the login form to avoid SSR hydration issues
const LoginForm = dynamic(() => import("@/components/login-form").then(mod => ({ default: mod.LoginForm })), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-md">
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-10 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  )
})

export default function HomePage() {
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
        <LoginForm />
      </div>
    </div>
  )
}
