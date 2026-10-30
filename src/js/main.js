/**
 * NAOMI OSEMEDUA | TheNaomiHQ
 * Main Client Scripts: Navigation, Interactive Enquiry Workflow, Accessibility
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileDrawer();
  initEnquiryModal();
  initDynamicYear();
  initSmoothScroll();
  initMediaFilter();
  initForms();
  highlightActiveNav();
  initScrollReveal();
  initTypewriter();
  initEssayReader();
});

// 1. Sticky Header
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// 2. Mobile Drawer Navigation
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const closeBtn = document.querySelector('.mobile-drawer-close');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggleBtn.focus();
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) closeDrawer();
    else openDrawer();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Close when clicking nav links
  const mobileLinks = drawer.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });
}

// 3. Enquiry Modal & Workflow
function initEnquiryModal() {
  const modal = document.querySelector('#enquiryModal');
  const triggers = document.querySelectorAll('[data-enquiry-trigger]');
  const closeBtn = document.querySelector('#closeEnquiryModal');

  if (!modal) return;

  const openModal = (defaultEngagement = '') => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // If a specific engagement type was passed, check it
    if (defaultEngagement) {
      const checkbox = modal.querySelector(`input[name="engagement"][value="${defaultEngagement}"]`);
      if (checkbox) checkbox.checked = true;
    }

    const firstInput = modal.querySelector('input:not([type="hidden"]), select, textarea');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      // If user holds cmd/ctrl or if this is an explicit direct page link, we can still intercept or open
      e.preventDefault();
      const engagementType = trigger.getAttribute('data-engagement') || '';
      openModal(engagementType);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Listen to hash on page load (e.g. #enquiry)
  if (window.location.hash === '#enquiry') {
    openModal();
  }
}

// 4. Dynamic Year in Footer
function initDynamicYear() {
  const yearSpans = document.querySelectorAll('.dynamic-year');
  const currentYear = new Date().getFullYear();
  yearSpans.forEach(span => {
    span.textContent = currentYear >= 2026 ? currentYear : '2026';
  });
}

// 5. Smooth Anchor Scroll
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#enquiry') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// 6. Media Filter Tabs (for Media & Moments page)
function initMediaFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const mediaItems = document.querySelectorAll('[data-category]');

  if (!filterBtns.length || !mediaItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');

      mediaItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (category === 'all' || itemCat === category) {
          item.style.display = '';
          item.classList.add('animate-fade-in');
        } else {
          item.style.display = 'none';
          item.classList.remove('animate-fade-in');
        }
      });
    });
  });
}

// 7. Interactive Form Submissions (Dedicated Contact Page & Modal)
function initForms() {
  const forms = document.querySelectorAll('form[data-enquiry-form]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const feedback = form.querySelector('.form-feedback');
      const submitBtn = form.querySelector('button[type="submit"]');

      // Check multi-select engagements
      const checkedEngagements = form.querySelectorAll('input[name="engagement"]:checked');
      if (checkedEngagements.length === 0) {
        if (feedback) {
          feedback.className = 'form-feedback error';
          feedback.innerHTML = '<strong>Please select at least one engagement type</strong> (e.g. Speaking, Moderation, Conversation Hosting, Compering, or Advisory).';
          feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
      }

      // Check required fields
      const name = form.querySelector('input[name="fullname"]')?.value.trim();
      const email = form.querySelector('input[name="email"]')?.value.trim();
      const message = form.querySelector('textarea[name="message"]')?.value.trim();

      if (!name || !email || !message) {
        if (feedback) {
          feedback.className = 'form-feedback error';
          feedback.innerHTML = '<strong>Please complete all required fields</strong>: Your Name, Email Address, and a brief overview of your engagement or inquiry.';
        }
        return;
      }

      // Simulate sending with high-polish UI state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
          </svg>
          Submitting Enquiry...
        `;
      }

      setTimeout(() => {
        if (feedback) {
          const engagementNames = Array.from(checkedEngagements).map(cb => cb.value).join(', ');
          feedback.className = 'form-feedback success';
          feedback.innerHTML = `
            <div style="margin-bottom: 0.5rem; font-size: 1.1rem; font-family: var(--font-serif); font-weight: 600;">
              Thank you, ${escapeHtml(name)}
            </div>
            <p style="margin-bottom: 0.75rem; font-size: 0.95rem;">
              Your enquiry regarding <strong>${escapeHtml(engagementNames)}</strong> has been received by Naomi's executive office.
            </p>
            <p style="font-size: 0.85rem; color: #355E3B; margin-bottom: 0;">
              A representative will review your request against Naomi's upcoming speaking and advisory schedule and respond to <strong>${escapeHtml(email)}</strong> shortly.
            </p>
          `;
          feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        form.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `Enquiry Sent Successfully`;
          setTimeout(() => {
            submitBtn.innerHTML = `Submit Engagement Enquiry`;
          }, 4000);
        }
      }, 800);
    });
  });
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.textContent = string;
  return div.innerHTML;
}

// 8. Highlight Active Nav Item
function highlightActiveNav() {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href').replace(/\/$/, '') || '/';
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });
}

// 9. Scroll Reveal Animations System
function initScrollReveal() {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger, .reveal-left, .reveal-right, .reveal-fade, .reveal-scale, .draw-line');
  
  if (!revealElements.length) return;

  if (isReducedMotion) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// 10. Typewriter Animation Engine for Headlines & Phrases
function initTypewriter() {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // A. Looping Typewriter for Dynamic Phrases (e.g., Hero Tagline / Philosophy)
  const loopElements = document.querySelectorAll('[data-typewriter-loop]');
  loopElements.forEach(el => {
    let phrases = [];
    try {
      phrases = JSON.parse(el.getAttribute('data-typewriter-loop'));
    } catch (e) {
      const raw = el.getAttribute('data-typewriter-loop');
      phrases = raw ? raw.split('|').map(s => s.trim()) : [];
    }

    if (!phrases || phrases.length === 0) return;

    if (isReducedMotion) {
      el.textContent = phrases[0];
      return;
    }

    // Ensure cursor exists next to typewriter element
    let cursor = el.parentNode.querySelector('.typewriter-cursor');
    if (!cursor) {
      cursor = document.createElement('span');
      cursor.className = 'typewriter-cursor';
      cursor.setAttribute('aria-hidden', 'true');
      cursor.textContent = '|';
      el.parentNode.insertBefore(cursor, el.nextSibling);
    }

    // Reset element content so the typewriter effect types out on page load / refresh
    el.textContent = '';

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        charIndex--;
        el.textContent = currentPhrase.substring(0, charIndex);
      } else {
        charIndex++;
        el.textContent = currentPhrase.substring(0, charIndex);
      }

      let typingSpeed = isDeleting ? 30 : (55 + Math.random() * 30);

      if (!isDeleting && charIndex >= currentPhrase.length) {
        // Full phrase typed, pause so reader can absorb it
        typingSpeed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex <= 0) {
        // Phrase deleted, advance to next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        charIndex = 0;
        typingSpeed = 400;
      }

      setTimeout(type, typingSpeed);
    };

    // Kick off typing with an initial entrance delay
    setTimeout(type, 500);
  });

  // B. Scroll-Triggered Headlines Typewriter (types once when headline scrolls into view)
  const headlineElements = document.querySelectorAll('[data-typewriter-headline]');
  if (headlineElements.length > 0) {
    if (isReducedMotion) {
      return;
    }

    const headlineObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          observer.unobserve(el);

          const fullText = el.getAttribute('data-typewriter-text') || el.textContent.trim();
          el.setAttribute('data-typewriter-text', fullText);
          el.textContent = '';

          // Add cursor
          const cursor = document.createElement('span');
          cursor.className = 'typewriter-cursor';
          cursor.setAttribute('aria-hidden', 'true');
          cursor.textContent = '|';
          el.appendChild(cursor);

          let i = 0;
          const typeLetter = () => {
            if (i < fullText.length) {
              // Update text while keeping cursor at the end
              el.textContent = fullText.substring(0, i + 1);
              el.appendChild(cursor);
              i++;
              setTimeout(typeLetter, 42);
            } else {
              // After typing finishes, allow cursor to blink then fade out
              setTimeout(() => {
                if (cursor && cursor.parentNode) {
                  cursor.classList.add('cursor-fade-out');
                }
              }, 3000);
            }
          };

          setTimeout(typeLetter, 250);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -40px 0px'
    });

    headlineElements.forEach(el => {
      if (!el.getAttribute('data-typewriter-text')) {
        el.setAttribute('data-typewriter-text', el.textContent.trim());
      }
      headlineObserver.observe(el);
    });
  }
}

// 11. Dedicated Essay Reader Modal & Hash Routing
function initEssayReader() {
  const modal = document.querySelector('#essayReaderModal');
  const cards = document.querySelectorAll('.essay-card');
  const closeBtn = document.querySelector('#closeEssayReaderBtn');

  if (!modal) return;

  const titleEl = document.querySelector('#readerModalTitle');
  const catEl = document.querySelector('#readerModalCategory');
  const readTimeEl = document.querySelector('#readerModalReadTime');
  const bodyEl = document.querySelector('#readerModalBody');

  const openEssay = (card) => {
    if (!card) return;
    const title = card.getAttribute('data-title');
    const category = card.getAttribute('data-category');
    const readtime = card.getAttribute('data-readtime') || '3 Min Read';
    const source = card.querySelector('.essay-full-source');
    const essayId = card.getAttribute('data-essay-id');

    if (titleEl) titleEl.textContent = title;
    if (catEl) catEl.textContent = category;
    if (readTimeEl) readTimeEl.textContent = readtime;
    if (bodyEl && source) bodyEl.innerHTML = source.innerHTML;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Scroll reader content to top
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) modalContent.scrollTop = 0;

    if (essayId) {
      try {
        history.replaceState(null, '', '#' + essayId);
      } catch (err) {}
    }
    if (closeBtn) closeBtn.focus();
  };

  const closeReader = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (window.location.hash && window.location.hash.startsWith('#essay-')) {
      try {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch (err) {}
    }
  };

  cards.forEach(card => {
    card.addEventListener('click', () => {
      openEssay(card);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEssay(card);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeReader);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeReader();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeReader();
    }
  });

  // Check URL hash on page load (e.g. #essay-architecture-story)
  if (window.location.hash && window.location.hash.startsWith('#essay-')) {
    const targetCard = document.querySelector(window.location.hash);
    if (targetCard) {
      setTimeout(() => openEssay(targetCard), 200);
    }
  }

  // Listen to hash changes while on page
  window.addEventListener('hashchange', () => {
    if (window.location.hash && window.location.hash.startsWith('#essay-')) {
      const targetCard = document.querySelector(window.location.hash);
      if (targetCard) openEssay(targetCard);
    } else if (!window.location.hash && modal.classList.contains('active')) {
      closeReader();
    }
  });
}

