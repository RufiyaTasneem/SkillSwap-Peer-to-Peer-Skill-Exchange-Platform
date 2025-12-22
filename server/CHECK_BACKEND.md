# How to Check if Backend is Working

## Method 1: Start the Server and Check Console Output

1. **Open terminal in the server directory:**
   ```bash
   cd server
   ```

2. **Start the server:**
   ```bash
   npm run dev
   ```

3. **Look for these messages:**
   ```
   🚀 Server running on port 3001
   📡 Frontend URL: http://localhost:3000
   🌍 Environment: development
   📊 Database: JSON file-based storage
   Database initialized successfully
   Seeded X questions
   ```

   ✅ **If you see these messages, the backend is running!**

## Method 2: Test Health Endpoint

### Using Browser:
1. Open your browser
2. Go to: `http://localhost:3001/health`
3. You should see:
   ```json
   {
     "success": true,
     "message": "Server is running",
     "timestamp": "2024-..."
   }
   ```

### Using PowerShell:
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing
```

### Using curl (if available):
```bash
curl http://localhost:3001/health
```

## Method 3: Test API Endpoints

### Test Questions Endpoint:
**Browser:** `http://localhost:3001/api/questions/Coding`

**PowerShell:**
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/api/questions/Coding" -UseBasicParsing | Select-Object -ExpandProperty Content
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "q1",
      "category": "Coding",
      "question": "What is the primary purpose...",
      "options": [...],
      "correct": 1
    }
  ],
  "count": 5
}
```

### Test Add Skill Endpoint:
**PowerShell:**
```powershell
$body = @{
    name = "React Development"
    level = "Advanced"
    category = "Coding"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3001/api/skills/teach" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -UseBasicParsing
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "userId": "default-user",
    "name": "React Development",
    "level": "Advanced",
    "category": "Coding",
    "createdAt": "..."
  },
  "message": "Skill added successfully..."
}
```

## Method 4: Check Database File

The backend creates a database file when it starts:

**Location:** `server/data/skillswap.json`

**Check if it exists:**
```powershell
Test-Path "server/data/skillswap.json"
```

If the file exists and has content, the database is working!

## Method 5: Check Server Logs

When the server is running, you should see logs for each request:

```
2024-12-19T12:00:00.000Z - GET /health
2024-12-19T12:00:05.000Z - GET /api/questions/Coding
2024-12-19T12:00:10.000Z - POST /api/skills/teach
```

## Common Issues and Solutions

### ❌ Port Already in Use
**Error:** `EADDRINUSE: address already in use :::3001`

**Solution:**
1. Change port in `server/.env`: `PORT=3002`
2. Or stop the process using port 3001

### ❌ Cannot Find Module
**Error:** `Cannot find module 'express'`

**Solution:**
```bash
cd server
npm install
```

### ❌ Database File Not Created
**Check:**
- Server has write permissions
- `server/data/` directory exists
- Check server console for errors

## Quick Test Script

Save this as `test-backend.ps1`:

```powershell
Write-Host "Testing Backend..." -ForegroundColor Cyan

# Test 1: Health Check
try {
    $health = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing
    Write-Host "✅ Health Check: PASSED" -ForegroundColor Green
    Write-Host "   Response: $($health.Content)"
} catch {
    Write-Host "❌ Health Check: FAILED" -ForegroundColor Red
    Write-Host "   Error: $_"
    exit 1
}

# Test 2: Questions Endpoint
try {
    $questions = Invoke-WebRequest -Uri "http://localhost:3001/api/questions/Coding" -UseBasicParsing
    Write-Host "✅ Questions API: PASSED" -ForegroundColor Green
    $data = $questions.Content | ConvertFrom-Json
    Write-Host "   Found $($data.count) questions"
} catch {
    Write-Host "❌ Questions API: FAILED" -ForegroundColor Red
    Write-Host "   Error: $_"
}

Write-Host "`nBackend is working! 🎉" -ForegroundColor Green
```

Run it:
```powershell
.\test-backend.ps1
```
