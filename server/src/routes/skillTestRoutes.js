/**
 * Skill Test Routes
 * Defines routes for skill test generation endpoints
 */

import express from 'express';
import { generateSkillTest } from '../controllers/testController.js';

const router = express.Router();

/**
 * GET /api/skill-test
 * Generate skill test questions
 */
router.get('/skill-test', generateSkillTest);

export default router;