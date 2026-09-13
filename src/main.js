/**
 * Naano Header Interactive Controller
 * Handles scroll transition, resources dropdown, language toggling, and mobile navigation drawer.
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('naano-header');
  const resourcesGroup = document.getElementById('resources-group');
  const resourcesTrigger = document.getElementById('resources-trigger');
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  const activeLangCode = document.getElementById('active-lang');
  const mobileBurgerBtn = document.getElementById('mobile-burger-btn');
  const mobileNavPanel = document.getElementById('mobile-nav-panel');
  const mobileLangToggle = document.querySelector('.mobile-lang-toggle');
  const mobileLangCode = document.querySelector('.mobile-lang-code');

  // Current language state
  let currentLang = 'EN';

  /* -------------------------------------------------------------------------- */
  /* 1. Header Scroll State Management                                         */
  /* -------------------------------------------------------------------------- */
  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
      header.setAttribute('data-surface', 'scrolled');
    } else {
      header.classList.remove('scrolled');
      header.setAttribute('data-surface', 'hero');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  /* -------------------------------------------------------------------------- */
  /* 2. Resources Dropdown Menu                                                */
  /* -------------------------------------------------------------------------- */
  if (resourcesGroup && resourcesTrigger) {
    const toggleDropdown = (show) => {
      const willOpen = typeof show === 'boolean' ? show : !resourcesGroup.classList.contains('is-open');
      if (willOpen) {
        resourcesGroup.classList.add('is-open');
        resourcesTrigger.setAttribute('aria-expanded', 'true');
      } else {
        resourcesGroup.classList.remove('is-open');
        resourcesTrigger.setAttribute('aria-expanded', 'false');
      }
    };

    resourcesTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown();
    });

    // Hover intent with small delay for desktop
    let hoverTimeout;
    resourcesGroup.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimeout);
      if (window.innerWidth > 1024) {
        toggleDropdown(true);
      }
    });

    resourcesGroup.addEventListener('mouseleave', () => {
      if (window.innerWidth > 1024) {
        hoverTimeout = setTimeout(() => {
          toggleDropdown(false);
        }, 150);
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!resourcesGroup.contains(e.target)) {
        toggleDropdown(false);
      }
    });

    // Close on Esc key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && resourcesGroup.classList.contains('is-open')) {
        toggleDropdown(false);
        resourcesTrigger.focus();
      }
    });
  }

  /* -------------------------------------------------------------------------- */
  /* 3. Language Selector Toggle (EN <-> FR)                                    */
  /* -------------------------------------------------------------------------- */
  const switchLanguage = () => {
    currentLang = currentLang === 'EN' ? 'FR' : 'EN';

    const updateLangElement = (elem) => {
      if (!elem) return;
      elem.textContent = currentLang;
      elem.classList.remove('animate-change');
      void elem.offsetWidth; // Trigger reflow for animation restart
      elem.classList.add('animate-change');
    };

    updateLangElement(activeLangCode);
    updateLangElement(mobileLangCode);

    if (langToggleBtn) {
      langToggleBtn.setAttribute(
        'aria-label',
        `Switch language, current ${currentLang === 'EN' ? 'English' : 'French'}`
      );
    }
  };

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', switchLanguage);
  }

  if (mobileLangToggle) {
    mobileLangToggle.addEventListener('click', switchLanguage);
  }

  /* -------------------------------------------------------------------------- */
  /* 4. Mobile Navigation Drawer Toggle                                        */
  /* -------------------------------------------------------------------------- */
  if (mobileBurgerBtn && mobileNavPanel) {
    const toggleMobileMenu = (open) => {
      const willOpen = typeof open === 'boolean' ? open : !mobileNavPanel.classList.contains('is-open');
      if (willOpen) {
        mobileNavPanel.classList.add('is-open');
        mobileBurgerBtn.classList.add('is-active');
        mobileBurgerBtn.setAttribute('aria-expanded', 'true');
        mobileNavPanel.setAttribute('aria-hidden', 'false');
        header.classList.add('scrolled'); // Ensure background is solid while menu is open
      } else {
        mobileNavPanel.classList.remove('is-open');
        mobileBurgerBtn.classList.remove('is-active');
        mobileBurgerBtn.setAttribute('aria-expanded', 'false');
        mobileNavPanel.setAttribute('aria-hidden', 'true');
        handleScroll(); // Restore appropriate background based on scroll position
      }
    };

    mobileBurgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Close when clicking mobile navigation links
    mobileNavPanel.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggleMobileMenu(false);
      });
    });

    // Close mobile menu on Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavPanel.classList.contains('is-open')) {
        toggleMobileMenu(false);
        mobileBurgerBtn.focus();
      }
    });

    // Close mobile menu on resize back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && mobileNavPanel.classList.contains('is-open')) {
        toggleMobileMenu(false);
      }
    });
  }

  /* -------------------------------------------------------------------------- */
  /* 5. Zmirov Testimonial Scroll-Triggered Text Reveal                          */
  /* -------------------------------------------------------------------------- */
  const initQuoteScrollAnimation = () => {
    const quoteSec = document.querySelector('[data-screen-label="Quote"]');
    if (!quoteSec) return;

    const words = quoteSec.querySelectorAll('[data-qw]');
    if (!words.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      words.forEach((w) => {
        w.style.opacity = '1';
      });
      return;
    }

    const updateQuoteScroll = () => {
      const rect = quoteSec.getBoundingClientRect();
      const vh = window.innerHeight;
      const range = Math.max(0.8 * vh, 1);
      let raw = (0.72 * vh - rect.top) / range;

      // Seamlessly support both standalone view (current step) and multi-section page
      const maxScroll = document.documentElement.scrollHeight - vh;
      if (maxScroll > 0) {
        const bottomRatio = window.scrollY / maxScroll;
        raw = Math.max(raw, bottomRatio);
      }

      const progress = Math.max(0, Math.min(1, raw)) * (words.length + 0.65);

      words.forEach((word, idx) => {
        const localProg = Math.max(0, Math.min(1, progress - idx));
        // Smoothstep interpolation matching Naano's native algorithm
        const smooth = localProg * localProg * (3 - 2 * localProg);
        const opacity = 0.14 + smooth * 0.86;
        word.style.opacity = opacity.toFixed(3);
      });
    };

    window.addEventListener('scroll', updateQuoteScroll, { passive: true });
    window.addEventListener('resize', updateQuoteScroll, { passive: true });
    updateQuoteScroll();
  };

  initQuoteScrollAnimation();

  /* -------------------------------------------------------------------------- */
  /* 6. BlogSEO Testimonial Video Playback Controller                            */
  /* -------------------------------------------------------------------------- */
  const initTestimonialVideo = () => {
    const videoContainer = document.querySelector('.lp-proof-video');
    if (!videoContainer) return;

    const video = videoContainer.querySelector('.lp-proof-video__media');
    const playBtn = videoContainer.querySelector('.lp-proof-video__play-btn');
    if (!video || !playBtn) return;

    const togglePlay = () => {
      if (video.paused || video.ended) {
        video.play().then(() => {
          videoContainer.classList.add('is-playing');
          video.setAttribute('controls', 'true');
        }).catch(() => {
          // Fallback if autoplay policy restricts
          videoContainer.classList.add('is-playing');
          video.setAttribute('controls', 'true');
        });
      } else {
        video.pause();
        videoContainer.classList.remove('is-playing');
      }
    };

    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });

    video.addEventListener('pause', () => {
      videoContainer.classList.remove('is-playing');
    });

    video.addEventListener('ended', () => {
      videoContainer.classList.remove('is-playing');
      video.removeAttribute('controls');
      video.load();
    });
  };

  initTestimonialVideo();


});
