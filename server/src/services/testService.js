/**
 * Test Service
 * Handles business logic for skill tests
 */

import db from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import { getQuestionsByCategory } from './questionService.js';

/**
 * Submit test answers and calculate score
 * @param {string} userId - User ID
 * @param {string} skillId - Skill ID
 * @param {Array} answers - Array of answer indices
 * @param {string} category - Question category
 * @returns {Object} Test result with score and pass status
 */
export function submitTest(userId, skillId, answers, category) {
  // Get questions for the category
  const questions = getQuestionsByCategory(category);

  if (questions.length === 0) {
    throw new Error('No questions found for this category');
  }

  if (answers.length !== questions.length) {
    throw new Error('Number of answers does not match number of questions');
  }

  // Calculate score
  let correctAnswers = 0;
  questions.forEach((question, index) => {
    if (answers[index] === question.correct) {
      correctAnswers++;
    }
  });

  const score = Math.round((correctAnswers / questions.length) * 100);
  const passed = score >= 70; // Pass threshold is 70%

  // Store test result
  const testResultId = uuidv4();
  const testResult = {
    id: testResultId,
    user_id: userId,
    skill_id: skillId,
    score,
    passed,
    total_questions: questions.length,
    correct_answers: correctAnswers,
    test_date: new Date().toISOString()
  };

  db.insert('test_results', testResult);

  return {
    id: testResultId,
    score,
    passed,
    totalQuestions: questions.length,
    correctAnswers,
    testDate: testResult.test_date
  };
}

/**
 * Submit test feedback/rating
 * @param {string} testResultId - Test result ID
 * @param {number} rating - Rating (1-5)
 * @param {string} review - Optional review text
 * @returns {Object} Feedback object
 */
export function submitTestFeedback(testResultId, rating, review = '') {
  // Validate rating
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  // Check if test result exists
  const testResult = db.findById('test_results', testResultId);
  if (!testResult) {
    throw new Error('Test result not found');
  }

  // Check if feedback already exists
  const existingFeedback = db.find('test_feedback', tf => tf.test_result_id === testResultId);
  
  let feedbackId;
  if (existingFeedback && existingFeedback.length > 0) {
    // Update existing feedback
    feedbackId = existingFeedback[0].id;
    db.update('test_feedback', feedbackId, {
      rating,
      review
    });
  } else {
    // Create new feedback
    feedbackId = uuidv4();
    const feedback = {
      id: feedbackId,
      test_result_id: testResultId,
      rating,
      review,
      created_at: new Date().toISOString()
    };
    db.insert('test_feedback', feedback);
  }

  const feedback = db.findById('test_feedback', feedbackId);

  return {
    id: feedbackId,
    testResultId,
    rating,
    review,
    createdAt: feedback.created_at
  };
}

/**
 * Get test result by ID
 * @param {string} testResultId - Test result ID
 * @returns {Object|null} Test result or null
 */
export function getTestResult(testResultId) {
  return db.findById('test_results', testResultId);
}
