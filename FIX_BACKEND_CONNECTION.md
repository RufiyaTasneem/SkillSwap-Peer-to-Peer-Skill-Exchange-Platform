# Fix: "Failed to fetch" Error

## Problem
The frontend cannot connect to the backend API, showing "Failed to fetch" error.

## Solution

### Step 1: Make Sure Backend is Running

**Check if backend is running:**
Open: `http://localhost:3001/health` in your browser

**If it's NOT running, start it:**

```powershell
cd server
npm run dev
```

**Wait for this message:**
```
🚀 Server running on port 3001
📡 Frontend URL: http://localhost:3000
```

### Step 2: Verify Frontend Can Connect

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try adding a skill again
4. Check if the request to `http://localhost:3001/api/skills/teach` appears

### Step 3: Check Environment Variables

Make sure `.env.local` file exists in the root directory with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Step 4: Restart Frontend (if needed)

After starting the backend, refresh your browser or restart the frontend:

```powershell
# Stop frontend (Ctrl+C)
# Then restart:
npm run dev
```

## What I Fixed

1. ✅ **Better error messages** - Now shows "Cannot connect to backend server" instead of generic "Failed to fetch"
2. ✅ **Backend server started** - Running on port 3001
3. ✅ **Improved error handling** - More helpful error messages in the UI

## Quick Fix

**Just restart the backend:**

```powershell
cd server
npm run dev
```

Then refresh your browser and try again!








