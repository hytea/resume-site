const form = document.querySelector('#print-form');
const fields = document.querySelector('#request-fields');
const status = document.querySelector('#status');
const fallback = document.querySelector('#fallback');

async function enableRequests() {
  try {
    const response = await fetch('/config.json');
    if (!response.ok) throw new Error('Contact configuration unavailable');
    const { header: { email } } = await response.json();
    if (!email) throw new Error('Missing contact email');
    document.querySelector('#recipient').textContent = email;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = form.elements.visitor.value.trim();
      const idea = form.elements.idea.value.trim();
      if (!name || !idea) {
        status.textContent = 'Enter your name and a description of the print.';
        (name ? form.elements.idea : form.elements.visitor).focus();
        return;
      }
      const fromPrint = new URLSearchParams(location.search).get('utm') === '3D print';
      const source = fromPrint ? '\n\nI found your page through a 3D print.' : '';
      const body = `Hi Andrew,\n\n${idea}\n\n${name}${source}`;
      const subject = 'Custom 3D print request';
      document.querySelector('#draft').value = body;
      fallback.hidden = false;
      status.textContent = 'Send the draft in your email app, or copy the message below.';
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
    fields.disabled = false;
  } catch {
    const contact = document.createElement('a');
    contact.href = '/#contact';
    contact.textContent = 'contact Andrew from his résumé';
    status.append('The form could not load. Please ', contact, '.');
  }
}

enableRequests();
