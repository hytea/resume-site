import './configure.js';
import './generatePDF.js';

// Initialize controller
var controller = new ScrollMagic.Controller();

// Define the animation for fading out as the content moves up
function fadeOutAnimation(section) {
  // Configure the animation
  var tween = gsap.timeline();
  tween.fromTo(
    '#' + section,
    { autoAlpha: 1, scale: 1 },
    { autoAlpha: 0, scale: 0.8, duration: 1 }
  );

  // Create a ScrollMagic scene
  new ScrollMagic.Scene({
    triggerElement: '#' + section + '-end',
    duration: '100%',
    triggerHook: 0.5,
  })
    .setTween(tween)
    .addTo(controller);
}

function wateredDownFadeOutAnimation(section) {
  // Configure the animation
  var tween = gsap.timeline();
  tween.fromTo(
    '#' + section,
    { autoAlpha: 1, scale: 1 },
    { autoAlpha: 0, scale: 0.8, duration: 1 }
  );

  // Create a ScrollMagic scene
  new ScrollMagic.Scene({
    triggerElement: '#' + section + '-end',
    duration: '100%',
    triggerHook: 0.25,
  })
    .setTween(tween)
    .addTo(controller);
}

// Apply the animation to each section
['bio', 'resume'].forEach(function (section) {
  fadeOutAnimation(section);
});

// Apply the watered down fade out animation to these sections
// to prevent the content from disappearing too quickly
['explainer', 'portfolio'].forEach(function (section) {
  wateredDownFadeOutAnimation(section);
});

// Calculate years of experience
const yearsOfExperience = new Date().getFullYear() - 2013;
document.getElementById('years-of-experience').textContent = yearsOfExperience;

// Get the current year for the footer
document.getElementById('current-year').textContent = new Date().getFullYear();

window.trackDownloadResume = () => {
  gtag('event', 'download_resume', {
    event_category: 'button',
    event_label: 'Download Resume',
  });

  generatePDF();
};

// Track the open of the venturebeat article
function trackOpenVentureBeat() {
  gtag('event', 'open_venturebeat', {
    event_category: 'button',
    event_label: 'Open VentureBeat Article',
  });
}

// Open a portfolio item, track the event, and open the link in a new tab
function openPortfolioItem(url, eventLabel) {
  gtag('event', 'open_portfolio_item', {
    event_category: 'button',
    event_label: eventLabel,
  });

  window.open(url, '_blank');
}

// Update the meta description with the years of experience
function updateMetaDescription() {
  const metaDescription = document.getElementById('meta-description');
  if (metaDescription) {
    metaDescription.setAttribute(
      'content',
      `Andrew Hyte's resume website. Andrew is a Lead Frontend Software Engineer with ${yearsOfExperience} years of professional experience developing web and mobile apps with various flavors of JavaScript and relevant frameworks.`
    );
  }
}

// Initialize the meta description
updateMetaDescription();

// Call the function to update the meta description when the page is loaded
document.addEventListener('DOMContentLoaded', updateMetaDescription);

// Attach functions to window
window.trackOpenVentureBeat = trackOpenVentureBeat;
window.openPortfolioItem = openPortfolioItem;
window.updateMetaDescription = updateMetaDescription;
