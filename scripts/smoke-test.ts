#!/usr/bin/env node

/**
 * Design Pipeline Smoke Test
 * Runs Crews 1-3 on mood.com homepage for validation
 */

import { CrewClient } from '../src/utils/crew';
import * as fs from 'fs';
import * as path from 'path';

interface SmokeTestConfig {
  targetSite: string;
  outputDir: string;
  validationCriteria: {
    maxScreenshotSize: number;
    minComponentCount: number;
    requiredSections: string[];
  };
}

interface SmokeTestResult {
  stage: string;
  success: boolean;
  validation?: any;
  error?: string;
  executionTime: number;
}

interface SmokeTestReport {
  timestamp: string;
  config: SmokeTestConfig;
  results: SmokeTestResult[];
  summary: {
    totalStages: number;
    passedStages: number;
    failedStages: number;
    overallSuccess: boolean;
  };
}

class DesignPipelineSmokeTest {
  private crewClient: CrewClient;
  private config: SmokeTestConfig;
  private results: SmokeTestResult[] = [];

  constructor() {
    this.crewClient = new CrewClient();
    this.config = {
      targetSite: 'https://mood.com',
      outputDir: './smoke-test-output',
      validationCriteria: {
        maxScreenshotSize: 2 * 1024 * 1024, // 2MB
        minComponentCount: 15,
        requiredSections: ['header', 'hero', 'products', 'footer']
      }
    };
  }

  /**
   * Setup test environment
   */
  private async setup(): Promise<void> {
    console.log('🔧 Setting up smoke test environment...');
    
    // Create output directory structure
    const dirs = [
      this.config.outputDir,
      path.join(this.config.outputDir, 'screenshots'),
      path.join(this.config.outputDir, 'wireframes'),
      path.join(this.config.outputDir, 'styled-wireframes')
    ];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    }
  }

  /**
   * Cleanup previous test artifacts
   */
  private async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up previous test artifacts...');
    
    if (fs.existsSync(this.config.outputDir)) {
      fs.rmSync(this.config.outputDir, { recursive: true, force: true });
    }
  }

  /**
   * Check CrewAI service health
   */
  private async checkServiceHealth(): Promise<boolean> {
    console.log('🏥 Checking CrewAI service health...');
    
    const isHealthy = await this.crewClient.healthCheck();
    if (!isHealthy) {
      console.error('❌ CrewAI service is not responding');
      console.log('💡 Please ensure CrewAI service is running on port 8001');
      return false;
    }
    
    console.log('✅ CrewAI service is healthy');
    return true;
  }

  /**
   * Run Crew 1: Screenshot Capture
   */
  private async runScreenshotCapture(): Promise<SmokeTestResult> {
    console.log('\n📸 CREW 1: Capturing screenshots from mood.com...');
    const startTime = Date.now();

    try {
      const result = await this.crewClient.captureScreenshots({
        targetSite: this.config.targetSite,
        routes: ['/'], // Homepage only for smoke test
        outputDir: path.join(this.config.outputDir, 'screenshots'),
        viewport: { width: 1920, height: 1080 },
        waitTime: 3000
      });

      const executionTime = Date.now() - startTime;

      if (!result.success) {
        return {
          stage: 'Screenshot Capture',
          success: false,
          error: result.error || 'Unknown error',
          executionTime
        };
      }

      // Additional validation for smoke test
      const screenshotDir = path.join(this.config.outputDir, 'screenshots');
      const validation = this.validateScreenshotOutput(screenshotDir);

      return {
        stage: 'Screenshot Capture',
        success: validation.isValid,
        validation: validation,
        error: validation.isValid ? undefined : validation.errors.join(', '),
        executionTime
      };

    } catch (error) {
      return {
        stage: 'Screenshot Capture',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Run Crew 2: Wireframe Generation
   */
  private async runWireframeGeneration(): Promise<SmokeTestResult> {
    console.log('\n🎨 CREW 2: Generating wireframes...');
    const startTime = Date.now();

    try {
      const result = await this.crewClient.generateWireframes({
        screenshotDir: path.join(this.config.outputDir, 'screenshots'),
        outputDir: path.join(this.config.outputDir, 'wireframes'),
        detectionMode: 'hybrid'
      });

      const executionTime = Date.now() - startTime;

      if (!result.success) {
        return {
          stage: 'Wireframe Generation',
          success: false,
          error: result.error || 'Unknown error',
          executionTime
        };
      }

      // Additional validation for smoke test
      const wireframeDir = path.join(this.config.outputDir, 'wireframes');
      const validation = this.validateWireframeOutput(wireframeDir);

      return {
        stage: 'Wireframe Generation',
        success: validation.isValid,
        validation: validation,
        error: validation.isValid ? undefined : validation.errors.join(', '),
        executionTime
      };

    } catch (error) {
      return {
        stage: 'Wireframe Generation',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Run Crew 3: Design System Application
   */
  private async runDesignSystemApplication(): Promise<SmokeTestResult> {
    console.log('\n🎯 CREW 3: Applying GSI Orders design system...');
    const startTime = Date.now();

    try {
      const result = await this.crewClient.applyDesignSystem({
        wireframeDir: path.join(this.config.outputDir, 'wireframes'),
        outputDir: path.join(this.config.outputDir, 'styled-wireframes'),
        brandConfig: this.getGSIOrdersBrandConfig()
      });

      const executionTime = Date.now() - startTime;

      if (!result.success) {
        return {
          stage: 'Design System Application',
          success: false,
          error: result.error || 'Unknown error',
          executionTime
        };
      }

      // Basic validation - check if output exists
      const styledDir = path.join(this.config.outputDir, 'styled-wireframes');
      const validation = this.validateStyledOutput(styledDir);

      return {
        stage: 'Design System Application',
        success: validation.isValid,
        validation: validation,
        error: validation.isValid ? undefined : validation.errors.join(', '),
        executionTime
      };

    } catch (error) {
      return {
        stage: 'Design System Application',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Validate screenshot output
   */
  private validateScreenshotOutput(outputDir: string): { isValid: boolean; errors: string[]; metrics?: any } {
    const errors: string[] = [];
    const metrics: any = {};

    try {
      if (!fs.existsSync(outputDir)) {
        errors.push('Screenshots directory does not exist');
        return { isValid: false, errors };
      }

      const files = fs.readdirSync(outputDir)
        .filter(f => f.toLowerCase().endsWith('.png') || f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'));

      if (files.length === 0) {
        errors.push('No screenshot files found');
        return { isValid: false, errors };
      }

      // Check file sizes
      let totalSize = 0;
      let validFiles = 0;

      for (const file of files) {
        const filePath = path.join(outputDir, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;

        if (stats.size > this.config.validationCriteria.maxScreenshotSize) {
          errors.push(`Screenshot ${file} exceeds size limit: ${stats.size} bytes`);
        } else {
          validFiles++;
        }
      }

      metrics.totalFiles = files.length;
      metrics.validFiles = validFiles;
      metrics.totalSize = totalSize;
      metrics.avgFileSize = totalSize / files.length;

      if (validFiles === 0) {
        errors.push('No valid screenshots within size limits');
      }

      return { isValid: errors.length === 0, errors, metrics };

    } catch (error) {
      errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { isValid: false, errors };
    }
  }

  /**
   * Validate wireframe output
   */
  private validateWireframeOutput(outputDir: string): { isValid: boolean; errors: string[]; metrics?: any } {
    const errors: string[] = [];
    const metrics: any = {};

    try {
      if (!fs.existsSync(outputDir)) {
        errors.push('Wireframes directory does not exist');
        return { isValid: false, errors };
      }

      const jsonFiles = fs.readdirSync(outputDir).filter(f => f.endsWith('.json'));

      if (jsonFiles.length === 0) {
        errors.push('No wireframe JSON files found');
        return { isValid: false, errors };
      }

      let totalComponents = 0;
      let totalSections = 0;
      const foundSections = new Set<string>();

      for (const file of jsonFiles) {
        try {
          const content = JSON.parse(fs.readFileSync(path.join(outputDir, file), 'utf8'));
          
          if (content.components && Array.isArray(content.components)) {
            totalComponents += content.components.length;
          }
          
          if (content.sections && Array.isArray(content.sections)) {
            totalSections += content.sections.length;
            content.sections.forEach((section: any) => {
              if (section.type) {
                foundSections.add(section.type.toLowerCase());
              }
            });
          }
        } catch (parseError) {
          errors.push(`Failed to parse wireframe file ${file}`);
        }
      }

      // Validation checks
      if (totalComponents < this.config.validationCriteria.minComponentCount) {
        errors.push(`Insufficient components: ${totalComponents} < ${this.config.validationCriteria.minComponentCount}`);
      }

      if (totalSections < this.config.validationCriteria.requiredSections.length) {
        errors.push(`Insufficient sections: ${totalSections} < ${this.config.validationCriteria.requiredSections.length}`);
      }

      metrics.totalComponents = totalComponents;
      metrics.totalSections = totalSections;
      metrics.foundSections = Array.from(foundSections);
      metrics.requiredSectionsCovered = this.config.validationCriteria.requiredSections
        .filter(section => foundSections.has(section)).length;

      return { isValid: errors.length === 0, errors, metrics };

    } catch (error) {
      errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { isValid: false, errors };
    }
  }

  /**
   * Validate styled output
   */
  private validateStyledOutput(outputDir: string): { isValid: boolean; errors: string[]; metrics?: any } {
    const errors: string[] = [];
    const metrics: any = {};

    try {
      if (!fs.existsSync(outputDir)) {
        errors.push('Styled wireframes directory does not exist');
        return { isValid: false, errors };
      }

      const files = fs.readdirSync(outputDir);
      metrics.totalFiles = files.length;

      if (files.length === 0) {
        errors.push('No styled wireframe files found');
        return { isValid: false, errors };
      }

      return { isValid: true, errors, metrics };

    } catch (error) {
      errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { isValid: false, errors };
    }
  }

  /**
   * Get GSI Orders brand configuration
   */
  private getGSIOrdersBrandConfig() {
    return {
      colors: {
        primary: '#10b981',
        secondary: '#6b7280',
        accent: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
      },
      typography: [
        'Inter',
        'system-ui',
        'sans-serif'
      ],
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
      },
      components: {
        button: {
          variants: ['primary', 'secondary', 'outline']
        },
        card: {
          variants: ['default', 'elevated', 'outlined']
        }
      }
    };
  }

  /**
   * Generate final test report
   */
  private generateReport(): SmokeTestReport {
    const passedStages = this.results.filter(r => r.success).length;
    const failedStages = this.results.filter(r => !r.success).length;

    return {
      timestamp: new Date().toISOString(),
      config: this.config,
      results: this.results,
      summary: {
        totalStages: this.results.length,
        passedStages,
        failedStages,
        overallSuccess: failedStages === 0
      }
    };
  }

  /**
   * Save report to JSON file
   */
  private saveReport(report: SmokeTestReport): void {
    const reportPath = path.join(this.config.outputDir, 'smoke-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Test report saved to: ${reportPath}`);
  }

  /**
   * Print summary to console
   */
  private printSummary(report: SmokeTestReport): void {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 SMOKE TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Target Site: ${this.config.targetSite}`);
    console.log(`Output Directory: ${this.config.outputDir}`);
    console.log(`Test Time: ${report.timestamp}`);
    console.log('');
    
    console.log('STAGE RESULTS:');
    this.results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      const time = `${result.executionTime}ms`;
      console.log(`${status} ${result.stage.padEnd(25)} ${time.padStart(8)}`);
      if (!result.success && result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });

    console.log('');
    console.log('OVERALL RESULT:');
    const overallStatus = report.summary.overallSuccess ? '✅ PASSED' : '❌ FAILED';
    console.log(`${overallStatus} (${report.summary.passedStages}/${report.summary.totalStages} stages passed)`);
    
    if (!report.summary.overallSuccess) {
      console.log('\n💡 NEXT STEPS:');
      console.log('1. Check CrewAI service logs for errors');
      console.log('2. Verify mood.com is accessible');
      console.log('3. Review validation criteria in smoke-test-report.json');
      console.log('4. Run individual crew methods for debugging');
    }
  }

  /**
   * Run the complete smoke test
   */
  async runSmokeTest(): Promise<void> {
    console.log('🧪 Starting Design Pipeline Smoke Test...');
    console.log(`Target: ${this.config.targetSite}`);
    console.log(`Output: ${this.config.outputDir}`);
    console.log('');

    try {
      // Pre-flight checks
      await this.cleanup();
      await this.setup();
      
      const isHealthy = await this.checkServiceHealth();
      if (!isHealthy) {
        console.error('❌ Smoke test aborted: CrewAI service unavailable');
        process.exit(1);
      }

      // Run the 3 crews sequentially
      console.log('\n🚀 Starting pipeline execution...');
      
      this.results.push(await this.runScreenshotCapture());
      
      // Only proceed if screenshot capture succeeded
      if (this.results[0].success) {
        this.results.push(await this.runWireframeGeneration());
        
        // Only proceed if wireframe generation succeeded
        if (this.results[1].success) {
          this.results.push(await this.runDesignSystemApplication());
        }
      }

      // Generate and save report
      const report = this.generateReport();
      this.saveReport(report);
      this.printSummary(report);

      // Exit with appropriate code
      process.exit(report.summary.overallSuccess ? 0 : 1);

    } catch (error) {
      console.error('💥 Smoke test failed with error:', error);
      process.exit(1);
    }
  }
}

// Run the smoke test if this script is executed directly
if (require.main === module) {
  const smokeTest = new DesignPipelineSmokeTest();
  smokeTest.runSmokeTest().catch(console.error);
}

export { DesignPipelineSmokeTest }; 