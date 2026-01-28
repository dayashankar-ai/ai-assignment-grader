import fs from 'fs';

function convertFile(filename) {
  let content = fs.readFileSync(filename, 'utf-8');
  
  let inTemplate = false;
  let result = '';
  let i = 0;
  
  while (i < content.length) {
    if (content[i] === '`') {
      if (!inTemplate) {
        // Start of template literal
        inTemplate = true;
        result += '"';
        i++;
      } else {
        // End of template literal
        inTemplate = false;
        result += '"';
        i++;
      }
    } else if (inTemplate && content[i] === '$' && content[i+1] === '{') {
      // Found ${...}
      result += '" + (';
      i += 2;
      let depth = 1;
      while (i < content.length && depth > 0) {
        if (content[i] === '{') depth++;
        if (content[i] === '}') depth--;
        if (depth > 0) result += content[i];
        i++;
      }
      result += ') + "';
    } else if (inTemplate && content[i] === '\r' && content[i+1] === '\n') {
      // Windows line ending in template literal
      result += '\\n';
      i += 2;
      // Skip indentation whitespace
      while (i < content.length && (content[i] === ' ' || content[i] === '\t')) {
        i++;
      }
    } else if (inTemplate && content[i] === '\n') {
      // Unix line ending in template literal
      result += '\\n';
      i++;
      // Skip indentation whitespace
      while (i < content.length && (content[i] === ' ' || content[i] === '\t')) {
        i++;
      }
    } else if (inTemplate && content[i] === '\\' && content[i+1] === 'n') {
      // Already escaped \\n in the source
      result += '\\n';
      i += 2;
    } else {
      result += content[i];
      i++;
    }
  }
  
  // Clean up empty concatenations
  result = result.replace(/""\s*\+\s*/g, '');
  result = result.replace(/\s*\+\s*""/g, '');
  result = result.replace(/"\s*\+\s*"/g, '');
  
  return result;
}

const graderFixed = convertFile('scripts/grader-original.js');
const detectorFixed = convertFile('scripts/ai-detector-original.js');

fs.writeFileSync('scripts/grader.js', graderFixed);
fs.writeFileSync('scripts/ai-detector.js', detectorFixed);

console.log('Done!');
