/**
 * Question Service
 * Handles business logic for test questions
 */

import db from '../config/database.js';
import { generateQuestionsForSkill, isAIConfigured } from './aiQuestionService.js';

/**
 * Get questions by category/skill
 * @param {string} category - Question category or skill name
 * @returns {Array} Array of question objects
 */
export async function getQuestionsByCategory(category) {
  // First try to get predefined questions from database
  let questions = db.find('questions', q => q.category === category);

  // If no questions found for specific category, try AI generation
  if (questions.length === 0) {
    try {
      console.log(`No predefined questions found for ${category}, generating with AI...`);
      const aiQuestions = await generateQuestionsForSkill(category, 10);

      // Convert AI format to database format
      questions = aiQuestions.map((q, index) => {
        // Prefer legacy `correct` (number) if present, otherwise use `correctAnswerIndex` from AI normalization
        const correctIndex = typeof q.correct === 'number'
          ? q.correct
          : (typeof q.correctAnswerIndex === 'number' ? q.correctAnswerIndex : undefined);

        if (typeof correctIndex !== 'number') {
          console.error(`AI question missing correct index for category ${category}: ${q.question}`);
        }

        return {
          id: `ai_${category}_${index}`,
          category: category,
          question: q.question,
          options: q.options,
          correct_answer: typeof correctIndex === 'number' ? correctIndex : 0
        };
      });

      console.log(`Generated ${questions.length} questions for ${category}`);
    } catch (error) {
      console.error('Failed to generate AI questions:', error);
      // Fall back to Default category
      questions = db.find('questions', q => q.category === 'Default');
    }
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
