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

  const addHeader = (doc, headerData) => {
    doc.setFontSize(56);
    doc.setFont('helvetica', 'bold');
    doc.text(headerData.title, margin, 29);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(
      headerData.phoneNumber,
      doc.internal.pageSize.width - margin,
      15,
      null,
      null,
      'right'
    );
    doc.text(
      headerData.email,
      doc.internal.pageSize.width - margin,
      25,
      null,
      null,
      'right'
    );
    doc.text(
      headerData.website,
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

  const parseHTMLAndAddToPDF = (doc, htmlContent, x, y) => {
    const parser = new DOMParser();
    const docElement = parser.parseFromString(htmlContent, 'text/html').body;

    const processNode = (node, y) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.replace(/\s+/g, ' '); // Replace multiple spaces with a single space
        if (text.length > 0) {
          const words = text.split(' ');
          words.forEach((word, index) => {
            const wordWidth = doc.getTextWidth(word);
            if (x + wordWidth > doc.internal.pageSize.width - margin) {
              y += 5; // Move to the next line if word exceeds page width
              x = margin; // Reset X position to margin
              y = checkPageOverflow(doc, y);
            }
            if (index > 0 && x > margin) {
              x += doc.getTextWidth(' '); // Add space between words, but not before the first word in a line
            }
            doc.text(word, x, y);
            x += wordWidth; // Update X position for next word
          });
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'SPAN' && node.classList.contains('feature')) {
          if (x > margin) {
            const prevChar = node.previousSibling?.textContent?.slice(-1);
            if (prevChar && !/[\s.,!?]/.test(prevChar)) {
              x += doc.getTextWidth(' '); // Add space before bold text if not punctuation
            }
          }
          doc.setFont(undefined, 'bold');
          y = processNode(node.firstChild, y);
          doc.setFont(undefined, 'normal');
          const nextChar = node.nextSibling?.textContent?.[0];
          if (nextChar && !/[\s.,!?]/.test(nextChar)) {
            x += doc.getTextWidth(' '); // Add space after bold text if not punctuation
          }
        } else {
          y = processNode(node.firstChild, y);
        }
      }

      if (node.nextSibling) {
        y = processNode(node.nextSibling, y);
      }

      return y;
    };

    return processNode(docElement, y);
  };

  const addSkillDetails = (doc, skillCategory, skillsHTML, y) => {
    doc.setFontSize(12);
    doc.setFont(fontFamily, 'bolditalic');
    doc.text(skillCategory, margin, y);
    doc.setFontSize(10);
    doc.setFont(fontFamily, 'normal');

    let x = margin; // Start X position for new text
    y = parseHTMLAndAddToPDF(doc, skillsHTML, x, y + 5);

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
  const response = await fetch('../public/config.json');
  const data = await response.json();

  // Add Header
  addHeader(doc, data.header);

  // Start from Skills Profile Section
  let y = 50;

  // Check if skills data exists and is not empty
  if (data.skills && Object.keys(data.skills).length > 0) {
    addSectionTitle(doc, 'Skills Profile', y);
    y += SECTION_TITLE_BUFFER + 5;

    Object.keys(data.skills).forEach((key) => {
      const skillCategory = key.replace(/_/g, ' ');
      if (data.skills[key].trim()) {
        y = addSkillDetails(doc, skillCategory + ':', data.skills[key], y);
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

  doc.save(data.outputFileName);
};
