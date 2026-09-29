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
  const BULLET_LINE_HEIGHT = 4.5;
  // Keep body text clear of the footer note on the last page
  const bottomLimit = pageHeight - margin - 4;

  // Function to check if a new page is needed
  const checkPageOverflow = (doc, currentY, lineHeight = 10) => {
    if (currentY + lineHeight > bottomLimit) {
      doc.addPage();
      return margin + newPageMargin;
    }
    return currentY;
  };

  const addHeader = (doc, headerData) => {
    doc.setFontSize(56);
    doc.setFont('helvetica', 'bold');
    doc.text(headerData.title, margin, 29);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const contactLines = [
      headerData.phoneNumber,
      headerData.email,
      headerData.website,
      headerData.linkedin,
      headerData.github,
    ].filter(Boolean);
    const contactStep = 6;
    const contactTop = 29 - ((contactLines.length - 1) * contactStep) / 2;
    contactLines.forEach((line, i) => {
      doc.text(line, pageWidth - margin, contactTop + i * contactStep, null, null, 'right');
    });
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

  // Lays out inline HTML where <span class="feature"> is bold. Words
  // glued together with no whitespace (for example a bold phrase and the
  // comma after it) wrap as one unit, so punctuation never starts a line.
  // Each line is drawn as runs of same-weight text so viewer font metrics
  // handle the spacing inside a run.
  const parseHTMLAndAddToPDF = (doc, htmlContent, x, y, lineHeight = 5) => {
    const body = new DOMParser().parseFromString(htmlContent, 'text/html')
      .body;

    const words = [];
    let pendingSpace = false;
    const walk = (node, bold) => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/(\s+)/).forEach((piece) => {
          if (!piece) return;
          if (/^\s+$/.test(piece)) {
            pendingSpace = true;
            return;
          }
          words.push({
            text: piece,
            bold,
            spaceBefore: pendingSpace && words.length > 0,
          });
          pendingSpace = false;
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const isFeature =
          node.tagName === 'SPAN' && node.classList.contains('feature');
        node.childNodes.forEach((child) => walk(child, bold || isFeature));
      }
    };
    body.childNodes.forEach((child) => walk(child, false));

    const widthOf = (text, bold) => {
      doc.setFont(fontFamily, bold ? 'bold' : 'normal');
      return doc.getTextWidth(text);
    };
    const spaceWidth = widthOf(' ', false);

    // Group glued words into chunks that must stay on one line
    const chunks = [];
    words.forEach((word) => {
      if (!word.spaceBefore && chunks.length) {
        chunks[chunks.length - 1].push(word);
      } else {
        chunks.push([word]);
      }
    });

    const lines = [];
    let line = [];
    let lineX = x;
    let cursor = x;
    chunks.forEach((chunk) => {
      const chunkWidth = chunk.reduce((w, wd) => w + widthOf(wd.text, wd.bold), 0);
      const gap = line.length ? spaceWidth : 0;
      if (line.length && cursor + gap + chunkWidth > pageWidth - margin) {
        lines.push({ x: lineX, words: line });
        line = [];
        lineX = margin;
        cursor = margin;
      }
      if (!line.length) chunk[0] = { ...chunk[0], spaceBefore: false };
      line.push(...chunk);
      cursor += (line.length > chunk.length ? spaceWidth : 0) + chunkWidth;
    });
    if (line.length) lines.push({ x: lineX, words: line });

    lines.forEach((ln, i) => {
      if (i > 0) {
        y += lineHeight;
        y = checkPageOverflow(doc, y);
      }
      let cx = ln.x;
      let run = null;
      const flush = () => {
        if (!run) return;
        doc.setFont(fontFamily, run.bold ? 'bold' : 'normal');
        doc.text(run.text, cx, y);
        cx += doc.getTextWidth(run.text);
        run = null;
      };
      ln.words.forEach((wd) => {
        if (run && run.bold === wd.bold) {
          run.text += (wd.spaceBefore ? ' ' : '') + wd.text;
        } else {
          flush();
          if (wd.spaceBefore) cx += spaceWidth;
          run = { bold: wd.bold, text: wd.text };
        }
      });
      flush();
    });
    doc.setFont(fontFamily, 'normal');
    return y;
  };

  const addSkillDetails = (doc, skillCategory, skillsHTML, y) => {
    y = checkPageOverflow(doc, y);
    doc.setFontSize(10);
    doc.setFont(fontFamily, 'bolditalic');
    doc.text(skillCategory, margin, y);
    // Label metrics vary slightly across viewers, so leave a fixed gap
    const labelWidth = doc.getTextWidth(skillCategory) + 1.5;
    doc.setFont(fontFamily, 'normal');

    y = parseHTMLAndAddToPDF(doc, skillsHTML, margin + labelWidth, y);

    y += 6.5;
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
    if (y + minSpace > bottomLimit) {
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

  const bulletWidth = pageWidth - margin - (margin + BULLET_INDENT);
  const wrapBullet = (line) => {
    doc.setFontSize(10);
    doc.setFont(fontFamily, 'normal');
    return doc.splitTextToSize(line, bulletWidth);
  };
  const bulletHeight = (line) => wrapBullet(line).length * BULLET_LINE_HEIGHT;
  const ROLE_HEADER_HEIGHT = 9.5;

  // Experience
  addSectionTitle(doc, 'Relevant Experience', y);
  y += SECTION_TITLE_BUFFER + 5;

  data.experience.forEach((group) => {
    // Keep the company header with its first role and first bullet
    const firstRole = (group.roles || [])[0];
    const firstBullet = firstRole?.responsibilities?.[0];
    y = ensureSpace(
      doc,
      y,
      8 + ROLE_HEADER_HEIGHT + (firstBullet ? bulletHeight(firstBullet) : 0)
    );
    const tenure = computeCompanyTenure(group.roles || []);
    y = addCompanyHeader(doc, group.company, tenure, y);
    y += 2;

    (group.roles || []).forEach((role) => {
      // Keep the role title with at least its first bullet
      const first = role.responsibilities?.[0];
      y = ensureSpace(
        doc,
        y,
        ROLE_HEADER_HEIGHT + (first ? bulletHeight(first) : 0)
      );
      y = addRoleDetails(doc, role, y);

      (role.responsibilities || []).forEach((line) => {
        const wrappedText = wrapBullet(line);
        // Never split a bullet across pages
        y = ensureSpace(doc, y, wrappedText.length * BULLET_LINE_HEIGHT);
        doc.setFontSize(10);
        doc.setFont(fontFamily, 'normal');
        doc.setTextColor(0);
        wrappedText.forEach((textLine, index) => {
          if (index === 0) {
            doc.text('\u2022', margin + ROLE_INDENT, y);
          }
          doc.text(textLine, margin + BULLET_INDENT, y);
          y += BULLET_LINE_HEIGHT;
        });
      });
      y += 2.5;
    });
    y += 2.5;
  });

  // Skills Profile
  if (data.skills && Object.keys(data.skills).length > 0) {
    y = ensureSpace(doc, y + 6, 30);
    addSectionTitle(doc, 'Skills Profile', y);
    y += SECTION_TITLE_BUFFER + 3;

    Object.keys(data.skills).forEach((key) => {
      const skillCategory = key.replace(/_/g, ' ');
      if (data.skills[key].trim()) {
        y = addSkillDetails(doc, skillCategory + ':', data.skills[key], y);
      }
    });
  }

  // Education
  y = ensureSpace(doc, y + 4, 18);
  addSectionTitle(doc, 'Education', y);
  y += SECTION_TITLE_BUFFER + 3;
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
