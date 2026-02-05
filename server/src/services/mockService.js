/**
 * Mock Service (Server Version)
 * Server-side user data management for SkillSwap
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data directory
const DATA_DIR = path.join(__dirname, '../../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize users file if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
    const defaultUsers = {
        "rufiya@university.edu": {
            id: "1",
            name: "Rufiya",
            email: "rufiya@university.edu",
            password: "password123",
            avatar: "/student-avatar.png",
            credits: 250,
            badges: [
                { id: "b1", name: "Top Mentor", description: "Taught 10+ sessions", icon: "🏆", earnedAt: "2024-01-15" },
                { id: "b2", name: "Fast Learner", description: "Completed 5 skills", icon: "⚡", earnedAt: "2024-02-20" },
                { id: "b3", name: "Community Leader", description: "Active in 3+ circles", icon: "👥", earnedAt: "2024-03-10" }
            ],
            skillsTeach: [
                { id: "s1", name: "React Development", level: "Advanced", category: "Coding" },
                { id: "s2", name: "UI/UX Design", level: "Intermediate", category: "Design" },
                { id: "s3", name: "Public Speaking", level: "Expert", category: "Soft Skills" }
            ],
            skillsLearn: [
                { id: "s4", name: "Machine Learning", level: "Beginner", category: "AI/ML" },
                { id: "s5", name: "Photography", level: "Beginner", category: "Creative" },
                { id: "s6", name: "Spanish", level: "Intermediate", category: "Language" }
            ],
            joinedCommunities: []
        },
        "sarah@example.com": {
            id: "demo_1",
            name: "Sarah Johnson",
            email: "sarah@example.com",
            password: "password123",
            avatar: "/diverse-female-student.png",
            credits: 50,
            badges: [],
            skillsTeach: [
                { id: "d1", name: "Machine Learning", level: "Expert", category: "AI/ML" },
                { id: "d2", name: "Python Programming", level: "Advanced", category: "Coding" }
            ],
            skillsLearn: [
                { id: "d3", name: "React Development", level: "Beginner", category: "Coding" }
            ],
            joinedCommunities: []
        },
        "marcus@example.com": {
            id: "demo_2",
            name: "Marcus Kim",
            email: "marcus@example.com",
            password: "password123",
            avatar: "/male-student-studying.png",
            credits: 40,
            badges: [],
            skillsTeach: [
                { id: "d4", name: "Photography", level: "Advanced", category: "Creative" }
            ],
            skillsLearn: [
                { id: "d5", name: "Machine Learning", level: "Intermediate", category: "AI/ML" }
            ],
            joinedCommunities: []
        },
        "elena@example.com": {
            id: "demo_3",
            name: "Elena Rodriguez",
            email: "elena@example.com",
            password: "password123",
            avatar: "/latina-student.jpg",
            credits: 60,
            badges: [],
            skillsTeach: [
                { id: "d6", name: "Spanish", level: "Expert", category: "Language" }
            ],
            skillsLearn: [
                { id: "d7", name: "Photography", level: "Beginner", category: "Creative" }
            ],
            joinedCommunities: []
        }
    };
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
}

/**
 * Load all users from storage
 */
export function loadAllUsers() {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading users:', error);
        return {};
    }
}

/**
 * Load a specific user from storage
 */
export function loadUserFromStorage(userId) {
    const allUsers = loadAllUsers();
    const normalizedId = userId.toLowerCase();
    return allUsers[normalizedId] || null;
}

/**
 * Save a user to storage
 */
export function saveUserToStorage(user) {
    try {
        const allUsers = loadAllUsers();
        const normalizedEmail = user.email.toLowerCase();
        allUsers[normalizedEmail] = user;
        fs.writeFileSync(USERS_FILE, JSON.stringify(allUsers, null, 2));
    } catch (error) {
        console.error('Error saving user:', error);
    }
}

/**
 * Check if user exists in storage
 */
export function userExistsInStorage(email) {
    const normalizedEmail = email.toLowerCase();
    const allUsers = loadAllUsers();
    return normalizedEmail in allUsers;
}

/**
 * Create a new user
 */
export function createNewUser(email, name, password) {
    return {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        avatar: "/placeholder-user.jpg",
        credits: 0,
        badges: [],
        skillsTeach: [],
        skillsLearn: [],
        joinedCommunities: []
    };
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * Validate password
 */
export function isValidPassword(password) {
    return password.trim().length >= 6;
}

/**
 * Verify user password
 */
export function verifyPassword(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = loadUserFromStorage(normalizedEmail);
    return user ? user.password === password : false;
}