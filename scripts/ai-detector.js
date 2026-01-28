import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Rate limiting configuration
const RATE_LIMIT_DELAY = 1000; // 1 second between API calls
let lastApiCall = 0;

/**
 * Wait for rate limit
 */
async function waitForRateLimit() {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCall;
  if (timeSinceLastCall < RATE_LIMIT_DELAY) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastCall));
  }
  lastApiCall = Date.now();
}

/**
 * Get file extension from file path
 * @param {string} filePath - Path to the file
 * @returns {string} File extension
 */
function getFileExtension(filePath) {
  return path.extname(filePath).toLowerCase();
}

/**
 * Determine file type context for analysis
 * @param {string} fileExt - File extension
 * @returns {string} File type description
 */
function getFileTypeContext(fileExt) {
  const fileTypes = {
    '.py': 'Python code',
    '.js': 'JavaScript code',
    '.java': 'Java code',
    '.cpp': 'C++ code',
    '.c': 'C code',
    '.cs': 'C# code',
    '.ts': 'TypeScript code',
    '.md': 'Markdown documentation',
    '.txt': 'plain text',
    '.pdf': 'document text',
    '.html': 'HTML code',
    '.css': 'CSS code',
    '.sql': 'SQL code',
    '.r': 'R code',
  };
  
  return fileTypes[fileExt] || 'code or text';
}

/**
 * Pre-process text to detect obvious AI patterns
 * @param {string} text - Text to analyze
 * @returns {Object} Pre-detection results
 */
function preDetectionAnalysis(text) {
  const aiPatterns = [
    /as an ai/gi,
    /i apologize/gi,
    /i'm sorry, but i/gi,
    /certainly!?\s*i('d| would) be (happy|glad|delighted) to/gi,
    /here's a (comprehensive|detailed|complete|thorough) (explanation|guide|solution)/gi,
    /let me break (this|that|it) down for you/gi,
    /it's important to note that/gi,
    /it('s| is) worth (noting|mentioning) that/gi,
    /firstly.*secondly.*thirdly/gis,
    /in conclusion,\s*it('s| is) (clear|evident|important)/gi,
    /to summarize.*key points/gis,
  ];
  
  const matches = [];
  let totalMatches = 0;
  
  aiPatterns.forEach(pattern => {
    const found = text.match(pattern);
    if (found) {
      matches.push(...found);
      totalMatches += found.length;
    }
  });
  
  return {
    obviousAiPatterns: totalMatches > 0,
    patternMatches: matches,
    patternCount: totalMatches
  };
}

/**
 * Detect AI-generated content using Claude API with comprehensive analysis
 * @param {string} text - The text to analyze
 * @param {string} fileType - Type of file being analyzed
 * @returns {Promise<Object>} Detection results
 */
async function detectAI(text, fileType = 'code or text') {
  try {
    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not found in environment variables');
    }
    
    // Wait for rate limit
    await waitForRateLimit();
    
    // Pre-detection analysis
    const preDetection = preDetectionAnalysis(text);
    
    // Split text into lines for analysis
    const lines = text.split('\n');
    const totalLines = lines.length;
    
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      temperature: 0,
      system: `You are an AI content detector specialized in analyzing student submissions. Your task is to identify AI-generated content with high precision and provide actionable insights for instructors.

DETECTION STRATEGIES:

For Code Analysis:
- Comment patterns: AI tends to write overly explanatory, formal comments
- Variable naming: Perfect, descriptive names vs student shortcuts
- Code structure: Too perfect organization vs learning artifacts
- Error handling: Comprehensive vs minimal/missing
- Documentation strings: Formal vs casual or missing
- Code patterns: Generic best practices vs student experimentation

For Text Analysis:
- Writing style: Formal/perfect vs casual/errors
- Sentence patterns: Varied complex structures vs simpler patterns
- Vocabulary: Advanced/consistent vs student-level
- Personal voice: Generic vs individual personality
- Transition phrases: Overuse of formal connectors
- Learning indicators: Confusion/questions vs polished explanations

AI Signatures:
- Phrases like "As an AI", "I apologize", "Certainly! I'd be happy to"
- "Here's a comprehensive/detailed/complete guide"
- Overly structured responses (Firstly, Secondly, Thirdly...)
- Perfect grammar with no typos or student-typical errors
- Generic examples that lack specificity

Your analysis should be thorough but fair - remember that good students can write well, and AI detection should look for multiple indicators together.`,
      messages: [
        {
          role: 'user',
          content: `Analyze this ${fileType} submission for AI-generated content. Provide a detailed analysis.

SUBMISSION (${totalLines} lines):
${text}

Respond in JSON format with:
{
  "aiProbability": <number 0-100>,
  "confidence": "<low|medium|high>",
  "flaggedSections": [
    {
      "lines": "start-end",
      "reason": "specific reason this section appears AI-generated",
      "severity": "<low|medium|high>"
    }
  ],
  "humanElements": [
    {
      "lines": "start-end", 
      "reason": "specific reason this section appears human-written"
    }
  ],
  "indicators": {
    "aiIndicators": ["list of AI patterns found"],
    "humanIndicators": ["list of human characteristics found"]
  },
  "analysis": {
    "codeQuality": "<assessment of code quality if applicable>",
    "writingStyle": "<assessment of writing style>",
    "consistency": "<assessment of consistency throughout>",
    "learningEvidence": "<evidence of learning process vs polished output>"
  },
  "recommendation": "<PASS|REVIEW|FAIL>",
  "reasoning": "detailed explanation of the overall assessment"
}

Be precise with line numbers. If the entire submission appears AI-generated, use "1-${totalLines}". If you cannot determine specific sections, indicate "unable to determine" in the lines field.

Respond ONLY with valid JSON, no additional text.`
        }
      ]
    });

    const responseText = message.content[0].text;
    
    // Parse JSON response
    let result;
    try {
      // Try to extract JSON if wrapped in markdown code blocks
      let jsonText = responseText;
      const jsonMatch = responseText.match(new RegExp('```json\\s*([\\s\\S]*?)\\s*```'));
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }
      
      result = JSON.parse(jsonText);
      
      // Validate required fields
      if (typeof result.aiProbability !== 'number') {
        result.aiProbability = 50;
      }
      
      // Ensure probability is in valid range
      result.aiProbability = Math.max(0, Math.min(100, result.aiProbability));
      
      // Set defaults for missing fields
      result.confidence = result.confidence || 'medium';
      result.flaggedSections = result.flaggedSections || [];
      result.humanElements = result.humanElements || [];
      result.recommendation = result.recommendation || 'REVIEW';
      
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.error('Raw response:', responseText);
      
      // Fallback result
      result = {
        aiProbability: 50,
        confidence: 'low',
        flaggedSections: [],
        humanElements: [],
        indicators: {
          aiIndicators: ['Unable to parse detailed analysis'],
          humanIndicators: []
        },
        analysis: {
          codeQuality: 'Unable to assess',
          writingStyle: 'Unable to assess',
          consistency: 'Unable to assess',
          learningEvidence: 'Unable to assess'
        },
        recommendation: 'REVIEW',
        reasoning: 'Analysis failed to parse. Manual review required.'
      };
    }
    
    // Add pre-detection results
    if (preDetection.obviousAiPatterns) {
      result.aiProbability = Math.max(result.aiProbability, 75);
      result.preDetectionFlags = {
        obviousPatterns: true,
        matches: preDetection.patternMatches.slice(0, 5), // Limit to first 5
        count: preDetection.patternCount
      };
    }
    
    // Add metadata
    return {
      ...result,
      aiDetected: result.aiProbability >= 50,
      timestamp: new Date().toISOString(),
      model: 'claude-3-5-sonnet-20241022',
      fileType: fileType,
      totalLines: totalLines,
      textLength: text.length
    };

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
    
    console.error('Error in AI detection:', error);
    throw error;
  }
}

/**
 * Format detection results for display
 * @param {Object} result - Detection result
 * @returns {string} Formatted output
 */
function formatResults(result) {
  let output = '\n';
  output += '═══════════════════════════════════════════════════════════\n';
  output += '           AI CONTENT DETECTION RESULTS\n';
  output += '═══════════════════════════════════════════════════════════\n\n';
  
  // Overall assessment
  output += `AI Probability: ${result.aiProbability}% (${result.confidence} confidence)\n`;
  output += `Recommendation: ${result.recommendation}\n`;
  output += `Status: ${result.aiDetected ? '⚠️  AI CONTENT DETECTED' : '✓ APPEARS HUMAN-WRITTEN'}\n\n`;
  
  // Pre-detection flags
  if (result.preDetectionFlags) {
    output += '⚠️  OBVIOUS AI PATTERNS DETECTED:\n';
    result.preDetectionFlags.matches.forEach(match => {
      output += `   - "${match}"\n`;
    });
    output += '\n';
  }
  
  // Flagged sections
  if (result.flaggedSections && result.flaggedSections.length > 0) {
    output += '🚩 FLAGGED SECTIONS:\n';
    result.flaggedSections.forEach(section => {
      output += `   Lines ${section.lines}: ${section.reason}\n`;
      if (section.severity) {
        output += `   Severity: ${section.severity}\n`;
      }
    });
    output += '\n';
  }
  
  // Human elements
  if (result.humanElements && result.humanElements.length > 0) {
    output += '✓ HUMAN ELEMENTS:\n';
    result.humanElements.forEach(element => {
      output += `   Lines ${element.lines}: ${element.reason}\n`;
    });
    output += '\n';
  }
  
  // Indicators
  if (result.indicators) {
    if (result.indicators.aiIndicators && result.indicators.aiIndicators.length > 0) {
      output += 'AI Indicators Found:\n';
      result.indicators.aiIndicators.forEach(indicator => {
        output += `   • ${indicator}\n`;
      });
      output += '\n';
    }
    
    if (result.indicators.humanIndicators && result.indicators.humanIndicators.length > 0) {
      output += 'Human Indicators Found:\n';
      result.indicators.humanIndicators.forEach(indicator => {
        output += `   • ${indicator}\n`;
      });
      output += '\n';
    }
  }
  
  // Analysis
  if (result.analysis) {
    output += 'DETAILED ANALYSIS:\n';
    Object.entries(result.analysis).forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').trim();
      output += `   ${label}: ${value}\n`;
    });
    output += '\n';
  }
  
  // Reasoning
  if (result.reasoning) {
    output += 'REASONING:\n';
    output += `   ${result.reasoning}\n\n`;
  }
  
  output += '═══════════════════════════════════════════════════════════\n';
  
  return output;
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node ai-detector.js <file-path>');
    console.error('\nExample:');
    console.error('  node ai-detector.js submission.py');
    console.error('  node ai-detector.js assignment.txt');
    process.exit(1);
  }

  const filePath = args[0];
  
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  const submissionText = fs.readFileSync(filePath, 'utf-8');
  
  if (submissionText.trim().length < 50) {
    console.error('Error: Submission is too short to analyze (minimum 50 characters)');
    process.exit(1);
  }

  const fileExt = getFileExtension(filePath);
  const fileType = getFileTypeContext(fileExt);
  
  console.error(`Analyzing ${fileType} submission (${submissionText.length} characters, ${submissionText.split('\n').length} lines)...`);
  console.error('This may take a few seconds...\n');
  
  const result = await detectAI(submissionText, fileType);
  
  // Output JSON to stdout for GitHub Actions
  console.log(JSON.stringify(result, null, 2));
  
  // Also save to file for reference
  const resultPath = path.join(process.cwd(), 'ai-detection-result.json');
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
  
  // Display formatted results to stderr
  console.error(formatResults(result));
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  });
}

export { detectAI };
