/**
 * CrewAI Integration Utility for gsiorders.com
 * 
 * This utility provides a bridge between Next.js and CrewAI Python service.
 * It handles communication with the CrewAI service running on a separate port.
 */

import * as fs from 'fs';
import * as path from 'path';

// Validation criteria interfaces
interface ValidationCriteria {
  screenshotCriteria: {
    minResolution: { width: number; height: number };
    maxFileSize: number; // in bytes
    expectedFormats: string[];
  };
  wireframeCriteria: {
    minComponentCount: number;
    minSectionCount: number;
    accuracyThreshold: number; // 0-1
    requiredSections: string[];
  };
  performanceBudgets: {
    screenshotCapture: number; // max time in ms
    wireframeGeneration: number;
    designApplication: number;
  };
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  metrics?: Record<string, any>;
}

interface FallbackStrategy {
  type: 'retry' | 'degrade' | 'manual';
  maxRetries?: number;
  degradationOptions?: Record<string, any>;
  manualInstructions?: string;
}

interface CrewConfig {
  apiKey?: string;
  serviceUrl?: string;
  timeout?: number;
}

interface CrewTask {
  description: string;
  expectedOutput?: string;
  agent?: string;
}

interface CrewAgent {
  role: string;
  goal: string;
  backstory: string;
  tools?: string[];
}

interface CrewRunRequest {
  agents: CrewAgent[];
  tasks: CrewTask[];
  inputs?: Record<string, any>;
  process?: 'sequential' | 'hierarchical';
}

interface CrewRunResponse {
  success: boolean;
  result?: any;
  error?: string;
  executionTime?: number;
  validation?: Record<string, any>;
}

// Pipeline-specific interfaces for design-to-code workflow
export interface ScreenshotCaptureRequest {
  targetSite: string;
  routes: string[];
  outputDir: string;
  viewport?: { width: number; height: number };
  waitTime?: number;
}

export interface WireframeGenerationRequest {
  screenshotDir: string;
  outputDir: string;
  detectionMode: 'bounding-box' | 'semantic' | 'hybrid';
}

export interface DesignSystemApplication {
  wireframeDir: string;
  outputDir: string;
  brandConfig: {
    colors: Record<string, string>;
    typography: string[];
    spacing: Record<string, string>;
    components: Record<string, any>;
  };
}

export interface ComponentAnnotationRequest {
  styledWireframeDir: string;
  outputDir: string;
  componentLibrary: 'shadcn' | 'custom' | 'headless';
}

export interface RoutingMapRequest {
  annotationDir: string;
  outputFile: string;
  framework: 'nextjs' | 'react' | 'nuxt';
}

export interface MicrotaskGenerationRequest {
  annotationDir: string;
  routingMap: string;
  outputDir: string;
  taskGranularity: 'nano' | 'micro' | 'macro';
}

export interface BacklogManagementRequest {
  microtaskDir: string;
  outputFile: string;
  estimationModel: 'fibonacci' | 'tshirt' | 'hours';
  priorityWeights: {
    business: number;
    technical: number;
    dependencies: number;
  };
}

export interface VisualRegressionRequest {
  baselineDir: string;
  currentUrl: string;
  outputDir: string;
  threshold: number;
}

export class CrewClient {
  private config: CrewConfig;
  private validationCriteria: ValidationCriteria;

  constructor(config: CrewConfig = {}) {
    this.config = {
      apiKey: config.apiKey || process.env.CREWAI_API_KEY,
      serviceUrl: config.serviceUrl || process.env.CREWAI_SERVICE_URL || 'http://localhost:8001',
      timeout: config.timeout || 30000, // 30 seconds default
      ...config
    };

    // Default validation criteria
    this.validationCriteria = {
      screenshotCriteria: {
        minResolution: { width: 1920, height: 1080 },
        maxFileSize: 2 * 1024 * 1024, // 2MB
        expectedFormats: ['png', 'jpg', 'jpeg']
      },
      wireframeCriteria: {
        minComponentCount: 15,
        minSectionCount: 5,
        accuracyThreshold: 0.9,
        requiredSections: ['header', 'hero', 'products', 'footer']
      },
      performanceBudgets: {
        screenshotCapture: 10000, // 10s
        wireframeGeneration: 30000, // 30s
        designApplication: 15000 // 15s
      }
    };
  }

  /**
   * Run a CrewAI workflow with specified agents and tasks
   */
  async run(request: CrewRunRequest): Promise<CrewRunResponse> {
    try {
      const response = await fetch(`${this.config.serviceUrl}/api/crew/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(this.config.timeout!),
      });

      if (!response.ok) {
        throw new Error(`CrewAI API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('CrewAI API call failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Check if CrewAI service is healthy and responding
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.serviceUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout for health check
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * List available tools from CrewAI service
   */
  async listTools(): Promise<string[]> {
    try {
      const response = await fetch(`${this.config.serviceUrl}/api/crew/tools`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tools: ${response.statusText}`);
      }

      const data = await response.json();
      return data.tools || [];
    } catch (error) {
      console.error('Failed to fetch CrewAI tools:', error);
      return [];
    }
  }

  /**
   * Validate screenshot output against criteria
   */
  private async validateScreenshots(outputDir: string): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const metrics: Record<string, any> = {};

    try {
      if (!fs.existsSync(outputDir)) {
        errors.push(`Output directory ${outputDir} does not exist`);
        return { isValid: false, errors, warnings, metrics };
      }

      const files = fs.readdirSync(outputDir).filter(f => 
        this.validationCriteria.screenshotCriteria.expectedFormats.some(format => 
          f.toLowerCase().endsWith(`.${format}`)
        )
      );

      if (files.length === 0) {
        errors.push('No screenshot files found');
        return { isValid: false, errors, warnings, metrics };
      }

      let validScreenshots = 0;
      for (const file of files) {
        const filePath = path.join(outputDir, file);
        const stats = fs.statSync(filePath);
        
        // Check file size
        if (stats.size > this.validationCriteria.screenshotCriteria.maxFileSize) {
          errors.push(`Screenshot ${file} exceeds size limit: ${stats.size} bytes`);
          continue;
        }

        // For actual image dimension checking, we'd need image processing library
        // For now, we'll validate basic file properties
        validScreenshots++;
      }

      metrics.totalScreenshots = files.length;
      metrics.validScreenshots = validScreenshots;
      metrics.avgFileSize = files.reduce((sum, f) => 
        sum + fs.statSync(path.join(outputDir, f)).size, 0) / files.length;

      if (validScreenshots === 0) {
        errors.push('No valid screenshots meet criteria');
        return { isValid: false, errors, warnings, metrics };
      }

      return { isValid: true, errors, warnings, metrics };
    } catch (error) {
      errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { isValid: false, errors, warnings, metrics };
    }
  }

  /**
   * Validate wireframe output against criteria
   */
  private async validateWireframes(outputDir: string): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const metrics: Record<string, any> = {};

    try {
      if (!fs.existsSync(outputDir)) {
        errors.push(`Output directory ${outputDir} does not exist`);
        return { isValid: false, errors, warnings, metrics };
      }

      const jsonFiles = fs.readdirSync(outputDir).filter(f => f.endsWith('.json'));
      
      if (jsonFiles.length === 0) {
        errors.push('No wireframe JSON files found');
        return { isValid: false, errors, warnings, metrics };
      }

      let totalComponents = 0;
      let totalSections = 0;
      const foundSections = new Set<string>();

      for (const file of jsonFiles) {
        try {
          const content = JSON.parse(fs.readFileSync(path.join(outputDir, file), 'utf8'));
          
          if (content.components) {
            totalComponents += Array.isArray(content.components) ? content.components.length : 0;
          }
          
          if (content.sections) {
            const sections = Array.isArray(content.sections) ? content.sections : [];
            totalSections += sections.length;
            sections.forEach((section: any) => {
              if (section.type) foundSections.add(section.type.toLowerCase());
            });
          }
        } catch (parseError) {
          warnings.push(`Failed to parse wireframe file ${file}`);
        }
      }

      // Check component count
      if (totalComponents < this.validationCriteria.wireframeCriteria.minComponentCount) {
        errors.push(`Insufficient components: ${totalComponents} < ${this.validationCriteria.wireframeCriteria.minComponentCount}`);
      }

      // Check section count
      if (totalSections < this.validationCriteria.wireframeCriteria.minSectionCount) {
        errors.push(`Insufficient sections: ${totalSections} < ${this.validationCriteria.wireframeCriteria.minSectionCount}`);
      }

      // Check required sections
      const missingRequiredSections = this.validationCriteria.wireframeCriteria.requiredSections
        .filter(section => !foundSections.has(section));
      
      if (missingRequiredSections.length > 0) {
        warnings.push(`Missing recommended sections: ${missingRequiredSections.join(', ')}`);
      }

      metrics.totalComponents = totalComponents;
      metrics.totalSections = totalSections;
      metrics.foundSections = Array.from(foundSections);
      metrics.accuracy = foundSections.size / this.validationCriteria.wireframeCriteria.requiredSections.length;

      return { 
        isValid: errors.length === 0, 
        errors, 
        warnings, 
        metrics 
      };
    } catch (error) {
      errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { isValid: false, errors, warnings, metrics };
    }
  }

  /**
   * Apply fallback strategy when validation fails
   */
  private async applyFallback(
    strategy: FallbackStrategy, 
    originalRequest: any, 
    originalMethod: () => Promise<CrewRunResponse>
  ): Promise<CrewRunResponse> {
    switch (strategy.type) {
      case 'retry':
        const maxRetries = strategy.maxRetries || 2;
        for (let i = 0; i < maxRetries; i++) {
          console.log(`🔄 Applying fallback: retry attempt ${i + 1}/${maxRetries}`);
          const result = await originalMethod();
          if (result.success) return result;
        }
        return {
          success: false,
          error: `Failed after ${maxRetries} retry attempts`
        };

      case 'degrade':
        console.log('⬇️ Applying fallback: degraded quality mode');
        // Modify request for lower quality/faster execution
        const degradedRequest = {
          ...originalRequest,
          ...strategy.degradationOptions
        };
        return originalMethod();

      case 'manual':
        console.log('👤 Fallback requires manual intervention:');
        console.log(strategy.manualInstructions);
        return {
          success: false,
          error: 'Manual intervention required',
          result: { manualInstructions: strategy.manualInstructions }
        };

      default:
        return {
          success: false,
          error: 'Unknown fallback strategy'
        };
    }
  }

  /**
   * CREW 1: Screenshot Capture Pipeline (Enhanced with Validation)
   */
  async captureScreenshots(request: ScreenshotCaptureRequest): Promise<CrewRunResponse> {
    const startTime = Date.now();
    
    const executeCapture = async (): Promise<CrewRunResponse> => {
      const task: CrewTask = {
        description: `Crawl ${request.targetSite} and capture high-quality screenshots of all routes`,
        expectedOutput: `Screenshots saved to ${request.outputDir} with metadata JSON`,
        agent: 'screenshot_crawler'
      };

      const agents: CrewAgent[] = [
        {
          role: 'Web Crawler & Screenshot Specialist',
          goal: 'Capture pixel-perfect screenshots of web pages for design analysis',
          backstory: 'Expert in web automation, screenshot capture, and visual documentation with 10+ years experience',
          tools: ['playwright', 'puppeteer', 'visual_testing']
        }
      ];

      return this.run({
        agents,
        tasks: [task],
        inputs: {
          target_site: request.targetSite,
          routes: request.routes,
          output_directory: request.outputDir,
          viewport: request.viewport || { width: 1920, height: 1080 },
          wait_time: request.waitTime || 3000,
          capture_settings: {
            full_page: true,
            quality: 'high',
            format: 'png',
            device_scaling: 1
          }
        }
      });
    };

    try {
      // Execute screenshot capture
      const result = await executeCapture();
      
      // Performance check
      const executionTime = Date.now() - startTime;
      if (executionTime > this.validationCriteria.performanceBudgets.screenshotCapture) {
        console.warn(`⚠️ Screenshot capture exceeded performance budget: ${executionTime}ms`);
      }

      if (!result.success) {
        // Apply retry fallback
        return this.applyFallback(
          { type: 'retry', maxRetries: 2 },
          request,
          executeCapture
        );
      }

      // Validate output
      const validation = await this.validateScreenshots(request.outputDir);
      
      if (!validation.isValid) {
        console.error('❌ Screenshot validation failed:', validation.errors);
        
        // Apply degraded quality fallback
        return this.applyFallback(
          { 
            type: 'degrade',
            degradationOptions: {
              capture_settings: {
                quality: 'medium',
                format: 'jpg',
                compression: 0.8
              }
            }
          },
          request,
          executeCapture
        );
      }

      console.log('✅ Screenshot capture validation passed');
      return {
        ...result,
        validation: validation.metrics
      };

    } catch (error) {
      return {
        success: false,
        error: `Screenshot capture failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * CREW 2: Wireframe Generation Pipeline (Enhanced with Validation)
   */
  async generateWireframes(request: WireframeGenerationRequest): Promise<CrewRunResponse> {
    const startTime = Date.now();

    const executeWireframeGeneration = async (): Promise<CrewRunResponse> => {
      const task: CrewTask = {
        description: 'Analyze screenshots and generate abstract wireframe representations using bounding-box detection',
        expectedOutput: 'Wireframe JSON files with component boundaries, layout structure, and semantic annotations',
        agent: 'wireframe_analyst'
      };

      const agents: CrewAgent[] = [
        {
          role: 'UI/UX Analysis & Wireframe Specialist',
          goal: 'Convert visual designs into structured wireframe representations',
          backstory: 'Senior UX architect with expertise in design systems, component analysis, and visual hierarchy',
          tools: ['computer_vision', 'layout_detection', 'semantic_analysis']
        }
      ];

      return this.run({
        agents,
        tasks: [task],
        inputs: {
          screenshot_directory: request.screenshotDir,
          output_directory: request.outputDir,
          detection_mode: request.detectionMode,
          analysis_depth: 'comprehensive',
          component_types: [
            'header', 'navigation', 'hero', 'product_grid', 'product_card',
            'sidebar', 'footer', 'form', 'button', 'image', 'text_block'
          ]
        }
      });
    };

    try {
      // Execute wireframe generation
      const result = await executeWireframeGeneration();
      
      // Performance check
      const executionTime = Date.now() - startTime;
      if (executionTime > this.validationCriteria.performanceBudgets.wireframeGeneration) {
        console.warn(`⚠️ Wireframe generation exceeded performance budget: ${executionTime}ms`);
      }

      if (!result.success) {
        // Apply retry fallback
        return this.applyFallback(
          { type: 'retry', maxRetries: 2 },
          request,
          executeWireframeGeneration
        );
      }

      // Validate output
      const validation = await this.validateWireframes(request.outputDir);
      
      if (!validation.isValid) {
        console.error('❌ Wireframe validation failed:', validation.errors);
        
        // Apply manual fallback for complex analysis issues
        return this.applyFallback(
          {
            type: 'manual',
            manualInstructions: `Wireframe detection failed. Manual steps required:
1. Review screenshots in ${request.screenshotDir}
2. Manually identify at least ${this.validationCriteria.wireframeCriteria.minComponentCount} components
3. Create wireframe JSON with sections: ${this.validationCriteria.wireframeCriteria.requiredSections.join(', ')}
4. Save to ${request.outputDir}/manual-wireframe.json`
          },
          request,
          executeWireframeGeneration
        );
      }

      console.log('✅ Wireframe generation validation passed');
      return {
        ...result,
        validation: validation.metrics
      };

    } catch (error) {
      return {
        success: false,
        error: `Wireframe generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * CREW 3: Design System Application Pipeline (Enhanced with Validation)
   */
  async applyDesignSystem(request: DesignSystemApplication): Promise<CrewRunResponse> {
    const startTime = Date.now();

    const executeDesignApplication = async (): Promise<CrewRunResponse> => {
      const task: CrewTask = {
        description: 'Apply brand design system (colors, typography, spacing) to wireframe structures',
        expectedOutput: 'Styled wireframes with complete design system integration and Tailwind CSS classes',
        agent: 'design_system_specialist'
      };

      const agents: CrewAgent[] = [
        {
          role: 'Design System & Brand Specialist',
          goal: 'Transform wireframes into brand-consistent styled designs',
          backstory: 'Expert design system architect with deep knowledge of Tailwind CSS, brand consistency, and component styling',
          tools: ['design_tokens', 'tailwind_generator', 'brand_analysis']
        }
      ];

      return this.run({
        agents,
        tasks: [task],
        inputs: {
          wireframe_directory: request.wireframeDir,
          output_directory: request.outputDir,
          brand_config: request.brandConfig,
          design_tokens: {
            colors: request.brandConfig.colors,
            typography: request.brandConfig.typography,
            spacing: request.brandConfig.spacing,
            shadows: 'material',
            radius: 'modern'
          }
        }
      });
    };

    try {
      // Execute design system application
      const result = await executeDesignApplication();
      
      // Performance check
      const executionTime = Date.now() - startTime;
      if (executionTime > this.validationCriteria.performanceBudgets.designApplication) {
        console.warn(`⚠️ Design application exceeded performance budget: ${executionTime}ms`);
      }

      if (!result.success) {
        // Apply retry fallback
        return this.applyFallback(
          { type: 'retry', maxRetries: 2 },
          request,
          executeDesignApplication
        );
      }

      // Basic validation - check if output files exist
      if (!fs.existsSync(request.outputDir)) {
        console.error('❌ Design system application validation failed: Output directory missing');
        
        return this.applyFallback(
          {
            type: 'manual',
            manualInstructions: `Design system application failed. Manual steps required:
1. Review wireframes in ${request.wireframeDir}
2. Apply GSI Orders brand colors manually
3. Generate Tailwind CSS classes for components
4. Save styled wireframes to ${request.outputDir}`
          },
          request,
          executeDesignApplication
        );
      }

      console.log('✅ Design system application validation passed');
      return {
        ...result,
        validation: { outputDirectory: request.outputDir, executionTime }
      };

    } catch (error) {
      return {
        success: false,
        error: `Design system application failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * CREW 4: Component Annotation Pipeline
   * Annotates styled wireframes with React component structure
   */
  async annotateComponents(request: ComponentAnnotationRequest): Promise<CrewRunResponse> {
    const task: CrewTask = {
      description: 'Annotate styled wireframes with React component structure, props, and architectural patterns',
      expectedOutput: 'Component annotation files with TypeScript interfaces, props definitions, and component hierarchy',
      agent: 'component_architect'
    };

    const agents: CrewAgent[] = [
      {
        role: 'React Architecture & Component Specialist',
        goal: 'Design optimal React component structure for complex UI patterns',
        backstory: 'Senior React architect with 8+ years building scalable component systems and design patterns',
        tools: ['react_analysis', 'typescript_generation', 'component_patterns']
      }
    ];

    return this.run({
      agents,
      tasks: [task],
      inputs: {
        styled_wireframe_directory: request.styledWireframeDir,
        output_directory: request.outputDir,
        component_library: request.componentLibrary,
        architecture_patterns: [
          'compound_components', 'render_props', 'custom_hooks',
          'context_providers', 'atomic_design'
        ],
        typescript_config: {
          strict: true,
          interfaces: true,
          generics: true
        }
      }
    });
  }

  /**
   * CREW 5: Next.js Routing Pipeline
   * Defines routing structure and navigation flow
   */
  async buildRouteMap(request: RoutingMapRequest): Promise<CrewRunResponse> {
    const task: CrewTask = {
      description: 'Design Next.js routing structure, navigation flow, and page architecture',
      expectedOutput: 'Complete routing configuration with page skeletons, navigation maps, and link definitions',
      agent: 'routing_specialist'
    };

    const agents: CrewAgent[] = [
      {
        role: 'Next.js Routing & Navigation Specialist',
        goal: 'Create optimal routing architecture for modern web applications',
        backstory: 'Full-stack developer specializing in Next.js, routing patterns, and navigation UX',
        tools: ['nextjs_router', 'navigation_analysis', 'seo_optimization']
      }
    ];

    return this.run({
      agents,
      tasks: [task],
      inputs: {
        annotation_directory: request.annotationDir,
        output_file: request.outputFile,
        framework: request.framework,
        routing_features: [
          'dynamic_routes', 'nested_layouts', 'middleware',
          'api_routes', 'ssg', 'ssr', 'isr'
        ],
        navigation_patterns: {
          header_nav: true,
          breadcrumbs: true,
          pagination: true,
          search: true
        }
      }
    });
  }

  /**
   * CREW 6: Microtask Generation Pipeline
   * Generates detailed Cursor AI prompts and microtasks
   */
  async generateMicrotasks(request: MicrotaskGenerationRequest): Promise<CrewRunResponse> {
    const task: CrewTask = {
      description: 'Generate comprehensive Cursor AI prompts and microtasks for implementation',
      expectedOutput: 'Structured microtask files with implementation instructions, acceptance criteria, and time estimates',
      agent: 'task_generator'
    };

    const agents: CrewAgent[] = [
      {
        role: 'Development Task & Prompt Engineering Specialist',
        goal: 'Break down complex features into actionable development tasks',
        backstory: 'Senior technical project manager with expertise in agile development, task breakdown, and AI prompt engineering',
        tools: ['task_decomposition', 'prompt_engineering', 'estimation']
      }
    ];

    return this.run({
      agents,
      tasks: [task],
      inputs: {
        annotation_directory: request.annotationDir,
        routing_map: request.routingMap,
        output_directory: request.outputDir,
        task_granularity: request.taskGranularity,
        task_templates: {
          component_creation: 'Create React component with TypeScript, tests, and documentation',
          api_endpoint: 'Implement API endpoint with validation, error handling, and tests',
          page_implementation: 'Build Next.js page with SEO, responsive design, and accessibility',
          integration: 'Integrate components with data layer and state management'
        }
      }
    });
  }

  /**
   * CREW 7: Backlog Management Pipeline
   * Assembles prioritized backlog with time estimates
   */
  async manageBacklog(request: BacklogManagementRequest): Promise<CrewRunResponse> {
    const task: CrewTask = {
      description: 'Organize microtasks into prioritized backlog with dependencies and time estimates',
      expectedOutput: 'Prioritized backlog with dependency graph, sprint planning, and Git workflow templates',
      agent: 'backlog_manager'
    };

    const agents: CrewAgent[] = [
      {
        role: 'Agile Project Management & Planning Specialist',
        goal: 'Optimize development workflow and sprint planning for maximum efficiency',
        backstory: 'Experienced scrum master and technical project manager with expertise in backlog optimization',
        tools: ['dependency_analysis', 'sprint_planning', 'git_workflow']
      }
    ];

    return this.run({
      agents,
      tasks: [task],
      inputs: {
        microtask_directory: request.microtaskDir,
        output_file: request.outputFile,
        estimation_model: request.estimationModel,
        priority_weights: request.priorityWeights,
        planning_config: {
          sprint_length: 2, // weeks
          team_capacity: 40, // hours per sprint
          buffer_percentage: 20,
          dependencies: true
        }
      }
    });
  }

  /**
   * CREW 8: Visual Regression Testing Pipeline
   * Runs automated visual tests against original screenshots
   */
  async runVisualRegression(request: VisualRegressionRequest): Promise<CrewRunResponse> {
    const task: CrewTask = {
      description: 'Compare implemented pages against original design screenshots for visual fidelity',
      expectedOutput: 'Visual regression report with diff images, similarity scores, and improvement recommendations',
      agent: 'qa_specialist'
    };

    const agents: CrewAgent[] = [
      {
        role: 'QA & Visual Testing Specialist',
        goal: 'Ensure pixel-perfect implementation fidelity through comprehensive visual testing',
        backstory: 'Senior QA engineer specializing in visual regression testing, automated testing, and quality assurance',
        tools: ['visual_diff', 'percy', 'chromatic', 'image_comparison']
      }
    ];

    return this.run({
      agents,
      tasks: [task],
      inputs: {
        baseline_directory: request.baselineDir,
        current_url: request.currentUrl,
        output_directory: request.outputDir,
        comparison_settings: {
          threshold: request.threshold,
          ignore_regions: ['timestamp', 'dynamic_content'],
          breakpoints: ['mobile', 'tablet', 'desktop'],
          browsers: ['chrome', 'firefox', 'safari']
        }
      }
    });
  }

  /**
   * PIPELINE ORCHESTRATOR: End-to-End Design-to-Code Automation
   * Orchestrates all 8 crews in sequence for complete mood.com → gsiorders.com workflow
   */
  async runDesignToCodePipeline(options: {
    targetSite: string;
    outputBaseDir: string;
    brandConfig: DesignSystemApplication['brandConfig'];
    skipSteps?: number[];
    parallelism?: boolean;
  }): Promise<{
    success: boolean;
    results: Record<string, CrewRunResponse>;
    timings: Record<string, number>;
    errors: string[];
  }> {
    const results: Record<string, CrewRunResponse> = {};
    const timings: Record<string, number> = {};
    const errors: string[] = [];
    
    console.log('🚀 Starting Design-to-Code Pipeline...');
    
    try {
      // STEP 1: Screenshot Capture
      if (!options.skipSteps?.includes(1)) {
        console.log('📷 CREW 1: Capturing Screenshots...');
        const startTime = Date.now();
        
        // Discover routes (simplified - in production would use sitemap crawler)
        const routes = [
          '/',
          '/shop',
          '/products',
          '/product/example',
          '/cart',
          '/checkout',
          '/about',
          '/contact'
        ];

        results.screenshots = await this.captureScreenshots({
          targetSite: options.targetSite,
          routes,
          outputDir: `${options.outputBaseDir}/screenshots`,
          viewport: { width: 1920, height: 1080 },
          waitTime: 3000
        });
        
        timings.screenshots = Date.now() - startTime;
        
        if (!results.screenshots.success) {
          errors.push('Screenshot capture failed');
          return { success: false, results, timings, errors };
        }
      }

      // STEP 2: Wireframe Generation
      if (!options.skipSteps?.includes(2)) {
        console.log('🎨 CREW 2: Generating Wireframes...');
        const startTime = Date.now();
        
        results.wireframes = await this.generateWireframes({
          screenshotDir: `${options.outputBaseDir}/screenshots`,
          outputDir: `${options.outputBaseDir}/wireframes`,
          detectionMode: 'hybrid'
        });
        
        timings.wireframes = Date.now() - startTime;
        
        if (!results.wireframes.success) {
          errors.push('Wireframe generation failed');
          return { success: false, results, timings, errors };
        }
      }

      // STEP 3: Design System Application
      if (!options.skipSteps?.includes(3)) {
        console.log('🎨 CREW 3: Applying Design System...');
        const startTime = Date.now();
        
        results.designSystem = await this.applyDesignSystem({
          wireframeDir: `${options.outputBaseDir}/wireframes`,
          outputDir: `${options.outputBaseDir}/styled`,
          brandConfig: options.brandConfig
        });
        
        timings.designSystem = Date.now() - startTime;
        
        if (!results.designSystem.success) {
          errors.push('Design system application failed');
          return { success: false, results, timings, errors };
        }
      }

      // STEPS 4-5: Component Annotation & Routing (can run in parallel)
      if (options.parallelism && !options.skipSteps?.includes(4) && !options.skipSteps?.includes(5)) {
        console.log('⚡ CREWS 4-5: Running Component Annotation & Routing in Parallel...');
        const startTime = Date.now();
        
        const [componentResults, routingResults] = await Promise.all([
          this.annotateComponents({
            styledWireframeDir: `${options.outputBaseDir}/styled`,
            outputDir: `${options.outputBaseDir}/annotations`,
            componentLibrary: 'shadcn'
          }),
          this.buildRouteMap({
            annotationDir: `${options.outputBaseDir}/styled`,
            outputFile: `${options.outputBaseDir}/routing.json`,
            framework: 'nextjs'
          })
        ]);
        
        results.components = componentResults;
        results.routing = routingResults;
        timings.componentsAndRouting = Date.now() - startTime;
        
        if (!componentResults.success || !routingResults.success) {
          errors.push('Component annotation or routing failed');
          return { success: false, results, timings, errors };
        }
      } else {
        // Sequential execution
        if (!options.skipSteps?.includes(4)) {
          console.log('🧩 CREW 4: Annotating Components...');
          const startTime = Date.now();
          
          results.components = await this.annotateComponents({
            styledWireframeDir: `${options.outputBaseDir}/styled`,
            outputDir: `${options.outputBaseDir}/annotations`,
            componentLibrary: 'shadcn'
          });
          
          timings.components = Date.now() - startTime;
          
          if (!results.components.success) {
            errors.push('Component annotation failed');
            return { success: false, results, timings, errors };
          }
        }

        if (!options.skipSteps?.includes(5)) {
          console.log('🗺️ CREW 5: Building Route Map...');
          const startTime = Date.now();
          
          results.routing = await this.buildRouteMap({
            annotationDir: `${options.outputBaseDir}/annotations`,
            outputFile: `${options.outputBaseDir}/routing.json`,
            framework: 'nextjs'
          });
          
          timings.routing = Date.now() - startTime;
          
          if (!results.routing.success) {
            errors.push('Route mapping failed');
            return { success: false, results, timings, errors };
          }
        }
      }

      // STEP 6: Microtask Generation
      if (!options.skipSteps?.includes(6)) {
        console.log('📋 CREW 6: Generating Microtasks...');
        const startTime = Date.now();
        
        results.microtasks = await this.generateMicrotasks({
          annotationDir: `${options.outputBaseDir}/annotations`,
          routingMap: `${options.outputBaseDir}/routing.json`,
          outputDir: `${options.outputBaseDir}/cursor_tasks`,
          taskGranularity: 'micro'
        });
        
        timings.microtasks = Date.now() - startTime;
        
        if (!results.microtasks.success) {
          errors.push('Microtask generation failed');
          return { success: false, results, timings, errors };
        }
      }

      // STEP 7: Backlog Management
      if (!options.skipSteps?.includes(7)) {
        console.log('📊 CREW 7: Managing Backlog...');
        const startTime = Date.now();
        
        results.backlog = await this.manageBacklog({
          microtaskDir: `${options.outputBaseDir}/cursor_tasks`,
          outputFile: `${options.outputBaseDir}/backlog.json`,
          estimationModel: 'fibonacci',
          priorityWeights: {
            business: 0.4,
            technical: 0.3,
            dependencies: 0.3
          }
        });
        
        timings.backlog = Date.now() - startTime;
        
        if (!results.backlog.success) {
          errors.push('Backlog management failed');
          return { success: false, results, timings, errors };
        }
      }

      // STEP 8: Visual Regression (runs after implementation)
      if (!options.skipSteps?.includes(8)) {
        console.log('🔍 CREW 8: Visual Regression Testing...');
        const startTime = Date.now();
        
        results.visualRegression = await this.runVisualRegression({
          baselineDir: `${options.outputBaseDir}/screenshots`,
          currentUrl: 'http://localhost:3000', // Development server
          outputDir: `${options.outputBaseDir}/visual_tests`,
          threshold: 0.05 // 5% difference tolerance
        });
        
        timings.visualRegression = Date.now() - startTime;
        
        if (!results.visualRegression.success) {
          errors.push('Visual regression testing failed');
        }
      }

      const totalTime = Object.values(timings).reduce((sum, time) => sum + time, 0);
      
      console.log('✅ Design-to-Code Pipeline Complete!');
      console.log(`⏱️ Total Execution Time: ${totalTime / 1000}s`);
      console.log('📊 Step Timings:', timings);

      return {
        success: errors.length === 0,
        results,
        timings,
        errors
      };

    } catch (error) {
      console.error('❌ Pipeline Error:', error);
      errors.push(`Pipeline execution failed: ${error.message}`);
      return { success: false, results, timings, errors };
    }
  }

  /**
   * UTILITY: Get Brand Configuration for gsiorders.com
   * Returns the brand configuration with Tailwind theme integration
   */
  static getGSIOrdersBrandConfig(): DesignSystemApplication['brandConfig'] {
    return {
      colors: {
        'brand-primary': '#10b981', // Emerald-500 (Liquid Heaven)
        'brand-secondary': '#ec4899', // Pink-500 (Motaquila)
        'brand-accent': '#6366f1', // Indigo-500 (Last Genie)
        'brand-success': '#22c55e',
        'brand-warning': '#f59e0b',
        'brand-error': '#ef4444',
        'neutral-50': '#f9fafb',
        'neutral-100': '#f3f4f6',
        'neutral-900': '#111827'
      },
      typography: [
        'Inter', // Primary font
        'DM Sans', // Secondary font
        'system-ui',
        'sans-serif'
      ],
      spacing: {
        'xs': '0.5rem',   // 8px
        'sm': '0.75rem',  // 12px
        'md': '1rem',     // 16px
        'lg': '1.5rem',   // 24px
        'xl': '2rem',     // 32px
        '2xl': '3rem',    // 48px
        '3xl': '4rem'     // 64px
      },
      components: {
        borderRadius: {
          'sm': '0.375rem',  // 6px
          'md': '0.5rem',    // 8px
          'lg': '0.75rem',   // 12px
          'xl': '1rem'       // 16px
        },
        shadows: {
          'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1)'
        }
      }
    };
  }
}

// Default export for convenient import
export const crew = new CrewClient();

// Predefined workflows for common gsiorders.com use cases
export const crewWorkflows = {
  
  /**
   * Order Processing Workflow
   * Handles complex order validation, inventory checks, and processing
   */
  orderProcessing: async (orderData: any): Promise<CrewRunResponse> => {
    const agents: CrewAgent[] = [
      {
        role: "Order Validator",
        goal: "Validate order details and ensure all required information is present",
        backstory: "You are an experienced order processing specialist who ensures accuracy and completeness of customer orders.",
        tools: ["order_validation", "inventory_check"]
      },
      {
        role: "Inventory Manager",
        goal: "Check product availability and reserve inventory for valid orders",
        backstory: "You manage inventory levels and ensure accurate stock allocation for orders.",
        tools: ["inventory_management", "stock_reservation"]
      },
      {
        role: "Payment Processor",
        goal: "Process payments securely and handle payment-related tasks",
        backstory: "You specialize in secure payment processing and fraud detection.",
        tools: ["payment_processing", "fraud_detection"]
      }
    ];

    const tasks: CrewTask[] = [
      {
        description: "Validate the incoming order data for completeness and accuracy",
        expectedOutput: "Order validation report with any issues identified",
        agent: "Order Validator"
      },
      {
        description: "Check inventory availability for all ordered items",
        expectedOutput: "Inventory status report with availability confirmation",
        agent: "Inventory Manager"
      },
      {
        description: "Process payment for the validated order",
        expectedOutput: "Payment processing result with transaction details",
        agent: "Payment Processor"
      }
    ];

    return crew.run({
      agents,
      tasks,
      inputs: { orderData },
      process: 'sequential'
    });
  },

  /**
   * Inventory Prediction Workflow
   * Analyzes sales patterns and predicts inventory needs
   */
  inventoryPrediction: async (historicalData: any): Promise<CrewRunResponse> => {
    const agents: CrewAgent[] = [
      {
        role: "Data Analyst",
        goal: "Analyze historical sales data to identify patterns and trends",
        backstory: "You are a data scientist specializing in retail analytics and demand forecasting.",
        tools: ["data_analysis", "trend_identification"]
      },
      {
        role: "Demand Forecaster",
        goal: "Predict future demand based on analyzed patterns",
        backstory: "You create accurate demand forecasts using machine learning and statistical models.",
        tools: ["demand_forecasting", "ml_prediction"]
      },
      {
        role: "Inventory Planner",
        goal: "Create optimal inventory replenishment recommendations",
        backstory: "You optimize inventory levels to minimize costs while avoiding stockouts.",
        tools: ["inventory_optimization", "replenishment_planning"]
      }
    ];

    const tasks: CrewTask[] = [
      {
        description: "Analyze historical sales data to identify trends and patterns",
        expectedOutput: "Comprehensive analysis report with identified trends",
        agent: "Data Analyst"
      },
      {
        description: "Generate demand forecasts for the next 30, 60, and 90 days",
        expectedOutput: "Demand forecast report with confidence intervals",
        agent: "Demand Forecaster"
      },
      {
        description: "Create inventory replenishment recommendations based on forecasts",
        expectedOutput: "Detailed replenishment plan with timing and quantities",
        agent: "Inventory Planner"
      }
    ];

    return crew.run({
      agents,
      tasks,
      inputs: { historicalData },
      process: 'sequential'
    });
  },

  /**
   * Customer Service Workflow
   * Handles complex customer inquiries and support tasks
   */
  customerService: async (inquiry: any): Promise<CrewRunResponse> => {
    const agents: CrewAgent[] = [
      {
        role: "Customer Service Representative",
        goal: "Understand customer needs and provide appropriate assistance",
        backstory: "You are an experienced customer service specialist with deep product knowledge.",
        tools: ["customer_lookup", "order_history", "product_catalog"]
      },
      {
        role: "Technical Support Specialist",
        goal: "Resolve technical issues and provide product guidance",
        backstory: "You specialize in technical support for CBD and wellness products.",
        tools: ["technical_troubleshooting", "product_specifications"]
      }
    ];

    const tasks: CrewTask[] = [
      {
        description: "Analyze customer inquiry and determine the type of assistance needed",
        expectedOutput: "Customer inquiry analysis with recommended actions",
        agent: "Customer Service Representative"
      },
      {
        description: "Provide detailed resolution or escalate to appropriate specialist",
        expectedOutput: "Complete resolution plan or escalation recommendation",
        agent: "Technical Support Specialist"
      }
    ];

    return crew.run({
      agents,
      tasks,
      inputs: { inquiry },
      process: 'sequential'
    });
  }
}; 