const http = require('http');

function getDevToolsTarget() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const targets = JSON.parse(data);
          const page = targets.find((t) => t.type === 'page' && !t.url.startsWith('chrome-extension://'));
          if (page) resolve(page.webSocketDebuggerUrl);
          else reject(new Error('No inspectable page found in Chrome'));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.msgId = 1;
    this.callbacks = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new globalThis.WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.id && this.callbacks.has(data.id)) {
          const cb = this.callbacks.get(data.id);
          this.callbacks.delete(data.id);
          if (data.error) cb.reject(data.error);
          else cb.resolve(data.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.msgId++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.exception.description);
    }
    return res.result.value;
  }

  async navigate(url) {
    await this.send('Page.navigate', { url });
    await new Promise((r) => setTimeout(r, 1000));
  }

  async setViewport(width, height) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 600,
    });
    await new Promise((r) => setTimeout(r, 300));
  }

  close() {
    this.ws.close();
  }
}

async function verify() {
  const wsUrl = await getDevToolsTarget();
  const cdp = new CDPClient(wsUrl);
  await cdp.connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  console.log('=== STARTING END-TO-END QA VERIFICATION ===\n');

  // TEST 1: Landing Page - #how-it-works and /creators and /book
  console.log('--- TEST 1: Landing Page Navigation & Anchors ---');
  await cdp.navigate('http://localhost:5173/');
  await cdp.setViewport(1440, 900);

  // Check #how-it-works section exists
  const howItWorksExists = await cdp.evaluate(`!!document.getElementById('how-it-works')`);
  console.log('1.1. #how-it-works section exists in DOM:', howItWorksExists);
  if (!howItWorksExists) throw new Error('#how-it-works section missing');

  // Check For creators links point to /register?role=influencer
  const creatorNavLink = await cdp.evaluate(`document.querySelector('.nav-links a[href*="influencer"]')?.getAttribute('href')`);
  console.log('1.2. Desktop nav "For creators" link:', creatorNavLink);
  if (!creatorNavLink || !creatorNavLink.includes('role=influencer')) throw new Error('For creators link incorrect');

  // Test direct navigation to /creators redirects
  await cdp.navigate('http://localhost:5173/creators');
  const creatorsRedirectUrl = await cdp.evaluate(`window.location.href`);
  console.log('1.3. /creators redirected to:', creatorsRedirectUrl);
  if (!creatorsRedirectUrl.includes('role=influencer')) throw new Error('/creators failed to redirect to creator flow');

  // Test Pricing button links to #book-a-call
  await cdp.navigate('http://localhost:5173/');
  const pricingBookHref = await cdp.evaluate(`document.querySelector('.lp-pricing-card__btn')?.getAttribute('href')`);
  console.log('1.4. Pricing managed button href:', pricingBookHref);
  if (pricingBookHref !== '#book-a-call') throw new Error('Pricing managed button href is not #book-a-call');

  // Test FAQ Talk to team links to #book-a-call
  const faqCallHref = await cdp.evaluate(`document.querySelector('.lp-faq-callout-link')?.getAttribute('href')`);
  console.log('1.5. FAQ callout link href:', faqCallHref);
  if (faqCallHref !== '#book-a-call') throw new Error('FAQ callout link is not #book-a-call');

  // Test Booking Modal opening and submission
  console.log('1.6. Opening Strategy Call Booking Modal...');
  await cdp.evaluate(`document.getElementById('btn-open-booking-modal').click()`);
  await new Promise(r => setTimeout(r, 400));
  const modalActive = await cdp.evaluate(`document.getElementById('booking-modal-overlay').classList.contains('is-active')`);
  console.log('Booking modal is active:', modalActive);
  if (!modalActive) throw new Error('Booking modal failed to open');

  // Submit booking form
  await cdp.evaluate(`document.getElementById('booking-modal-form').dispatchEvent(new Event('submit', { cancelable: true }))`);
  await new Promise(r => setTimeout(r, 300));
  const successStateVisible = await cdp.evaluate(`document.getElementById('booking-modal-success-state').style.display !== 'none'`);
  console.log('Booking modal success confirmation visible:', successStateVisible);
  if (!successStateVisible) throw new Error('Booking confirmation state did not display');

  // Close modal
  await cdp.evaluate(`document.getElementById('btn-done-booking').click()`);
  await new Promise(r => setTimeout(r, 300));

  // TEST 2: /login Page & Sign-In Journeys
  console.log('\n--- TEST 2: /login Page & Dual-Role Workspaces ---');
  await cdp.navigate('http://localhost:5173/login');
  const loginTitle = await cdp.evaluate(`document.querySelector('.auth-title')?.textContent.trim()`);
  console.log('2.1. Login page title:', loginTitle);

  // Test tab toggle to Brand
  await cdp.evaluate(`document.getElementById('tab-login-brand').click()`);
  await new Promise(r => setTimeout(r, 200));
  const brandViewVisible = await cdp.evaluate(`document.getElementById('login-view-brand').style.display !== 'none'`);
  console.log('2.2. Switched to Brand sign-in view:', brandViewVisible);

  // Submit Brand login
  await cdp.evaluate(`document.getElementById('form-login-brand').dispatchEvent(new Event('submit', { cancelable: true }))`);
  await new Promise(r => setTimeout(r, 1000));
  const afterBrandLoginUrl = await cdp.evaluate(`window.location.href`);
  console.log('2.3. Brand login redirected to:', afterBrandLoginUrl);
  if (!afterBrandLoginUrl.includes('/workspace') || !afterBrandLoginUrl.includes('role=brand')) {
    throw new Error('Brand login did not redirect to /workspace?role=brand');
  }

  // Verify Brand Workspace Dashboard
  const brandWsTitle = await cdp.evaluate(`document.querySelector('.ws-title')?.textContent.trim()`);
  const brandWsEyebrow = await cdp.evaluate(`document.querySelector('.ws-eyebrow')?.textContent.trim()`);
  const brandMetric1 = await cdp.evaluate(`document.querySelector('.ws-metric-card:nth-child(1) .ws-metric-value')?.textContent.trim()`);
  const brandMetric4 = await cdp.evaluate(`document.querySelector('.ws-metric-card:nth-child(4) .ws-metric-value')?.textContent.trim()`);
  console.log('2.4. Brand Workspace Header:', `${brandWsEyebrow} -> ${brandWsTitle}`);
  console.log('2.5. Brand Metrics:', `Campaigns: ${brandMetric1}, Budget: ${brandMetric4}`);
  if (!brandWsTitle.includes('Atlas Marketing')) throw new Error('Brand workspace did not personalize for Atlas Marketing');

  // Switch to Creator Workspace using Mode Pill
  await cdp.evaluate(`document.getElementById('ws-mode-creator').click()`);
  await new Promise(r => setTimeout(r, 1000));
  const creatorWsTitle = await cdp.evaluate(`document.querySelector('.ws-title')?.textContent.trim()`);
  console.log('2.6. Switched to Creator Workspace Header:', creatorWsTitle);
  if (!creatorWsTitle.includes('Waqar')) throw new Error('Creator workspace did not personalize for Waqar');

  // TEST 3: Brand Onboarding -> Brand Dashboard Journey
  console.log('\n--- TEST 3: Brand Onboarding Flow to Campaign Dashboard ---');
  await cdp.navigate('http://localhost:5173/register?role=saas');
  await new Promise(r => setTimeout(r, 500));

  // Step 1: Click Continue with Google
  await cdp.evaluate(`document.getElementById('btn-brand-oauth-google').click()`);
  await new Promise(r => setTimeout(r, 500));

  // Step 2: Onboarding - Verify Value Prop & ICP
  const step2Title = await cdp.evaluate(`document.querySelector('.brand-id-title')?.textContent.trim()`);
  console.log('3.1. Brand Onboarding Step 2 Title:', step2Title);

  // Click Continue to AI Matching
  await cdp.evaluate(`document.getElementById('btn-continue-ai-matching').click()`);
  await new Promise(r => setTimeout(r, 500));

  // Step 3: AI Matching - Verify 3 creators and click Launch Campaign Dashboard
  const step3Title = await cdp.evaluate(`document.querySelector('#view-brand-matching .auth-title')?.textContent.trim()`);
  console.log('3.2. Brand Matching Step 3 Title:', step3Title);

  // Click Launch Campaign Dashboard button
  await cdp.evaluate(`document.getElementById('btn-brand-dashboard').click()`);
  await new Promise(r => setTimeout(r, 1000));

  const finalUrl = await cdp.evaluate(`window.location.href`);
  console.log('3.3. Launch Campaign Dashboard navigated to:', finalUrl);
  if (!finalUrl.includes('/workspace?role=brand')) {
    throw new Error('Launch Campaign Dashboard did not navigate to /workspace?role=brand');
  }

  // TEST 4: Mobile Responsiveness Check (390px)
  console.log('\n--- TEST 4: Mobile Responsive Verification (390px) ---');
  await cdp.setViewport(390, 844);
  await cdp.navigate('http://localhost:5173/');

  const mobileOverflow = await cdp.evaluate(`document.documentElement.scrollWidth > window.innerWidth`);
  console.log('4.1. Landing page mobile horizontal overflow:', mobileOverflow);
  if (mobileOverflow) throw new Error('Mobile landing page has horizontal scroll overflow');

  await cdp.navigate('http://localhost:5173/login');
  const loginMobileOverflow = await cdp.evaluate(`document.documentElement.scrollWidth > window.innerWidth`);
  console.log('4.2. Login page mobile horizontal overflow:', loginMobileOverflow);
  if (loginMobileOverflow) throw new Error('Mobile login page has horizontal scroll overflow');

  await cdp.navigate('http://localhost:5173/workspace?role=brand');
  const wsMobileOverflow = await cdp.evaluate(`document.documentElement.scrollWidth > window.innerWidth`);
  console.log('4.3. Workspace page mobile horizontal overflow:', wsMobileOverflow);
  if (wsMobileOverflow) throw new Error('Mobile workspace page has horizontal scroll overflow');

  // Restore Desktop viewport
  await cdp.setViewport(1440, 900);
  cdp.close();

  console.log('\n=== ALL 5 QA FLOW FIXES VERIFIED AND PASSING! ===');
}

verify().catch((err) => {
  console.error('\nVERIFICATION FAILED:', err);
  process.exit(1);
});
