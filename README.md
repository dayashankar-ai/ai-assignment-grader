# AI Assignment Auto-Grader

🤖 **Fully automated grading system for AI/ML course practicals with zero teacher intervention**

## Overview

This system automatically grades student programming assignments using Claude AI, detects AI-generated content, applies penalties, and maintains a comprehensive grade dashboard. The entire process is automated through GitHub Actions.

## Key Features

✅ **Zero Teacher Intervention** - Fully automated from submission to grading to reporting  
✅ **AI Content Detection** - Identifies AI-generated submissions with 5-tier penalty system  
✅ **Rubric-Based Grading** - Uses detailed rubrics for each practical assignment  
✅ **Student Portal** - Web-based submission interface with drag-and-drop  
✅ **Real-Time Dashboards** - Live student and instructor dashboards  
✅ **Comprehensive Feedback** - Detailed criteria analysis, strengths, and improvements  
✅ **Learning Evidence Detection** - Identifies authentic student work indicators  
✅ **Retry Logic** - Handles API failures gracefully with 3 retries  
✅ **Professional Error Handling** - Validates inputs, logs progress, handles edge cases  

## Architecture

### Components

1. **GitHub Actions Workflow** (`.github/workflows/grade.yml`)
   - Triggers on submission file push
   - Runs AI detection and grading scripts
   - Saves results to CSV
   - Updates dashboards automatically

2. **AI Detector** (`scripts/ai-detector.js`)
   - Analyzes submissions for AI-generated content
   - Returns probability, confidence, and indicators
   - Uses Claude API for intelligent detection

3. **Grader** (`scripts/grader.js`)
   - Grades based on rubric criteria
   - Extracts student information from headers
   - Applies AI penalties (0 to -100 points)
   - Generates detailed feedback

4. **Rubrics** (`rubrics/practical_1-7.json`)
   - 7 practical assignments for AI course
   - Detailed criteria with point values
   - AI usage policies

5. **Dashboards**
   - **Student Portal** (`submit.html`) - Submit assignments
   - **Student Dashboard** (`index.html`) - View grades
   - **Instructor Dashboard** (`instructor.html`) - Analytics and flagged submissions

## Setup Instructions

### 1. Prerequisites
- GitHub repository (public or private)
- Anthropic Claude API key
- Node.js 20+ (for local testing)

### 2. Configuration

1. **Add API Key to GitHub Secrets**
   - Go to Settings → Secrets and variables → Actions
   - Add secret: `ANTHROPIC_API_KEY` = your Claude API key

2. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Source: Deploy from branch `main`
   - Folder: `/` (root)
   - Save

3. **Set Repository Permissions**
   - Go to Settings → Actions → General
   - Workflow permissions: Read and write permissions
   - Save

### 3. For Students

1. **Submit via Portal**
   - Visit: `https://YOUR_USERNAME.github.io/ai-assignment-grader/submit.html`
   - Configure GitHub token (one-time setup)
   - Drag and drop submission file
   - Click Submit

2. **Submission File Format**
   ```
   STUDENT_NAME: Your Full Name
   STUDENT_ID: 2024CS123
   STUDENT_EMAIL: you@university.edu
   BATCH: 2024
   PRACTICAL: 1

   [Your assignment content here]
   ```

3. **View Grades**
   - Visit: `https://YOUR_USERNAME.github.io/ai-assignment-grader/`
   - See your grades, feedback, and AI detection results

### 4. For Instructors

1. **View Dashboard**
   - Visit: `https://YOUR_USERNAME.github.io/ai-assignment-grader/instructor.html`
   - See statistics, grade distribution, flagged submissions

2. **Monitor Workflow**
   - Go to Actions tab in GitHub
   - Check workflow runs (should take 2-3 minutes)
   - Review logs for detailed grading information

## Local Testing

```bash
# Install dependencies
npm install

# Set API key
export ANTHROPIC_API_KEY=your_key_here

# Test AI detection
node scripts/ai-detector.js submissions/test.txt

# Test grading
node scripts/grader.js submissions/test.txt 1

# Full workflow test
node scripts/ai-detector.js submissions/test.txt > ai-result.json
node scripts/grader.js submissions/test.txt 1 ai-result.json
```

## Development Phases

The system was built iteratively:

- **Phase 1**: Minimal working scripts without template literals
- **Phase 2**: Rubric integration and AI penalty system
- **Phase 3**: Formatted output for readability
- **Phase 4**: Retry logic and error handling (3 attempts, 2s delays)
- **Phase 5**: Student info extraction from submission headers
- **Phase 6**: CSV output formatting with student metadata
- **Phase 7**: Detailed criteria feedback and learning evidence detection
- **Phase 8**: Professional refinements - validation, logging, edge cases

## Grading Process

```
Student submits → AI Detection → Rubric Grading → Apply Penalties → Calculate Final Grade → Save to CSV → Update Dashboards
```

### AI Penalty Tiers
- **0-20%**: No penalty
- **21-40%**: -10 points (low)
- **41-60%**: -25 points (medium)
- **61-80%**: -50 points (high)
- **81-100%**: -100 points (critical) - Automatic F

### Grade Scale
- **A**: 90-100 points
- **B**: 80-89 points
- **C**: 70-79 points
- **D**: 60-69 points
- **F**: 0-59 points

## Technical Specifications

- **Language**: Node.js (ES modules)
- **API**: Anthropic Claude Sonnet 4.5
- **Model**: claude-3-5-sonnet-20241022
- **Temperature**: 0 (deterministic)
- **Max Tokens**: 2048
- **Workflow**: GitHub Actions, ubuntu-latest, Node 20
- **Retries**: 3 attempts (workflow + script level)

## Repository Structure

```
ai-assignment-grader/
├── .github/workflows/grade.yml  # Automated workflow
├── scripts/
│   ├── grader.js               # Main grader (380+ lines)
│   └── ai-detector.js          # AI detector (180+ lines)
├── rubrics/practical_1-7.json  # 7 rubrics
├── submissions/                # Student files
├── results/grades.csv          # Grade database
├── index.html                  # Student dashboard
├── instructor.html             # Instructor dashboard
├── submit.html                 # Submission portal
└── README.md                   # This file
```

## Troubleshooting

**Workflow not running?**
- Check file is in `submissions/` folder
- Verify `.txt` format
- Check Actions tab for errors

**Grading failing?**
- Scripts have retry logic (3 attempts)
- Check workflow logs for details
- Verify API key in Secrets

**CSV not updating?**
- Check workflow write permissions
- Look for merge conflicts
- Review git commit step in logs

## API Usage & Costs

Estimated per submission:
- AI Detection: ~700 tokens
- Grading: ~2300 tokens
- **Total**: ~3000 tokens ≈ $0.01-0.02

For 50 students × 7 practicals = 350 submissions ≈ **$3.50-7.00 total**

## Limitations

- Requires internet for API calls
- API rate limits may affect bulk grading
- Detection accuracy depends on content quality
- Cannot detect heavily edited AI content
- CSV conflicts possible with simultaneous submissions

## License

MIT License - Free for educational use

## Status

**Production Ready** ✅  
**Version**: 1.0.0  
**Last Updated**: 2024

---

Built iteratively from scratch using Claude AI, Node.js, and GitHub Actions for zero-intervention automated grading.
