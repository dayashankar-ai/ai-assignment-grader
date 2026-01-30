// Test script to verify the new regex patterns work correctly

const testContent1 = `Student Name: Alice Johnson
Roll Number: 2024CS008
Batch: 2024
Email: alice.johnson@example.com
Practical Number: 1

# My Assignment Content
`;

const testContent2 = `STUDENT_NAME: Bob Kumar
STUDENT_ID: 2024CS009
STUDENT_EMAIL: bob@example.com
BATCH: 2024
PRACTICAL: 2

# My Assignment Content
`;

const testContent3 = `Name: Carol Lee
ID: 2024CS010
Email: carol@example.com
Batch: 2024
Assignment Number: 3

# My Assignment Content
`;

function testExtraction(content, label) {
    console.log(`\n=== Testing: ${label} ===`);
    
    // Test name extraction
    const nameMatch = content.match(/(?:STUDENT[_\s]?NAME|NAME)\s*:\s*(.+)/i);
    console.log('Name:', nameMatch ? nameMatch[1].trim() : 'NOT FOUND');

    // Test ID extraction  
    const idMatch = content.match(/(?:STUDENT[_\s]?ID|ROLL[_\s]?(?:NUMBER|NO|NUM)?|ID)\s*:\s*(.+)/i);
    console.log('ID:', idMatch ? idMatch[1].trim() : 'NOT FOUND');

    // Test email extraction
    const emailMatch = content.match(/(?:STUDENT[_\s]?EMAIL|EMAIL)\s*:\s*(.+)/i);
    console.log('Email:', emailMatch ? emailMatch[1].trim() : 'NOT FOUND');

    // Test batch extraction
    const batchMatch = content.match(/BATCH\s*:\s*(\d+)/i);
    console.log('Batch:', batchMatch ? batchMatch[1] : 'NOT FOUND');

    // Test practical extraction
    const practicalMatch = content.match(/(?:PRACTICAL|ASSIGNMENT)(?:\s*(?:NUMBER|NO|NUM))?\s*:\s*(\d+)/i);
    console.log('Practical:', practicalMatch ? practicalMatch[1] : 'NOT FOUND');
}

function testHeaderRemoval(content, label) {
    console.log(`\n=== Testing Header Removal: ${label} ===`);
    console.log('BEFORE:');
    console.log(content.split('\n').slice(0, 6).join('\n'));
    
    let cleaned = content;
    cleaned = cleaned.replace(/^(?:STUDENT[_\s]?NAME|NAME)\s*:\s*.+$/gim, '');
    cleaned = cleaned.replace(/^(?:STUDENT[_\s]?ID|ROLL[_\s]?(?:NUMBER|NO|NUM)?|ID)\s*:\s*.+$/gim, '');
    cleaned = cleaned.replace(/^(?:STUDENT[_\s]?EMAIL|EMAIL)\s*:\s*.+$/gim, '');
    cleaned = cleaned.replace(/^BATCH\s*:\s*.+$/gim, '');
    cleaned = cleaned.replace(/^(?:PRACTICAL|ASSIGNMENT)(?:\s*(?:NUMBER|NO|NUM))?\s*:\s*.+$/gim, '');
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();
    
    console.log('\nAFTER:');
    console.log(cleaned);
}

testExtraction(testContent1, 'Format 1: "Student Name:" with spaces');
testExtraction(testContent2, 'Format 2: "STUDENT_NAME:" with underscore');
testExtraction(testContent3, 'Format 3: "Name:" simple format');

testHeaderRemoval(testContent1, 'Format 1');
testHeaderRemoval(testContent2, 'Format 2');

console.log('\n=== All tests completed! ===');
