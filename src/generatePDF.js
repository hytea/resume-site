import { computeCompanyTenure } from './experienceUtils.js';

window.generatePDF = async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const fontFamily = 'Helvetica';
  const lineColor = '#e7e7e7';

  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 8;
  const newPageMargin = 10;
  const SECTION_TITLE_BUFFER = 8;
  const ROLE_INDENT = 4;
  const BULLET_INDENT = ROLE_INDENT + 2.5;

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
    doc.text(headerData.phoneNumber, pageWidth - margin, 15, null, null, 'right');
    doc.text(headerData.email, pageWidth - margin, 25, null, null, 'right');
    doc.text(headerData.website, pageWidth - margin, 35, null, null, 'right');
  };

  const addSectionTitle = (doc, title, y) => {
    doc.setFontSize(16);
    doc.setFont(fontFamily, 'bold');
    doc.setDrawColor(lineColor);
    doc.line(margin, y - 6, pageWidth - margin, y - 6);
    doc.text(title, margin, y);
    doc.line(margin, y + 2, pageWidth - margin, y + 2);
    doc.setFontSize(12);
    doc.setFont(fontFamily, 'normal');
    doc.setDrawColor(0);
  };

  const parseHTMLAndAddToPDF = (doc, htmlContent, x, y) => {
    const parser = new DOMParser();
    const docElement = parser.parseFromString(htmlContent, 'text/html').body;

    const processNode = (node, y) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.replace(/\s+/g, ' ');
        if (text.length > 0) {
          const words = text.split(' ');
          words.forEach((word, index) => {
            const wordWidth = doc.getTextWidth(word);
            if (x + wordWidth > pageWidth - margin) {
              y += 5;
              x = margin;
              y = checkPageOverflow(doc, y);
            }
            if (index > 0 && x > margin) {
              x += doc.getTextWidth(' ');
            }
            doc.text(word, x, y);
            x += wordWidth;
          });
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'SPAN' && node.classList.contains('feature')) {
          if (x > margin) {
            const prevChar = node.previousSibling?.textContent?.slice(-1);
            if (prevChar && !/[\s.,!?]/.test(prevChar)) {
              x += doc.getTextWidth(' ');
            }
          }
          doc.setFont(undefined, 'bold');
          y = processNode(node.firstChild, y);
          doc.setFont(undefined, 'normal');
          const nextChar = node.nextSibling?.textContent?.[0];
          if (nextChar && !/[\s.,!?]/.test(nextChar)) {
            x += doc.getTextWidth(' ');
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

    let x = margin;
    y = parseHTMLAndAddToPDF(doc, skillsHTML, x, y + 5);

    y += 10;
    return y;
  };

  const addEducationDetails = (doc, degree, institution, location, date, y) => {
    doc.setFontSize(12);
    doc.setFont(fontFamily, 'bold');
    doc.text(degree, margin, y);

    doc.setFont(fontFamily, 'italic');
    doc.setFontSize(10);
    doc.text(`${institution}, ${location}`, margin, y + 5);
    doc.text(date, pageWidth - margin, y + 5, null, null, 'right');
    y += 12;
    return y;
  };

  const addCompanyHeader = (doc, company, tenure, y) => {
    doc.setFontSize(13);
    doc.setFont(fontFamily, 'bold');
    doc.setTextColor(30);
    doc.text(company, margin, y);

    if (tenure) {
      doc.setFontSize(10);
      doc.setFont(fontFamily, 'italic');
      doc.setTextColor(120);
      doc.text(tenure, pageWidth - margin, y, null, null, 'right');
    }

    // Subtle underline to ground the company header
    doc.setDrawColor(lineColor);
    doc.line(margin, y + 1.8, pageWidth - margin, y + 1.8);
    doc.setDrawColor(0);
    doc.setTextColor(0);
    return y + 6;
  };

  const addRoleDetails = (doc, role, y) => {
    doc.setFontSize(11);
    doc.setFont(fontFamily, 'bold');
    doc.setTextColor(30);
    doc.text(role.title, margin + ROLE_INDENT, y);

    doc.setFont(fontFamily, 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(90);
    doc.text(role.dateRange, pageWidth - margin, y, null, null, 'right');

    if (role.location) {
      doc.setFont(fontFamily, 'italic');
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(role.location, margin + ROLE_INDENT, y + 4.2);
      y += 4.2;
    }

    doc.setTextColor(0);
    return y + 5;
  };

  // Reserve enough space so a company or role header isn't left alone
  // at the bottom of a page with its content flowing to the next.
  const ensureSpace = (doc, y, minSpace) => {
    if (y + minSpace > pageHeight - margin) {
      doc.addPage();
      return margin + newPageMargin;
    }
    return y;
  };

  // Fetch config.json
  const response = await fetch('/config.json');
  const data = await response.json();

  // Add Header
  addHeader(doc, data.header);

  let y = 50;

  // Skills Profile
  if (data.skills && Object.keys(data.skills).length > 0) {
    addSectionTitle(doc, 'Skills Profile', y);
    y += SECTION_TITLE_BUFFER + 5;

    Object.keys(data.skills).forEach((key) => {
      const skillCategory = key.replace(/_/g, ' ');
      if (data.skills[key].trim()) {
        y = addSkillDetails(doc, skillCategory + ':', data.skills[key], y);
      }
    });

    y += 3;
  }

  // Education
  y = checkPageOverflow(doc, y);
  addSectionTitle(doc, 'Education', y);
  y += SECTION_TITLE_BUFFER + 5;
  data.education.forEach((edu) => {
    y = addEducationDetails(
      doc,
      edu.degree,
      edu.institution,
      edu.location,
      edu.date,
      y
    );
  });

  // Experience
  y = checkPageOverflow(doc, y);
  y += SECTION_TITLE_BUFFER;
  addSectionTitle(doc, 'Relevant Experience', y);
  y += SECTION_TITLE_BUFFER + 5;

  data.experience.forEach((group) => {
    // Keep company header with its first role to avoid orphans
    y = ensureSpace(doc, y, 32);
    const tenure = computeCompanyTenure(group.roles || []);
    y = addCompanyHeader(doc, group.company, tenure, y);
    y += 2;

    (group.roles || []).forEach((role, idx) => {
      // Keep role title with at least one bullet line
      if (idx > 0) y = ensureSpace(doc, y, 18);
      y = addRoleDetails(doc, role, y);

      doc.setFontSize(10);
      doc.setFont(fontFamily, 'normal');
      doc.setTextColor(0);
      (role.responsibilities || []).forEach((line) => {
        const wrappedText = doc.splitTextToSize(
          line,
          pageWidth - 2 * margin - ROLE_INDENT
        );
        wrappedText.forEach((textLine, index) => {
          y = checkPageOverflow(doc, y);
          if (index === 0) {
            doc.text('• ' + textLine, margin + ROLE_INDENT, y);
          } else {
            doc.text(textLine, margin + BULLET_INDENT, y);
          }
          y += 4.5;
        });
      });
      y += 3;
    });
    y += 3;
  });

  // Footer note
  doc.setFontSize(8);
  doc.setFont(fontFamily, 'italic');
  doc.setTextColor(150);
  doc.text(
    'This resume was generated dynamically from the content of https://andrew.hyte.us',
    pageWidth - margin,
    pageHeight - margin,
    null,
    null,
    'right'
  );

  doc.save(data.outputFileName);
};
