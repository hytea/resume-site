// Description: This file contains the configuration for the resume page.
//
document.addEventListener('DOMContentLoaded', function () {
  fetch('/config.json')
    .then((response) => response.json())
    .then((data) => {
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
    });
});
