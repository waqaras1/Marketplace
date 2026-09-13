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
          // Fallback to any page
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

      // Navigate to register.html
      console.log('Navigating to http://localhost:5173/register.html...');
      await send('Page.navigate', { url: 'http://localhost:5173/register.html' });
      await new Promise(r => setTimeout(r, 1200));

      // 1. Desktop: 1440 x 900
      console.log('1. Setting desktop viewport (1440x900)...');
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 900,
        deviceScaleFactor: 2,
        mobile: false
      });
      await new Promise(r => setTimeout(r, 500));

      // Capture desktop role selection
      const deskShot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/register_desktop_role_select.png', Buffer.from(deskShot.data, 'base64'));
      console.log('Saved scripts/register_desktop_role_select.png');

      // 2. Mobile: 390 x 844
      console.log('2. Setting mobile viewport (390x844)...');
      await send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true
      });
      await new Promise(r => setTimeout(r, 500));

      const mobShot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/register_mobile_role_select.png', Buffer.from(mobShot.data, 'base64'));
      console.log('Saved scripts/register_mobile_role_select.png');

      // 3. Switch back to Desktop and trigger Creator flow
      console.log('3. Triggering Creator Flow (desktop)...');
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 900,
        deviceScaleFactor: 2,
        mobile: false
      });
      await send('Runtime.evaluate', {
        expression: `document.getElementById('role-card-creator').click();`
      });
      await new Promise(r => setTimeout(r, 600));

      const creatorShot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/register_creator_flow.png', Buffer.from(creatorShot.data, 'base64'));
      console.log('Saved scripts/register_creator_flow.png');

      // 4. Trigger Brand flow
      console.log('4. Triggering Brand Flow (desktop)...');
      await send('Runtime.evaluate', {
        expression: `
          document.getElementById('back-from-creator').click();
          setTimeout(() => {
            document.getElementById('role-card-brand').click();
          }, 300);
        `
      });
      await new Promise(r => setTimeout(r, 800));

      const brandShot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/register_brand_flow.png', Buffer.from(brandShot.data, 'base64'));
      console.log('Saved scripts/register_brand_flow.png');

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
