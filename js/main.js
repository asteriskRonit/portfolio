/**
 * Main Application Script for Ronit Paul's Executive Portfolio
 * Navigation, Project Filter Tabs, Lightbox Gallery Modal, and Inquiries
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavbar();
  initScrollProgress();
  initScrollReveal();
  initAnimatedCounters();
  initSkillBars();
  initBackToTop();
  initCopyEmail();
  initProjectFilters();
  initLightbox();
  initContactForm();
  initSectionScrollEngine();
  initSideDotNav();
});

/* --------------------------------------------------------------------------
   0. Starting Screen Animation (Royal Enfield Style Preloader)
   -------------------------------------------------------------------------- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloaderFill');
  const circleFill = document.getElementById('preloaderCircleFill');
  const percent = document.getElementById('preloaderPercent');
  const status = document.getElementById('preloaderStatus');

  if (!preloader) return;

  const duration = 1800; // 1.8s luxury timing
  const startTime = performance.now();
  const circleCircumference = 289.03; // 2 * PI * 46

  if (circleFill) {
    circleFill.style.strokeDasharray = `${circleCircumference}`;
    circleFill.style.strokeDashoffset = `${circleCircumference}`;
  }

  const statuses = [
    { at: 0, text: 'INITIALIZING ARCHITECTURE...' },
    { at: 25, text: 'LOADING AI & DRONE TELEMETRY...' },
    { at: 55, text: 'VERIFYING INSTITUTIONAL REPOSITORIES...' },
    { at: 85, text: 'OPTIMIZING SYSTEM WORKFLOWS...' },
    { at: 100, text: 'PORTFOLIO READY' }
  ];

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Smooth luxury ease: cubic-bezier deceleration
    const eased = 1 - Math.pow(1 - progress, 3.2);
    const currentPercent = Math.min(Math.floor(eased * 100), 100);

    if (fill) fill.style.width = `${currentPercent}%`;
    if (circleFill) {
      circleFill.style.strokeDashoffset = `${circleCircumference * (1 - eased)}`;
    }
    if (percent) {
      percent.textContent = `${String(currentPercent).padStart(2, '0')}%`;
    }

    if (status) {
      for (let i = statuses.length - 1; i >= 0; i--) {
        if (currentPercent >= statuses[i].at) {
          status.textContent = statuses[i].text;
          break;
        }
      }
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.classList.add('page-revealed');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 1100);
      }, 240);
    }
  }

  requestAnimationFrame(update);

  // Safety fallback
  setTimeout(() => {
    if (!preloader.classList.contains('loaded')) {
      preloader.classList.add('loaded');
      document.body.classList.add('page-revealed');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 1100);
    }
  }, 3200);
}

/* --------------------------------------------------------------------------
   1. Navbar & Mobile Navigation
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll appearance
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // Active link scroll spy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 110;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          targetLink.classList.add('active');
        }
      }
    });
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   2. Scroll Progress Bar & Dynamic Indicators
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  const backToTopBtn = document.getElementById('backToTop');
  const backToTopCircle = document.getElementById('backToTopProgress');
  const timelineProgressLine = document.getElementById('timelineProgressLine');
  const expSection = document.getElementById('experience');

  const circleCircumference = 125.66; // 2 * PI * 20
  if (backToTopCircle) {
    backToTopCircle.style.strokeDasharray = `${circleCircumference}`;
    backToTopCircle.style.strokeDashoffset = `${circleCircumference}`;
  }

  function onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0;
    const percent = progress * 100;

    // Viewport top progress bar
    if (progressBar) {
      progressBar.style.width = `${percent}%`;
    }

    // Floating Back-to-Top button
    if (backToTopBtn) {
      if (scrollTop > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    if (backToTopCircle) {
      backToTopCircle.style.strokeDashoffset = `${circleCircumference * (1 - progress)}`;
    }

    // Dynamic Experience timeline progress beam
    if (timelineProgressLine && expSection) {
      const rect = expSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const totalDistance = rect.height;
        const scrolled = windowHeight - rect.top;
        const lineProgress = Math.min(Math.max(scrolled / totalDistance, 0), 1);
        timelineProgressLine.style.height = `${lineProgress * 100}%`;
      } else if (rect.top > windowHeight) {
        timelineProgressLine.style.height = '0%';
      } else if (rect.bottom < 0) {
        timelineProgressLine.style.height = '100%';
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   3. Scroll Reveal Engine (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-fade-left, .reveal-fade-right, .reveal-scale');
  if (!revealElements.length) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        // Trigger counters if this element contains metrics
        if (entry.target.classList.contains('impact-metrics-bar')) {
          triggerCounters(entry.target);
        }

        // Trigger skill bars if this is a skill card
        if (entry.target.classList.contains('skill-category-card')) {
          triggerSkillBars(entry.target);
        }

        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   4. Dynamic Number Counters
   -------------------------------------------------------------------------- */
let countersTriggered = false;
function triggerCounters(container) {
  if (countersTriggered) return;
  countersTriggered = true;

  const counterEls = (container || document).querySelectorAll('[data-counter]');
  counterEls.forEach(el => {
    const target = parseInt(el.getAttribute('data-counter'), 10);
    if (isNaN(target)) return;

    const duration = 1600;
    const startTime = performance.now();

    function updateCounter(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      el.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

function initAnimatedCounters() {
  const metricsBar = document.querySelector('.impact-metrics-bar');
  if (!metricsBar) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerCounters(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(metricsBar);
}

/* --------------------------------------------------------------------------
   5. Skill Bar Fill Animation
   -------------------------------------------------------------------------- */
function triggerSkillBars(container) {
  const bars = (container || document).querySelectorAll('.skill-bar-fill');
  bars.forEach(bar => {
    const width = bar.getAttribute('data-skill-width');
    if (width) {
      bar.style.width = width;
    }
  });
}

function initSkillBars() {
  const skillCards = document.querySelectorAll('.skill-category-card');
  if (!skillCards.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerSkillBars(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  skillCards.forEach(card => observer.observe(card));
}

/* --------------------------------------------------------------------------
   6. Floating Back-to-Top Click Handler
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   7. One-Click Email Copy with Tooltip
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const tooltip = document.getElementById('copyTooltip');
  const emailLink = document.getElementById('emailContactText');

  if (!copyBtn) return;

  const email = emailLink ? emailLink.textContent.trim() : 'paulronit3280@gmail.com';

  copyBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      if (tooltip) {
        tooltip.classList.add('show');
        setTimeout(() => {
          tooltip.classList.remove('show');
        }, 2200);
      }
    } catch (err) {
      console.error('Failed to copy email: ', err);
    }
  });
}

/* --------------------------------------------------------------------------
   8. Project Filtering
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterTabs = document.querySelectorAll('.filter-tab, .filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterTabs.length || !projectCards.length) return;

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter || category?.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   3. Lightbox Modal for High-Resolution Visuals
   -------------------------------------------------------------------------- */
function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  if (!modal || !modalImg) return;

  const slides = Array.from(document.querySelectorAll('.slide-item'));
  let activeIndex = 0;

  const openLightboxAt = (index) => {
    if (index < 0 || index >= slides.length) return;
    activeIndex = index;
    const slide = slides[index];
    const img = slide.querySelector('.slide-bg-img');
    const title = slide.querySelector('.slide-title')?.textContent || '';
    const badge = slide.querySelector('.slide-badge')?.textContent || '';

    modalImg.src = img.src;
    modalImg.alt = img.alt || title;
    modalCaption.textContent = badge ? `${badge}: ${title}` : title;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  const viewButtons = document.querySelectorAll('.btn-view-full');
  viewButtons.forEach((btn, idx) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openLightboxAt(idx);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      let newIdx = activeIndex - 1;
      if (newIdx < 0) newIdx = slides.length - 1;
      openLightboxAt(newIdx);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      let newIdx = activeIndex + 1;
      if (newIdx >= slides.length) newIdx = 0;
      openLightboxAt(newIdx);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevBtn?.click();
    if (e.key === 'ArrowRight') nextBtn?.click();
  });
}

/* --------------------------------------------------------------------------
   4. Contact Form Handler
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName')?.value.trim();
    const email = document.getElementById('formEmail')?.value.trim();
    const subject = document.getElementById('formSubject')?.value.trim() || 'Portfolio Inquiry';
    const message = document.getElementById('formMessage')?.value.trim();

    if (!name || !email || !message) {
      alert('Please complete all required fields.');
      return;
    }

    if (formStatus) {
      formStatus.innerHTML = `
        <strong>Message prepared.</strong> Thank you, ${name}. 
        You can dispatch it immediately to <a href="mailto:paulronit3280@gmail.com?subject=${encodeURIComponent(subject + ' - ' + name)}&body=${encodeURIComponent(message + '\n\nSender: ' + email)}" style="color: var(--accent-blue); text-decoration: underline; font-weight: 600;">paulronit3280@gmail.com</a>.
      `;
      formStatus.className = 'form-status success';
      formStatus.style.display = 'block';
    }

    form.reset();
  });
}

/* --------------------------------------------------------------------------
   11. Section Scroll Engine (One-by-One Animated Frame Switcher)
   -------------------------------------------------------------------------- */
function initSectionScrollEngine() {
  const sectionIds = ['home', 'gallery', 'about', 'experience', 'projects', 'skills', 'credentials', 'contact'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  const sideDots = document.querySelectorAll('.side-dot');
  const navLinks = document.querySelectorAll('.nav-link');
  const lightboxModal = document.getElementById('lightboxModal');

  if (!sections.length) return;

  let currentIndex = 0;
  let isAnimating = false;
  let lastScrollTime = 0;
  const cooldownDuration = 780; // Smooth pacing cooldown

  // Determine current active section on load or natural scroll
  function getActiveSectionIndex() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const viewCenter = scrollY + window.innerHeight * 0.45;
    for (let i = sections.length - 1; i >= 0; i--) {
      if (viewCenter >= sections[i].offsetTop) {
        return i;
      }
    }
    return 0;
  }

  currentIndex = getActiveSectionIndex();

  function updateIndicators(activeId) {
    // Top Navbar
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.includes(activeId)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Side Dots
    sideDots.forEach(dot => {
      const sectionName = dot.getAttribute('data-section');
      if (sectionName === activeId) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function scrollToSection(index, customBehavior = 'smooth') {
    if (index < 0 || index >= sections.length || isAnimating) return;
    
    isAnimating = true;
    currentIndex = index;
    const target = sections[index];
    const targetTop = target.offsetTop;

    window.scrollTo({
      top: targetTop,
      behavior: customBehavior
    });

    updateIndicators(target.id);

    setTimeout(() => {
      isAnimating = false;
    }, cooldownDuration);
  }

  // Intercept Wheel on Desktop (width >= 992px)
  window.addEventListener('wheel', (e) => {
    // Only intercept on desktop and when modal is not active
    if (window.innerWidth < 992) return;
    if (lightboxModal && lightboxModal.classList.contains('active')) return;

    const now = performance.now();
    if (isAnimating || (now - lastScrollTime < cooldownDuration)) {
      e.preventDefault();
      return;
    }

    const currentSection = sections[currentIndex] || sections[0];
    const sectionTop = currentSection.offsetTop;
    const sectionHeight = currentSection.offsetHeight;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;

    // Check if section is taller than viewport
    const isTaller = sectionHeight > windowHeight + 60;

    if (e.deltaY > 28) {
      // Scrolling Down
      if (isTaller) {
        // Only advance to next section if reached bottom of current section
        const atBottom = (scrollY + windowHeight) >= (sectionTop + sectionHeight - 20);
        if (!atBottom) {
          // Allow normal scroll within this section
          return;
        }
      }
      
      if (currentIndex < sections.length - 1) {
        e.preventDefault();
        lastScrollTime = now;
        scrollToSection(currentIndex + 1);
      }
    } else if (e.deltaY < -28) {
      // Scrolling Up
      if (isTaller) {
        // Only advance to previous section if reached top of current section
        const atTop = scrollY <= (sectionTop + 20);
        if (!atTop) {
          // Allow normal scroll within this section
          return;
        }
      }

      if (currentIndex > 0) {
        e.preventDefault();
        lastScrollTime = now;
        scrollToSection(currentIndex - 1);
      }
    }
  }, { passive: false });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (window.innerWidth < 992) return;
    if (lightboxModal && lightboxModal.classList.contains('active')) return;
    // Don't intercept if user is typing in form inputs
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      if (currentIndex < sections.length - 1) {
        e.preventDefault();
        scrollToSection(currentIndex + 1);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      if (currentIndex > 0) {
        e.preventDefault();
        scrollToSection(currentIndex - 1);
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      scrollToSection(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      scrollToSection(sections.length - 1);
    }
  });

  // Keep currentIndex & indicators updated on natural scroll/resizes
  window.addEventListener('scroll', () => {
    if (!isAnimating) {
      const idx = getActiveSectionIndex();
      if (idx !== currentIndex) {
        currentIndex = idx;
        if (sections[currentIndex]) {
          updateIndicators(sections[currentIndex].id);
        }
      }
    }
  }, { passive: true });

  // Expose for other modules (like dots or buttons)
  window.portfolioScrollTo = scrollToSection;
}

/* --------------------------------------------------------------------------
   12. Side Dot Navigation & Hero Scroll Trigger
   -------------------------------------------------------------------------- */
function initSideDotNav() {
  const sideDots = document.querySelectorAll('.side-dot');
  const heroScrollBtn = document.querySelector('.hero-scroll-indicator');

  sideDots.forEach((dot, index) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = dot.getAttribute('data-section');
      const target = document.getElementById(sectionId);
      if (target) {
        if (typeof window.portfolioScrollTo === 'function') {
          window.portfolioScrollTo(index);
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  if (heroScrollBtn) {
    heroScrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.portfolioScrollTo === 'function') {
        window.portfolioScrollTo(1); // Go to Gallery (Field Work)
      } else {
        const gallery = document.getElementById('gallery');
        if (gallery) gallery.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

