/**
 * AVÉRA Luxury Resort · Custom Luxury Cursor
 * Subtle precision dot with smooth spring follower and context-aware micro-labels.
 */

(function () {
  'use strict';

  // Check if touch device or reduced motion
  const isTouch = window.matchMedia('(hover: none) or (pointer: coarse)').matches;
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isTouch || isReduced) {
    return; // Leave native cursor untouched
  }

  class LuxuryCursor {
    constructor() {
      this.dot = document.createElement('div');
      this.dot.className = 'cursor-dot';

      this.follower = document.createElement('div');
      this.follower.className = 'cursor-follower';

      this.textEl = document.createElement('span');
      this.textEl.className = 'cursor-text';
      this.follower.appendChild(this.textEl);

      document.body.appendChild(this.dot);
      document.body.appendChild(this.follower);

      this.mouse = { x: -100, y: -100 };
      this.pos = { x: -100, y: -100 };
      this.targetScale = 1;
      this.currentScale = 1;
      this.isHovered = false;
      this.activeText = '';

      this.bindEvents();
      this.render();
    }

    bindEvents() {
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;

        // Instant dot positioning
        this.dot.style.transform = `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0)`;
      }, { passive: true });

      // Delegate hover detection for performance
      document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('[data-cursor], a, button, input, select, textarea');
        if (!target) return;

        const customLabel = target.getAttribute('data-cursor');
        if (customLabel) {
          this.setHoverState(true, customLabel);
        } else if (target.tagName === 'A' || target.tagName === 'BUTTON') {
          // Subtle default interaction expand
          this.setHoverState(true, '');
        }
      });

      document.addEventListener('mouseout', (e) => {
        const target = e.target.closest('[data-cursor], a, button, input, select, textarea');
        if (target) {
          this.setHoverState(false, '');
        }
      });

      // Hide cursor when leaving window
      document.addEventListener('mouseleave', () => {
        this.dot.style.opacity = '0';
        this.follower.style.opacity = '0';
      });

      document.addEventListener('mouseenter', () => {
        this.dot.style.opacity = '1';
        this.follower.style.opacity = '1';
      });

      // Press effect
      window.addEventListener('mousedown', () => {
        this.follower.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0) scale(0.85)`;
      });

      window.addEventListener('mouseup', () => {
        this.follower.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0) scale(1)`;
      });
    }

    setHoverState(hovered, text) {
      this.isHovered = hovered;
      this.activeText = text;

      if (hovered) {
        this.follower.classList.add('is-hovered');
        this.textEl.textContent = text;
        if (!text) {
          // Just a slight expand for standard links without custom text
          this.follower.style.width = '52px';
          this.follower.style.height = '52px';
          this.follower.style.borderColor = 'rgba(255, 255, 255, 0.8)';
        } else {
          this.follower.style.width = '78px';
          this.follower.style.height = '78px';
        }
      } else {
        this.follower.classList.remove('is-hovered');
        this.follower.style.width = '40px';
        this.follower.style.height = '40px';
        this.follower.style.borderColor = 'rgba(255, 255, 255, 0.4)';
        this.textEl.textContent = '';
      }
    }

    render() {
      // Smooth lerp for follower
      const ease = 0.16;
      this.pos.x += (this.mouse.x - this.pos.x) * ease;
      this.pos.y += (this.mouse.y - this.pos.y) * ease;

      this.follower.style.left = `${this.pos.x}px`;
      this.follower.style.top = `${this.pos.y}px`;

      requestAnimationFrame(() => this.render());
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new LuxuryCursor());
  } else {
    new LuxuryCursor();
  }
})();
