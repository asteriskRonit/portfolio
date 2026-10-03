/**
 * Main Application Script for Ronit Paul's Executive Portfolio
 * Navigation, Project Filter Tabs, Lightbox Gallery Modal, and Inquiries
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavbar();
  initProjectFilters();
  initLightbox();
  initContactForm();
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
  });
}

/* --------------------------------------------------------------------------
   2. Project Filtering
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
        You can dispatch it immediately to <a href="mailto:paulronit3280@gmail.com?subject=${encodeURIComponent(subject + ' - ' + name)}&body=${encodeURIComponent(message + '\n\nSender: ' + email)}" style="color: var(--accent-gold); text-decoration: underline;">paulronit3280@gmail.com</a>.
      `;
      formStatus.className = 'form-status success';
      formStatus.style.display = 'block';
    }

    form.reset();
  });
}
