#!/usr/bin/env ts-node

/**
 * Microtask Generation Script
 * 
 * Generates Cursor AI microtasks from mood.com design analysis
 * This is Crew 6 (Task Generator) from the 8-crew architecture
 * 
 * Usage:
 *   npm run design-pipeline:microtasks
 *   npm run design-pipeline:microtasks -- --site=https://mood.com --granularity=micro
 */

import { CrewClient } from '../src/utils/crew';
import * as fs from 'fs';
import * as path from 'path';

interface MicrotaskOptions {
  site: string;
  pages: string[];
  outputDir: string;
  granularity: 'nano' | 'micro' | 'macro';
  useExistingArtifacts: boolean;
}

async function generateMicrotasks(options: MicrotaskOptions) {
  console.log('🎯 Starting Microtask Generation for gsiorders.com');
  console.log('📋 Configuration:', {
    targetSite: options.site,
    pages: options.pages,
    outputDir: options.outputDir,
    granularity: options.granularity
  });

  // Initialize CrewAI client
  const crew = new CrewClient({
    apiKey: process.env.CREWAI_API_KEY,
    serviceUrl: process.env.CREWAI_SERVICE_URL || 'http://localhost:8001',
    timeout: 60000 // 1 minute for microtask generation
  });

  // Check if we should use existing smoke test artifacts
  const baseDir = options.useExistingArtifacts ? 'smoke-test-output' : 'design_output';
  
  // Ensure output directory exists
  const outputDir = path.resolve(options.outputDir);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    console.log('🔍 Checking CrewAI service health...');
    
    // For development, use mock service if real service unavailable
    let useRealService = false; // Default to mock for development
    try {
      await crew.healthCheck();
      console.log('✅ CrewAI service is healthy');
      useRealService = true;
    } catch (error) {
      console.log('⚠️ CrewAI service not available, using mock generation');
      console.log('💡 This is expected for development - mock microtasks will be generated');
    }

    const startTime = Date.now();

    if (useRealService) {
      // Try real CrewAI service first
      console.log('📋 CREW 6: Generating Microtasks with CrewAI...');
      
      try {
        const result = await crew.generateMicrotasks({
          annotationDir: `${baseDir}/annotations`,
          routingMap: `${baseDir}/routing.json`,
          outputDir,
          taskGranularity: options.granularity
        });

        if (!result.success) {
          throw new Error(`Microtask generation failed: ${result.error}`);
        }

        console.log('✅ Microtasks generated successfully via CrewAI');
      } catch (error) {
        console.log('⚠️ CrewAI service call failed, falling back to mock generation');
        console.log('📋 Generating mock microtasks for development...');
        await generateMockMicrotasks(options.site, outputDir, options.granularity);
        console.log('✅ Mock microtasks generated successfully');
      }
    } else {
      // Generate mock microtasks for development
      console.log('📋 Generating mock microtasks for development...');
      await generateMockMicrotasks(options.site, outputDir, options.granularity);
      console.log('✅ Mock microtasks generated successfully');
    }

    // Generate backlog.json
    const backlogFile = path.join(outputDir, 'backlog.json');
    await generateBacklog(outputDir, backlogFile, options.granularity);

    const totalTime = Date.now() - startTime;
    
    console.log('\n🎉 Microtask Generation Complete!');
    console.log(`⏱️ Total Time: ${(totalTime / 1000).toFixed(1)}s`);
    console.log(`📁 Output Directory: ${outputDir}`);
    console.log(`📋 Backlog File: ${backlogFile}`);
    
    // Show next steps
    console.log('\n🚀 Next Steps for Cursor AI:');
    console.log('1. Load the backlog.json file');
    console.log('2. For each microtask:');
    console.log('   - Create branch: feat/<component-name>');
    console.log('   - Generate component with TypeScript interfaces');
    console.log('   - Add Jest/RTL test stub');
    console.log('   - Commit & open PR');
    console.log('\n📖 Example Cursor command:');
    console.log(`   Read ${backlogFile} and implement first 3 high-priority tasks`);

  } catch (error) {
    console.error('❌ Microtask generation failed:', error);
    process.exit(1);
  }
}

async function generateMockMicrotasks(site: string, outputDir: string, granularity: string) {
  // Mock microtasks based on mood.com design patterns
  const microtasks = [
    {
      id: 'navbar-01',
      title: 'Implement Professional Cannabis Navigation Bar',
      priority: 'high',
      component: 'Navbar',
      estimatedHours: 3,
      description: 'Create a professional navigation bar inspired by mood.com with logo, main navigation, cart icon, and user account dropdown',
      acceptanceCriteria: [
        'Logo displays correctly with brand colors',
        'Navigation menu includes: Shop, Learn, About, Contact',
        'Cart icon shows item count and opens cart modal',
        'User account dropdown with login/register options',
        'Mobile responsive with hamburger menu',
        'Sticky navigation on scroll'
      ],
      technicalRequirements: [
        'Use Next.js Link components for navigation',
        'Implement cart state with useCart hook',
        'Add shadcn/ui components for dropdowns',
        'Responsive design with Tailwind CSS',
        'TypeScript interfaces for all props'
      ],
      files: [
        'src/components/Navbar.tsx',
        '__tests__/components/Navbar.test.tsx'
      ],
      dependencies: ['useCart hook', 'brand theming CSS'],
      branch: 'feat/navbar-implementation'
    },
    {
      id: 'hero-01', 
      title: 'Implement mood.com-style Hero Section',
      priority: 'high',
      component: 'HeroSection',
      estimatedHours: 4,
      description: 'Create compelling hero section with large typography, legal messaging, and dual CTA strategy like mood.com',
      acceptanceCriteria: [
        'Large impact typography with gradient effects',
        'Legal compliance messaging ("100% Federally Legal")',
        'Trust indicators (lab tested, FDA compliant)',
        'Dual CTA buttons (Shop Now + Learn More)',
        'Background with subtle animations',
        'Mobile responsive layout'
      ],
      technicalRequirements: [
        'CSS gradients for text effects',
        'Framer Motion for animations',
        'shadcn/ui Button components',
        'Responsive typography scaling',
        'GSI Orders brand integration'
      ],
      files: [
        'src/components/HeroSection.tsx',
        '__tests__/components/HeroSection.test.tsx'
      ],
      dependencies: ['brand CSS variables', 'Button components'],
      branch: 'feat/hero-section'
    },
    {
      id: 'product-grid-01',
      title: 'Implement Enhanced Product Grid',
      priority: 'high',
      component: 'ProductGrid',
      estimatedHours: 5,
      description: 'Create mood.com-style product grid with enhanced ProductCard components, filtering, and pagination',
      acceptanceCriteria: [
        'Responsive grid layout (1-4 columns)',
        'Enhanced ProductCard with hover effects',
        'Quick view and quick add functionality',
        'Product filtering by category/brand',
        'Pagination with load more button',
        'Loading skeleton states'
      ],
      technicalRequirements: [
        'Enhanced ProductCard component',
        'State management for filters',
        'API integration for product data',
        'Intersection Observer for lazy loading',
        'TypeScript interfaces for products'
      ],
      files: [
        'src/components/ProductGrid.tsx',
        'src/components/ProductCard.tsx',
        '__tests__/components/ProductGrid.test.tsx'
      ],
      dependencies: ['ProductCard component', 'products API'],
      branch: 'feat/product-grid'
    },
    {
      id: 'cart-modal-01',
      title: 'Implement Professional Cart Modal',
      priority: 'medium',
      component: 'CartModal',
      estimatedHours: 4,
      description: 'Create slide-out cart modal with quantity controls, shipping calculator, and checkout flow',
      acceptanceCriteria: [
        'Slide-out drawer animation',
        'Cart items with quantity controls',
        'Shipping calculator with ZIP input',
        'Promo code functionality',
        'Age verification integration',
        'Smooth mobile experience'
      ],
      technicalRequirements: [
        'shadcn/ui Dialog components',
        'Cart state management',
        'Form validation for shipping',
        'Checkout flow integration',
        'Mobile-optimized layout'
      ],
      files: [
        'src/components/CartModal.tsx',
        '__tests__/components/CartModal.test.tsx'
      ],
      dependencies: ['useCart hook', 'checkout API'],
      branch: 'feat/cart-modal'
    },
    {
      id: 'footer-01',
      title: 'Implement Comprehensive Footer',
      priority: 'low',
      component: 'Footer',
      estimatedHours: 2,
      description: 'Create comprehensive footer with links, legal info, and brand information',
      acceptanceCriteria: [
        'Organized link sections',
        'Legal compliance links',
        'Social media icons',
        'Newsletter signup',
        'Brand information',
        'Mobile responsive'
      ],
      technicalRequirements: [
        'Next.js Link components',
        'Email validation for newsletter',
        'Social media icon integration',
        'Responsive column layout'
      ],
      files: [
        'src/components/Footer.tsx',
        '__tests__/components/Footer.test.tsx'
      ],
      dependencies: ['brand theming'],
      branch: 'feat/footer'
    }
  ];

  // Adjust task complexity based on granularity
  if (granularity === 'nano') {
    // Break down into smaller tasks
    microtasks.forEach(task => {
      task.estimatedHours = Math.max(1, Math.floor(task.estimatedHours / 2));
    });
  } else if (granularity === 'macro') {
    // Combine related tasks
    microtasks.forEach(task => {
      task.estimatedHours = task.estimatedHours * 1.5;
    });
  }

  // Save microtasks
  for (const task of microtasks) {
    const taskFile = path.join(outputDir, `${task.id}.json`);
    fs.writeFileSync(taskFile, JSON.stringify(task, null, 2));
  }

  console.log(`📋 Generated ${microtasks.length} microtasks in ${outputDir}`);
  return microtasks;
}

async function generateBacklog(microtaskDir: string, backlogFile: string, granularity: string) {
  // Read all microtask files
  const files = fs.readdirSync(microtaskDir).filter(f => f.endsWith('.json') && f !== 'backlog.json');
  const microtasks = files.map(file => {
    const content = fs.readFileSync(path.join(microtaskDir, file), 'utf8');
    return JSON.parse(content);
  });

  // Sort by priority and dependencies
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  microtasks.sort((a, b) => {
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Sort by dependencies (fewer dependencies first)
    return (a.dependencies?.length || 0) - (b.dependencies?.length || 0);
  });

  const backlog = {
    metadata: {
      generated: new Date().toISOString(),
      granularity,
      totalTasks: microtasks.length,
      estimatedHours: microtasks.reduce((sum, task) => sum + task.estimatedHours, 0)
    },
    summary: {
      highPriority: microtasks.filter(t => t.priority === 'high').length,
      mediumPriority: microtasks.filter(t => t.priority === 'medium').length,
      lowPriority: microtasks.filter(t => t.priority === 'low').length
    },
    tasks: microtasks
  };

  fs.writeFileSync(backlogFile, JSON.stringify(backlog, null, 2));
  console.log(`📋 Generated backlog with ${microtasks.length} prioritized tasks`);
}

async function main() {
  const args = process.argv.slice(2);
  
  const options: MicrotaskOptions = {
    site: 'https://mood.com',
    pages: ['/'],
    outputDir: './design_output/cursor_tasks',
    granularity: 'micro',
    useExistingArtifacts: true
  };

  // Parse command line arguments
  for (const arg of args) {
    if (arg.startsWith('--site=')) {
      options.site = arg.split('=')[1];
    } else if (arg.startsWith('--pages=')) {
      options.pages = arg.split('=')[1].split(',');
    } else if (arg.startsWith('--output=')) {
      options.outputDir = arg.split('=')[1];
    } else if (arg.startsWith('--granularity=')) {
      options.granularity = arg.split('=')[1] as 'nano' | 'micro' | 'macro';
    }
  }

  await generateMicrotasks(options);
}

if (require.main === module) {
  main().catch(console.error);
} 