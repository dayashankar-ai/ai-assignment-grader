# 📚 Practical Assignment 1: Basic Prompt Engineering

## 🎯 Assignment Overview

**Title:** Basic Prompt Engineering  
**Covers:** Lectures 1-3  
**Total Points:** 100  
**Difficulty:** Beginner  

## 📖 Description

In this practical, you will explore the fundamentals of prompt engineering for Large Language Models (LLMs). You will design, test, and refine various prompts to understand how different structures affect AI responses.

## 🎓 Learning Objectives

By completing this assignment, you will:

1. ✅ Understand basic prompt structure and components
2. ✅ Design clear, specific prompts for different tasks
3. ✅ Test and iterate on prompt designs
4. ✅ Handle API responses and errors appropriately
5. ✅ Document your design choices and methodology

## 📋 Requirements

### What You Need to Submit

1. **Python File** (`practical1.py`)
   - At least 5 different prompt examples
   - Working code that calls an LLM API (OpenAI, Claude, etc.)
   - Proper error handling
   - Clear comments explaining each prompt

2. **README.md**
   - Explanation of your prompt design choices
   - Testing methodology
   - Results analysis
   - Challenges faced and solutions

3. **Sample Outputs**
   - Screenshots or text files showing successful prompt responses
   - Comparison of different prompt variations

### Example Prompt Types to Include

1. **Basic Instruction Prompt**
   ```python
   prompt = "Explain photosynthesis in simple terms"
   ```

2. **Role-Based Prompt**
   ```python
   prompt = """
   You are a biology teacher explaining to 5th grade students.
   Explain photosynthesis using simple language and an analogy.
   Keep it under 100 words.
   """
   ```

3. **Few-Shot Learning Prompt**
   ```python
   prompt = """
   Classify the following text as positive, negative, or neutral:
   
   Examples:
   "I love this product!" -> positive
   "This is terrible" -> negative
   "It's okay" -> neutral
   
   Now classify: "This exceeded my expectations!"
   """
   ```

4. **Chain of Thought Prompt**
   ```python
   prompt = """
   Solve this step by step:
   Question: If a train travels 120 km in 2 hours, what is its speed?
   
   Think through:
   1. Identify what we know
   2. Apply the formula
   3. Calculate the answer
   
   Show your reasoning.
   """
   ```

5. **Structured Output Prompt**
   ```python
   prompt = """
   Analyze this movie review and return a JSON response:
   
   Review: "The cinematography was stunning but the plot was weak"
   
   Format:
   {
     "sentiment": "positive/negative/mixed",
     "aspects": {
       "cinematography": "positive/negative",
       "plot": "positive/negative"
     },
     "overall_score": 0-10
   }
   """
   ```

## 📊 Grading Rubric (100 Points)

### 1. Correctness (40 points)
- **Excellent (36-40):** All prompts produce accurate, relevant responses. Clear understanding of prompt structure. Edge cases handled.
- **Good (28-35):** Most prompts work correctly. Minor issues in formatting or edge cases.
- **Satisfactory (20-27):** Prompts produce partially correct results. Basic functionality achieved.
- **Poor (0-19):** Prompts fail to produce expected results. Significant errors.

### 2. Code Quality (25 points)
- **Excellent (23-25):** Clean, well-organized code. Proper variable naming. Excellent error handling.
- **Good (18-22):** Good code structure. Basic error handling present.
- **Satisfactory (13-17):** Functional but messy code. Minimal error handling.
- **Poor (0-12):** Poorly structured. No error handling.

### 3. Documentation (20 points)
- **Excellent (18-20):** Comprehensive README. Well-commented code. Clear explanations.
- **Good (14-17):** Good documentation. Most prompts explained.
- **Satisfactory (10-13):** Basic documentation. Minimal comments.
- **Poor (0-9):** Little to no documentation.

### 4. Creativity (15 points)
- **Excellent (14-15):** Innovative prompt designs. Goes beyond requirements.
- **Good (11-13):** Some creative elements. Shows independent thinking.
- **Satisfactory (8-10):** Basic creativity. Mostly follows examples.
- **Poor (0-7):** No creativity. Direct copying of examples.

## 🤖 AI Usage Policy

### ✅ Allowed
- GitHub Copilot for syntax help and code completion
- Stack Overflow for reference and debugging
- Official API documentation for LLM providers

### ❌ Prohibited
- Copy-pasting entire solutions from ChatGPT or similar tools
- Using AI to write complete prompt engineering solutions
- Submitting AI-generated code without understanding or modification

### ⚠️ AI Detection Penalties
- **0-20% AI:** No penalty
- **21-40% AI:** -10 points
- **41-60% AI:** -25 points
- **61-80% AI:** -50 points
- **81-100% AI:** -100 points (automatic failure)

**Guideline:** You may use AI tools for syntax help and debugging, but the prompt design and implementation logic must be your own work.

## 💻 Starter Code Template

```python
"""
Practical 1: Basic Prompt Engineering
Student: [Your Name]
Roll Number: [Your Roll Number]
Email: [Your Email]
Batch: [Your Batch]
"""

import openai  # or anthropic, or any other LLM library
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')  # or ANTHROPIC_API_KEY

def test_basic_prompt():
    """
    Test 1: Basic instruction prompt
    """
    prompt = "Your prompt here"
    
    try:
        # Your API call here
        response = call_llm(prompt)
        print(f"Response: {response}")
    except Exception as e:
        print(f"Error: {e}")

def test_role_based_prompt():
    """
    Test 2: Role-based prompting
    """
    prompt = """
    You are a [role].
    Your task is to [task].
    """
    # Implementation here

def test_few_shot_prompt():
    """
    Test 3: Few-shot learning
    """
    prompt = """
    Examples:
    Input: [example1] -> Output: [result1]
    Input: [example2] -> Output: [result2]
    
    Now process:
    Input: [your input]
    """
    # Implementation here

def test_chain_of_thought():
    """
    Test 4: Chain of thought reasoning
    """
    # Implementation here

def test_structured_output():
    """
    Test 5: Structured output format
    """
    # Implementation here

def call_llm(prompt):
    """
    Generic function to call your chosen LLM API
    """
    # Implement your API call here
    pass

if __name__ == "__main__":
    print("=== Practical 1: Basic Prompt Engineering ===\n")
    
    print("Test 1: Basic Prompt")
    test_basic_prompt()
    
    print("\nTest 2: Role-Based Prompt")
    test_role_based_prompt()
    
    print("\nTest 3: Few-Shot Learning")
    test_few_shot_prompt()
    
    print("\nTest 4: Chain of Thought")
    test_chain_of_thought()
    
    print("\nTest 5: Structured Output")
    test_structured_output()
```

## 📝 Submission Format

Your submission file should follow this naming convention:
```
[yourname]_[rollnumber]_practical_1.txt
```

### File Header Format
```
// STUDENT NAME: Your Full Name
// ROLL NUMBER: 2024CS001
// EMAIL: your.email@university.edu
// BATCH: 2024
// YEAR: III
// PRACTICAL NUMBER: 1
```

### How to Submit

1. **Via GitHub Portal:**
   - Visit: https://dayashankar-ai.github.io/ai-assignment-grader/submit.html
   - Fill in your details
   - Paste your complete code (Python + README content)
   - Click "Submit Assignment"
   - System will automatically grade and provide feedback

2. **Manual Submission:**
   - Save file with correct naming format
   - Commit to the `submissions/` folder
   - Push to the main branch

## ⏰ Timeline

- **Assignment Release:** [Date]
- **Due Date:** [Date + 1 week]
- **Late Submission:** -10% per day (max 3 days)
- **Grading:** Automated within 5 minutes of submission
- **Feedback:** Available immediately on student dashboard

## 🔍 How You'll Be Graded

1. **Automated Grading:**
   - Submit via portal
   - AI (Claude) analyzes your code
   - Grades based on rubric criteria
   - Results available in 3-5 minutes

2. **Detailed Feedback:**
   - Visit: https://dayashankar-ai.github.io/ai-assignment-grader/index.html
   - Search your Roll Number
   - Click "View Detailed Criterion Breakdown"
   - See exactly where to improve

3. **Instructor Review:**
   - Instructor may add personalized comments
   - Comments appear in your dashboard
   - Check back after 24 hours for instructor feedback

## 💡 Tips for Success

1. **Start Early:** Don't wait until the deadline
2. **Test Thoroughly:** Run your code multiple times with different inputs
3. **Document Well:** Clear explanations help the grader understand your thinking
4. **Be Creative:** Don't just copy lecture examples
5. **Handle Errors:** Always include try-catch blocks
6. **Read Rubric:** Understand exactly what's being graded
7. **Check Feedback:** Use detailed feedback to improve future assignments

## 📚 Resources

- **Course Lectures:** Review Lectures 1-3
- **OpenAI Docs:** https://platform.openai.com/docs/guides/prompt-engineering
- **Anthropic Docs:** https://docs.anthropic.com/claude/docs/introduction-to-prompt-design
- **Prompt Engineering Guide:** https://www.promptingguide.ai/

## ❓ FAQ

**Q: Can I use ChatGPT to help write code?**  
A: You can use it for syntax help, but not for complete solutions. If AI usage exceeds 40%, penalties apply.

**Q: What LLM API should I use?**  
A: Any major LLM (OpenAI GPT, Claude, Gemini) is fine. Mention which one in your README.

**Q: How do I get API keys?**  
A: Sign up for free trials at OpenAI, Anthropic, or Google AI Studio.

**Q: Can I submit multiple times?**  
A: Yes! We take your highest score. Use feedback to improve and resubmit.

**Q: Where do I see my detailed feedback?**  
A: Student dashboard at https://dayashankar-ai.github.io/ai-assignment-grader/index.html

## 📧 Support

**Technical Issues:** Contact your instructor  
**Grading Questions:** Check detailed feedback first, then contact instructor  
**Submission Problems:** Verify file format and naming convention

---

**Good luck! 🚀 Remember: The goal is to learn prompt engineering, not just get a grade. Experiment, iterate, and have fun!**
