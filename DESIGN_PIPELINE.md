# 🎨 Design-to-Code Pipeline with CrewAI

An end-to-end automation pipeline that transforms design inspiration into production-ready Next.js code using multi-agent AI workflows.

## 🚀 Overview

This pipeline orchestrates 8 specialized AI crews to automate the complete design-to-code workflow:

1. **Screenshot Crawler** - Captures design references
2. **Wireframe Analyst** - Extracts layout structure  
3. **Design System Specialist** - Applies brand styling
4. **Component Architect** - Defines React structure
5. **Routing Specialist** - Maps navigation flow
6. **Task Generator** - Creates Cursor AI microtasks
7. **Backlog Manager** - Prioritizes development tasks
8. **QA Specialist** - Validates visual fidelity

## 📋 Prerequisites

### 1. CrewAI Python Service
```bash
# Install CrewAI and dependencies
pip install crewai crewai-tools playwright opencv-python pillow

# Start the service
python -m crewai.server --port 8001
```

### 2. Environment Variables
```bash
# .env.local
CREWAI_API_KEY=your_crewai_api_key
CREWAI_SERVICE_URL=http://localhost:8001
OPENAI_API_KEY=your_openai_api_key
```

### 3. Node.js Dependencies
```bash
npm install ts-node @types/node
```

## 🛠️ Usage

### 🧪 Smoke Test (Recommended First Step)
```bash
# Run validation test on mood.com homepage (Crews 1-3 only)
npm run design-pipeline:smoke

# Validates:
# - Screenshot capture (< 2MB, 1920x1080)
# - Wireframe detection (15+ components, 4+ sections)  
# - GSI Orders brand application
# - Generates detailed validation report in ./smoke-test-output/
```

### Quick Start
```bash
# Analyze mood.com and generate implementation tasks
npm run design-pipeline:mood

# Run with parallel processing for speed
npm run design-pipeline:parallel

# Skip visual regression testing for faster iteration
npm run design-pipeline:quick
```

### Advanced Usage
```bash
# Custom target site and configuration
npm run design-pipeline https://example.com -- \
  --output-dir=./custom_analysis \
  --skip-steps=7,8 \
  --parallel \
  --config=./brand-config.json
```

### Command Line Options
- `--output-dir=PATH` - Output directory (default: `./design_output`)
- `--skip-steps=N,N` - Skip specific steps (1-8)
- `--parallel` - Run steps 4-5 in parallel
- `--config=PATH` - Custom brand configuration file

## 📁 Output Structure

```
design_output/
├── screenshots/           # Baseline design screenshots
├── wireframes/           # Extracted layout structure
├── styled/              # Brand-styled wireframes
├── annotations/         # Component architecture
├── routing.json         # Navigation structure
├── cursor_tasks/        # Cursor AI microtasks
├── backlog.json        # Prioritized development plan
├── visual_tests/       # Regression test setup
├── pipeline_results.json
└── PIPELINE_SUMMARY.md
```

## 🎯 Pipeline Steps

### Step 1: Screenshot Capture
```typescript
await crew.captureScreenshots({
  targetSite: 'https://mood.com',
  routes: ['/', '/shop', '/products', '/cart'],
  outputDir: './screenshots',
  viewport: { width: 1920, height: 1080 }
});
```

**Outputs**: High-quality screenshots of all site routes

### Step 2: Wireframe Generation
```typescript
await crew.generateWireframes({
  screenshotDir: './screenshots',
  outputDir: './wireframes',
  detectionMode: 'hybrid' // bounding-box + semantic analysis
});
```

**Outputs**: JSON wireframes with component boundaries and semantic annotations

### Step 3: Design System Application
```typescript
await crew.applyDesignSystem({
  wireframeDir: './wireframes',
  outputDir: './styled',
  brandConfig: {
    colors: { 'brand-primary': '#10b981' },
    typography: ['Inter', 'DM Sans'],
    spacing: { lg: '1.5rem' }
  }
});
```

**Outputs**: Wireframes styled with GSI Orders brand system and Tailwind classes

### Step 4: Component Annotation
```typescript
await crew.annotateComponents({
  styledWireframeDir: './styled',
  outputDir: './annotations',
  componentLibrary: 'shadcn'
});
```

**Outputs**: React component structure with TypeScript interfaces and props

### Step 5: Routing Configuration
```typescript
await crew.buildRouteMap({
  annotationDir: './annotations',
  outputFile: './routing.json',
  framework: 'nextjs'
});
```

**Outputs**: Complete Next.js routing structure and navigation map

### Step 6: Microtask Generation
```typescript
await crew.generateMicrotasks({
  annotationDir: './annotations',
  routingMap: './routing.json',
  outputDir: './cursor_tasks',
  taskGranularity: 'micro'
});
```

**Outputs**: Detailed Cursor AI implementation tasks with acceptance criteria

### Step 7: Backlog Management
```typescript
await crew.manageBacklog({
  microtaskDir: './cursor_tasks',
  outputFile: './backlog.json',
  estimationModel: 'fibonacci',
  priorityWeights: { business: 0.4, technical: 0.3, dependencies: 0.3 }
});
```

**Outputs**: Prioritized backlog with time estimates and dependency graph

### Step 8: Visual Regression Setup
```typescript
await crew.runVisualRegression({
  baselineDir: './screenshots',
  currentUrl: 'http://localhost:3000',
  outputDir: './visual_tests',
  threshold: 0.05
});
```

**Outputs**: Visual regression test configuration and baseline comparisons

## ⚡ Performance & Optimization

### Parallel Execution
```bash
# Run steps 4-5 simultaneously for 40% speed improvement
npm run design-pipeline https://mood.com -- --parallel
```

### Step Skipping
```bash
# Skip expensive steps during iteration
npm run design-pipeline https://mood.com -- --skip-steps=1,8
```

### Cost Management
- **Crew 1-3**: High API usage (screenshot, computer vision)
- **Crew 4-7**: Medium API usage (text generation)
- **Crew 8**: Low API usage (image comparison)

**Tip**: Skip step 8 during development iterations to reduce costs.

## 🔧 Integration with Cursor AI

### Generated Microtasks
Each microtask includes:
```markdown
## Task: Create ProductCard Component

### Requirements
- TypeScript interface with product props
- shadcn/ui styling integration
- Add to cart functionality
- Loading and error states

### Acceptance Criteria
- [ ] Component renders product information
- [ ] Handles click events properly
- [ ] Responsive design (mobile/desktop)
- [ ] Accessibility compliance (WCAG AA)

### Time Estimate: 2 hours
### Priority: High
### Dependencies: useCart hook, Product type definition
```

### Implementation Workflow
1. Review `backlog.json` for priority order
2. Pick highest priority task from `cursor_tasks/`
3. Use Cursor AI to implement following task specification
4. Test implementation against acceptance criteria
5. Run visual regression tests if needed

## 🌐 GitHub Actions Integration

### Manual Trigger
Go to Actions → Design-to-Code Pipeline → Run workflow

### Automated Trigger
```bash
# Trigger via API
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/your-org/gsiorders.com/dispatches \
  -d '{"event_type":"design-pipeline","client_payload":{"target_site":"https://mood.com"}}'
```

### Artifacts Generated
- `design-pipeline-results` - Complete pipeline output
- `baseline-screenshots` - Design reference screenshots (365 day retention)
- `cursor-microtasks` - Implementation tasks (90 day retention)
- `pipeline-summary` - Executive summary report

## 🎨 Brand Configuration

### Default GSI Orders Config
```typescript
const brandConfig = {
  colors: {
    'brand-primary': '#10b981',   // Liquid Heaven (Emerald)
    'brand-secondary': '#ec4899', // Motaquila (Pink)
    'brand-accent': '#6366f1'     // Last Genie (Indigo)
  },
  typography: ['Inter', 'DM Sans'],
  spacing: { xs: '0.5rem', lg: '1.5rem' }
};
```

### Custom Brand Config
```json
{
  "colors": {
    "brand-primary": "#your-color",
    "brand-secondary": "#your-color"
  },
  "typography": ["Your-Font", "Fallback"],
  "spacing": {
    "sm": "0.75rem",
    "lg": "2rem"
  }
}
```

## 🚨 Troubleshooting

### Common Issues

**CrewAI Service Not Running**
```bash
# Check service status
npm run crew:health

# Start service manually
python -m crewai.server --port 8001
```

**Screenshot Capture Fails**
```bash
# Install Playwright browsers
playwright install chromium

# Check target site accessibility
curl -I https://mood.com
```

**High API Costs**
```bash
# Skip expensive steps
npm run design-pipeline https://mood.com -- --skip-steps=1,2,8
```

**TypeScript Errors**
```bash
# Check types
npm run type-check

# Ensure ts-node is installed
npm install -D ts-node @types/node
```

### Debug Mode
```bash
# Run with verbose logging
DEBUG=crew:* npm run design-pipeline https://mood.com
```

## 📊 Monitoring & Analytics

### Pipeline Metrics
- **Execution Time**: Track crew performance
- **API Usage**: Monitor token consumption
- **Success Rate**: Pipeline reliability
- **Output Quality**: Visual similarity scores

### Cost Optimization
1. **Cache Screenshots**: Reuse for multiple runs
2. **Skip Redundant Steps**: Use `--skip-steps`
3. **Parallel Processing**: Reduce wall-clock time
4. **Batch Processing**: Multiple sites in one run

## 🔮 Advanced Features

### Custom Crews
```typescript
// Add custom crew for specific analysis
const customCrew = await crew.run({
  agents: [{
    role: 'SEO Specialist',
    goal: 'Analyze SEO opportunities',
    backstory: 'Expert in technical SEO and page optimization'
  }],
  tasks: [{
    description: 'Audit target site for SEO improvements',
    expectedOutput: 'SEO recommendation report'
  }]
});
```

### Multi-Site Analysis
```bash
# Analyze multiple competitors
for site in mood.com charlotte-web.com; do
  npm run design-pipeline https://$site -- --output-dir=./analysis/$site
done
```

### Integration with Design Systems
```typescript
// Import existing design tokens
const designTokens = require('./design-tokens.json');
const brandConfig = convertDesignTokens(designTokens);
```

## 📚 Next Steps

1. **Run First Analysis**: `npm run design-pipeline:mood`
2. **Review Generated Tasks**: Check `design_output/cursor_tasks/`
3. **Implement with Cursor AI**: Use generated microtasks
4. **Visual Validation**: Compare with baseline screenshots
5. **Iterate**: Re-run pipeline for design updates

---

**📧 Questions?** Create an issue or check the [CrewAI documentation](https://docs.crewai.com/) for advanced configurations. 