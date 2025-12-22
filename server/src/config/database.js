/**
 * Database configuration and initialization
 * Uses JSON file-based storage for simplicity (no native dependencies)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Database file path
const dbPath = process.env.DB_PATH || path.join(dataDir, 'skillswap.json');

// In-memory database structure
let db = {
  users: [],
  skills: [],
  test_results: [],
  test_feedback: [],
  questions: []
};

/**
 * Load database from file
 */
function loadDatabase() {
  if (fs.existsSync(dbPath)) {
    try {
      const data = fs.readFileSync(dbPath, 'utf8');
      db = JSON.parse(data);
      console.log('Database loaded from file');
    } catch (error) {
      console.error('Error loading database:', error);
      db = { users: [], skills: [], test_results: [], test_feedback: [], questions: [] };
    }
  }
}

/**
 * Save database to file
 */
function saveDatabase() {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

/**
 * Initialize database with default questions if empty
 */
function initializeDatabase() {
  loadDatabase();

  // Seed questions if database is empty
  if (db.questions.length === 0) {
    console.log('Seeding initial questions...');
    
    db.questions = [
      // Coding questions
      {
        id: 'q1',
        category: 'Coding',
        question: 'What is the primary purpose of version control systems like Git?',
        options: ['To compile code', 'To track changes and collaborate on code', 'To run tests', 'To deploy applications'],
        correct_answer: 1
      },
      {
        id: 'q2',
        category: 'Coding',
        question: 'Which of these is NOT a JavaScript framework?',
        options: ['React', 'Vue', 'Angular', 'Python'],
        correct_answer: 3
      },
      {
        id: 'q3',
        category: 'Coding',
        question: 'What does API stand for?',
        options: ['Application Programming Interface', 'Advanced Program Integration', 'Automated Process Interface', 'Application Process Integration'],
        correct_answer: 0
      },
      {
        id: 'q4',
        category: 'Coding',
        question: 'What is the difference between \'let\' and \'var\' in JavaScript?',
        options: ['No difference', '\'let\' has block scope, \'var\' has function scope', '\'var\' is newer', 'They\'re different languages'],
        correct_answer: 1
      },
      {
        id: 'q5',
        category: 'Coding',
        question: 'What is the purpose of CSS?',
        options: ['To add interactivity', 'To style web pages', 'To store data', 'To run servers'],
        correct_answer: 1
      },
      // Design questions
      {
        id: 'q6',
        category: 'Design',
        question: 'What does UX stand for?',
        options: ['User Experience', 'User Extension', 'Universal Experience', 'User Exchange'],
        correct_answer: 0
      },
      {
        id: 'q7',
        category: 'Design',
        question: 'Which color combination is generally considered most accessible?',
        options: ['Red on blue', 'Yellow on white', 'Black on white', 'Green on red'],
        correct_answer: 2
      },
      {
        id: 'q8',
        category: 'Design',
        question: 'What is the purpose of a wireframe?',
        options: ['Final design', 'Layout structure planning', 'Color scheme', 'Animation'],
        correct_answer: 1
      },
      // AI/ML questions
      {
        id: 'q9',
        category: 'AI/ML',
        question: 'What is machine learning?',
        options: ['Manual programming', 'Systems that learn from data', 'Database management', 'Web development'],
        correct_answer: 1
      },
      {
        id: 'q10',
        category: 'AI/ML',
        question: 'What is a neural network?',
        options: ['A database', 'A computing system inspired by biological neural networks', 'A programming language', 'A design pattern'],
        correct_answer: 1
      },
      // Default questions
      {
        id: 'q11',
        category: 'Default',
        question: 'What is the most important aspect of teaching?',
        options: ['Speed', 'Understanding your student', 'Complexity', 'Length'],
        correct_answer: 1
      },
      {
        id: 'q12',
        category: 'Default',
        question: 'How do you ensure effective learning?',
        options: ['Lecture only', 'Interactive practice and feedback', 'Reading only', 'Watching videos'],
        correct_answer: 1
      }
    ];

    saveDatabase();
    console.log(`Seeded ${db.questions.length} questions`);
  }

  console.log('Database initialized successfully');
}

// Initialize on module load
initializeDatabase();

// Database helper functions
export const dbHelpers = {
  /**
   * Get all records from a table
   */
  getAll: (table) => {
    return db[table] || [];
  },

  /**
   * Find a record by ID
   */
  findById: (table, id) => {
    return (db[table] || []).find(item => item.id === id);
  },

  /**
   * Find records by condition
   */
  find: (table, condition) => {
    return (db[table] || []).filter(condition);
  },

  /**
   * Insert a new record
   */
  insert: (table, record) => {
    if (!db[table]) {
      db[table] = [];
    }
    db[table].push(record);
    saveDatabase();
    return record;
  },

  /**
   * Update a record
   */
  update: (table, id, updates) => {
    const index = (db[table] || []).findIndex(item => item.id === id);
    if (index !== -1) {
      db[table][index] = { ...db[table][index], ...updates };
      saveDatabase();
      return db[table][index];
    }
    return null;
  },

  /**
   * Delete a record
   */
  delete: (table, id) => {
    if (db[table]) {
      const index = db[table].findIndex(item => item.id === id);
      if (index !== -1) {
        db[table].splice(index, 1);
        saveDatabase();
        return true;
      }
    }
    return false;
  }
};

export default dbHelpers;
