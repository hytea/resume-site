# Professional Resume Website Template

**Create your own beautiful, professional resume website in minutes - no coding required!**

This is a fully customizable resume website template that anyone can use to create their own professional portfolio. Everything is controlled through a simple configuration file, making it easy to update your information without touching any code.

![Screenshot of the Website](./public/ResumeWebsiteScreenShot.png)

## ✨ Why Use This Template?

- **No Coding Required** - Use the visual config editor to customize everything
- **Fully Customizable** - Change colors, content, images, and layout from a single config file
- **100% Free** - Host on GitHub Pages at no cost
- **Professional Design** - Modern, responsive design that looks great on all devices
- **PDF Generation** - Automatically generate a downloadable PDF resume from your config
- **SEO Optimized** - Built-in SEO metadata configuration
- **Fast & Modern** - Built with Vite for lightning-fast performance

## 🎯 Perfect For

- Job seekers who want a professional online presence
- Developers showcasing their portfolio
- Anyone who wants a resume website without learning to code

## 🚀 Quick Start

**New users:** Check out the [GETTING_STARTED.md](GETTING_STARTED.md) guide for detailed, step-by-step instructions!

### Option 1: Use the Visual Config Editor (Easiest!)

1. Fork or clone this repository
2. Open `config-editor.html` in your browser
3. Fill out the form with your information
4. Download the generated `config.json`
5. Replace `public/config.json` with your new file
6. Deploy to GitHub Pages

### Option 2: Edit config.json Directly

1. Fork this repository to your GitHub account
2. Edit `public/config.json` with your information
3. Commit your changes
4. Enable GitHub Pages in your repository settings

That's it! Your resume website will be live at `https://yourusername.github.io/repository-name/`

## 🌟 Features

### Configurable Sections

Everything can be customized through `public/config.json`:

- **Personal Information** - Name, title, contact details, location
- **Hero Section** - Customizable title, subtitle, and background image
- **Bio Section** - Professional bio with photo
- **Portfolio** - Showcase your projects with images and links
- **Experience** - Work history with detailed responsibilities
- **Skills** - Technical and soft skills with HTML formatting support
- **Education** - Academic credentials
- **Social Links** - LinkedIn, GitHub, Twitter/X profiles
- **Contact Section** - Email and phone with customizable visibility
- **Theme Colors** - Choose your own color scheme
- **Analytics** - Optional Google Analytics integration
- **SEO Metadata** - Title, description, keywords, OG tags

### Technical Features

- **Responsive Design** - Looks great on desktop, tablet, and mobile
- **Smooth Animations** - Professional scroll animations with GSAP and ScrollMagic
- **PDF Generation** - Dynamic PDF creation from your config file
- **Single Source of Truth** - Update once, changes reflect everywhere
- **Hot Module Reloading** - Instant preview of changes during development
- **GitHub Actions** - Automated deployment to GitHub Pages

## 📋 Configuration Guide

### Basic Structure

```json
{
  "personal": {
    "name": "Your Name",
    "title": "Your Professional Title",
    "email": "your@email.com",
    "phone": "+1 555-1234",
    "website": "yourwebsite.com",
    "location": "City, State",
    "yearsOfExperience": 5
  },
  "siteMetadata": {
    "title": "Your Name | Professional Title",
    "description": "Your professional summary",
    "keywords": "your, keywords, here"
  },
  "hero": {
    "title": "Your Tagline",
    "subtitle": "With {years} years professional experience.",
    "backgroundImage": "./public/your-background.jpg"
  },
  "bio": {
    "title": "Your Bio Title",
    "image": "./public/your-photo.jpg",
    "paragraphs": [
      "First paragraph of your bio...",
      "Second paragraph..."
    ]
  },
  "portfolio": [
    {
      "title": "Project Name",
      "url": "https://project-url.com",
      "image": "./public/project-screenshot.png",
      "description": "Project description..."
    }
  ],
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/yourprofile",
    "github": "https://github.com/yourusername",
    "twitter": "https://x.com/yourhandle"
  },
  "theme": {
    "primaryColor": "#667eea",
    "secondaryColor": "#764ba2",
    "accentColor": "#3e7135"
  },
  "experience": [...],
  "skills": {...},
  "education": [...]
}
```

### Skills Section

Skills support HTML formatting for emphasis:

```json
"skills": {
  "Technical_Skills": "JavaScript, <span class=\"feature\">React</span>, Node.js",
  "Soft_Skills": "Communication, <span class=\"feature\">Leadership</span>, Problem-solving"
}
```

### Experience Section

```json
"experience": [
  {
    "title": "Senior Software Engineer",
    "dateRange": "January 2020 - Present",
    "company": "Company Name",
    "location": "City, State",
    "responsibilities": [
      "Led development of key features",
      "Mentored junior developers",
      "Improved performance by 50%"
    ]
  }
]
```

## 🛠 Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Git](https://git-scm.com/)

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/resume-site.git
cd resume-site

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Build for Production

```bash
npm run build
```

The built site will be in the `dist/` directory.

### Project Structure

```
resume-site/
├── public/               # Static assets
│   ├── config.json       # Main configuration file
│   └── [images]          # Your photos and images
├── src/
│   ├── configure.js      # Config loader and renderer
│   ├── main.js           # Animations and interactions
│   ├── generatePDF.js    # PDF generation logic
│   └── styles.css        # Styling
├── index.html            # Main HTML template
├── config-editor.html    # Visual configuration editor
├── GETTING_STARTED.md    # Beginner-friendly guide
└── package.json          # Dependencies
```

## 🚀 Deployment

### GitHub Pages (Recommended)

1. Push your code to GitHub
2. Go to **Settings** > **Pages**
3. Select **GitHub Actions** as the source
4. Your site will be live at `https://yourusername.github.io/repository-name/`

The included GitHub Actions workflow (`.github/workflows/static.yml`) will automatically build and deploy your site whenever you push changes to the main branch.

### Custom Domain

To use your own domain (e.g., `www.yourname.com`):

1. Add a `CNAME` file to the `public` folder with your domain
2. Configure your domain's DNS settings with your registrar
3. See [GitHub's custom domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

### Alternative Hosting

This is a static site and can be hosted anywhere:
- [Netlify](https://www.netlify.com/) - Drag and drop the `dist` folder
- [Vercel](https://vercel.com/) - Import from GitHub
- [Cloudflare Pages](https://pages.cloudflare.com/) - Connect your repository

## 📚 Documentation

- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Complete beginner's guide
- **[config-editor.html](config-editor.html)** - Visual configuration tool
- **[public/config.json](public/config.json)** - Example configuration

## 🎨 Customization Tips

### Changing Colors

Use the visual config editor or update the `theme` section in `config.json`:

```json
"theme": {
  "primaryColor": "#your-hex-color",
  "secondaryColor": "#your-hex-color",
  "accentColor": "#your-hex-color"
}
```

[Find colors at HTML Color Codes](https://htmlcolorcodes.com/color-picker/)

### Adding Images

1. Place images in the `public/` folder
2. Reference them in config.json:
   - `"./public/your-image.jpg"` for local images
   - `"https://url-to-image.jpg"` for external images

### Customizing Animations

Animations are controlled in `src/main.js`. You can adjust timing, effects, and triggers by modifying the GSAP and ScrollMagic configurations.

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the MIT License.

## 💡 Examples

Want to see it in action? Check out these sites built with this template:

- [Andrew Hyte's Resume](https://andrew.hyte.us) - The original!
- *Add your site here by submitting a PR!*

## 🆘 Need Help?

- Check the [GETTING_STARTED.md](GETTING_STARTED.md) guide
- Open an [issue on GitHub](https://github.com/hytea/resume-site/issues)
- Review the example config in `public/config.json`

## 🌟 Show Your Support

If you find this template helpful:
- ⭐ Star this repository
- 🍴 Fork it to create your own
- 📢 Share it with others
- 💼 Add your site to our examples!

---

**Built with ❤️ by developers, for everyone.**

Ready to create your resume website? Start with the [GETTING_STARTED.md](GETTING_STARTED.md) guide!
