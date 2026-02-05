/**
 * Question Controller
 * Handles HTTP requests related to test questions
 */

import { getQuestionsByCategory } from '../services/questionService.js';

/**
 * Get questions by category
 * GET /api/questions/:category
 */
export async function getQuestions(req, res) {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }

    const questions = await getQuestionsByCategory(category);

    res.json({
      success: true,
      data: questions,
      count: questions.length
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questions'
    });
  }
}