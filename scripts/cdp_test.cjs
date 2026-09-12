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

  const WebSocket = require('node:events');
  // We can use native node 22 WebSocket!
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
      await send('DOM.enable');
      await send('CSS.enable');

      // 1. Mobile emulation: 390 x 844
      console.log('1. Setting mobile metrics...');
      await send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true
      });
      await send('Page.navigate', { url: 'http://localhost:5173' });
      await new Promise(r => setTimeout(r, 1000));

      let shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/verified_mobile_closed.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved scripts/verified_mobile_closed.png');

      // 2. Click burger button
      console.log('2. Clicking burger button...');
      await send('Runtime.evaluate', {
        expression: `document.getElementById('mobile-burger-btn').click()`
      });
      await new Promise(r => setTimeout(r, 500));

      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/verified_mobile_open.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved scripts/verified_mobile_open.png');

      // 3. Desktop: 1440 x 900
      console.log('3. Setting desktop metrics...');
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 900,
        deviceScaleFactor: 2,
        mobile: false
      });
      await send('Page.navigate', { url: 'http://localhost:5173' });
      await new Promise(r => setTimeout(r, 1000));

      // 4. Click Resources dropdown
      console.log('4. Clicking Resources dropdown...');
      await send('Runtime.evaluate', {
        expression: `document.getElementById('resources-trigger').click()`
      });
      await new Promise(r => setTimeout(r, 500));

      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/verified_desktop_dropdown.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved scripts/verified_desktop_dropdown.png');

      // 5. Test scroll state
      console.log('5. Scrolling down 150px...');
      await send('Runtime.evaluate', {
        expression: `window.scrollTo(0, 150)`
      });
      await new Promise(r => setTimeout(r, 500));

      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/verified_desktop_scrolled.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved scripts/verified_desktop_scrolled.png');

      ws.close();
      console.log('All CDP verification tests completed successfully!');
      process.exit(0);
    } catch (err) {
      console.error('Error during CDP run:', err);
      ws.close();
      process.exit(1);
    }
  };
}

run().catch(console.error);
