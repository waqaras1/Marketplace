/**
 * Naano Register / Onboarding Flow Logic
 * Complete end-to-end frontend flows for Creators and Brands.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements: Main containers
  const leftInner = document.getElementById('auth-left-inner');
  const rightPanel = document.getElementById('auth-right-panel');
  const rightDefault = document.getElementById('right-state-default');
  const rightCreator = document.getElementById('right-state-creator');
  const rightBrand = document.getElementById('right-state-brand');
  const brandFloatingPill = document.getElementById('brand-floating-assistant');

  // Views
  const views = {
    roleSelect: document.getElementById('view-role-select'),
    creatorAuth: document.getElementById('view-creator-auth'),
    creatorProfile: document.getElementById('view-creator-profile'),
    creatorSync: document.getElementById('view-creator-sync'),
    creatorComplete: document.getElementById('view-creator-complete'),
    brandAuth: document.getElementById('view-brand-auth'),
    brandOnboarding: document.getElementById('view-brand-onboarding'),
    brandMatching: document.getElementById('view-brand-matching'),
  };

  // Preview elements on right card
  const rightCreatorName = document.getElementById('right-creator-name');
  const rightCreatorHeadline = document.getElementById('right-creator-headline');
  const rightStatPrice = document.getElementById('right-stat-price');
  const rightCreatorProgress = document.getElementById('right-creator-progress');
  const rightCreatorStatus = document.getElementById('right-creator-status');

  // Switch Active View
  function showView(targetKey, rightState = 'default', isWide = false, url = null) {
    Object.values(views).forEach(v => {
      if (v) {
        v.classList.remove('is-active');
        v.setAttribute('aria-hidden', 'true');
      }
    });

    if (views[targetKey]) {
      views[targetKey].classList.add('is-active');
      views[targetKey].removeAttribute('aria-hidden');
    }

    // Adjust left container width
    if (leftInner) {
      if (isWide) leftInner.classList.add('is-wide');
      else leftInner.classList.remove('is-wide');
    }

    // Adjust right panel content & background
    if (rightDefault && rightCreator && rightBrand && rightPanel) {
      rightDefault.classList.remove('is-active');
      rightCreator.classList.remove('is-active');
      rightBrand.classList.remove('is-active');
      rightPanel.classList.remove('is-creator-theme');

      if (rightState === 'creator') {
        rightCreator.classList.add('is-active');
        rightPanel.classList.add('is-creator-theme');
      } else if (rightState === 'brand') {
        rightBrand.classList.add('is-active');
      } else {
        rightDefault.classList.add('is-active');
      }
    }

    // Toggle bottom floating pill
    if (brandFloatingPill) {
      if (targetKey === 'brandOnboarding') {
        brandFloatingPill.style.display = 'inline-flex';
      } else {
        brandFloatingPill.style.display = 'none';
      }
    }

    if (url) {
      history.pushState({ view: targetKey }, '', url);
    }
  }

  // Role Selection Clicks
  const cardCreator = document.getElementById('role-card-creator');
  const cardBrand = document.getElementById('role-card-brand');

  if (cardCreator) {
    cardCreator.addEventListener('click', (e) => {
      e.preventDefault();
      showView('creatorAuth', 'creator', false, '/register?role=influencer');
    });
  }

  if (cardBrand) {
    cardBrand.addEventListener('click', (e) => {
      e.preventDefault();
      showView('brandAuth', 'brand', false, '/register?role=saas');
    });
  }

  // Creator Flow: Auth to Profile Step
  ['btn-creator-oauth-linkedin', 'btn-creator-oauth-google', 'btn-creator-oauth-email'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        showView('creatorProfile', 'creator', false, '/register?role=influencer&step=profile');
      });
    }
  });

  // Creator Flow: Profile Submission to Sync Step
  const formCreatorProfile = document.getElementById('form-creator-profile');
  if (formCreatorProfile) {
    formCreatorProfile.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = document.getElementById('creator-input-name')?.value || 'Waqar Ahmed';
      const tagsVal = document.getElementById('creator-input-tags')?.value || 'Software · AI · SaaS';
      const priceVal = document.getElementById('creator-input-price')?.value || '30';

      // Update right card preview live
      if (rightCreatorName) rightCreatorName.textContent = nameVal;
      if (rightCreatorHeadline) rightCreatorHeadline.textContent = `${tagsVal} · Open to collaborations`;
      if (rightStatPrice) rightStatPrice.textContent = `€${priceVal}`;

      showView('creatorSync', 'creator', false, '/register?role=influencer&step=syncing');

      // Animate sync progress
      const progressFill = document.getElementById('creator-sync-progress');
      const progressPct = document.getElementById('creator-sync-pct');
      const s1 = document.getElementById('step-sync-1');
      const s2 = document.getElementById('step-sync-2');
      const s3 = document.getElementById('step-sync-3');
      const s4 = document.getElementById('step-sync-4');

      let pct = 0;
      const interval = setInterval(() => {
        pct += 25;
        if (progressFill) progressFill.style.width = `${pct}%`;
        if (progressPct) progressPct.textContent = `${pct}%`;

        if (pct === 25) {
          s1?.classList.add('is-done');
        } else if (pct === 50) {
          s2?.classList.add('is-done');
          if (s2) s2.querySelector('.auth-sync-icon').textContent = '✓';
        } else if (pct === 75) {
          s3?.classList.add('is-done');
          if (s3) s3.querySelector('.auth-sync-icon').textContent = '✓';
        } else if (pct >= 100) {
          clearInterval(interval);
          s4?.classList.add('is-done');
          if (s4) s4.querySelector('.auth-sync-icon').textContent = '✓';

          if (rightCreatorProgress) rightCreatorProgress.style.width = '100%';
          if (rightCreatorStatus) {
            rightCreatorStatus.textContent = 'Active';
            rightCreatorStatus.style.color = '#16a34a';
          }

          setTimeout(() => {
            showView('creatorComplete', 'creator', false, '/register?role=influencer&step=complete');
          }, 600);
        }
      }, 400);
    });
  }

  // Brand Flow: Auth to Onboarding Step 2 of 3 (Matching Image 2 Reference)
  ['btn-brand-oauth-linkedin', 'btn-brand-oauth-google', 'btn-brand-oauth-email'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        showView('brandOnboarding', 'brand', true, '/register?role=saas&step=onboarding');
      });
    }
  });

  // Brand Flow: Continue to AI Matching
  const btnContinueMatching = document.getElementById('btn-continue-ai-matching');
  if (btnContinueMatching) {
    btnContinueMatching.addEventListener('click', () => {
      showView('brandMatching', 'brand', true, '/register?role=saas&step=matching');
    });
  }

  // Back Button Handlers
  document.getElementById('back-from-creator-auth')?.addEventListener('click', () => {
    showView('roleSelect', 'default', false, '/register');
  });

  document.getElementById('back-from-creator-profile')?.addEventListener('click', () => {
    showView('creatorAuth', 'creator', false, '/register?role=influencer');
  });

  document.getElementById('back-from-brand-auth')?.addEventListener('click', () => {
    showView('roleSelect', 'default', false, '/register');
  });

  document.getElementById('back-from-brand-onboarding')?.addEventListener('click', () => {
    showView('brandAuth', 'brand', false, '/register?role=saas');
  });

  document.getElementById('back-from-brand-matching')?.addEventListener('click', () => {
    showView('brandOnboarding', 'brand', true, '/register?role=saas&step=onboarding');
  });

  // Language Switcher
  const langBtn = document.getElementById('auth-lang-btn');
  const activeLang = document.getElementById('active-lang');
  if (langBtn && activeLang) {
    const langs = ['EN', 'FR', 'DE', 'ES'];
    let idx = 0;
    langBtn.addEventListener('click', () => {
      idx = (idx + 1) % langs.length;
      activeLang.textContent = langs[idx];
    });
  }

  // URL Query State check
  function checkUrlState() {
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role');
    const step = params.get('step');

    if (role === 'influencer' || role === 'creator') {
      if (step === 'profile') {
        showView('creatorProfile', 'creator', false);
      } else if (step === 'complete') {
        showView('creatorComplete', 'creator', false);
      } else {
        showView('creatorAuth', 'creator', false);
      }
    } else if (role === 'saas' || role === 'brand') {
      if (step === 'onboarding') {
        showView('brandOnboarding', 'brand', true);
      } else if (step === 'matching') {
        showView('brandMatching', 'brand', true);
      } else {
        showView('brandAuth', 'brand', false);
      }
    } else {
      showView('roleSelect', 'default', false);
    }
  }

  window.addEventListener('popstate', checkUrlState);
  checkUrlState();
});
