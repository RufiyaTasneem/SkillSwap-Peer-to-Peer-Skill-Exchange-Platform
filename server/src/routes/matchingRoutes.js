/**
 * Matching Routes
 * AI-powered matching endpoints for SkillSwap
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import { findMatches, getCompatibilityTag } from '../services/matchingService.js';
import { loadUserFromStorage } from '../services/mockService.js';

const router = express.Router();

/**
 * POST /api/matches/find
 * Find AI-powered matches for a user
 */
router.post('/find', [
    body('userId').isString().notEmpty().withMessage('User ID is required'),
    body('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { userId, limit = 20 } = req.body;

        // Load user data
        const user = loadUserFromStorage(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Find AI-powered matches
        const matches = findMatches(user, limit);

        // Add compatibility tags and enhanced metadata
        const enhancedMatches = matches.map(match => ({
            ...match,
            compatibilityTag: getCompatibilityTag(match.matchScore),
            aiInsights: generateMatchInsights(match),
            recommendedActions: getRecommendedActions(match)
        }));

        res.json({
            success: true,
            data: {
                matches: enhancedMatches,
                totalMatches: matches.length,
                aiPowered: true,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error finding matches:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while finding matches'
        });
    }
});

/**
 * POST /api/matches/train
 * Endpoint for training/updating the AI matching model
 * (Placeholder for future ML model training)
 */
router.post('/train', [
    body('trainingData').isArray().withMessage('Training data must be an array'),
    body('modelVersion').optional().isString().withMessage('Model version must be a string')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { trainingData, modelVersion = 'v1.0' } = req.body;

        // Placeholder for ML model training
        // In a real implementation, this would:
        // 1. Validate training data format
        // 2. Train/update the ML model
        // 3. Save the updated model
        // 4. Return training metrics

        console.log(`Training AI model ${modelVersion} with ${trainingData.length} samples`);

        res.json({
            success: true,
            data: {
                modelVersion,
                trainingSamples: trainingData.length,
                status: 'training_completed',
                accuracy: 0.85, // Placeholder accuracy
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error training AI model:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during model training'
        });
    }
});

/**
 * GET /api/matches/insights/:userId
 * Get AI insights about a user's matching profile
 */
router.get('/insights/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = loadUserFromStorage(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const insights = generateUserInsights(user);

        res.json({
            success: true,
            data: {
                userId,
                insights,
                generatedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error generating insights:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error generating insights'
        });
    }
});

/**
 * Generate AI insights for a match
 */
function generateMatchInsights(match) {
    const insights = [];

    if (match.isMutual) {
        insights.push({
            type: 'mutual_benefit',
            message: 'Perfect mutual exchange opportunity!',
            priority: 'high'
        });
    }

    if (match.matchScore >= 90) {
        insights.push({
            type: 'high_compatibility',
            message: 'Exceptional skill alignment detected',
            priority: 'high'
        });
    }

    if (match.skills.length > 1) {
        insights.push({
            type: 'multiple_skills',
            message: `Can help with ${match.skills.length} different skills`,
            priority: 'medium'
        });
    }

    return insights;
}

/**
 * Get recommended actions for a match
 */
function getRecommendedActions(match) {
    const actions = [];

    if (match.matchScore >= 80) {
        actions.push({
            action: 'schedule_session',
            label: 'Schedule a session now',
            priority: 'high'
        });
    }

    if (match.isMutual) {
        actions.push({
            action: 'propose_exchange',
            label: 'Propose skill exchange',
            priority: 'high'
        });
    }

    actions.push({
        action: 'view_profile',
        label: 'View full profile',
        priority: 'medium'
    });

    return actions;
}

/**
 * Generate insights about a user's matching profile
 */
function generateUserInsights(user) {
    const insights = {
        profileStrength: 'good',
        recommendations: [],
        statistics: {
            teachableSkills: user.skillsTeach.length,
            learnableSkills: user.skillsLearn.length,
            totalSkills: user.skillsTeach.length + user.skillsLearn.length,
            credits: user.credits,
            badges: user.badges.length
        }
    };

    // Profile strength analysis
    if (insights.statistics.totalSkills < 3) {
        insights.profileStrength = 'weak';
        insights.recommendations.push('Add more skills to your profile to get better matches');
    } else if (insights.statistics.totalSkills > 10) {
        insights.profileStrength = 'strong';
    }

    // Skill balance recommendations
    if (user.skillsTeach.length === 0) {
        insights.recommendations.push('Add skills you can teach to help others');
    }

    if (user.skillsLearn.length === 0) {
        insights.recommendations.push('Add skills you want to learn');
    }

    // Experience-based insights
    if (user.credits > 100) {
        insights.recommendations.push('Consider mentoring more sessions - you have high credibility!');
    }

    return insights;
}

export default router;