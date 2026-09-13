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
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const msgId = id++;
    callbacks[msgId] = (result, error) => error ? reject(error) : resolve(result);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  ws.onopen = async () => {
    try {
      console.log('CDP WebSocket opened for marketplace section testing');
      await send('Page.enable');
      await send('Runtime.enable');

      // 1. Desktop 1440x1200
      console.log('1. Setting desktop viewport (1440x1100)...');
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 1100,
        deviceScaleFactor: 2,
        mobile: false
      });
      await send('Page.navigate', { url: 'http://localhost:5173' });
      await new Promise(r => setTimeout(r, 1200));

      // Scroll to marketplace section
      await send('Runtime.evaluate', {
        expression: `
          const mp = document.querySelector('.lp-marketplace');
          mp.scrollIntoView({ behavior: 'instant', block: 'start' });
          window.dispatchEvent(new Event('scroll'));
        `
      });
      await new Promise(r => setTimeout(r, 500));

      let shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/marketplace_desktop.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved scripts/marketplace_desktop.png');

      // Also capture the lower signals part
      await send('Runtime.evaluate', {
        expression: `
          const signals = document.querySelector('.lp-marketplace__signals');
          signals.scrollIntoView({ behavior: 'instant', block: 'center' });
          window.dispatchEvent(new Event('scroll'));
        `
      });
      await new Promise(r => setTimeout(r, 500));

      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/marketplace_signals_desktop.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved scripts/marketplace_signals_desktop.png');

      // 2. Mobile: 390 x 844
      console.log('2. Setting mobile viewport (390x844)...');
      await send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true
      });
      await send('Runtime.evaluate', {
        expression: `
          const mp = document.querySelector('.lp-marketplace');
          window.scrollTo({ top: mp.offsetTop, behavior: 'instant' });
          window.dispatchEvent(new Event('scroll'));
        `
      });
      await new Promise(r => setTimeout(r, 500));

      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/marketplace_mobile_header.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved scripts/marketplace_mobile_header.png');

      // Scroll to signals on mobile
      await send('Runtime.evaluate', {
        expression: `
          const signals = document.querySelector('.lp-marketplace__signals');
          signals.scrollIntoView({ behavior: 'instant', block: 'start' });
          window.dispatchEvent(new Event('scroll'));
        `
      });
      await new Promise(r => setTimeout(r, 500));

      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/marketplace_mobile_signals.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved scripts/marketplace_mobile_signals.png');

      ws.close();
      console.log('All marketplace screenshots captured successfully!');
      process.exit(0);
    } catch (err) {
      console.error('Error during CDP run:', err);
      ws.close();
      process.exit(1);
    }
  };
}

run().catch(console.error);
