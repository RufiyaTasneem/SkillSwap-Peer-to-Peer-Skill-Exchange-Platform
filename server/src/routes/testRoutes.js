/**
 * Test Routes
 * Defines routes for test-related endpoints
 */

import express from 'express';
import { body } from 'express-validator';
import { submitTestAnswers, submitFeedback } from '../controllers/testController.js';

const router = express.Router();

// Validation rules for submitting test
const submitTestValidation = [
  body('skillId')
    .notEmpty()
    .withMessage('Skill ID is required'),
  body('answers')
    .isArray({ min: 1 })
    .withMessage('Answers must be an array'),
  body('answers.*')
    .isInt({ min: 0 })
    .withMessage('Each answer must be a valid integer index'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
];

// Validation rules for submitting feedback
const submitFeedbackValidation = [
  body('testResultId')
    .notEmpty()
    .withMessage('Test result ID is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('review')
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage('Review must be less than 1000 characters')
];

/**
 * POST /api/tests/submit
 * Submit test answers and get score
 */
router.post('/submit', submitTestValidation, submitTestAnswers);

/**
 * POST /api/tests/feedback
 * Submit test feedback/rating
 */
router.post('/feedback', submitFeedbackValidation, submitFeedback);

export default router;
