import fs from 'fs';

function convertTemplateLiterals(content) {
  // Replace template literals with string concatenation
  // This is a simple conversion that handles most cases
  
  let result = content;
  
  // Find all template literals and convert them
  const regex = /`([^`]*\$\{[^`]*\}[^`]*)`/g;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    const templateLiteral = match[0];
    const innerContent = match[1];
    
    // Convert ${variable} to " + variable + "
    let converted = innerContent.replace(/\$\{([^}]+)\}/g, '" + ($1) + "');
    
    // Handle newlines
    converted = converted.replace(/\\n/g, '\\n');
    
    // Wrap in quotes and clean up
    converted = '"' + converted + '"';
    
    // Clean up empty concatenations
    converted = converted.replace(/" \+ "" \+ "/g, '" + "');
    converted = converted.replace(/^"" \+ /g, '');
    converted = converted.replace(/ \+ ""$/g, '');
    
    result = result.replace(templateLiteral, converted);
  }
  
  // Handle simple template literals without variables
  result = result.replace(/`([^`$]*)`/g, '"$1"');
  
  return result;
}

// Convert grader.js
const graderContent = fs.readFileSync('scripts/grader.js', 'utf-8');
const convertedGrader = convertTemplateLiterals(graderContent);
fs.writeFileSync('scripts/grader-fixed.js', convertedGrader);

// Convert ai-detector.js
const detectorContent = fs.readFileSync('scripts/ai-detector.js', 'utf-8');
const convertedDetector = convertTemplateLiterals(detectorContent);
fs.writeFileSync('scripts/ai-detector-fixed.js', convertedDetector);

console.log('Conversion complete. Check grader-fixed.js and ai-detector-fixed.js');
