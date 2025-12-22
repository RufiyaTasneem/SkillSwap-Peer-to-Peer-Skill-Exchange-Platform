/**
 * Question Routes
 * Defines routes for question-related endpoints
 */

import express from 'express';
import { getQuestions } from '../controllers/questionController.js';

const router = express.Router();

/**
 * GET /api/questions/:category
 * Get questions by category
 */
router.get('/:category', getQuestions);

export default router;
