/**
 * AVÉRA Luxury Resort · Core Application Orchestrator
 * Loader, Mobile Menu, Lightbox, Booking System & Navigation.
 */

(function () {
  'use strict';

  // Ensure scroll position starts at top upon reload
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Configuration
  const CONFIG = {
    WHATSAPP_NUMBER: '1234567890', // Replace with hotel international digits e.g. 18005550199
    RESERVATION_EMAIL: 'concierge@averaresort.com'
  };

  /**
   * 1. Luxury Loading Screen
   */
  function initLoader() {
    const loader = document.querySelector('[data-loader]');
    const progressText = document.querySelector('[data-loader-progress]');
    const progressBar = document.querySelector('[data-loader-bar]');

    if (!loader) return;

    let current = 0;
    let target = 0;
    let isComplete = false;

    // Simulate progress increments smoothly
    const interval = setInterval(() => {
      if (current < 85) {
        current += Math.floor(Math.random() * 8) + 4;
        if (current > 85) current = 85;
        updateUI(current);
      }
    }, 40);

    function updateUI(val) {
      if (progressText) progressText.textContent = `LOADING ${val}%`;
      if (progressBar) progressBar.style.width = `${val}%`;
    }

    function finishLoading() {
      if (isComplete) return;
      isComplete = true;
      clearInterval(interval);

      // Fast transition to 100%
      let finishStep = current;
      const finishInterval = setInterval(() => {
        finishStep += 5;
        if (finishStep >= 100) {
          finishStep = 100;
          clearInterval(finishInterval);
          updateUI(100);

          setTimeout(() => {
            loader.classList.add('is-hidden');
            document.body.classList.remove('overflow-hidden');
          }, 350);
        } else {
          updateUI(finishStep);
        }
      }, 20);
    }

    // Dismiss when hero video triggers ready event
    window.addEventListener('avera:hero-ready', () => {
      finishLoading();
    }, { once: true });

    // Fallback maximum safety timeout (1.5 seconds)
    setTimeout(() => {
      finishLoading();
    }, 1500);
  }

  /**
   * 2. Fullscreen Mobile Navigation
   */
  function initMobileMenu() {
    const toggle = document.querySelector('[data-menu-toggle]');
    const menu = document.querySelector('[data-mobile-menu]');
    const closeBtn = document.querySelector('[data-menu-close]');
    const links = document.querySelectorAll('[data-menu-link]');

    if (!toggle || !menu) return;

    function openMenu() {
      menu.classList.add('is-active');
      document.body.classList.add('overflow-hidden');
    }

    function closeMenu() {
      menu.classList.remove('is-active');
      document.body.classList.remove('overflow-hidden');
    }

    toggle.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    links.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-active')) {
        closeMenu();
      }
    });
  }

  /**
   * 3. Interactive Lightbox
   */
  function initLightbox() {
    const lightbox = document.querySelector('[data-lightbox]');
    const imgEl = document.querySelector('[data-lb-img]');
    const captionEl = document.querySelector('[data-lb-caption]');
    const countEl = document.querySelector('[data-lb-count]');
    const closeBtn = document.querySelector('[data-lb-close]');
    const prevBtn = document.querySelector('[data-lb-prev]');
    const nextBtn = document.querySelector('[data-lb-next]');
    const triggers = document.querySelectorAll('[data-lightbox-src]');

    if (!lightbox || !triggers.length) return;

    let currentIndex = 0;
    const items = Array.from(triggers).map(btn => ({
      src: btn.getAttribute('data-lightbox-src'),
      title: btn.getAttribute('data-lightbox-title') || 'AVÉRA Sanctuary',
      caption: btn.getAttribute('data-lightbox-caption') || ''
    }));

    function showImage(index) {
      if (index < 0) index = items.length - 1;
      if (index >= items.length) index = 0;
      currentIndex = index;

      const item = items[currentIndex];
      imgEl.src = item.src;
      imgEl.alt = item.title;
      if (captionEl) captionEl.textContent = `${item.title} — ${item.caption}`;
      if (countEl) countEl.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
    }

    function openLightbox(index) {
      showImage(index);
      lightbox.classList.add('is-active');
      document.body.classList.add('overflow-hidden');
    }

    function closeLightbox() {
      lightbox.classList.remove('is-active');
      document.body.classList.remove('overflow-hidden');
    }

    triggers.forEach((btn, idx) => {
      btn.addEventListener('click', () => openLightbox(idx));
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  }

  /**
   * 4. Editorial Booking System
   */
  function initBookingForm() {
    const form = document.querySelector('[data-booking-form]');
    if (!form) return;

    const checkin = form.querySelector('#checkin');
    const checkout = form.querySelector('#checkout');
    const guests = form.querySelector('#guests');
    const room = form.querySelector('#room');

    // Default dates: today and tomorrow
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 2);

    const formatDate = (d) => d.toISOString().split('T')[0];

    if (checkin) {
      checkin.min = formatDate(today);
      checkin.value = formatDate(today);
    }
    if (checkout) {
      checkout.min = formatDate(new Date(today.getTime() + 86400000));
      checkout.value = formatDate(tomorrow);
    }

    if (checkin && checkout) {
      checkin.addEventListener('change', () => {
        const selected = new Date(checkin.value);
        const minCheckout = new Date(selected.getTime() + 86400000);
        checkout.min = formatDate(minCheckout);
        if (new Date(checkout.value) <= selected) {
          checkout.value = formatDate(minCheckout);
        }
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const inVal = checkin ? checkin.value : 'Flexible';
      const outVal = checkout ? checkout.value : 'Flexible';
      const guestVal = guests ? guests.value : '2 Guests';
      const roomVal = room ? room.value : 'Signature Suite';

      const message = `Hello AVÉRA Reservations Concierge,

I would like to inquire about booking availability at the resort:

• Room / Suite: ${roomVal}
• Check-in: ${inVal}
• Check-out: ${outVal}
• Party size: ${guestVal}

Please provide confirmation and preferred arrival arrangements. Thank you.`;

      const encoded = encodeURIComponent(message);
      const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encoded}`;

      // Open WhatsApp reservation in new tab
      window.open(url, '_blank');
    });
  }

  /**
   * 5. Smooth Anchor Scrolling
   */
  function initAnchorScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '') return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Pre-fill booking form when clicking "Reserve this room" from room video sections
  window.selectRoomForBooking = function (roomName) {
    const roomSelect = document.querySelector('#room');
    if (roomSelect) {
      for (let i = 0; i < roomSelect.options.length; i++) {
        if (roomSelect.options[i].text.toLowerCase().includes(roomName.toLowerCase())) {
          roomSelect.selectedIndex = i;
          break;
        }
      }
    }
    const bookingSec = document.querySelector('#booking');
    if (bookingSec) {
      bookingSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Initialize all modules
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initLoader();
      initMobileMenu();
      initLightbox();
      initBookingForm();
      initAnchorScrolling();
    });
  } else {
    initLoader();
    initMobileMenu();
    initLightbox();
    initBookingForm();
    initAnchorScrolling();
  }
})();
