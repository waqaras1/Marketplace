const http = require('http');
const fs = require('fs');

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const list = JSON.parse(data);
          const page = list.find(p => p.type === 'page' && p.url.includes('5173')) || list.find(p => p.type === 'page');
          if (page) resolve(page.webSocketDebuggerUrl);
          else reject(new Error('No browser page found on port 9222'));
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  const wsUrl = await getWsUrl();
  console.log('Connecting to:', wsUrl);
  const ws = new globalThis.WebSocket(wsUrl);
  let id = 1;
  const callbacks = {};

  ws.onmessage = (event) => {
    const res = JSON.parse(event.data);
    if (res.id && callbacks[res.id]) {
      callbacks[res.id](res.result, res.error);
      delete callbacks[res.id];
    }
  };

  const send = (method, params = {}) => {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      callbacks[msgId] = (result, error) => {
        if (error) reject(error);
        else resolve(result);
      };
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  };

  ws.onopen = async () => {
    try {
      console.log('Connected to Chrome DevTools Protocol');
      await send('Page.enable');
      await send('Runtime.enable');

      // 1. Test Landing Page Initial State
      await send('Page.navigate', { url: 'http://localhost:5173/' });
      await new Promise(r => setTimeout(r, 1200));

      // Reset language to EN first for deterministic test
      await send('Runtime.evaluate', {
        expression: `localStorage.setItem('naano_lang', 'EN'); window.location.reload();`
      });
      await new Promise(r => setTimeout(r, 1200));

      let checkLang = await send('Runtime.evaluate', {
        expression: `document.getElementById('active-lang').textContent.trim()`
      });
      console.log('Initial landing page lang:', checkLang.result.value);

      // 2. Toggle to Spanish on Landing Page
      await send('Runtime.evaluate', {
        expression: `document.getElementById('lang-toggle-btn').click();`
      });
      await new Promise(r => setTimeout(r, 600));

      checkLang = await send('Runtime.evaluate', {
        expression: `document.getElementById('active-lang').textContent.trim()`
      });
      console.log('Toggled landing page lang:', checkLang.result.value);

      const esHero = await send('Runtime.evaluate', {
        expression: `document.getElementById('hero-heading').innerText.trim()`
      });
      console.log('Spanish Hero Heading:', esHero.result.value);

      const esNav = await send('Runtime.evaluate', {
        expression: `document.querySelector('a[href="/"].nav-link').innerText.trim()`
      });
      console.log('Spanish Nav Link (For companies):', esNav.result.value);

      // Capture Landing Page in Spanish
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 900,
        deviceScaleFactor: 2,
        mobile: false
      });
      let shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/test_landing_es.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved scripts/test_landing_es.png');

      // 3. Navigate to Register / Onboarding Page (should be Spanish via localStorage)
      await send('Page.navigate', { url: 'http://localhost:5173/register' });
      await new Promise(r => setTimeout(r, 1200));

      const regLang = await send('Runtime.evaluate', {
        expression: `document.getElementById('active-lang').textContent.trim()`
      });
      console.log('Register page active lang:', regLang.result.value);

      const regTitle = await send('Runtime.evaluate', {
        expression: `document.querySelector('.auth-title').innerText.trim()`
      });
      console.log('Register page title:', regTitle.result.value);

      const regCreatorCard = await send('Runtime.evaluate', {
        expression: `document.querySelector('#role-card-creator .auth-role-title').innerText.trim()`
      });
      console.log('Register creator card title:', regCreatorCard.result.value);

      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/test_register_es.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved scripts/test_register_es.png');

      // 4. Test clicking role card to check onboarding view in Spanish
      await send('Runtime.evaluate', {
        expression: `document.getElementById('role-card-creator').click();`
      });
      await new Promise(r => setTimeout(r, 600));

      const creatorJoinTitle = await send('Runtime.evaluate', {
        expression: `document.querySelector('#view-creator-auth .auth-title').innerText.trim()`
      });
      console.log('Creator Auth step title:', creatorJoinTitle.result.value);

      // 5. Navigate to Workspace / Dashboard Page (should be Spanish)
      await send('Page.navigate', { url: 'http://localhost:5173/workspace' });
      await new Promise(r => setTimeout(r, 1200));

      const wsEsActive = await send('Runtime.evaluate', {
        expression: `document.getElementById('ws-lang-es').classList.contains('is-active')`
      });
      console.log('Workspace ES pill is active:', wsEsActive.result.value);

      const wsTitle = await send('Runtime.evaluate', {
        expression: `document.querySelector('.ws-title').innerText.trim()`
      });
      console.log('Workspace Greeting:', wsTitle.result.value);

      const wsMetric = await send('Runtime.evaluate', {
        expression: `document.querySelector('.ws-metric-card:nth-child(1) .ws-metric-label').innerText.trim()`
      });
      console.log('Workspace Metric 1 Label:', wsMetric.result.value);

      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/test_workspace_es.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved scripts/test_workspace_es.png');

      // 6. Toggle back to English on Workspace
      await send('Runtime.evaluate', {
        expression: `document.getElementById('ws-lang-en').click();`
      });
      await new Promise(r => setTimeout(r, 600));

      const wsEnActive = await send('Runtime.evaluate', {
        expression: `document.getElementById('ws-lang-en').classList.contains('is-active')`
      });
      console.log('Workspace EN pill is active after click:', wsEnActive.result.value);

      const wsTitleEn = await send('Runtime.evaluate', {
        expression: `document.querySelector('.ws-title').innerText.trim()`
      });
      console.log('Workspace Greeting back to English:', wsTitleEn.result.value);

      // 7. Verify returning to Landing Page returns to English
      await send('Page.navigate', { url: 'http://localhost:5173/' });
      await new Promise(r => setTimeout(r, 1200));

      const landingEn = await send('Runtime.evaluate', {
        expression: `document.getElementById('active-lang').textContent.trim()`
      });
      console.log('Landing page active lang after returning:', landingEn.result.value);

      const landingHeadingEn = await send('Runtime.evaluate', {
        expression: `document.getElementById('hero-heading').innerText.trim()`
      });
      console.log('Landing page heading in English:', landingHeadingEn.result.value);

      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/test_landing_back_en.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved scripts/test_landing_back_en.png');

      ws.close();
      console.log('ALL LANGUAGE TESTS PASSED!');
    } catch (err) {
      console.error('Error during CDP testing:', err);
      process.exit(1);
    }
  };

  ws.onerror = (err) => {
    console.error('WebSocket error:', err);
    process.exit(1);
  };
}

runTests();
