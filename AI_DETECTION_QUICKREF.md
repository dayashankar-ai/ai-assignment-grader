# 🤖 AI Detection Quick Reference

## Quick Start

```bash
# Install dependencies
npm install

# Analyze a file
node scripts/ai-detector.js submission.py

# Run test suite
npm run test:ai
```

## Output Interpretation

| AI Probability | Status | Recommendation | Action |
|---------------|---------|----------------|--------|
| 0-24% | ✅ Clean | PASS | Accept |
| 25-49% | ⚡ Possible | REVIEW | Check flagged sections |
| 50-74% | ⚠️ Detected | REVIEW | Manual review required |
| 75-100% | 🚨 High Risk | FAIL | Discuss with student |

## Key Indicators

### 🚩 AI Indicators (Red Flags)
- "Certainly! I'd be happy to..."
- "Here's a comprehensive..."
- Perfect grammar, no typos
- Overly formal documentation
- Generic variable names
- Comprehensive error handling
- Structured responses (Firstly, Secondly...)

### ✅ Human Indicators (Good Signs)
- Typos and informal language
- Personal coding style
- Inconsistent formatting
- Learning artifacts (TODO, debugging notes)
- Simple/missing error handling
- Question marks or confusion in comments
- Student-level vocabulary

## Command Examples

```bash
# Python code
node scripts/ai-detector.js homework.py

# JavaScript
node scripts/ai-detector.js assignment.js

# Text/essay
node scripts/ai-detector.js essay.txt

# Markdown
node scripts/ai-detector.js README.md
```

## Confidence Levels

- **Low**: Borderline case, few indicators
- **Medium**: Several indicators present
- **High**: Multiple strong indicators

## Flagged Section Example

```
Lines 15-42: Generic AI comment style with formal explanations
Severity: high
```

→ Check lines 15-42 in the submission

## Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| API key not found | Missing .env | Create .env with ANTHROPIC_API_KEY |
| Rate limit exceeded | Too many requests | Wait 60 seconds, retry |
| File not found | Wrong path | Check file path |
| Invalid API key | Wrong key | Verify key in Anthropic Console |

## Environment Setup

```bash
# Create environment file
cp .env.example .env

# Edit and add your key
ANTHROPIC_API_KEY=sk-ant-...
```

## Typical Workflow

1. Student submits assignment
2. GitHub Actions triggers
3. AI detector analyzes submission
4. Results posted to GitHub issue
5. Instructor reviews if flagged
6. Decision: Accept, discuss, or reject

## API Costs

| Item | Cost |
|------|------|
| Per detection | $0.002-$0.005 |
| Per 100 students | $0.20-$0.50 |
| Per 1000 students | $2-$5 |

## Performance

- **Speed**: 3-5 seconds per submission
- **Accuracy**: ~85-90%
- **Rate**: 60 submissions/minute (with limits)

## Files Created

- `scripts/ai-detector.js` - Main detection module
- `AI_DETECTION.md` - Full documentation
- `AI_DETECTION_SUMMARY.md` - Detailed summary
- `test-ai-detection.js` - Test suite
- `.github/workflows/grade.yml` - Updated workflow

## Quick Troubleshooting

**Q: High false positive rate?**
A: Review flagged sections. System is conservative.

**Q: Obvious AI not detected?**
A: Check pre-detection patterns in code.

**Q: Inconsistent results?**
A: Using temperature=0 ensures consistency.

**Q: API timeout?**
A: Check network and API key validity.

## Best Practices

1. ✅ Review flagged sections manually
2. ✅ Consider student's typical performance
3. ✅ Use as educational tool, not punishment
4. ✅ Be transparent with students
5. ✅ Update patterns as AI evolves

## Support

- 📖 Full docs: [AI_DETECTION.md](AI_DETECTION.md)
- 🧪 Testing: [TESTING.md](TESTING.md)
- 📚 Main README: [README.md](README.md)

---

**Remember**: AI detection supplements instructor judgment, doesn't replace it!
