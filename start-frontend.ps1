# Start Frontend Server Only
# Run this if you only want to start the frontend

Write-Host "🌐 Starting Frontend Server..." -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Host "🚀 Starting Next.js on port 3000..." -ForegroundColor Green
npm run dev
