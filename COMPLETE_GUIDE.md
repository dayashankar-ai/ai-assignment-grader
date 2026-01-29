# 📚 Complete Guide - AI Assignment Grader System

## 🎯 Portal Access Links

### 1. Student Submission Portal
**URL:** https://dayashankar-ai.github.io/ai-assignment-grader/submit.html

**Purpose:** Students submit their assignments here

### 2. Student Dashboard
**URL:** https://dayashankar-ai.github.io/ai-assignment-grader/index.html

**Purpose:** Students check their grades and feedback

### 3. **TEACHER DASHBOARD** (For Checking Marks)
**URL:** https://dayashankar-ai.github.io/ai-assignment-grader/instructor.html

**Purpose:** 
- View all student grades
- See grade distribution charts
- Download Excel/CSV reports
- Monitor AI detection statistics
- Track submission trends

### 4. System Setup (One-time)
**URL:** https://dayashankar-ai.github.io/ai-assignment-grader/setup.html

**Purpose:** Configure GitHub token (already done)

---

## 📊 Excel Sheet Access

### Option 1: Direct GitHub Access (Current Live Data)
**URL:** https://github.com/dayashankar-ai/ai-assignment-grader/blob/main/results/grades.csv

**Features:**
- Always up-to-date
- Can view in browser
- Click "Download" button to get CSV file
- Open in Excel, Google Sheets, or any spreadsheet software

### Option 2: Download via Teacher Dashboard
1. Go to: https://dayashankar-ai.github.io/ai-assignment-grader/instructor.html
2. Scroll to "Detailed Grade Table" section
3. Click **"📥 Export to CSV"** button
4. File will download as `grades.csv`
5. Open in Excel

### Option 3: Clone Repository (For Offline Access)
```bash
git clone https://github.com/dayashankar-ai/ai-assignment-grader.git
```
Then open: `results/grades.csv` in Excel

---

## 🧪 Real Students in Database (For Testing)

### **Student 1: John Smith (Grade: A)**

**Student Details:**
- Name: John Smith
- Roll Number: 2024001
- Email: john@example.com
- Practical: 1
- Score: 92/100 (Grade A)

---

### **Student 2: Jane Smith (Grade: B+)**

**Student Details:**
- Name: Jane Smith
- Roll Number: 2024002
- Email: jane@example.com
- Practical: 1
- Score: 82/100 (Grade B+)

---

### **Student 3: Bob Johnson (Grade: B+ - AI Flagged)**

**Student Details:**
- Name: Bob Johnson
- Roll Number: 2024003
- Email: bob@example.com
- Practical: 2
- Score: 78/100 (Grade B+)
- AI Detection: Yes (88% confidence) ⚠️

---

### **How to Test with New Submission:**

**Important:** When you submit via the portal, the system will:
1. Create filename automatically: `alice_johnson_2024CS008_practical_1.txt`
2. Use YOUR form input data (not the filename you upload)
3. Add proper headers: STUDENT_NAME, STUDENT_ID, etc.
4. Grade within 2-3 minutes

**Test Submission Example:**
- Go to: https://dayashankar-ai.github.io/ai-assignment-grader/submit.html
- Enter Name: Alice Johnson
- Enter Roll: 2024CS008
- Enter Email: alice@example.com
- Select any assignment file from test_submissions folder
- Submit!
- System will create: `alice_johnson_2024cs008_practical_1.txt`
- Grade will show as "Alice Johnson" with roll "2024CS008"

---

## 🔧 How to Submit an Assignment

### Step 1: Prepare Your Assignment File
1. Create your assignment file (any name is fine - e.g., `my_assignment.txt`)
2. The system will automatically rename it based on your form input
3. File can be .txt, .py, .md, .pdf, or .zip (max 10MB)

### Step 2: Submit via Portal
1. Open: https://dayashankar-ai.github.io/ai-assignment-grader/submit.html
2. Fill in your details:
   - **Student Name:** Your full name (e.g., Alice Johnson)
   - **Roll Number:** Your roll number (e.g., 2024CS008)
   - **Email:** Your email address
   - **Batch:** Select your batch year
   - **Year:** Select your current year
   - **Assignment Number:** Select the practical number
3. **Upload your file** (any file from test_submissions folder or your own work)
4. Click "🚀 Submit Assignment"
5. System will:
   - Create proper filename: `alice_johnson_2024cs008_practical_1.txt`
   - Add headers with your information
   - Upload to GitHub
   - Trigger auto-grading

### Step 3: Monitor Grading Process
1. Check GitHub Actions: https://github.com/dayashankar-ai/ai-assignment-grader/actions
2. You'll see workflow running (takes 2-3 minutes)
3. Wait for green checkmark ✅

### Step 4: View Results
**For Students:**
1. Open: https://dayashankar-ai.github.io/ai-assignment-grader/index.html
2. Enter your name: "Alice Johnson"
3. (Optional) Enter roll: "2024CS008"
4. Click "🔍 Search My Grades"
5. View your score, grade, and feedback

**For Instructors:**
1. Open: https://dayashankar-ai.github.io/ai-assignment-grader/instructor.html
2. See all submissions with correct student names
3. View statistics and analytics
4. Delete any incorrect entries using 🗑️ button
5. Export to CSV

---

## 📋 CSV/Excel File Structure

The grades.csv file contains these columns:

1. **Timestamp** - When assignment was graded
2. **Student Name** - Full name
3. **Student ID** - Roll number
4. **Student Email** - Email address
5. **Practical Number** - Assignment number
6. **Total Score** - Points earned
7. **Max Score** - Maximum possible points (100)
8. **Grade Letter** - A, B, C, D, or F
9. **AI Detected** - Yes/No
10. **AI Confidence** - Percentage (0-100%)
11. **Overall Feedback** - Detailed AI-generated feedback

---

## 🎓 Grading Rubric (Practical 1: Prompt Engineering)

**Total Points: 100**

1. **Correctness (40 points)**
   - Does the solution work correctly?
   - Are prompts well-structured?
   - Are examples appropriate?

2. **Code Quality (30 points)**
   - Organization and structure
   - Clarity of explanations
   - Professional presentation

3. **Documentation (20 points)**
   - Clear descriptions
   - Analysis of results
   - Insights and observations

4. **Creativity (10 points)**
   - Novel approaches
   - Experimentation
   - Critical thinking

**Grade Scale:**
- A: 90-100 points
- B: 80-89 points
- C: 70-79 points
- D: 60-69 points
- F: Below 60 points

**AI Detection Penalty:**
- 0-30%: No penalty
- 31-50%: -10 points
- 51-70%: -25 points
- 71-90%: -50 points
- 91-100%: -100 points (automatic F)

---

## 🔍 Teacher Dashboard Features

### Real-Time Statistics
- Total submissions count
- Average score
- Pass rate percentage
- AI detection rate

### Visual Analytics
- **Grade Distribution Chart** - Bar chart showing A, B, C, D, F counts
- **Score Distribution** - Histogram of score ranges
- **Submission Timeline** - Line graph of submissions over time
- **AI Detection Stats** - Pie chart of AI vs Human work

### Detailed Grade Table
- Sortable columns (click headers)
- Search/filter functionality
- Color-coded grades (green=pass, red=fail)
- Expandable feedback sections
- Quick actions (view submission, download)

### Export Options
- **CSV Export** - Download all grades
- **PDF Report** - Formatted grade report (if implemented)
- **Filtered Export** - Export specific practical/student

---

## ⚠️ Troubleshooting

### Upload Button Not Working?
**Solution Applied:** The upload button has been fixed with improved CSS positioning. It now works in two ways:
1. **Click anywhere** in the dashed box to select file
2. **Drag and drop** file directly onto the box

### No Grades Showing in Dashboard?
**Possible Causes:**
1. Wait 2-3 minutes after submission (AI grading takes time)
2. Refresh the page (Ctrl + F5)
3. Check GitHub Actions completed successfully
4. Verify submission file was in correct format

### CSV File Empty?
**Solution:** Go to teacher dashboard and click "Refresh Data" button, then try export again.

### File Upload Fails?
**Check:**
1. File size under 10MB
2. File name includes roll number
3. File format is .txt, .py, .md, or .pdf
4. Internet connection stable

---

## 🚀 System Status

✅ **Claude 4.5 API** - Operational (model: claude-sonnet-4-5)
✅ **GitHub Actions** - Automated grading active
✅ **Student Portal** - Live and accepting submissions
✅ **Teacher Dashboard** - Live with real-time data
✅ **CSV Export** - Functional
✅ **AI Detection** - Active
✅ **File Upload** - **FIXED** - Now working properly

---

## 📞 Quick Reference

| Need | Link |
|------|------|
| Submit Assignment | https://dayashankar-ai.github.io/ai-assignment-grader/submit.html |
| Check My Grade | https://dayashankar-ai.github.io/ai-assignment-grader/index.html |
| **View All Grades (Teacher)** | **https://dayashankar-ai.github.io/ai-assignment-grader/instructor.html** |
| **Download Excel** | **https://github.com/dayashankar-ai/ai-assignment-grader/blob/main/results/grades.csv** |
| View Workflow Status | https://github.com/dayashankar-ai/ai-assignment-grader/actions |
| Repository | https://github.com/dayashankar-ai/ai-assignment-grader |

---

## ✅ Ready to Use!

The system is fully operational. Teachers can now:
1. ✅ Access the teacher dashboard
2. ✅ View all student grades and analytics
3. ✅ Download Excel/CSV reports
4. ✅ Monitor AI detection results
5. ✅ Track submission trends

Students can:
1. ✅ Upload assignments via the portal
2. ✅ Receive automated AI grading (2-3 minutes)
3. ✅ View detailed feedback
4. ✅ Check grades anytime

**System is production-ready! 🎉**
