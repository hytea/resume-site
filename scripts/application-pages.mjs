import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { jsPDF } from 'jspdf';
import { parseHTML } from 'linkedom';
import { createResumePDF } from '../src/resumePdf.mjs';
import { renderResumeSections } from '../src/resumeSections.mjs';

const configDirectory = new URL('../src/data/', import.meta.url);
const templateFile = new URL('../application-template.html', import.meta.url);
const generalResumeFile = new URL('../public/config.json', import.meta.url);
const domainFile = new URL('../public/CNAME', import.meta.url);
const templateName = 'application-template.html';
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const sectionLabels = {
  bio: 'Overview',
  highlights: 'Selected Work',
  portfolio: 'Portfolio',
  resume: 'Resume',
  contact: 'Contact',
};

function loadApplication(slug) {
  const file = new URL(`${slug}.json`, configDirectory);
  const data = JSON.parse(readFileSync(file, 'utf8'));
  if (!data.application?.company || !/^[\w.-]+\.pdf$/.test(data.outputFileName)) {
    throw new Error(`${slug}.json needs an application company and a PDF filename.`);
  }
  const { experience } = JSON.parse(readFileSync(generalResumeFile, 'utf8'));
  const companies = new Map(experience.map(group => [group.company, group]));
  data.experience = data.experience.map(group => ({
    logo: companies.get(group.company)?.logo,
    logoBackground: companies.get(group.company)?.logoBackground,
    ...group,
  }));
  return data;
}

function renderApplication(html, slug, data) {
  const { document } = parseHTML(html);
  const { company, team, role } = data.application;
  const { page = {}, header } = data;
  const byId = id => document.getElementById(id);
  const element = (tag, className, content) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content) node.textContent = content;
    return node;
  };
  const title = [header.title, company, team].filter(Boolean).join(' | ');
  const description = page.description || `${header.title}'s resume for ${company}.`;
  const domain = readFileSync(domainFile, 'utf8').trim();
  const url = `https://${domain}/${slug}/`;
  document.title = title;
  document.querySelector('meta[name="description"]').content = description;
  document.querySelector('meta[property="og:title"]').content = title;
  document.querySelector('meta[property="og:description"]').content = description;
  document.querySelector('meta[property="og:url"]').content = url;
  document.querySelector('link[rel="canonical"]').setAttribute('href', url);

  byId('application-name').textContent = header.title;
  byId('application-current-title').textContent = header.currentTitle || '';
  const headline = byId('application-headline');
  headline.textContent = page.headline || role || `Application for ${company}`;
  if (page.headlineAccent) {
    headline.append(' ', element('span', 'lush-mark', page.headlineAccent));
  }
  byId('application-intro').textContent = page.intro || role || '';
  byId('application-role').textContent = role || '';
  byId('application-summary').innerHTML = data.summary || '';
  byId('personal-project').textContent = data.personalProject || '';
  if (!data.personalProject || page.showPersonalProject === false) {
    byId('application-personal-project').remove();
  }
  for (const link of document.querySelectorAll('[data-resume-download]')) {
    link.setAttribute('href', `/${slug}/${data.outputFileName}`);
  }

  const requested = page.sections || Object.keys(sectionLabels);
  const available = {
    bio: Boolean(data.summary),
    highlights: Boolean(data.highlights?.length),
    portfolio: Boolean(data.portfolio?.length),
    resume: true,
    contact: Boolean(header.email || header.linkedin || header.github),
  };
  for (const [id, label] of Object.entries(sectionLabels)) {
    if (!requested.includes(id) || !available[id]) {
      byId(id).remove();
      continue;
    }
    for (const [navId, linkClass] of [
      ['application-nav-links', 'nav-link'],
      ['application-side-nav', 'nav-link side-nav-link'],
    ]) {
      const nav = byId(navId);
      const item = element('li', 'nav-item');
      const link = element('a', linkClass, label);
      link.setAttribute('href', `#${id}`);
      item.append(link);
      nav.insertBefore(item, navId === 'application-nav-links' ? nav.lastElementChild : null);
    }
  }
  if (!byId('application-side-nav').children.length) {
    byId('application-side-nav').closest('aside').remove();
  }

  for (const [id, items] of [
    ['application-highlights', data.highlights],
    ['application-portfolio', data.portfolio],
  ]) {
    const container = byId(id);
    if (!container) continue;
    for (const item of items) {
      const card = element('article', 'company-card');
      card.append(element('h3', 'company-name mb-3', item.title));
      if (item.image) {
        const img = element('img', 'img-fluid rounded mb-3');
        img.src = item.image;
        img.alt = item.imageAlt || item.title;
        img.loading = 'lazy';
        card.append(img);
      }
      card.append(element('p', 'mb-0', item.description));
      if (item.url) {
        const link = element('a', 'd-inline-block mt-3', item.linkLabel || `View ${item.title}`);
        link.setAttribute('href', item.url);
        card.append(link);
      }
      container.append(card);
    }
  }

  if (byId('resume')) renderResumeSections(document, data);
  const contactLinks = byId('application-contact-links');
  if (contactLinks) {
    for (const [label, href] of [
      ['Email Me', header.email && `mailto:${header.email}`],
      ['LinkedIn', header.linkedin && `https://${header.linkedin}`],
      ['GitHub', header.github && `https://${header.github}`],
    ]) {
      if (!href) continue;
      const link = element('a', 'btn btn-primary-contact', label);
      link.setAttribute('href', href);
      contactLinks.append(link);
    }
  }
  return document.toString();
}

function resumePdf(data) {
  const doc = createResumePDF(data, {
    jsPDF,
    parseBody: html => parseHTML(`<html><body>${html}</body></html>`).document.body,
  });
  return Buffer.from(doc.output('arraybuffer'));
}

export function applicationPages() {
  return {
    name: 'application-pages',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const [slug, ...parts] = (req.url || '').split('?')[0].slice(1).split('/');
        if (!slugPattern.test(slug) || !existsSync(new URL(`${slug}.json`, configDirectory))) {
          return next();
        }
        try {
          const data = loadApplication(slug);
          const filename = parts.join('/');
          if (filename === data.outputFileName) {
            res.setHeader('Content-Type', 'application/pdf');
            return res.end(resumePdf(data));
          }
          if (filename && filename !== 'index.html') return next();
          const html = renderApplication(readFileSync(templateFile, 'utf8'), slug, data);
          const transformed = await server.transformIndexHtml(`/${templateName}`, html, req.url);
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(transformed);
        } catch (error) {
          next(error);
        }
      });
    },
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        const template = bundle[templateName];
        if (!template) throw new Error('Vite did not build the application template.');
        for (const filename of readdirSync(configDirectory).filter(name => name.endsWith('.json'))) {
          const slug = filename.slice(0, -5);
          if (!slugPattern.test(slug)) throw new Error(`Invalid application slug: ${slug}`);
          const data = loadApplication(slug);
          this.emitFile({
            type: 'asset',
            fileName: `${slug}/index.html`,
            source: renderApplication(template.source.toString(), slug, data),
          });
          this.emitFile({
            type: 'asset',
            fileName: `${slug}/${data.outputFileName}`,
            source: resumePdf(data),
          });
        }
        delete bundle[templateName];
      },
    },
  };
}
