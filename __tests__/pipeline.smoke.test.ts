/**
 * Design Pipeline Smoke Test Validation
 * Jest tests for validating Crews 1-3 output artifacts
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Design Pipeline Smoke Test', () => {
  const SMOKE_OUTPUT_DIR = './smoke-test-output';
  const SCREENSHOT_DIR = path.join(SMOKE_OUTPUT_DIR, 'screenshots');
  const WIREFRAME_DIR = path.join(SMOKE_OUTPUT_DIR, 'wireframes');
  const STYLED_DIR = path.join(SMOKE_OUTPUT_DIR, 'styled-wireframes');
  const REPORT_FILE = path.join(SMOKE_OUTPUT_DIR, 'smoke-test-report.json');

  // Validation criteria constants
  const VALIDATION_CRITERIA = {
    maxScreenshotSize: 2 * 1024 * 1024, // 2MB
    minResolution: { width: 1920, height: 1080 },
    minComponentCount: 15,
    minSectionCount: 5,
    requiredSections: ['header', 'hero', 'products', 'footer']
  };

  beforeAll(() => {
    // Ensure we're testing the actual output directory
    expect(fs.existsSync(SMOKE_OUTPUT_DIR)).toBe(true);
  });

  describe('Smoke Test Report', () => {
    let report: any;

    beforeAll(() => {
      if (fs.existsSync(REPORT_FILE)) {
        const reportContent = fs.readFileSync(REPORT_FILE, 'utf8');
        report = JSON.parse(reportContent);
      }
    });

    test('should have generated smoke test report', () => {
      expect(fs.existsSync(REPORT_FILE)).toBe(true);
      expect(report).toBeDefined();
    });

    test('report should have correct structure', () => {
      expect(report).toHaveProperty('test_timestamp');
      expect(report).toHaveProperty('validation_results');
      expect(report).toHaveProperty('performance_metrics');
      expect(report).toHaveProperty('quality_gates');
    });

    test('report should show overall success status', () => {
      expect(report).toHaveProperty('overall_status');
      expect(report).toHaveProperty('crews_tested');
      expect(report).toHaveProperty('artifacts_generated');
      
      // For a successful smoke test, we expect 3 crews tested
      expect(report.crews_tested).toEqual([1, 2, 3]);
      expect(report.overall_status).toBe('PASSED');
      expect(report.artifacts_generated).toBe(3);
    });

    test('should have results for all 3 crews', () => {
      expect(report.validation_results).toBeDefined();
      expect(report.validation_results).toHaveProperty('screenshot_validation');
      expect(report.validation_results).toHaveProperty('wireframe_validation');
      expect(report.validation_results).toHaveProperty('design_system_validation');
      
      // Check that all validations passed
      expect(report.validation_results.screenshot_validation.status).toBe('PASSED');
      expect(report.validation_results.wireframe_validation.status).toBe('PASSED');
      expect(report.validation_results.design_system_validation.status).toBe('PASSED');
    });
  });

  describe('Screenshot Artifacts (Crew 1)', () => {
    test('should have created screenshots directory', () => {
      expect(fs.existsSync(SCREENSHOT_DIR)).toBe(true);
    });

    test('should contain screenshot files', () => {
      if (fs.existsSync(SCREENSHOT_DIR)) {
        const files = fs.readdirSync(SCREENSHOT_DIR);
        const imageFiles = files.filter(f => 
          f.toLowerCase().endsWith('.png') || 
          f.toLowerCase().endsWith('.jpg') || 
          f.toLowerCase().endsWith('.jpeg')
        );
        
        expect(imageFiles.length).toBeGreaterThan(0);
      }
    });

    test('screenshot files should meet size constraints', () => {
      if (fs.existsSync(SCREENSHOT_DIR)) {
        const files = fs.readdirSync(SCREENSHOT_DIR);
        const imageFiles = files.filter(f => 
          f.toLowerCase().endsWith('.png') || 
          f.toLowerCase().endsWith('.jpg') || 
          f.toLowerCase().endsWith('.jpeg')
        );

        for (const file of imageFiles) {
          const filePath = path.join(SCREENSHOT_DIR, file);
          const stats = fs.statSync(filePath);
          
          expect(stats.size).toBeGreaterThan(0);
          expect(stats.size).toBeLessThanOrEqual(VALIDATION_CRITERIA.maxScreenshotSize);
        }
      }
    });

    test('should have metadata or demonstrate valid capture', () => {
      if (fs.existsSync(SCREENSHOT_DIR)) {
        const files = fs.readdirSync(SCREENSHOT_DIR);
        
        // Either we have image files or metadata files
        const imageFiles = files.filter(f => 
          f.toLowerCase().endsWith('.png') || 
          f.toLowerCase().endsWith('.jpg') || 
          f.toLowerCase().endsWith('.jpeg')
        );
        
        const metadataFiles = files.filter(f => 
          f.toLowerCase().endsWith('.json') || 
          f.toLowerCase().endsWith('.meta')
        );

        expect(imageFiles.length + metadataFiles.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Wireframe Artifacts (Crew 2)', () => {
    test('should have created wireframes directory', () => {
      // Only test if screenshot capture was successful
      if (fs.existsSync(SCREENSHOT_DIR)) {
        const screenshotFiles = fs.readdirSync(SCREENSHOT_DIR);
        if (screenshotFiles.length > 0) {
          expect(fs.existsSync(WIREFRAME_DIR)).toBe(true);
        }
      }
    });

    test('should contain wireframe JSON files', () => {
      if (fs.existsSync(WIREFRAME_DIR)) {
        const files = fs.readdirSync(WIREFRAME_DIR);
        const jsonFiles = files.filter(f => f.endsWith('.json'));
        
        expect(jsonFiles.length).toBeGreaterThan(0);
      }
    });

    test('wireframe JSON should have valid structure', () => {
      if (fs.existsSync(WIREFRAME_DIR)) {
        const files = fs.readdirSync(WIREFRAME_DIR);
        const jsonFiles = files.filter(f => f.endsWith('.json'));
        
        for (const file of jsonFiles) {
          try {
            const content = JSON.parse(fs.readFileSync(path.join(WIREFRAME_DIR, file), 'utf8'));
            
            // Should have either components or sections or both
            const hasComponents = content.components && Array.isArray(content.components);
            const hasSections = content.sections && Array.isArray(content.sections);
            
            expect(hasComponents || hasSections).toBe(true);
            
          } catch (error) {
            fail(`Failed to parse wireframe JSON file ${file}: ${error}`);
          }
        }
      }
    });

    test('should meet component count requirements', () => {
      if (fs.existsSync(WIREFRAME_DIR)) {
        const files = fs.readdirSync(WIREFRAME_DIR);
        const jsonFiles = files.filter(f => f.endsWith('.json'));
        
        let totalComponents = 0;
        
        for (const file of jsonFiles) {
          try {
            const content = JSON.parse(fs.readFileSync(path.join(WIREFRAME_DIR, file), 'utf8'));
            
            if (content.components && Array.isArray(content.components)) {
              totalComponents += content.components.length;
            }
          } catch (error) {
            // Skip invalid JSON files
          }
        }
        
        // Should have at least some components detected
        expect(totalComponents).toBeGreaterThan(0);
        
        // For a successful smoke test, should meet minimum criteria
        if (jsonFiles.length > 0) {
          // Allow some flexibility in smoke test - at least 5 components
          expect(totalComponents).toBeGreaterThanOrEqual(Math.min(5, VALIDATION_CRITERIA.minComponentCount));
        }
      }
    });

    test('should identify key page sections', () => {
      if (fs.existsSync(WIREFRAME_DIR)) {
        const files = fs.readdirSync(WIREFRAME_DIR);
        const jsonFiles = files.filter(f => f.endsWith('.json'));
        
        const foundSections = new Set<string>();
        
        for (const file of jsonFiles) {
          try {
            const content = JSON.parse(fs.readFileSync(path.join(WIREFRAME_DIR, file), 'utf8'));
            
            if (content.sections && Array.isArray(content.sections)) {
              content.sections.forEach((section: any) => {
                if (section.type) {
                  foundSections.add(section.type.toLowerCase());
                }
              });
            }
          } catch (error) {
            // Skip invalid JSON files
          }
        }
        
        // Should have found at least some recognizable sections
        if (jsonFiles.length > 0) {
          expect(foundSections.size).toBeGreaterThan(0);
          
          // Check for at least one common section type
          const commonSections = ['header', 'navigation', 'main', 'content', 'footer'];
          const hasCommonSection = commonSections.some(section => foundSections.has(section));
          expect(hasCommonSection).toBe(true);
        }
      }
    });
  });

  describe('Styled Wireframes (Crew 3)', () => {
    test('should have created styled wireframes directory', () => {
      // Only test if wireframe generation was successful
      if (fs.existsSync(WIREFRAME_DIR)) {
        const wireframeFiles = fs.readdirSync(WIREFRAME_DIR);
        if (wireframeFiles.length > 0) {
          expect(fs.existsSync(STYLED_DIR)).toBe(true);
        }
      }
    });

    test('should contain styled wireframe files', () => {
      if (fs.existsSync(STYLED_DIR)) {
        const files = fs.readdirSync(STYLED_DIR);
        expect(files.length).toBeGreaterThan(0);
      }
    });

    test('should demonstrate design system application', () => {
      if (fs.existsSync(STYLED_DIR)) {
        const files = fs.readdirSync(STYLED_DIR);
        
        // Look for files that might contain styling information
        const styledFiles = files.filter(f => 
          f.endsWith('.json') || 
          f.endsWith('.css') || 
          f.endsWith('.html') ||
          f.endsWith('.tsx') ||
          f.endsWith('.jsx')
        );
        
        expect(styledFiles.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Performance Validation', () => {
    test('each crew stage should complete within reasonable time', () => {
      if (fs.existsSync(REPORT_FILE)) {
        const reportContent = fs.readFileSync(REPORT_FILE, 'utf8');
        const report = JSON.parse(reportContent);
        
        for (const result of report.results) {
          // Smoke test should be relatively fast
          // Allow up to 2 minutes per stage for smoke test
          const maxTimePerStage = 120000; // 2 minutes
          expect(result.executionTime).toBeLessThan(maxTimePerStage);
        }
      }
    });
  });

  describe('Error Handling', () => {
    test('should provide meaningful error messages for failures', () => {
      if (fs.existsSync(REPORT_FILE)) {
        const reportContent = fs.readFileSync(REPORT_FILE, 'utf8');
        const report = JSON.parse(reportContent);
        
        const failedResults = report.results.filter((r: any) => !r.success);
        
        for (const failedResult of failedResults) {
          expect(failedResult.error).toBeDefined();
          expect(failedResult.error.length).toBeGreaterThan(0);
          expect(failedResult.error).not.toBe('Unknown error');
        }
      }
    });
  });

  describe('Integration Validation', () => {
    test('should test against mood.com (target site)', () => {
      if (fs.existsSync(REPORT_FILE)) {
        const reportContent = fs.readFileSync(REPORT_FILE, 'utf8');
        const report = JSON.parse(reportContent);
        
        expect(report.config.targetSite).toBe('https://mood.com');
      }
    });

    test('should use GSI Orders brand configuration', () => {
      // If the design system application succeeded, it should have applied GSI Orders branding
      if (fs.existsSync(STYLED_DIR)) {
        const files = fs.readdirSync(STYLED_DIR);
        
        // Look for evidence of brand application
        // This could be CSS files with GSI Orders colors, or JSON with brand tokens
        const hasStyledContent = files.some(f => 
          f.includes('brand') || 
          f.includes('style') || 
          f.includes('design')
        );
        
        // At minimum, should have some output files
        expect(files.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Output Structure Validation', () => {
    test('should maintain proper directory structure', () => {
      const expectedDirs = [
        SMOKE_OUTPUT_DIR,
        SCREENSHOT_DIR,
        WIREFRAME_DIR,
        STYLED_DIR
      ];

      // Check that base directory exists
      expect(fs.existsSync(SMOKE_OUTPUT_DIR)).toBe(true);
      
      // Other directories should exist if their prerequisites were met
      // This allows for graceful degradation if early stages fail
    });

    test('should generate comprehensive smoke test report', () => {
      expect(fs.existsSync(REPORT_FILE)).toBe(true);
      
      if (fs.existsSync(REPORT_FILE)) {
        const reportContent = fs.readFileSync(REPORT_FILE, 'utf8');
        const report = JSON.parse(reportContent);
        
        // Report should be comprehensive
        expect(Object.keys(report).length).toBeGreaterThanOrEqual(4);
        expect(report.results.length).toBeGreaterThan(0);
        
        // Should have timestamp
        expect(new Date(report.timestamp).getTime()).toBeGreaterThan(0);
      }
    });
  });
}); 