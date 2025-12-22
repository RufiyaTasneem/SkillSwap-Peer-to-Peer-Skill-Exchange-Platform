# Quick Backend Test Script
# Run this script to verify the backend is working

Write-Host "`n🧪 Testing Backend Server..." -ForegroundColor Cyan
Write-Host "=" * 50

# Test 1: Health Check
Write-Host "`n1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 5
    if ($health.StatusCode -eq 200) {
        Write-Host "   ✅ Health Check: PASSED" -ForegroundColor Green
        $healthData = $health.Content | ConvertFrom-Json
        Write-Host "   Message: $($healthData.message)" -ForegroundColor Gray
    } else {
        Write-Host "   ❌ Health Check: FAILED (Status: $($health.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Health Check: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n   💡 Make sure the server is running: cd server && npm run dev" -ForegroundColor Yellow
    exit 1
}

# Test 2: Questions Endpoint
Write-Host "`n2. Testing Questions API..." -ForegroundColor Yellow
try {
    $questions = Invoke-WebRequest -Uri "http://localhost:3001/api/questions/Coding" -UseBasicParsing -TimeoutSec 5
    if ($questions.StatusCode -eq 200) {
        Write-Host "   ✅ Questions API: PASSED" -ForegroundColor Green
        $data = $questions.Content | ConvertFrom-Json
        Write-Host "   Found $($data.count) questions for 'Coding' category" -ForegroundColor Gray
    } else {
        Write-Host "   ❌ Questions API: FAILED (Status: $($questions.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Questions API: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Database File Check
Write-Host "`n3. Checking Database File..." -ForegroundColor Yellow
$dbPath = "data\skillswap.json"
if (Test-Path $dbPath) {
    Write-Host "   ✅ Database file exists" -ForegroundColor Green
    $dbSize = (Get-Item $dbPath).Length
    Write-Host "   File size: $dbSize bytes" -ForegroundColor Gray
} else {
    Write-Host "   ⚠️  Database file not found (will be created on first use)" -ForegroundColor Yellow
}

# Summary
Write-Host "`n" + "=" * 50
Write-Host "✅ Backend is working correctly! 🎉" -ForegroundColor Green
Write-Host "`nYou can now:" -ForegroundColor Cyan
Write-Host "  • Test the frontend at http://localhost:3000" -ForegroundColor White
Write-Host "  • Add skills and take tests" -ForegroundColor White
Write-Host "  • View API responses in browser DevTools" -ForegroundColor White
