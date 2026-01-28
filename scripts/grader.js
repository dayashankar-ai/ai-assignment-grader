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
  const rubricPath = path.join(process.cwd(), 'rubrics', "practical_" + (practicalNumber) + ".json");
  
  if (!fs.existsSync(rubricPath)) {
    throw new Error("Rubric not found: " + (rubricPath));
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
      (i + 1) + ". " + (c.name) + " (" + (c.points) + " points): " + (c.description)
    ).join('\n');

    // Build AI context if available
    let aiContext = '';
    if (aiDetectionResult) {
      const aiPercent = aiDetectionResult.aiProbability || 0;
      aiContext = "\n\nAI DETECTION ANALYSIS:\n- AI Probability: " + (aiPercent) + "%\n- Recommendation: " + (aiDetectionResult.recommendation || 'N/A');
      
      if (aiDetectionResult.flaggedSections && aiDetectionResult.flaggedSections.length > 0) {
        aiContext += '\n- Flagged Sections:\n';
        aiDetectionResult.flaggedSections.forEach(section => {
          aiContext += "  * Lines " + (section.lines) + ": " + (section.reason) + "\n";
        });
      }
      
      if (aiDetectionResult.humanElements && aiDetectionResult.humanElements.length > 0) {
        aiContext += '- Human Elements Found:\n';
        aiDetectionResult.humanElements.forEach(element => {
          aiContext += "  * Lines " + (element.lines) + ": " + (element.reason) + "\n";
        });
      }
      
      aiContext += "\nNote: Grade the base quality of the work. AI penalties will be applied separately.";
    }

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      temperature: 0,
      system: "You are an expert instructor and LLM-judge grading student assignments. You provide fair, constructive, and detailed feedback based on grading rubrics.\n\nWhen AI detection results are provided:\n- Focus on grading the actual quality and correctness of the work\n- Note if AI-generated sections show lack of understanding\n- Identify whether the student demonstrates learning\n- Consider if the work meets the learning objectives\n- DO NOT apply AI penalties yourself - grade the work objectively\n\nProvide specific, actionable feedback that helps students improve.",
      messages: [
        {
          role: 'user',
          content: "Grade this student assignment using the provided rubric.\n\nASSIGNMENT: " + (rubric.title) + "\nDESCRI// Try to extract JSON if wrapped in markdown code blocks\nlet jsonText = responseText;\nconst jsonMatch = responseText.match(/"""json\s*([\s\S]*?)\s*"""/);\nif (jsonMatch) {\njsonText = jsonMatch[1];\n}\n\nresult = JSON.parse(jsonText);\n\n// Validate and ensure required fields\nif (typeof result.totalScore !== 'number') {\nresult.totalScore = 0;\n}\n\nresult.criteria = result.criteria || rubric.criteria.map(c => ({\nname: c.name,\nscore: 0,\nmaxScore: c.points,\nfeedback: 'Unable to grade'\n}));\n\nresult.strengths = result.strengths || [];\nresult.improvements = result.improvements || [];\nresult.gradeLetter = result.gradeLetter || 'F';\n\n} catch (parseError) {\nconsole.error('Failed to parse JSON response:', parseError);\nconsole.error('Raw response:', responseText);\n\n// Fallback result\nresult = {\ntotalScore: 0,\ncriteria: rubric.criteria.map(c => ({\nname: c.name,\nscore: 0,\nmaxScore: c.points,\nfeedback: 'Error grading this criterion',\nstrengths: '',\nimprovements: ''\n})),\noverallFeedback: 'Grading error occurred. Manual review required.',\nstrengths: [],\nimprovements: ['Manual grading required'],\ngradeLetter: 'F',\ntechnicalAssessment: {\ncorrectness: 'Unable to assess',\ncodeQuality: 'Unable to assess',\nconceptUnderstanding: 'Unable to assess',\ncompleteness: 'Unable to assess'\n},\nFormat grading results for display\n* @param {Object} result - Grading result\n* @returns {string} Formatted output\n*/\nfunction formatGradingResults(result) {\nlet output = '\n';\noutput += 'ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ\n';\noutput += '              ASSIGNMENT GRADING RESULTS\n';\noutput += 'ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ\n\n';\n\n// Student info if available\nif (result.studentInfo) {\noutput += "Student: ${result.studentInfo.studentName || 'N/A'}\n";\nif (result.studentInfo.rollNumber) output += "Roll Number: ${result.studentInfo.rollNumber}\n";\nif (result.studentInfo.batch) output += "Batch: ${result.studentInfo.batch}\n";\nif (result.studentInfo.year) output += "Year: ${result.studentInfo.year}\n";\noutput += '\n';\n}\n\noutput += "Assignment: ${result.practicalTitle || 'N/A'}\n";\noutput += "Practical Number: ${result.practicalNumber || 'N/A'}\n\n";\n\n// Scoring breakdown\noutput += 'ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ\n';\noutput += 'SCORING BREAKDOWN\n';\noutput += 'ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ\n';\noutput += "Base Score:       ${result.baseScore || result.totalScore}/100\n";\n\nif (result.aiPenalty !== undefined && result.aiPenalty !== 0) {\noutput += "AI Penalty:       ${result.aiPenalty} points\n";\noutput += "Final Score:      ${result.finalScore}/100\n";\n} else {\noutput += "Final Score:      ${result.finalScore || result.totalScore}/100\n";\n}\n\noutput += "Grade Letter:     ${result.gradeLetter || 'N/A'}\n\n";\n\n// AI Usage information\nif (result.aiUsagePercent) {\noutput += 'ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ\n';\noutput += 'AI USAGE ANALYSIS\n';\noutput += 'ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ\n';\noutput += "AI Content:       ${result.aiUsagePercent}%\n";\n\nif (result.aiPenaltyInfo) {\noutput += "Severity:         ${result.aiPenaltyInfo.severity.toUpperCase()}\n";\noutput += "Description:      ${result.aiPenaltyInfo.description}\n";\nif (result.aiPenaltyInfo.requiresReview) {\noutput += "ΓÜá∩╕Å REQUIRES REVIEW: This submission needs instructor attention\n";\n}\n}\n\nif (result.aiUsageNotes) {\noutput += "\n${result.aiUsageNotes}\n";\n}\noutput += '\n';\n}\n\n// Criteria breakdown\noutput += 'ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ\n';\noutput += 'CRITERIA BREAKDOWN\n';\noutput += 'ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ\n';\n\nif (result.criteria) {\nresult.criteria.forEach(criterion => {\noutput += "\n${criterion.name}: ${criterion.score}/${criterion.maxScore}\n";\noutput += "  ${criterion.feedback}\n";\nif (criterion.strengths) {\noutput += "  Γ£ô Strengths: ${criterion.strengths}\n";\n}\nif (criterion.improvements) {\noutput += "  ΓÜá Improvements: ${criterion.improvements}\n";\n}\n});\n}\n\n// Overall feedback\noutput += '\nΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ\n';\noutput += 'OVERALL FEEDBACK\n';\noutput += 'ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ\n';\noutput += result.overallFeedback + '\n';\n\n// Strengths\nif (result.strengths && result.strengths.length > 0) {\noutput += '\nΓ£ô STRENGTHS:\n';\nresult.strengths.forEach(strength => {\noutput += "  ΓÇó ${strength}\n";\n});\n}\n\n// Improvements\nif (result.improvements && result.improvements.length > 0) {\noutput += '\nΓÜá AREAS FOR IMPROVEMENT:\n';\nresult.improvements.forEach(improvement => {\noutput += "  ΓÇó ${improvement}\n";\n});\n}\n\n// Technical assessment\nif (result.technicalAssessment) {\noutput += '\nΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ\n';\noutput += 'TECHNICAL ASSESSMENT\n';\noutput += 'ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ\n';\nObject.entries(result.technicalAssessment).forEach(([key, value]) => {\nconst label = key.replace(/([A-Z])/g, ' $1').trim();\noutput += "${label}: ${value}\n";\n});\n}\n\n// Learning evidence\nif (result.learningEvidence) {\noutput += '\nLearning Evidence:\n';\noutput += "  ${result.learningEvidence}\n";\n}\n\noutput += '\nΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ\n';\n\nreturn output;\n}\n\n/**\n* Main execution\n*/\nasync function main() {\nconst args = process.argv.slice(2);\n\nif (args.length < 2) {\nconsole.error('Usage: node grader.js <file-path> <practical-number> [ai-result-file]');\nconsole.error('\nExamples:');\nconsole.error('  node grader.js submission.py 1');\nconsole.error('  node grader.js submission.py 1 ai-result.json');\nprocess.exit(1);\n}\n\nconst filePath = args[0];\nconst practicalNumber = args[1];\nconst aiResultFile = args[2] || 'ai-result.json';\n\nif (!fs.existsSync(filePath)) {\nconsole.error("Error: File not found: ${filePath}");\nprocess.exit(1);\n}\n\nconst submissionText = fs.readFileSync(filePath, 'utf-8');\n\nif (submissionText.trim().length < 10) {\nconsole.error('Error: Submission is too short to grade (minimum 10 characters)');\nprocess.exit(1);\n}\n\nconsole.error("Loading rubric for Practical ${practicalNumber}...");\nconst rubric = loadRubric(practicalNumber);\n\n// Load AI detection results if available\nlet aiDetectionResult = null;\nif (fs.existsSync(aiResultFile)) {\ntry {\naiDetectionResult = JSON.parse(fs.readFileSync(aiResultFile, 'utf-8'));\nconsole.error("AI detection results loaded (${aiDetectionResult.aiProbability}% AI probability)");\n} catch (error) {\nconsole.error("Warning: Could not load AI detection results: ${error.message}");\n}\n} else {\nconsole.error('No AI detection results found. Grading without AI penalty adjustment.');\n}\n\n// Extract student info from environment or args (for GitHub Actions)\nconst studentInfo = {\nstudentName: process.env.STUDENT_NAME || null,\nrollNumber: process.env.STUDENT_ID || null,\nbatch: process.env.STUDENT_BATCH || null,\nyear: process.env.STUDENT_YEAR || null\n};\n\nconsole.error('Grading assignment with LLM-judge...');\nconsole.error('This may take 5-10 seconds...\n');\n\nconst result = await gradeAssignment(submissionText, rubric, aiDetectionResult, studentInfo);\n\n// Ensure grade letter is calculated\nif (!result.gradeLetter) {\nresult.gradeLetter = calculateGradeLetter(result.finalScore || result.totalScore, rubric.totalPoints);\n}\n\n// Output JSON to stdout for GitHub Actions\nconsole.log(JSON.stringify(result, null, 2));\n\n// Also save to file for reference\nconst resultPath = path.join(process.cwd(), 'grading-result.json');\nfs.writeFileSync(resultPath, JSON.stringify(result, null, 2));\n\n// Display formatted results to stderr\nconsole.error(formatGradingResults(result));\n}\n\n// Run if called directly\nif (import.meta.url === "file://${process.argv[1]}") {\nmain().catch(error => {\nconsole.error('\nΓ¥î Fatal error:', error.message);\nprocess.exit(1);\n});\n}\n\nexport { gradeAssignment, loadRubric, calculateGradeLetter, calculateAIPenalty, AI_PENALTY_TIERS\n} catch (error) {\n// Handle specific error types\nif (error.status === 429) {\nconsole.error('Rate limit exceeded. Please wait before retrying.');\nthrow new Error('Rate limit exceeded. Please try again in a few moments.');\n} else if (error.status === 401) {\nconsole.error('Invalid API key.');\nthrow new Error('Invalid API key. Please check your ANTHROPIC_API_KEY environment variable.');\n} else if (error.message.includes('ANTHROPIC_API_KEY')) {\nthrow error;\n}\n: "comprehensive feedback about the submission quality",\n"strengths": ["list of overall strengths"],\n"improvements": ["list of areas for improvement"],\n"gradeLetter": "A/B/C/D/F",\n"technicalAssessment": {\n"correctness": "assessment of solution correctness",\n"codeQuality": "assessment of code quality (if applicable)",\n"conceptUnderstanding": "evidence of concept understanding",\n"completeness": "how complete the solution is"\n},\n"learningEvidence": "evidence that student learned the concepts vs just used AI"\n}\n\nConsider:\n- Correctness and functionality\n- Code quality and organization (if applicable)\n- Understanding of concepts demonstrated\n- Completeness and following instructions\n- Originality and personal problem-solving approach\n\nRespond ONLY with valid JSON, no additional text."
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
    console.error("File not found: " + (filePath));
    process.exit(1);
  }

  const submissionText = fs.readFileSync(filePath, 'utf-8');
  
  if (submissionText.trim().length < 10) {
    console.error('Submission is too short to grade');
    process.exit(1);
  }

  console.error("Loading rubric for Practical " + (practicalNumber) + "...");
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
  
  console.error("\nΓ£ô Grading complete");
  console.error("  - Score: " + (result.totalScore) + "/" + (rubric.totalPoints) + " (" + (result.gradeLetter) + ")");
  console.error("  - Grade Letter: " + (result.gradeLetter));
}

// Run if called directly
if (import.meta.url === "file://" + (process.argv[1])) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { gradeAssignment, loadRubric, calculateGradeLetter };
