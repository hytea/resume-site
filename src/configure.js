import { renderResumeSections } from './resumeSections.mjs';

document.addEventListener('DOMContentLoaded', () => {
  fetch('/config.json')
    .then(response => response.json())
    .then(data => renderResumeSections(document, data))
    .catch(error => console.error('Error fetching config:', error));
});
