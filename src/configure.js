// Description: This file contains the configuration for the resume page.
//
import {
  computeCompanyTenure,
  getInitials,
  roleDuration,
} from './experienceUtils.js';

function buildCompanyLogo(group) {
  const logoWrap = document.createElement('div');
  logoWrap.classList.add('company-logo');

  if (group.logo) {
    const img = document.createElement('img');
    img.src = group.logo;
    img.alt = `${group.company} logo`;
    img.loading = 'lazy';
    img.addEventListener('error', () => {
      logoWrap.innerHTML = '';
      logoWrap.classList.add('company-logo-fallback');
      const initials = document.createElement('span');
      initials.classList.add('company-logo-initials');
      initials.textContent = getInitials(group.company);
      logoWrap.appendChild(initials);
    });
    logoWrap.appendChild(img);
  } else {
    logoWrap.classList.add('company-logo-fallback');
    const initials = document.createElement('span');
    initials.classList.add('company-logo-initials');
    initials.textContent = getInitials(group.company);
    logoWrap.appendChild(initials);
  }
  return logoWrap;
}

function buildRoleItem(role) {
  const item = document.createElement('li');
  item.classList.add('role-item');

  const marker = document.createElement('span');
  marker.classList.add('role-marker');
  marker.setAttribute('aria-hidden', 'true');
  item.appendChild(marker);

  const content = document.createElement('div');
  content.classList.add('role-content');

  const title = document.createElement('h4');
  title.classList.add('role-title');
  title.textContent = role.title;
  content.appendChild(title);

  const meta = document.createElement('p');
  meta.classList.add('role-meta');
  const date = document.createElement('span');
  date.classList.add('role-date');
  date.textContent = role.dateRange;
  meta.appendChild(date);

  const duration = roleDuration(role);
  if (duration) {
    const sep = document.createElement('span');
    sep.classList.add('role-sep');
    sep.setAttribute('aria-hidden', 'true');
    sep.textContent = '·';
    meta.appendChild(sep);
    const dur = document.createElement('span');
    dur.classList.add('role-duration');
    dur.textContent = duration;
    meta.appendChild(dur);
  }

  if (role.location) {
    const sep = document.createElement('span');
    sep.classList.add('role-sep');
    sep.setAttribute('aria-hidden', 'true');
    sep.textContent = '·';
    meta.appendChild(sep);
    const loc = document.createElement('span');
    loc.classList.add('role-location');
    loc.textContent = role.location;
    meta.appendChild(loc);
  }
  content.appendChild(meta);

  if (role.responsibilities && role.responsibilities.length) {
    const ul = document.createElement('ul');
    ul.classList.add('responsibilities');
    role.responsibilities.forEach((responsibility) => {
      const li = document.createElement('li');
      li.textContent = responsibility;
      ul.appendChild(li);
    });
    content.appendChild(ul);
  }

  item.appendChild(content);
  return item;
}

function buildCompanyCard(group) {
  const card = document.createElement('article');
  card.classList.add('company-card', 'resume-item');

  const header = document.createElement('header');
  header.classList.add('company-header');
  header.appendChild(buildCompanyLogo(group));

  const info = document.createElement('div');
  info.classList.add('company-info');

  const name = document.createElement('h3');
  name.classList.add('company-name');
  name.textContent = group.company;
  info.appendChild(name);

  const tenure = computeCompanyTenure(group.roles || []);
  if (tenure) {
    const tenureEl = document.createElement('p');
    tenureEl.classList.add('company-tenure');
    tenureEl.textContent = tenure;
    info.appendChild(tenureEl);
  }

  header.appendChild(info);
  card.appendChild(header);

  const timeline = document.createElement('ol');
  timeline.classList.add('role-timeline');
  (group.roles || []).forEach((role) => {
    timeline.appendChild(buildRoleItem(role));
  });
  if ((group.roles || []).length <= 1) {
    timeline.classList.add('role-timeline-single');
  }
  card.appendChild(timeline);

  return card;
}

document.addEventListener('DOMContentLoaded', function () {
  fetch('/config.json')
    .then((response) => response.json())
    .then((data) => {
      // Generate Experience Section (grouped by company)
      const experienceSection = document.getElementById('experience-section');
      experienceSection.innerHTML = '';
      data.experience.forEach((group) => {
        experienceSection.appendChild(buildCompanyCard(group));
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
    });
});
