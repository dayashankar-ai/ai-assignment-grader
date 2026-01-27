#!/usr/bin/env node

/**
 * Test script for AI detection module
 * Run: node test-ai-detection.js
 */

import { detectAI } from './scripts/ai-detector.js';
import fs from 'fs';

// Test cases
const testCases = [
  {
    name: 'Clean Human Code',
    content: `# my homework solution
def add_nums(a, b):
    # just add them
    result = a + b
    return result

# test it
print(add_nums(5, 3))  # should be 8
`,
    expectedRange: '0-30',
    fileType: 'Python code'
  },
  {
    name: 'AI-Generated Code',
    content: `Certainly! I'd be happy to help you with this assignment. Here's a comprehensive solution:

def calculate_sum(first_number: int, second_number: int) -> int:
    """
    Calculate the sum of two integers with robust error handling.
    
    This function takes two numeric inputs and returns their sum,
    ensuring type safety and proper validation.
    
    Args:
        first_number (int): The first numeric value to be summed
        second_number (int): The second numeric value to be summed
        
    Returns:
        int: The sum of the two provided numbers
        
    Raises:
        TypeError: If inputs are not numeric
        ValueError: If inputs are invalid
    """
    try:
        # Validate input types
        if not isinstance(first_number, (int, float)):
            raise TypeError("First parameter must be numeric")
        if not isinstance(second_number, (int, float)):
            raise TypeError("Second parameter must be numeric")
            
        # Perform the calculation
        result = first_number + second_number
        
        # Return the computed sum
        return result
        
    except Exception as e:
        # Handle any unexpected errors gracefully
        print(f"An error occurred: {str(e)}")
        raise

# Example usage demonstrating the function
if __name__ == "__main__":
    print(calculate_sum(5, 3))
`,
    expectedRange: '70-100',
    fileType: 'Python code'
  },
  {
    name: 'Mixed Content',
    content: `# Assignment 1 - Calculator
# by John Doe

def calc(x, y):
    # TODO: add error checking
    return x + y

# Certainly! Here's a comprehensive test suite:
def test_calculator():
    """
    This function provides thorough testing of the calculator functionality,
    ensuring all edge cases are properly handled with appropriate validation.
    """
    assert calc(5, 3) == 8, "Basic addition should work correctly"
    assert calc(-1, 1) == 0, "Negative numbers should be handled appropriately"
    print("All tests passed successfully")

test_calculator()
`,
    expectedRange: '40-70',
    fileType: 'Python code'
  }
];

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║         AI Detection Module - Test Suite                 ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

async function runTests() {
  let passed = 0;
  let failed = 0;
  
  for (const testCase of testCases) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Test: ${testCase.name}`);
    console.log('='.repeat(60));
    
    try {
      const result = await detectAI(testCase.content, testCase.fileType);
      
      console.log(`\n📊 Results:`);
      console.log(`   AI Probability: ${result.aiProbability}%`);
      console.log(`   Confidence: ${result.confidence}`);
      console.log(`   Recommendation: ${result.recommendation}`);
      console.log(`   Status: ${result.aiDetected ? '⚠️  AI Detected' : '✅ Human'}`);
      
      if (result.preDetectionFlags) {
        console.log(`\n⚠️  Pre-detection found ${result.preDetectionFlags.count} obvious AI pattern(s)`);
      }
      
      if (result.flaggedSections && result.flaggedSections.length > 0) {
        console.log(`\n🚩 Flagged Sections (${result.flaggedSections.length}):`);
        result.flaggedSections.forEach(section => {
          console.log(`   Lines ${section.lines}: ${section.reason}`);
        });
      }
      
      if (result.humanElements && result.humanElements.length > 0) {
        console.log(`\n✓ Human Elements (${result.humanElements.length}):`);
        result.humanElements.forEach(element => {
          console.log(`   Lines ${element.lines}: ${element.reason}`);
        });
      }
      
      // Check if result is in expected range
      const [minExpected, maxExpected] = testCase.expectedRange.split('-').map(Number);
      const inRange = result.aiProbability >= minExpected && result.aiProbability <= maxExpected;
      
      if (inRange) {
        console.log(`\n✅ PASS - Result (${result.aiProbability}%) in expected range (${testCase.expectedRange}%)`);
        passed++;
      } else {
        console.log(`\n❌ FAIL - Result (${result.aiProbability}%) outside expected range (${testCase.expectedRange}%)`);
        failed++;
      }
      
    } catch (error) {
      console.error(`\n❌ ERROR: ${error.message}`);
      failed++;
    }
    
    // Add delay between tests to respect rate limits
    if (testCase !== testCases[testCases.length - 1]) {
      console.log('\nWaiting 2 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log(`\n\n${'='.repeat(60)}`);
  console.log('Test Summary');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${testCases.length}`);
  console.log(`Passed: ${passed} ✅`);
  console.log(`Failed: ${failed} ❌`);
  console.log(`Success Rate: ${((passed / testCases.length) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log('\n⚠️  Some tests failed. Review the results above.');
  }
}

// Run tests
runTests().catch(error => {
  console.error('\n❌ Test suite failed:', error.message);
  process.exit(1);
});
