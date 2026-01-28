import re

def convert_template_literal(match):
    content = match.group(1)
    
    # Handle multi-line strings by converting newlines to \\n
    lines = content.split('\n')
    
    if len(lines) > 1:
        # Multi-line template literal - convert to concatenated strings
        result_parts = []
        for line in lines:
            # Replace ${var} with " + var + "
            converted_line = re.sub(r'\$\{([^}]+)\}', r'" + (\1) + "', line)
            if converted_line.strip():
                result_parts.append('"' + converted_line + '\\n"')
        
        if result_parts:
            result = ' +\n        '.join(result_parts)
            # Clean up
            result = re.sub(r'"\s*\+\s*""', '"', result)
            result = re.sub(r'""\s*\+\s*"', '"', result)
            result = re.sub(r'"\s*\+\s*\(', '(', result)
            result = re.sub(r'\)\s*\+\s*"', ') + "', result)
            return result
        return '""'
    else:
        # Single line template literal
        result = re.sub(r'\$\{([^}]+)\}', r'" + (\1) + "', content)
        result = '"' + result + '"'
        result = re.sub(r'"\s*\+\s*""', '"', result)
        result = re.sub(r'""\s*\+\s*"', '"', result)
        return result

def convert_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Convert template literals
    content = re.sub(r'`([^`]*)`', convert_template_literal, content, flags=re.DOTALL)
    
    return content

# Convert both files
grader_content = convert_file('scripts/grader.js')
detector_content = convert_file('scripts/ai-detector.js')

# Write back
with open('scripts/grader.js', 'w', encoding='utf-8') as f:
    f.write(grader_content)

with open('scripts/ai-detector.js', 'w', encoding='utf-8') as f:
    f.write(detector_content)

print("Conversion complete!")
