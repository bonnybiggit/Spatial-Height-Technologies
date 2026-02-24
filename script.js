/* =============================================================
   Spatial Height Technologies — Main JavaScript
   =============================================================
   Lightweight vanilla JS powering:
   1. Mobile hamburger navigation toggle
   2. Sticky navbar background on scroll
   3. Smooth scrolling for anchor links
   4. Contact form validation + mailto submission
   5. IntersectionObserver-based scroll-reveal animations
   6. Active nav link highlighting on scroll
   ============================================================= */

'use strict';

/* =============================================================
   1. DOM ELEMENT REFERENCES
   ============================================================= */

/** @type {HTMLElement} The fixed navbar header */
const navbar = document.getElementById('navbar');

/** @type {HTMLButtonElement} Hamburger toggle button */
const hamburgerBtn = document.getElementById('hamburgerBtn');

/** @type {HTMLElement} The nav menu container */
const navMenu = document.getElementById('navMenu');

/** @type {NodeListOf<HTMLAnchorElement>} All navigation anchor links */
const navLinks = document.querySelectorAll('.navbar__link');

/** @type {HTMLFormElement} Contact form */
const contactForm = document.getElementById('contactForm');

/** @type {HTMLElement} Form feedback container */
const formFeedback = document.getElementById('formFeedback');


/* =============================================================
   2. MOBILE NAVIGATION TOGGLE
   Handles opening/closing the mobile slide-out menu and
   creates an overlay behind the menu for click-to-close.
   ============================================================= */

/**
 * Creates the overlay element for the mobile nav.
 * The overlay sits behind the nav and closes it when clicked.
 */
const navOverlay = document.createElement('div');
navOverlay.classList.add('nav-overlay');
document.body.appendChild(navOverlay);

/**
 * Toggles the mobile navigation menu open/closed.
 * Also handles body scroll lock and ARIA attribute updates.
 */
function toggleMobileNav() {
    const isOpen = navMenu.classList.toggle('open');

    // Animate hamburger between bars and X shape
    hamburgerBtn.classList.toggle('open', isOpen);

    // Update ARIA expanded state for accessibility
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));

    // Lock body scroll when nav is open
    document.body.classList.toggle('nav-open', isOpen);

    // Show/hide the backdrop overlay
    navOverlay.classList.toggle('active', isOpen);
}

/**
 * Closes the mobile navigation if it's currently open.
 * Called when a nav link is clicked or the overlay is tapped.
 */
function closeMobileNav() {
    navMenu.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    navOverlay.classList.remove('active');
}

// Hamburger button click event
hamburgerBtn.addEventListener('click', toggleMobileNav);

// Close mobile nav when the overlay is clicked
navOverlay.addEventListener('click', closeMobileNav);

// Close mobile nav when any nav link is clicked (for single-page smooth scrolling)
navLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
});


/* =============================================================
   3. STICKY NAVBAR — BACKGROUND ON SCROLL
   Adds a solid background colour to the navbar once the user
   scrolls past a threshold to improve readability.
   ============================================================= */

/** Scroll distance (in px) before the navbar background appears */
const SCROLL_THRESHOLD = 60;

/**
 * Checks the current scroll position and toggles the
 * .navbar--scrolled class accordingly.
 */
function handleNavbarScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
        navbar.classList.add('navbar--scrolled');
    } else {
        navbar.classList.remove('navbar--scrolled');
    }
}

// Listen for scroll events (passive for performance)
window.addEventListener('scroll', handleNavbarScroll, { passive: true });

// Run once on load in case the page is already scrolled
handleNavbarScroll();


/* =============================================================
   4. SMOOTH SCROLLING FOR ANCHOR LINKS
   Intercepts clicks on internal anchor links (#section) and
   scrolls smoothly to the target section.
   ============================================================= */

document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');

        // Skip empty hashes or non-section links
        if (targetId === '#' || targetId.length < 2) return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        e.preventDefault();

        // Scroll to the target element
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});


/* =============================================================
   5. ACTIVE NAV LINK HIGHLIGHTING ON SCROLL
   Uses IntersectionObserver to detect which section is currently
   in the viewport and highlights the corresponding nav link.
   ============================================================= */

/** All observable page sections (those referenced by nav links) */
const sections = document.querySelectorAll('section[id]');

/**
 * Observer callback: when a section enters the viewport,
 * set its corresponding nav link as active.
 *
 * @param {IntersectionObserverEntry[]} entries
 */
function handleSectionIntersect(entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            // Remove 'active' from all links
            navLinks.forEach(function (link) {
                link.classList.remove('active');
            });

            // Find the matching nav link and set it active
            const activeLink = document.querySelector(
                '.navbar__link[href="#' + entry.target.id + '"]'
            );
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// Create the observer with a root margin that triggers when section
// is near the top of the viewport (just below the navbar)
const sectionObserver = new IntersectionObserver(handleSectionIntersect, {
    root: null,                     // viewport
    rootMargin: '-20% 0px -60% 0px', // Trigger when section is in top 20–40%
    threshold: 0
});

// Observe each section
sections.forEach(function (section) {
    sectionObserver.observe(section);
});


/* =============================================================
   6. CONTACT FORM VALIDATION & FEEDBACK
   Client-side validation with user-friendly error messages.
   On valid submission, opens the user's email client via mailto.
   ============================================================= */

/**
 * Validates an email address using a simple regex pattern.
 *
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if the email format is valid.
 */
function isValidEmail(email) {
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

/**
 * Displays an error message beneath a form field and adds
 * the error visual state.
 *
 * @param {HTMLElement} input   - The input/textarea element.
 * @param {HTMLElement} errorEl - The error message span element.
 * @param {string}      message - The error message to display.
 */
function showFieldError(input, errorEl, message) {
    input.classList.add('error');
    errorEl.textContent = message;
}

/**
 * Clears an error from a form field.
 *
 * @param {HTMLElement} input   - The input/textarea element.
 * @param {HTMLElement} errorEl - The error message span element.
 */
function clearFieldError(input, errorEl) {
    input.classList.remove('error');
    errorEl.textContent = '';
}

// Handle form submission
contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Clear previous errors
    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('messageError').textContent = '';
    document.getElementById('formFeedback').textContent = '';
    document.getElementById('formFeedback').className = 'form-feedback';

    // Get values
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    let valid = true;

    // Name validation
    if (name.length < 2) {
        document.getElementById('nameError').textContent = 'Please enter your full name.';
        valid = false;
    }
    // Email validation
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address.';
        valid = false;
    }
    // Message validation
    if (message.length < 10) {
        document.getElementById('messageError').textContent = 'Please enter a message (at least 10 characters).';
        valid = false;
    }

    if (!valid) return;

    // Simulate sending (AJAX or Email service integration can go here)
    contactForm.querySelector('button[type="submit"]').disabled = true;
    document.getElementById('formFeedback').textContent = 'Sending...';
    setTimeout(() => {
        document.getElementById('formFeedback').textContent = 'Thank you! Your message has been sent.';
        document.getElementById('formFeedback').classList.add('success');
        contactForm.reset();
        contactForm.querySelector('button[type="submit"]').disabled = false;
    }, 1500);
});

// Real-time error clearing — remove field errors as the user types
['contactName', 'contactEmail', 'contactMessage'].forEach(function (id) {
    var inputEl = document.getElementById(id);
    var errorEl = document.getElementById(
        id.replace('contact', '').toLowerCase() + 'Error'
    );

    inputEl.addEventListener('input', function () {
        if (inputEl.classList.contains('error')) {
            clearFieldError(inputEl, errorEl);
        }
    });
});


/* =============================================================
   7. SCROLL-REVEAL ANIMATIONS
   Uses IntersectionObserver to add the .revealed class to
   elements with the .reveal class when they enter the viewport.
   This triggers the CSS fade-in / slide-up transition.
   ============================================================= */

/** @type {NodeListOf<HTMLElement>} All elements to animate on scroll */
const revealElements = document.querySelectorAll('.reveal');

/**
 * Observer callback: adds .revealed to elements entering the viewport.
 *
 * @param {IntersectionObserverEntry[]} entries
 * @param {IntersectionObserver} observer
 */
function handleReveal(entries, observer) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            // Stop observing once revealed (one-time animation)
            observer.unobserve(entry.target);
        }
    });
}

// Create the reveal observer
const revealObserver = new IntersectionObserver(handleReveal, {
    root: null,
    rootMargin: '0px 0px -80px 0px',  // Trigger slightly before fully in view
    threshold: 0.15                     // At least 15% visible
});

// Observe all .reveal elements
revealElements.forEach(function (el) {
    revealObserver.observe(el);
});


/* =============================================================
   8. YEAR IN FOOTER — AUTOMATIC COPYRIGHT YEAR
   Dynamically sets the current year in the copyright notice
   so it never goes stale.
   ============================================================= */

// Find the copyright paragraph in the footer and update the year
(function updateCopyrightYear() {
    var copyrightEl = document.querySelector('.footer__bottom p');
    if (copyrightEl) {
        var currentYear = new Date().getFullYear();
        copyrightEl.innerHTML = copyrightEl.innerHTML.replace(
            /\d{4}/,
            String(currentYear)
        );
    }
})();
