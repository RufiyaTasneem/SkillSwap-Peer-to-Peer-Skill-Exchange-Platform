/**
 * Skill Service
 * Handles business logic for skills management
 */

import db from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Add a teaching skill for a user
 * @param {string} userId - User ID
 * @param {Object} skillData - Skill data (name, level, category)
 * @returns {Object} Created skill object
 */
export function addTeachingSkill(userId, skillData) {
  const { name, level, category } = skillData;

  // Validate skill level
  const validLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  if (!validLevels.includes(level)) {
    throw new Error('Invalid skill level');
  }

  // Check if skill already exists for this user
  const existingSkill = db.find('skills', s => s.user_id === userId && s.name === name);

  // If it exists, just return the existing record (idempotent add)
  if (existingSkill) {
    return {
      id: existingSkill.id,
      userId,
      name: existingSkill.name,
      level: existingSkill.level,
      category: existingSkill.category,
      createdAt: existingSkill.created_at
    };
  }

  // Create new skill
  const skillId = uuidv4();
  const skill = {
    id: skillId,
    user_id: userId,
    name,
    level,
    category,
    created_at: new Date().toISOString()
  };

  db.insert('skills', skill);

  return {
    id: skillId,
    userId,
    name,
    level,
    category,
    createdAt: skill.created_at
  };
}

/**
 * Get all teaching skills for a user
 * @param {string} userId - User ID
 * @returns {Array} Array of skill objects
 */
export function getUserTeachingSkills(userId) {
  const skills = db.find('skills', s => s.user_id === userId);
  
  return skills.map(skill => {
    // Find test result for this skill
    const testResult = db.find('test_results', tr => tr.skill_id === skill.id);
    const feedback = testResult ? db.find('test_feedback', tf => tf.test_result_id === testResult.id) : null;

    return {
      id: skill.id,
      name: skill.name,
      level: skill.level,
      category: skill.category,
      testResult: testResult ? {
        score: testResult.score,
        passed: testResult.passed,
        date: testResult.test_date
      } : undefined,
      testRating: feedback && feedback.length > 0 ? feedback[0].rating : undefined,
      testReview: feedback && feedback.length > 0 ? feedback[0].review : undefined
    };
  });
}

/**
 * Get a skill by ID
 * @param {string} skillId - Skill ID
 * @returns {Object|null} Skill object or null
 */
export function getSkillById(skillId) {
  return db.findById('skills', skillId);
}
