# Start Both Frontend and Backend Servers
# This script starts both servers in separate windows

Write-Host "🚀 Starting SkillSwap Website..." -ForegroundColor Cyan
Write-Host ""

# Get the project directory
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$serverDir = Join-Path $projectDir "server"

# Check if server directory exists
if (-not (Test-Path $serverDir)) {
    Write-Host "❌ Server directory not found!" -ForegroundColor Red
    exit 1
}

# Check if node_modules exist
if (-not (Test-Path (Join-Path $serverDir "node_modules"))) {
    Write-Host "⚠️  Backend dependencies not installed. Installing..." -ForegroundColor Yellow
    Set-Location $serverDir
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
        exit 1
    }
}

# Start Backend Server in new window
Write-Host "📡 Starting Backend Server (port 3001)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$serverDir'; Write-Host 'Backend Server' -ForegroundColor Cyan; Write-Host '=' * 50; npm run dev"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server in new window
Write-Host "🌐 Starting Frontend Server (port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectDir'; Write-Host 'Frontend Server' -ForegroundColor Cyan; Write-Host '=' * 50; npm run dev"

Write-Host ""
Write-Host "✅ Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 What to expect:" -ForegroundColor Yellow
Write-Host "   • Backend will run on: http://localhost:3001" -ForegroundColor White
Write-Host "   • Frontend will run on: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "⏳ Wait 10-15 seconds for both servers to start..." -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Then open: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit this window (servers will keep running)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
