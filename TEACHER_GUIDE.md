# 👨‍🏫 Teacher Guide: Managing Student Submissions

## 🎯 Quick Overview

When students submit assignments, you simply upload their files to the system. Grading happens automatically within minutes!

---

## 📥 Step-by-Step: Upload Student Submission

### **Step 1: Receive Student File**
Student emails you: `rahul_2024CS001_practical_1.txt`

### **Step 2: Upload to System**

#### Method A: Using GitHub Website (Easiest!)

1. **Go to GitHub:**
   - Open: https://github.com/dayashankar-ai/ai-assignment-grader
   
2. **Navigate to submissions folder:**
   - Click on the `submissions` folder
   
3. **Upload file:**
   - Click **"Add file"** button (top right)
   - Click **"Upload files"**
   - Drag student's file OR click "choose your files"
   - Select: `rahul_2024CS001_practical_1.txt`
   
4. **Save (Commit):**
   - Scroll down
   - In the box, type: "Add Rahul's Practical 1 submission"
   - Click green **"Commit changes"** button

5. **Done!**
   - Grading starts automatically
   - Wait 2-3 minutes

---

## 🤖 What Happens Automatically:

### Within 2-3 Minutes:

1. ✅ **AI Detection Analysis**
   - Checks if student used AI tools
   - Calculates AI usage percentage
   - Flags suspicious content

2. ✅ **Automatic Grading**
   - Grades code correctness
   - Checks code quality
   - Reviews documentation
   - Assesses creativity
   - Calculates final score out of 100

3. ✅ **Results Saved**
   - Score saved to Excel file
   - Detailed feedback generated
   - Dashboard updated

---

## 📊 Where to Find Results:

### **Option 1: Excel File (Best for Records)**

**Location:** https://github.com/dayashankar-ai/ai-assignment-grader/blob/main/results/grades.csv

**What You'll See:**
- Student Name, Roll Number, Batch
- Practical Number
- Final Score (0-100)
- AI Usage Percentage
- Grade Letter (A+, A, B+, etc.)
- Submission Date
- Detailed Feedback

**To Download:**
1. Click on `results/grades.csv`
2. Click **"Download"** button (top right)
3. Open in Excel on your computer

---

### **Option 2: Teacher Dashboard (Best for Quick View)**

**Access:** https://dayashankar-ai.github.io/ai-assignment-grader/instructor.html

**What You Can See:**

#### 📈 **Overview Section:**
- Total submissions
- Average class score
- Pass/Fail statistics
- AI usage trends

#### 📊 **Grade Distribution:**
- Beautiful chart showing score ranges
- How many students got A, B, C, etc.

#### 👥 **Individual Student Records:**
- Search by name or roll number
- View all practicals for one student
- See progress over time

#### 🚨 **AI Detection Alerts:**
- Students who used too much AI
- Cases needing manual review
- Academic integrity concerns

---

### **Option 3: Student Portal (For Students to Check)**

**Link to Share with Students:** 
https://dayashankar-ai.github.io/ai-assignment-grader/

**Students Can:**
- Enter their roll number
- See all their grades
- Read detailed feedback
- View improvement suggestions

---

## 📋 Sample Results You'll See:

### For: Rahul Kumar (2024CS001) - Practical 1

```
Final Score: 78/100
Grade: B+

📊 Score Breakdown:
- Correctness: 32/40 ⭐⭐⭐⭐
- Code Quality: 20/25 ⭐⭐⭐⭐
- Documentation: 15/20 ⭐⭐⭐
- Creativity: 11/15 ⭐⭐⭐

🤖 AI Detection: 15% (Low - Acceptable)

✅ Strengths:
- Good understanding of temperature parameter
- Clean code structure
- Clear documentation
- Proper variable naming

📈 Areas for Improvement:
- Add more test cases
- Include error handling
- Expand learning report
- Try more complex prompts

💬 Overall Feedback:
Solid first submission! You demonstrated good understanding of basic prompt engineering concepts. Your experimentation with temperature settings shows hands-on learning. To improve, try implementing more advanced prompt templates and include comparative analysis in your report.

🎯 Learning Evidence: Shows genuine understanding through experimentation
```

---

## 🎨 Dashboard Features:

### **1. Class Analytics**
- Average score per practical
- Trending topics students struggle with
- Improvement over time

### **2. Individual Tracking**
- Each student's progress graph
- Consistency in submissions
- Areas of strength/weakness

### **3. AI Usage Monitoring**
- Class-wide AI usage trends
- Students needing guidance
- Cases for discussion

### **4. Export Options**
- Download all data as Excel
- Generate report cards
- Print-friendly views

---

## ⚠️ Important Notes:

### **Handling AI Concerns:**

If a student shows **60%+ AI usage:**
1. ❗ System flags it automatically
2. 📉 Penalty is applied to grade
3. 🔍 You'll see it highlighted in dashboard
4. 💬 Consider discussing with student

### **Manual Review Needed When:**
- AI usage > 80% (Academic integrity case)
- Suspicious patterns detected
- Student disputes grade

---

## 🔄 Regular Workflow:

### **Every Week:**

1. **Collect submissions** from students via email
2. **Upload to submissions folder** (2 mins each)
3. **Wait for automatic grading** (3 mins per submission)
4. **Check dashboard** for any red flags
5. **Download Excel file** for your records

### **Takes Only:** 5-10 minutes for entire class!

---

## 📱 Mobile Access:

Both dashboards work on:
- ✅ Phone
- ✅ Tablet  
- ✅ Computer

No app needed - just open the link in any browser!

---

## 🆘 Troubleshooting:

### **"I uploaded but no results yet"**
- Wait 3-5 minutes
- Refresh the page
- Check if file is in `submissions/` folder

### **"Dashboard shows old data"**
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Try different browser

### **"Need to change a grade manually"**
- Edit the Excel file directly
- Or contact technical support

---

## 📧 Support:

For technical issues:
- Check Actions tab: https://github.com/dayashankar-ai/ai-assignment-grader/actions
- Green checkmark = All working ✅
- Red X = Something failed ❌

---

## 🎓 Summary:

**Your Job:** Upload student files (5 mins)

**System Does:** Everything else automatically!
- Grading
- Feedback
- Dashboard updates
- Excel management

**You Check:** Dashboard for overview, Excel for records

**That's It!** 🎉

---

**Quick Links:**
- 📊 Dashboard: https://dayashankar-ai.github.io/ai-assignment-grader/instructor.html
- 📥 Upload: https://github.com/dayashankar-ai/ai-assignment-grader/tree/main/submissions
- 📈 Excel: https://github.com/dayashankar-ai/ai-assignment-grader/blob/main/results/grades.csv
