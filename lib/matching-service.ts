/**
 * Matching Service
 * AI-powered peer matching system for SkillSwap
 * 
 * MATCHING LOGIC:
 * - Matches users based on skills they want to learn vs skills others can teach
 * - A match is valid if: User A wants to learn a skill that User B can teach
 * 
 * SCORING SYSTEM:
 * - +10 points: Exact skill name match (Python ↔ Python)
 * - +5 points: Compatible skill level (Beginner ↔ Intermediate/Advanced)
 * - +5 points: Mutual skill swap (both users teach what the other wants)
 * 
 * EXTENSIBILITY:
 * - This scoring logic can be replaced with ML-based ranking
 * - Future AI models can plug into calculateMatchScore() function
 * - Consider factors like: user ratings, availability, learning style, timezone
 */

import type { User, Skill } from "./mock-data"
import { loadAllUsers } from "./mock-service"

export interface MatchResult {
  id: string
  mentor: {
    id: string
    name: string
    email: string
    avatar: string
    rating: number
  }
  skills: Array<{
    skillName: string
    mentorLevel: string
    learnerLevel: string
    category: string
  }>
  matchScore: number
  isMutual: boolean // Both users teach what the other wants
  category: string
}

/**
 * Normalize skill name for comparison
 * Handles variations like "Python Programming" vs "Python"
 */
function normalizeSkillName(skillName: string): string {
  return skillName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "")
}

/**
 * Check if two skill names match (exact or partial)
 */
function skillsMatch(skill1: string, skill2: string): boolean {
  const normalized1 = normalizeSkillName(skill1)
  const normalized2 = normalizeSkillName(skill2)

  // Exact match
  if (normalized1 === normalized2) {
    return true
  }

  // Partial match (one contains the other)
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    return true
  }

  return false
}

/**
 * Check if skill levels are compatible
 * Beginner can learn from Intermediate/Advanced/Expert
 * Intermediate can learn from Advanced/Expert
 * Advanced can learn from Expert
 */
function areLevelsCompatible(learnerLevel: string, teacherLevel: string): boolean {
  const levelOrder = { Beginner: 0, Intermediate: 1, Advanced: 2, Expert: 3 }
  const learner = levelOrder[learnerLevel as keyof typeof levelOrder] ?? 0
  const teacher = levelOrder[teacherLevel as keyof typeof levelOrder] ?? 0

  // Teacher level should be higher than learner level
  return teacher > learner
}

/**
 * Calculate match score for a single skill match
 * @param learnerSkill - Skill the current user wants to learn
 * @param teacherSkill - Skill the potential mentor can teach
 * @returns Score points for this match
 */
function calculateSkillMatchScore(
  learnerSkill: Skill,
  teacherSkill: Skill
): number {
  let score = 0

  // +10 points for exact skill match
  if (skillsMatch(learnerSkill.name, teacherSkill.name)) {
    score += 10
  }

  // +5 points for compatible skill levels
  if (areLevelsCompatible(learnerSkill.level, teacherSkill.level)) {
    score += 5
  }

  return score
}

/**
 * Extract features for ML model (for future AI enhancement)
 */
function extractMatchFeatures(currentUser: User, otherUser: User): Record<string, number> {
  const features: Record<string, number> = {
    // Skill matching features
    exactSkillMatches: 0,
    compatibleLevelMatches: 0,
    mutualMatch: hasMutualMatch(currentUser, otherUser) ? 1 : 0,

    // User profile features
    currentUserSkillCount: currentUser.skillsTeach.length + currentUser.skillsLearn.length,
    otherUserSkillCount: otherUser.skillsTeach.length + otherUser.skillsLearn.length,
    currentUserCredits: currentUser.credits,
    otherUserCredits: otherUser.credits,

    // Category diversity
    sharedCategories: 0,
    totalCategories: new Set([
      ...currentUser.skillsTeach.map(s => s.category),
      ...currentUser.skillsLearn.map(s => s.category),
      ...otherUser.skillsTeach.map(s => s.category),
      ...otherUser.skillsLearn.map(s => s.category)
    ]).size,

    // Experience indicators
    currentUserBadges: currentUser.badges.length,
    otherUserBadges: otherUser.badges.length,
  }

  // Count exact and compatible matches
  for (const learnerSkill of currentUser.skillsLearn) {
    for (const teacherSkill of otherUser.skillsTeach) {
      if (skillsMatch(learnerSkill.name, teacherSkill.name)) {
        features.exactSkillMatches++
        if (areLevelsCompatible(learnerSkill.level, teacherSkill.level)) {
          features.compatibleLevelMatches++
        }
      }
    }
  }

  // Count shared categories
  const currentCategories = new Set([
    ...currentUser.skillsTeach.map(s => s.category),
    ...currentUser.skillsLearn.map(s => s.category)
  ])
  const otherCategories = new Set([
    ...otherUser.skillsTeach.map(s => s.category),
    ...otherUser.skillsLearn.map(s => s.category)
  ])
  features.sharedCategories = [...currentCategories].filter(cat => otherCategories.has(cat)).length

  return features
}

/**
 * AI-powered match score using machine learning simulation
 * This simulates what an ML model would do with user features
 */
function calculateAIMatchScore(currentUser: User, otherUser: User): number {
  const features = extractMatchFeatures(currentUser, otherUser)

  // Simulate ML model prediction (replace with actual ML model later)
  // Weights learned from hypothetical training data
  const weights = {
    exactSkillMatches: 15,
    compatibleLevelMatches: 8,
    mutualMatch: 12,
    currentUserSkillCount: 0.5,
    otherUserSkillCount: 0.3,
    currentUserCredits: 0.1,
    otherUserCredits: 0.1,
    sharedCategories: 3,
    currentUserBadges: 2,
    otherUserBadges: 2,
  }

  let score = 0
  for (const [feature, weight] of Object.entries(weights)) {
    score += features[feature] * weight
  }

  // Add some non-linear factors
  if (features.mutualMatch) {
    score *= 1.2 // Boost mutual matches
  }

  if (features.exactSkillMatches === 0) {
    score *= 0.3 // Penalize no exact matches
  }

  // Normalize to 0-100 range
  return Math.min(100, Math.max(0, Math.round(score)))
}

/**
 * Check if there's a mutual match (both users teach what the other wants)
 */
function hasMutualMatch(
  currentUser: User,
  otherUser: User
): boolean {
  // Check if current user teaches something other user wants to learn
  const currentUserTeachesWhatOtherWants = currentUser.skillsTeach.some(
    (teachSkill) =>
      otherUser.skillsLearn.some((learnSkill) =>
        skillsMatch(teachSkill.name, learnSkill.name)
      )
  )

  // Check if other user teaches something current user wants to learn
  const otherUserTeachesWhatCurrentWants = otherUser.skillsTeach.some(
    (teachSkill) =>
      currentUser.skillsLearn.some((learnSkill) =>
        skillsMatch(teachSkill.name, learnSkill.name)
      )
  )

  return currentUserTeachesWhatOtherWants && otherUserTeachesWhatCurrentWants
}

/**
 * Calculate overall match score between two users
 *
 * CURRENT: Rule-based scoring
 * FUTURE: Replace with ML model that considers:
 * - User ratings and reviews
 * - Availability and timezone compatibility
 * - Learning/teaching style preferences
 * - Past session success rates
 * - Communication patterns
 * - Skill progression history
 */
function calculateMatchScore(
  currentUser: User,
  otherUser: User
): { score: number; skills: MatchResult["skills"]; isMutual: boolean } {
  // Use AI-powered scoring instead of simple rule-based scoring
  const aiScore = calculateAIMatchScore(currentUser, otherUser)

  // Still extract skill details for display
  const matchedSkills: MatchResult["skills"] = []

  // Find all matching skills
  for (const learnerSkill of currentUser.skillsLearn) {
    for (const teacherSkill of otherUser.skillsTeach) {
      if (skillsMatch(learnerSkill.name, teacherSkill.name)) {
        matchedSkills.push({
          skillName: teacherSkill.name,
          mentorLevel: teacherSkill.level,
          learnerLevel: learnerSkill.level,
          category: teacherSkill.category || learnerSkill.category || "Other",
        })
      }
    }
  }

  const isMutual = hasMutualMatch(currentUser, otherUser)

  return {
    score: aiScore,
    skills: matchedSkills,
    isMutual,
  }
}

/**
 * Get all users except the current user
 */
function getAllOtherUsers(currentUserId: string): User[] {
  const allUsers = loadAllUsers()
  return Object.values(allUsers).filter((user) => user.id !== currentUserId && user.email !== currentUserId)
}

/**
 * Find matches for the current user
 * 
 * @param currentUser - The logged-in user
 * @param limit - Maximum number of matches to return (default: 20)
 * @returns Array of match results sorted by score (highest first)
 */
export function findMatches(currentUser: User, limit: number = 20): MatchResult[] {
  if (!currentUser || currentUser.skillsLearn.length === 0) {
    return []
  }

  const otherUsers = getAllOtherUsers(currentUser.id)
  const matches: MatchResult[] = []

  for (const otherUser of otherUsers) {
    // Skip users with no teaching skills
    if (otherUser.skillsTeach.length === 0) {
      continue
    }

    const matchData = calculateMatchScore(currentUser, otherUser)

    // Only include matches with at least one matching skill
    if (matchData.skills.length > 0) {
      // Determine primary category (most common category in matched skills)
      const categoryCounts: Record<string, number> = {}
      matchData.skills.forEach((skill) => {
        categoryCounts[skill.category] = (categoryCounts[skill.category] || 0) + 1
      })
      const primaryCategory =
        Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Other"

      // Calculate average rating (default to 4.5 if no rating exists)
      const rating = 4.5 // In future, this could come from user reviews/ratings

      matches.push({
        id: `match_${currentUser.id}_${otherUser.id}`,
        mentor: {
          id: otherUser.id,
          name: otherUser.name,
          email: otherUser.email,
          avatar: otherUser.avatar,
          rating,
        },
        skills: matchData.skills,
        matchScore: matchData.score,
        isMutual: matchData.isMutual,
        category: primaryCategory,
      })
    }
  }

  // Sort by match score (highest first), then by number of matching skills
  matches.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore
    }
    return b.skills.length - a.skills.length
  })

  // Return top matches
  return matches.slice(0, limit)
}

/**
 * Get compatibility tag based on match score
 */
export function getCompatibilityTag(score: number): string {
  if (score >= 90) return "High Match"
  if (score >= 75) return "Good Match"
  if (score >= 60) return "Fair Match"
  return "Potential Match"
}








