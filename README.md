# 🎓 AI Assignment Auto-Grader

An automated grading system for student assignments with AI detection, powered by GitHub Pages and Claude API.

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue)](https://github.com)
[![Claude API](https://img.shields.io/badge/Claude-API-purple)](https://www.anthropic.com)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org)

## 📋 Features

- **Student Submission Portal** - Simple web interface for submitting assignments
- **AI Content Detection** - Automatic detection of AI-generated content using Claude
- **Automated Grading** - AI-powered grading based on custom rubrics
- **Instructor Dashboard** - View all submissions, grades, and statistics
- **GitHub Actions Integration** - Serverless backend processing
- **CSV Export** - Download all grades for record-keeping
- **Real-time Results** - Students receive feedback within minutes

## 🚀 Quick Start

### Prerequisites

- Node.js 20 or higher
- GitHub repository with Actions enabled
- Anthropic API key (Claude)

### Installation

1. **Clone or fork this repository**
   ```bash
   git clone <your-repo-url>
   cd ai-assignment-grader
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up GitHub Secrets**
   
   Go to your GitHub repository → Settings → Secrets and variables → Actions
   
   Add the following secret:
   - `ANTHROPIC_API_KEY` - Your Claude API key from [Anthropic Console](https://console.anthropic.com)

4. **Enable GitHub Pages**
   
   Go to Settings → Pages → Source: Deploy from a branch
   - Branch: `main`
   - Folder: `/ (root)`

5. **Configure GitHub Actions Permissions**
   
   Go to Settings → Actions → General → Workflow permissions
   - Enable "Read and write permissions"
   - Enable "Allow GitHub Actions to create and approve pull requests"

## 📁 Project Structure

```
/ai-assignment-grader/
├── index.html              # Student submission portal
├── instructor.html         # Instructor dashboard
├── .github/
│   └── workflows/
│       └── grade.yml       # Auto-grading workflow
├── rubrics/
│   ├── practical_1.json    # Rubric for Practical 1
│   ├── practical_2.json    # Rubric for Practical 2
│   └── ... (7 total)       # One rubric per practical
├── results/
│   └── grades.csv          # Auto-generated results
├── scripts/
│   ├── ai-detector.js      # AI content detection (0-100% scoring)
│   ├── grader.js           # Assignment grading (AI-adjusted)
│   └── utils.js            # Utility functions
├── docs/
│   ├── AI_DETECTION.md     # Comprehensive AI detection guide
│   ├── GRADING.md          # AI-adjusted grading guide
│   └── TESTING.md          # Testing procedures
├── test-ai-detection.js    # AI detection test suite
├── test-grading.js         # Grading test suite
├── package.json            # Dependencies
└── README.md               # This file
```

## 💻 Usage

### For Students

1. Visit the GitHub Pages URL (e.g., `https://yourusername.github.io/ai-assignment-grader/`)
2. Fill in your details:
   - Student Name
   - Student Email
   - Student ID
   - Practical Number (1-7)
   - Your submission (paste code/text)
3. Click "Submit Assignment"
4. Check your GitHub Issues for grading results (within 2-5 minutes)
5. View your score breakdown:
   - **Base Score**: Quality assessment of your work
   - **AI Penalty**: Deduction for AI-generated content (if detected)
   - **Final Score**: Your actual grade after penalties

**AI Usage Guidelines:**
- 0-20% AI: ✅ Acceptable (no penalty)
- 21-40% AI: ⚠️ -10 points
- 41-60% AI: ⚠️ -25 points
- 61-80% AI: 🚨 -50 points
- 81-100% AI: 🚫 Zero score + academic integrity review

### For Instructors

1. Visit the instructor dashboard at `/instructor.html`
2. View all submissions with:
   - Base scores (before AI penalty)
   - AI detection percentages (0-100%)
   - Final scores (after AI adjustment)
   - Detailed feedback and technical assessment
3. Filter by practical, grade range, or AI detection status
4. Review flagged submissions (>40% AI)
5. Export results to CSV for record-keeping

### Documentation

- **[AI Detection Guide](docs/AI_DETECTION.md)** - Complete AI detection documentation (0-100% scoring, pattern matching, line-by-line analysis)
- **[Grading Guide](GRADING.md)** - AI-adjusted grading system, penalty tiers, LLM-judge details
- **[Testing Guide](TESTING.md)** - How to test AI detection and grading locally
   - Grades
   - AI detection flags
   - Detailed feedback
3. Filter by practical, grade range, or AI detection status
4. Export results to CSV for record-keeping

## 🔧 Customization

### Modifying Rubrics

Edit the JSON files in the `rubrics/` folder to customize grading criteria:

```json
{
  "practicalNumber": "1",
  "title": "Your Assignment Title",
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

### Adjusting AI Detection Sensitivity

Modify `scripts/ai-detector.js` to change detection parameters:

```javascript
// Adjust the prompt or confidence thresholds
const message = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  // ... customize prompt
});
```

### Adding More Practicals

1. Create a new rubric file: `rubrics/practical_8.json`
2. Add the option to the dropdown in `index.html`:
   ```html
   <option value="8">Practical 8</option>
   ```
3. Update the instructor dashboard filters if needed

## 🔐 Security & Privacy

- **API Keys**: Never commit your `.env` file or expose API keys
- **Student Data**: All data is stored in your private GitHub repository
- **Access Control**: Use GitHub's built-in access controls
- **Data Retention**: CSV files can be archived or deleted as needed

## 🧪 Testing Locally

### Test AI Detection (0-100% scoring)
```bash
echo "Your test submission here" > test.txt
node scripts/ai-detector.js test.txt
```

Output includes:
- AI probability (0-100%)
- Flagged sections with line numbers
- Human elements detected
- Confidence level and recommendation

For detailed capabilities, see [AI Detection Guide](docs/AI_DETECTION.md).

### Test Grading (with AI adjustment)
```bash
# Basic grading (no AI detection)
echo "Your code here" > test.py
node scripts/grader.js test.py 1

# Grading with AI detection
node scripts/ai-detector.js test.py > ai-result.json
node scripts/grader.js test.py 1 ai-result.json
```

Output includes:
- Base score (quality assessment)
- AI penalty (if detected)
- Final score (after adjustment)
- Detailed feedback per criterion

For detailed grading system, see [Grading Guide](GRADING.md).

### Run Test Suites
```bash
# Test AI detection module (6 test cases, all penalty tiers)
node test-ai-detection.js

# Test grading module (boundary tests, edge cases)
node test-grading.js
```

### Initialize Results File
```bash
node scripts/utils.js init
```

### View Statistics
```bash
node scripts/utils.js statistics
```

## 📊 How It Works

1. **Student Submission**
   - Student fills out the form on `index.html`
   - Submission creates a GitHub Issue (trigger)

2. **GitHub Actions Workflow**
   - Issue creation triggers `grade.yml` workflow
   - Extracts submission data from issue body

3. **AI Detection** ([Full Guide](docs/AI_DETECTION.md))
   - `ai-detector.js` analyzes text for AI-generated patterns
   - Returns AI probability (0-100%), flagged sections, human elements
   - Uses pre-detection scanning + Claude API analysis
   - Generates recommendation: PASS, REVIEW, or FAIL

4. **Automated Grading** ([Full Guide](GRADING.md))
   - `grader.js` loads appropriate rubric from `/rubrics/`
   - Claude API grades against criteria (LLM-judge)
   - Calculates base score (quality assessment)
   - Applies AI penalty based on detection results:
     - 0-20% AI: 0 penalty
     - 21-40% AI: -10 points
     - 41-60% AI: -25 points
     - 61-80% AI: -50 points
     - 81-100% AI: Zero score (academic integrity violation)
   - Returns detailed feedback with strengths/improvements

5. **Results Storage**
   - `utils.js` appends results to `grades.csv`
   - Includes: baseScore, aiPenalty, finalScore, aiProbability
   - Commits updated CSV to repository

6. **Feedback Delivery**
   - Workflow comments on the issue with complete results
   - Shows: Base score, AI usage %, Penalty, Final score
   - Includes: Technical assessment, Learning evidence, Feedback
   - Issue is closed and labeled appropriately
   - Student receives notification

## 🛠️ Troubleshooting

### Workflow Not Triggering
- Check GitHub Actions is enabled in Settings
- Verify workflow permissions (read/write)
- Ensure ANTHROPIC_API_KEY secret is set

### API Errors
- Verify API key is valid
- Check API rate limits (Claude free tier has limits)
- Review workflow logs in Actions tab

### CSV File Not Updating
- Check workflow has write permissions to repository
- Verify git configuration in workflow
- Check for merge conflicts

### Pages Not Loading
- Ensure GitHub Pages is enabled
- Check that files are in the root directory
- Verify no build errors in Pages settings

## 📈 Future Enhancements

- [ ] Email notifications to students
- [ ] Plagiarism detection between submissions
- [ ] Support for file uploads (ZIP, PDF)
- [ ] Advanced analytics and visualizations
- [ ] Integration with LMS (Canvas, Moodle)
- [ ] Multi-language support
- [ ] Batch grading capabilities

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Anthropic Claude API](https://www.anthropic.com) - AI detection and grading
- [GitHub Actions](https://github.com/features/actions) - Serverless automation
- [GitHub Pages](https://pages.github.com) - Free hosting

## 📞 Support

For issues or questions:
- Create a GitHub Issue
- Check existing issues for solutions
- Review the troubleshooting section

## ⚠️ Important Notes

- **Cost Management**: Monitor your Claude API usage to avoid unexpected charges
- **Academic Integrity**: 
  - AI detection (0-100% scoring) is highly accurate but not infallible
  - Always review submissions flagged with >40% AI content
  - 81-100% AI triggers automatic academic integrity review
  - Use as a tool to guide conversations, not as sole evidence
- **Privacy**: Be mindful of student data privacy laws (FERPA, GDPR)
- **Backup**: Regularly backup your `results/grades.csv` file
- **Testing**: Test with sample submissions before using with real students
- **Documentation**: Review [AI Detection Guide](docs/AI_DETECTION.md) and [Grading Guide](GRADING.md) for complete details

---

Made with ❤️ for educators and students

**Star this repository if you find it useful!** ⭐
