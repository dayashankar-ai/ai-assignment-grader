#!/usr/bin/env node

/**
 * Test suite for AI-adjusted grading module
 * Tests all 5 penalty tiers and edge cases
 */

import { gradeAssignment, loadRubric, calculateAIPenalty } from './scripts/grader.js';
import fs from 'fs';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Test cases
const testCases = [
  {
    name: 'Clean Code (0% AI)',
    submission: `
def calculate_area(radius):
    # My calculation for circle area
    pi = 3.14159
    area = pi * radius * radius
    return area

# Test
print(calculate_area(5))
`,
    aiResult: { aiProbability: 0, confidence: 'high', recommendation: 'PASS' },
    expectedPenalty: 0,
    expectedSeverity: 'none'
  },
  {
    name: 'Acceptable AI Use (15% AI)',
    submission: `
def calculate_area(radius):
    """Calculate the area of a circle"""
    import math
    return math.pi * radius ** 2

# Usage
result = calculate_area(5)
print(f"Area: {result}")
`,
    aiResult: { aiProbability: 15, confidence: 'high', recommendation: 'PASS' },
    expectedPenalty: 0,
    expectedSeverity: 'none'
  },
  {
    name: 'Moderate AI Use (35% AI)',
    submission: `
Certainly! Here's how to calculate circle area:

def calculate_area(radius: float) -> float:
    """Calculate circle area with proper typing"""
    import math
    if radius < 0:
        raise ValueError("Radius must be positive")
    return math.pi * radius ** 2
`,
    aiResult: { aiProbability: 35, confidence: 'medium', recommendation: 'REVIEW' },
    expectedPenalty: -10,
    expectedSeverity: 'low'
  },
  {
    name: 'Heavy AI Dependence (55% AI)',
    submission: `
Certainly! Here's a comprehensive implementation:

def calculate_area(radius: float) -> float:
    """
    Calculate the area of a circle.
    
    Args:
        radius: The radius of the circle
        
    Returns:
        The calculated area
    """
    import math
    if not isinstance(radius, (int, float)):
        raise TypeError("Radius must be numeric")
    return math.pi * radius ** 2
`,
    aiResult: { aiProbability: 55, confidence: 'high', recommendation: 'REVIEW' },
    expectedPenalty: -25,
    expectedSeverity: 'medium'
  },
  {
    name: 'Mostly AI-Generated (72% AI)',
    submission: `
Certainly! I'll help you with that. Here's a comprehensive solution:

def calculate_area(radius: float) -> float:
    """
    Calculate the area of a circle with comprehensive error handling.
    
    Args:
        radius (float): The radius of the circle
        
    Returns:
        float: The calculated area
        
    Raises:
        ValueError: If radius is negative
        TypeError: If radius is not numeric
    """
    import math
    
    if not isinstance(radius, (int, float)):
        raise TypeError(f"Expected numeric type, got {type(radius)}")
    
    if radius < 0:
        raise ValueError("Radius must be non-negative")
        
    return math.pi * radius ** 2
`,
    aiResult: { aiProbability: 72, confidence: 'high', recommendation: 'FAIL' },
    expectedPenalty: -50,
    expectedSeverity: 'high'
  },
  {
    name: 'Academic Integrity Violation (92% AI)',
    submission: `
Certainly! I'll provide you with a comprehensive, production-ready solution:

def calculate_area(radius: float) -> float:
    """
    Calculate the area of a circle with robust error handling and validation.
    
    This function implements the mathematical formula A = πr² where:
    - A is the area
    - π (pi) is the mathematical constant approximately equal to 3.14159
    - r is the radius of the circle
    
    Args:
        radius (float): The radius of the circle in any unit of measurement
        
    Returns:
        float: The calculated area in squared units
        
    Raises:
        ValueError: If the radius is negative or infinite
        TypeError: If the radius is not a numeric type
        
    Examples:
        >>> calculate_area(5)
        78.53981633974483
        >>> calculate_area(0)
        0.0
    """
    import math
    
    # Type validation
    if not isinstance(radius, (int, float)):
        raise TypeError(
            f"Expected numeric type for radius, got {type(radius).__name__}"
        )
    
    # Value validation
    if math.isinf(radius):
        raise ValueError("Radius cannot be infinite")
        
    if radius < 0:
        raise ValueError(
            f"Radius must be non-negative, got {radius}"
        )
    
    # Calculate and return area
    return math.pi * radius ** 2
`,
    aiResult: { aiProbability: 92, confidence: 'very_high', recommendation: 'FAIL' },
    expectedPenalty: -100,
    expectedSeverity: 'critical'
  }
];

// Helper function to print colored output
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test penalty calculation
async function testPenaltyCalculation() {
  log('\n' + '='.repeat(70), 'cyan');
  log('Testing AI Penalty Calculation', 'cyan');
  log('='.repeat(70) + '\n', 'cyan');

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const penaltyInfo = calculateAIPenalty(testCase.aiResult.aiProbability);
    const penaltyMatch = penaltyInfo.penalty === testCase.expectedPenalty;
    const severityMatch = penaltyInfo.severity === testCase.expectedSeverity;
    const success = penaltyMatch && severityMatch;

    if (success) {
      log(`✓ ${testCase.name}`, 'green');
      passed++;
    } else {
      log(`✗ ${testCase.name}`, 'red');
      failed++;
    }

    log(`  AI: ${testCase.aiResult.aiProbability}%`, 'blue');
    log(`  Expected: ${testCase.expectedPenalty} points (${testCase.expectedSeverity})`, 'blue');
    log(`  Got: ${penaltyInfo.penalty} points (${penaltyInfo.severity})`, penaltyMatch && severityMatch ? 'green' : 'red');
    log(`  Description: ${penaltyInfo.description}`, 'yellow');
    log('');
  }

  log('─'.repeat(70), 'cyan');
  log(`Penalty Tests: ${passed} passed, ${failed} failed`, failed === 0 ? 'green' : 'red');
  log('─'.repeat(70) + '\n', 'cyan');

  return { passed, failed };
}

// Test full grading with AI adjustment
async function testFullGrading() {
  log('\n' + '='.repeat(70), 'cyan');
  log('Testing Full AI-Adjusted Grading', 'cyan');
  log('='.repeat(70) + '\n', 'cyan');

  // Check if API key is available
  if (!process.env.ANTHROPIC_API_KEY) {
    log('⚠️  ANTHROPIC_API_KEY not set. Skipping full grading tests.', 'yellow');
    log('   Set API key to test actual LLM grading.', 'yellow');
    return { passed: 0, failed: 0, skipped: testCases.length };
  }

  let passed = 0;
  let failed = 0;

  // Load rubric
  const rubric = loadRubric('1');
  if (!rubric) {
    log('✗ Failed to load rubric', 'red');
    return { passed, failed: 1 };
  }

  // Test first 3 cases (to save API costs)
  for (const testCase of testCases.slice(0, 3)) {
    try {
      log(`Testing: ${testCase.name}...`, 'blue');

      const result = await gradeAssignment(
        testCase.submission,
        rubric,
        testCase.aiResult,
        {
          studentName: 'Test Student',
          rollNumber: 'TEST001'
        }
      );

      // Verify results
      const hasBaseScore = typeof result.baseScore === 'number';
      const hasAIPenalty = typeof result.aiPenalty === 'number';
      const hasFinalScore = typeof result.finalScore === 'number';
      const penaltyCorrect = result.aiPenalty === testCase.expectedPenalty;
      const finalCorrect = result.finalScore === result.baseScore + result.aiPenalty;

      const success = hasBaseScore && hasAIPenalty && hasFinalScore && penaltyCorrect && finalCorrect;

      if (success) {
        log(`✓ ${testCase.name}`, 'green');
        passed++;
      } else {
        log(`✗ ${testCase.name}`, 'red');
        failed++;
      }

      log(`  Base Score: ${result.baseScore}/100`, 'blue');
      log(`  AI Penalty: ${result.aiPenalty} points`, 'yellow');
      log(`  Final Score: ${result.finalScore}/100`, result.finalScore > 70 ? 'green' : 'red');
      log(`  Grade: ${result.gradeLetter}`, 'cyan');
      log('');

    } catch (error) {
      log(`✗ ${testCase.name} - Error: ${error.message}`, 'red');
      failed++;
    }
  }

  log('─'.repeat(70), 'cyan');
  log(`Grading Tests: ${passed} passed, ${failed} failed`, failed === 0 ? 'green' : 'red');
  log('─'.repeat(70) + '\n', 'cyan');

  return { passed, failed };
}

// Test edge cases
async function testEdgeCases() {
  log('\n' + '='.repeat(70), 'cyan');
  log('Testing Edge Cases', 'cyan');
  log('='.repeat(70) + '\n', 'cyan');

  let passed = 0;
  let failed = 0;

  // Test 1: No AI detection result
  try {
    const penalty1 = calculateAIPenalty(null);
    if (penalty1.penalty === 0 && penalty1.severity === 'none') {
      log('✓ No AI detection result → 0 penalty', 'green');
      passed++;
    } else {
      log('✗ No AI detection result should have 0 penalty', 'red');
      failed++;
    }
  } catch (error) {
    log('✗ Error handling null AI detection', 'red');
    failed++;
  }

  // Test 2: Boundary values
  const boundaries = [
    { ai: 0, expected: 0 },
    { ai: 20, expected: 0 },
    { ai: 21, expected: -10 },
    { ai: 40, expected: -10 },
    { ai: 41, expected: -25 },
    { ai: 60, expected: -25 },
    { ai: 61, expected: -50 },
    { ai: 80, expected: -50 },
    { ai: 81, expected: -100 },
    { ai: 100, expected: -100 }
  ];

  for (const { ai, expected } of boundaries) {
    const result = calculateAIPenalty(ai);
    if (result.penalty === expected) {
      log(`✓ ${ai}% AI → ${expected} penalty`, 'green');
      passed++;
    } else {
      log(`✗ ${ai}% AI → Expected ${expected}, got ${result.penalty}`, 'red');
      failed++;
    }
  }

  // Test 3: Invalid values
  try {
    const penalty2 = calculateAIPenalty(-5);
    if (penalty2.penalty === 0) {
      log('✓ Negative AI% handled correctly', 'green');
      passed++;
    } else {
      log('✗ Negative AI% should default to 0 penalty', 'red');
      failed++;
    }
  } catch (error) {
    log('✗ Error handling negative AI%', 'red');
    failed++;
  }

  try {
    const penalty3 = calculateAIPenalty(150);
    if (penalty3.penalty === -100) {
      log('✓ >100% AI handled correctly (capped at 100)', 'green');
      passed++;
    } else {
      log('✗ >100% AI should cap at maximum penalty', 'red');
      failed++;
    }
  } catch (error) {
    log('✗ Error handling >100% AI', 'red');
    failed++;
  }

  log('\n' + '─'.repeat(70), 'cyan');
  log(`Edge Case Tests: ${passed} passed, ${failed} failed`, failed === 0 ? 'green' : 'red');
  log('─'.repeat(70) + '\n', 'cyan');

  return { passed, failed };
}

// Test output format
async function testOutputFormat() {
  log('\n' + '='.repeat(70), 'cyan');
  log('Testing Output Format', 'cyan');
  log('='.repeat(70) + '\n', 'cyan');

  if (!process.env.ANTHROPIC_API_KEY) {
    log('⚠️  ANTHROPIC_API_KEY not set. Skipping output format tests.', 'yellow');
    return { passed: 0, failed: 0, skipped: 1 };
  }

  let passed = 0;
  let failed = 0;

  try {
    const rubric = loadRubric('1');
    const result = await gradeAssignment(
      testCases[0].submission,
      rubric,
      testCases[0].aiResult,
      {
        studentName: 'Test Student',
        rollNumber: 'TEST001',
        batch: 'CSE-A',
        year: '2024'
      }
    );

    // Check required fields
    const requiredFields = [
      'baseScore',
      'aiPenalty',
      'finalScore',
      'gradeLetter',
      'aiUsagePercent',
      'criteria',
      'overallFeedback',
      'strengths',
      'improvements',
      'technicalAssessment',
      'learningEvidence',
      'timestamp',
      'model',
      'studentInfo'
    ];

    for (const field of requiredFields) {
      if (result[field] !== undefined) {
        log(`✓ Has ${field}`, 'green');
        passed++;
      } else {
        log(`✗ Missing ${field}`, 'red');
        failed++;
      }
    }

    // Check technical assessment structure
    if (result.technicalAssessment) {
      const techFields = ['correctness', 'codeQuality', 'conceptUnderstanding', 'completeness'];
      for (const field of techFields) {
        if (result.technicalAssessment[field]) {
          log(`✓ Has technicalAssessment.${field}`, 'green');
          passed++;
        } else {
          log(`✗ Missing technicalAssessment.${field}`, 'red');
          failed++;
        }
      }
    }

    // Check student info
    if (result.studentInfo && result.studentInfo.studentName === 'Test Student') {
      log('✓ Student info preserved', 'green');
      passed++;
    } else {
      log('✗ Student info not preserved', 'red');
      failed++;
    }

  } catch (error) {
    log(`✗ Error testing output format: ${error.message}`, 'red');
    failed++;
  }

  log('\n' + '─'.repeat(70), 'cyan');
  log(`Format Tests: ${passed} passed, ${failed} failed`, failed === 0 ? 'green' : 'red');
  log('─'.repeat(70) + '\n', 'cyan');

  return { passed, failed };
}

// Main test runner
async function runAllTests() {
  log('\n╔═══════════════════════════════════════════════════════════════════╗', 'cyan');
  log('║           AI-ADJUSTED GRADING MODULE TEST SUITE                 ║', 'cyan');
  log('╚═══════════════════════════════════════════════════════════════════╝', 'cyan');

  const results = {
    penalty: await testPenaltyCalculation(),
    edgeCases: await testEdgeCases(),
    grading: await testFullGrading(),
    format: await testOutputFormat()
  };

  // Summary
  const totalPassed = Object.values(results).reduce((sum, r) => sum + r.passed, 0);
  const totalFailed = Object.values(results).reduce((sum, r) => sum + r.failed, 0);
  const totalSkipped = Object.values(results).reduce((sum, r) => sum + (r.skipped || 0), 0);

  log('\n' + '╔═══════════════════════════════════════════════════════════════════╗', 'cyan');
  log('║                         FINAL RESULTS                             ║', 'cyan');
  log('╚═══════════════════════════════════════════════════════════════════╝\n', 'cyan');

  log(`Total Tests: ${totalPassed + totalFailed}`, 'blue');
  log(`Passed: ${totalPassed}`, 'green');
  log(`Failed: ${totalFailed}`, totalFailed === 0 ? 'green' : 'red');
  if (totalSkipped > 0) {
    log(`Skipped: ${totalSkipped}`, 'yellow');
  }

  const passRate = totalPassed + totalFailed > 0
    ? ((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)
    : 0;
  log(`\nPass Rate: ${passRate}%`, passRate >= 90 ? 'green' : passRate >= 70 ? 'yellow' : 'red');

  if (totalFailed === 0) {
    log('\n✓ ALL TESTS PASSED!', 'green');
  } else {
    log(`\n✗ ${totalFailed} TEST(S) FAILED`, 'red');
  }

  log('\n' + '═'.repeat(70) + '\n', 'cyan');

  // Exit with error code if tests failed
  process.exit(totalFailed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  log(`\nFATAL ERROR: ${error.message}`, 'red');
  log(error.stack, 'red');
  process.exit(1);
});
