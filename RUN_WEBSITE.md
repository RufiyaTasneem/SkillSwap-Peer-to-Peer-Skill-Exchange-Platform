# How to Run the Entire Website

## Quick Start Guide

You need to run **TWO servers** - Backend and Frontend.

---

## Option 1: Run in Separate Terminals (Recommended)

### Terminal 1: Start Backend Server

```powershell
cd "c:\Users\ROOFIYA TASNEEM MD\Downloads\skill-swap-frontend-prototype\server"
npm run dev
```

**Wait for this message:**
```
🚀 Server running on port 3001
📡 Frontend URL: http://localhost:3000
```

### Terminal 2: Start Frontend Server

Open a **NEW** terminal window:

```powershell
cd "c:\Users\ROOFIYA TASNEEM MD\Downloads\skill-swap-frontend-prototype"
npm run dev
```

**Wait for this message:**
```
▲ Next.js 16.0.10
- Local:        http://localhost:3000
✓ Ready in X seconds
```

### ✅ Access Your Website

Open your browser and go to:
```
http://localhost:3000
```

---

## Option 2: Run Both with a Script

I'll create a script to run both servers for you.

---

## Step-by-Step Instructions

### Step 1: Install Dependencies (First Time Only)

**Backend:**
```powershell
cd server
npm install
```

**Frontend:**
```powershell
cd ..
npm install
```

### Step 2: Start Backend (Terminal 1)

```powershell
cd server
npm run dev
```

**Keep this terminal open!** The backend must keep running.

### Step 3: Start Frontend (Terminal 2)

Open a **NEW** PowerShell/Command Prompt window:

```powershell
cd "c:\Users\ROOFIYA TASNEEM MD\Downloads\skill-swap-frontend-prototype"
npm run dev
```

**Keep this terminal open too!**

### Step 4: Open Website

Open your browser:
```
http://localhost:3000
```

---

## Verify Everything is Working

### Check Backend:
Open: `http://localhost:3001/health`
Should show: `{"success":true,"message":"Server is running"}`

### Check Frontend:
Open: `http://localhost:3000`
Should show: Your SkillSwap website

---

## Troubleshooting

### Port Already in Use?

**Backend (port 3001):**
- Change `PORT=3002` in `server/.env`
- Update frontend `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:3002/api`

**Frontend (port 3000):**
- Next.js will automatically use port 3001, 3002, etc. if 3000 is busy

### Backend Not Starting?

1. Check if dependencies are installed: `cd server && npm install`
2. Check for errors in the terminal
3. Verify `.env` file exists in `server/` directory

### Frontend Not Connecting to Backend?

1. Make sure backend is running on port 3001
2. Check `NEXT_PUBLIC_API_URL` in `.env.local` file
3. Open browser DevTools (F12) → Network tab to see API calls

---

## What You Should See

### Backend Terminal:
```
🚀 Server running on port 3001
📡 Frontend URL: http://localhost:3000
🌍 Environment: development
📊 Database: JSON file-based storage
Database initialized successfully
Seeded 12 questions
```

### Frontend Terminal:
```
▲ Next.js 16.0.10
- Local:        http://localhost:3000
✓ Ready in X seconds
```

### Browser:
- Your SkillSwap website homepage
- You can navigate, add skills, take tests, etc.

---

## Quick Commands Summary

**Start Backend:**
```powershell
cd server
npm run dev
```

**Start Frontend:**
```powershell
cd ..
npm run dev
```

**Access Website:**
```
http://localhost:3000
```

---

## Need Help?

- Backend running? Check: `http://localhost:3001/health`
- Frontend running? Check: `http://localhost:3000`
- Both running? You're good to go! 🎉
