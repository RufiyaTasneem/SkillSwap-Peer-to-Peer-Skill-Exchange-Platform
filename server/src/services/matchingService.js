/**
 * Matching Service (Server Version)
 * AI-powered peer matching system for SkillSwap backend
 *
 * This is a server-side version of the frontend matching service
 */

import { loadAllUsers } from './mockService.js';

// MatchResult interface (converted to JSDoc for JavaScript)
/**
 * @typedef {Object} MatchResult
 * @property {string} id
 * @property {Object} mentor
 * @property {string} mentor.id
 * @property {string} mentor.name
 * @property {string} mentor.email
 * @property {string} mentor.avatar
 * @property {number} mentor.rating
 * @property {Array} skills
 * @property {number} matchScore
 * @property {boolean} isMutual
 * @property {string} category
 */

/**
 * Normalize skill name for comparison
 */
function normalizeSkillName(skillName) {
    return skillName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ")
        .replace(/[^\w\s]/g, "")
}

/**
 * Check if two skill names match
 */
function skillsMatch(skill1, skill2) {
    const normalized1 = normalizeSkillName(skill1)
    const normalized2 = normalizeSkillName(skill2)

    if (normalized1 === normalized2) {
        return true
    }

    if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
        return true
    }

    return false
}

/**
 * Check if skill levels are compatible
 */
function areLevelsCompatible(learnerLevel, teacherLevel) {
    const levelOrder = { Beginner: 0, Intermediate: 1, Advanced: 2, Expert: 3 }
    const learner = levelOrder[learnerLevel] ?? 0
    const teacher = levelOrder[teacherLevel] ?? 0

    return teacher > learner
}

/**
 * Extract features for ML model
 */
function extractMatchFeatures(currentUser, otherUser) {
    const features = {
        exactSkillMatches: 0,
        compatibleLevelMatches: 0,
        mutualMatch: hasMutualMatch(currentUser, otherUser) ? 1 : 0,
        currentUserSkillCount: currentUser.skillsTeach.length + currentUser.skillsLearn.length,
        otherUserSkillCount: otherUser.skillsTeach.length + otherUser.skillsLearn.length,
        currentUserCredits: currentUser.credits,
        otherUserCredits: otherUser.credits,
        sharedCategories: 0,
        totalCategories: new Set([
            ...currentUser.skillsTeach.map(s => s.category),
            ...currentUser.skillsLearn.map(s => s.category),
            ...otherUser.skillsTeach.map(s => s.category),
            ...otherUser.skillsLearn.map(s => s.category)
        ]).size,
        currentUserBadges: currentUser.badges.length,
        otherUserBadges: otherUser.badges.length,
    }

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
 * AI-powered match score
 */
function calculateAIMatchScore(currentUser, otherUser) {
    const features = extractMatchFeatures(currentUser, otherUser)

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

    if (features.mutualMatch) {
        score *= 1.2
    }

    if (features.exactSkillMatches === 0) {
        score *= 0.3
    }

    return Math.min(100, Math.max(0, Math.round(score)))
}

/**
 * Check if there's a mutual match
 */
function hasMutualMatch(currentUser, otherUser) {
    const currentUserTeachesWhatOtherWants = currentUser.skillsTeach.some(
        (teachSkill) =>
            otherUser.skillsLearn.some((learnSkill) =>
                skillsMatch(teachSkill.name, learnSkill.name)
            )
    )

    const otherUserTeachesWhatCurrentWants = otherUser.skillsTeach.some(
        (teachSkill) =>
            currentUser.skillsLearn.some((learnSkill) =>
                skillsMatch(teachSkill.name, learnSkill.name)
            )
    )

    return currentUserTeachesWhatOtherWants && otherUserTeachesWhatCurrentWants
}

/**
 * Calculate overall match score
 */
function calculateMatchScore(currentUser, otherUser) {
    const aiScore = calculateAIMatchScore(currentUser, otherUser)

    const matchedSkills = []

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
function getAllOtherUsers(currentUserId) {
    const allUsers = loadAllUsers()
    return Object.values(allUsers).filter((user) => user.id !== currentUserId && user.email !== currentUserId)
}

/**
 * Find matches for the current user
 */
function findMatches(currentUser, limit = 20) {
    if (!currentUser || currentUser.skillsLearn.length === 0) {
        return []
    }

    const otherUsers = getAllOtherUsers(currentUser.id)
    const matches = []

    for (const otherUser of otherUsers) {
        if (otherUser.skillsTeach.length === 0) {
            continue
        }

        const matchData = calculateMatchScore(currentUser, otherUser)

        if (matchData.skills.length > 0) {
            const categoryCounts = {}
            matchData.skills.forEach((skill) => {
                categoryCounts[skill.category] = (categoryCounts[skill.category] || 0) + 1
            })
            const primaryCategory =
                Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Other"

            const rating = 4.5

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

    matches.sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
            return b.matchScore - a.matchScore
        }
        return b.skills.length - a.skills.length
    })

    return matches.slice(0, limit)
}

/**
 * Get compatibility tag based on match score
 */
function getCompatibilityTag(score) {
    if (score >= 90) return "High Match"
    if (score >= 75) return "Good Match"
    if (score >= 60) return "Fair Match"
    return "Potential Match"
}

// Export functions
export { findMatches, getCompatibilityTag }