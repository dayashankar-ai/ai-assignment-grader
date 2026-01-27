# 🚀 Quick Start Guide

Get your auto-grading portal running in 5 minutes!

## Prerequisites
- [ ] GitHub account
- [ ] Anthropic API key ([Get one here](https://console.anthropic.com))

## Step-by-Step Setup

### 1️⃣ Push to GitHub (2 min)
```bash
cd ai-assignment-grader
git init
git add .
git commit -m "Initial setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2️⃣ Configure GitHub (2 min)

**Add API Key:**
1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `ANTHROPIC_API_KEY`
4. Value: Your Claude API key
5. Click **Add secret**

**Enable Actions:**
1. Go to **Settings** → **Actions** → **General**
2. Under "Workflow permissions":
   - ✅ Read and write permissions
   - ✅ Allow GitHub Actions to create and approve pull requests
3. Click **Save**

**Enable Pages:**
1. Go to **Settings** → **Pages**
2. Source: **main** branch, **/ (root)** folder
3. Click **Save**
4. Wait 1-2 minutes

### 3️⃣ Test It! (1 min)

1. Visit: `https://YOUR_USERNAME.github.io/YOUR_REPO/`
2. You should see the student submission portal
3. Try the instructor dashboard: `/instructor.html`

## 🎯 Your Portal URLs

- **Student Portal**: `https://YOUR_USERNAME.github.io/YOUR_REPO/`
- **Instructor Dashboard**: `https://YOUR_USERNAME.github.io/YOUR_REPO/instructor.html`

## 🧪 Test Submission

To test the grading system:

1. Go to your repo on GitHub
2. Click **Issues** → **New issue**
3. Choose **"Assignment Submission"** template
4. Fill in test data
5. Submit
6. Go to **Actions** tab to watch the workflow run
7. Check the issue for grading results (appears in ~2 minutes)

## 📋 What Students See

```
1. Visit your GitHub Pages URL
2. Fill in their details
3. Select practical number (1-7)
4. Paste their code/answer
5. Click "Submit Assignment"
6. Receive results via GitHub issue notification
```

## 👨‍🏫 What You See

```
1. Visit /instructor.html
2. View all submissions with grades
3. Filter by practical, grade, or AI detection
4. Export results to CSV
5. Review detailed feedback
```

## ✅ Verification Checklist

- [ ] Repository created and code pushed
- [ ] `ANTHROPIC_API_KEY` secret added
- [ ] Actions permissions enabled (read/write)
- [ ] GitHub Pages enabled and deployed
- [ ] Can access student portal URL
- [ ] Can access instructor dashboard
- [ ] GitHub Actions workflow file exists
- [ ] Test issue created successfully
- [ ] Workflow runs and grades the test

## 🆘 Quick Troubleshooting

**Pages not loading?**
- Wait 2-3 minutes after enabling Pages
- Check Settings → Pages for deployment status

**Workflow not running?**
- Verify Actions are enabled
- Check workflow permissions
- Ensure API key secret is set

**API errors?**
- Verify API key is correct (no extra spaces)
- Check API usage limits in Anthropic Console

## 📚 Next Steps

1. ✅ Customize rubrics in `rubrics/` folder
2. ✅ Update branding in HTML files
3. ✅ Share portal URL with students
4. ✅ Monitor first real submissions
5. ✅ Export grades regularly

## 💡 Pro Tips

- **Backup grades**: Download `results/grades.csv` regularly
- **Monitor costs**: Check Claude API usage in Anthropic Console
- **Test first**: Always test with sample submissions before going live
- **Communicate**: Let students know about the AI detection feature

## 🎓 You're Ready!

Share this URL with your students:
```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

---

Need help? Check:
- 📖 [README.md](README.md) - Full documentation
- 🛠️ [SETUP.md](SETUP.md) - Detailed setup guide
- 📊 [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - What's included

**Happy Teaching! 🎉**
