# 📊 AI-Adjusted Grading Module Documentation

## Overview

The grading module uses Claude 3.5 Sonnet as an LLM-judge to grade student assignments against predefined rubrics, with automatic score adjustments based on AI detection results.

## Key Features

### 1. **Rubric-Based Grading**
- Loads predefined rubrics from `/rubrics/` folder
- Criterion-by-criterion evaluation
- Detailed feedback per criterion
- Overall assessment and recommendations

### 2. **AI-Adjusted Scoring**
- Automatic penalty application based on AI detection
- Five-tier penalty system
- Academic integrity violation handling
- Transparent score breakdown

### 3. **LLM Judge Integration**
- Claude 3.5 Sonnet for fair, consistent grading
- Context-aware evaluation
- Considers AI detection results in assessment
- Learning evidence analysis

### 4. **Comprehensive Feedback**
- Criterion-specific feedback
- Overall strengths and improvements
- Technical assessment
- Learning evidence evaluation

## AI Penalty System

### Penalty Tiers

| AI Content % | Penalty | Severity | Description |
|-------------|---------|----------|-------------|
| 0-20% | 0 points | None | Acceptable AI assistance for research/ideas |
| 21-40% | -10 points | Low | Moderate AI use - minor penalty |
| 41-60% | -25 points | Medium | Heavy AI dependence - significant penalty |
| 61-80% | -50 points | High | Mostly AI-generated - major penalty |
| 81-100% | Zero score | Critical | **Academic integrity violation** |

### Penalty Application Logic

```javascript
// Example calculations:
Base Score: 85/100, AI Detection: 35% → Final: 75/100 (-10 penalty)
Base Score: 90/100, AI Detection: 55% → Final: 65/100 (-25 penalty)
Base Score: 88/100, AI Detection: 75% → Final: 38/100 (-50 penalty)
Base Score: 95/100, AI Detection: 90% → Final: 0/100 (integrity violation)
```

### Academic Integrity Violations (81-100% AI)

When AI content exceeds 80%:
- **Score:** Automatically set to 0
- **Flag:** Marked for immediate instructor review
- **Action Required:** Discussion with student
- **Outcome:** Possible resubmission or disciplinary action

## Input Format

### Command Line Usage

```bash
node scripts/grader.js <submission-file> <practical-number> [ai-result-file]
```

### Programmatic Usage

```javascript
import { gradeAssignment } from './scripts/grader.js';

const result = await gradeAssignment(
  submissionText,      // Student submission
  rubric,              // Rubric object
  aiDetectionResult,   // AI detection results (optional)
  studentInfo          // Student information (optional)
);
```

### Input Parameters

#### Student Information (Optional)
```javascript
{
  studentName: "John Doe",
  rollNumber: "2024001",
  batch: "CSE-A",
  year: "2024"
}
```

#### AI Detection Result (Optional)
```javascript
{
  aiProbability: 35,
  confidence: "medium",
  recommendation: "REVIEW",
  flaggedSections: [...],
  humanElements: [...]
}
```

## Output Format

### Complete Output Structure

```json
{
  // Scoring
  "baseScore": 85,
  "aiPenalty": -10,
  "finalScore": 75,
  "gradeLetter": "C",
  
  // AI Usage
  "aiUsagePercent": 35,
  "aiUsageNotes": "⚠️ AI Content Detected: 35%...",
  "aiPenaltyInfo": {
    "penalty": -10,
    "description": "Moderate AI use - minor penalty",
    "severity": "low",
    "requiresReview": false
  },
  
  // Criteria Breakdown
  "criteria": [
    {
      "name": "Code Correctness",
      "score": 28,
      "maxScore": 30,
      "feedback": "Solution works correctly...",
      "strengths": "Good error handling",
      "improvements": "Add more edge case tests"
    }
  ],
  
  // Overall Assessment
  "overallFeedback": "Solid work with good structure...",
  "strengths": [
    "Well-organized code",
    "Clear variable naming"
  ],
  "improvements": [
    "Add more comments",
    "Improve error messages"
  ],
  
  // Technical Analysis
  "technicalAssessment": {
    "correctness": "Solution is functionally correct",
    "codeQuality": "Good structure, minor style issues",
    "conceptUnderstanding": "Demonstrates solid understanding",
    "completeness": "All requirements met"
  },
  
  "learningEvidence": "Shows experimentation and learning progression",
  
  // Metadata
  "timestamp": "2026-01-27T12:00:00.000Z",
  "model": "claude-3-5-sonnet-20241022",
  "practicalNumber": "1",
  "practicalTitle": "Introduction to Programming",
  
  // Student Info (if provided)
  "studentInfo": {
    "studentName": "John Doe",
    "rollNumber": "2024001",
    "batch": "CSE-A"
  }
}
```

## Usage Examples

### Example 1: Basic Grading (No AI Detection)

```bash
# Create test submission
echo "def add(a, b): return a + b" > homework.py

# Grade without AI detection
node scripts/grader.js homework.py 1

# Output: Full grading without AI penalties
```

### Example 2: Grading with AI Detection

```bash
# Step 1: Run AI detection
node scripts/ai-detector.js homework.py > ai-result.json

# Step 2: Grade with AI results
node scripts/grader.js homework.py 1 ai-result.json

# Output: Grading with AI penalty applied
```

### Example 3: Programmatic Usage

```javascript
import { gradeAssignment, loadRubric } from './scripts/grader.js';
import { detectAI } from './scripts/ai-detector.js';

// Load submission
const submission = fs.readFileSync('homework.py', 'utf-8');

// Run AI detection
const aiResult = await detectAI(submission, 'Python code');

// Load rubric
const rubric = loadRubric('1');

// Grade with AI adjustment
const gradeResult = await gradeAssignment(
  submission,
  rubric,
  aiResult,
  {
    studentName: 'John Doe',
    rollNumber: '2024001'
  }
);

console.log(`Final Score: ${gradeResult.finalScore}/100`);
console.log(`AI Penalty: ${gradeResult.aiPenalty} points`);
```

### Example 4: GitHub Actions Integration

The module automatically integrates with GitHub Actions:

```yaml
- name: Grade Assignment
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
    STUDENT_NAME: ${{ env.STUDENT_NAME }}
    STUDENT_ID: ${{ env.STUDENT_ID }}
  run: |
    node scripts/grader.js submission.txt 1 ai-result.json > grade-result.json
```

## Penalty Calculation Examples

### Scenario 1: Acceptable AI Use
```
Base Score: 90/100
AI Detection: 15%
Penalty Tier: 0-20% → 0 points
Final Score: 90/100 ✅
Note: "AI Usage: 15% detected. Within acceptable limits."
```

### Scenario 2: Moderate AI Use
```
Base Score: 88/100
AI Detection: 35%
Penalty Tier: 21-40% → -10 points
Final Score: 78/100 ⚠️
Note: "35% AI-detected. Penalty: -10 points. Moderate AI use."
```

### Scenario 3: Heavy AI Dependence
```
Base Score: 92/100
AI Detection: 55%
Penalty Tier: 41-60% → -25 points
Final Score: 67/100 ⚠️
Note: "55% AI-detected. Penalty: -25 points. Heavy AI dependence."
```

### Scenario 4: Mostly AI-Generated
```
Base Score: 95/100
AI Detection: 70%
Penalty Tier: 61-80% → -50 points
Final Score: 45/100 🚨
Note: "70% AI-detected. Penalty: -50 points. Requires review."
```

### Scenario 5: Academic Integrity Violation
```
Base Score: 98/100
AI Detection: 92%
Penalty Tier: 81-100% → Zero score
Final Score: 0/100 🚨
Note: "ACADEMIC INTEGRITY VIOLATION. Requires immediate review."
```

## LLM Judge System

### Grading Approach

The Claude LLM-judge:
1. **Evaluates Quality**: Grades the actual work quality objectively
2. **Assesses Understanding**: Determines if student demonstrates learning
3. **Provides Feedback**: Offers specific, actionable improvements
4. **Considers Context**: Takes AI detection into account for learning evidence

### System Prompt Design

The grader uses a specialized system prompt:
- Acts as expert instructor
- Provides fair, constructive feedback
- Focuses on learning objectives
- Does NOT apply AI penalties (handled separately)
- Assesses work quality independently

### Enhanced with AI Context

When AI results are provided:
- Shows flagged sections to judge
- Highlights human elements
- Asks judge to assess learning evidence
- Helps identify understanding vs copying

## Configuration

### Environment Variables

```bash
# Required
ANTHROPIC_API_KEY=your_claude_api_key

# Optional (from GitHub Actions)
STUDENT_NAME=John Doe
STUDENT_ID=2024001
STUDENT_BATCH=CSE-A
STUDENT_YEAR=2024
PRACTICAL_NUMBER=1
```

### Customizing Penalty Tiers

Edit `scripts/grader.js`:

```javascript
const AI_PENALTY_TIERS = [
  { min: 0, max: 20, penalty: 0, description: 'Acceptable' },
  { min: 21, max: 40, penalty: -10, description: 'Moderate' },
  { min: 41, max: 60, penalty: -25, description: 'Heavy' },
  { min: 61, max: 80, penalty: -50, description: 'Mostly AI' },
  { min: 81, max: 100, penalty: -100, description: 'Violation' }
];
```

### Modifying Rubrics

Rubrics are in `/rubrics/practical_X.json`:

```json
{
  "practicalNumber": "1",
  "title": "Assignment Title",
  "description": "Assignment description",
  "totalPoints": 100,
  "criteria": [
    {
      "name": "Criterion Name",
      "points": 30,
      "description": "What to assess"
    }
  ]
}
```

## Error Handling

### API Errors
- **401 Unauthorized**: Invalid API key
- **429 Rate Limited**: Too many requests
- **Network errors**: Timeout or connection issues

### Fallback Behavior
If grading fails:
```json
{
  "totalScore": 0,
  "baseScore": 0,
  "finalScore": 0,
  "gradeLetter": "F",
  "overallFeedback": "Grading error. Manual review required."
}
```

### Missing AI Results
If `ai-result.json` not found:
- Grades without AI penalty
- Uses base score as final score
- Notes that AI detection wasn't performed

## Performance

- **Grading Time**: 5-10 seconds per submission
- **API Cost**: ~$0.01-$0.02 per grading
- **Tokens Used**: 1000-2000 per submission
- **Accuracy**: Consistent with Claude 3.5 Sonnet quality

## Best Practices

### For Instructors

1. **Review High Penalties**: Always review submissions with >40% AI
2. **Check Flagged Sections**: Verify AI-flagged code matches grade
3. **Consider Context**: Compare with student's typical work
4. **Use as Tool**: LLM-judge supplements, doesn't replace judgment
5. **Discuss Results**: Talk with students about AI usage

### For Students

1. **Understand Limits**: 0-20% AI is acceptable
2. **Use AI Wisely**: For research and ideas, not complete solutions
3. **Show Work**: Include comments showing your thought process
4. **Original Code**: Write in your own style
5. **Ask Questions**: If confused, ask instructor, don't just use AI

### For System Administrators

1. **Monitor API Usage**: Track costs in Anthropic Console
2. **Set Rate Limits**: Prevent abuse with GitHub Actions limits
3. **Review Violations**: Follow up on 81-100% AI detections
4. **Update Rubrics**: Keep criteria current with course goals
5. **Backup Results**: Export CSV regularly

## Testing

### Test Grading Without AI

```bash
# Create clean submission
cat > test-clean.py << 'EOF'
def calculate_sum(x, y):
    # add numbers
    total = x + y
    return total
EOF

# Grade
node scripts/grader.js test-clean.py 1
```

Expected: Base score = Final score (no penalty)

### Test Grading With AI Detection

```bash
# Create AI-heavy submission
cat > test-ai.py << 'EOF'
Certainly! Here's a comprehensive solution:

def calculate_sum(first_number: int, second_number: int) -> int:
    """Calculate sum with robust error handling."""
    result = first_number + second_number
    return result
EOF

# Detect AI
node scripts/ai-detector.js test-ai.py > ai-result.json

# Grade with AI results
node scripts/grader.js test-ai.py 1 ai-result.json
```

Expected: Significant penalty applied

### Test Academic Integrity Violation

```bash
# Simulate high AI content (manually edit ai-result.json)
echo '{"aiProbability": 95}' > ai-result.json

# Grade
node scripts/grader.js submission.py 1 ai-result.json
```

Expected: Final score = 0, violation flagged

## Troubleshooting

### Issue: Penalties too harsh
**Solution**: Adjust penalty tiers in `AI_PENALTY_TIERS`

### Issue: False positives on good students
**Solution**: Review flagged sections manually, consider student history

### Issue: Inconsistent grading
**Solution**: Using `temperature: 0` ensures consistency (already configured)

### Issue: API timeouts
**Solution**: Check network, verify API key, reduce submission size

## Integration with Dashboard

The instructor dashboard automatically displays:
- Base scores before AI penalty
- AI penalty amounts
- Final adjusted scores
- Penalty severity indicators
- Review flags for high AI content

## Academic Integrity Workflow

### For 81-100% AI Detections:

1. **Automatic Actions**:
   - Score set to 0
   - Submission flagged
   - Issue labeled "needs-review"

2. **Instructor Actions**:
   - Review submission and AI analysis
   - Meet with student
   - Discuss academic integrity
   - Determine consequences

3. **Possible Outcomes**:
   - Resubmission allowed
   - Grade penalty confirmed
   - Academic integrity process initiated

## Future Enhancements

- [ ] Custom penalty tiers per assignment
- [ ] Graduated penalties for repeat offenders
- [ ] Appeal process integration
- [ ] Historical trend analysis
- [ ] Adaptive penalty based on course level
- [ ] Integration with LMS grade books

## Support & Documentation

- **Full API Docs**: [README.md](README.md)
- **AI Detection**: [AI_DETECTION.md](AI_DETECTION.md)
- **Testing Guide**: [TESTING.md](TESTING.md)
- **Quick Reference**: [AI_DETECTION_QUICKREF.md](AI_DETECTION_QUICKREF.md)

---

**Remember**: AI-adjusted grading promotes fair assessment while encouraging proper AI tool usage for learning.
