#!/usr/bin/env python3
"""
Simplified CrewAI Design-to-Code Pipeline Service (Mock Version)
FastAPI service for testing the pipeline without full CrewAI dependencies
"""

import os
import json
import time
from datetime import datetime
from typing import Dict, List, Any, Optional
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="CrewAI Design-to-Code Pipeline (Mock)",
    description="Mock AI-powered design analysis and code generation service",
    version="1.0.0-mock"
)

# Configure CORS for Next.js integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class ScreenshotRequest(BaseModel):
    target_url: str
    viewport_width: int = 1920
    viewport_height: int = 1080
    output_dir: str = "./smoke-test-output"

class WireframeRequest(BaseModel):
    screenshot_path: str
    output_dir: str = "./smoke-test-output"

class DesignRequest(BaseModel):
    wireframe_path: str
    brand_config: Dict[str, Any] = {
        "primary_color": "#10b981",
        "secondary_color": "#ec4899", 
        "accent_color": "#6366f1",
        "font_family": "Inter"
    }
    output_dir: str = "./smoke-test-output"

class PipelineRequest(BaseModel):
    target_url: str
    output_dir: str = "./smoke-test-output"
    skip_steps: List[int] = []
    parallel: bool = False

# Health Check Endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "crewai-design-pipeline-mock",
        "version": "1.0.0-mock",
        "timestamp": datetime.now().isoformat(),
        "port": 8001,
        "mode": "mock"
    }

# Tools Endpoint
@app.get("/tools")
async def list_tools():
    """List available tools"""
    return {
        "tools": [
            {
                "name": "screenshot_capture",
                "description": "Capture full-page screenshots",
                "crew": 1
            },
            {
                "name": "wireframe_analysis", 
                "description": "Extract layout and components",
                "crew": 2
            },
            {
                "name": "design_application",
                "description": "Apply brand styling",
                "crew": 3
            }
        ]
    }

# Mock Crew 1: Screenshot Capture
@app.post("/crews/1/screenshot")
async def capture_screenshot(request: ScreenshotRequest):
    """Mock screenshot capture"""
    print(f"🎯 Mock Crew 1: Capturing screenshot of {request.target_url}")
    
    # Simulate processing time
    await simulate_processing(2.0, "Capturing screenshot")
    
    # Create output directory
    output_dir = Path(request.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Create mock screenshot file (SVG)
    screenshot_path = output_dir / "screenshot-mood-homepage.png"
    
    # Create a simple SVG that represents a screenshot
    mock_screenshot_svg = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg width="{request.viewport_width}" height="{request.viewport_height}" 
     viewBox="0 0 {request.viewport_width} {request.viewport_height}" 
     xmlns="http://www.w3.org/2000/svg">
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="#f8fafc"/>
  
  <!-- Header -->
  <rect x="0" y="0" width="100%" height="80" fill="#1f2937"/>
  <text x="60" y="45" font-family="Arial" font-size="24" fill="white">mood.com</text>
  <text x="{request.viewport_width-200}" y="45" font-family="Arial" font-size="16" fill="white">Cart | Login</text>
  
  <!-- Hero Section -->
  <rect x="100" y="120" width="{request.viewport_width-200}" height="400" fill="#10b981" rx="12"/>
  <text x="200" y="250" font-family="Arial" font-size="48" fill="white">Premium CBD</text>
  <text x="200" y="300" font-family="Arial" font-size="32" fill="white">Shop Cannabis Products</text>
  <rect x="200" y="340" width="150" height="50" fill="#ffffff" rx="8"/>
  <text x="250" y="370" font-family="Arial" font-size="16" fill="#10b981">Shop Now</text>
  
  <!-- Products Grid -->
  <g transform="translate(100, 580)">
    <rect x="0" y="0" width="280" height="300" fill="white" stroke="#e5e7eb" rx="8"/>
    <rect x="20" y="20" width="240" height="180" fill="#f3f4f6" rx="4"/>
    <text x="30" y="220" font-family="Arial" font-size="16">CBD Gummies</text>
    <text x="30" y="240" font-family="Arial" font-size="14" fill="#6b7280">$29.99</text>
    
    <rect x="320" y="0" width="280" height="300" fill="white" stroke="#e5e7eb" rx="8"/>
    <rect x="340" y="20" width="240" height="180" fill="#f3f4f6" rx="4"/>
    <text x="350" y="220" font-family="Arial" font-size="16">Sleep Drops</text>
    <text x="350" y="240" font-family="Arial" font-size="14" fill="#6b7280">$34.99</text>
    
    <rect x="640" y="0" width="280" height="300" fill="white" stroke="#e5e7eb" rx="8"/>
    <rect x="660" y="20" width="240" height="180" fill="#f3f4f6" rx="4"/>
    <text x="670" y="220" font-family="Arial" font-size="16">Pain Relief</text>
    <text x="670" y="240" font-family="Arial" font-size="14" fill="#6b7280">$39.99</text>
  </g>
  
  <!-- Footer -->
  <rect x="0" y="{request.viewport_height-100}" width="100%" height="100" fill="#374151"/>
  <text x="60" y="{request.viewport_height-60}" font-family="Arial" font-size="14" fill="white">© 2025 mood.com</text>
  
</svg>"""
    
    # Save the mock screenshot
    with open(screenshot_path, 'w') as f:
        f.write(mock_screenshot_svg)
    
    return {
        "success": True,
        "screenshot_path": str(screenshot_path),
        "file_size_mb": 0.1,  # Mock size
        "resolution": f"{request.viewport_width}x{request.viewport_height}",
        "format": "SVG",
        "processing_time": 2.0
    }

# Mock Crew 2: Wireframe Analysis  
@app.post("/crews/2/wireframe")
async def analyze_wireframe(request: WireframeRequest):
    """Mock wireframe analysis"""
    print(f"🎯 Mock Crew 2: Analyzing wireframe from {request.screenshot_path}")
    
    # Simulate processing time
    await simulate_processing(3.0, "Analyzing layout and components")
    
    # Create output directory
    output_dir = Path(request.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Mock wireframe analysis
    wireframe_data = {
        "components_detected": 16,
        "sections_identified": 5,
        "confidence_score": 0.92,
        "sections": [
            {
                "name": "header",
                "bbox": [0, 0, 1920, 80],
                "components": ["logo", "navigation", "cart-icon"]
            },
            {
                "name": "hero", 
                "bbox": [100, 120, 1720, 400],
                "components": ["hero-title", "hero-subtitle", "cta-button"]
            },
            {
                "name": "products",
                "bbox": [100, 580, 1720, 300], 
                "components": ["product-card", "product-image", "product-title", "product-price"]
            },
            {
                "name": "trust-indicators",
                "bbox": [100, 920, 1720, 100],
                "components": ["trust-badge", "certification-logo"]
            },
            {
                "name": "footer",
                "bbox": [0, 980, 1920, 100],
                "components": ["footer-links", "copyright"]
            }
        ],
        "components": [
            {"name": "logo", "type": "text", "bbox": [60, 20, 140, 40]},
            {"name": "navigation", "type": "menu", "bbox": [200, 20, 600, 40]},
            {"name": "cart-icon", "type": "button", "bbox": [1720, 20, 1800, 40]},
            {"name": "hero-title", "type": "heading", "bbox": [200, 200, 800, 60]},
            {"name": "hero-subtitle", "type": "text", "bbox": [200, 270, 600, 40]},
            {"name": "cta-button", "type": "button", "bbox": [200, 340, 350, 50]},
            {"name": "product-card-1", "type": "card", "bbox": [100, 580, 380, 300]},
            {"name": "product-card-2", "type": "card", "bbox": [420, 580, 700, 300]},
            {"name": "product-card-3", "type": "card", "bbox": [740, 580, 1020, 300]},
            {"name": "product-image-1", "type": "image", "bbox": [120, 600, 360, 180]},
            {"name": "product-image-2", "type": "image", "bbox": [440, 600, 680, 180]},
            {"name": "product-image-3", "type": "image", "bbox": [760, 600, 1000, 180]},
            {"name": "product-title-1", "type": "text", "bbox": [130, 800, 350, 20]},
            {"name": "product-title-2", "type": "text", "bbox": [450, 800, 670, 20]},
            {"name": "product-title-3", "type": "text", "bbox": [770, 800, 990, 20]},
            {"name": "footer-links", "type": "menu", "bbox": [60, 1000, 400, 60]}
        ]
    }
    
    # Save wireframe data
    wireframe_path = output_dir / "wireframe-mood-homepage.json"
    with open(wireframe_path, 'w') as f:
        json.dump(wireframe_data, f, indent=2)
    
    return {
        "success": True,
        "wireframe_path": str(wireframe_path),
        "components_detected": wireframe_data["components_detected"],
        "sections_identified": wireframe_data["sections_identified"],
        "confidence_score": wireframe_data["confidence_score"],
        "processing_time": 3.0
    }

# Mock Crew 3: Design System Application
@app.post("/crews/3/design")
async def apply_design_system(request: DesignRequest):
    """Mock design system application"""
    print(f"🎯 Mock Crew 3: Applying design system to {request.wireframe_path}")
    
    # Simulate processing time
    await simulate_processing(2.5, "Applying GSI Orders brand styling")
    
    # Create output directory
    output_dir = Path(request.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Create styled wireframe (enhanced SVG with GSI Orders branding)
    styled_wireframe_path = output_dir / "styled-wireframe-gsi-orders.png"
    
    styled_svg = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="#ffffff"/>
  
  <!-- Header with GSI Orders Branding -->
  <rect x="0" y="0" width="100%" height="80" fill="{request.brand_config['primary_color']}"/>
  <text x="60" y="45" font-family="Inter" font-size="24" font-weight="bold" fill="white">GSI Orders</text>
  <text x="1600" y="35" font-family="Inter" font-size="14" fill="white">Cart (2)</text>
  <text x="1600" y="55" font-family="Inter" font-size="14" fill="white">Login</text>
  
  <!-- Hero Section with Brand Colors -->
  <rect x="100" y="120" width="1720" height="400" fill="{request.brand_config['primary_color']}" rx="12"/>
  <text x="200" y="250" font-family="Inter" font-size="48" font-weight="bold" fill="white">Premium CBD & Wellness</text>
  <text x="200" y="300" font-family="Inter" font-size="32" fill="white">100% Federally Legal Products</text>
  <rect x="200" y="340" width="180" height="50" fill="white" rx="8"/>
  <text x="260" y="370" font-family="Inter" font-size="16" font-weight="600" fill="{request.brand_config['primary_color']}">Shop Now</text>
  
  <!-- Brand Pills -->
  <rect x="400" y="340" width="120" height="50" fill="{request.brand_config['secondary_color']}" rx="25"/>
  <text x="440" y="370" font-family="Inter" font-size="14" fill="white">Motaquila</text>
  
  <rect x="540" y="340" width="130" height="50" fill="{request.brand_config['accent_color']}" rx="25"/>
  <text x="575" y="370" font-family="Inter" font-size="14" fill="white">Last Genie</text>
  
  <!-- Products Grid with Enhanced Styling -->
  <g transform="translate(100, 580)">
    <!-- Product 1 -->
    <rect x="0" y="0" width="280" height="320" fill="white" stroke="#e5e7eb" stroke-width="2" rx="12"/>
    <rect x="20" y="20" width="240" height="180" fill="{request.brand_config['primary_color']}" opacity="0.1" rx="8"/>
    <circle cx="140" cy="110" r="30" fill="{request.brand_config['primary_color']}"/>
    <text x="120" y="115" font-family="Inter" font-size="24" fill="white">🌿</text>
    <text x="30" y="220" font-family="Inter" font-size="18" font-weight="600">CBD Relief Gummies</text>
    <text x="30" y="240" font-family="Inter" font-size="14" fill="#6b7280">Liquid Heaven</text>
    <text x="30" y="260" font-family="Inter" font-size="16" font-weight="bold" fill="{request.brand_config['primary_color']}">$29.99</text>
    <rect x="30" y="280" width="220" height="25" fill="{request.brand_config['primary_color']}" rx="12"/>
    <text x="125" y="295" font-family="Inter" font-size="12" fill="white">Add to Cart</text>
    
    <!-- Product 2 -->
    <rect x="320" y="0" width="280" height="320" fill="white" stroke="#e5e7eb" stroke-width="2" rx="12"/>
    <rect x="340" y="20" width="240" height="180" fill="{request.brand_config['secondary_color']}" opacity="0.1" rx="8"/>
    <circle cx="460" cy="110" r="30" fill="{request.brand_config['secondary_color']}"/>
    <text x="440" y="115" font-family="Inter" font-size="24" fill="white">🍹</text>
    <text x="350" y="220" font-family="Inter" font-size="18" font-weight="600">Energy Wellness Drink</text>
    <text x="350" y="240" font-family="Inter" font-size="14" fill="#6b7280">Motaquila</text>
    <text x="350" y="260" font-family="Inter" font-size="16" font-weight="bold" fill="{request.brand_config['secondary_color']}">$19.99</text>
    <rect x="350" y="280" width="220" height="25" fill="{request.brand_config['secondary_color']}" rx="12"/>
    <text x="445" y="295" font-family="Inter" font-size="12" fill="white">Add to Cart</text>
    
    <!-- Product 3 -->
    <rect x="640" y="0" width="280" height="320" fill="white" stroke="#e5e7eb" stroke-width="2" rx="12"/>
    <rect x="660" y="20" width="240" height="180" fill="{request.brand_config['accent_color']}" opacity="0.1" rx="8"/>
    <circle cx="780" cy="110" r="30" fill="{request.brand_config['accent_color']}"/>
    <text x="760" y="115" font-family="Inter" font-size="24" fill="white">✨</text>
    <text x="670" y="220" font-family="Inter" font-size="18" font-weight="600">Sleep Support Capsules</text>
    <text x="670" y="240" font-family="Inter" font-size="14" fill="#6b7280">Last Genie</text>
    <text x="670" y="260" font-family="Inter" font-size="16" font-weight="bold" fill="{request.brand_config['accent_color']}">$39.99</text>
    <rect x="670" y="280" width="220" height="25" fill="{request.brand_config['accent_color']}" rx="12"/>
    <text x="765" y="295" font-family="Inter" font-size="12" fill="white">Add to Cart</text>
  </g>
  
  <!-- Trust Section -->
  <g transform="translate(100, 950)">
    <rect x="0" y="0" width="1720" height="80" fill="#f9fafb" rx="8"/>
    <text x="60" y="30" font-family="Inter" font-size="14" font-weight="600">✅ 100% Lab Tested</text>
    <text x="300" y="30" font-family="Inter" font-size="14" font-weight="600">⚖️ Federally Legal</text>
    <text x="500" y="30" font-family="Inter" font-size="14" font-weight="600">🚚 Free Shipping</text>
    <text x="700" y="30" font-family="Inter" font-size="14" font-weight="600">🔒 Secure Checkout</text>
    
    <text x="60" y="50" font-family="Inter" font-size="12" fill="#6b7280">Third-party verified</text>
    <text x="300" y="50" font-family="Inter" font-size="12" fill="#6b7280">THC &lt; 0.3%</text>
    <text x="500" y="50" font-family="Inter" font-size="12" fill="#6b7280">Orders over $75</text>
    <text x="700" y="50" font-family="Inter" font-size="12" fill="#6b7280">SSL encrypted</text>
  </g>
  
</svg>"""
    
    # Save styled wireframe
    with open(styled_wireframe_path, 'w') as f:
        f.write(styled_svg)
    
    return {
        "success": True,
        "styled_wireframe_path": str(styled_wireframe_path),
        "brand_applied": "GSI Orders",
        "primary_color": request.brand_config["primary_color"],
        "components_styled": 16,
        "processing_time": 2.5
    }

# Pipeline Status Endpoint
@app.get("/pipeline/status/{job_id}")
async def get_pipeline_status(job_id: str):
    """Get pipeline status"""
    return {
        "job_id": job_id,
        "status": "completed",
        "progress": 100,
        "steps_completed": 3,
        "total_steps": 3,
        "estimated_time_remaining": 0
    }

# Full Pipeline Endpoint (Mock)
@app.post("/pipeline/run")
async def run_pipeline(request: PipelineRequest):
    """Run complete design-to-code pipeline"""
    print(f"🎯 Mock Pipeline: Processing {request.target_url}")
    
    job_id = f"mock-{int(time.time())}"
    
    # Simulate pipeline execution
    await simulate_processing(5.0, "Running complete pipeline")
    
    return {
        "success": True,
        "job_id": job_id,
        "target_url": request.target_url,
        "output_dir": request.output_dir,
        "steps_completed": 3,
        "total_steps": 8 if not request.skip_steps else 8 - len(request.skip_steps),
        "processing_time": 5.0,
        "artifacts": [
            f"{request.output_dir}/screenshot-mood-homepage.png",
            f"{request.output_dir}/wireframe-mood-homepage.json", 
            f"{request.output_dir}/styled-wireframe-gsi-orders.png"
        ]
    }

# Helper function to simulate processing time
async def simulate_processing(duration: float, description: str = "Processing"):
    """Simulate processing time with progress"""
    import asyncio
    print(f"⏳ {description} (simulated {duration}s)...")
    await asyncio.sleep(duration)
    print(f"✅ {description} complete!")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("CREWAI_SERVICE_PORT", 8001))
    print(f"🚀 Starting CrewAI Mock Service on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port) 