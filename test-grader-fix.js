// Test script to verify grader.js extractStudentInfo fix

// This is the problematic content - has "- Name: John Smith" in body within first 20 lines
const testContent4 = `STUDENT_NAME: Ajay
STUDENT_ID: 2024CS004
STUDENT_EMAIL: ajay@example.com
BATCH: 2024
PRACTICAL: 1

# Practical 1: Basic Prompt Engineering

### Prompt 1: Information Extraction
**Prompt:** "Extract info: 'John Smith, age 30, lives in New York.'"

**Response:**
- Name: John Smith
- Age: 30
- Location: New York
`;

// OLD buggy extraction function
function extractStudentInfoOLD(text) {
  const info = { studentName: '', studentId: '', studentEmail: '', batch: '', practical: '' };
  const lines = text.split('\n').slice(0, 20);  // 20 lines - TOO MANY!
  
  for (const line of lines) {
    const upper = line.toUpperCase();
    if (upper.includes('STUDENT_NAME:') || upper.includes('NAME:')) {  // TOO LOOSE!
      info.studentName = line.split(':')[1].trim();
    } else if (upper.includes('STUDENT_ID:') || upper.includes('ID:')) {
      info.studentId = line.split(':')[1].trim();
    } else if (upper.includes('STUDENT_EMAIL:') || upper.includes('EMAIL:')) {
      info.studentEmail = line.split(':')[1].trim();
    } else if (upper.includes('BATCH:')) {
      info.batch = line.split(':')[1].trim();
    } else if (upper.includes('PRACTICAL:')) {
      info.practical = line.split(':')[1].trim();
    }
  }
  return info;
}

// NEW fixed extraction function
function extractStudentInfoNEW(text) {
  const info = { studentName: '', studentId: '', studentEmail: '', batch: '', practical: '' };
  const lines = text.split('\n').slice(0, 10);  // Only first 10 lines (header section)
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Strict regex - must start at beginning of line with proper header format
    const studentNameMatch = trimmedLine.match(/^STUDENT[_\s]?NAME\s*:\s*(.+)$/i);
    const studentIdMatch = trimmedLine.match(/^(?:STUDENT[_\s]?ID|ROLL[_\s]?(?:NUMBER|NO|NUM)?)\s*:\s*(.+)$/i);
    const studentEmailMatch = trimmedLine.match(/^(?:STUDENT[_\s]?EMAIL|EMAIL)\s*:\s*(.+)$/i);
    const batchMatch = trimmedLine.match(/^BATCH\s*:\s*(.+)$/i);
    const practicalMatch = trimmedLine.match(/^(?:PRACTICAL|ASSIGNMENT)(?:\s*(?:NUMBER|NO|NUM))?\s*:\s*(.+)$/i);
    
    if (studentNameMatch && !info.studentName) info.studentName = studentNameMatch[1].trim();
    else if (studentIdMatch && !info.studentId) info.studentId = studentIdMatch[1].trim();
    else if (studentEmailMatch && !info.studentEmail) info.studentEmail = studentEmailMatch[1].trim();
    else if (batchMatch && !info.batch) info.batch = batchMatch[1].trim();
    else if (practicalMatch && !info.practical) info.practical = practicalMatch[1].trim();
  }
  return info;
}

console.log('=== CRITICAL BUG TEST: Ajay vs John Smith ===\n');
console.log('This file has "- Name: John Smith" on line 14 (within first 20 lines)\n');

const oldResult = extractStudentInfoOLD(testContent4);
const newResult = extractStudentInfoNEW(testContent4);

console.log('OLD extractor (BUGGY):');
console.log('  Student Name:', oldResult.studentName);
console.log('  Student ID:', oldResult.studentId);

console.log('\nNEW extractor (FIXED):');
console.log('  Student Name:', newResult.studentName);
console.log('  Student ID:', newResult.studentId);

console.log('\n=== RESULT ===');
if (oldResult.studentName === 'John Smith' && newResult.studentName === 'Ajay') {
    console.log('✅ SUCCESS! Bug reproduced and FIXED!');
    console.log('   - OLD code incorrectly returned "John Smith"');
    console.log('   - NEW code correctly returns "Ajay"');
} else if (newResult.studentName === 'Ajay') {
    console.log('✅ SUCCESS! New extractor correctly returns "Ajay"');
} else {
    console.log('❌ FAIL! Expected "Ajay" but got:', newResult.studentName);
}
