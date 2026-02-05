/**
 * Mock Service
 * Centralized service for managing mock data when backend is not available
 * This provides realistic data simulation and can be replaced with API calls later
 * 
 * STORAGE STRUCTURE:
 * - All users are stored in localStorage under "skillswap_users" key
 * - Structure: { "user@email.com": { user data }, "user2@email.com": { user data } }
 * - Each user's email (normalized to lowercase) is used as the storage key
 * - Current session is tracked separately in "skillswap_current_user" key
 * 
 * PERSISTENCE LOGIC:
 * - On login: Load user data by email, create new user if doesn't exist
 * - On logout: Save current user state, then clear only the session (user data persists)
 * - On data change: Automatically save to the correct user's storage location
 * - User data persists across sessions - logout does NOT delete user data
 */

import type { User, Skill, Badge } from "./mock-data"

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Create a new user with empty/default data
 */
export function createNewUser(email: string, name: string, password: string): User {
  return {
    id: generateId(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password, // Store password (in production, this should be hashed)
    avatar: "/placeholder-user.jpg",
    credits: 0,
    badges: [],
    skillsTeach: [],
    skillsLearn: [],
    joinedCommunities: [],
  }
}

/**
 * Get default user data (for demo purposes)
 * This is used when no user data exists in storage
 */
export function getDefaultUser(): User {
  return {
    id: "1",
    name: "Rufiya",
    email: "rufiya@university.edu",
    password: "password123", // Default password for demo user
    avatar: "/student-avatar.png",
    credits: 250,
    badges: [
      {
        id: "b1",
        name: "Top Mentor",
        description: "Taught 10+ sessions",
        icon: "🏆",
        earnedAt: "2024-01-15",
      },
      {
        id: "b2",
        name: "Fast Learner",
        description: "Completed 5 skills",
        icon: "⚡",
        earnedAt: "2024-02-20",
      },
      {
        id: "b3",
        name: "Community Leader",
        description: "Active in 3+ circles",
        icon: "👥",
        earnedAt: "2024-03-10",
      },
    ],
    skillsTeach: [
      { id: "s1", name: "React Development", level: "Advanced", category: "Coding" },
      { id: "s2", name: "UI/UX Design", level: "Intermediate", category: "Design" },
      { id: "s3", name: "Public Speaking", level: "Expert", category: "Soft Skills" },
    ],
    skillsLearn: [
      { id: "s4", name: "Machine Learning", level: "Beginner", category: "AI/ML" },
      { id: "s5", name: "Photography", level: "Beginner", category: "Creative" },
      { id: "s6", name: "Spanish", level: "Intermediate", category: "Language" },
    ],
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Validate password (minimum 6 characters)
 */
export function isValidPassword(password: string): boolean {
  return password.trim().length >= 6
}

/**
 * Verify user password
 */
export function verifyPassword(email: string, password: string): boolean {
  const normalizedEmail = email.trim().toLowerCase()
  const user = loadUserFromStorage(normalizedEmail)
  return user ? user.password === password : false
}

/**
 * Storage key for all users data
 * Structure: { "user@email.com": { user data }, "user2@email.com": { user data } }
 */
const STORAGE_KEY = "skillswap_users"
const OLD_STORAGE_KEY = "skillswap_user" // Legacy single-user storage key

/**
 * Migrate old single-user storage to new multi-user format
 * This handles users who have data in the old format
 */
function migrateOldStorage(): void {
  if (typeof window === "undefined") return

  try {
    // Check if old format exists
    const oldUserData = localStorage.getItem(OLD_STORAGE_KEY)
    if (oldUserData) {
      const oldUser: User = JSON.parse(oldUserData)

      // Check if this user already exists in new format
      const allUsers = loadAllUsers()
      const userId = getUserId(oldUser.email)

      if (!allUsers[userId]) {
        // Migrate old user to new format
        allUsers[userId] = oldUser
        saveAllUsers(allUsers)

        // Set as current user if no current session exists
        if (!getCurrentUser()) {
          setCurrentUser(userId)
        }
      }

      // Remove old storage key
      localStorage.removeItem(OLD_STORAGE_KEY)
    }
  } catch (error) {
    console.error("Error migrating old storage:", error)
  }
}

// Run migration on module load
if (typeof window !== "undefined") {
  migrateOldStorage()
}

/**
 * Get normalized userId from email (used as storage key)
 */
function getUserId(email: string): string {
  return email.trim().toLowerCase()
}

/**
 * Load all users from localStorage
 * Exported for use in matching service
 */
export function loadAllUsers(): Record<string, User> {
  if (typeof window === "undefined") return {}

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) : {}
    // Inject demo users if we have fewer than 2 users (for demo/testing only)
    const ensured = ensureDemoUsersExist(parsed)
    // Also ensure default communities exist when loading users
    initializeDefaultCommunitiesIfMissing()
    return ensured
  } catch (error) {
    console.error("Error loading users from storage:", error)
  }

  return {}
}

/**
 * Save all users to localStorage
 */
function saveAllUsers(users: Record<string, User>): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  } catch (error) {
    console.error("Error saving users to storage:", error)
  }
}

/**
 * Communities storage key
 * Communities are derived from available skills and stored under this key so members counts and joins persist
 */
const COMMUNITIES_KEY = "skillswap_communities"

/**
 * Load all communities from storage
 */
export function loadAllCommunities(): Record<string, { id: string; name: string; skillTag: string; membersCount: number }> {
  if (typeof window === "undefined") return {}

  try {
    const stored = localStorage.getItem(COMMUNITIES_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Error loading communities from storage:", error)
  }

  return {}
}

/**
 * Save communities to storage
 */
function saveAllCommunities(comms: Record<string, { id: string; name: string; skillTag: string; membersCount: number }>): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(COMMUNITIES_KEY, JSON.stringify(comms))
  } catch (error) {
    console.error("Error saving communities to storage:", error)
  }
}

/**
 * Initialize default communities based on available skills (if none exist)
 */
import { allSkills } from "./mock-data"

function initializeDefaultCommunitiesIfMissing(): void {
  const comms = loadAllCommunities()
  if (Object.keys(comms).length > 0) return

  const newComms: Record<string, { id: string; name: string; skillTag: string; membersCount: number }> = {}
  // Create a community per top skill for demo/personalization purposes
  allSkills.slice(0, 12).forEach((skill, idx) => {
    const id = `comm_${idx + 1}`
    newComms[id] = {
      id,
      name: `${skill} Community`,
      skillTag: skill,
      membersCount: Math.floor(30 + Math.random() * 400),
    }
  })

  saveAllCommunities(newComms)
}

/**
 * Join a community for a user and increment members count
 */
export function joinCommunity(userId: string, communityId: string): void {
  const comms = loadAllCommunities()
  if (!comms[communityId]) return

  const users = loadAllUsers()
  const user = users[getUserId(userId)]
  if (!user) return

  user.joinedCommunities = Array.isArray(user.joinedCommunities) ? user.joinedCommunities : []
  if (!user.joinedCommunities.includes(communityId)) {
    user.joinedCommunities.push(communityId)
    comms[communityId].membersCount = (comms[communityId].membersCount || 0) + 1
    saveAllUsers(users)
    saveAllCommunities(comms)
  }
}

/**
 * Leave a community for a user and decrement members count
 */
export function leaveCommunity(userId: string, communityId: string): void {
  const comms = loadAllCommunities()
  if (!comms[communityId]) return

  const users = loadAllUsers()
  const user = users[getUserId(userId)]
  if (!user || !Array.isArray(user.joinedCommunities)) return

  if (user.joinedCommunities.includes(communityId)) {
    user.joinedCommunities = user.joinedCommunities.filter((id) => id !== communityId)
    comms[communityId].membersCount = Math.max(0, (comms[communityId].membersCount || 1) - 1)
    saveAllUsers(users)
    saveAllCommunities(comms)
  }
}

/**
 * Ensure there are demo users if total users are less than 2 (demo/testing only)
 * These demo users are injected, not meant to overwrite real users
 */
function ensureDemoUsersExist(allUsers: Record<string, User>): Record<string, User> {
  const userCount = Object.keys(allUsers).length
  if (userCount >= 2) return allUsers

  // Create demo users (for demo/testing). Do NOT overwrite existing users.
  const demoUsers: User[] = [
    {
      id: `demo_${Date.now()}_1`,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      password: "password123",
      avatar: "/diverse-female-student.png",
      credits: 50,
      badges: [],
      skillsTeach: [
        { id: "d1", name: "Machine Learning", level: "Expert", category: "AI/ML" },
        { id: "d2", name: "Python Programming", level: "Advanced", category: "Coding" },
      ],
      skillsLearn: [
        { id: "d3", name: "React Development", level: "Beginner", category: "Coding" },
      ],
      joinedCommunities: [],
    },
    {
      id: `demo_${Date.now()}_2`,
      name: "Marcus Kim",
      email: "marcus@example.com",
      password: "password123",
      avatar: "/male-student-studying.png",
      credits: 40,
      badges: [],
      skillsTeach: [
        { id: "d4", name: "Photography", level: "Advanced", category: "Creative" },
      ],
      skillsLearn: [
        { id: "d5", name: "Machine Learning", level: "Intermediate", category: "AI/ML" },
      ],
      joinedCommunities: [],
    },
    {
      id: `demo_${Date.now()}_3`,
      name: "Elena Rodriguez",
      email: "elena@example.com",
      password: "password123",
      avatar: "/latina-student.jpg",
      credits: 60,
      badges: [],
      skillsTeach: [
        { id: "d6", name: "Spanish", level: "Expert", category: "Language" },
      ],
      skillsLearn: [
        { id: "d7", name: "Photography", level: "Beginner", category: "Creative" },
      ],
      joinedCommunities: [],
    },
  ]

  demoUsers.forEach((du) => {
    const userId = getUserId(du.email)
    if (!allUsers[userId]) {
      allUsers[userId] = du
    }
  })

  // Persist demo users
  saveAllUsers(allUsers)
  return allUsers
}

/**
 * Load a specific user from localStorage by userId (email)
 */
export function loadUserFromStorage(userId: string): User | null {
  if (typeof window === "undefined") return null

  const normalizedUserId = getUserId(userId)
  const allUsers = loadAllUsers()
  return allUsers[normalizedUserId] || null
}

/**
 * Save a specific user to localStorage
 * This adds/updates the user in the users object without overwriting other users
 */
export function saveUserToStorage(user: User): void {
  if (typeof window === "undefined") return

  const normalizedUserId = getUserId(user.email)
  const allUsers = loadAllUsers()

  // Add or update this user's data
  allUsers[normalizedUserId] = user

  saveAllUsers(allUsers)
}

/**
 * Check if a user exists in storage
 */
export function userExistsInStorage(userId: string): boolean {
  if (typeof window === "undefined") return false

  const normalizedUserId = getUserId(userId)
  const allUsers = loadAllUsers()
  return normalizedUserId in allUsers
}

/**
 * Clear only the current user's session (does NOT delete user data from storage)
 * This is called on logout to clear in-memory state only
 */
export function clearCurrentSession(): void {
  // We don't remove user data from storage on logout
  // User data persists so they can log back in and see their data
  // This function is kept for API compatibility but doesn't delete data
  if (typeof window === "undefined") return

  // Note: We intentionally don't delete user data here
  // The user's data remains in storage for when they log back in
}

/**
 * Check if user is authenticated (has a current session)
 * Note: This checks for a "current_user" key that tracks the active session
 */
const CURRENT_USER_KEY = "skillswap_current_user"

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(CURRENT_USER_KEY) !== null
}

/**
 * Set the current authenticated user's email
 */
export function setCurrentUser(userId: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(CURRENT_USER_KEY, getUserId(userId))
}

/**
 * Get the current authenticated user's email
 */
export function getCurrentUser(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(CURRENT_USER_KEY)
}

/**
 * Clear the current session (logout)
 */
export function clearCurrentUser(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CURRENT_USER_KEY)
}

