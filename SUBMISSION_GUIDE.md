# AI Assignment Auto-Grader - Submission Guide

## 🎯 Automatic Grading System

This repository automatically grades AI/ML assignments using Claude AI with comprehensive rubrics.

## 📝 How Students Submit Assignments

### Method: File-Based Submission (Fully Automatic)

**Step 1:** Fork this repository

**Step 2:** Create your submission file in the `submissions/` folder:
```
submissions/yourname_studentid_practical_X.txt
```

**Step 3:** Format your submission:
```markdown
**Student Name:** Your Full Name
**Student ID:** Your ID
**Assignment:** Practical X

## Submission Files

```python
# Your code here
def my_function():
    pass
```

```markdown
# README
Your documentation and explanation here
```
```

**Step 4:** Commit and push to your fork

**Step 5:** Create a Pull Request to the main repository

**Step 6:** The grading workflow runs automatically when merged!

---

## 🤖 What Happens Automatically

1. ✅ **AI Detection Analysis** - Checks for AI-generated content
2. ✅ **Automated Grading** - Grades against rubric criteria
3. ✅ **Results Posted** - Results saved to `results/grades.csv`
4. ✅ **Feedback Generated** - Detailed feedback with strengths and improvements

---

## 📊 View Your Results

- **Student Portal:** https://dayashankar-ai.github.io/ai-assignment-grader/
- **Instructor Dashboard:** https://dayashankar-ai.github.io/ai-assignment-grader/instructor.html
- **Grades CSV:** Check `results/grades.csv` in the repository

---

## 📚 Rubrics

All 7 practicals have detailed rubrics in the `rubrics/` folder:
- Practical 1: Basic Prompt Engineering
- Practical 2: Advanced Prompting + Templates
- Practical 3: Temperature Control + RAG
- Practical 4: LLM Evaluation + GAN
- Practical 5: VAE + Diffusion Models
- Practical 6: Fine-Tuning + RAG System
- Practical 7: Ethics Analysis + Safety

Each practical is graded on:
- **Correctness** (30-40%)
- **Code Quality** (25-30%)
- **Documentation** (20-25%)
- **Creativity** (15-20%)

---

## ⚖️ AI Usage Policy

- ✅ Allowed: ChatGPT, Claude, Copilot for **learning and debugging**
- ❌ Prohibited: Direct copy-paste without understanding
- 📉 Penalties: 10-100% deduction based on AI usage level

---

## 🆘 Support

For issues, contact your instructor or open an issue in this repository.
