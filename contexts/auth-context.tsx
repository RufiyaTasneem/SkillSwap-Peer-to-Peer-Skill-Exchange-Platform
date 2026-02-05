"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, Skill, Badge } from "@/lib/mock-data"
import {
  loadUserFromStorage,
  saveUserToStorage,
  clearCurrentSession,
  createNewUser,
  userExistsInStorage,
  setCurrentUser,
  getCurrentUser,
  clearCurrentUser,
  joinCommunity,
  leaveCommunity,
  verifyPassword,
} from "@/lib/mock-service"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, name: string, password: string) => Promise<boolean>
  logout: () => void
  addSkillToTeach: (skill: Skill) => void
  addSkillToLearn: (skill: Skill) => void
  updateCredits: (credits: number) => void
  addBadge: (badge: Badge) => void
  updateUser: (updates: Partial<User>) => void
  joinCommunity: (communityId: string) => void
  leaveCommunity: (communityId: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from storage on mount based on current session
  useEffect(() => {
    const currentUserId = getCurrentUser()
    if (currentUserId) {
      const storedUser = loadUserFromStorage(currentUserId)
      if (storedUser) {
        setUser(storedUser)
        setIsAuthenticated(true)
      } else {
        // Session exists but user data not found - clear session
        clearCurrentUser()
        setIsAuthenticated(false)
      }
    } else {
      setIsAuthenticated(false)
    }
    setIsLoading(false)
  }, [])

  // Persist user to storage whenever it changes
  // This ensures user data is always saved to the correct user's storage location
  useEffect(() => {
    if (user && isAuthenticated) {
      // Verify we have a current session before saving
      const currentUserId = getCurrentUser()
      if (currentUserId && currentUserId === user.email.toLowerCase()) {
        saveUserToStorage(user)
      }
    }
  }, [user, isAuthenticated])

  const login = async (email: string, password: string): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase()

    // Check if user exists
    if (!userExistsInStorage(normalizedEmail)) {
      return false // User doesn't exist
    }

    // Verify password
    if (!verifyPassword(normalizedEmail, password)) {
      return false // Invalid password
    }

    // Load user data
    const userToLogin = loadUserFromStorage(normalizedEmail)!

    // Set current user session
    setCurrentUser(normalizedEmail)

    // Update in-memory state
    setUser(userToLogin)
    setIsAuthenticated(true)

    return true
  }

  const register = async (email: string, name: string, password: string): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase()

    // Check if user already exists
    if (userExistsInStorage(normalizedEmail)) {
      return false // User already exists
    }

    // Create new user
    const newUser = createNewUser(email, name, password)
    saveUserToStorage(newUser)

    // Set current user session
    setCurrentUser(normalizedEmail)

    // Update in-memory state
    setUser(newUser)
    setIsAuthenticated(true)

    return true
  }

  const logout = () => {
    // Save current user state before logging out
    // This ensures any pending changes are persisted
    if (user) {
      saveUserToStorage(user)
    }

    // Clear only the session (in-memory state)
    // User data remains in storage for when they log back in
    clearCurrentUser()
    setUser(null)
    setIsAuthenticated(false)
  }

  const addSkillToTeach = (skill: Skill) => {
    if (!user) return

    // Check if skill already exists - update it if it does, otherwise add it
    const skillIndex = user.skillsTeach.findIndex((s) => s.name === skill.name)
    let updatedSkills: Skill[]

    if (skillIndex !== -1) {
      // Update existing skill
      updatedSkills = [...user.skillsTeach]
      updatedSkills[skillIndex] = { ...updatedSkills[skillIndex], ...skill }
    } else {
      // Add new skill with generated ID if not provided
      updatedSkills = [
        ...user.skillsTeach,
        { ...skill, id: skill.id || `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` },
      ]
    }

    const updatedUser = {
      ...user,
      skillsTeach: updatedSkills,
    }

    setUser(updatedUser)
  }

  const addSkillToLearn = (skill: Skill) => {
    if (!user) return

    // Check if skill already exists - update it if it does, otherwise add it
    const skillIndex = user.skillsLearn.findIndex((s) => s.name === skill.name)
    let updatedSkills: Skill[]

    if (skillIndex !== -1) {
      // Update existing skill
      updatedSkills = [...user.skillsLearn]
      updatedSkills[skillIndex] = { ...updatedSkills[skillIndex], ...skill }
    } else {
      // Add new skill with generated ID if not provided
      updatedSkills = [
        ...user.skillsLearn,
        { ...skill, id: skill.id || `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` },
      ]
    }

    const updatedUser = {
      ...user,
      skillsLearn: updatedSkills,
    }

    setUser(updatedUser)
  }

  const updateCredits = (credits: number) => {
    if (!user) return

    const updatedUser = {
      ...user,
      credits: Math.max(0, credits), // Ensure credits don't go negative
    }

    setUser(updatedUser)
  }

  const joinCommunityById = (communityId: string) => {
    if (!user) return
    // Persist via service and then reload user data
    joinCommunity(user.email, communityId)
    const reloaded = loadUserFromStorage(user.email)
    if (reloaded) setUser(reloaded)
  }

  const leaveCommunityById = (communityId: string) => {
    if (!user) return
    leaveCommunity(user.email, communityId)
    const reloaded = loadUserFromStorage(user.email)
    if (reloaded) setUser(reloaded)
  }

  const addBadge = (badge: Badge) => {
    if (!user) return

    // Check if badge already exists
    const badgeExists = user.badges.some((b) => b.id === badge.id)
    if (badgeExists) return

    const updatedUser = {
      ...user,
      badges: [...user.badges, badge],
    }

    setUser(updatedUser)
  }

  const updateUser = (updates: Partial<User>) => {
    if (!user) return

    const updatedUser = {
      ...user,
      ...updates,
    }

    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        addSkillToTeach,
        addSkillToLearn,
        updateCredits,
        addBadge,
        updateUser,
        joinCommunity: joinCommunityById,
        leaveCommunity: leaveCommunityById,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
