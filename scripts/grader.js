import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// AI Usage Penalty System
const AI_PENALTY_TIERS = [
  { min: 0, max: 20, penalty: 0, description: 'Acceptable AI assistance' },
  { min: 21, max: 40, penalty: -10, description: 'Moderate AI use - minor penalty' },
  { min: 41, max: 60, penalty: -25, description: 'Heavy AI dependence - significant penalty' },
  { min: 61, max: 80, penalty: -50, description: 'Mostly AI-generated - major penalty' },
  { min: 81, max: 100, penalty: -100, description: 'Entirely AI-generated - academic integrity violation' }
];

/**
 * Calculate AI penalty based on AI detection percentage
 * @param {number} aiPercentage - AI detection percentage (0-100)
 * @returns {Object} Penalty information
 */
function calculateAIPenalty(aiPercentage) {
  const tier = AI_PENALTY_TIERS.find(t => aiPercentage >= t.min && aiPercentage <= t.max);
  
  if (!tier) {
    return { penalty: 0, description: 'No AI detected', severity: 'none' };
  }
  
  let severity = 'none';
  if (aiPercentage > 80) severity = 'critical';
  else if (aiPercentage > 60) severity = 'high';
  else if (aiPercentage > 40) severity = 'medium';
  else if (aiPercentage > 20) severity = 'low';
  
  return {
    penalty: tier.penalty,
    description: tier.description,
    severity: severity,
    requiresReview: aiPercentage > 60
  };
}

/**
 * Load rubric for a specific practical
 * @param {string} practicalNumber - The practical number (1-7)
 * @returns {Object} Rubric data
 */
function loadRubric(practicalNumber) {
  const rubricPath = path.join(process.cwd(), 'rubrics', `practical_${practicalNumber}.json`);
  
  if (!fs.existsSync(rubricPath)) {
    throw new Error(`Rubric not found: ${rubricPath}`);
  }
  
  return JSON.parse(fs.readFileSync(rubricPath, 'utf-8'));
}

/**
 * Grade assignment using Claude API and rubric with AI detection awareness
 * @param {string} submissionText - The submission to grade
 * @param {Object} rubric - The grading rubric
 * @param {Object} aiDetectionResult - AI detection results (optional)
 * @param {Object} studentInfo - Student information (optional)
 * @returns {Promise<Object>} Grading results
 */
async function gradeAssignment(submissionText, rubric, aiDetectionResult = null, studentInfo = {}) {
  try {
    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not found in environment variables');
    }
    
    const criteriaText = rubric.criteria.map((c, i) => 
      `${i + 1}. ${c.name} (${c.points} points): ${c.description}`
    ).join('\n');

    // Build AI context if available
    let aiContext = '';
    if (aiDetectionResult) {
      const aiPercent = aiDetectionResult.aiProbability || 0;
      aiContext = `\n\nAI DETECTION ANALYSIS:
- AI Probability: ${aiPercent}%
- Recommendation: ${aiDetectionResult.recommendation || 'N/A'}`;
      
      if (aiDetectionResult.flaggedSections && aiDetectionResult.flaggedSections.length > 0) {
        aiContext += '\n- Flagged Sections:\n';
        aiDetectionResult.flaggedSections.forEach(section => {
          aiContext += `  * Lines ${section.lines}: ${section.reason}\n`;
        });
      }
      
      if (aiDetectionResult.humanElements && aiDetectionResult.humanElements.length > 0) {
        aiContext += '- Human Elements Found:\n';
        aiDetectionResult.humanElements.forEach(element => {
          aiContext += `  * Lines ${element.lines}: ${element.reason}\n`;
        });
      }
      
      aiContext += `\nNote: Grade the base quality of the work. AI penalties will be applied separately.`;
    }

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      temperature: 0,
      system: `You are an expert instructor and LLM-judge grading student assignments. You provide fair, constructive, and detailed feedback based on grading rubrics.

When AI detection results are provided:
- Focus on grading the actual quality and correctness of the work
- Note if AI-generated sections show lack of understanding
- Identify whether the student demonstrates learning
- Consider if the work meets the learning objectives
- DO NOT apply AI penalties yourself - grade the work objectively

Provide specific, actionable feedback that helps students improve.`,
      messages: [
        {
          role: 'user',
          content: `Grade this student assignment using the provided rubric.

ASSIGNMENT: ${rubric.title}
DESCRI// Try to extract JSON if wrapped in markdown code blocks
      let jsonText = responseText;
      const jsonMatch = responseText.match(/`{3}json\s*([\s\S]*?)\s*`{3}/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }
      
      result = JSON.parse(jsonText);
      
      // Validate and ensure required fields
      if (typeof result.totalScore !== 'number') {
        result.totalScore = 0;
      }
      
      result.criteria = result.criteria || rubric.criteria.map(c => ({
        name: c.name,
        score: 0,
        maxScore: c.points,
        feedback: 'Unable to grade'
      }));
      
      result.strengths = result.strengths || [];
      result.improvements = result.improvements || [];
      result.gradeLetter = result.gradeLetter || 'F';
      
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.error('Raw response:', responseText);
      
      // Fallback result
      result = {
        totalScore: 0,
        criteria: rubric.criteria.map(c => ({
          name: c.name,
          score: 0,
          maxScore: c.points,
          feedback: 'Error grading this criterion',
          strengths: '',
          improvements: ''
        })),
        overallFeedback: 'Grading error occurred. Manual review required.',
        strengths: [],
        improvements: ['Manual grading required'],
        gradeLetter: 'F',
        technicalAssessment: {
          correctness: 'Unable to assess',
          codeQuality: 'Unable to assess',
          conceptUnderstanding: 'Unable to assess',
          completeness: 'Unable to assess'
        },
   Format grading results for display
 * @param {Object} result - Grading result
 * @returns {string} Formatted output
 */
function formatGradingResults(result) {
  let output = '\n';
  output += '═══════════════════════════════════════════════════════════\n';
  output += '              ASSIGNMENT GRADING RESULTS\n';
  output += '═══════════════════════════════════════════════════════════\n\n';
  
  // Student info if available
  if (result.studentInfo) {
    output += `Student: ${result.studentInfo.studentName || 'N/A'}\n`;
    if (result.studentInfo.rollNumber) output += `Roll Number: ${result.studentInfo.rollNumber}\n`;
    if (result.studentInfo.batch) output += `Batch: ${result.studentInfo.batch}\n`;
    if (result.studentInfo.year) output += `Year: ${result.studentInfo.year}\n`;
    output += '\n';
  }
  
  output += `Assignment: ${result.practicalTitle || 'N/A'}\n`;
  output += `Practical Number: ${result.practicalNumber || 'N/A'}\n\n`;
  
  // Scoring breakdown
  output += '─────────────────────────────────────────────────────────\n';
  output += 'SCORING BREAKDOWN\n';
  output += '─────────────────────────────────────────────────────────\n';
  output += `Base Score:       ${result.baseScore || result.totalScore}/100\n`;
  
  if (result.aiPenalty !== undefined && result.aiPenalty !== 0) {
    output += `AI Penalty:       ${result.aiPenalty} points\n`;
    output += `Final Score:      ${result.finalScore}/100\n`;
  } else {
    output += `Final Score:      ${result.finalScore || result.totalScore}/100\n`;
  }
  
  output += `Grade Letter:     ${result.gradeLetter || 'N/A'}\n\n`;
  
  // AI Usage information
  if (result.aiUsagePercent) {
    output += '─────────────────────────────────────────────────────────\n';
    output += 'AI USAGE ANALYSIS\n';
    output += '─────────────────────────────────────────────────────────\n';
    output += `AI Content:       ${result.aiUsagePercent}%\n`;
    
    if (result.aiPenaltyInfo) {
      output += `Severity:         ${result.aiPenaltyInfo.severity.toUpperCase()}\n`;
      output += `Description:      ${result.aiPenaltyInfo.description}\n`;
      if (result.aiPenaltyInfo.requiresReview) {
        output += `⚠️ REQUIRES REVIEW: This submission needs instructor attention\n`;
      }
    }
    
    if (result.aiUsageNotes) {
      output += `\n${result.aiUsageNotes}\n`;
    }
    output += '\n';
  }
  
  // Criteria breakdown
  output += '─────────────────────────────────────────────────────────\n';
  output += 'CRITERIA BREAKDOWN\n';
  output += '─────────────────────────────────────────────────────────\n';
  
  if (result.criteria) {
    result.criteria.forEach(criterion => {
      output += `\n${criterion.name}: ${criterion.score}/${criterion.maxScore}\n`;
      output += `  ${criterion.feedback}\n`;
      if (criterion.strengths) {
        output += `  ✓ Strengths: ${criterion.strengths}\n`;
      }
      if (criterion.improvements) {
        output += `  ⚠ Improvements: ${criterion.improvements}\n`;
      }
    });
  }
  
  // Overall feedback
  output += '\n─────────────────────────────────────────────────────────\n';
  output += 'OVERALL FEEDBACK\n';
  output += '─────────────────────────────────────────────────────────\n';
  output += result.overallFeedback + '\n';
  
  // Strengths
  if (result.strengths && result.strengths.length > 0) {
    output += '\n✓ STRENGTHS:\n';
    result.strengths.forEach(strength => {
      output += `  • ${strength}\n`;
    });
  }
  
  // Improvements
  if (result.improvements && result.improvements.length > 0) {
    output += '\n⚠ AREAS FOR IMPROVEMENT:\n';
    result.improvements.forEach(improvement => {
      output += `  • ${improvement}\n`;
    });
  }
  
  // Technical assessment
  if (result.technicalAssessment) {
    output += '\n─────────────────────────────────────────────────────────\n';
    output += 'TECHNICAL ASSESSMENT\n';
    output += '─────────────────────────────────────────────────────────\n';
    Object.entries(result.technicalAssessment).forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').trim();
      output += `${label}: ${value}\n`;
    });
  }
  
  // Learning evidence
  if (result.learningEvidence) {
    output += '\nLearning Evidence:\n';
    output += `  ${result.learningEvidence}\n`;
  }
  
  output += '\n═══════════════════════════════════════════════════════════\n';
  
  return output;
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: node grader.js <file-path> <practical-number> [ai-result-file]');
    console.error('\nExamples:');
    console.error('  node grader.js submission.py 1');
    console.error('  node grader.js submission.py 1 ai-result.json');
    process.exit(1);
  }

  const filePath = args[0];
  const practicalNumber = args[1];
  const aiResultFile = args[2] || 'ai-result.json';
  
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  const submissionText = fs.readFileSync(filePath, 'utf-8');
  
  if (submissionText.trim().length < 10) {
    console.error('Error: Submission is too short to grade (minimum 10 characters)');
    process.exit(1);
  }

  console.error(`Loading rubric for Practical ${practicalNumber}...`);
  const rubric = loadRubric(practicalNumber);
  
  // Load AI detection results if available
  let aiDetectionResult = null;
  if (fs.existsSync(aiResultFile)) {
    try {
      aiDetectionResult = JSON.parse(fs.readFileSync(aiResultFile, 'utf-8'));
      console.error(`AI detection results loaded (${aiDetectionResult.aiProbability}% AI probability)`);
    } catch (error) {
      console.error(`Warning: Could not load AI detection results: ${error.message}`);
    }
  } else {
    console.error('No AI detection results found. Grading without AI penalty adjustment.');
  }
  
  // Extract student info from environment or args (for GitHub Actions)
  const studentInfo = {
    studentName: process.env.STUDENT_NAME || null,
    rollNumber: process.env.STUDENT_ID || null,
    batch: process.env.STUDENT_BATCH || null,
    year: process.env.STUDENT_YEAR || null
  };
  
  console.error('Grading assignment with LLM-judge...');
  console.error('This may take 5-10 seconds...\n');
  
  const result = await gradeAssignment(submissionText, rubric, aiDetectionResult, studentInfo);
  
  // Ensure grade letter is calculated
  if (!result.gradeLetter) {
    result.gradeLetter = calculateGradeLetter(result.finalScore || result.totalScore, rubric.totalPoints);
  }
  
  // Output JSON to stdout for GitHub Actions
  console.log(JSON.stringify(result, null, 2));
  
  // Also save to file for reference
  const resultPath = path.join(process.cwd(), 'grading-result.json');
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
  
  // Display formatted results to stderr
  console.error(formatGradingResults(result));
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  });
}

export { gradeAssignment, loadRubric, calculateGradeLetter, calculateAIPenalty, AI_PENALTY_TIERS
  } catch (error) {
    // Handle specific error types
    if (error.status === 429) {
      console.error('Rate limit exceeded. Please wait before retrying.');
      throw new Error('Rate limit exceeded. Please try again in a few moments.');
    } else if (error.status === 401) {
      console.error('Invalid API key.');
      throw new Error('Invalid API key. Please check your ANTHROPIC_API_KEY environment variable.');
    } else if (error.message.includes('ANTHROPIC_API_KEY')) {
      throw error;
    }
    : "comprehensive feedback about the submission quality",
  "strengths": ["list of overall strengths"],
  "improvements": ["list of areas for improvement"],
  "gradeLetter": "A/B/C/D/F",
  "technicalAssessment": {
    "correctness": "assessment of solution correctness",
    "codeQuality": "assessment of code quality (if applicable)",
    "conceptUnderstanding": "evidence of concept understanding",
    "completeness": "how complete the solution is"
  },
  "learningEvidence": "evidence that student learned the concepts vs just used AI"
}

Consider:
- Correctness and functionality
- Code quality and organization (if applicable)
- Understanding of concepts demonstrated
- Completeness and following instructions
- Originality and personal problem-solving approach

Respond ONLY with valid JSON, no additional text.`
        }
      ]
    });

    const responseText = message.content[0].text;
    
    // Parse JSON response
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      // Fallback result
      result = {
        totalScore: 0,
        criteria: rubric.criteria.map(c => ({
          name: c.name,
          score: 0,
          maxScore: c.points,
          feedback: 'Error grading this criterion'
        })),
        overallFeedback: 'Grading error occurred. Manual review required.',
        strengths: [],
        improvements: ['Manual grading required'],
        gradeLetter: 'F'
      };
    }

    return {
      ...result,
      timestamp: new Date().toISOString(),
      model: 'claude-3-5-sonnet-20241022',
      practicalNumber: rubric.practicalNumber,
      practicalTitle: rubric.title
    };

  } catch (error) {
    console.error('Error in grading:', error);
    throw error;
  }
}

/**
 * Calculate grade letter based on percentage
 * @param {number} score - The score received
 * @param {number} maxScore - The maximum possible score
 * @returns {string} Grade letter
 */
function calculateGradeLetter(score, maxScore) {
  const percentage = (score / maxScore) * 100;
  
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: node grader.js <file-path> <practical-number>');
    process.exit(1);
  }

  const filePath = args[0];
  const practicalNumber = args[1];
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const submissionText = fs.readFileSync(filePath, 'utf-8');
  
  if (submissionText.trim().length < 10) {
    console.error('Submission is too short to grade');
    process.exit(1);
  }

  console.error(`Loading rubric for Practical ${practicalNumber}...`);
  const rubric = loadRubric(practicalNumber);
  
  console.error('Grading assignment...');
  const result = await gradeAssignment(submissionText, rubric);
  
  // Ensure grade letter is calculated
  if (!result.gradeLetter) {
    result.gradeLetter = calculateGradeLetter(result.totalScore, rubric.totalPoints);
  }
  
  // Output JSON to stdout for GitHub Actions
  console.log(JSON.stringify(result, null, 2));
  
  // Also save to file for reference
  const resultPath = path.join(process.cwd(), 'grading-result.json');
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
  
  console.error(`\n✓ Grading complete`);
  console.error(`  - Score: ${result.totalScore}/${rubric.totalPoints} (${result.gradeLetter})`);
  console.error(`  - Grade Letter: ${result.gradeLetter}`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { gradeAssignment, loadRubric, calculateGradeLetter };
