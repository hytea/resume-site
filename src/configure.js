// Description: This file contains the configuration for the resume page.
//
document.addEventListener('DOMContentLoaded', function () {
  fetch('./config.json')
    .then((response) => response.json())
    .then((data) => {
      // Set site metadata
      if (data.siteMetadata) {
        document.title = data.siteMetadata.title || document.title;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) metaDescription.content = data.siteMetadata.description || '';
        const metaAuthor = document.querySelector('meta[name="author"]');
        if (metaAuthor) metaAuthor.content = data.siteMetadata.author || '';
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) metaKeywords.content = data.siteMetadata.keywords || '';

        // OG tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.content = data.siteMetadata.title || '';
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) ogDescription.content = data.siteMetadata.description || '';
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) ogImage.content = data.siteMetadata.ogImage || '';
        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.content = data.siteMetadata.ogUrl || '';

        // Twitter tags
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) twitterTitle.content = data.siteMetadata.title || '';
        const twitterDescription = document.querySelector('meta[name="twitter:description"]');
        if (twitterDescription) twitterDescription.content = data.siteMetadata.description || '';
        const twitterImage = document.querySelector('meta[name="twitter:image"]');
        if (twitterImage) twitterImage.content = data.siteMetadata.ogImage || '';
        const twitterDomain = document.querySelector('meta[name="twitter:domain"]');
        if (twitterDomain) twitterDomain.content = data.siteMetadata.ogUrl || '';
      }

      // Set personal info in navbar and footer
      if (data.personal) {
        const navbarBrand = document.querySelector('.navbar-brand');
        if (navbarBrand) navbarBrand.textContent = data.personal.name;

        // Update hero title
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle && data.hero) {
          heroTitle.textContent = data.hero.title || data.personal.title;
        }

        // Update years of experience
        const yearsSpan = document.getElementById('years-of-experience');
        if (yearsSpan) {
          if (data.hero?.showYearsCalculation) {
            const currentYear = new Date().getFullYear();
            const startYear = currentYear - (data.personal.yearsOfExperience || 0);
            yearsSpan.textContent = currentYear - startYear;
          } else {
            yearsSpan.textContent = data.personal.yearsOfExperience || 0;
          }
        }

        // Update footer
        const footer = document.querySelector('.footer p');
        if (footer) {
          const currentYear = new Date().getFullYear();
          footer.innerHTML = `&copy; <span id="current-year">${currentYear}</span> ${data.personal.name}. All Rights Reserved.`;
        }
      }

      // Apply theme colors
      if (data.theme) {
        const root = document.documentElement;
        if (data.theme.primaryColor) root.style.setProperty('--primary-color', data.theme.primaryColor);
        if (data.theme.secondaryColor) root.style.setProperty('--secondary-color', data.theme.secondaryColor);
        if (data.theme.accentColor) root.style.setProperty('--accent-color', data.theme.accentColor);
      }

      // Set Google Analytics ID
      if (data.analytics?.googleAnalyticsId) {
        // The GA script is already loaded in the HTML, just update the config call if needed
        if (window.gtag) {
          window.gtag('config', data.analytics.googleAnalyticsId);
        }
      }

      // Generate Bio Section
      if (data.bio) {
        const bioSection = document.getElementById('bio');
        if (bioSection) {
          const bioTitle = bioSection.querySelector('h2');
          if (bioTitle) bioTitle.textContent = data.bio.title;

          const bioImage = bioSection.querySelector('img');
          if (bioImage && data.bio.image) {
            bioImage.src = data.bio.image;
            bioImage.alt = data.bio.imageAlt || '';
          }

          const bioContent = bioSection.querySelector('.col-md-8');
          if (bioContent && data.bio.paragraphs) {
            // Clear existing paragraphs
            const paragraphs = bioContent.querySelectorAll('p');
            paragraphs.forEach(p => p.remove());

            // Add new paragraphs
            data.bio.paragraphs.forEach(text => {
              const p = document.createElement('p');
              p.textContent = text;
              bioContent.appendChild(p);
            });
          }
        }
      }

      // Generate Portfolio Section
      if (data.portfolio) {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (portfolioGrid) {
          portfolioGrid.innerHTML = '';

          data.portfolio.forEach(item => {
            const portfolioItem = document.createElement('div');
            portfolioItem.classList.add('portfolio-item');
            portfolioItem.onclick = () => {
              window.open(item.url, '_blank');
              if (window.gtag) {
                window.gtag('event', 'click_portfolio', {
                  event_category: 'portfolio',
                  event_label: item.title
                });
              }
            };

            const header = document.createElement('div');
            header.classList.add('portfolio-header');
            const title = document.createElement('h4');
            title.textContent = item.title;
            header.appendChild(title);

            const imageContainer = document.createElement('div');
            imageContainer.classList.add('portfolio-image-container');

            // Special handling for architecture diagram
            if (item.image === 'architecture-diagram') {
              imageContainer.classList.add('architecture-diagram');
              imageContainer.innerHTML = `
                <svg viewBox="0 0 400 300" class="arch-svg">
                  <rect x="150" y="20" width="100" height="60" rx="8" fill="#3e7135" />
                  <text x="200" y="45" text-anchor="middle" fill="white" font-size="14" font-weight="bold">config.json</text>
                  <text x="200" y="65" text-anchor="middle" fill="white" font-size="11">Single Source</text>
                  <path d="M 175 80 L 100 150" stroke="#666" stroke-width="3" fill="none" marker-end="url(#arrowhead)" />
                  <path d="M 225 80 L 300 150" stroke="#666" stroke-width="3" fill="none" marker-end="url(#arrowhead)" />
                  <rect x="30" y="150" width="140" height="80" rx="8" fill="#667eea" />
                  <text x="100" y="175" text-anchor="middle" fill="white" font-size="14" font-weight="bold">Website</text>
                  <text x="100" y="195" text-anchor="middle" fill="white" font-size="10">Dynamic Rendering</text>
                  <text x="100" y="210" text-anchor="middle" fill="white" font-size="10">DOM Manipulation</text>
                  <rect x="230" y="150" width="140" height="80" rx="8" fill="#764ba2" />
                  <text x="300" y="175" text-anchor="middle" fill="white" font-size="14" font-weight="bold">PDF</text>
                  <text x="300" y="195" text-anchor="middle" fill="white" font-size="10">jsPDF Generation</text>
                  <text x="300" y="210" text-anchor="middle" fill="white" font-size="10">Custom Rendering</text>
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="#666" />
                    </marker>
                  </defs>
                </svg>
              `;
            } else {
              const img = document.createElement('img');
              img.src = item.image;
              img.alt = `${item.title} Screenshot`;
              img.classList.add('portfolio-image');
              imageContainer.appendChild(img);
            }

            const description = document.createElement('div');
            description.classList.add('portfolio-description');
            description.textContent = item.description;

            portfolioItem.appendChild(header);
            portfolioItem.appendChild(imageContainer);
            portfolioItem.appendChild(description);

            portfolioGrid.appendChild(portfolioItem);
          });
        }
      }

      // Update Contact Section
      if (data.contact) {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          const contactTitle = contactSection.querySelector('h2');
          if (contactTitle) contactTitle.textContent = data.contact.title;

          const contactSubtitle = contactSection.querySelector('.lead');
          if (contactSubtitle) contactSubtitle.textContent = data.contact.subtitle;

          // Show/hide email and phone buttons
          const emailBtn = document.getElementById('contact-email');
          const phoneBtn = document.getElementById('contact-phone');
          if (emailBtn && !data.contact.showEmail) emailBtn.style.display = 'none';
          if (phoneBtn && !data.contact.showPhone) phoneBtn.style.display = 'none';
        }
      }

      // Update Social Links
      if (data.socialLinks) {
        const linkedinLink = document.querySelector('.social-btn-linkedin');
        const githubLink = document.querySelector('.social-btn-github');
        const twitterLink = document.querySelector('.social-btn-twitter');

        if (linkedinLink) {
          if (data.socialLinks.linkedin) {
            linkedinLink.href = data.socialLinks.linkedin;
          } else {
            linkedinLink.style.display = 'none';
          }
        }

        if (githubLink) {
          if (data.socialLinks.github) {
            githubLink.href = data.socialLinks.github;
          } else {
            githubLink.style.display = 'none';
          }
        }

        if (twitterLink) {
          if (data.socialLinks.twitter) {
            twitterLink.href = data.socialLinks.twitter;
          } else {
            twitterLink.style.display = 'none';
          }
        }
      }

      // Generate Navigation (if custom navigation is provided)
      if (data.navigation) {
        const navbarNav = document.querySelector('.navbar-nav');
        if (navbarNav) {
          // Keep the download resume button
          const downloadBtn = navbarNav.querySelector('.download-resume-container')?.parentElement;

          // Clear existing nav items
          const navItems = navbarNav.querySelectorAll('.nav-item:not(:has(.download-resume-container))');
          navItems.forEach(item => item.remove());

          // Add new nav items
          data.navigation.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('nav-item');
            const a = document.createElement('a');
            a.classList.add('nav-link');
            a.href = item.href;
            a.textContent = item.label;
            li.appendChild(a);

            if (downloadBtn) {
              navbarNav.insertBefore(li, downloadBtn);
            } else {
              navbarNav.appendChild(li);
            }
          });

          // Update side nav as well
          const sideNav = document.querySelector('.side-nav');
          if (sideNav) {
            sideNav.innerHTML = '';
            data.navigation.forEach(item => {
              const li = document.createElement('li');
              li.classList.add('nav-item');
              const a = document.createElement('a');
              a.classList.add('nav-link', 'side-nav-link');
              a.href = item.href;
              a.dataset.section = item.href.replace('#', '');
              a.textContent = item.label;
              li.appendChild(a);
              sideNav.appendChild(li);
            });
          }
        }
      }

      // Generate Experience Section (existing functionality)
      const experienceSection = document.getElementById('experience-section');
      experienceSection.innerHTML = '';
      data.experience.forEach((item) => {
        const resumeItem = document.createElement('div');
        resumeItem.classList.add('resume-item');

        const header = document.createElement('div');
        header.classList.add(
          'd-flex',
          'flex-column',
          'flex-sm-row',
          'justify-content-between',
          'align-items-start',
          'align-items-sm-center'
        );
        const title = document.createElement('h4');
        title.classList.add('resume-header');
        title.textContent = item.title;
        const dateRange = document.createElement('p');
        dateRange.classList.add('date-range');
        dateRange.textContent = item.dateRange;
        header.appendChild(title);
        header.appendChild(dateRange);

        const companyDetails = document.createElement('div');
        companyDetails.classList.add(
          'd-flex',
          'flex-column',
          'flex-sm-row',
          'justify-content-between',
          'align-items-start',
          'align-items-sm-center'
        );
        const company = document.createElement('p');
        company.classList.add('company-details');
        company.textContent = item.company;
        const location = document.createElement('p');
        location.classList.add('location');
        location.textContent = item.location;
        companyDetails.appendChild(company);
        companyDetails.appendChild(location);

        const responsibilities = document.createElement('div');
        responsibilities.classList.add('resume-content');
        const ul = document.createElement('ul');
        ul.classList.add('responsibilities');
        item.responsibilities.forEach((responsibility) => {
          const li = document.createElement('li');
          li.textContent = responsibility;
          ul.appendChild(li);
        });
        responsibilities.appendChild(ul);

        resumeItem.appendChild(header);
        resumeItem.appendChild(companyDetails);
        resumeItem.appendChild(responsibilities);

        experienceSection.appendChild(resumeItem);
      });

      // Generate Skills Section
      const skillsSection = document.getElementById('skills-section');
      skillsSection.innerHTML = '';

      Object.keys(data.skills).forEach((key) => {
        const skillCategory = key.replace(/_/g, ' ');

        const skillItem = document.createElement('div');
        skillItem.classList.add('resume-item');

        const skillHeader = document.createElement('h4');
        skillHeader.classList.add('resume-header');
        skillHeader.textContent = `${skillCategory}:`;

        const skillContent = document.createElement('div');
        skillContent.classList.add('resume-content');

        // This will safely parse the HTML content and allow features to be bolded
        const parser = new DOMParser();
        const parsedHTML = parser.parseFromString(
          `<p>${data.skills[key]}</p>`,
          'text/html'
        );
        const paragraph = parsedHTML.body.firstChild;

        skillContent.appendChild(paragraph);

        skillItem.appendChild(skillHeader);
        skillItem.appendChild(skillContent);

        skillsSection.appendChild(skillItem);
      });

      // Generate Education Section
      const educationSection = document.getElementById('education-section');
      educationSection.innerHTML = '';
      data.education.forEach((item) => {
        const educationItem = document.createElement('div');
        educationItem.classList.add('resume-item');

        const header = document.createElement('div');
        header.classList.add(
          'd-flex',
          'flex-column',
          'flex-sm-row',
          'justify-content-between',
          'align-items-start',
          'align-items-sm-center'
        );
        const degree = document.createElement('h4');
        degree.classList.add('resume-header');
        degree.textContent = item.degree;
        const date = document.createElement('p');
        date.classList.add('date-range');
        date.textContent = item.date;
        header.appendChild(degree);
        header.appendChild(date);

        const institutionDetails = document.createElement('div');
        institutionDetails.classList.add(
          'd-flex',
          'flex-column',
          'flex-sm-row',
          'justify-content-between',
          'align-items-start',
          'align-items-sm-center'
        );
        const institution = document.createElement('p');
        institution.classList.add('company-details');
        institution.textContent = item.institution;
        const location = document.createElement('p');
        location.classList.add('location');
        location.textContent = item.location;
        institutionDetails.appendChild(institution);
        institutionDetails.appendChild(location);

        educationItem.appendChild(header);
        educationItem.appendChild(institutionDetails);

        educationSection.appendChild(educationItem);
      });
    })
    .catch((error) => {
      console.error('Error fetching config:', error);

      // Display user-facing error message
      const sections = ['experience-section', 'skills-section', 'education-section'];
      sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.innerHTML = `
            <div class="alert alert-danger" role="alert">
              <h4 class="alert-heading">Unable to Load Content</h4>
              <p>We're having trouble loading the resume data. Please try refreshing the page.</p>
              <hr>
              <p class="mb-0">If the problem persists, please contact the site administrator.</p>
            </div>
          `;
        }
      });
    });
});
