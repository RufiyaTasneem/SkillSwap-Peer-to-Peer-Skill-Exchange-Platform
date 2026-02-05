/**
 * Session Service
 * Handles session status transitions and credit awarding
 *
 * STATES:
 * - scheduled -> in-progress -> completed
 *
 * NOTES:
 * - This is a simulation: credits are awarded without needing a second user.
 * - In a real system, completion would be verified by both participants or an AI signal.
 */

import type { Session } from "@/lib/mock-data"
import { sessions as defaultSessions } from "@/lib/mock-data"
import { loadUserFromStorage, saveUserToStorage, getCurrentUser } from "./mock-service"

const SESSION_STORAGE_KEY = "skillswap_sessions"
const DEFAULT_TEACHING_CREDITS = 25

function getUserKey(userId: string) {
  return `${SESSION_STORAGE_KEY}_${userId}`
}

function ensureUserId(userId?: string | null) {
  return userId || getCurrentUser() || "guest"
}

/** Load sessions for a user from storage; fall back to default mock sessions */
export function loadSessionsForUser(userId?: string | null): Session[] {
  const key = getUserKey(ensureUserId(userId))
  if (typeof window === "undefined") return defaultSessions

  const stored = localStorage.getItem(key)
  if (!stored) return defaultSessions

  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : defaultSessions
  } catch {
    return defaultSessions
  }
}

/** Save sessions for a user */
export function saveSessionsForUser(userId: string, sessions: Session[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(getUserKey(ensureUserId(userId)), JSON.stringify(sessions))
}

/** Mark session status (scheduled -> in-progress -> completed) */
export function updateSessionStatus(userId: string, sessionId: string, status: Session["status"]): Session[] {
  const sessions = loadSessionsForUser(userId)
  const updated = sessions.map((s) => (s.id === sessionId ? { ...s, status } : s))
  saveSessionsForUser(userId, updated)
  return updated
}

/** Mark session in-progress */
export function markSessionInProgress(userId: string, sessionId: string): Session[] {
  return updateSessionStatus(userId, sessionId, "in-progress")
}

/**
 * Mark session completed and award credits to the instructor.
 * This simulation does not require a second user confirmation.
 */
export function markSessionCompleted(
  userId: string,
  sessionId: string,
  creditAward: number = DEFAULT_TEACHING_CREDITS
): { sessions: Session[]; creditsAwarded: number } {
  const sessions = loadSessionsForUser(userId)
  const updated = sessions.map((s) => (s.id === sessionId ? { ...s, status: "completed" } : s))
  saveSessionsForUser(userId, updated)

  // Persist credit update for the instructor
  const user = loadUserFromStorage(userId)
  if (user) {
    const newCredits = (user.credits || 0) + creditAward
    saveUserToStorage({ ...user, credits: newCredits })
  }

  return { sessions: updated, creditsAwarded: creditAward }
}






