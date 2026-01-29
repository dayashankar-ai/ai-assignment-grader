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
      
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}') + 1;
      if (jsonStart === -1 || jsonEnd <= jsonStart) {
        throw new Error('No JSON found in response');
      }
      
      const jsonText = responseText.substring(jsonStart, jsonEnd);
      result = JSON.parse(jsonText);
      
      // Validate and set aiDetected
      if (!result.aiProbability && result.aiProbability !== 0) {
        throw new Error('Missing aiProbability');
      }
      
      if (result.aiProbability > 60) {
        result.aiDetected = true;
      }
      
      break; // Success!
      
    } catch (error) {
      attempts++;
      console.error('Attempt ' + attempts + ' failed: ' + error.message);
      
      if (attempts >= maxAttempts) {
        result = {
          aiProbability: 0,
          confidence: 'low',
          aiDetected: false,
          recommendation: 'Detection failed after ' + maxAttempts + ' attempts',
          indicators: []
        };
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
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
  console.error('='.repeat(50));
  console.error('AI CONTENT DETECTOR - Starting analysis');
  console.error('='.repeat(50));
  
  const args = process.argv.slice(2);
  
  // Validate arguments
  if (args.length < 1) {
    console.error('ERROR: Missing submission file');
    console.error('Usage: node ai-detector.js <submission-file>');
    console.error('Example: node ai-detector.js submissions/test.txt');
    process.exit(1);
  }
  
  const filePath = args[0];

  // Validate file exists
  if (!fs.existsSync(filePath)) {
    console.error('ERROR: File not found: ' + filePath);
    process.exit(1);
  }

  // Read submission
  console.error('[1/2] Reading submission file: ' + filePath);
  const submissionText = fs.readFileSync(filePath, 'utf-8');
  
  if (submissionText.trim().length === 0) {
    console.error('ERROR: Submission file is empty');
    process.exit(1);
  }
  
  if (submissionText.length < 100) {
    console.error('WARNING: Submission is very short (' + submissionText.length + ' chars). Detection may be unreliable.');
  }
  
  console.error('✓ Submission loaded (' + submissionText.length + ' characters)');

  // Detect AI content
  console.error('[2/2] Analyzing content with Claude API');
  console.error('Model: claude-sonnet-4-5');
  console.error('This may take 20-30 seconds...');
  
  const result = await detectAI(submissionText);
  
  // Add metadata
  result.timestamp = new Date().toISOString();
  result.submissionLength = submissionText.length;
  
  console.error('✓ Analysis completed successfully');
  console.error('='.repeat(50));
  
  // Output JSON for workflow (stdout)
  console.log(JSON.stringify(result, null, 2));
  
  // Display formatted results to stderr
  console.error(formatResults(result));
}

main().catch(error => {
  console.error('\n' + '='.repeat(50));
  console.error('FATAL ERROR: AI detection failed');
  console.error('='.repeat(50));
  console.error('Error type: ' + error.name);
  console.error('Message: ' + error.message);
  if (error.stack) {
    console.error('\nStack trace:');
    console.error(error.stack);
  }
  console.error('='.repeat(50));
  
  // Return minimal valid JSON to prevent workflow breakage
  console.log(JSON.stringify({
    aiProbability: 0,
    confidence: 'error',
    aiDetected: false,
    recommendation: 'AI detection failed - proceeding with grading',
    indicators: ['Error during detection: ' + error.message],
    error: true
  }, null, 2));
  
  process.exit(1);
});

export { detectAI };
