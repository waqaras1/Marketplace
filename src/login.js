/**
 * Naano Login Controller
 * Handles switching between Creator and Brand sign-in views and redirects to the appropriate workspace.
 */

import { initI18n } from './i18n.js';

document.addEventListener('DOMContentLoaded', () => {
  initI18n();

  const tabCreator = document.getElementById('tab-login-creator');
  const tabBrand = document.getElementById('tab-login-brand');
  const viewCreator = document.getElementById('login-view-creator');
  const viewBrand = document.getElementById('login-view-brand');
  const rightCreator = document.getElementById('right-login-creator');
  const rightBrand = document.getElementById('right-login-brand');
  const authRight = document.getElementById('auth-right');

  function switchRole(role) {
    const isBrand = role === 'brand' || role === 'saas';
    if (isBrand) {
      tabBrand?.classList.add('is-active');
      tabCreator?.classList.remove('is-active');

      viewCreator?.classList.remove('is-active');
      viewBrand?.classList.add('is-active');

      rightCreator?.classList.remove('is-active');
      rightBrand?.classList.add('is-active');

      authRight?.classList.remove('is-creator-theme');
    } else {
      tabCreator?.classList.add('is-active');
      tabBrand?.classList.remove('is-active');

      viewCreator?.classList.add('is-active');
      viewBrand?.classList.remove('is-active');

      rightCreator?.classList.add('is-active');
      rightBrand?.classList.remove('is-active');

      authRight?.classList.add('is-creator-theme');
    }
  }

  tabCreator?.addEventListener('click', () => switchRole('creator'));
  tabBrand?.addEventListener('click', () => switchRole('brand'));

  // Check URL query parameters (e.g. /login?role=brand)
  const params = new URLSearchParams(window.location.search);
  const roleParam = params.get('role');
  if (roleParam === 'brand' || roleParam === 'saas') {
    switchRole('brand');
  } else {
    switchRole('creator');
  }

  // Form submit handlers
  document.getElementById('form-login-creator')?.addEventListener('submit', (e) => {
    e.preventDefault();
    window.location.href = '/workspace';
  });

  document.getElementById('form-login-brand')?.addEventListener('submit', (e) => {
    e.preventDefault();
    window.location.href = '/workspace?role=brand';
  });
});
