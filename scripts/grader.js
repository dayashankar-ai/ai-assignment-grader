import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function gradeAssignment(submissionText, rubric) {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    temperature: 0,
    messages: [{
      role: 'user',
      content: 'Grade this assignment and return ONLY valid JSON with: totalScore, criteria (array with name, score, feedback), gradeLetter, overallFeedback.\n\nSubmission:\n' + submissionText
    }]
  });

  const responseText = message.content[0].text;
  let result;
  
  try {
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    const jsonText = responseText.substring(jsonStart, jsonEnd);
    result = JSON.parse(jsonText);
  } catch (error) {
    result = {
      totalScore: 0,
      criteria: [],
      gradeLetter: 'F',
      overallFeedback: 'Error parsing response'
    };
  }

  result.finalScore = result.totalScore;
  return result;
}

function loadRubric(practicalNumber) {
  const rubricPath = 'rubrics/practical_' + practicalNumber + '.json';
  return JSON.parse(fs.readFileSync(rubricPath, 'utf-8'));
}

async function main() {
  const args = process.argv.slice(2);
  const filePath = args[0];
  const practicalNumber = args[1];

  const submissionText = fs.readFileSync(filePath, 'utf-8');
  const rubric = loadRubric(practicalNumber);

  console.error('Grading...');
  const result = await gradeAssignment(submissionText, rubric);
  
  console.log(JSON.stringify(result, null, 2));
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});

export { gradeAssignment, loadRubric };
