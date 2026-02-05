/**
 * API Client
 * Centralized API calls for the frontend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Generic fetch wrapper with error handling
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    
    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    
    // Provide more helpful error messages
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error('Cannot connect to backend server. Please make sure the backend is running on http://localhost:3001');
    }
    
    throw error;
  }
}

/**
 * Skills API
 */
export const skillsAPI = {
  /**
   * Add a teaching skill
   */
  addTeachingSkill: async (skillData) => {
    return apiRequest('/skills/teach', {
      method: 'POST',
      body: skillData,
    });
  },

  /**
   * Get user's teaching skills
   */
  getTeachingSkills: async () => {
    return apiRequest('/skills/teach', {
      method: 'GET',
    });
  },
};

/**
 * Questions API
 */
export const questionsAPI = {
  /**
   * Get questions by category (legacy - for backward compatibility)
   */
  getQuestionsByCategory: async (category) => {
    return apiRequest(`/questions/${encodeURIComponent(category)}`, {
      method: 'GET',
    });
  },
  
  /**
   * Get questions by skill name (preferred method)
   * Falls back to category if backend doesn't support skill-based queries
   */
  getQuestionsBySkill: async (skillName) => {
    try {
      // Try skill-based endpoint first (if backend supports it)
      return apiRequest(`/questions/skill/${encodeURIComponent(skillName)}`, {
        method: 'GET',
      });
    } catch (error) {
      // Fallback to category-based endpoint
      // Extract category from skill if possible
      return apiRequest(`/questions/${encodeURIComponent(skillName)}`, {
        method: 'GET',
      });
    }
  },
};

/**
 * Tests API
 */
export const testsAPI = {
  /**
   * Submit test answers
   */
  submitTest: async (testData) => {
    return apiRequest('/tests/submit', {
      method: 'POST',
      body: testData,
    });
  },

  /**
   * Submit test feedback
   */
  submitFeedback: async (feedbackData) => {
    return apiRequest('/tests/feedback', {
      method: 'POST',
      body: feedbackData,
    });
  },
};

export default {
  skills: skillsAPI,
  questions: questionsAPI,
  tests: testsAPI,
};
