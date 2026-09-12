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
        else reject(new Error('Page not found'));
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
      console.log('CDP WebSocket opened for hero testing');
      await send('Page.enable');
      await send('DOM.enable');
      await send('CSS.enable');

      // 1. Desktop: 1440 x 900
      console.log('1. Capturing Desktop Hero (1440x900)...');
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 900,
        deviceScaleFactor: 2,
        mobile: false
      });
      await send('Page.navigate', { url: 'http://localhost:5173' });
      await new Promise(r => setTimeout(r, 1200));

      let shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/hero_desktop.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved scripts/hero_desktop.png');

      // 2. Tablet: 768 x 1024
      console.log('2. Capturing Tablet Hero (768x1024)...');
      await send('Emulation.setDeviceMetricsOverride', {
        width: 768,
        height: 1024,
        deviceScaleFactor: 2,
        mobile: true
      });
      await send('Page.navigate', { url: 'http://localhost:5173' });
      await new Promise(r => setTimeout(r, 1000));

      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/hero_tablet.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved scripts/hero_tablet.png');

      // 3. Mobile: 390 x 844
      console.log('3. Capturing Mobile Hero (390x844)...');
      await send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true
      });
      await send('Page.navigate', { url: 'http://localhost:5173' });
      await new Promise(r => setTimeout(r, 1000));

      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/hero_mobile.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved scripts/hero_mobile.png');

      ws.close();
      console.log('All hero screenshots captured successfully!');
      process.exit(0);
    } catch (err) {
      console.error('Error during CDP run:', err);
      ws.close();
      process.exit(1);
    }
  };
}

run().catch(console.error);
