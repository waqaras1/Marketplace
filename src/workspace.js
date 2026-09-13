/**
 * Naano Workspace Controller
 * Connects all 9 sidebar navigation views for both Creator and Brand experiences:
 * - Overview
 * - Opportunities
 * - Storefront / Creator Card
 * - Collaborations (Attachment 1)
 * - Analytics (Attachment 3)
 * - Community & Leaderboard (Attachment 5)
 * - Earnings & Wallet (Attachment 2)
 * - Referrals & Affiliate (Attachment 4)
 * - Messages
 *
 * Supports deep-linking (?view=...&role=...), browser history, multilingual i18n,
 * and high-fidelity interactive elements.
 */

import { initI18n, setLanguage, getLanguage } from './i18n.js';
import { renderView } from './workspace-views.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize i18n
  initI18n();

  const urlParams = new URLSearchParams(window.location.search);
  let currentRole = urlParams.get('role') || 'creator';
  let isBrand = currentRole === 'brand' || currentRole === 'saas';
  let currentView = urlParams.get('view') || 'overview';

  // Toast notification helper
  function showToast(msg) {
    const toast = document.getElementById('ws-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-visible');
    setTimeout(() => toast.classList.remove('is-visible'), 2800);
  }

  // Update Topbar UI (Avatar, Back button, Balance)
  function updateTopbarUI() {
    const isEs = getLanguage() === 'ES';
    const modeCreator = document.getElementById('ws-mode-creator');
    const modeBrand = document.getElementById('ws-mode-brand');

    if (isBrand) {
      modeBrand?.classList.add('is-active');
      modeCreator?.classList.remove('is-active');

      const backBtn = document.querySelector('.ws-back-register');
      if (backBtn) {
        backBtn.href = '/register?role=saas&step=matching';
        const backText = backBtn.querySelector('span');
        if (backText) backText.textContent = isEs ? 'Volver a matching' : 'Back to matching';
      }

      const avatarWrap = document.querySelector('.ws-user-avatar-wrap');
      if (avatarWrap) {
        avatarWrap.title = 'Atlas Marketing';
        avatarWrap.innerHTML = `
          <div style="width: 32px; height: 32px; border-radius: 50%; background: #0f62fe; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; font-family: 'Plus Jakarta Sans', sans-serif;">A</div>
          <span class="ws-user-online-badge"></span>
        `;
      }

      const balanceText = document.querySelector('.ws-balance-pill span');
      if (balanceText) balanceText.textContent = '€760';
    } else {
      modeCreator?.classList.add('is-active');
      modeBrand?.classList.remove('is-active');

      const backBtn = document.querySelector('.ws-back-register');
      if (backBtn) {
        backBtn.href = '/register';
        const backText = backBtn.querySelector('span');
        if (backText) backText.textContent = isEs ? 'Volver al registro' : 'Back to onboarding';
      }

      const avatarWrap = document.querySelector('.ws-user-avatar-wrap');
      if (avatarWrap) {
        avatarWrap.title = 'Waqar Ahmed';
        avatarWrap.innerHTML = `
          <img src="/avatar-waqar.png" alt="Waqar Ahmed" class="ws-user-avatar" />
          <span class="ws-user-online-badge"></span>
        `;
      }

      const balanceText = document.querySelector('.ws-balance-pill span');
      if (balanceText) balanceText.textContent = '€0';
    }
  }

  // Switch Active View
  function switchView(viewId, updateHistory = true) {
    currentView = viewId;
    const contentArea = document.querySelector('.ws-content');
    if (!contentArea) return;

    // 1. Update Sidebar Active State
    const navItems = document.querySelectorAll('.ws-sidebar-nav .ws-nav-item');
    navItems.forEach((btn) => {
      if (btn.getAttribute('data-view') === viewId) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });

    // 2. Render Template
    contentArea.innerHTML = renderView(viewId, isBrand);

    // 3. Update Browser URL
    if (updateHistory) {
      const url = new URL(window.location);
      url.searchParams.set('view', viewId);
      if (isBrand) {
        url.searchParams.set('role', 'brand');
      } else {
        url.searchParams.delete('role');
      }
      window.history.pushState({ view: viewId, role: isBrand ? 'brand' : 'creator' }, '', url);
    }

    // 4. Attach View Specific Handlers
    attachViewHandlers(viewId);
  }

  // Attach Interactive Handlers for View Content
  function attachViewHandlers(viewId) {
    const isEs = getLanguage() === 'ES';

    // Global in-view links that route to other tabs
    document.querySelectorAll('.ws-content a[href^="?view="]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetUrl = new URL(link.getAttribute('href'), window.location.origin);
        const targetView = targetUrl.searchParams.get('view');
        if (targetView) switchView(targetView);
      });
    });

    if (viewId === 'overview') {
      // Creator Overview actions
      document.getElementById('btn-copy-link')?.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href);
        showToast(isEs ? '¡Enlace copiado al portapapeles!' : 'Link copied to clipboard!');
      });

      document.getElementById('btn-share-card')?.addEventListener('click', () => {
        showToast(isEs ? 'Modal para compartir listo' : 'Share link ready');
      });

      document.getElementById('btn-open-card')?.addEventListener('click', () => {
        switchView('card');
      });
    } else if (viewId === 'collaborations') {
      // Filter Tabs
      const tabs = document.querySelectorAll('.ws-filter-tabs-bar .ws-tab-pill');
      const tbody = document.getElementById('ws-collabs-tbody');
      const totalCount = document.getElementById('collabs-total-count');

      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          tabs.forEach((t) => t.classList.remove('is-active'));
          tab.classList.add('is-active');
          const tabKey = tab.getAttribute('data-tab');

          if (tabKey === 'active' && isBrand) {
            // Show brand active collaborations demo
            if (tbody) {
              tbody.innerHTML = `
                <tr>
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <img src="/avatar-vincent-josse.png" style="width: 26px; height: 26px; border-radius: 50%;" />
                      <strong>Vincent Josse</strong>
                    </div>
                  </td>
                  <td>Trades Growth Launch</td>
                  <td><span style="background: #ecfdf5; color: #10b981; padding: 2px 7px; border-radius: 4px; font-size: 11px; font-weight: 600;">Draft in Review</span></td>
                  <td>1 post scheduled</td>
                  <td>Approve creative draft</td>
                  <td>In 3 days</td>
                  <td style="text-align: right; font-weight: 700;">€450</td>
                </tr>
              `;
            }
            if (totalCount) totalCount.textContent = '1';
          } else {
            if (tbody) {
              tbody.innerHTML = `
                <tr>
                  <td colspan="7" class="ws-table-empty-cell">
                    ${isEs
                      ? 'Aún no hay colaboraciones. Las invitaciones de marcas y tus solicitudes aceptadas aparecerán aquí.'
                      : 'No collaborations yet. Brand invitations and your accepted applications land here.'}
                  </td>
                </tr>
              `;
            }
            if (totalCount) totalCount.textContent = '0';
          }
        });
      });
    } else if (viewId === 'earnings') {
      // Payout options radio click
      const payoutOptions = document.querySelectorAll('.ws-payout-option');
      payoutOptions.forEach((opt) => {
        opt.addEventListener('click', () => {
          payoutOptions.forEach((o) => o.classList.remove('is-selected'));
          opt.classList.add('is-selected');
        });
      });

      document.getElementById('btn-connect-stripe')?.addEventListener('click', (e) => {
        e.stopPropagation();
        showToast(isEs ? 'Conectando con Stripe Connect...' : 'Connecting to Stripe Connect...');
      });

      document.getElementById('btn-edit-bank')?.addEventListener('click', (e) => {
        e.stopPropagation();
        showToast(isEs ? 'Editor de cuenta bancaria abierto' : 'Bank account editor opened');
      });

      document.getElementById('btn-withdraw-all')?.addEventListener('click', () => {
        const amtInput = document.querySelector('.ws-amount-input');
        if (amtInput) amtInput.value = isBrand ? '760' : '0';
      });

      document.getElementById('btn-confirm-withdraw')?.addEventListener('click', () => {
        const amtInput = document.querySelector('.ws-amount-input');
        const val = amtInput ? parseFloat(amtInput.value) : 0;
        if (val > 0) {
          showToast(isEs ? `Solicitud de retirada de €${val} enviada` : `Withdrawal request for €${val} submitted`);
        } else {
          showToast(isEs ? 'No hay saldo disponible para retirar' : 'No available balance to withdraw');
        }
      });
    } else if (viewId === 'referrals') {
      // Segmented toggle: Invite brands vs Invite creators
      const btnBrands = document.getElementById('seg-invite-brands');
      const btnCreators = document.getElementById('seg-invite-creators');
      const headline = document.getElementById('ref-headline');
      const subtext = document.getElementById('ref-subtext');
      const badgeText = document.getElementById('ref-badge-text');

      btnBrands?.addEventListener('click', () => {
        btnBrands.classList.add('is-active');
        btnCreators?.classList.remove('is-active');
        if (badgeText) badgeText.textContent = isEs ? 'Afiliación de marcas · 25% durante 3 meses' : 'Brand affiliation · 25% for 3 months';
        if (headline) headline.textContent = isEs ? 'Recomienda Naano a empresas.' : 'Recommend Naano. Earn for 3 months.';
        if (subtext) {
          subtext.textContent = isEs
            ? 'Comparte tu enlace personal con una empresa. Si se une a Naano y lanza campañas de pago, recibes el 25% de la comisión de Naano durante tres meses.'
            : "Share your personal link with a company. If it joins Naano and launches paid campaigns, you receive 25% of Naano's commission for three months.";
        }
      });

      btnCreators?.addEventListener('click', () => {
        btnCreators.classList.add('is-active');
        btnBrands?.classList.remove('is-active');
        if (badgeText) badgeText.textContent = isEs ? 'Invita creadores · Bonificación para ambos' : 'Invite creators · Bonus for both';
        if (headline) headline.textContent = isEs ? 'Haz crecer la red de creadores.' : 'Grow the creator network.';
        if (subtext) {
          subtext.textContent = isEs
            ? 'Invita a tus compañeros creadores de LinkedIn. Cuando publiquen su primer post patrocinado, ambos recibiréis una bonificación directa de 50€.'
            : 'Invite your fellow LinkedIn creators. When they publish their first sponsored post, you both receive a €50 bonus.';
        }
      });

      document.getElementById('btn-copy-ref-link')?.addEventListener('click', () => {
        navigator.clipboard.writeText(`https://naano.com/r/${isBrand ? 'atlas-marketing' : 'waqar-ahmed'}`);
        showToast(isEs ? '¡Enlace de referido copiado al portapapeles!' : 'Referral link copied to clipboard!');
      });

      document.getElementById('ref-how-it-works-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        showToast(isEs ? 'Comisiones pagadas automáticamente el día 1 de cada mes.' : 'Commissions paid automatically on the 1st of every month.');
      });
    } else if (viewId === 'community') {
      document.getElementById('btn-join-slack')?.addEventListener('click', () => {
        showToast(isEs ? 'Abriendo invitación para el Slack de creadores de Naano...' : 'Opening invite for Naano Creator Slack...');
      });

      document.getElementById('btn-publish-card')?.addEventListener('click', () => {
        showToast(isEs ? 'Tu tarjeta de creador ha sido actualizada y publicada en LinkedIn.' : 'Creator card published and synced to your Deal Link.');
      });

      document.getElementById('btn-invite-top')?.addEventListener('click', () => {
        showToast(isEs ? 'Invitando a los 5 creadores más destacados...' : 'Sending invitations to top 5 leaderboard creators...');
      });

      document.getElementById('btn-filter-lb')?.addEventListener('click', () => {
        showToast(isEs ? 'Filtrando por alcance e idioma' : 'Filter by reach, niche, and language');
      });
    } else if (viewId === 'card') {
      document.getElementById('btn-copy-card-link-2')?.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.origin + '/workspace?view=card');
        showToast(isEs ? 'Enlace público copiado' : 'Public storefront link copied');
      });
      document.getElementById('btn-edit-profile-card')?.addEventListener('click', () => {
        showToast(isEs ? 'Editor de perfil público abierto' : 'Opening profile editor');
      });
    }
  }

  // Sidebar navigation click handlers
  const navItems = document.querySelectorAll('.ws-sidebar-nav .ws-nav-item');
  navItems.forEach((btn) => {
    btn.addEventListener('click', () => {
      const viewId = btn.getAttribute('data-view') || 'overview';
      switchView(viewId);
    });
  });

  // Handle Role Mode Switcher Pill clicks (Creator vs Brand)
  const modeCreator = document.getElementById('ws-mode-creator');
  const modeBrand = document.getElementById('ws-mode-brand');

  modeCreator?.addEventListener('click', (e) => {
    e.preventDefault();
    isBrand = false;
    currentRole = 'creator';
    updateTopbarUI();
    switchView(currentView);
  });

  modeBrand?.addEventListener('click', (e) => {
    e.preventDefault();
    isBrand = true;
    currentRole = 'brand';
    updateTopbarUI();
    switchView(currentView);
  });

  // Language Switchers
  const enBtn = document.getElementById('ws-lang-en');
  const esBtn = document.getElementById('ws-lang-es');

  enBtn?.addEventListener('click', () => {
    setLanguage('EN');
    updateTopbarUI();
    switchView(currentView, false);
  });

  esBtn?.addEventListener('click', () => {
    setLanguage('ES');
    updateTopbarUI();
    switchView(currentView, false);
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
    if (e.key === 'Enter') handleAiSearch();
  });

  aiMic?.addEventListener('click', () => {
    const isEs = getLanguage() === 'ES';
    showToast(isEs ? 'Asistente de voz activado... di tu consulta' : 'Voice assistant listening... speak your query');
  });

  // Notification Bell
  document.querySelector('.ws-icon-btn')?.addEventListener('click', () => {
    const isEs = getLanguage() === 'ES';
    showToast(isEs ? 'Notificaciones: Tienes 2 mensajes nuevos' : 'Notifications: You have 2 new campaign updates');
  });

  // Handle Browser Back / Forward History
  window.addEventListener('popstate', (e) => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view') || 'overview';
    const role = params.get('role');
    isBrand = role === 'brand' || role === 'saas';
    currentRole = isBrand ? 'brand' : 'creator';
    updateTopbarUI();
    switchView(view, false);
  });

  // Initial Load
  updateTopbarUI();
  switchView(currentView, false);
});
