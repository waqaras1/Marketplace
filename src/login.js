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

  function switchRole(role) {
    if (role === 'brand' || role === 'saas') {
      tabBrand.style.borderColor = '#0f62fe';
      tabBrand.style.background = '#eff6ff';
      tabBrand.style.color = '#0f62fe';
      tabCreator.style.borderColor = '#e2e8f0';
      tabCreator.style.background = '#f8fafc';
      tabCreator.style.color = '#64748b';

      viewCreator.style.display = 'none';
      viewBrand.style.display = 'block';

      rightCreator.style.display = 'none';
      rightBrand.style.display = 'block';
    } else {
      tabCreator.style.borderColor = '#0f62fe';
      tabCreator.style.background = '#eff6ff';
      tabCreator.style.color = '#0f62fe';
      tabBrand.style.borderColor = '#e2e8f0';
      tabBrand.style.background = '#f8fafc';
      tabBrand.style.color = '#64748b';

      viewCreator.style.display = 'block';
      viewBrand.style.display = 'none';

      rightCreator.style.display = 'block';
      rightBrand.style.display = 'none';
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
