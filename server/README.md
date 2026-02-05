# SkillSwap Backend API

Backend server for the SkillSwap platform built with Node.js and Express.
“Current implementation uses a JSON file–based database for simplicity; future improvements include migrating to MongoDB.
## Features

- RESTful API for skill management
- Skill test questions and scoring
- **AI-powered question generation** for skills without predefined tests
- Test feedback and ratings
- JSON file-based database for simplicity
- Input validation and error handling
- CORS enabled for frontend communication

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DB_PATH=./data/skillswap.json
OPENAI_API_KEY=your_openai_api_key_here
```

3. **AI Question Generation (Optional)**
   - Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Add it to your `.env` file as `OPENAI_API_KEY`
   - If not configured, the system will use mock questions for skills without predefined tests
   - With API key: Generates real, contextual questions using GPT-3.5-turbo
   - Without API key: Uses mock questions for development/testing

4. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### Skills

- `POST /api/skills/teach` - Add a teaching skill
- `GET /api/skills/teach` - Get user's teaching skills

### Questions

- `GET /api/questions/:category` - Get questions by category

### Tests

- `GET /api/skill-test?skill=<skill_name>` - Generate AI-powered skill test questions
- `POST /api/tests/submit` - Submit test answers
- `POST /api/tests/feedback` - Submit test feedback/rating

### Skill Test Generation

**GET /api/skill-test**

Generates 10 multiple-choice questions for a specific skill using AI.

**Query Parameters:**
- `skill` (required): The skill name (e.g., "React Development", "Python Programming")

**Response Format:**
```json
[
  {
    "question": "What is JSX in React?",
    "options": [
      "A JavaScript extension for XML",
      "A styling library for React",
      "A state management tool",
      "A routing library"
    ],
    "correctAnswer": "A"
  }
]
```

**Supported Skills:**
- React Development
- Python Programming
- Machine Learning
- UI/UX Design
- Spanish
- German
- And any custom skill (uses general knowledge prompts)

**Notes:**
- Requires OpenAI API key for real questions
- Falls back to mock questions if API key not configured
- Questions are beginner to intermediate difficulty
- Exactly 10 questions with 4 options each

## Project Structure

```
server/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── server.js        # Entry point
├── data/               # SQLite database files
└── package.json
```

## Database

Uses SQLite for simplicity. Database file is created automatically in `data/skillswap.db`.

Tables:
- `users` - User accounts
- `skills` - Teaching skills
- `test_results` - Test scores
- `test_feedback` - Test ratings/reviews
- `questions` - Test questions
