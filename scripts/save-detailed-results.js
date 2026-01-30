#!/usr/bin/env node
/**
 * Script to save detailed grading results to JSON file
 * Used by GitHub Actions workflow
 */

const fs = require('fs');
const path = require('path');

function main() {
  console.log('Starting save-detailed-results.js...');
  console.log('Current working directory:', process.cwd());
  
  // Get environment variables
  const studentName = process.env.STUDENT_NAME || 'Unknown';
  const rollNumber = process.env.ROLL_NUMBER || 'Unknown';
  const studentEmail = process.env.STUDENT_EMAIL || 'unknown@example.com';
  const batch = process.env.BATCH || 'Unknown';
  const practicalNumber = process.env.PRACTICAL_NUMBER || '1';
  const aiPercent = process.env.AI_PERCENT || '0';
  const submissionFile = process.env.SUBMISSION_FILE || '';
  
  console.log('Environment variables:');
  console.log('  STUDENT_NAME:', studentName);
  console.log('  ROLL_NUMBER:', rollNumber);
  console.log('  PRACTICAL_NUMBER:', practicalNumber);
  console.log('  SUBMISSION_FILE:', submissionFile);
  
  // Read grade result
  let gradeResult;
  const gradeFile = 'grade-result.json';
  console.log('Looking for grade file:', gradeFile);
  console.log('File exists:', fs.existsSync(gradeFile));
  
  try {
    gradeResult = JSON.parse(fs.readFileSync(gradeFile, 'utf-8'));
    console.log('Grade result loaded successfully');
  } catch (error) {
    console.error('Error reading grade-result.json:', error.message);
    // Create a basic result if grade file is missing
    gradeResult = {
      totalScore: 0,
      baseScore: 0,
      finalScore: 0,
      gradeLetter: 'F',
      overallFeedback: 'Grading result file not found',
      criteria: [],
      strengths: [],
      improvements: []
    };
  }
  
  // Read submission content
  let submissionContent = '';
  if (submissionFile) {
    console.log('Looking for submission file:', submissionFile);
    console.log('Submission file exists:', fs.existsSync(submissionFile));
    try {
      if (fs.existsSync(submissionFile)) {
        submissionContent = fs.readFileSync(submissionFile, 'utf-8');
        console.log('Submission content loaded, length:', submissionContent.length);
      }
    } catch (error) {
      console.warn('Warning: Could not read submission file:', error.message);
    }
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
    console.log('Creating results directory...');
    fs.mkdirSync('results');
  }
  if (!fs.existsSync(detailsDir)) {
    console.log('Creating results/details directory...');
    fs.mkdirSync(detailsDir, { recursive: true });
  }
  
  // Save to file
  const detailFile = path.join(detailsDir, `${rollNumber}_practical_${practicalNumber}.json`);
  console.log('Saving to:', detailFile);
  console.log('Result keys:', Object.keys(detailedResult));
  
  try {
    fs.writeFileSync(detailFile, JSON.stringify(detailedResult, null, 2));
    console.log('✅ Detailed JSON saved successfully to:', detailFile);
    
    // Verify file was saved
    if (fs.existsSync(detailFile)) {
      const stats = fs.statSync(detailFile);
      console.log('✅ File verified, size:', stats.size, 'bytes');
      
      // List directory contents
      console.log('Files in results/details/:');
      const files = fs.readdirSync(detailsDir);
      files.forEach(f => console.log('  -', f));
    }
  } catch (error) {
    console.error('Error saving detailed results:', error.message);
    console.log('⚠️ Detailed JSON save failed but continuing...');
    // Don't exit with error - allow workflow to continue
  }
}

try {
  main();
} catch (error) {
  console.error('Unexpected error in save-detailed-results.js:', error.message);
  // Don't exit with error - allow workflow to continue
}
