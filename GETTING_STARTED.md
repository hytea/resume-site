# Getting Started with Your Resume Website

Welcome! This guide will help you create your own professional resume website, even if you've never coded before. By the end, you'll have a beautiful, customizable website hosted for free on GitHub Pages.

## Table of Contents
1. [What You'll Need](#what-youll-need)
2. [Quick Start (For Non-Technical Users)](#quick-start-for-non-technical-users)
3. [Customizing Your Site](#customizing-your-site)
4. [Deploying to GitHub Pages](#deploying-to-github-pages)
5. [Advanced Customization](#advanced-customization)
6. [Troubleshooting](#troubleshooting)

---

## What You'll Need

- A GitHub account (free) - [Sign up here](https://github.com/signup)
- A computer with internet access
- About 30 minutes of time

**No coding experience required!**

---

## Quick Start (For Non-Technical Users)

### Step 1: Get Your Own Copy

1. **Go to this repository on GitHub**
   - Click the green **"Use this template"** button (or **"Fork"** button)
   - Choose **"Create a new repository"**
   - Name it something like `my-resume-site` or `yourname-resume`
   - Make sure it's set to **"Public"**
   - Click **"Create repository"**

### Step 2: Customize Your Information

You have two options:

#### Option A: Use the Visual Config Editor (Easiest!)

1. Download this repository to your computer
   - Click the green **"Code"** button
   - Select **"Download ZIP"**
   - Extract the ZIP file to a folder

2. Open the config editor
   - Find the file called `config-editor.html` in the folder
   - Double-click it to open in your web browser

3. Fill out the form with your information
   - Personal details (name, email, phone)
   - Bio and professional summary
   - Portfolio items
   - Social media links
   - Customize colors to match your style

4. Click **"Download config.json"** when you're done

5. Replace the old config file
   - Go to your repository on GitHub
   - Navigate to the `public` folder
   - Click on `config.json`
   - Click the pencil icon (Edit)
   - Delete all the content
   - Copy and paste the content from your downloaded config.json
   - Click **"Commit changes"**

#### Option B: Edit Directly on GitHub

1. In your repository, navigate to `public/config.json`
2. Click the pencil icon (Edit)
3. Update the values with your information
4. Click **"Commit changes"**

**Important Fields to Update:**
- `personal.name` - Your full name
- `personal.email` - Your email address
- `personal.phone` - Your phone number
- `personal.title` - Your job title
- `bio.paragraphs` - Your bio text
- `experience` - Your work history
- `skills` - Your skills and expertise
- `education` - Your educational background
- `portfolio` - Your projects
- `socialLinks` - Your LinkedIn, GitHub, etc.

### Step 3: Add Your Photos

1. Take or find photos you want to use:
   - A professional headshot (for the bio section)
   - A background image for the hero section (optional)
   - Portfolio screenshots (optional)

2. Upload them to the `public` folder in your repository:
   - Go to the `public` folder
   - Click **"Add file"** > **"Upload files"**
   - Drag and drop your photos
   - Click **"Commit changes"**

3. Update the config.json to point to your images:
   - `bio.image` - e.g., `"./public/my-photo.jpg"`
   - `hero.backgroundImage` - e.g., `"./public/my-background.jpg"`

---

## Deploying to GitHub Pages

Now let's make your website live on the internet!

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** (top right)
3. Scroll down to **"Pages"** in the left sidebar
4. Under **"Source"**, select **"GitHub Actions"**
5. Your site will be available at `https://yourusername.github.io/repository-name/`

### Step 2: Trigger the First Build

1. Go to the **"Actions"** tab in your repository
2. You should see a workflow running (it might take a few minutes)
3. Once it's complete (green checkmark), your site is live!
4. Click on the workflow run
5. Find the deployment URL in the output

### Step 3: Visit Your Site!

Your resume website is now live! Share the URL with potential employers, colleagues, and on your social media.

---

## Customizing Your Site

### Changing Colors

In your `config.json`, find the `theme` section:

```json
"theme": {
  "primaryColor": "#667eea",
  "secondaryColor": "#764ba2",
  "accentColor": "#3e7135"
}
```

Change these hex color codes to your preferred colors. Use a [color picker tool](https://htmlcolorcodes.com/color-picker/) to find colors you like.

### Adding Portfolio Items

In the `portfolio` array, add your projects:

```json
"portfolio": [
  {
    "title": "My Awesome Project",
    "url": "https://github.com/yourusername/project",
    "image": "./public/project-screenshot.png",
    "description": "A cool project I built that does amazing things."
  }
]
```

### Customizing Social Links

Update the `socialLinks` section:

```json
"socialLinks": {
  "linkedin": "https://www.linkedin.com/in/yourprofile",
  "github": "https://github.com/yourusername",
  "twitter": "https://x.com/yourhandle"
}
```

### Using Your Own Domain (Optional)

If you want to use a custom domain like `www.yourname.com`:

1. Buy a domain from a registrar (GoDaddy, Namecheap, etc.)
2. In your `public` folder, create a file called `CNAME`
3. Add just your domain name in it (e.g., `www.yourname.com`)
4. Configure your domain's DNS settings (ask your registrar for help)

---

## Advanced Customization

### Running Locally (For Testing)

If you want to preview changes before deploying:

1. Install [Node.js](https://nodejs.org/) on your computer
2. Open a terminal/command prompt
3. Navigate to your project folder
4. Run these commands:
   ```bash
   npm install
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser
6. Your site will auto-refresh as you make changes!

### Understanding the File Structure

```
resume-site/
├── public/              # Your images and config file go here
│   └── config.json      # Main configuration file
├── src/                 # Source code
│   ├── configure.js     # Handles loading your config
│   ├── main.js          # Animations and interactions
│   └── styles.css       # Styling
├── index.html           # Main HTML template
├── config-editor.html   # Visual config editor tool
└── package.json         # Project dependencies
```

### Customizing Experience, Skills, and Education

These sections use a different format:

**Experience:**
```json
"experience": [
  {
    "title": "Software Engineer",
    "dateRange": "January 2020 - Present",
    "company": "Tech Company",
    "location": "San Francisco, CA",
    "responsibilities": [
      "Built cool features",
      "Worked with a great team",
      "Learned a ton"
    ]
  }
]
```

**Skills:**
```json
"skills": {
  "Technical_Skills": "JavaScript, React, Node.js, etc.",
  "Soft_Skills": "Communication, teamwork, problem-solving"
}
```

**Education:**
```json
"education": [
  {
    "degree": "B.S. Computer Science",
    "date": "May 2019",
    "institution": "University Name",
    "location": "City, State"
  }
]
```

---

## Troubleshooting

### My changes aren't showing up

1. Make sure you committed your changes to GitHub
2. Wait a few minutes for GitHub Actions to rebuild your site
3. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
4. Check the "Actions" tab to see if the build succeeded

### The site looks broken

1. Make sure your `config.json` is valid JSON
   - Use a [JSON validator](https://jsonlint.com/)
   - Check for missing commas, quotes, or brackets
2. Make sure image paths are correct
3. Check the browser console for errors (F12 > Console tab)

### Images aren't loading

1. Make sure images are in the `public` folder
2. Check that file names match exactly (case-sensitive!)
3. Use relative paths like `./public/image.jpg`

### PDF download isn't working

The PDF generation happens in the browser. If it's not working:
1. Try a different browser
2. Make sure JavaScript is enabled
3. Check that your `summary`, `experience`, `skills`, and `education` sections are properly filled out

---

## Need More Help?

- Check out the [README.md](README.md) for technical details
- Look at example configs in the `examples` folder
- Open an issue on GitHub if you're stuck
- Read the GitHub Pages documentation

---

## Next Steps

Once your site is live:

1. **Share it!**
   - Add the URL to your LinkedIn profile
   - Include it in your email signature
   - Share it when applying for jobs

2. **Keep it updated**
   - Add new projects as you build them
   - Update your experience section
   - Refine your bio

3. **Customize further**
   - Experiment with different colors
   - Try adding your own portfolio projects
   - Make it uniquely yours!

---

**Congratulations! You now have a professional resume website that you can customize and maintain yourself!** 🎉
