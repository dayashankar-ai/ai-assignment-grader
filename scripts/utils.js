import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import csvParser from 'csv-parser';

/**
 * Ensure results directory and CSV file exist
 */
function ensureResultsFile() {
  const resultsDir = path.join(process.cwd(), 'results');
  const csvPath = path.join(resultsDir, 'grades.csv');
  
  // Create results directory if it doesn't exist
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  // Create CSV file with headers if it doesn't exist
  if (!fs.existsSync(csvPath)) {
    const csvWriter = createObjectCsvWriter({
      path: csvPath,
      header: [
        { id: 'timestamp', title: 'Timestamp' },
        { id: 'studentName', title: 'Student Name' },
        { id: 'studentId', title: 'Student ID' },
        { id: 'studentEmail', title: 'Student Email' },
        { id: 'practicalNumber', title: 'Practical Number' },
        { id: 'totalScore', title: 'Total Score' },
        { id: 'maxScore', title: 'Max Score' },
        { id: 'gradeLetter', title: 'Grade Letter' },
        { id: 'aiDetected', title: 'AI Detected' },
        { id: 'aiConfidence', title: 'AI Confidence' },
        { id: 'overallFeedback', title: 'Overall Feedback' }
      ]
    });
    
    // Write empty file with headers
    csvWriter.writeRecords([]);
  }
  
  return csvPath;
}

/**
 * Save grading result to CSV
 * @param {Object} data - Result data to save
 */
async function saveResult(data) {
  const csvPath = ensureResultsFile();
  
  const csvWriter = createObjectCsvWriter({
    path: csvPath,
    header: [
      { id: 'timestamp', title: 'Timestamp' },
      { id: 'studentName', title: 'Student Name' },
      { id: 'studentId', title: 'Student ID' },
      { id: 'studentEmail', title: 'Student Email' },
      { id: 'practicalNumber', title: 'Practical Number' },
      { id: 'totalScore', title: 'Total Score' },
      { id: 'maxScore', title: 'Max Score' },
      { id: 'gradeLetter', title: 'Grade Letter' },
      { id: 'aiDetected', title: 'AI Detected' },
      { id: 'aiConfidence', title: 'AI Confidence' },
      { id: 'overallFeedback', title: 'Overall Feedback' }
    ],
    append: true
  });
  
  await csvWriter.writeRecords([data]);
  console.error(`✓ Result saved to ${csvPath}`);
}

/**
 * Read all grades from CSV
 * @returns {Promise<Array>} Array of grade records
 */
async function readGrades() {
  const csvPath = ensureResultsFile();
  const results = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

/**
 * Get statistics from all grades
 * @returns {Promise<Object>} Statistics object
 */
async function getStatistics() {
  const grades = await readGrades();
  
  if (grades.length === 0) {
    return {
      totalSubmissions: 0,
      averageGrade: 0,
      aiDetectedCount: 0,
      gradeDistribution: { A: 0, B: 0, C: 0, D: 0, F: 0 }
    };
  }
  
  const totalScore = grades.reduce((sum, g) => sum + parseFloat(g.totalScore || 0), 0);
  const averageGrade = totalScore / grades.length;
  const aiDetectedCount = grades.filter(g => g.aiDetected === 'true').length;
  
  const gradeDistribution = grades.reduce((dist, g) => {
    const letter = g.gradeLetter || 'F';
    dist[letter] = (dist[letter] || 0) + 1;
    return dist;
  }, { A: 0, B: 0, C: 0, D: 0, F: 0 });
  
  return {
    totalSubmissions: grades.length,
    averageGrade: averageGrade.toFixed(2),
    aiDetectedCount,
    gradeDistribution
  };
}

/**
 * Format date to ISO string
 * @param {Date} date - Date object
 * @returns {string} Formatted date
 */
function formatDate(date = new Date()) {
  return date.toISOString();
}

/**
 * Sanitize text for CSV (remove line breaks, quotes)
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
function sanitizeText(text) {
  if (!text) return '';
  return text
    .replace(/[\r\n]+/g, ' ')
    .replace(/"/g, '""')
    .trim();
}

/**
 * Main CLI handler
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  try {
    switch (command) {
      case 'save-result': {
        // Read AI detection and grading results
        const aiResult = JSON.parse(fs.readFileSync('ai-result.json', 'utf-8'));
        const gradeResult = JSON.parse(fs.readFileSync('grade-result.json', 'utf-8'));
        
        const data = {
          timestamp: formatDate(),
          studentName: args[1] || 'Unknown',
          studentId: args[2] || 'Unknown',
          studentEmail: args[3] || 'unknown@example.com',
          practicalNumber: args[4] || '1',
          totalScore: gradeResult.totalScore || 0,
          maxScore: gradeResult.criteria?.reduce((sum, c) => sum + c.maxScore, 0) || 100,
          gradeLetter: gradeResult.gradeLetter || 'F',
          aiDetected: (aiResult.aiProbability || 0) >= 50,
          aiConfidence: aiResult.aiProbability || 0,
          overallFeedback: sanitizeText(gradeResult.overallFeedback || '')
        };
        
        await saveResult(data);
        console.log('Result saved successfully');
        break;
      }
      
      case 'read-grades': {
        const grades = await readGrades();
        console.log(JSON.stringify(grades, null, 2));
        break;
      }
      
      case 'statistics': {
        const stats = await getStatistics();
        console.log(JSON.stringify(stats, null, 2));
        break;
      }
      
      case 'init': {
        ensureResultsFile();
        console.log('Results file initialized');
        break;
      }
      
      default:
        console.error(`Unknown command: ${command}`);
        console.error('Available commands: save-result, read-grades, statistics, init');
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  ensureResultsFile,
  saveResult,
  readGrades,
  getStatistics,
  formatDate,
  sanitizeText
};
