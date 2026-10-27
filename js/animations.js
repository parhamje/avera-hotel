/**
 * AVÉRA Luxury Resort · Editorial Animations & Interactions
 * Reusable scroll reveals, image parallax, dynamic navbar theme observer.
 */

(function () {
  'use strict';

  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * 1. Reveal Elements on Scroll
   */
  function initScrollReveals() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (!revealElements.length) return;

    if (isReduced) {
      revealElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-reveal-delay') || '0';
          setTimeout(() => {
            entry.target.classList.add('is-revealed');
          }, parseInt(delay, 10));
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => observer.observe(el));
  }

  /**
   * 2. Asymmetric Gallery Parallax
   */
  function initGalleryParallax() {
    const parallaxItems = document.querySelectorAll('[data-parallax-speed]');
    if (!parallaxItems.length || isReduced) return;

    let ticking = false;

    function updateParallax() {
      const windowH = window.innerHeight;
      parallaxItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        // Check if item is in view
        if (rect.bottom > 0 && rect.top < windowH) {
          const speed = parseFloat(item.getAttribute('data-parallax-speed') || '0.1');
          const centerOffset = (rect.top + rect.height / 2) - (windowH / 2);
          const translateY = centerOffset * speed * -1;
          item.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
        }
      });
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    updateParallax();
  }

  /**
   * 3. Dynamic Navbar Theme Observer
   * Seamlessly adapts navbar between light and dark sections
   */
  function initNavbarTheme() {
    const nav = document.querySelector('[data-navbar]');
    if (!nav) return;

    // We observe all light sections (Intro, Amenities, Experience, Gallery, Location)
    const lightSections = document.querySelectorAll('[data-theme="light"]');

    if (!lightSections.length) {
      nav.classList.add('nav-dark');
      return;
    }

    const navObserver = new IntersectionObserver((entries) => {
      let isOverLight = false;

      lightSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        // Nav is roughly 80px tall, check if nav overlaps section
        if (rect.top <= 60 && rect.bottom >= 60) {
          isOverLight = true;
        }
      });

      if (isOverLight) {
        nav.classList.remove('nav-dark');
        nav.classList.add('nav-light');
      } else {
        nav.classList.remove('nav-light');
        nav.classList.add('nav-dark');
      }
    }, {
      threshold: [0, 0.1, 0.5, 0.9, 1]
    });

    lightSections.forEach(sec => navObserver.observe(sec));

    // Also update on scroll for absolute precision
    window.addEventListener('scroll', () => {
      let isOverLight = false;
      for (let i = 0; i < lightSections.length; i++) {
        const rect = lightSections[i].getBoundingClientRect();
        if (rect.top <= 60 && rect.bottom >= 60) {
          isOverLight = true;
          break;
        }
      }
      if (isOverLight) {
        nav.classList.remove('nav-dark');
        nav.classList.add('nav-light');
      } else {
        nav.classList.remove('nav-light');
        nav.classList.add('nav-dark');
      }
    }, { passive: true });
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initScrollReveals();
      initGalleryParallax();
      initNavbarTheme();
    });
  } else {
    initScrollReveals();
    initGalleryParallax();
    initNavbarTheme();
  }
})();
