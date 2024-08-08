window.generatePDF = async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const fontFamily = 'Helvetica';
  const lineColor = '#e7e7e7';

  const pageHeight = doc.internal.pageSize.height;
  const margin = 8;
  const newPageMargin = 10;
  const SECTION_TITLE_BUFFER = 8;

  // Function to check if a new page is needed
  const checkPageOverflow = (doc, currentY, lineHeight = 10) => {
    if (currentY + lineHeight > pageHeight - margin) {
      doc.addPage();
      return margin + newPageMargin;
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
      'Andrew.D.Hyte@gmail.com',
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
  };

  const addSectionTitle = (doc, title, y) => {
    doc.setFontSize(16);
    doc.setFont(fontFamily, 'bold');
    doc.setDrawColor(lineColor);
    doc.line(margin, y - 6, doc.internal.pageSize.width - margin, y - 6);
    doc.text(title, margin, y);
    doc.line(margin, y + 2, doc.internal.pageSize.width - margin, y + 2);
    doc.setFontSize(12);
    doc.setFont(fontFamily, 'normal');
    doc.setDrawColor(0);
  };

  const addSkillDetails = (doc, skillCategory, skillsHTML, y) => {
    doc.setFontSize(12);
    doc.setFont(fontFamily, 'bolditalic');
    doc.text(skillCategory, margin, y);
    doc.setFontSize(10);
    doc.setFont(fontFamily, 'normal');

    const skillsElement = document.createElement('div');
    skillsElement.innerHTML = skillsHTML;

    const spans = skillsElement.querySelectorAll('span.feature');
    spans.forEach((span) => {
      span.style.fontWeight = 'bold';
    });

    const skillText = skillsElement.innerText;
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

  // Fetch config.json
  const response = await fetch('./config.json');
  const data = await response.json();

  // Add Header
  addHeader(doc);

  // Start from Skills Profile Section
  let y = 50;

  // Check if skills data exists and is not empty
  if (data.skills && Object.keys(data.skills).length > 0) {
    addSectionTitle(doc, 'Skills Profile', y);
    y += SECTION_TITLE_BUFFER + 5;

    Object.keys(data.skills).forEach((key) => {
      if (data.skills[key].trim()) {
        y = addSkillDetails(doc, key + ':', data.skills[key], y);
      }
    });
  }

  // Add Education Section
  y = checkPageOverflow(doc, y);
  addSectionTitle(doc, 'Education', y);
  y += SECTION_TITLE_BUFFER + 5;
  data.education.forEach((edu) => {
    y = addJobDetails(
      doc,
      edu.degree,
      edu.institution,
      edu.location,
      edu.date,
      y
    );
  });

  // Add Experience Section
  y = checkPageOverflow(doc, y);
  y += SECTION_TITLE_BUFFER;
  addSectionTitle(doc, 'Relevant Experience', y);
  y += SECTION_TITLE_BUFFER + 5;
  data.experience.forEach((exp) => {
    y = addJobDetails(
      doc,
      exp.title,
      exp.company,
      exp.location,
      exp.dateRange,
      y
    );
    doc.setFontSize(11);
    doc.setFont(fontFamily, 'normal');
    exp.responsibilities.forEach((line) => {
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
};
