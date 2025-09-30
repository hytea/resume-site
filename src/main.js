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
// Note: 'explainer' section is currently commented out in HTML
['portfolio'].forEach(function (section) {
  wateredDownFadeOutAnimation(section);
});

// Calculate years of experience with counter animation
const yearsOfExperience = new Date().getFullYear() - 2013;

function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16); // 60 FPS
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start);
    }
  }, 16);
}

// Animate counter when element is in view
const yearsElement = document.getElementById('years-of-experience');
if (yearsElement) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(yearsElement, yearsOfExperience, 1500);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(yearsElement);
}

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.textContent = '';

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Apply typing animation to hero title
document.addEventListener('DOMContentLoaded', () => {
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    typeWriter(heroTitle, originalText, 80);
  }
});

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

// Active section highlighting for side navigation
function highlightActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.side-nav-link');

  let currentSection = '';
  const scrollPosition = window.scrollY + 100; // Offset for navbar

  // Check if we're at the bottom of the page
  const isAtBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50;

  // If at bottom, always highlight the last section (Contact)
  if (isAtBottom) {
    const lastSection = sections[sections.length - 1];
    if (lastSection) {
      currentSection = lastSection.getAttribute('id');
    }
  } else {
    // Normal scroll-based detection
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
  }

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-section') === currentSection) {
      link.classList.add('active');
    }
  });
}

// Run on scroll and page load
window.addEventListener('scroll', highlightActiveSection);
window.addEventListener('DOMContentLoaded', highlightActiveSection);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (hero) {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;
    hero.style.backgroundPositionY = -(scrolled * parallaxSpeed) + 'px';
  }
});

// Stagger animations for experience list items
function initStaggerAnimations() {
  const experienceItems = document.querySelectorAll('.resume-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');

        // Stagger the list items within this experience item
        const listItems = entry.target.querySelectorAll('.responsibilities li');
        listItems.forEach((item, index) => {
          item.style.animationDelay = `${0.1 * index}s`;
          item.classList.add('stagger-in');
        });

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  experienceItems.forEach(item => {
    observer.observe(item);
  });
}

// Run after DOM is loaded and config.json is processed
document.addEventListener('DOMContentLoaded', () => {
  // Wait for config.js to populate the experience section
  setTimeout(initStaggerAnimations, 500);
});

// Obfuscated contact information - decode on page load
function decodeContact() {
  const emailElement = document.getElementById('contact-email');
  const phoneElement = document.getElementById('contact-phone');

  if (emailElement) {
    const encodedEmail = emailElement.getAttribute('data-contact');
    const decodedEmail = atob(encodedEmail);
    emailElement.href = 'mailto:' + decodedEmail;
  }

  if (phoneElement) {
    const encodedPhone = phoneElement.getAttribute('data-contact');
    const decodedPhone = atob(encodedPhone);
    phoneElement.href = 'tel:' + decodedPhone;
  }
}

// Decode contact info on page load
document.addEventListener('DOMContentLoaded', decodeContact);

// Stop PDF badge animation once tooltip is viewed
document.addEventListener('DOMContentLoaded', () => {
  const pdfBadge = document.querySelector('.pdf-tech-badge');

  if (pdfBadge) {
    pdfBadge.addEventListener('mouseenter', function() {
      // Add a class to indicate the tooltip has been viewed
      this.classList.add('tooltip-viewed');
    }, { once: true }); // Only fire once
  }
});

// Smooth scroll to sections with offset for navbar
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.side-nav-link, .navbar-nav .nav-link');
  const navbarHeight = 70; // Height of fixed navbar + some padding

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      // Only handle internal anchor links
      if (href && href.startsWith('#')) {
        e.preventDefault();

        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          const targetPosition = targetSection.offsetTop - navbarHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
});
