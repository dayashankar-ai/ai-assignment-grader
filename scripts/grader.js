import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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

async function gradeAssignment(submissionText, rubric, aiResult) {
  // Build grading prompt with rubric details
  let prompt = 'Grade this assignment using the rubric. Return ONLY valid JSON.\n\n';
  prompt += 'RUBRIC: ' + rubric.title + ' (' + rubric.totalPoints + ' points)\n';
  prompt += 'Criteria:\n';
  rubric.criteria.forEach(c => {
    prompt += '- ' + c.name + ' (' + c.points + ' pts): ' + c.description + '\n';
  });
  prompt += '\nSubmission:\n' + submissionText;
  prompt += '\n\nReturn JSON with: totalScore, criteria (array with name, score, maxScore, feedback), overallFeedback, strengths (array), improvements (array)';

  let result;
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
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
  output += 'Base Score: ' + result.baseScore + '/100\n';
  if (result.aiPenalty !== 0) {
    output += 'AI Penalty: ' + result.aiPenalty + ' points (' + result.aiPenaltySeverity + ')\n';
  }
  output += 'Final Score: ' + result.finalScore + '/100\n';
  output += 'Grade: ' + result.gradeLetter + '\n\n';
  
  if (result.criteria && result.criteria.length > 0) {
    output += 'Criteria Breakdown:\n';
    result.criteria.forEach(c => {
      output += '- ' + c.name + ': ' + c.score + '/' + c.maxScore + '\n';
      output += '  ' + c.feedback + '\n';
    });
    output += '\n';
  }
  
  if (result.strengths && result.strengths.length > 0) {
    output += 'Strengths:\n';
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
  const args = process.argv.slice(2);
  const filePath = args[0];
  const practicalNumber = args[1];
  const aiResultFile = args[2] || 'ai-result.json';

  const submissionText = fs.readFileSync(filePath, 'utf-8');
  const rubric = loadRubric(practicalNumber);

  // Load AI results if available
  let aiResult = null;
  if (fs.existsSync(aiResultFile)) {
    try {
      aiResult = JSON.parse(fs.readFileSync(aiResultFile, 'utf-8'));
      console.error('AI detection: ' + aiResult.aiProbability + '% probability');
    } catch (e) {
      console.error('Warning: Could not load AI results');
    }
  }

  console.error('Grading with rubric...');
  const result = await gradeAssignment(submissionText, rubric, aiResult);
  
  // Output JSON for workflow
  console.log(JSON.stringify(result, null, 2));
  
  // Display formatted results to stderr
  console.error(formatResults(result));
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});

export { gradeAssignment, loadRubric, calculateAIPenalty, calculateGradeLetter };
