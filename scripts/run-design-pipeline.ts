#!/usr/bin/env ts-node

/**
 * Design-to-Code Pipeline Execution Script
 * 
 * This script demonstrates how to run the complete end-to-end 
 * design-to-code pipeline using CrewAI for gsiorders.com.
 * 
 * Usage:
 *   npm run design-pipeline [target-site] [options]
 * 
 * Examples:
 *   npm run design-pipeline https://mood.com
 *   npm run design-pipeline https://mood.com --skip-steps=8 --parallel
 *   npm run design-pipeline https://mood.com --output-dir=./design_analysis
 */

import { CrewClient } from '../src/utils/crew';
import * as fs from 'fs';
import * as path from 'path';

interface PipelineOptions {
  targetSite: string;
  outputDir: string;
  skipSteps: number[];
  parallel: boolean;
  configFile?: string;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎨 Design-to-Code Pipeline

Usage: npm run design-pipeline <target-site> [options]

Arguments:
  target-site         URL to analyze (e.g., https://mood.com)

Options:
  --output-dir=PATH   Output directory (default: ./design_output)
  --skip-steps=N,N    Skip specific steps (1-8)
  --parallel          Run steps 4-5 in parallel
  --config=PATH       Custom brand config file

Examples:
  npm run design-pipeline https://mood.com
  npm run design-pipeline https://mood.com --output-dir=./mood_analysis
  npm run design-pipeline https://mood.com --skip-steps=8 --parallel
`);
    process.exit(1);
  }

  const options: PipelineOptions = {
    targetSite: args[0],
    outputDir: './design_output',
    skipSteps: [],
    parallel: false
  };

  // Parse command line arguments
  for (const arg of args.slice(1)) {
    if (arg.startsWith('--output-dir=')) {
      options.outputDir = arg.split('=')[1];
    } else if (arg.startsWith('--skip-steps=')) {
      options.skipSteps = arg.split('=')[1].split(',').map(Number);
    } else if (arg === '--parallel') {
      options.parallel = true;
    } else if (arg.startsWith('--config=')) {
      options.configFile = arg.split('=')[1];
    }
  }

  console.log('🚀 Starting Design-to-Code Pipeline');
  console.log('📋 Configuration:', {
    targetSite: options.targetSite,
    outputDir: options.outputDir,
    skipSteps: options.skipSteps,
    parallel: options.parallel
  });

  // Ensure output directory exists
  if (!fs.existsSync(options.outputDir)) {
    fs.mkdirSync(options.outputDir, { recursive: true });
  }

  // Initialize CrewAI client
  const crew = new CrewClient({
    apiKey: process.env.CREWAI_API_KEY,
    serviceUrl: process.env.CREWAI_SERVICE_URL || 'http://localhost:8001',
    timeout: 120000 // 2 minutes per crew
  });

  // Health check
  console.log('🔍 Checking CrewAI service...');
  try {
    await crew.healthCheck();
    console.log('✅ CrewAI service is healthy');
  } catch (error) {
    console.error('❌ CrewAI service health check failed:', error.message);
    console.log('💡 Make sure the CrewAI Python service is running on port 8001');
    process.exit(1);
  }

  // Load brand configuration
  let brandConfig;
  if (options.configFile && fs.existsSync(options.configFile)) {
    brandConfig = JSON.parse(fs.readFileSync(options.configFile, 'utf8'));
    console.log('📄 Using custom brand config:', options.configFile);
  } else {
    brandConfig = CrewClient.getGSIOrdersBrandConfig();
    console.log('🎨 Using default GSI Orders brand config');
  }

  // Run the pipeline
  const startTime = Date.now();
  
  try {
    const result = await crew.runDesignToCodePipeline({
      targetSite: options.targetSite,
      outputBaseDir: options.outputDir,
      brandConfig,
      skipSteps: options.skipSteps,
      parallelism: options.parallel
    });

    const totalTime = Date.now() - startTime;

    console.log('\n🎉 Pipeline Execution Complete!');
    console.log(`⏱️ Total Time: ${totalTime / 1000}s`);
    console.log(`✅ Success: ${result.success}`);
    
    if (result.errors.length > 0) {
      console.log('❌ Errors:', result.errors);
    }

    // Save results to file
    const resultsFile = path.join(options.outputDir, 'pipeline_results.json');
    fs.writeFileSync(resultsFile, JSON.stringify({
      ...result,
      pipelineConfig: options,
      executionTime: totalTime,
      timestamp: new Date().toISOString()
    }, null, 2));

    console.log(`📊 Results saved to: ${resultsFile}`);

    // Generate summary report
    generateSummaryReport(result, options.outputDir);

    if (result.success) {
      console.log('\n🎯 Next Steps:');
      console.log('1. Review generated microtasks in:', path.join(options.outputDir, 'cursor_tasks'));
      console.log('2. Check prioritized backlog:', path.join(options.outputDir, 'backlog.json'));
      console.log('3. Start implementing components with Cursor AI');
      console.log('4. Run visual regression tests after implementation');
    }

  } catch (error) {
    console.error('💥 Pipeline failed:', error);
    process.exit(1);
  }
}

function generateSummaryReport(result: any, outputDir: string) {
  const reportPath = path.join(outputDir, 'PIPELINE_SUMMARY.md');
  
  const report = `# Design-to-Code Pipeline Summary

## Execution Overview
- **Timestamp**: ${new Date().toISOString()}
- **Success**: ${result.success ? '✅' : '❌'}
- **Total Execution Time**: ${Object.values(result.timings as Record<string, number>).reduce((sum: number, time: number) => sum + time, 0) / 1000}s

## Step Results

${Object.entries(result.results).map(([step, stepResult]: [string, any]) => `
### ${step.toUpperCase()}
- **Status**: ${stepResult.success ? '✅ Success' : '❌ Failed'}
- **Execution Time**: ${result.timings[step] / 1000}s
- **Output**: ${stepResult.result ? 'Generated' : 'None'}
${stepResult.error ? `- **Error**: ${stepResult.error}` : ''}
`).join('')}

## Generated Artifacts

### Screenshots
- 📁 Location: \`./screenshots/\`
- 📄 Files: Full-page screenshots of target site routes

### Wireframes  
- 📁 Location: \`./wireframes/\`
- 📄 Files: JSON wireframe definitions with component boundaries

### Styled Wireframes
- 📁 Location: \`./styled/\`
- 📄 Files: Brand-styled wireframes with Tailwind classes

### Component Annotations
- 📁 Location: \`./annotations/\`
- 📄 Files: React component structure and TypeScript interfaces

### Routing Configuration
- 📄 File: \`./routing.json\`
- 📋 Content: Next.js routing structure and navigation flow

### Microtasks
- 📁 Location: \`./cursor_tasks/\`
- 📄 Files: Individual Cursor AI implementation tasks

### Backlog
- 📄 File: \`./backlog.json\`
- 📋 Content: Prioritized development backlog with time estimates

### Visual Tests
- 📁 Location: \`./visual_tests/\`
- 📄 Files: Baseline screenshots and regression test configuration

## Usage Instructions

### Implementation Phase
1. Review the prioritized backlog in \`backlog.json\`
2. Start with highest priority microtasks in \`cursor_tasks/\`
3. Use Cursor AI to implement each task systematically
4. Follow the component structure defined in \`annotations/\`

### Quality Assurance  
1. Run visual regression tests against baseline screenshots
2. Compare implemented pages with original design targets
3. Use the routing configuration for navigation testing
4. Validate brand theming matches styled wireframes

### Next Pipeline Run
To update the pipeline with new design changes:
\`\`\`bash
npm run design-pipeline ${result.pipelineConfig?.targetSite} --output-dir=./design_update
\`\`\`

## Errors and Issues
${result.errors.length > 0 ? result.errors.map((error: string) => `- ❌ ${error}`).join('\n') : '✅ No errors reported'}

---
*Generated by gsiorders.com Design-to-Code Pipeline*
`;

  fs.writeFileSync(reportPath, report);
  console.log(`📋 Summary report generated: ${reportPath}`);
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

export { main as runDesignPipeline }; 