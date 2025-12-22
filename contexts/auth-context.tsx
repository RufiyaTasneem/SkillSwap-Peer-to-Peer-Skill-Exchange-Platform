"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { currentUser, type User, type Skill } from "@/lib/mock-data"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, name: string) => void
  logout: () => void
  addSkillToTeach: (skill: Skill) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Load user from localStorage or use default
  const loadUser = (): User => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("userSkills")
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          return { ...currentUser, skillsTeach: parsed.skillsTeach || currentUser.skillsTeach }
        } catch {
          return currentUser
        }
      }
    }
    return currentUser
  }

  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(true) // Start as authenticated for demo

  useEffect(() => {
    setUser(loadUser())
  }, [])

  const login = (email: string, name: string) => {
    // Mock login - in real app would validate credentials
    setUser(loadUser())
    setIsAuthenticated(true)
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  const addSkillToTeach = (skill: Skill) => {
    if (!user) return
    
    // Check if skill already exists - update it if it does, otherwise add it
    const skillIndex = user.skillsTeach.findIndex(s => s.name === skill.name)
    let updatedSkills: Skill[]
    
    if (skillIndex !== -1) {
      // Update existing skill (e.g., add rating/review)
      updatedSkills = [...user.skillsTeach]
      updatedSkills[skillIndex] = { ...updatedSkills[skillIndex], ...skill }
    } else {
      // Add new skill
      updatedSkills = [...user.skillsTeach, skill]
    }

    const updatedUser = {
      ...user,
      skillsTeach: updatedSkills
    }
    
    setUser(updatedUser)
    
    // Persist to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("userSkills", JSON.stringify({ skillsTeach: updatedUser.skillsTeach }))
    }
  }

  return <AuthContext.Provider value={{ user, isAuthenticated, login, logout, addSkillToTeach }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
