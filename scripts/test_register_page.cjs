const http = require('http');
const fs = require('fs');

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const list = JSON.parse(data);
        const page = list.find(p => p.type === 'page' && p.url.includes('5173'));
        if (page) resolve(page.webSocketDebuggerUrl);
        else {
          const anyPage = list.find(p => p.type === 'page');
          if (anyPage) resolve(anyPage.webSocketDebuggerUrl);
          else reject(new Error('No browser page found on port 9222'));
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const wsUrl = await getWsUrl();
  console.log('Connecting to', wsUrl);

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
      console.log('CDP WebSocket opened');
      await send('Page.enable');
      await send('Runtime.enable');

      // -------------------------------------------------------------
      // 1. Brand Onboarding Flow (Image 2 Reference)
      // -------------------------------------------------------------
      console.log('1. Testing Brand Flow...');
      await send('Page.navigate', { url: 'http://localhost:5173/register.html' });
      await new Promise(r => setTimeout(r, 1000));

      await send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 900,
        deviceScaleFactor: 2,
        mobile: false
      });
      await new Promise(r => setTimeout(r, 400));

      // Click brand role
      await send('Runtime.evaluate', { expression: `document.getElementById('role-card-brand').click();` });
      await new Promise(r => setTimeout(r, 400));

      // Click OAuth button to enter Step 2 of 3
      await send('Runtime.evaluate', { expression: `document.getElementById('btn-brand-oauth-google').click();` });
      await new Promise(r => setTimeout(r, 600));

      // Capture desktop brand onboarding (Step 2 of 3)
      const brandOnboardingDesk = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/brand_onboarding_desktop.png', Buffer.from(brandOnboardingDesk.data, 'base64'));
      console.log('Saved scripts/brand_onboarding_desktop.png');

      // Capture mobile brand onboarding (Step 2 of 3)
      await send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true
      });
      await new Promise(r => setTimeout(r, 500));
      const brandOnboardingMob = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/brand_onboarding_mobile.png', Buffer.from(brandOnboardingMob.data, 'base64'));
      console.log('Saved scripts/brand_onboarding_mobile.png');

      // -------------------------------------------------------------
      // 2. Creator Flow to Workspace (Image 1 Reference)
      // -------------------------------------------------------------
      console.log('2. Testing Creator Workspace...');
      await send('Page.navigate', { url: 'http://localhost:5173/workspace.html' });
      await new Promise(r => setTimeout(r, 1200));

      // Desktop: 1440 x 900
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 900,
        deviceScaleFactor: 2,
        mobile: false
      });
      await new Promise(r => setTimeout(r, 500));

      const wsDesk = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/creator_workspace_desktop.png', Buffer.from(wsDesk.data, 'base64'));
      console.log('Saved scripts/creator_workspace_desktop.png');

      // Mobile: 390 x 844
      await send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true
      });
      await new Promise(r => setTimeout(r, 500));

      const wsMob = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/creator_workspace_mobile.png', Buffer.from(wsMob.data, 'base64'));
      console.log('Saved scripts/creator_workspace_mobile.png');

      ws.close();
      process.exit(0);
    } catch (err) {
      console.error('Error during test:', err);
      ws.close();
      process.exit(1);
    }
  };
}

run();
