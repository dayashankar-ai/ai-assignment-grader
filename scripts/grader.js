import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function extractStudentInfo(text) {
  const info = {
    studentName: '',
    studentId: '',
    studentEmail: '',
    batch: '',
    practical: ''
  };
  
  const lines = text.split('\n').slice(0, 20);
  
  for (const line of lines) {
    const upper = line.toUpperCase();
    if (upper.includes('STUDENT_NAME:') || upper.includes('NAME:')) {
      info.studentName = line.split(':')[1].trim();
    } else if (upper.includes('STUDENT_ID:') || upper.includes('ID:')) {
      info.studentId = line.split(':')[1].trim();
    } else if (upper.includes('STUDENT_EMAIL:') || upper.includes('EMAIL:')) {
      info.studentEmail = line.split(':')[1].trim();
    } else if (upper.includes('BATCH:')) {
      info.batch = line.split(':')[1].trim();
    } else if (upper.includes('PRACTICAL:')) {
      info.practical = line.split(':')[1].trim();
    }
  }
  
  return info;
}

function calculateAIPenalty(aiPercentage) {
  if (aiPercentage <= 20) return { penalty: 0, severity: 'none' };
  if (aiPercentage <= 40) return { penalty: -10, severity: 'low' };
  if (aiPercentage <= 60) return { penalty: -25, severity: 'medium' };
  if (aiPercentage <= 80) return { penalty: -50, severity: 'high' };
  return { penalty: -100, severity: 'critical' };
}

function calculateGradeLetter(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

async function gradeAssignment(submissionText, rubric, aiResult, practicalNumber) {
  // Build enhanced grading prompt with detailed criteria analysis
  let prompt = 'Grade this assignment using the rubric. Analyze each criterion carefully. Return ONLY valid JSON.\n\n';
  prompt += 'RUBRIC: ' + rubric.title + ' (' + rubric.totalPoints + ' points)\n\n';
  prompt += 'CRITERIA TO EVALUATE:\n';
  rubric.criteria.forEach((c, idx) => {
    prompt += (idx + 1) + '. ' + c.name + ' (' + c.points + ' points max)\n';
    prompt += '   Description: ' + c.description + '\n';
    prompt += '   Evaluate: Does the submission meet this criterion? Provide specific evidence.\n\n';
  });
  
  prompt += '\nSUBMISSION TO GRADE:\n' + submissionText;
  
  prompt += '\n\nGRADING INSTRUCTIONS:\n';
  prompt += '1. For EACH criterion, provide:\n';
  prompt += '   - name (exact match from rubric)\n';
  prompt += '   - score (0 to maxScore)\n';
  prompt += '   - maxScore (from rubric)\n';
  prompt += '   - feedback (specific observations with evidence)\n';
  prompt += '   - evidence (quote or describe specific parts that justify the score)\n';
  prompt += '2. Calculate totalScore (sum of all criterion scores)\n';
  prompt += '3. Provide overallFeedback (holistic assessment)\n';
  prompt += '4. List strengths (what was done well)\n';
  prompt += '5. List improvements (specific actionable suggestions)\n';
  prompt += '6. Identify learningEvidence (signs of genuine understanding vs AI generation)\n\n';
  prompt += 'Return JSON with: totalScore, criteria (array), overallFeedback, strengths (array), improvements (array), learningEvidence (array)';

  let result;
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 2048,
        temperature: 0,
        messages: [{ role: 'user', content: prompt }]
      });

      const responseText = message.content[0].text;
      
      // Try to parse JSON response
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}') + 1;
      if (jsonStart === -1 || jsonEnd <= jsonStart) {
        throw new Error('No JSON found in response');
      }
      
      const jsonText = responseText.substring(jsonStart, jsonEnd);
      result = JSON.parse(jsonText);
      
      // Validate required fields
      if (!result.totalScore && result.totalScore !== 0) {
        throw new Error('Missing totalScore');
      }
      
      break; // Success!
      
    } catch (error) {
      attempts++;
      console.error('Attempt ' + attempts + ' failed: ' + error.message);
      
      if (attempts >= maxAttempts) {
        // Return fallback result
        result = {
          totalScore: 0,
          criteria: rubric.criteria.map(c => ({
            name: c.name,
            score: 0,
            maxScore: c.points,
            feedback: 'Unable to grade due to API error'
          })),
          overallFeedback: 'Grading failed after ' + maxAttempts + ' attempts',
          strengths: [],
          improvements: ['Manual review required']
        };
      } else {
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  // Apply AI penalty
  result.baseScore = result.totalScore;
  if (aiResult) {
    const penaltyInfo = calculateAIPenalty(aiResult.aiProbability);
    result.aiPenalty = penaltyInfo.penalty;
    result.aiPenaltySeverity = penaltyInfo.severity;
    result.finalScore = Math.max(0, result.baseScore + penaltyInfo.penalty);
  } else {
    result.aiPenalty = 0;
    result.finalScore = result.baseScore;
  }

  result.gradeLetter = calculateGradeLetter(result.finalScore);
  result.practicalNumber = practicalNumber;
  
  return result;
}

function formatResults(result) {
  let output = '\n========================================\n';
  output += 'GRADING RESULTS\n';
  output += '========================================\n';
  
  if (result.studentName) {
    output += 'Student: ' + result.studentName + '\n';
    output += 'ID: ' + result.studentId + '\n';
    output += 'Email: ' + result.studentEmail + '\n';
    output += 'Batch: ' + result.batch + '\n';
    output += 'Practical: ' + result.practicalNumber + '\n';
    output += '----------------------------------------\n';
  }
  
  output += 'Base Score: ' + result.baseScore + '/100\n';
  if (result.aiPenalty !== 0) {
    output += 'AI Penalty: ' + result.aiPenalty + ' points (' + result.aiPenaltySeverity + ')\n';
  }
  output += 'Final Score: ' + result.finalScore + '/100\n';
  output += 'Grade: ' + result.gradeLetter + '\n\n';
  
  if (result.criteria && result.criteria.length > 0) {
    output += 'Detailed Criteria Assessment:\n';
    output += '========================================\n';
    result.criteria.forEach((c, idx) => {
      output += (idx + 1) + '. ' + c.name + ': ' + c.score + '/' + c.maxScore + ' points\n';
      output += '   Feedback: ' + c.feedback + '\n';
      if (c.evidence) {
        output += '   Evidence: ' + c.evidence + '\n';
      }
      output += '\n';
    });
  }
  
  if (result.learningEvidence && result.learningEvidence.length > 0) {
    output += 'Learning Evidence (Authentic Work Indicators):\n';
    result.learningEvidence.forEach(e => output += '✓ ' + e + '\n');
    output += '\n';
  }
  
  if (result.strengths && result.strengths.length > 0) {
    output += 'Key Strengths:\n';
    result.strengths.forEach(s => output += '+ ' + s + '\n');
    output += '\n';
  }
  
  if (result.improvements && result.improvements.length > 0) {
    output += 'Areas for Improvement:\n';
    result.improvements.forEach(i => output += '- ' + i + '\n');
    output += '\n';
  }
  
  output += 'Overall: ' + result.overallFeedback + '\n';
  output += '========================================\n';
  
  return output;
}

function loadRubric(practicalNumber) {
  const rubricPath = 'rubrics/practical_' + practicalNumber + '.json';
  return JSON.parse(fs.readFileSync(rubricPath, 'utf-8'));
}

async function main() {
  console.error('='.repeat(50));
  console.error('AI ASSIGNMENT GRADER - Starting grading process');
  console.error('='.repeat(50));
  
  const args = process.argv.slice(2);
  
  // Validate command line arguments
  if (args.length < 2) {
    console.error('ERROR: Insufficient arguments');
    console.error('Usage: node grader.js <submission-file> <practical-number> [ai-result-file]');
    console.error('Example: node grader.js submissions/test.txt 1 ai-result.json');
    process.exit(1);
  }
  
  const filePath = args[0];
  const practicalNumber = args[1];
  const aiResultFile = args[2] || 'ai-result.json';

  // Validate file paths
  if (!fs.existsSync(filePath)) {
    console.error('ERROR: Submission file not found: ' + filePath);
    process.exit(1);
  }

  // Read and validate submission
  console.error('[1/5] Reading submission file: ' + filePath);
  const submissionText = fs.readFileSync(filePath, 'utf-8');
  
  if (submissionText.trim().length === 0) {
    console.error('ERROR: Submission file is empty');
    process.exit(1);
  }
  
  if (submissionText.length > 50000) {
    console.error('WARNING: Submission is very long (' + submissionText.length + ' chars). This may affect grading quality.');
  }
  
  console.error('✓ Submission loaded (' + submissionText.length + ' characters)');

  // Load rubric
  console.error('[2/5] Loading rubric for practical ' + practicalNumber);
  try {
    const rubric = loadRubric(practicalNumber);
    console.error('✓ Rubric loaded: ' + rubric.title + ' (' + rubric.totalPoints + ' points)');
  } catch (e) {
    console.error('ERROR: Failed to load rubric for practical ' + practicalNumber);
    console.error('Available rubrics: practical_1.json through practical_7.json');
    process.exit(1);
  }
  const rubric = loadRubric(practicalNumber);

  // Extract student information
  console.error('[3/5] Extracting student information');
  const studentInfo = extractStudentInfo(submissionText);
  console.error('✓ Student: ' + (studentInfo.studentName || 'Not found in header'));
  console.error('  ID: ' + (studentInfo.studentId || 'Not found'));
  console.error('  Email: ' + (studentInfo.studentEmail || 'Not found'));

  // Load AI detection results
  console.error('[4/5] Loading AI detection results');
  let aiResult = null;
  if (fs.existsSync(aiResultFile)) {
    try {
      aiResult = JSON.parse(fs.readFileSync(aiResultFile, 'utf-8'));
      console.error('✓ AI detection: ' + aiResult.aiProbability + '% probability (' + aiResult.confidence + ' confidence)');
      if (aiResult.aiDetected) {
        console.error('⚠ WARNING: High AI usage detected - penalties will be applied');
      }
    } catch (e) {
      console.error('⚠ Warning: Could not parse AI results file');
    }
  } else {
    console.error('⚠ AI results file not found - proceeding without AI detection');
  }

  // Perform grading
  console.error('[5/5] Grading assignment with Claude API');
  console.error('Model: claude-sonnet-4-5');
  console.error('This may take 30-60 seconds...');
  
  const result = await gradeAssignment(submissionText, rubric, aiResult, practicalNumber);
  
  // Add student info to result
  result.studentName = studentInfo.studentName || 'Unknown';
  result.studentId = studentInfo.studentId || 'Unknown';
  result.studentEmail = studentInfo.studentEmail || 'Unknown';
  result.batch = studentInfo.batch || 'Unknown';
  result.practicalNumber = studentInfo.practical || practicalNumber;
  result.submissionLength = submissionText.length;
  result.timestamp = new Date().toISOString();
  
  console.error('✓ Grading completed successfully');
  console.error('='.repeat(50));
  
  // Output JSON for workflow (stdout)
  console.log(JSON.stringify(result, null, 2));
  
  // Display formatted results to stderr
  console.error(formatResults(result));
}

main().catch(error => {
  console.error('\n' + '='.repeat(50));
  console.error('FATAL ERROR: Grading process failed');
  console.error('='.repeat(50));
  console.error('Error type: ' + error.name);
  console.error('Message: ' + error.message);
  if (error.stack) {
    console.error('\nStack trace:');
    console.error(error.stack);
  }
  console.error('='.repeat(50));
  process.exit(1);
});

export { gradeAssignment, loadRubric, calculateAIPenalty, calculateGradeLetter };
