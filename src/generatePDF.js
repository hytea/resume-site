import { createResumePDF } from './resumePdf.mjs';

window.generatePDF = async () => {
  const response = await fetch('/config.json');
  if (!response.ok) throw new Error(`Unable to load resume data (${response.status})`);
  const data = await response.json();
  const doc = createResumePDF(data, {
    jsPDF: window.jspdf.jsPDF,
    parseBody: html => new DOMParser().parseFromString(html, 'text/html').body,
  });
  doc.save(data.outputFileName);
};
