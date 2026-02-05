"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { isValidEmail, isValidPassword } from "@/lib/mock-service"

export function LoginForm() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { login, register, isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    // Redirect if already authenticated
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push("/dashboard")
        }
    }, [isAuthenticated, isLoading, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // Validate email
        if (!email.trim()) {
            setError("Email is required")
            return
        }

        if (!isValidEmail(email)) {
            setError("Please enter a valid email address")
            return
        }

        // Validate password
        if (!password.trim()) {
            setError("Password is required")
            return
        }

        if (!isValidPassword(password)) {
            setError("Password must be at least 6 characters long")
            return
        }

        // Validate name for signup
        if (!isLogin && !name.trim()) {
            setError("Name is required")
            return
        }

        setIsSubmitting(true)

        try {
            let success = false

            if (isLogin) {
                // Login existing user
                success = await login(email, password)
                if (!success) {
                    setError("Invalid email or password")
                    return
                }
            } else {
                // Register new user
                success = await register(email, name, password)
                if (!success) {
                    setError("An account with this email already exists")
                    return
                }
            }

            // Small delay to ensure state is updated
            setTimeout(() => {
                router.push("/dashboard")
            }, 100)
        } catch (err: any) {
            setError(err.message || "An error occurred. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">{isLogin ? "Welcome back" : "Create account"}</CardTitle>
                <CardDescription>
                    {isLogin ? "Sign in to continue your learning journey" : "Start teaching and learning with peers"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="Rufiya"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value)
                                    setError("")
                                }}
                                required={!isLogin}
                                disabled={isSubmitting}
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="rufiya@university.edu"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setError("")
                            }}
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setError("")
                            }}
                            required
                            disabled={isSubmitting}
                            minLength={6}
                        />
                        {!isLogin && (
                            <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
                        )}
                    </div>
                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin)
                            setError("")
                            setPassword("")
                        }}
                        className="text-primary hover:underline"
                        disabled={isSubmitting}
                    >
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                </div>
            </CardContent>
        </Card>
    )
}