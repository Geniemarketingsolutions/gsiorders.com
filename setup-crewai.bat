@echo off
REM CrewAI Design-to-Code Pipeline Setup Script (Windows)
REM Sets up environment and launches the Python service

echo 🎯 CrewAI Design-to-Code Pipeline Setup
echo ======================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python 3 is required but not installed
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

REM Check Python version
for /f "tokens=2" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo ✅ Python %PYTHON_VERSION% detected

REM Create .env.local if it doesn't exist
if not exist ".env.local" (
    echo 📝 Creating .env.local file...
    copy env.template .env.local
    echo ✅ .env.local created from template
    echo.
    echo 🔧 IMPORTANT: Please edit .env.local and add your actual API keys:
    echo   - CREWAI_API_KEY=your_actual_crewai_key
    echo   - OPENAI_API_KEY=your_actual_openai_key
    echo.
    echo For testing purposes, you can use placeholder values to test the service
    echo Press Enter to continue with placeholder values, or Ctrl+C to edit .env.local first
    pause >nul
)

REM Create python-service directory if it doesn't exist
if not exist "python-service" mkdir python-service

REM Navigate to python-service directory
cd python-service

echo 📦 Setting up Python virtual environment...

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    python -m venv venv
    echo ✅ Virtual environment created
)

REM Activate virtual environment
call venv\Scripts\activate.bat
echo ✅ Virtual environment activated

REM Upgrade pip and install dependencies
echo 📥 Installing dependencies...
python -m pip install --upgrade pip
pip install -r ..\requirements.txt
echo ✅ Dependencies installed

REM Load environment variables from .env.local
if exist "..\env.local" (
    echo 📄 Loading environment variables...
    for /f "usebackq tokens=1,2 delims==" %%a in ("..\env.local") do (
        if not "%%a"=="" if not "%%a"=="REM" set "%%a=%%b"
    )
    echo ✅ Environment loaded
)

REM Check required environment variables
if "%CREWAI_API_KEY%"=="" (
    echo ⚠️  Warning: CREWAI_API_KEY not configured
    echo Service will run in demo mode with mock responses
)
if "%OPENAI_API_KEY%"=="" (
    echo ⚠️  Warning: OPENAI_API_KEY not configured
    echo Service will run in demo mode with mock responses
)

REM Start the service
echo.
echo 🚀 Starting CrewAI service on port %CREWAI_SERVICE_PORT%...
echo 📊 Health check: http://localhost:%CREWAI_SERVICE_PORT%/health
echo 📖 API docs: http://localhost:%CREWAI_SERVICE_PORT%/docs
echo.
echo Press Ctrl+C to stop the service
echo.

REM Start the FastAPI service
python app.py

pause 