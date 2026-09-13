/**
 * Naano Workspace Controller
 * Supports both Creator and Brand dashboards, interactive sidebar navigation,
 * actions, toasts, AI search assistant, and multilingual support.
 */

import { initI18n, setLanguage, getLanguage } from './i18n.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize i18n
  initI18n();

  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get('role');
  const isBrand = role === 'brand' || role === 'saas';

  // Toast notification helper
  function showToast(msg) {
    const toast = document.getElementById('ws-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-visible');
    setTimeout(() => toast.classList.remove('is-visible'), 2800);
  }

  // Handle Brand Mode vs Creator Mode
  const modeCreator = document.getElementById('ws-mode-creator');
  const modeBrand = document.getElementById('ws-mode-brand');
  if (isBrand) {
    modeBrand?.classList.add('is-active');
    modeCreator?.classList.remove('is-active');
    applyBrandDashboard();
  } else {
    modeCreator?.classList.add('is-active');
    modeBrand?.classList.remove('is-active');
  }

  function applyBrandDashboard() {
    const isEs = getLanguage() === 'ES';

    // 1. Back button
    const backBtn = document.querySelector('.ws-back-register');
    if (backBtn) {
      backBtn.href = '/register?role=saas&step=matching';
      const backText = backBtn.querySelector('span');
      if (backText) backText.textContent = isEs ? 'Volver a matching' : 'Back to matching';
    }

    // 2. Avatar
    const avatarWrap = document.querySelector('.ws-user-avatar-wrap');
    if (avatarWrap) {
      avatarWrap.title = 'Atlas Marketing';
      avatarWrap.innerHTML = `
        <div style="width: 32px; height: 32px; border-radius: 50%; background: #0f62fe; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; font-family: 'Plus Jakarta Sans', sans-serif;">A</div>
        <span class="ws-user-online-badge"></span>
      `;
    }

    // 3. Page Header
    const eyebrow = document.querySelector('.ws-eyebrow');
    const title = document.querySelector('.ws-title');
    const subtitle = document.querySelector('.ws-subtitle');
    if (eyebrow) eyebrow.textContent = isEs ? 'Panel de campaña de marca' : 'Brand campaign workspace';
    if (title) title.textContent = isEs ? 'Nos alegra verte, Atlas Marketing' : 'Good to see you, Atlas Marketing';
    if (subtitle) subtitle.textContent = isEs ? 'Tus campañas activas y creadores afines, de un vistazo.' : 'Your active creator campaigns and matched pipeline, at a glance.';

    // 4. 4 Metric Cards
    const cards = document.querySelectorAll('.ws-metric-card');
    if (cards.length >= 4) {
      // Card 1
      cards[0].querySelector('.ws-metric-label').textContent = isEs ? 'CAMPAÑAS ACTIVAS' : 'ACTIVE CAMPAIGNS';
      cards[0].querySelector('.ws-metric-value').textContent = '1 Launch';
      cards[0].querySelector('.ws-metric-desc').textContent = isEs ? 'Campaña de servicios y oficios B2B' : 'Atlas Marketing Trade Campaign';

      // Card 2
      cards[1].querySelector('.ws-metric-label').textContent = isEs ? 'CREADORES AFINES' : 'MATCHED CREATORS';
      cards[1].querySelector('.ws-metric-value').textContent = '3 Vetted';
      cards[1].querySelector('.ws-metric-desc').textContent = isEs ? 'Alineados con tus clientes ideales (ICP)' : 'Aligned with US Trade ICPs';

      // Card 3
      cards[2].querySelector('.ws-metric-label').textContent = isEs ? 'ALCANCE ESTIMADO' : 'TOTAL REACH';
      cards[2].querySelector('.ws-metric-value').textContent = '61.5K';
      cards[2].querySelector('.ws-metric-desc').textContent = isEs ? 'Impresiones cualificadas estimadas' : 'Qualified B2B Impressions';

      // Card 4
      cards[3].querySelector('.ws-metric-label').textContent = isEs ? 'PRESUPUESTO ASIGNADO' : 'CAMPAIGN BUDGET';
      cards[3].querySelector('.ws-metric-value').textContent = '€760';
      cards[3].querySelector('.ws-metric-desc').textContent = isEs ? 'Depósito en Stripe Connect listo' : 'Allocated creator post payouts';
    }

    // 5. Creator Card Section -> Campaign Brief Panel
    const cardTitle = document.querySelector('.ws-creator-card-panel .ws-panel-title');
    const cardSub = document.querySelector('.ws-creator-card-panel .ws-panel-sub');
    if (cardTitle) cardTitle.textContent = isEs ? 'Tu brief de campaña' : 'Your campaign brief';
    if (cardSub) cardSub.textContent = isEs ? 'Así descubren los creadores tu propuesta y audiencia objetivo.' : 'What invited creators receive to understand your product and ICP.';

    const btnOpen = document.getElementById('btn-open-card');
    const btnCopy = document.getElementById('btn-copy-link');
    const btnShare = document.getElementById('btn-share-card');
    if (btnOpen) {
      btnOpen.querySelector('span').textContent = isEs ? 'Editar brief' : 'Edit brief';
      btnOpen.onclick = () => showToast(isEs ? 'Editor de brief abierto para Atlas Marketing' : 'Brief editor opened for Atlas Marketing');
    }
    if (btnCopy) {
      btnCopy.querySelector('span').textContent = isEs ? 'Copiar brief' : 'Copy brief link';
    }
    if (btnShare) {
      btnShare.querySelector('span').textContent = isEs ? 'Invitar creadores' : 'Invite creators';
      btnShare.onclick = () => showToast(isEs ? 'Buscador de creadores abierto' : 'Opening vetted creator directory');
    }

    // Physical Card Body Replacement
    const cardBody = document.querySelector('.ws-card-body');
    if (cardBody) {
      cardBody.innerHTML = `
        <h3 class="ws-card-name">Atlas Marketing</h3>
        <div class="ws-card-tags">Trades · HVAC · Roofing · Plumbing</div>
        <p class="ws-card-headline">
          Unified marketing partner for US service businesses. Booked jobs and ringing phones, not vanity metrics.
        </p>

        <div class="ws-card-calendar-badge" style="background: #eff6ff; color: #0f62fe;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>${isEs ? 'Brief activo · 3 Creadores invitados' : 'Active brief · 3 Creators invited'}</span>
        </div>

        <div class="ws-card-progress-row">
          <span class="ws-card-progress-label">${isEs ? 'Estado' : 'Status'}</span>
          <div class="ws-card-progress-track">
            <div class="ws-card-progress-fill" style="width: 66%;"></div>
          </div>
          <span class="ws-card-progress-status" style="color: #0f62fe;">${isEs ? 'En marcha' : 'In Progress'}</span>
        </div>

        <div class="ws-card-stats-grid">
          <div class="ws-card-stat-col">
            <div class="ws-card-stat-value">3</div>
            <div class="ws-card-stat-title">${isEs ? 'Creadores' : 'Creators'}</div>
          </div>
          <div class="ws-card-stat-col">
            <div class="ws-card-stat-value">61.5K</div>
            <div class="ws-card-stat-title">${isEs ? 'Alcance est.' : 'Est. reach'}</div>
          </div>
          <div class="ws-card-stat-col">
            <div class="ws-card-stat-value">€760</div>
            <div class="ws-card-stat-title">${isEs ? 'Presupuesto' : 'Budget'}</div>
          </div>
        </div>
      `;
    }

    // 6. Active Collaborations
    const collabsSub = document.querySelector('.ws-collabs-panel .ws-panel-sub');
    if (collabsSub) collabsSub.textContent = isEs ? 'Creadores invitados a tu campaña Atlas Marketing.' : 'Creators invited to your Atlas Marketing campaign.';

    const collabsEmpty = document.querySelector('.ws-collabs-empty');
    if (collabsEmpty) {
      collabsEmpty.outerHTML = `
        <div class="ws-brand-collabs-list" style="display: flex; flex-direction: column; gap: 8px; margin-top: 14px;">
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 13px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="/avatar-vincent-josse.png" style="width: 28px; height: 28px; border-radius: 50%;" alt="Vincent Josse" />
              <div><strong>Vincent Josse</strong> (48K)</div>
            </div>
            <span style="background: #ecfdf5; color: #10b981; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">${isEs ? 'Aceptado' : 'Accepted'}</span>
            <span style="color: #64748b;">${isEs ? 'Revisar borrador' : 'Review draft'}</span>
            <span style="color: #64748b;">${isEs ? 'En 3 días' : 'In 3 days'}</span>
            <strong style="color: #0f172a;">€450</strong>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 13px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="/avatar-waqar.png" style="width: 28px; height: 28px; border-radius: 50%;" alt="Waqar Ahmed" />
              <div><strong>Waqar Ahmed</strong> (1.1K)</div>
            </div>
            <span style="background: #eff6ff; color: #0f62fe; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">${isEs ? 'Invitado' : 'Invited'}</span>
            <span style="color: #64748b;">${isEs ? 'Esperando creador' : 'Awaiting creator'}</span>
            <span style="color: #64748b;">${isEs ? 'En 5 días' : 'In 5 days'}</span>
            <strong style="color: #0f172a;">€30</strong>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 13px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="/photo-david-zmirov.png" style="width: 28px; height: 28px; border-radius: 50%;" alt="David Zmirov" />
              <div><strong>David Zmirov</strong> (12.4K)</div>
            </div>
            <span style="background: #eff6ff; color: #0f62fe; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;">${isEs ? 'Invitado' : 'Invited'}</span>
            <span style="color: #64748b;">${isEs ? 'Esperando creador' : 'Awaiting creator'}</span>
            <span style="color: #64748b;">${isEs ? 'En 5 días' : 'In 5 days'}</span>
            <strong style="color: #0f172a;">€280</strong>
          </div>
        </div>
      `;
    }
  }

  // Copy card / brief link
  document.getElementById('btn-copy-link')?.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href);
    const isEs = getLanguage() === 'ES';
    showToast(isEs ? '¡Enlace copiado al portapapeles!' : 'Link copied to clipboard!');
  });

  // Share card / brief
  document.getElementById('btn-share-card')?.addEventListener('click', () => {
    const isEs = getLanguage() === 'ES';
    showToast(isEs ? 'Modal para compartir listo' : 'Share link ready');
  });

  // Open card / storefront
  document.getElementById('btn-open-card')?.addEventListener('click', () => {
    if (!isBrand) {
      const isEs = getLanguage() === 'ES';
      showToast(isEs ? 'Viendo la tarjeta pública del creador' : 'Viewing full creator public storefront');
    }
  });

  // Blue action links (.ws-link-blue)
  document.querySelectorAll('.ws-link-blue').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const txt = link.textContent.trim();
      showToast(`Navigating to: ${txt}`);
    });
  });

  // Sidebar navigation icons
  const navItems = document.querySelectorAll('.ws-sidebar-nav .ws-nav-item');
  navItems.forEach((btn) => {
    btn.addEventListener('click', () => {
      navItems.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const label = btn.getAttribute('aria-label') || btn.getAttribute('title') || 'Tab';
      showToast(`Switched to: ${label}`);
    });
  });

  // Notification Bell
  document.querySelector('.ws-icon-btn')?.addEventListener('click', () => {
    const isEs = getLanguage() === 'ES';
    showToast(isEs ? 'Notificaciones: Tienes 2 mensajes nuevos' : 'Notifications: You have 2 new campaign updates');
  });

  // Floating AI search assistant bar
  const aiInput = document.querySelector('.ws-ai-input');
  const aiMic = document.querySelector('.ws-ai-mic-btn');

  function handleAiSearch() {
    if (!aiInput) return;
    const query = aiInput.value.trim();
    if (!query) return;
    const isEs = getLanguage() === 'ES';
    showToast(isEs ? `Naano AI: Encontrados 3 resultados para "${query}"` : `Naano AI: Found 3 results for "${query}"`);
    aiInput.value = '';
  }

  aiInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleAiSearch();
    }
  });

  aiMic?.addEventListener('click', () => {
    const isEs = getLanguage() === 'ES';
    showToast(isEs ? 'Asistente de voz activado... di tu consulta' : 'Voice assistant listening... speak your query');
  });

  // Language buttons
  const enBtn = document.getElementById('ws-lang-en');
  const esBtn = document.getElementById('ws-lang-es') || document.getElementById('ws-lang-fr');

  enBtn?.addEventListener('click', () => {
    setLanguage('EN');
    if (isBrand) applyBrandDashboard();
  });

  esBtn?.addEventListener('click', () => {
    setLanguage('ES');
    if (isBrand) applyBrandDashboard();
  });
});
