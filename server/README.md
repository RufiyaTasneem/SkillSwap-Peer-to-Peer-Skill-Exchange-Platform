# SkillSwap Backend API

Backend server for the SkillSwap platform built with Node.js and Express.
“Current implementation uses a JSON file–based database for simplicity; future improvements include migrating to MongoDB.
## Features

- RESTful API for skill management
- Skill test questions and scoring
- Test feedback and ratings
- SQLite database for data persistence
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
DB_PATH=./data/skillswap.db
```

3. Start the server:
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

- `POST /api/tests/submit` - Submit test answers
- `POST /api/tests/feedback` - Submit test feedback/rating

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
