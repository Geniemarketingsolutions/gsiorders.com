# Component Implementation Verification Script (PowerShell)
# Run after each Cursor AI component implementation

Write-Host "🔍 Verifying Component Implementation..." -ForegroundColor Cyan

# 1. TypeScript compilation
Write-Host "📋 Checking TypeScript compilation..." -ForegroundColor Yellow
npm run type-check
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ TypeScript errors found" -ForegroundColor Red
    exit 1
}

# 2. Linting
Write-Host "📋 Running ESLint..." -ForegroundColor Yellow
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ESLint errors found" -ForegroundColor Red
    exit 1
}

# 3. Unit tests
Write-Host "📋 Running unit tests..." -ForegroundColor Yellow
npm run test
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Unit tests failed" -ForegroundColor Red
    exit 1
}

# 4. Build check
Write-Host "📋 Testing build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# 5. Smoke test
Write-Host "📋 Running smoke tests..." -ForegroundColor Yellow
npm run design-pipeline:smoke
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Smoke tests failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ All verification checks passed!" -ForegroundColor Green
Write-Host "🚀 Component ready for review and merge" -ForegroundColor Green 