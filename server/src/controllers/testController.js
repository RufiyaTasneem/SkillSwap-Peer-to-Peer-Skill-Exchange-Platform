/**
 * Test Controller
 * Handles HTTP requests related to skill tests
 */

import { submitTest, submitTestFeedback } from '../services/testService.js';
import { validationResult } from 'express-validator';
import { getSkillById } from '../services/skillService.js';

/**
 * Submit test answers
 * POST /api/tests/submit
 */
export async function submitTestAnswers(req, res) {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { skillId, answers, category } = req.body;
    const userId = req.userId || 'default-user'; // In production, get from auth token

    // Verify skill exists
    const skill = getSkillById(skillId);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    const result = submitTest(userId, skillId, answers, category);

    res.json({
      success: true,
      data: result,
      message: result.passed 
        ? 'Test passed! You can now teach this skill.' 
        : 'Test failed. Please retake the test.'
    });
  } catch (error) {
    console.error('Error submitting test:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to submit test'
    });
  }
}

/**
 * Submit test feedback/rating
 * POST /api/tests/feedback
 */
export async function submitFeedback(req, res) {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { testResultId, rating, review } = req.body;

    const feedback = submitTestFeedback(testResultId, rating, review);

    res.json({
      success: true,
      data: feedback,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to submit feedback'
    });
  }
}
