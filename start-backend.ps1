# Start Backend Server Only
# Run this if you only want to start the backend

Write-Host "Starting Backend Server..." -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$serverDir = Join-Path $scriptDir "server"

Set-Location $serverDir

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "Starting server on port 3001..." -ForegroundColor Green
npm run dev
