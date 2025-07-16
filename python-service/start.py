#!/usr/bin/env python3
"""
CrewAI Service Startup Script
Handles environment setup and service initialization
"""

import os
import sys
import subprocess
import platform
from pathlib import Path

def check_python_version():
    """Ensure Python 3.8+ is being used"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        sys.exit(1)
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")

def setup_virtual_environment():
    """Create and activate virtual environment"""
    venv_path = Path("venv")
    
    if not venv_path.exists():
        print("📦 Creating virtual environment...")
        subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
        print("✅ Virtual environment created")
    
    # Get platform-specific activation script
    if platform.system() == "Windows":
        activate_script = venv_path / "Scripts" / "activate"
        python_exe = venv_path / "Scripts" / "python.exe"
        pip_exe = venv_path / "Scripts" / "pip.exe"
    else:
        activate_script = venv_path / "bin" / "activate"
        python_exe = venv_path / "bin" / "python"
        pip_exe = venv_path / "bin" / "pip"
    
    return python_exe, pip_exe

def install_dependencies(pip_exe):
    """Install required Python packages"""
    print("📥 Installing dependencies...")
    
    # Check if requirements.txt exists
    requirements_file = Path("../requirements.txt")
    if not requirements_file.exists():
        print("❌ requirements.txt not found")
        print("Please ensure requirements.txt is in the project root")
        sys.exit(1)
    
    try:
        # Upgrade pip first
        subprocess.run([str(pip_exe), "install", "--upgrade", "pip"], check=True)
        
        # Install requirements
        subprocess.run([str(pip_exe), "install", "-r", str(requirements_file)], check=True)
        print("✅ Dependencies installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        sys.exit(1)

def check_environment_variables():
    """Verify required environment variables are set"""
    required_vars = [
        "CREWAI_API_KEY",
        "OPENAI_API_KEY"
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"  - {var}")
        print("\n💡 Please set these in your .env.local file:")
        for var in missing_vars:
            print(f"  {var}=your_actual_key_here")
        print("\nThen run: source .env.local (on Unix) or set the variables in Windows")
        return False
    
    print("✅ Environment variables configured")
    return True

def start_service(python_exe):
    """Start the CrewAI service"""
    port = os.getenv("CREWAI_SERVICE_PORT", "8001")
    
    print(f"🚀 Starting CrewAI service on port {port}...")
    print(f"📊 Health check: http://localhost:{port}/health")
    print(f"📖 API documentation: http://localhost:{port}/docs")
    print("Press Ctrl+C to stop the service\n")
    
    try:
        # Load environment variables from .env.local if it exists
        env_file = Path("../.env.local")
        env = os.environ.copy()
        
        if env_file.exists():
            print("📄 Loading environment from .env.local")
            with open(env_file) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        key, value = line.split("=", 1)
                        env[key.strip()] = value.strip()
        
        # Start the FastAPI service
        subprocess.run([str(python_exe), "app.py"], env=env, check=True)
        
    except KeyboardInterrupt:
        print("\n👋 Service stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Service failed to start: {e}")
        sys.exit(1)

def main():
    """Main startup routine"""
    print("🎯 CrewAI Design-to-Code Pipeline Service")
    print("=" * 50)
    
    # Check Python version
    check_python_version()
    
    # Setup virtual environment
    python_exe, pip_exe = setup_virtual_environment()
    
    # Install dependencies
    install_dependencies(pip_exe)
    
    # Check environment variables
    if not check_environment_variables():
        print("\n🔧 Setup incomplete. Please configure environment variables and try again.")
        sys.exit(1)
    
    # Start the service
    start_service(python_exe)

if __name__ == "__main__":
    main() 