#!/bin/bash
# CrewAI Design-to-Code Pipeline Setup Script
# Sets up environment and launches the Python service

set -e

echo "🎯 CrewAI Design-to-Code Pipeline Setup"
echo "======================================"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed"
    echo "Please install Python 3.8+ and try again"
    exit 1
fi

# Check Python version
python_version=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
echo "✅ Python $python_version detected"

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cp env.template .env.local
    echo "✅ .env.local created from template"
    echo ""
    echo "🔧 IMPORTANT: Please edit .env.local and add your actual API keys:"
    echo "  - CREWAI_API_KEY=your_actual_crewai_key"
    echo "  - OPENAI_API_KEY=your_actual_openai_key"
    echo ""
    echo "For testing purposes, you can use placeholder values to test the service"
    echo "Press Enter to continue with placeholder values, or Ctrl+C to edit .env.local first"
    read -r
fi

# Create python-service directory if it doesn't exist
mkdir -p python-service

# Navigate to python-service directory
cd python-service

echo "📦 Setting up Python virtual environment..."

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✅ Virtual environment created"
fi

# Activate virtual environment
source venv/bin/activate
echo "✅ Virtual environment activated"

# Upgrade pip and install dependencies
echo "📥 Installing dependencies..."
pip install --upgrade pip
pip install -r ../requirements.txt
echo "✅ Dependencies installed"

# Load environment variables
if [ -f "../.env.local" ]; then
    echo "📄 Loading environment variables..."
    export $(grep -v '^#' ../.env.local | xargs)
    echo "✅ Environment loaded"
fi

# Check required environment variables
if [ -z "$CREWAI_API_KEY" ] || [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  Warning: API keys not configured"
    echo "Service will run in demo mode with mock responses"
fi

# Start the service
echo ""
echo "🚀 Starting CrewAI service on port ${CREWAI_SERVICE_PORT:-8001}..."
echo "📊 Health check: http://localhost:${CREWAI_SERVICE_PORT:-8001}/health"
echo "📖 API docs: http://localhost:${CREWAI_SERVICE_PORT:-8001}/docs"
echo ""
echo "Press Ctrl+C to stop the service"
echo ""

# Start the FastAPI service
python app.py 