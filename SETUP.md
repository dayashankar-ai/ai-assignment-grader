# Setup Instructions

Follow these steps to set up the AI Assignment Auto-Grader:

## Step 1: GitHub Repository Setup

1. Create a new GitHub repository or use this one
2. Push all files to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial setup of auto-grader"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

## Step 2: Get Claude API Key

1. Go to [Anthropic Console](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (you won't see it again!)

## Step 3: Configure GitHub Secrets

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your Claude API key from Step 2
5. Click **Add secret**

## Step 4: Enable GitHub Actions

1. Go to **Settings** → **Actions** → **General**
2. Under "Workflow permissions":
   - Select **Read and write permissions**
   - Check **Allow GitHub Actions to create and approve pull requests**
3. Click **Save**

## Step 5: Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Under "Source":
   - Select branch: **main**
   - Select folder: **/ (root)**
3. Click **Save**
4. Wait 1-2 minutes for deployment
5. Your site will be available at: `https://yourusername.github.io/repository-name/`

## Step 6: Install Dependencies (for local testing)

```bash
npm install
```

## Step 7: Test Locally (Optional)

Create a `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and add your API key:
```
ANTHROPIC_API_KEY=your_actual_key_here
```

Test AI detection:
```bash
echo "This is a test submission with some code" > test.txt
node scripts/ai-detector.js test.txt
```

Test grading:
```bash
node scripts/grader.js test.txt 1
```

## Step 8: Verify Setup

1. Visit your GitHub Pages URL
2. You should see the student submission form
3. Try making a test submission (it will create an issue)
4. Go to **Actions** tab to watch the workflow run
5. Check the issue for grading results

## Troubleshooting

### "Workflow not found" error
- Make sure `.github/workflows/grade.yml` exists
- Verify file is committed to the repository
- Check Actions tab for any errors

### "API key invalid" error
- Double-check the API key in GitHub Secrets
- Ensure no extra spaces or characters
- Regenerate key if needed

### Pages not loading
- Wait a few minutes after enabling Pages
- Check Pages deployment status in Settings
- Verify index.html is in root directory

### Workflow doesn't trigger
- Verify workflow permissions are set correctly
- Check if Actions are enabled for the repository
- Review workflow syntax for errors

## Next Steps

1. Customize rubrics in `rubrics/` folder
2. Update styling in HTML files to match your branding
3. Add more practicals as needed
4. Share the GitHub Pages URL with students

## Support

If you encounter issues:
1. Check the **Troubleshooting** section in README.md
2. Review workflow logs in Actions tab
3. Create an issue in the repository
