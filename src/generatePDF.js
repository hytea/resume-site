async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const fontFamily = 'Helvetica'; // Set the font family here
  const lineColor = '#e7e7e7'; // Set the line color here (light grey)

  const pageHeight = doc.internal.pageSize.height;
  const margin = 8;
  const newPageMargin = 10;
  const SECTION_TITLE_BUFFER = 8;

  // Function to check if a new page is needed
  const checkPageOverflow = (doc, currentY, lineHeight = 10) => {
    if (currentY + lineHeight > pageHeight - margin) {
      doc.addPage();
      return margin + newPageMargin; // add extra space at the top of a new page
    }
    return currentY;
  };

  const addHeader = (doc) => {
    doc.setFontSize(56);
    doc.setFont('helvetica', 'bold');
    doc.text('Andrew Hyte', margin, 29);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(
      '+1 801-200-8453',
      doc.internal.pageSize.width - margin,
      15,
      null,
      null,
      'right'
    );
    doc.text(
      'Andrew@Hyte.us',
      doc.internal.pageSize.width - margin,
      25,
      null,
      null,
      'right'
    );
    doc.text(
      'Andrew.Hyte.us',
      doc.internal.pageSize.width - margin,
      35,
      null,
      null,
      'right'
    );

    // Icons can be added here if necessary using `doc.addImage()`
    // Example: doc.addImage(iconData, 'PNG', x, y, width, height);
  };

  // Define a function to add section titles with top and bottom lines
  const addSectionTitle = (doc, title, y) => {
    doc.setFontSize(16);
    doc.setFont(fontFamily, 'bold');
    doc.setDrawColor(lineColor);
    doc.line(margin, y - 6, doc.internal.pageSize.width - margin, y - 6); // adjust top line position
    doc.text(title, margin, y);
    doc.line(margin, y + 2, doc.internal.pageSize.width - margin, y + 2); // add bottom line
    doc.setFontSize(12);
    doc.setFont(fontFamily, 'normal');
    doc.setDrawColor(0); // Reset to default color for other lines
  };

  // Define a function to add skill details
  const addSkillDetails = (doc, skillCategory, skills, y) => {
    doc.setFontSize(12);
    doc.setFont(fontFamily, 'bolditalic');
    doc.text(skillCategory, margin, y);
    doc.setFontSize(10);
    doc.setFont(fontFamily, 'normal');
    // Concatenate all skills into a single string with periods
    const skillText = skills.join('. ');
    const skillLines = doc.splitTextToSize(
      skillText,
      doc.internal.pageSize.width - margin * 2,
      {}
    );
    y += 5;
    skillLines[skillLines.length - 1] += '.';
    skillLines.forEach((line) => {
      y = checkPageOverflow(doc, y);
      doc.text(line, margin, y);
      y += 5;
    });
    y += 10;
    return y;
  };

  // Define a function to add job details
  const addJobDetails = (doc, jobTitle, company, location, dateRange, y) => {
    doc.setFontSize(12);
    doc.setFont(fontFamily, 'bold');
    doc.text(jobTitle, margin, y);
    doc.text(
      dateRange,
      doc.internal.pageSize.width - margin,
      y,
      null,
      null,
      'right'
    );
    doc.setFont(fontFamily, 'italic');
    doc.setFontSize(10);
    doc.text(company + ', ' + location, margin, y + 5);
    y += 10;
    return y;
  };

  // Extract skills from the DOM
  const extractSkills = (selector) => {
    const skillsElement = document.querySelector(selector);
    if (skillsElement) {
      return skillsElement.innerText
        .split('.')
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);
    }
    return [];
  };

  const computerScienceSkills = extractSkills('.computer-science-skills');
  const personalCommunicationSkills = extractSkills(
    '.personal-communication-skills'
  );

  // Add Header
  addHeader(doc);

  // Start from Skills Profile Section
  let y = 50;

  // Add Skills Profile Section
  addSectionTitle(doc, 'Skills Profile', y);
  y += SECTION_TITLE_BUFFER + 5; // Adjusted to add more space after the section title
  y = addSkillDetails(doc, 'Computer Science:', computerScienceSkills, y);
  y = addSkillDetails(
    doc,
    'Personal and Communication:',
    personalCommunicationSkills,
    y
  );

  // Add Education Section
  y = checkPageOverflow(doc, y);
  addSectionTitle(doc, 'Education', y);
  y += SECTION_TITLE_BUFFER + 5; // Adjusted to add more space after the section title
  y = addJobDetails(
    doc,
    'B.S. Computer Science',
    'Brigham Young University',
    'Provo, UT',
    'Dec 2015',
    y
  );

  // Add Experience Section
  y = checkPageOverflow(doc, y);
  y += SECTION_TITLE_BUFFER; // Add section buffer
  addSectionTitle(doc, 'Relevant Experience', y);
  y += SECTION_TITLE_BUFFER + 5; // Adjusted to add more space after the section title

  const experienceItems = document.querySelectorAll(
    '#experience-section .resume-item'
  );
  experienceItems.forEach((item) => {
    const jobTitle = item.querySelector('.resume-header').innerText;
    const dateRange = item.querySelector('.date-range').innerText;
    const company = item.querySelector('.company-details').innerText;
    const location = item.querySelector('.location').innerText;
    const responsibilitiesElement = item.querySelector('.responsibilities');
    const responsibilities = responsibilitiesElement.innerText.split('\n');

    // Calculate height needed for the job details and responsibilities
    const jobDetailsHeight = 20;
    const responsibilitiesHeight = responsibilities.length * 5;
    const totalHeight = jobDetailsHeight + responsibilitiesHeight;

    // Check if the total height exceeds the remaining space on the page
    if (y + totalHeight > pageHeight - margin) {
      doc.addPage();
      y = margin + newPageMargin; // Reset y position on the new page
    }

    y = addJobDetails(doc, jobTitle, company, location, dateRange, y);
    doc.setFontSize(11);
    doc.setFont(fontFamily, 'normal');
    responsibilities.forEach((line) => {
      y = checkPageOverflow(doc, y);
      doc.text('• ' + line, margin, y);
      y += 5;
    });
    y += 5;
  });

  // Add note at the bottom of the last page
  doc.setFontSize(8);
  doc.setFont(fontFamily, 'italic');
  doc.setTextColor(150);
  doc.text(
    'This resume was generated dynamically from the content of https://andrew.hyte.us',
    doc.internal.pageSize.width - margin,
    pageHeight - margin,
    null,
    null,
    'right'
  );

  // Save the PDF
  doc.save('Andrew_Hyte_Resume.pdf');
}
