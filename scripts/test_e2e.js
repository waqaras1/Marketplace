// Comprehensive E2E QA Test Script for Naano Clone via Chrome DevTools Protocol
import http from 'http';

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const pages = JSON.parse(data);
        resolve(pages[0].webSocketDebuggerUrl);
      });
    }).on('error', reject);
  });
}

async function run() {
  const wsUrl = await getWsUrl();
  console.log('Connecting to Chrome CDP at:', wsUrl);
  const ws = new WebSocket(wsUrl);

  let id = 1;
  const callbacks = new Map();
  const consoleErrors = [];

  ws.onmessage = (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      if (msg.params.type === 'error') {
        consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
      }
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      consoleErrors.push(msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception?.description || ''));
    }
    if (msg.id && callbacks.has(msg.id)) {
      callbacks.get(msg.id)(msg.result);
      callbacks.delete(msg.id);
    }
  };

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      callbacks.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await new Promise(r => ws.onopen = r);
  await send('Runtime.enable');
  await send('Page.enable');

  async function evaluate(expression) {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    return res.result?.value;
  }

  async function navigate(url) {
    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 800));
  }

  console.log('\n--- 1. Testing Landing Page (http://localhost:5173/) ---');
  await navigate('http://localhost:5173/');

  // Check title
  const title = await evaluate('document.title');
  console.log('Page Title:', title);

  // Check language toggle
  const initialLang = await evaluate('document.getElementById("active-lang")?.textContent');
  console.log('Initial Lang:', initialLang);
  await evaluate('document.getElementById("lang-toggle-btn")?.click()');
  await new Promise(r => setTimeout(r, 200));
  const newLang = await evaluate('document.getElementById("active-lang")?.textContent');
  console.log('After toggle Lang:', newLang);
  // Toggle back to EN
  await evaluate('document.getElementById("lang-toggle-btn")?.click()');
  await new Promise(r => setTimeout(r, 200));

  // Check FAQ accordions
  const faqOpenBefore = await evaluate('document.querySelectorAll(".lp-faq-item.is-open").length');
  await evaluate('document.querySelectorAll(".lp-faq-trigger")[0]?.click()');
  const faqOpenAfter = await evaluate('document.querySelectorAll(".lp-faq-item.is-open").length');
  console.log('FAQ accordion toggling:', { before: faqOpenBefore, after: faqOpenAfter });

  // Check Booking modal from main button
  await evaluate('document.getElementById("btn-open-booking-modal")?.click()');
  await new Promise(r => setTimeout(r, 300));
  const modalActive1 = await evaluate('document.getElementById("booking-modal-overlay")?.classList.contains("is-active")');
  console.log('Booking modal opens on main button click:', modalActive1);
  await evaluate('document.getElementById("btn-close-booking-modal")?.click()');
  await new Promise(r => setTimeout(r, 200));

  // Check Booking modal from Pricing card CTA
  await evaluate('document.querySelector(".lp-pricing-card__btn")?.click()');
  await new Promise(r => setTimeout(r, 300));
  const modalActive2 = await evaluate('document.getElementById("booking-modal-overlay")?.classList.contains("is-active")');
  console.log('Booking modal opens on pricing button click:', modalActive2);
  await evaluate('document.getElementById("btn-close-booking-modal")?.click()');
  await new Promise(r => setTimeout(r, 200));

  // Check Booking modal from FAQ callout link
  await evaluate('document.querySelector(".lp-faq-callout-link")?.click()');
  await new Promise(r => setTimeout(r, 300));
  const modalActive3 = await evaluate('document.getElementById("booking-modal-overlay")?.classList.contains("is-active")');
  console.log('Booking modal opens on FAQ callout link click:', modalActive3);
  await evaluate('document.getElementById("btn-close-booking-modal")?.click()');
  await new Promise(r => setTimeout(r, 200));

  console.log('\n--- 2. Testing Register Page (http://localhost:5173/register) ---');
  await navigate('http://localhost:5173/register');
  const regRoleActive = await evaluate('document.getElementById("view-role-select")?.classList.contains("is-active")');
  console.log('Role selection view active:', regRoleActive);

  // Test Creator Flow: Click Role Card -> Step 1 -> Auth -> Step 2 Profile
  await evaluate('document.getElementById("role-card-creator")?.click()');
  await new Promise(r => setTimeout(r, 300));
  const creatorAuthActive = await evaluate('document.getElementById("view-creator-auth")?.classList.contains("is-active")');
  console.log('Creator Auth view active:', creatorAuthActive);

  await evaluate('document.getElementById("btn-creator-oauth-linkedin")?.click()');
  await new Promise(r => setTimeout(r, 300));
  const creatorProfileActive = await evaluate('document.getElementById("view-creator-profile")?.classList.contains("is-active")');
  console.log('Creator Profile view active:', creatorProfileActive);

  // Test Brand Flow: Back to role selection -> Select Brand -> Step 1 Auth -> Step 2 Onboarding -> Step 3 Matching
  await evaluate('document.getElementById("back-from-creator-profile")?.click()');
  await new Promise(r => setTimeout(r, 200));
  await evaluate('document.getElementById("back-from-creator-auth")?.click()');
  await new Promise(r => setTimeout(r, 200));

  await evaluate('document.getElementById("role-card-brand")?.click()');
  await new Promise(r => setTimeout(r, 300));
  const brandAuthActive = await evaluate('document.getElementById("view-brand-auth")?.classList.contains("is-active")');
  console.log('Brand Auth view active:', brandAuthActive);

  await evaluate('document.getElementById("btn-brand-oauth-google")?.click()');
  await new Promise(r => setTimeout(r, 300));
  const brandOnboardingActive = await evaluate('document.getElementById("view-brand-onboarding")?.classList.contains("is-active")');
  console.log('Brand Onboarding view active:', brandOnboardingActive);

  await evaluate('document.getElementById("btn-continue-ai-matching")?.click()');
  await new Promise(r => setTimeout(r, 300));
  const brandMatchingActive = await evaluate('document.getElementById("view-brand-matching")?.classList.contains("is-active")');
  const brandDashHref = await evaluate('document.getElementById("btn-brand-dashboard")?.getAttribute("href")');
  console.log('Brand Matching view active:', brandMatchingActive, 'Launch link:', brandDashHref);

  console.log('\n--- 3. Testing Login Page (http://localhost:5173/login?reauth=1) ---');
  await navigate('http://localhost:5173/login?reauth=1');
  const creatorLoginVisible = await evaluate('getComputedStyle(document.getElementById("login-view-creator")).opacity === "1"');
  console.log('Creator login view visible:', creatorLoginVisible);

  await evaluate('document.getElementById("tab-login-brand")?.click()');
  await new Promise(r => setTimeout(r, 300));
  const brandLoginVisible = await evaluate('getComputedStyle(document.getElementById("login-view-brand")).opacity === "1"');
  const brandRightVisible = await evaluate('getComputedStyle(document.getElementById("right-login-brand")).opacity === "1"');
  const loginSignupNote = await evaluate('document.getElementById("login-signup-note")?.innerText');
  console.log('Brand login view visible:', brandLoginVisible, 'Right card visible:', brandRightVisible);
  console.log('Bottom prompt text:', loginSignupNote);

  console.log('\n--- 4. Testing Workspace Views (Creator & Brand) ---');
  await navigate('http://localhost:5173/workspace');

  const viewsToTest = [
    'overview',
    'opportunities',
    'card',
    'collaborations',
    'analytics',
    'community',
    'earnings',
    'referrals',
    'messages'
  ];

  for (const v of viewsToTest) {
    await evaluate(`document.querySelector('.ws-nav-item[data-view="${v}"]')?.click()`);
    await new Promise(r => setTimeout(r, 200));
    const titleText = await evaluate('document.querySelector(".ws-title, .ws-page-title, h1")?.textContent?.trim()');
    console.log(`Creator View [${v}]:`, titleText ? `✓ ${titleText.slice(0, 40)}` : '✗ Missing Title');
  }

  // Switch to Brand Mode
  console.log('\n--- Switching to Brand Mode in Workspace ---');
  await evaluate('document.getElementById("ws-mode-brand")?.click()');
  await new Promise(r => setTimeout(r, 300));
  const isBrandActive = await evaluate('document.getElementById("ws-mode-brand")?.classList.contains("is-active")');
  console.log('Brand mode active pill:', isBrandActive);

  for (const v of viewsToTest) {
    await evaluate(`document.querySelector('.ws-nav-item[data-view="${v}"]')?.click()`);
    await new Promise(r => setTimeout(r, 200));
    const titleText = await evaluate('document.querySelector(".ws-title, .ws-page-title, h1")?.textContent?.trim()');
    console.log(`Brand View [${v}]:`, titleText ? `✓ ${titleText.slice(0, 40)}` : '✗ Missing Title');
  }

  console.log('\n--- 5. Console Errors Check ---');
  if (consoleErrors.length === 0) {
    console.log('✓ ZERO console errors recorded across all tested pages and flows!');
  } else {
    console.log('Console errors encountered:', consoleErrors);
  }

  ws.close();
  process.exit(consoleErrors.length > 0 ? 1 : 0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
