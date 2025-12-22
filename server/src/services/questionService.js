/**
 * Question Service
 * Handles business logic for test questions
 */

import db from '../config/database.js';

/**
 * Get questions by category
 * @param {string} category - Question category
 * @returns {Array} Array of question objects
 */
export function getQuestionsByCategory(category) {
  let questions = db.find('questions', q => q.category === category);

  // If no questions found for category, use Default category
  if (questions.length === 0 && category !== 'Default') {
    questions = db.find('questions', q => q.category === 'Default');
  }

  // Shuffle questions for randomness
  questions = [...questions].sort(() => Math.random() - 0.5);

  return questions.map(q => ({
    id: q.id,
    category: q.category,
    question: q.question,
    options: q.options,
    correct: q.correct_answer
  }));
}

/**
 * Get all available categories
 * @returns {Array} Array of category names
 */
export function getCategories() {
  const questions = db.getAll('questions');
  const categories = [...new Set(questions.map(q => q.category))];
  return categories.sort();
}
