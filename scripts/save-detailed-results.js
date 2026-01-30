#!/usr/bin/env node
/**
 * Script to save detailed grading results to JSON file
 * Used by GitHub Actions workflow
 */

const fs = require('fs');

function main() {
  // Get environment variables
  const studentName = process.env.STUDENT_NAME || 'Unknown';
  const rollNumber = process.env.ROLL_NUMBER || 'Unknown';
  const studentEmail = process.env.STUDENT_EMAIL || 'unknown@example.com';
  const batch = process.env.BATCH || 'Unknown';
  const practicalNumber = process.env.PRACTICAL_NUMBER || '1';
  const aiPercent = process.env.AI_PERCENT || '0';
  const submissionFile = process.env.SUBMISSION_FILE || '';
  
  // Read grade result
  let gradeResult;
  try {
    gradeResult = JSON.parse(fs.readFileSync('grade-result.json', 'utf-8'));
  } catch (error) {
    console.error('Error reading grade-result.json:', error.message);
    process.exit(1);
  }
  
  // Read submission content
  let submissionContent = '';
  try {
    if (submissionFile && fs.existsSync(submissionFile)) {
      submissionContent = fs.readFileSync(submissionFile, 'utf-8');
    }
  } catch (error) {
    console.warn('Warning: Could not read submission file:', error.message);
  }
  
  // Create detailed result
  const timestamp = new Date().toISOString();
  const detailedResult = {
    ...gradeResult,
    studentName,
    rollNumber,
    email: studentEmail,
    batch,
    practicalNumber,
    timestamp,
    aiUsagePercent: parseInt(aiPercent) || 0,
    submissionText: submissionContent,
    instructorComments: ''
  };
  
  // Ensure results/details directory exists
  const detailsDir = 'results/details';
  if (!fs.existsSync('results')) {
    fs.mkdirSync('results');
  }
  if (!fs.existsSync(detailsDir)) {
    fs.mkdirSync(detailsDir);
  }
  
  // Save to file
  const detailFile = `${detailsDir}/${rollNumber}_practical_${practicalNumber}.json`;
  try {
    fs.writeFileSync(detailFile, JSON.stringify(detailedResult, null, 2));
    console.log('Detailed JSON saved successfully to:', detailFile);
  } catch (error) {
    console.error('Error saving detailed results:', error.message);
    process.exit(1);
  }
}

main();
