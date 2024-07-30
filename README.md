# Andrew Hyte's Resume Website

Welcome to my personal resume website! This site showcases my professional experience, skills, and projects as a Lead Frontend Software Engineer.

![Screenshot of the Website](./public/ResumeWebsiteScreenShot.png)

## 🌟 Features

- Responsive design with Bootstrap
- Interactive sections using GSAP and ScrollMagic
- Downloadable resume in PDF format
- Google Analytics for tracking
- Hot Module Reloading (HMR) with Vite
- Hosted on GitHub Pages

### Resume

The main idea of the website is to showcase my resume and only have to update it in one place. The resume is written in the site HTML and is then automatically converted to a PDF when the user clicks the download button.

#### 🛠 Important IDs and Classes for PDF Generation

To ensure the `generatePDF` function works correctly, make sure your HTML elements have the following IDs and classes:

##### Skills Section

- **Computer Science Skills:**
  - Class: `.computer-science-skills`
- **Personal and Communication Skills:**
  - Class: `.personal-communication-skills`

##### Education Section

- **Education Item:**
  - ID: `#education-section`
  - Classes: `.resume-item`, `.resume-header`, `.date-range`, `.company-details`, `.location`

##### Experience Section

- **Experience Section:**
  - ID: `#experience-section`
- **Experience Items:**
  - Classes: `.resume-item`, `.resume-header`, `.date-range`, `.company-details`, `.location`, `.responsibilities`

##### Example HTML Structure

```html
<div id="education-section">
  <div class="resume-item">
    <h4 class="resume-header">B.S. Computer Science</h4>
    <p class="date-range">Dec 2015</p>
    <p class="company-details">Brigham Young University</p>
    <p class="location">Provo, UT</p>
  </div>
</div>

<div id="experience-section">
  <div class="resume-item">
    <h4 class="resume-header">Lead Software Engineer</h4>
    <p class="date-range">Feb 2023 - Jul 2024</p>
    <p class="company-details">ON Platform DBA. GameOn</p>
    <p class="location">Remote, Heber City, UT</p>
    <ul class="responsibilities">
      <li>Led development of B2B portal.</li>
      <li>Implemented robust CI/CD pipeline.</li>
    </ul>
  </div>
</div>

<div class="skills-section">
  <div class="computer-science-skills">JavaScript. Typescript. React.</div>
  <div class="personal-communication-skills">Self-starter. Team player.</div>
</div>
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [Git](https://git-scm.com/) installed

### Installation

1. **Fork the repository:**

   Click the "Fork" button at the top-right corner of this page to create a copy of this repository under your GitHub account.

2. **Clone the repository:**

   ```bash
   git clone https://github.com/hytea/resume-website.git
   cd resume-website
   ```

## Customization

1. **Update the resume:**

   Open the `index.html` file and update the resume content as needed.

2. **Update the Google Analytics tracking ID:**

   Open the `index.html` file and update the `G-XXXXXXXXXX` value with your Google Analytics tracking ID.

3. **Update the favicon:**

   Replace the `andrew-icon.svg` file with your own favicon.

4. **Update the site title:**

   Open the `index.html` file and update the value with your own site title.

5. **Update the site description:**

   Open the `index.html` file and update the Meta data with your own site description.

6. **Update the site bio:**

   Open the `index.html` file and update the bio with your own information.

7. **Update the resume:**

   See the `Resume` section above.

8. **Update the Social Links:**

   Open the `index.html` file and update the social links with your own information.

### Hosting

1. **GitHub Pages:**
   Since the site is a static website, you can host it on GitHub Pages for free.
   - Create a new repository on GitHub.
   - Push your code to the repository.
   - Go to the repository settings.
   - Scroll down to the GitHub Pages section.
   - Select the `main` branch and click `Save`.
   - Your site will be published at `https://<username>.github.io/<repository-name>`.
   - You can also add a custom domain by following the instructions [here](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
