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
});
