/**
 * Skill Controller
 * Handles HTTP requests related to skills
 */

import { addTeachingSkill, getUserTeachingSkills } from '../services/skillService.js';
import { validationResult } from 'express-validator';

/**
 * Add a teaching skill
 * POST /api/skills/teach
 */
export async function addSkill(req, res) {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, level, category } = req.body;
    const userId = req.userId || 'default-user'; // In production, get from auth token

    const skill = addTeachingSkill(userId, { name, level, category });

    res.status(201).json({
      success: true,
      data: skill,
      message: 'Skill added successfully. Please take the skill test.'
    });
  } catch (error) {
    console.error('Error adding skill:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to add skill'
    });
  }
}

/**
 * Get user's teaching skills
 * GET /api/skills/teach
 */
export async function getSkills(req, res) {
  try {
    const userId = req.userId || 'default-user'; // In production, get from auth token

    const skills = getUserTeachingSkills(userId);

    res.json({
      success: true,
      data: skills
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skills'
    });
  }
}
