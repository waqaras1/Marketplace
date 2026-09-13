/**
 * Naano Creator Workspace Controller
 * Handles interactive actions, toasts, and multilingual support.
 */

import { initI18n, setLanguage, getLanguage } from './i18n.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize i18n
  initI18n();

  // Toast notification helper
  function showToast(msg) {
    const toast = document.getElementById('ws-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-visible');
    setTimeout(() => toast.classList.remove('is-visible'), 2800);
  }

  // Copy card link
  document.getElementById('btn-copy-link')?.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.origin + '/workspace');
    const isEs = getLanguage() === 'ES';
    showToast(isEs ? '¡Enlace de tarjeta copiado al portapapeles!' : 'Card link copied to clipboard!');
  });

  // Share card
  document.getElementById('btn-share-card')?.addEventListener('click', () => {
    const isEs = getLanguage() === 'ES';
    showToast(isEs ? 'Modal para compartir listo: https://naano.com/c/waqar-ahmed' : 'Share modal ready: https://naano.com/c/waqar-ahmed');
  });

  // Open storefront
  document.getElementById('btn-open-card')?.addEventListener('click', () => {
    const isEs = getLanguage() === 'ES';
    showToast(isEs ? 'Viendo la tienda pública del creador' : 'Viewing full creator public storefront');
  });

  // Language buttons
  const enBtn = document.getElementById('ws-lang-en');
  const esBtn = document.getElementById('ws-lang-es') || document.getElementById('ws-lang-fr');

  enBtn?.addEventListener('click', () => {
    setLanguage('EN');
  });

  esBtn?.addEventListener('click', () => {
    setLanguage('ES');
  });
});
