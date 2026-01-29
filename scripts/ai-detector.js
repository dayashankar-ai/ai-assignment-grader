import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function detectAI(submissionText) {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    temperature: 0,
    messages: [{
      role: 'user',
      content: 'Analyze if this submission is AI-generated. Return ONLY valid JSON with: aiProbability (0-100), confidence (low/medium/high), aiDetected (boolean), recommendation.\n\nSubmission:\n' + submissionText
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
      aiProbability: 0,
      confidence: 'low',
      aiDetected: false,
      recommendation: 'Unable to analyze'
    };
  }

  return result;
}

async function main() {
  const args = process.argv.slice(2);
  const filePath = args[0];

  const submissionText = fs.readFileSync(filePath, 'utf-8');

  console.error('Detecting AI...');
  const result = await detectAI(submissionText);
  
  console.log(JSON.stringify(result, null, 2));
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});

export { detectAI };
