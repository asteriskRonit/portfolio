/**
 * Interactive Image Slider & Carousel Module
 * Handles auto-play, pause on hover, progress tracking, touch swipe, and thumbnails
 */

class PortfolioSlider {
  constructor(options = {}) {
    this.sliderEl = document.querySelector(options.sliderSelector || '.slider-main');
    this.slides = document.querySelectorAll(options.slideSelector || '.slide-item');
    this.dots = document.querySelectorAll(options.dotSelector || '.slider-dot');
    this.thumbs = document.querySelectorAll(options.thumbSelector || '.slider-thumb-item');
    this.prevBtn = document.querySelector(options.prevSelector || '.slider-arrow.prev');
    this.nextBtn = document.querySelector(options.nextSelector || '.slider-arrow.next');
    this.progressBar = document.querySelector(options.progressSelector || '.slider-progress-bar');
    
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.intervalDuration = options.interval || 6000; // 6 seconds per slide
    this.timer = null;
    this.progressInterval = null;
    this.isPaused = false;
    this.progressStartTime = 0;
    this.progressElapsed = 0;

    // Touch swipe coordinates
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.minSwipeDistance = 50;

    if (this.totalSlides > 0) {
      this.init();
    }
  }

  init() {
    this.bindEvents();
    this.goToSlide(0);
    this.startAutoPlay();
  }

  bindEvents() {
    // Arrow buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prevSlide();
        this.restartAutoPlay();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.nextSlide();
        this.restartAutoPlay();
      });
    }

    // Dot indicators
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.goToSlide(index);
        this.restartAutoPlay();
      });
    });

    // Thumbnails
    this.thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        this.goToSlide(index);
        this.restartAutoPlay();
      });
    });

    // Pause on hover
    if (this.sliderEl) {
      this.sliderEl.addEventListener('mouseenter', () => this.pauseAutoPlay());
      this.sliderEl.addEventListener('mouseleave', () => this.resumeAutoPlay());

      // Touch events for mobile
      this.sliderEl.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      this.sliderEl.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      }, { passive: true });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      // Only handle if in view
      const rect = this.sliderEl?.getBoundingClientRect();
      if (rect && rect.top < window.innerHeight && rect.bottom > 0) {
        if (e.key === 'ArrowLeft') {
          this.prevSlide();
          this.restartAutoPlay();
        } else if (e.key === 'ArrowRight') {
          this.nextSlide();
          this.restartAutoPlay();
        }
      }
    });
  }

  handleSwipe() {
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > this.minSwipeDistance) {
      if (diff > 0) {
        // Swipe Left -> Next slide
        this.nextSlide();
      } else {
        // Swipe Right -> Prev slide
        this.prevSlide();
      }
      this.restartAutoPlay();
    }
  }

  goToSlide(index) {
    if (index < 0) {
      this.currentIndex = this.totalSlides - 1;
    } else if (index >= this.totalSlides) {
      this.currentIndex = 0;
    } else {
      this.currentIndex = index;
    }

    // Update slides
    this.slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === this.currentIndex);
    });

    // Update dots
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentIndex);
    });

    // Update thumbnails and scroll active into view
    this.thumbs.forEach((thumb, i) => {
      const isActive = i === this.currentIndex;
      thumb.classList.toggle('active', isActive);
      if (isActive && thumb.parentElement) {
        // Gentle scroll thumb into view
        const scrollLeft = thumb.offsetLeft - thumb.parentElement.offsetLeft - 40;
        thumb.parentElement.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    });

    // Reset progress animation
    this.resetProgressBar();
  }

  nextSlide() {
    this.goToSlide(this.currentIndex + 1);
  }

  prevSlide() {
    this.goToSlide(this.currentIndex - 1);
  }

  startAutoPlay() {
    this.isPaused = false;
    this.progressStartTime = Date.now();
    this.progressElapsed = 0;

    clearInterval(this.progressInterval);
    this.progressInterval = setInterval(() => {
      if (this.isPaused) return;

      this.progressElapsed += 50;
      const percent = Math.min((this.progressElapsed / this.intervalDuration) * 100, 100);
      
      if (this.progressBar) {
        this.progressBar.style.width = `${percent}%`;
      }

      if (this.progressElapsed >= this.intervalDuration) {
        this.nextSlide();
        this.progressElapsed = 0;
      }
    }, 50);
  }

  pauseAutoPlay() {
    this.isPaused = true;
  }

  resumeAutoPlay() {
    this.isPaused = false;
  }

  restartAutoPlay() {
    this.resetProgressBar();
    this.progressElapsed = 0;
    this.isPaused = false;
  }

  resetProgressBar() {
    if (this.progressBar) {
      this.progressBar.style.width = '0%';
    }
    this.progressElapsed = 0;
  }
}

// Global initialization helper
document.addEventListener('DOMContentLoaded', () => {
  window.portfolioSlider = new PortfolioSlider({
    sliderSelector: '.slider-main',
    slideSelector: '.slide-item',
    dotSelector: '.slider-dot',
    thumbSelector: '.slider-thumb-item',
    prevSelector: '.slider-arrow.prev',
    nextSelector: '.slider-arrow.next',
    progressSelector: '.slider-progress-bar',
    interval: 6000
  });
});
