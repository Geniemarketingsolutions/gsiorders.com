#!/bin/bash

# Component Implementation Verification Script
# Run after each Cursor AI component implementation

echo "🔍 Verifying Component Implementation..."

# 1. TypeScript compilation
echo "📋 Checking TypeScript compilation..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ TypeScript errors found"
    exit 1
fi

# 2. Linting
echo "📋 Running ESLint..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ ESLint errors found"
    exit 1
fi

# 3. Unit tests
echo "📋 Running unit tests..."
npm run test
if [ $? -ne 0 ]; then
    echo "❌ Unit tests failed"
    exit 1
fi

# 4. Build check
echo "📋 Testing build..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# 5. Smoke test
echo "📋 Running smoke tests..."
npm run design-pipeline:smoke
if [ $? -ne 0 ]; then
    echo "❌ Smoke tests failed"
    exit 1
fi

echo "✅ All verification checks passed!"
echo "🚀 Component ready for review and merge" 