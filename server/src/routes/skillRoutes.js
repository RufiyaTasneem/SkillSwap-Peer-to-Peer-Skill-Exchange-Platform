/**
 * Skill Routes
 * Defines routes for skill-related endpoints
 */

import express from 'express';
import { body } from 'express-validator';
import { addSkill, getSkills } from '../controllers/skillController.js';

const router = express.Router();

// Validation rules for adding a skill
const addSkillValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Skill name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Skill name must be between 2 and 100 characters'),
  body('level')
    .isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
    .withMessage('Invalid skill level'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
];

/**
 * POST /api/skills/teach
 * Add a teaching skill
 */
router.post('/teach', addSkillValidation, addSkill);

/**
 * GET /api/skills/teach
 * Get user's teaching skills
 */
router.get('/teach', getSkills);

export default router;
