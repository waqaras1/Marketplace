/**
 * Naano Workspace Views Module
 * Complete view renderers matching the real Naano product screenshots:
 * - Overview (Creator & Brand)
 * - Opportunities / Marketplace
 * - Creator Card / Storefront
 * - Collaborations (Attachment 1: recon/collaborations-creator.png)
 * - Analytics (Attachment 3: recon/analytics-creator.png)
 * - Community & Leaderboard (Attachment 5: recon/community-creator.png)
 * - Earnings & Payouts (Attachment 2: recon/earnings-creator.png)
 * - Referrals & Affiliate (Attachment 4: recon/affiliate-creator.png)
 * - Messages (recon/messages-creator.png)
 */

import { getLanguage } from './i18n.js';

export function renderView(viewId, isBrand = false) {
  const isEs = getLanguage() === 'ES';

  switch (viewId) {
    case 'collaborations':
      return renderCollaborationsView(isBrand, isEs);
    case 'earnings':
      return renderEarningsView(isBrand, isEs);
    case 'analytics':
      return renderAnalyticsView(isBrand, isEs);
    case 'community':
      return renderCommunityView(isBrand, isEs);
    case 'referrals':
      return renderReferralsView(isBrand, isEs);
    case 'opportunities':
      return renderOpportunitiesView(isBrand, isEs);
    case 'card':
      return renderCardStorefrontView(isBrand, isEs);
    case 'messages':
      return renderMessagesView(isBrand, isEs);
    case 'overview':
    default:
      return renderOverviewView(isBrand, isEs);
  }
}

// -----------------------------------------------------------------------------
// 1. Overview View
// -----------------------------------------------------------------------------
function renderOverviewView(isBrand, isEs) {
  if (isBrand) {
    return `
      <div class="ws-page-header">
        <span class="ws-eyebrow">${isEs ? 'Panel de campaña de marca' : 'Brand campaign workspace'}</span>
        <h1 class="ws-title">${isEs ? 'Nos alegra verte, Atlas Marketing' : 'Good to see you, Atlas Marketing'}</h1>
        <p class="ws-subtitle">${isEs ? 'Tus campañas activas y creadores afines, de un vistazo.' : 'Your active creator campaigns and matched pipeline, at a glance.'}</p>
      </div>

      <div class="ws-metrics-grid">
        <div class="ws-metric-card">
          <div class="ws-metric-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ws-metric-icon"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2"/></svg>
            <span class="ws-metric-label">${isEs ? 'CAMPAÑAS ACTIVAS' : 'ACTIVE CAMPAIGNS'}</span>
          </div>
          <div class="ws-metric-value">1 Launch</div>
          <div class="ws-metric-desc">${isEs ? 'Campaña de servicios B2B' : 'Atlas Marketing Trade Campaign'}</div>
        </div>

        <div class="ws-metric-card">
          <div class="ws-metric-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ws-metric-icon"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span class="ws-metric-label">${isEs ? 'CREADORES AFINES' : 'MATCHED CREATORS'}</span>
          </div>
          <div class="ws-metric-value">3 Vetted</div>
          <div class="ws-metric-desc">${isEs ? 'Alineados con tus clientes ideales (ICP)' : 'Aligned with US Trade ICPs'}</div>
        </div>

        <div class="ws-metric-card">
          <div class="ws-metric-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ws-metric-icon"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <span class="ws-metric-label">${isEs ? 'ALCANCE ESTIMADO' : 'TOTAL REACH'}</span>
          </div>
          <div class="ws-metric-value">61.5K</div>
          <div class="ws-metric-desc">${isEs ? 'Impresiones cualificadas B2B' : 'Qualified B2B Impressions'}</div>
        </div>

        <div class="ws-metric-card">
          <div class="ws-metric-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ws-metric-icon"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            <span class="ws-metric-label">${isEs ? 'PRESUPUESTO ASIGNADO' : 'CAMPAIGN BUDGET'}</span>
          </div>
          <div class="ws-metric-value">€760</div>
          <div class="ws-metric-desc">${isEs ? 'Depósito en Stripe Connect listo' : 'Allocated creator post payouts'}</div>
        </div>
      </div>

      <div class="ws-two-cols">
        <div class="ws-col-left">
          <section class="ws-panel ws-creator-card-panel">
            <div class="ws-panel-header">
              <div>
                <h2 class="ws-panel-title">${isEs ? 'Tu brief de campaña' : 'Your campaign brief'}</h2>
                <p class="ws-panel-sub">${isEs ? 'Así descubren los creadores tu propuesta y audiencia objetivo.' : 'What invited creators receive to understand your product and ICP.'}</p>
              </div>
              <div class="ws-panel-actions">
                <button type="button" class="ws-btn ws-btn-secondary" id="btn-open-card"><span>${isEs ? 'Editar brief' : 'Edit brief'}</span></button>
                <button type="button" class="ws-btn ws-btn-secondary" id="btn-copy-link"><span>${isEs ? 'Copiar brief' : 'Copy brief link'}</span></button>
                <button type="button" class="ws-btn ws-btn-primary" id="btn-share-card"><span>${isEs ? 'Invitar creadores' : 'Invite creators'}</span></button>
              </div>
            </div>

            <div class="ws-card-mockup-wrapper">
              <div class="ws-card-mockup">
                <div class="ws-card-banner">
                  <div class="ws-card-in-badge">in</div>
                  <div class="ws-card-brand">naano</div>
                  <div class="ws-card-banner-right">
                    <span class="ws-card-flag-badge">🇺🇸</span>
                  </div>
                </div>
                <div class="ws-card-avatar-container">
                  <div style="width: 72px; height: 72px; border-radius: 50%; background: #0f62fe; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">A</div>
                </div>
                <div class="ws-card-body">
                  <h3 class="ws-card-name">Atlas Marketing</h3>
                  <div class="ws-card-tags">Trades · HVAC · Roofing · Plumbing</div>
                  <p class="ws-card-headline">Unified marketing partner for US service businesses. Booked jobs and ringing phones, not vanity metrics.</p>
                  <div class="ws-card-calendar-badge" style="background: #eff6ff; color: #0f62fe;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>${isEs ? 'Brief activo · 3 Creadores invitados' : 'Active brief · 3 Creators invited'}</span>
                  </div>
                  <div class="ws-card-progress-row">
                    <span class="ws-card-progress-label">${isEs ? 'Estado' : 'Status'}</span>
                    <div class="ws-card-progress-track"><div class="ws-card-progress-fill" style="width: 66%;"></div></div>
                    <span class="ws-card-progress-status" style="color: #0f62fe;">${isEs ? 'En marcha' : 'In Progress'}</span>
                  </div>
                  <div class="ws-card-stats-grid">
                    <div class="ws-card-stat-col"><div class="ws-card-stat-value">3</div><div class="ws-card-stat-title">${isEs ? 'Creadores' : 'Creators'}</div></div>
                    <div class="ws-card-stat-col"><div class="ws-card-stat-value">61.5K</div><div class="ws-card-stat-title">${isEs ? 'Alcance est.' : 'Est. reach'}</div></div>
                    <div class="ws-card-stat-col"><div class="ws-card-stat-value">€760</div><div class="ws-card-stat-title">${isEs ? 'Presupuesto' : 'Budget'}</div></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="ws-col-right">
          <section class="ws-panel ws-collabs-panel">
            <div class="ws-panel-header">
              <div>
                <h2 class="ws-panel-title">${isEs ? 'Colaboraciones de campaña' : 'Campaign collaborations'}</h2>
                <p class="ws-panel-sub">${isEs ? 'Creadores invitados a tu campaña Atlas Marketing.' : 'Creators invited to your Atlas Marketing campaign.'}</p>
              </div>
              <a href="?view=collaborations&role=brand" class="ws-link-blue">${isEs ? 'Ver todas' : 'See all'}</a>
            </div>
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
            </div>
          </section>
        </div>
      </div>
    `;
  }

  // Creator Overview (Default)
  return `
    <div class="ws-page-header">
      <span class="ws-eyebrow">${isEs ? 'Espacio del creador' : 'Creator workspace'}</span>
      <h1 class="ws-title">${isEs ? 'Nos alegra verte, Waqar' : 'Good to see you, Waqar'}</h1>
      <p class="ws-subtitle">${isEs ? 'Tu actividad como creador, de un vistazo.' : 'Your creator activity, at a glance.'}</p>
    </div>

    <div class="ws-metrics-grid">
      <div class="ws-metric-card">
        <div class="ws-metric-header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ws-metric-icon"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
          <span class="ws-metric-label">${isEs ? 'ALCANCE DE PUBLICACIONES' : 'PUBLIC POST REACH'}</span>
        </div>
        <div class="ws-metric-value">—</div>
        <div class="ws-metric-desc">${isEs ? 'Esperando datos de posts públicos' : 'Waiting for public post data'}</div>
      </div>

      <div class="ws-metric-card">
        <div class="ws-metric-header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ws-metric-icon"><rect width="18" height="18" x="3" y="3" rx="2" /><line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="13" x2="15" y2="13" /></svg>
          <span class="ws-metric-label">${isEs ? 'POSTS PÚBLICOS' : 'PUBLIC POSTS'}</span>
        </div>
        <div class="ws-metric-value">0</div>
        <div class="ws-metric-desc">${isEs ? 'Posts originales de LinkedIn encontrados' : 'Original LinkedIn posts found'}</div>
      </div>

      <div class="ws-metric-card">
        <div class="ws-metric-header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ws-metric-icon"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
          <span class="ws-metric-label">${isEs ? 'INTERACCIONES PÚBLICAS' : 'PUBLIC ENGAGEMENTS'}</span>
        </div>
        <div class="ws-metric-value">0</div>
        <div class="ws-metric-desc">${isEs ? 'Reacciones, comentarios y republicaciones' : 'Reactions, comments and reposts'}</div>
      </div>

      <div class="ws-metric-card">
        <div class="ws-metric-header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ws-metric-icon"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          <span class="ws-metric-label">${isEs ? 'SEGUIDORES EN LINKEDIN' : 'LINKEDIN FOLLOWERS'}</span>
        </div>
        <div class="ws-metric-value">1.1K</div>
        <div class="ws-metric-desc">${isEs ? 'Importados desde el perfil público' : 'Imported from the public profile'}</div>
      </div>
    </div>

    <div class="ws-two-cols">
      <div class="ws-col-left">
        <section class="ws-panel ws-creator-card-panel">
          <div class="ws-panel-header">
            <div>
              <h2 class="ws-panel-title">${isEs ? 'Tu tarjeta de creador' : 'Your creator card'}</h2>
              <p class="ws-panel-sub">${isEs ? 'Así descubren las marcas tu posicionamiento y oferta de colaboración.' : 'This is how brands discover your positioning and collaboration offer.'}</p>
            </div>
            <div class="ws-panel-actions">
              <button type="button" class="ws-btn ws-btn-secondary" id="btn-open-card"><span>${isEs ? 'Abrir tarjeta' : 'Open card'}</span></button>
              <button type="button" class="ws-btn ws-btn-secondary" id="btn-copy-link"><span>${isEs ? 'Copiar enlace' : 'Copy card link'}</span></button>
              <button type="button" class="ws-btn ws-btn-primary" id="btn-share-card"><span>${isEs ? 'Compartir tarjeta' : 'Share my card'}</span></button>
            </div>
          </div>

          <div class="ws-card-mockup-wrapper">
            <div class="ws-card-mockup">
              <div class="ws-card-banner">
                <div class="ws-card-in-badge">in</div>
                <div class="ws-card-brand">naano</div>
                <div class="ws-card-banner-right">
                  <span class="ws-card-flag-badge">🇵🇰</span>
                </div>
              </div>
              <div class="ws-card-avatar-container">
                <img src="/avatar-waqar.png" alt="Waqar Ahmed" class="ws-card-avatar-img" />
              </div>
              <div class="ws-card-body">
                <h3 class="ws-card-name">Waqar Ahmed</h3>
                <div class="ws-card-tags">Software · AI · SaaS</div>
                <p class="ws-card-headline">AI Full Stack Engineer | Software Engineer | Next.js | React | Node.js | Python | Open to Work</p>
                <div class="ws-card-calendar-badge">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  <span>${isEs ? 'Sin datos de posts disponibles' : 'No post data available'}</span>
                </div>
                <div class="ws-card-progress-row">
                  <span class="ws-card-progress-label">${isEs ? 'Datos' : 'Data'}</span>
                  <div class="ws-card-progress-track"><div class="ws-card-progress-fill"></div></div>
                  <span class="ws-card-progress-status">${isEs ? 'Pendiente' : 'Pending'}</span>
                </div>
                <div class="ws-card-stats-grid">
                  <div class="ws-card-stat-col"><div class="ws-card-stat-value">1.1K</div><div class="ws-card-stat-title">${isEs ? 'Seguidores' : 'Followers'}</div></div>
                  <div class="ws-card-stat-col"><div class="ws-card-stat-value">—</div><div class="ws-card-stat-title">${isEs ? 'Impresiones est.' : 'Est. impressions'}</div></div>
                  <div class="ws-card-stat-col"><div class="ws-card-stat-value">€30</div><div class="ws-card-stat-title">${isEs ? 'Tarifa elegida' : 'Chosen cost'}</div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="ws-panel ws-opportunities-panel">
          <div class="ws-panel-header">
            <div>
              <h2 class="ws-panel-title">${isEs ? 'Oportunidades recomendadas' : 'Recommended opportunities'}</h2>
              <p class="ws-panel-sub">${isEs ? 'Las 3 campañas que mejor encajan con tu audiencia.' : 'The 3 campaigns that best match your audience.'}</p>
            </div>
            <a href="?view=opportunities" class="ws-link-blue">${isEs ? 'Explorar' : 'Explore'}</a>
          </div>
          <div class="ws-opps-list">
            <div class="ws-opp-item">
              <div class="ws-opp-logo ws-opp-logo--pi">PI</div>
              <div class="ws-opp-info">
                <div class="ws-opp-title">Premium Inboxes</div>
                <div class="ws-opp-sub">${isEs ? 'Campaña principal · alta afinidad' : 'Main campaign · strong match'}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ws-opp-arrow"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </div>
            <div class="ws-opp-item">
              <div class="ws-opp-logo ws-opp-logo--orbi">O</div>
              <div class="ws-opp-info">
                <div class="ws-opp-title">OrbiSearch</div>
                <div class="ws-opp-sub">${isEs ? 'Campaña principal · alta afinidad' : 'Main campaign · strong match'}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ws-opp-arrow"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </div>
          </div>
        </section>
      </div>

      <div class="ws-col-right">
        <section class="ws-panel ws-guide-panel">
          <div class="ws-panel-header">
            <div>
              <h2 class="ws-panel-title">${isEs ? 'Tu guía de lanzamiento' : 'Your launch guide'}</h2>
              <p class="ws-panel-sub">${isEs ? '1 de 1 pasos completados' : '1 of 1 steps complete'}</p>
            </div>
            <a href="?view=card" class="ws-link-blue">${isEs ? 'Abrir tarjeta' : 'Open card'}</a>
          </div>
          <div class="ws-guide-list">
            <div class="ws-guide-item">
              <div class="ws-guide-check">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <div class="ws-guide-info">
                <div class="ws-guide-title">${isEs ? 'Tarjeta y tarifa listas' : 'Card and price ready'}</div>
                <div class="ws-guide-sub">${isEs ? 'Tu posicionamiento y propuesta están listos para revisar.' : 'Your positioning and offer are ready to review.'}</div>
              </div>
              <span class="ws-pill-complete">${isEs ? 'Completado' : 'Complete'}</span>
            </div>
          </div>
        </section>

        <section class="ws-panel ws-collabs-panel">
          <div class="ws-panel-header">
            <div>
              <h2 class="ws-panel-title">${isEs ? 'Colaboraciones activas' : 'Active collaborations'}</h2>
              <p class="ws-panel-sub">${isEs ? 'Todo lo que se encuentra en curso, de brief a publicación.' : 'Everything currently moving from brief to publication.'}</p>
            </div>
            <a href="?view=collaborations" class="ws-link-blue">${isEs ? 'Ver todas' : 'See all'}</a>
          </div>
          <div class="ws-collabs-table-header">
            <span>${isEs ? 'Marca' : 'Brand'}</span>
            <span>${isEs ? 'Estado' : 'Status'}</span>
            <span>${isEs ? 'Próxima acción' : 'Next action'}</span>
            <span>${isEs ? 'Fecha' : 'Due'}</span>
            <span>${isEs ? 'Neto' : 'Net'}</span>
          </div>
          <div class="ws-collabs-empty">${isEs ? 'No hay colaboraciones activas.' : 'No active collaborations.'}</div>
        </section>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// 2. Collaborations View (Exact replica of Attachment 1: recon/collaborations-creator.png)
// -----------------------------------------------------------------------------
function renderCollaborationsView(isBrand, isEs) {
  return `
    <div class="ws-view-container ws-collabs-view">
      <div class="ws-view-header">
        <h1 class="ws-view-title">${isEs ? 'Colaboraciones' : 'Collaborations'}</h1>
        <p class="ws-view-subtitle">
          ${isEs
            ? 'Cada paso te indica dónde estás, qué hacer y qué sucede si no haces nada.'
            : 'Every step tells you where you stand, what to do, and what happens if you do nothing.'}
        </p>
      </div>

      <!-- Filter Tabs -->
      <div class="ws-filter-tabs-bar" role="tablist">
        <button type="button" class="ws-tab-pill is-active" data-tab="all">
          <span>${isEs ? 'Todas' : 'All'}</span>
          <span class="ws-tab-count">0</span>
        </button>
        <button type="button" class="ws-tab-pill" data-tab="active">
          <span>${isEs ? 'Activas' : 'Active'}</span>
          <span class="ws-tab-count">0</span>
        </button>
        <button type="button" class="ws-tab-pill" data-tab="needs-action">
          <span>${isEs ? 'Requieren acción' : 'Needs action'}</span>
          <span class="ws-tab-count">0</span>
        </button>
        <button type="button" class="ws-tab-pill" data-tab="applications">
          <span>${isEs ? 'Solicitudes enviadas' : 'Applications sent'}</span>
          <span class="ws-tab-count">0</span>
        </button>
        <button type="button" class="ws-tab-pill" data-tab="declined">
          <span>${isEs ? 'Rechazadas' : 'Declined'}</span>
          <span class="ws-tab-count">0</span>
        </button>
        <button type="button" class="ws-tab-pill" data-tab="completed">
          <span>${isEs ? 'Completadas' : 'Completed'}</span>
          <span class="ws-tab-count">0</span>
        </button>
      </div>

      <!-- Main Collaborations Card & Table -->
      <div class="ws-table-card">
        <div class="ws-data-table-wrap">
          <table class="ws-data-table">
            <thead>
              <tr>
                <th>${isBrand ? (isEs ? 'Creador' : 'Creator') : (isEs ? 'Marca' : 'Brand')}</th>
                <th>${isEs ? 'Campaña' : 'Campaign'}</th>
                <th>${isEs ? 'Estado' : 'Status'}</th>
                <th>${isEs ? 'Rendimiento' : 'Performance'}</th>
                <th>${isEs ? 'Próxima acción' : 'Next action'}</th>
                <th>${isEs ? 'Fecha límite' : 'Due date'}</th>
                <th style="text-align: right;">${isBrand ? (isEs ? 'Presupuesto' : 'Budget') : (isEs ? 'Tu neto' : 'Your net')}</th>
              </tr>
            </thead>
            <tbody id="ws-collabs-tbody">
              <tr>
                <td colspan="7" class="ws-table-empty-cell">
                  ${isEs
                    ? 'Aún no hay colaboraciones. Las invitaciones de marcas y tus solicitudes aceptadas aparecerán aquí.'
                    : 'No collaborations yet. Brand invitations and your accepted applications land here.'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="ws-table-footer">
          <div class="ws-table-count-label">
            <span id="collabs-total-count">0</span> ${isEs ? 'colaboraciones' : 'collaborations'}
          </div>
          <div class="ws-pagination">
            <button type="button" class="ws-page-btn is-active" aria-label="Page 1">1</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// 3. Earnings & Wallet View (Exact replica of Attachment 2: recon/earnings-creator.png)
// -----------------------------------------------------------------------------
function renderEarningsView(isBrand, isEs) {
  return `
    <div class="ws-view-container ws-earnings-view">
      <div class="ws-view-header ws-view-header--with-badge">
        <div>
          <h1 class="ws-view-title">${isBrand ? (isEs ? 'Facturación y fondos' : 'Billing & Balances') : (isEs ? 'Ingresos' : 'Earnings')}</h1>
          <p class="ws-view-subtitle">
            ${isBrand
              ? (isEs ? 'Gestiona los fondos en depósito y facturas de tus campañas con creadores.' : 'Manage escrow campaign funds, deposit balances, and creator payout invoices.')
              : (isEs ? 'Sigue los ingresos de tus colaboraciones remuneradas y retira los fondos disponibles.' : 'Track revenue from your paid collaborations and withdraw available funds.')}
          </p>
        </div>
        <div class="ws-header-pill">
          <span class="ws-status-dot ws-status-dot--blue"></span>
          <span>${isBrand ? (isEs ? 'Depósito en custodia activo' : 'Active escrow deposit') : (isEs ? 'Colaboraciones remuneradas' : 'Paid collaborations')}</span>
        </div>
      </div>

      <!-- 3 Top Metric Cards -->
      <div class="ws-earnings-metrics-row">
        <!-- Card 1: Total earned -->
        <div class="ws-earnings-kpi-card ws-earnings-kpi--sky">
          <div class="ws-kpi-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ws-kpi-icon"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            <span class="ws-kpi-title">${isBrand ? (isEs ? 'Inversión total' : 'Total campaign spend') : (isEs ? 'Total ganado' : 'Total earned')}</span>
          </div>
          <div class="ws-kpi-amount">€${isBrand ? '760' : '0'}</div>
          <div class="ws-kpi-subtext">
            ${isBrand ? (isEs ? '3 colaboraciones contratadas · €253 promedio' : '3 booked collaborations · €253 average') : (isEs ? '0 colaboraciones pagadas · €0 promedio' : '0 paid collaborations · €0 average')}
          </div>
        </div>

        <!-- Card 2: In transit -->
        <div class="ws-earnings-kpi-card">
          <div class="ws-kpi-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ws-kpi-icon"><path d="m11 17-5-5 5-5"/><path d="M18 12H6"/></svg>
            <span class="ws-kpi-title">${isBrand ? (isEs ? 'En depósito' : 'In escrow') : (isEs ? 'En tránsito' : 'In transit')}</span>
          </div>
          <div class="ws-kpi-amount">€0</div>
          <div class="ws-kpi-subtext">
            ${isEs
              ? 'Las transferencias internacionales suelen tardar de 1 a 7 días, según el destino y la red bancaria.'
              : 'International transfers usually arrive within 1–7 days, depending on the destination and banking network.'}
          </div>
        </div>

        <!-- Card 3: Available now -->
        <div class="ws-earnings-kpi-card">
          <div class="ws-kpi-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ws-kpi-icon"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            <span class="ws-kpi-title">${isEs ? 'Disponible ahora' : 'Available now'}</span>
          </div>
          <div class="ws-kpi-amount">€0</div>
          <div class="ws-kpi-subtext">
            ${isEs ? 'Listo para retirar hacia tu método de cobro seleccionado.' : 'Ready to withdraw to your selected payout method.'}
          </div>
        </div>
      </div>

      <!-- 2-Column Split: Bar Chart & Withdrawal Panel -->
      <div class="ws-earnings-two-cols">
        <!-- Left: Earnings over time Chart -->
        <div class="ws-panel ws-chart-panel">
          <div class="ws-panel-header">
            <div>
              <h2 class="ws-panel-title">${isEs ? 'Ingresos a lo largo del tiempo' : 'Earnings over time'}</h2>
              <p class="ws-panel-sub">${isEs ? 'Ingresos netos por colaboraciones de los últimos seis meses.' : 'Net collaboration earnings from the last six months.'}</p>
            </div>
            <span class="ws-chart-total-pill">€0 ${isEs ? 'en 6 meses' : 'over 6 months'}</span>
          </div>

          <div class="ws-bar-chart-container">
            <div class="ws-bar-col">
              <span class="ws-bar-val">€0</span>
              <div class="ws-bar-slot"><div class="ws-bar-fill" style="height: 6px;"></div></div>
              <span class="ws-bar-lbl">Apr</span>
            </div>
            <div class="ws-bar-col">
              <span class="ws-bar-val">€0</span>
              <div class="ws-bar-slot"><div class="ws-bar-fill" style="height: 6px;"></div></div>
              <span class="ws-bar-lbl">May</span>
            </div>
            <div class="ws-bar-col">
              <span class="ws-bar-val">€0</span>
              <div class="ws-bar-slot"><div class="ws-bar-fill" style="height: 6px;"></div></div>
              <span class="ws-bar-lbl">Jun</span>
            </div>
            <div class="ws-bar-col">
              <span class="ws-bar-val">€0</span>
              <div class="ws-bar-slot"><div class="ws-bar-fill" style="height: 6px;"></div></div>
              <span class="ws-bar-lbl">Jul</span>
            </div>
            <div class="ws-bar-col">
              <span class="ws-bar-val">€0</span>
              <div class="ws-bar-slot"><div class="ws-bar-fill" style="height: 6px;"></div></div>
              <span class="ws-bar-lbl">Aug</span>
            </div>
            <div class="ws-bar-col is-current">
              <span class="ws-bar-val">€0</span>
              <div class="ws-bar-slot"><div class="ws-bar-fill is-active-month" style="height: 6px;"></div></div>
              <span class="ws-bar-lbl is-active-month">Sept</span>
            </div>
          </div>
        </div>

        <!-- Right: Withdraw earnings Panel -->
        <div class="ws-panel ws-withdraw-panel">
          <div class="ws-panel-header">
            <div>
              <h2 class="ws-panel-title">${isEs ? 'Retirar fondos' : 'Withdraw earnings'}</h2>
              <p class="ws-panel-sub">${isEs ? 'Elige el destino donde enviar tu saldo disponible.' : 'Choose where your available balance should be sent.'}</p>
            </div>
          </div>

          <div class="ws-payout-methods">
            <span class="ws-input-section-lbl">${isEs ? 'MÉTODO DE PAGO' : 'PAYOUT METHOD'}</span>

            <!-- Bank transfer option -->
            <label class="ws-payout-option" for="payout-bank">
              <input type="radio" name="payout_method" id="payout-bank" class="ws-radio" />
              <div class="ws-payout-option-body">
                <div class="ws-payout-option-title">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="21" x2="21" y2="21"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="5 6 12 3 19 6"/><line x1="4" y1="10" x2="4" y2="21"/><line x1="20" y1="10" x2="20" y2="21"/></svg>
                  <span>${isEs ? 'Transferencia bancaria' : 'Bank transfer'}</span>
                </div>
                <div class="ws-payout-desc">${isEs ? 'Sin titular registrado / Sin cuenta bancaria registrada' : 'No account holder on file · No bank details on file'}</div>
              </div>
              <button type="button" class="ws-btn-pill-small" id="btn-edit-bank">${isEs ? 'Editar' : 'Edit'}</button>
            </label>

            <!-- Stripe option (default selected in Naano) -->
            <label class="ws-payout-option is-selected" for="payout-stripe">
              <input type="radio" name="payout_method" id="payout-stripe" class="ws-radio" checked />
              <div class="ws-payout-option-body">
                <div class="ws-payout-option-title">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                  <span>Stripe</span>
                </div>
                <div class="ws-payout-desc">
                  <strong>${isEs ? 'Estado:' : 'Status:'}</strong> ${isEs ? 'No conectado' : 'Not connected'}<br/>
                  ${isEs ? 'Transferencia instantánea a tu cuenta de Stripe conectada.' : 'Instant transfer to your connected Stripe account.'}
                </div>
                <button type="button" class="ws-btn-stripe-connect" id="btn-connect-stripe">${isEs ? 'Conectar Stripe' : 'Connect Stripe'}</button>
              </div>
            </label>
          </div>

          <!-- Amount Input Field -->
          <div class="ws-amount-input-row">
            <div class="ws-amount-input-wrap">
              <span class="ws-currency-symbol">€</span>
              <input type="number" class="ws-amount-input" placeholder="${isEs ? 'Importe' : 'Amount'}" value="0" />
            </div>
            <button type="button" class="ws-btn ws-btn-secondary" id="btn-withdraw-all">${isEs ? 'Retirar todo' : 'Withdraw all'}</button>
          </div>

          <button type="button" class="ws-btn-confirm-withdraw" id="btn-confirm-withdraw">
            ${isEs ? 'Confirmar retirada' : 'Confirm withdrawal'}
          </button>

          <div class="ws-payout-notice">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>${isEs ? 'Actualmente no hay ingresos en espera de liberación.' : 'No earnings are currently waiting for release.'}</span>
          </div>
        </div>
      </div>

      <!-- Bottom: Recent Activity Ledger -->
      <div class="ws-panel ws-recent-activity-panel">
        <div class="ws-panel-header">
          <div>
            <h2 class="ws-panel-title">${isEs ? 'Actividad reciente' : 'Recent activity'}</h2>
            <p class="ws-panel-sub">${isEs ? 'Ingresos por colaboraciones, retiradas y facturas en un solo lugar.' : 'Collaboration earnings, withdrawals and invoices in one place.'}</p>
          </div>
        </div>

        <div class="ws-activity-tabs">
          <button type="button" class="ws-tab-underline is-active">${isEs ? 'Ingresos y retiradas' : 'Earnings and withdrawals'}</button>
          <button type="button" class="ws-tab-underline">${isEs ? 'Pendientes de liberación' : 'Awaiting release'} 0</button>
          <button type="button" class="ws-tab-underline">${isEs ? 'Facturas' : 'Invoices'} 0</button>
        </div>

        <div class="ws-data-table-wrap">
          <table class="ws-data-table">
            <thead>
              <tr>
                <th>${isEs ? 'Fecha' : 'Date'}</th>
                <th>${isEs ? 'Tipo' : 'Type'}</th>
                <th>${isEs ? 'Detalle' : 'Detail'}</th>
                <th>${isEs ? 'Importe' : 'Amount'}</th>
                <th>${isEs ? 'Estado' : 'Status'}</th>
                <th style="text-align: right;">${isEs ? 'Factura' : 'Invoice'}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="6" class="ws-table-empty-cell">
                  ${isEs ? 'Aún no hay movimientos. Tu primer cobro aparecerá aquí.' : 'No movements yet. Your first payment will appear here.'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// 4. Analytics View (Exact replica of Attachment 3: recon/analytics-creator.png)
// -----------------------------------------------------------------------------
function renderAnalyticsView(isBrand, isEs) {
  return `
    <div class="ws-view-container ws-analytics-view">
      <div class="ws-view-header ws-view-header--with-badge">
        <div>
          <h1 class="ws-view-title">${isEs ? 'Analítica' : 'Analytics'}</h1>
          <p class="ws-view-subtitle">
            ${isBrand
              ? (isEs ? 'Atribución de campañas y rendimiento de creadores para Atlas Marketing.' : 'Campaign attribution and creator conversion metrics for Atlas Marketing.')
              : (isEs ? 'Rendimiento público de LinkedIn importado para este perfil.' : 'Public LinkedIn performance imported for this profile.')}
          </p>
        </div>
        <div class="ws-timeframe-selector">
          <button type="button" class="ws-dropdown-pill">
            <span>${isEs ? 'Todo el tiempo' : 'All time'}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>
      </div>

      <!-- Top Sky Banner -->
      <div class="ws-analytics-hero-banner">
        <div class="ws-banner-content">
          <div class="ws-banner-badge">
            <span class="ws-status-dot ws-status-dot--green"></span>
            <span>${isEs ? 'INSTANTÁNEA PÚBLICA DE LINKEDIN' : 'PUBLIC LINKEDIN SNAPSHOT'}</span>
          </div>
          <h2 class="ws-banner-title">${isEs ? 'Se están importando los posts públicos de LinkedIn' : 'Public LinkedIn posts are being imported'}</h2>
          <p class="ws-banner-sub">
            ${isEs
              ? 'El perfil está listo. El historial de posts y el alcance aparecerán una vez finalice el proceso de recopilación de datos.'
              : 'The profile is ready. Post history and reach will appear after the public-data job completes.'}
          </p>
        </div>
        <div class="ws-banner-stat-box">
          <div class="ws-banner-pct">0%</div>
          <div class="ws-banner-pct-desc">${isEs ? 'de los posts importados incluyen datos de alcance' : 'of imported posts include reach data'}</div>
          <div class="ws-banner-tag">
            <span class="ws-status-dot ws-status-dot--green"></span>
            <span>${isEs ? 'Ningún post público encontrado aún' : 'No public post found yet'}</span>
          </div>
        </div>
      </div>

      <!-- 4 KPI Metrics Row -->
      <div class="ws-analytics-kpi-grid">
        <div class="ws-metric-card">
          <div class="ws-metric-header">
            <span class="ws-metric-label">${isEs ? 'POSTS PÚBLICOS' : 'PUBLIC POSTS'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ws-metric-icon"><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/></svg>
          </div>
          <div class="ws-metric-value">0</div>
          <div class="ws-metric-desc">${isEs ? 'Posts originales de LinkedIn encontrados' : 'Original LinkedIn posts found'}</div>
        </div>

        <div class="ws-metric-card">
          <div class="ws-metric-header">
            <span class="ws-metric-label">${isEs ? 'ALCANCE DE POSTS PÚBLICOS' : 'PUBLIC POST REACH'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ws-metric-icon"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <div class="ws-metric-value">${isEs ? 'Pendiente' : 'Pending'}</div>
          <div class="ws-metric-desc">${isEs ? 'Esperando datos de posts públicos' : 'Waiting for public post data'}</div>
        </div>

        <div class="ws-metric-card">
          <div class="ws-metric-header">
            <span class="ws-metric-label">${isEs ? 'INTERACCIONES PÚBLICAS' : 'PUBLIC ENGAGEMENTS'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ws-metric-icon"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div class="ws-metric-value">0</div>
          <div class="ws-metric-desc">${isEs ? 'Reacciones, comentarios y republicaciones' : 'Reactions, comments and reposts'}</div>
        </div>

        <div class="ws-metric-card">
          <div class="ws-metric-header">
            <span class="ws-metric-label">${isEs ? 'SEGUIDORES EN LINKEDIN' : 'LINKEDIN FOLLOWERS'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ws-metric-icon"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="ws-metric-value">1,076</div>
          <div class="ws-metric-desc">${isEs ? 'Importados desde el perfil público' : 'Imported from the public profile'}</div>
        </div>
      </div>

      <!-- 2-Column Split: Recent Posts & Profile Summary -->
      <div class="ws-analytics-split">
        <!-- Left: Recent LinkedIn Posts -->
        <div class="ws-panel ws-recent-posts-panel">
          <div class="ws-panel-header">
            <div>
              <h2 class="ws-panel-title">${isEs ? 'Posts recientes de LinkedIn' : 'Recent LinkedIn posts'}</h2>
              <p class="ws-panel-sub">${isEs ? 'Abre el post original directamente en LinkedIn.' : 'Open the original post on LinkedIn.'}</p>
            </div>
          </div>
          <div class="ws-empty-state-box">
            <h3 class="ws-empty-state-title">${isEs ? 'Importación de posts públicos en curso' : 'Public post import in progress'}</h3>
            <p class="ws-empty-state-sub">${isEs ? 'Los primeros posts públicos de LinkedIn aparecerán aquí automáticamente.' : 'The first public LinkedIn posts will appear here automatically.'}</p>
          </div>
        </div>

        <!-- Right: Public Profile Summary -->
        <div class="ws-panel ws-profile-summary-panel">
          <div class="ws-panel-header">
            <div>
              <h2 class="ws-panel-title">${isEs ? 'Resumen del perfil público' : 'Public profile summary'}</h2>
              <p class="ws-panel-sub">${isEs ? 'Recopilado automáticamente de datos públicos de LinkedIn.' : 'Automatically collected from public LinkedIn data.'}</p>
            </div>
          </div>

          <div class="ws-summary-rows">
            <div class="ws-summary-row">
              <span class="ws-summary-lbl">${isEs ? 'Seguidores en LinkedIn' : 'LinkedIn followers'}</span>
              <span class="ws-summary-val">1,076</span>
            </div>
            <div class="ws-summary-line"><div class="ws-summary-line-fill" style="width: 100%;"></div></div>

            <div class="ws-summary-row">
              <span class="ws-summary-lbl">${isEs ? 'Posts públicos' : 'Public posts'}</span>
              <span class="ws-summary-val">0</span>
            </div>
            <div class="ws-summary-line"><div class="ws-summary-line-fill" style="width: 0%;"></div></div>

            <div class="ws-summary-row">
              <span class="ws-summary-lbl">${isEs ? 'Posts con datos de alcance' : 'Posts with reach data'}</span>
              <span class="ws-summary-val">0</span>
            </div>
            <div class="ws-summary-line"><div class="ws-summary-line-fill" style="width: 0%;"></div></div>

            <div class="ws-summary-row">
              <span class="ws-summary-lbl">${isEs ? 'Interacciones públicas' : 'Public engagements'}</span>
              <span class="ws-summary-val">0</span>
            </div>
            <div class="ws-summary-line"><div class="ws-summary-line-fill" style="width: 0%;"></div></div>
          </div>
        </div>
      </div>

      <!-- Bottom Info Alert Banner -->
      <div class="ws-analytics-alert">
        <div class="ws-alert-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div class="ws-alert-text">
          <strong>${isEs ? 'Los datos públicos de LinkedIn se están preparando' : 'Public LinkedIn data is being prepared'}</strong>
          <span>${isEs ? 'Naano recopila los posts públicos recientes del creador. No se requiere conexión privada a LinkedIn.' : "Naano is collecting the creator's recent public posts. No personal LinkedIn connection is required."}</span>
        </div>
        <button type="button" class="ws-alert-btn" aria-label="Toggle details">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
        </button>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// 5. Community & Leaderboard View (Exact replica of Attachment 5: recon/community-creator.png)
// -----------------------------------------------------------------------------
function renderCommunityView(isBrand, isEs) {
  // 25 top creators representing the exact Naano campaign leaderboard in the screenshot
  const leaders = [
    { rank: 1, name: 'Eric David', tag: 'Creator', reach: '197K', pct: 98, avatar: '/avatar-vincent-josse.png' },
    { rank: 2, name: 'Thomas Marouin', tag: 'Creator', reach: '176K', pct: 86, avatar: '/photo-david-zmirov.png' },
    { rank: 3, name: 'Joseph Dowd', tag: 'Creator', reach: '140K', pct: 72, avatar: '/avatar-waqar.png' },
    { rank: 4, name: 'Hanna Garcia', tag: 'Creator', reach: '105K', pct: 58, avatar: '/avatar-vincent-josse.png' },
    { rank: 5, name: 'Kevin Meyer', tag: 'Creator', reach: '82K', pct: 45, avatar: '/photo-david-zmirov.png' },
    { rank: 6, name: 'Raj Vaibhav', tag: 'Creator', reach: '45K', pct: 30, avatar: '/avatar-waqar.png' },
    { rank: 7, name: 'Theodor W. M.D.', tag: 'Creator', reach: '35K', pct: 25, avatar: '/avatar-vincent-josse.png' },
    { rank: 8, name: 'Anthony Guisenan', tag: 'Creator', reach: '40K', pct: 28, avatar: '/photo-david-zmirov.png' },
    { rank: 9, name: 'Amber Cheema', tag: 'Creator', reach: '32K', pct: 22, avatar: '/avatar-waqar.png' },
    { rank: 10, name: 'Dr. Bart Altwedel', tag: 'Creator', reach: '31K', pct: 21, avatar: '/avatar-vincent-josse.png' },
    { rank: 11, name: 'Majda Dzi', tag: 'Creator', reach: '28K', pct: 19, avatar: '/photo-david-zmirov.png' },
    { rank: 12, name: 'Kelian Trappani', tag: 'Creator', reach: '26K', pct: 18, avatar: '/avatar-waqar.png' },
    { rank: 13, name: 'Sandryn Madare', tag: 'Creator', reach: '23K', pct: 16, avatar: '/avatar-vincent-josse.png' },
    { rank: 14, name: 'Tomás Leosky', tag: 'Creator', reach: '23K', pct: 16, avatar: '/photo-david-zmirov.png' },
    { rank: 15, name: 'Guillaume charoux', tag: 'Creator', reach: '22K', pct: 15, avatar: '/avatar-waqar.png' },
    { rank: 16, name: 'Divyanshil Sharma', tag: 'Creator', reach: '20K', pct: 14, avatar: '/avatar-vincent-josse.png' },
    { rank: 17, name: 'Keon Horton', tag: 'Creator', reach: '20K', pct: 14, avatar: '/photo-david-zmirov.png' },
    { rank: 18, name: 'Nick Feline', tag: 'Creator', reach: '15K', pct: 11, avatar: '/avatar-waqar.png' },
    { rank: 19, name: 'Thibault CLEMENT', tag: 'Creator', reach: '15K', pct: 11, avatar: '/avatar-vincent-josse.png' },
    { rank: 20, name: 'Jorge Gravier', tag: 'Creator', reach: '14K', pct: 10, avatar: '/photo-david-zmirov.png' },
    { rank: 21, name: 'Vassiliou Galani', tag: 'Creator', reach: '13K', pct: 9, avatar: '/avatar-waqar.png' },
    { rank: 22, name: 'Jonathan Levy', tag: 'Creator', reach: '12K', pct: 8, avatar: '/avatar-vincent-josse.png' },
    { rank: 23, name: 'Julian Mytowt', tag: 'Creator', reach: '11K', pct: 7.5, avatar: '/photo-david-zmirov.png' },
    { rank: 24, name: 'Roberto Chapman', tag: 'Creator', reach: '10K', pct: 7, avatar: '/avatar-waqar.png' },
    { rank: 25, name: 'Lorenzo Bergomi', tag: 'Creator', reach: '9.9K', pct: 6.8, avatar: '/avatar-vincent-josse.png' }
  ];

  const rowsHtml = leaders.map((c) => {
    let rankBadgeClass = '';
    if (c.rank === 1) rankBadgeClass = 'ws-rank--gold';
    else if (c.rank === 2) rankBadgeClass = 'ws-rank--silver';
    else if (c.rank === 3) rankBadgeClass = 'ws-rank--bronze';

    return `
      <div class="ws-lb-row">
        <div class="ws-lb-rank ${rankBadgeClass}">${c.rank}</div>
        <div class="ws-lb-creator">
          <img src="${c.avatar}" alt="${c.name}" class="ws-lb-avatar" />
          <div class="ws-lb-creator-info">
            <span class="ws-lb-name">${c.name}</span>
            <span class="ws-lb-tag">${c.tag}</span>
          </div>
        </div>
        <div class="ws-lb-track">
          <div class="ws-lb-fill" style="width: ${c.pct}%;"></div>
        </div>
        <div class="ws-lb-reach">
          <span class="ws-lb-reach-num">${c.reach}</span>
          <span class="ws-lb-reach-sub">${isEs ? 'impresiones estimadas' : 'estimated reach impressions'}</span>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="ws-view-container ws-community-view">
      <div class="ws-view-header ws-view-header--with-badge">
        <div>
          <h1 class="ws-view-title">${isEs ? 'Comunidad' : 'Community'}</h1>
          <p class="ws-view-subtitle">
            ${isEs
              ? 'Aprende con otros creadores B2B, comparte lo que funciona y da visibilidad a tu identidad en Naano.'
              : 'Learn with other B2B creators, share what works and make your Naano identity visible.'}
          </p>
        </div>
        <div class="ws-header-pill">
          <span class="ws-status-dot ws-status-dot--green"></span>
          <span>${isEs ? 'Red de creadores' : 'Creator network'}</span>
        </div>
      </div>

      <!-- Top 2-Column Cards -->
      <div class="ws-community-cards-grid">
        <!-- Left: Slack Community Card -->
        <div class="ws-comm-card ws-comm-card--slack">
          <div class="ws-slack-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A"/><path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0"/><path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D"/><path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.527 2.527 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#ECB22E"/></svg>
            <div class="ws-slack-avatars">
              <img src="/avatar-waqar.png" alt="Creator" />
              <img src="/avatar-vincent-josse.png" alt="Creator" />
              <img src="/photo-david-zmirov.png" alt="Creator" />
            </div>
          </div>
          <span class="ws-comm-eyebrow">${isEs ? 'CREADORES PRIVADOS EN NAANO' : 'PRIVATE CREATORS ON NAANO'}</span>
          <h2 class="ws-comm-title">${isEs ? 'El espacio donde los creadores B2B mejoran juntos.' : 'The room where B2B creators get better together.'}</h2>
          <p class="ws-comm-sub">
            ${isEs
              ? 'Pide feedback sobre un post patrocinado, compara métricas de campañas, conoce creadores en tu idioma y ayuda a dar forma a lo próximo que construye Naano.'
              : 'Ask for feedback on a sponsored post, compare campaign benchmarks, meet creators in your language and help shape what Naano builds next.'}
          </p>

          <ul class="ws-comm-checklist">
            <li>
              <span class="ws-comm-check">✓</span>
              <span>${isEs ? 'Recibe feedback antes de publicar' : 'Get feedback before you publish'}</span>
            </li>
            <li>
              <span class="ws-comm-check">✓</span>
              <span>${isEs ? 'Descubre consejos de campaña contrastados' : 'View campaign tips that work'}</span>
            </li>
            <li>
              <span class="ws-comm-check">✓</span>
              <span>${isEs ? 'Habla directamente con el equipo de Naano' : 'Talk directly with the Naano team'}</span>
            </li>
          </ul>

          <button type="button" class="ws-btn ws-btn-secondary ws-btn--slack" id="btn-join-slack">
            <span>${isEs ? 'Unirse a la comunidad de Slack' : 'Join the Slack community'}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </button>
        </div>

        <!-- Right: Deal Link Card -->
        <div class="ws-comm-card ws-comm-card--deallink">
          <div class="ws-deallink-badge">
            <span class="ws-li-square">in</span>
            <span class="ws-deallink-eyebrow">${isEs ? 'AUMENTA TU VISIBILIDAD' : 'ELEVATE YOUR VISIBILITY'}</span>
          </div>
          <h2 class="ws-comm-title">${isEs ? 'Convierte tu perfil de LinkedIn en un Deal Link permanente' : 'Turn your LinkedIn profile into an always-on Deal Link'}</h2>
          <p class="ws-comm-sub">
            ${isEs
              ? 'Añade tu enlace personalizado de Naano a LinkedIn para que las marcas descubran tu trabajo y te propongan campañas directamente.'
              : 'Add your custom deal link to LinkedIn so brands can discover your work and pitch Naano through your profile directly.'}
          </p>

          <div class="ws-deallink-promo-pill">
            <strong>25%</strong>
            <span>${isEs ? 'de la comisión de Naano es para ti en cada campaña' : "of Naano's commission is yours on each sponsored campaign"}</span>
          </div>

          <!-- Interactive mini creator card -->
          <div class="ws-comm-card-preview">
            <div class="ws-comm-card-preview-banner">
              <div class="ws-card-in-badge">in</div>
              <div class="ws-card-brand">naano</div>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </div>
            <div class="ws-comm-card-preview-body">
              <img src="/avatar-waqar.png" alt="Waqar Ahmed" class="ws-comm-avatar" />
              <div class="ws-comm-preview-name">Waqar Ahmed</div>
              <div class="ws-comm-preview-role">Software · AI · SaaS</div>
              <div class="ws-comm-preview-stats">
                <div><strong>1.1K</strong><span>Followers</span></div>
                <div><strong>—</strong><span>Est. imp.</span></div>
                <div><strong>€30</strong><span>Chosen cost</span></div>
              </div>
            </div>
          </div>

          <button type="button" class="ws-btn ws-btn-primary ws-btn-publish-card" id="btn-publish-card">
            <span>${isEs ? 'Publicar mi tarjeta' : 'Publish my card'}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 15-6-6-6 6"/></svg>
          </button>
        </div>
      </div>

      <!-- Bottom: Naano Campaign Leaderboard -->
      <div class="ws-panel ws-leaderboard-panel">
        <div class="ws-panel-header">
          <div>
            <h2 class="ws-panel-title">${isEs ? 'Clasificación de campañas Naano' : 'Naano campaign leaderboard'}</h2>
            <p class="ws-panel-sub">
              ${isEs
                ? 'Posiciones basadas en posts patrocinados aceptados, rendimiento para socios y colaboraciones valoradas por clientes.'
                : 'Rankings based on accepted sponsored posts, partner performance, and client-rated collaborations.'}
            </p>
          </div>
          <div class="ws-panel-actions">
            <button type="button" class="ws-btn ws-btn-secondary" id="btn-invite-top">${isEs ? 'Invitar creadores top' : 'Invite top creators'}</button>
            <button type="button" class="ws-btn ws-btn-secondary" id="btn-filter-lb">${isEs ? 'Filtrar' : 'Filter'}</button>
          </div>
        </div>

        <div class="ws-leaderboard-list">
          ${rowsHtml}
        </div>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// 6. Referrals & Affiliate View (Exact replica of Attachment 4: recon/affiliate-creator.png)
// -----------------------------------------------------------------------------
function renderReferralsView(isBrand, isEs) {
  return `
    <div class="ws-view-container ws-referrals-view">
      <!-- Top Switcher Toggle Pill -->
      <div class="ws-referral-toggle-wrap">
        <div class="ws-segmented-control" role="tablist">
          <button type="button" class="ws-segment-btn is-active" id="seg-invite-brands" data-role="brands">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M16 18h.01"/></svg>
            <span>${isEs ? 'Invitar marcas' : 'Invite brands'}</span>
          </button>
          <button type="button" class="ws-segment-btn" id="seg-invite-creators" data-role="creators">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>${isEs ? 'Invitar creadores' : 'Invite creators'}</span>
          </button>
        </div>
      </div>

      <!-- Center Hero Content -->
      <div class="ws-referral-hero">
        <div class="ws-referral-badge">
          <span class="ws-status-dot ws-status-dot--blue"></span>
          <span id="ref-badge-text">${isEs ? 'Afiliación de creador · 25% durante 3 meses' : 'Creator affiliation · 25% for 3 months'}</span>
        </div>

        <h1 class="ws-referral-headline" id="ref-headline">
          ${isEs ? 'Recomienda Naano. Gana durante 3 meses.' : 'Recommend Naano. Earn for 3 months.'}
        </h1>

        <p class="ws-referral-body" id="ref-subtext">
          ${isEs
            ? "Comparte tu enlace personal con una empresa. Si se une a Naano y lanza campañas de pago, recibes el 25% de la comisión de Naano durante tres meses."
            : "Share your personal link with a company. If it joins Naano and launches paid campaigns, you receive 25% of Naano's commission for three months."}
        </p>

        <div class="ws-referral-actions">
          <button type="button" class="ws-btn-dark-pill" id="btn-copy-ref-link">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            <span>${isEs ? 'Copiar mi enlace de referido' : 'Copy my referral link'}</span>
          </button>

          <a href="javascript:void(0)" class="ws-referral-link-more" id="ref-how-it-works-link">
            <span>${isEs ? 'Ver cómo funciona' : 'See how it works'}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// 7. Opportunities & Campaign Marketplace View (Matching recon/opportunities-creator.png)
// -----------------------------------------------------------------------------
function renderOpportunitiesView(isBrand, isEs) {
  if (isBrand) {
    return `
      <div class="ws-view-container ws-opps-page">
        <div class="ws-view-header">
          <div>
            <h1 class="ws-view-title">${isEs ? 'Directorio de creadores verificados' : 'Vetted B2B Creator Directory'}</h1>
            <p class="ws-view-subtitle">${isEs ? 'Descubre y contacta con los creadores ideales para tu campaña de marca.' : 'Source and invite high-affinity B2B creators to your Atlas Marketing campaigns.'}</p>
          </div>
          <button type="button" class="ws-btn ws-btn-primary" id="btn-new-campaign-brief">${isEs ? '+ Crear nuevo brief' : '+ New campaign brief'}</button>
        </div>

        <div class="ws-opps-search-bar">
          <div class="ws-search-input-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" class="ws-search-input" placeholder="${isEs ? 'Buscar por nicho, habilidades o audiencia...' : 'Search by niche, skills, or target ICP...'}" />
          </div>
          <div class="ws-search-chips">
            <button type="button" class="ws-chip is-active">${isEs ? 'Todos' : 'All'}</button>
            <button type="button" class="ws-chip">Trades & Home Services</button>
            <button type="button" class="ws-chip">AI & DevTools</button>
            <button type="button" class="ws-chip">B2B SaaS</button>
            <button type="button" class="ws-chip">Growth Marketing</button>
          </div>
        </div>

        <div class="ws-creators-marketplace-grid">
          <div class="ws-creator-marketplace-card">
            <div class="ws-cm-top">
              <img src="/avatar-waqar.png" alt="Waqar Ahmed" class="ws-cm-avatar" />
              <div>
                <h3 class="ws-cm-name">Waqar Ahmed</h3>
                <span class="ws-cm-role">AI Full Stack Engineer · SaaS</span>
              </div>
              <span class="ws-cm-score">98% Match</span>
            </div>
            <p class="ws-cm-desc">AI Full Stack Engineer specializing in Next.js, Node.js and AI tools. Strong technical authority with engineering leaders.</p>
            <div class="ws-cm-stats">
              <div><strong>1.1K</strong><span>Followers</span></div>
              <div><strong>€30</strong><span>Per Post</span></div>
              <div><strong>Active</strong><span>Availability</span></div>
            </div>
            <div class="ws-cm-actions">
              <button type="button" class="ws-btn ws-btn-secondary" onclick="alert('Viewing creator profile')">${isEs ? 'Ver perfil' : 'View profile'}</button>
              <button type="button" class="ws-btn ws-btn-primary" onclick="alert('Invite sent to Waqar Ahmed')">${isEs ? 'Invitar a campaña' : 'Invite to campaign'}</button>
            </div>
          </div>

          <div class="ws-creator-marketplace-card">
            <div class="ws-cm-top">
              <img src="/avatar-vincent-josse.png" alt="Vincent Josse" class="ws-cm-avatar" />
              <div>
                <h3 class="ws-cm-name">Vincent Josse</h3>
                <span class="ws-cm-role">CEO, Zmirov Agency · B2B Influence</span>
              </div>
              <span class="ws-cm-score">95% Match</span>
            </div>
            <p class="ws-cm-desc">Agency leader guiding modern brands through strategic influencer acquisition and B2B pipeline generation.</p>
            <div class="ws-cm-stats">
              <div><strong>48K</strong><span>Followers</span></div>
              <div><strong>€450</strong><span>Per Post</span></div>
              <div><strong>Active</strong><span>Availability</span></div>
            </div>
            <div class="ws-cm-actions">
              <button type="button" class="ws-btn ws-btn-secondary" onclick="alert('Viewing creator profile')">${isEs ? 'Ver perfil' : 'View profile'}</button>
              <button type="button" class="ws-btn ws-btn-primary" onclick="alert('Invite sent to Vincent Josse')">${isEs ? 'Invitar a campaña' : 'Invite to campaign'}</button>
            </div>
          </div>

          <div class="ws-creator-marketplace-card">
            <div class="ws-cm-top">
              <img src="/photo-david-zmirov.png" alt="David Zmirov" class="ws-cm-avatar" />
              <div>
                <h3 class="ws-cm-name">David Zmirov</h3>
                <span class="ws-cm-role">Founder, B2B Growth Insights</span>
              </div>
              <span class="ws-cm-score">92% Match</span>
            </div>
            <p class="ws-cm-desc">Deep-dive B2B operator content for enterprise founders and demand generation teams across Europe and US.</p>
            <div class="ws-cm-stats">
              <div><strong>12.4K</strong><span>Followers</span></div>
              <div><strong>€280</strong><span>Per Post</span></div>
              <div><strong>Active</strong><span>Availability</span></div>
            </div>
            <div class="ws-cm-actions">
              <button type="button" class="ws-btn ws-btn-secondary" onclick="alert('Viewing creator profile')">${isEs ? 'Ver perfil' : 'View profile'}</button>
              <button type="button" class="ws-btn ws-btn-primary" onclick="alert('Invite sent to David Zmirov')">${isEs ? 'Invitar a campaña' : 'Invite to campaign'}</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Creator Opportunities Feed
  return `
    <div class="ws-view-container ws-opps-page">
      <div class="ws-view-header">
        <div>
          <h1 class="ws-view-title">${isEs ? 'Oportunidades de campaña' : 'Opportunities'}</h1>
          <p class="ws-view-subtitle">${isEs ? 'Campañas abiertas de marcas B2B que coinciden con tu perfil y audiencia.' : 'Open brand campaigns seeking B2B creator collaborations that match your profile.'}</p>
        </div>
      </div>

      <div class="ws-opps-search-bar">
        <div class="ws-search-input-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" class="ws-search-input" placeholder="${isEs ? 'Buscar campañas por nombre o tecnología...' : 'Search brand opportunities...'}" />
        </div>
        <div class="ws-search-chips">
          <button type="button" class="ws-chip is-active">${isEs ? 'Todas' : 'All'}</button>
          <button type="button" class="ws-chip">AI & DevTools</button>
          <button type="button" class="ws-chip">B2B SaaS</button>
          <button type="button" class="ws-chip">Productivity</button>
          <button type="button" class="ws-chip">Marketing</button>
        </div>
      </div>

      <div class="ws-campaigns-grid">
        <div class="ws-campaign-card">
          <div class="ws-camp-top">
            <div class="ws-camp-logo ws-opp-logo--pi">PI</div>
            <div class="ws-camp-meta">
              <span class="ws-camp-company">Premium Inboxes</span>
              <h3 class="ws-camp-title">Scale cold outreach infrastructure with managed Google & Microsoft inboxes</h3>
            </div>
            <span class="ws-match-pill">96% match</span>
          </div>
          <p class="ws-camp-desc">Looking for engineering, outbound sales and marketing voices to demonstrate deliverability improvements and spam prevention.</p>
          <div class="ws-camp-info-row">
            <span class="ws-camp-tag">1 LinkedIn Post</span>
            <span class="ws-camp-tag">€30 - €120</span>
            <span class="ws-camp-tag">Due in 14 days</span>
          </div>
          <div class="ws-camp-footer">
            <button type="button" class="ws-btn ws-btn-secondary" onclick="alert('Viewing Premium Inboxes brief')">${isEs ? 'Ver brief' : 'View brief'}</button>
            <button type="button" class="ws-btn ws-btn-primary" onclick="alert('Application sent to Premium Inboxes')">${isEs ? 'Solicitar' : 'Apply'}</button>
          </div>
        </div>

        <div class="ws-campaign-card">
          <div class="ws-camp-top">
            <div class="ws-camp-logo ws-opp-logo--orbi">O</div>
            <div class="ws-camp-meta">
              <span class="ws-camp-company">OrbiSearch</span>
              <h3 class="ws-camp-title">Next-generation semantic enterprise search for modern developer documentation</h3>
            </div>
            <span class="ws-match-pill">94% match</span>
          </div>
          <p class="ws-camp-desc">Targeting full-stack developers, engineering leads, and technical founders. Share your real workflow experience using AI indexing.</p>
          <div class="ws-camp-info-row">
            <span class="ws-camp-tag">1 LinkedIn Post + Carousel</span>
            <span class="ws-camp-tag">€50 - €150</span>
            <span class="ws-camp-tag">Due in 10 days</span>
          </div>
          <div class="ws-camp-footer">
            <button type="button" class="ws-btn ws-btn-secondary" onclick="alert('Viewing OrbiSearch brief')">${isEs ? 'Ver brief' : 'View brief'}</button>
            <button type="button" class="ws-btn ws-btn-primary" onclick="alert('Application sent to OrbiSearch')">${isEs ? 'Solicitar' : 'Apply'}</button>
          </div>
        </div>

        <div class="ws-campaign-card">
          <div class="ws-camp-top">
            <div class="ws-camp-logo" style="background: #0f172a; color: #fff;">B</div>
            <div class="ws-camp-meta">
              <span class="ws-camp-company">BlogSEO</span>
              <h3 class="ws-camp-title">Turn programmatic AI blogs into reliable search impressions and signups</h3>
            </div>
            <span class="ws-match-pill">91% match</span>
          </div>
          <p class="ws-camp-desc">SaaS builders and marketing engineers: share how automated content pipelines drive measurable organic trial signups.</p>
          <div class="ws-camp-info-row">
            <span class="ws-camp-tag">1 LinkedIn Post</span>
            <span class="ws-camp-tag">€40 - €100</span>
            <span class="ws-camp-tag">Due in 7 days</span>
          </div>
          <div class="ws-camp-footer">
            <button type="button" class="ws-btn ws-btn-secondary" onclick="alert('Viewing BlogSEO brief')">${isEs ? 'Ver brief' : 'View brief'}</button>
            <button type="button" class="ws-btn ws-btn-primary" onclick="alert('Application sent to BlogSEO')">${isEs ? 'Solicitar' : 'Apply'}</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// 8. Messages Hub View (Matching recon/messages-creator.png)
// -----------------------------------------------------------------------------
function renderMessagesView(isBrand, isEs) {
  return `
    <div class="ws-view-container ws-messages-view">
      <div class="ws-messages-layout">
        <!-- Left: Conversations List -->
        <div class="ws-convos-sidebar">
          <div class="ws-convos-header">
            <h2 class="ws-convos-title">${isEs ? 'Mensajes' : 'Messages'}</h2>
            <div class="ws-convos-search">
              <input type="text" placeholder="${isEs ? 'Buscar conversaciones...' : 'Search conversations...'}" class="ws-convos-input" />
            </div>
          </div>

          <div class="ws-convos-list">
            <div class="ws-convo-item is-active">
              <div class="ws-convo-avatar-wrap">
                <div class="ws-naanobot-avatar">N</div>
                <span class="ws-user-online-badge"></span>
              </div>
              <div class="ws-convo-info">
                <div class="ws-convo-top">
                  <span class="ws-convo-name">Naano Concierge</span>
                  <span class="ws-convo-time">Just now</span>
                </div>
                <p class="ws-convo-preview">${isEs ? '¡Bienvenido a Naano! Tu perfil de creador ya está activo.' : 'Welcome to Naano! Your creator profile and card are active.'}</p>
              </div>
            </div>

            <div class="ws-convo-item">
              <div class="ws-convo-avatar-wrap">
                <div class="ws-opp-logo ws-opp-logo--pi" style="width: 36px; height: 36px; font-size: 13px;">PI</div>
              </div>
              <div class="ws-convo-info">
                <div class="ws-convo-top">
                  <span class="ws-convo-name">Premium Inboxes</span>
                  <span class="ws-convo-time">2h ago</span>
                </div>
                <p class="ws-convo-preview">${isEs ? 'Hola Waqar, nos encantaría invitarte a nuestra campaña...' : 'Hey Waqar, we loved your recent post on dev architecture...'}</p>
              </div>
            </div>

            <div class="ws-convo-item">
              <div class="ws-convo-avatar-wrap">
                <img src="/avatar-vincent-josse.png" alt="Vincent Josse" style="width: 36px; height: 36px; border-radius: 50%;" />
              </div>
              <div class="ws-convo-info">
                <div class="ws-convo-top">
                  <span class="ws-convo-name">Vincent Josse</span>
                  <span class="ws-convo-time">Yesterday</span>
                </div>
                <p class="ws-convo-preview">${isEs ? 'Borrador revisado y listo para publicar el martes.' : 'Draft reviewed and scheduled for publication Tuesday.'}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Message Thread -->
        <div class="ws-thread-area">
          <div class="ws-thread-header">
            <div class="ws-thread-partner">
              <div class="ws-naanobot-avatar">N</div>
              <div>
                <div class="ws-thread-name">Naano Concierge</div>
                <div class="ws-thread-status">${isEs ? 'Asistente oficial de campaña' : 'Official Campaign Assistant · Online'}</div>
              </div>
            </div>
            <div class="ws-thread-actions">
              <button type="button" class="ws-btn ws-btn-secondary" id="btn-msg-details">${isEs ? 'Ver detalles' : 'Details'}</button>
            </div>
          </div>

          <div class="ws-thread-messages">
            <div class="ws-msg-bubble ws-msg-bubble--partner">
              <p>${isEs ? '¡Hola Waqar! Bienvenido a tu espacio de trabajo en Naano.' : 'Hello Waqar! Welcome to your Naano workspace.'}</p>
              <span class="ws-msg-time">10:00 AM</span>
            </div>
            <div class="ws-msg-bubble ws-msg-bubble--partner">
              <p>${isEs ? 'Tu perfil público y tarjeta de creador ya están listos para recibir propuestas de marcas B2B. Cuando una marca te invite o apruebe tu solicitud, podrás gestionar todo el brief y borrador desde aquí.' : 'Your creator card is ready. When a brand invites you to a collaboration or accepts your application, you can coordinate briefs, draft review, and approval right here.'}</p>
              <span class="ws-msg-time">10:01 AM</span>
            </div>
          </div>

          <div class="ws-thread-composer">
            <button type="button" class="ws-composer-attach" aria-label="Attach file">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            </button>
            <input type="text" class="ws-composer-input" placeholder="${isEs ? 'Escribe un mensaje...' : 'Type a message...'}" />
            <button type="button" class="ws-composer-send" aria-label="Send message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// -----------------------------------------------------------------------------
// 9. Full Creator Card / Storefront View (Matching recon/profile-creator.png)
// -----------------------------------------------------------------------------
function renderCardStorefrontView(isBrand, isEs) {
  return `
    <div class="ws-view-container ws-storefront-view">
      <div class="ws-view-header">
        <div>
          <h1 class="ws-view-title">${isBrand ? (isEs ? 'Perfil público de marca' : 'Brand Public Profile') : (isEs ? 'Tu tarjeta de creador pública' : 'Your Public Creator Storefront')}</h1>
          <p class="ws-view-subtitle">${isEs ? 'Esta es la vista pública que verán las marcas antes de contratarte.' : 'This is your verified public profile page as seen by B2B marketing leaders.'}</p>
        </div>
        <div class="ws-panel-actions">
          <button type="button" class="ws-btn ws-btn-secondary" id="btn-copy-card-link-2">${isEs ? 'Copiar enlace público' : 'Copy public link'}</button>
          <button type="button" class="ws-btn ws-btn-primary" id="btn-edit-profile-card">${isEs ? 'Editar perfil' : 'Edit profile'}</button>
        </div>
      </div>

      <div class="ws-storefront-center">
        <div class="ws-card-mockup" style="max-width: 520px; width: 100%; box-shadow: 0 16px 40px -8px rgba(0,0,0,0.12);">
          <div class="ws-card-banner">
            <div class="ws-card-in-badge">in</div>
            <div class="ws-card-brand">naano</div>
            <div class="ws-card-banner-right">
              <span class="ws-card-flag-badge">🇵🇰</span>
            </div>
          </div>
          <div class="ws-card-avatar-container">
            <img src="/avatar-waqar.png" alt="Waqar Ahmed" class="ws-card-avatar-img" />
          </div>
          <div class="ws-card-body">
            <h3 class="ws-card-name">Waqar Ahmed</h3>
            <div class="ws-card-tags">Software · AI · SaaS</div>
            <p class="ws-card-headline">AI Full Stack Engineer | Software Engineer | Next.js | React | Node.js | Python | Open to Work</p>
            <div class="ws-card-calendar-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>${isEs ? 'Perfil verificado · Activo en Naano' : 'Verified profile · Ready for campaigns'}</span>
            </div>
            <div class="ws-card-stats-grid">
              <div class="ws-card-stat-col"><div class="ws-card-stat-value">1.1K</div><div class="ws-card-stat-title">Followers</div></div>
              <div class="ws-card-stat-col"><div class="ws-card-stat-value">Top 15%</div><div class="ws-card-stat-title">Match Rate</div></div>
              <div class="ws-card-stat-col"><div class="ws-card-stat-value">€30</div><div class="ws-card-stat-title">Per post</div></div>
            </div>

            <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 10px;">
              <button type="button" class="ws-btn ws-btn-primary" style="width: 100%; justify-content: center; height: 42px; font-size: 14px;">
                ${isEs ? 'Contratar colaboración (€30)' : 'Book sponsored post (€30)'}
              </button>
              <p style="text-align: center; font-size: 12px; color: #64748b;">${isEs ? 'Pagos asegurados mediante Stripe y contrato estándar de Naano.' : 'Escrow secured via Stripe with standard Naano IP transfer agreement.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
