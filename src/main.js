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

function trackDownloadResume() {
  gtag('event', 'download_resume', {
    event_category: 'button',
    event_label: 'Download Resume',
  });

  generatePDF();
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
