import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function detectAI(submissionText) {
  // Build detailed detection prompt
  let prompt = 'Analyze if this submission is AI-generated. Look for:\n';
  prompt += '- Perfect grammar vs student errors\n';
  prompt += '- Generic explanations vs personal learning\n';
  prompt += '- Overly formal language vs casual tone\n';
  prompt += '- Comprehensive structure vs learning artifacts\n\n';
  prompt += 'Return ONLY valid JSON with:\n';
  prompt += '- aiProbability: number 0-100\n';
  prompt += '- confidence: "low", "medium", or "high"\n';
  prompt += '- aiDetected: boolean (true if >60%)\n';
  prompt += '- recommendation: brief assessment\n';
  prompt += '- indicators: array of specific AI indicators found\n\n';
  prompt += 'Submission:\n' + submissionText;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    temperature: 0,
    messages: [{ role: 'user', content: prompt }]
  });

  const responseText = message.content[0].text;
  let result;
  
  try {
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    const jsonText = responseText.substring(jsonStart, jsonEnd);
    result = JSON.parse(jsonText);
    
    // Ensure aiDetected is boolean
    if (result.aiProbability > 60) {
      result.aiDetected = true;
    }
  } catch (error) {
    result = {
      aiProbability: 0,
      confidence: 'low',
      aiDetected: false,
      recommendation: 'Unable to analyze',
      indicators: []
    };
  }

  return result;
}

function formatResults(result) {
  let output = '\n========================================\n';
  output += 'AI DETECTION RESULTS\n';
  output += '========================================\n';
  output += 'AI Probability: ' + result.aiProbability + '%\n';
  output += 'Confidence: ' + result.confidence + '\n';
  output += 'Status: ' + (result.aiDetected ? 'AI DETECTED' : 'Appears Human') + '\n';
  output += 'Recommendation: ' + result.recommendation + '\n';
  
  if (result.indicators && result.indicators.length > 0) {
    output += '\nIndicators Found:\n';
    result.indicators.forEach(ind => output += '- ' + ind + '\n');
  }
  
  output += '========================================\n';
  return output;
}

async function main() {
  const args = process.argv.slice(2);
  const filePath = args[0];

  const submissionText = fs.readFileSync(filePath, 'utf-8');

  console.error('Detecting AI...');
  const result = await detectAI(submissionText);
  
  // Output JSON for workflow
  console.log(JSON.stringify(result, null, 2));
  
  // Display formatted results to stderr
  console.error(formatResults(result));
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});

export { detectAI };
