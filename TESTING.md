# 🧪 Testing Guide

Complete guide for testing your AI-adjusted auto-grading system before deployment.

## Prerequisites

Make sure you have:
- ✅ Node.js 20+ installed
- ✅ npm installed
- ✅ Anthropic API key
- ✅ All dependencies installed (`npm install`)

## Quick Start

```bash
# Run automated test suites
node test-ai-detection.js      # Test AI detection (6 test cases)
node test-grading.js           # Test grading module (40+ tests)
```

## Installation

### 1. Install Dependencies
```bash
cd ai-assignment-grader
npm install
```

### 2. Setup Environment
```bash
# Add your API key to environment
echo "ANTHROPIC_API_KEY=your_api_key_here" > .env

# Or set as environment variable
export ANTHROPIC_API_KEY=your_api_key_here
```

## Local Testing

### Test 1: AI Detection (0-100% Scoring)

Create a test file:
```bash
cat > test-clean.py << 'EOF'
def calculate(x, y):
    # my function for calculation
    result = x + y
    return result
EOF
```

Run AI detection:
```bash
node scripts/ai-detector.js test-clean.py
```

Expected output:
```json
{
  "aiProbability": 5,
  "confidence": "high",
  "recommendation": "PASS",
  "flaggedSections": [],
  "humanElements": [
    "Simple variable names",
    "Basic comments"
  ],
  "indicators": {
    "codePatterns": ["simple_structure"],
    "textPatterns": [],
    "languageMarkers": []
  },
  "analysis": "Clean human code with natural style",
  "timestamp": "2024-01-27T12:00:00.000Z"
}
```

### Test 2: AI Detection with High AI Content

Create AI-generated file:
```bash
cat > test-ai.py << 'EOF'
Certainly! Here's a comprehensive solution:

def calculate(x: int, y: int) -> int:
    """Calculate sum with robust error handling."""
    if not isinstance(x, (int, float)):
        raise TypeError("x must be numeric")
    if not isinstance(y, (int, float)):
        raise TypeError("y must be numeric")
    return x + y
EOF
```

Run detection:
```bash
node scripts/ai-detector.js test-ai.py
```

Expected: 85-100% AI probability, recommendation: FAIL

### Test 3: Grading Without AI Detection

```bash
# Create submission
cat > homework.py << 'EOF'
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n-1)
EOF

# Grade without AI detection
node scripts/grader.js homework.py 1
```

Expected output:
```json
{
  "baseScore": 85,
  "aiPenalty": 0,
  "finalScore": 85,
  "aiUsagePercent": 0,
  "gradeLetter": "B",
  "criteria": [...],
  "overallFeedback": "...",
  "strengths": [...],
  "improvements": [...]
}
```

### Test 4: Grading With AI Detection (AI-Adjusted)

```bash
# Step 1: Run AI detection
node scripts/ai-detector.js homework.py > ai-result.json

# Step 2: Grade with AI results
node scripts/grader.js homework.py 1 ai-result.json
```

Expected output (if 35% AI detected):
```json
{
  "baseScore": 85,
  "aiPenalty": -10,
  "finalScore": 75,
  "aiUsagePercent": 35,
  "gradeLetter": "C",
  "aiUsageNotes": "⚠️ AI Content Detected: 35%...",
  "aiPenaltyInfo": {
    "penalty": -10,
    "description": "Moderate AI use - minor penalty",
    "severity": "low",
    "requiresReview": false
  }
}
```

### Test 5: Academic Integrity Violation

```bash
# Create obviously AI-generated code
cat > violation.py << 'EOF'
Certainly! Here's a comprehensive solution with robust error handling:

def factorial(n: int) -> int:
    """Calculate factorial with complete validation."""
    if not isinstance(n, int):
        raise TypeError("Expected integer type")
    if n < 0:
        raise ValueError("Must be non-negative")
    return 1 if n <= 1 else n * factorial(n-1)
EOF

# Detect and grade
node scripts/ai-detector.js violation.py > ai-result.json
node scripts/grader.js violation.py 1 ai-result.json
```

Expected:
- AI probability: 90-100%
- Base score: 90+ (quality is good)
- AI penalty: -100 (zero score)
- Final score: 0
- Severity: critical
- Requires review: true

### Test 6: CSV Utilities

Initialize results file:
```bash
node scripts/utils.js init
```

Check statistics:
```bash
node scripts/utils.js statistics
```

Read all grades:
```bash
node scripts/utils.js read-grades
```

### Test 7: Complete Workflow Simulation

Run a complete grading cycle:
```bash
#!/bin/bash

# 1. Create test submission
cat > submission.py << 'EOF'
def multiply(a, b):
    # multiply two numbers
    return a * b
EOF

# 2. Run AI detection
echo "Running AI detection..."
node scripts/ai-detector.js submission.py > ai-result.json
AI_PROB=$(cat ai-result.json | grep -o '"aiProbability": [0-9]*' | grep -o '[0-9]*$')
echo "AI Probability: $AI_PROB%"

# 3. Run grading
echo "Running grading..."
node scripts/grader.js submission.py 1 ai-result.json > grade-result.json
BASE=$(cat grade-result.json | grep -o '"baseScore": [0-9]*' | grep -o '[0-9]*$')
FINAL=$(cat grade-result.json | grep -o '"finalScore": [0-9]*' | grep -o '[0-9]*$')
echo "Base Score: $BASE, Final Score: $FINAL"

# 4. View complete results
echo -e "\nComplete grading results:"
cat grade-result.json | jq .

echo -e "\nWorkflow complete!"
```

## Automated Test Suites

### Test Suite 1: AI Detection (test-ai-detection.js)

Run comprehensive AI detection tests:
```bash
node test-ai-detection.js
```

**Tests included:**
1. Clean code (0% AI expected)
2. AI assistance (15% AI expected)
3. Moderate AI use (35% AI expected)
4. Heavy AI dependence (70% AI expected)
5. Obvious AI signatures (90% AI expected)
6. Full AI generation (100% AI expected)

**Expected output:**
```
═══════════════════════════════════════════
   AI DETECTION TEST SUITE
═══════════════════════════════════════════

Testing: Clean Code (0% AI)
✓ Expected 0-20% AI, got 5%
  Recommendation: PASS

Testing: AI Assistance (15% AI)
✓ Expected 10-25% AI, got 15%
  Recommendation: PASS

...

Final Results: 6/6 tests passed (100%)
```

### Test Suite 2: Grading Module (test-grading.js)

Run comprehensive grading tests:
```bash
# Requires API key
ANTHROPIC_API_KEY=your_key node test-grading.js
```

**Tests included:**
- Penalty calculation (all 5 tiers)
- Boundary values (0%, 20%, 21%, 40%, 41%, 60%, 61%, 80%, 81%, 100%)
- Edge cases (negative, >100%, null)
- Full grading with AI adjustment
- Output format validation
- Student info preservation

**Expected output:**
```
═══════════════════════════════════════════
   GRADING MODULE TEST SUITE
═══════════════════════════════════════════

Testing AI Penalty Calculation
───────────────────────────────
✓ Clean Code (0% AI) → 0 penalty
✓ Acceptable AI Use (15% AI) → 0 penalty
✓ Moderate AI Use (35% AI) → -10 penalty
✓ Heavy AI Dependence (55% AI) → -25 penalty
✓ Mostly AI-Generated (72% AI) → -50 penalty
✓ Academic Integrity Violation (92% AI) → -100 penalty

Testing Edge Cases
───────────────────────────────
✓ No AI detection result → 0 penalty
✓ Boundary: 0% AI → 0 penalty
✓ Boundary: 20% AI → 0 penalty
✓ Boundary: 21% AI → -10 penalty
...

Final Results: 45/45 tests passed (100%)
```

## Testing with Different Scenarios

### Scenario 1: Clean Student Work (0% AI)
```bash
cat > clean-work.py << 'EOF'
# My solution for homework
def add(x, y):
    result = x + y
    return result
EOF

node scripts/ai-detector.js clean-work.py
# Expected: 0-10% AI, PASS

node scripts/grader.js clean-work.py 1
# Expected: No penalty, final = base score
```

### Scenario 2: AI Assistance (20% AI)
```bash
cat > assisted-work.py << 'EOF'
def add(x, y):
    """Add two numbers together"""
    return x + y

# Test
result = add(5, 3)
print(f"Result: {result}")
EOF

node scripts/ai-detector.js assisted-work.py
# Expected: 15-25% AI, PASS

node scripts/grader.js assisted-work.py 1
# Expected: No penalty (under 20% threshold)
```

### Scenario 3: Moderate AI Use (35% AI)
```bash
cat > moderate-ai.py << 'EOF'
Certainly! Here's how to add numbers:

def add(x: int, y: int) -> int:
    """Add two integers"""
    return x + y
EOF

node scripts/ai-detector.js moderate-ai.py
# Expected: 30-40% AI, REVIEW

node scripts/grader.js moderate-ai.py 1
# Expected: -10 penalty, requires attention
```

### Scenario 4: Heavy AI Dependence (60% AI)
```bash
cat > heavy-ai.py << 'EOF'
Certainly! I'll help you with that. Here's a comprehensive solution:

def add(x: int, y: int) -> int:
    """
    Add two numbers together.
    
    Args:
        x: First number
        y: Second number
        
    Returns:
        The sum of x and y
    """
    if not isinstance(x, (int, float)):
        raise TypeError("x must be numeric")
    return x + y
EOF

node scripts/ai-detector.js heavy-ai.py
# Expected: 50-70% AI, FAIL

node scripts/grader.js heavy-ai.py 1
# Expected: -25 or -50 penalty, needs review
```

### Scenario 5: Academic Integrity Violation (90% AI)
```bash
cat > violation.py << 'EOF'
Certainly! I'll provide you with a comprehensive, production-ready solution 
with robust error handling and complete documentation:

def add(first_number: int, second_number: int) -> int:
    """
    Add two numbers with comprehensive validation.
    
    This function implements addition with complete error handling
    and type validation to ensure robust operation.
    
    Args:
        first_number (int): The first operand
        second_number (int): The second operand
        
    Returns:
        int: The sum of the two numbers
        
    Raises:
        TypeError: If inputs are not numeric types
        ValueError: If inputs are infinite or invalid
        
    Examples:
        >>> add(5, 3)
        8
    """
    if not isinstance(first_number, (int, float)):
        raise TypeError(f"Expected numeric, got {type(first_number)}")
    if not isinstance(second_number, (int, float)):
        raise TypeError(f"Expected numeric, got {type(second_number)}")
    
    return first_number + second_number
EOF

node scripts/ai-detector.js violation.py
# Expected: 85-100% AI, FAIL

node scripts/grader.js violation.py 1
# Expected: Final score = 0, critical violation
```

## Testing AI Penalty Boundaries

Test each boundary to verify correct tier assignment:

```bash
# Test all boundary values
for ai in 0 20 21 40 41 60 61 80 81 100; do
  echo "{\"aiProbability\": $ai}" > ai-test.json
  echo "Testing $ai% AI..."
  node scripts/grader.js test.py 1 ai-test.json | grep -E "(aiPenalty|finalScore)"
done
```

Expected penalties:
- 0%: 0 points (tier 1)
- 20%: 0 points (tier 1)
- 21%: -10 points (tier 2)
- 40%: -10 points (tier 2)
- 41%: -25 points (tier 3)
- 60%: -25 points (tier 3)
- 61%: -50 points (tier 4)
- 80%: -50 points (tier 4)
- 81%: -100 points (tier 5 - violation)
- 100%: -100 points (tier 5 - violation)

Firstly, we must establish the primary data structures. Subsequently, 
we shall implement the algorithmic solution with careful consideration 
of edge cases and optimization opportunities.

Here is a comprehensive implementation:
[code here]
EOF

node scripts/ai-detector.js ai-work.txt
```

### Scenario 3: Different Practicals
```bash
# Test each practical rubric
for i in {1..7}; do
  echo "Testing Practical $i..."
  node scripts/grader.js submission.txt $i
done
```

## Validation Checklist

Before deploying, verify:

- [ ] AI detection runs without errors
- [ ] Grading produces valid JSON output
- [ ] All 7 rubrics load correctly
- [ ] CSV file is created and updated
- [ ] Statistics calculation works
- [ ] No API errors or rate limits hit
- [ ] Results are sensible and actionable

## Common Issues & Solutions

### Issue: "Cannot find module"
```bash
# Solution: Install dependencies
npm install
```

### Issue: "API key not found"
```bash
# Solution: Check .env file
cat .env
# Make sure ANTHROPIC_API_KEY is set correctly
```

### Issue: "Rubric not found"
```bash
# Solution: Verify rubric files exist
ls -la rubrics/
# Should show practical_1.json through practical_7.json
```

### Issue: "JSON parse error"
```bash
# Solution: Check rubric JSON syntax
node -c rubrics/practical_1.json
# or use: jq . rubrics/practical_1.json
```

## Performance Testing

Test API response times:
```bash
time node scripts/ai-detector.js test-submission.txt
time node scripts/grader.js test-submission.txt 1
```

Expected times:
- AI Detection: 2-5 seconds
- Grading: 3-7 seconds
- Total workflow: ~10 seconds

## GitHub Actions Testing

### Test Locally with Act
```bash
# Install act (GitHub Actions local runner)
# macOS: brew install act
# Windows: choco install act-cli

# Run the workflow locally
act issues --secret ANTHROPIC_API_KEY=your_key
```

### Test in GitHub
1. Push code to GitHub
2. Go to repo → Issues → New Issue
3. Use "Assignment Submission" template
4. Fill in test data
5. Submit
6. Monitor in Actions tab

## Cleanup After Testing

Remove test files:
```bash
rm -f test-submission.txt
rm -f submission.txt
rm -f clean-work.txt
rm -f ai-work.txt
rm -f *-result.json
```

Reset grades.csv:
```bash
echo "Timestamp,Student Name,Student ID,Student Email,Practical Number,Total Score,Max Score,Grade Letter,AI Detected,AI Confidence,Overall Feedback" > results/grades.csv
```

## Monitoring in Production

### View logs
```bash
# GitHub Actions logs available in:
# Repo → Actions → Select workflow run → View logs
```

### Check CSV file
```bash
cat results/grades.csv | column -t -s,
```

### Monitor API usage
- Visit: https://console.anthropic.com
- Check: Usage & billing section

## Success Criteria

Your system is ready when:
- ✅ All local tests pass
- ✅ API calls succeed
- ✅ Rubrics load correctly
- ✅ CSV updates properly
- ✅ Results are accurate and helpful
- ✅ GitHub Actions workflow completes successfully
- ✅ No errors in console/logs

## Next: Deploy to GitHub Pages

Once all tests pass, follow [QUICKSTART.md](QUICKSTART.md) to deploy!

---

**Testing Complete! Ready for deployment! 🚀**
