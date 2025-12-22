# Backend Setup Guide

## Quick Start

### 1. Install Backend Dependencies

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DB_PATH=./data/skillswap.db
```

### 3. Start the Backend Server

```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### 4. Configure Frontend

Make sure your frontend `.env.local` file includes:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

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
│   ├── config/
│   │   └── database.js       # Database setup and seeding
│   ├── controllers/
│   │   ├── skillController.js
│   │   ├── questionController.js
│   │   └── testController.js
│   ├── services/
│   │   ├── skillService.js
│   │   ├── questionService.js
│   │   └── testService.js
│   ├── routes/
│   │   ├── skillRoutes.js
│   │   ├── questionRoutes.js
│   │   └── testRoutes.js
│   ├── middleware/
│   │   └── errorHandler.js
│   └── server.js              # Entry point
├── data/                      # SQLite database (auto-created)
├── package.json
└── README.md
```

## Database

The backend uses SQLite for data persistence. The database file is automatically created in `server/data/skillswap.db` when the server starts.

### Tables
- `users` - User accounts
- `skills` - Teaching skills
- `test_results` - Test scores
- `test_feedback` - Test ratings/reviews
- `questions` - Test questions (auto-seeded)

## Testing the Backend

1. Start the backend: `cd server && npm run dev`
2. Test health endpoint: `curl http://localhost:3001/health`
3. Test questions endpoint: `curl http://localhost:3001/api/questions/Coding`

## Troubleshooting

- **Port already in use**: Change `PORT` in `.env` file
- **Database errors**: Delete `server/data/skillswap.db` and restart
- **CORS errors**: Ensure `FRONTEND_URL` in `.env` matches your frontend URL
