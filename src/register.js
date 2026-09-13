/**
 * Naano Register / Create Account Logic
 * Interactive path selection (Creator vs Brand), live preview state, and URL synchronization.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const viewRoleSelect = document.getElementById('view-role-select');
  const viewCreatorFlow = document.getElementById('view-creator-flow');
  const viewBrandFlow = document.getElementById('view-brand-flow');

  const rightPanel = document.getElementById('auth-right-panel');
  const rightDefault = document.getElementById('right-state-default');
  const rightCreator = document.getElementById('right-state-creator');
  const rightBrand = document.getElementById('right-state-brand');

  const cardCreator = document.getElementById('role-card-creator');
  const cardBrand = document.getElementById('role-card-brand');

  const backFromCreator = document.getElementById('back-from-creator');
  const backFromBrand = document.getElementById('back-from-brand');

  const langBtn = document.getElementById('auth-lang-btn');
  const activeLang = document.getElementById('active-lang');

  /**
   * Set active view & right panel theme
   * @param {'default' | 'creator' | 'brand'} state
   * @param {boolean} pushState
   */
  function setFlowState(state, pushState = true) {
    // Left views
    viewRoleSelect.classList.remove('is-active');
    viewCreatorFlow.classList.remove('is-active');
    viewBrandFlow.classList.remove('is-active');

    // Right views
    rightDefault.classList.remove('is-active');
    rightCreator.classList.remove('is-active');
    rightBrand.classList.remove('is-active');
    rightPanel.classList.remove('is-creator-theme');

    if (state === 'creator') {
      viewCreatorFlow.classList.add('is-active');
      viewCreatorFlow.removeAttribute('aria-hidden');
      viewRoleSelect.setAttribute('aria-hidden', 'true');
      viewBrandFlow.setAttribute('aria-hidden', 'true');

      rightCreator.classList.add('is-active');
      rightPanel.classList.add('is-creator-theme');

      if (pushState) {
        history.pushState({ role: 'creator' }, '', '/register?role=influencer');
      }
    } else if (state === 'brand') {
      viewBrandFlow.classList.add('is-active');
      viewBrandFlow.removeAttribute('aria-hidden');
      viewRoleSelect.setAttribute('aria-hidden', 'true');
      viewCreatorFlow.setAttribute('aria-hidden', 'true');

      rightBrand.classList.add('is-active');

      if (pushState) {
        history.pushState({ role: 'brand' }, '', '/register?role=saas');
      }
    } else {
      // Default: Role Selection
      viewRoleSelect.classList.add('is-active');
      viewRoleSelect.removeAttribute('aria-hidden');
      viewCreatorFlow.setAttribute('aria-hidden', 'true');
      viewBrandFlow.setAttribute('aria-hidden', 'true');

      rightDefault.classList.add('is-active');

      if (pushState && window.location.search) {
        history.pushState({ role: null }, '', '/register');
      }
    }
  }

  // Handle Card Clicks
  if (cardCreator) {
    cardCreator.addEventListener('click', (e) => {
      e.preventDefault();
      setFlowState('creator');
    });
  }

  if (cardBrand) {
    cardBrand.addEventListener('click', (e) => {
      e.preventDefault();
      setFlowState('brand');
    });
  }

  // Handle Back Clicks
  if (backFromCreator) {
    backFromCreator.addEventListener('click', () => {
      setFlowState('default');
    });
  }

  if (backFromBrand) {
    backFromBrand.addEventListener('click', () => {
      setFlowState('default');
    });
  }

  // Handle Language Toggle
  if (langBtn && activeLang) {
    const languages = ['EN', 'FR', 'DE', 'ES'];
    let currentIdx = 0;
    langBtn.addEventListener('click', () => {
      currentIdx = (currentIdx + 1) % languages.length;
      activeLang.textContent = languages[currentIdx];
    });
  }

  // Handle Popstate (Browser Back/Forward)
  window.addEventListener('popstate', () => {
    checkInitialState();
  });

  // Check URL params on initial load
  function checkInitialState() {
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role');
    if (role === 'influencer' || role === 'creator') {
      setFlowState('creator', false);
    } else if (role === 'saas' || role === 'brand') {
      setFlowState('brand', false);
    } else {
      setFlowState('default', false);
    }
  }

  checkInitialState();
});
