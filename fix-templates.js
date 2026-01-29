import fs from 'fs';

function simpleConvert(content) {
  // Simple regex-based conversion
  // Replace ALL backticks with quotes and ${var} with " + var + "
  let result = content.replace(/`/g, '"');
  result = result.replace(/\$\{([^}]+)\}/g, '" + ($1) + "');
  // Clean up consecutive empty strings
  result = result.replace(/"\s*\+\s*""/g, '"');
  result = result.replace(/""\s*\+\s*"/g, '"');
  return result;
}

const grader = fs.readFileSync('scripts/grader-original.js', 'utf-8');
const detector = fs.readFileSync('scripts/ai-detector-original.js', 'utf-8');

fs.writeFileSync('scripts/grader.js', simpleConvert(grader));
fs.writeFileSync('scripts/ai-detector.js', simpleConvert(detector));

console.log('Converted!');
