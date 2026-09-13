const http = require('http');
const fs = require('fs');
const path = require('path');

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const list = JSON.parse(data);
        const page = list.find(p => p.type === 'page' && p.url.includes('5173'));
        if (page) resolve(page.webSocketDebuggerUrl);
        else reject(new Error('Page not found on port 5173'));
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

      // Reload page to get fresh assets
      await send('Page.reload');
      await new Promise(r => setTimeout(r, 1200));

      // 1. Desktop: 1440 x 1000
      console.log('1. Setting desktop viewport (1440x1000)...');
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 1000,
        deviceScaleFactor: 2,
        mobile: false
      });
      await new Promise(r => setTimeout(r, 500));

      const deskRect = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          const el = document.getElementById('book-a-call');
          if (!el) return null;
          el.scrollIntoView({ behavior: 'instant', block: 'start' });
          const r = el.getBoundingClientRect();
          return {
            x: 0,
            y: r.top + window.scrollY,
            width: 1440,
            height: r.height
          };
        })()`
      });
      console.log('Desktop book section bounds:', deskRect.result.value);
      await new Promise(r => setTimeout(r, 600));

      const deskShot = await send('Page.captureScreenshot', {
        format: 'png',
        clip: {
          x: 0,
          y: Math.max(0, deskRect.result.value.y - 20),
          width: 1440,
          height: deskRect.result.value.height + 40,
          scale: 1
        }
      });
      const deskPath = '/Users/macbook/.gemini/antigravity-ide/brain/bed129c7-8853-43af-a600-be46829b7514/.tempmediaStorage/book_desktop.png';
      fs.writeFileSync(deskPath, Buffer.from(deskShot.data, 'base64'));
      console.log('Saved', deskPath);

      // 2. Mobile: 390 x 844
      console.log('2. Setting mobile viewport (390x844)...');
      await send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true
      });
      await new Promise(r => setTimeout(r, 500));

      const mobRect = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          const el = document.getElementById('book-a-call');
          if (!el) return null;
          el.scrollIntoView({ behavior: 'instant', block: 'start' });
          const r = el.getBoundingClientRect();
          return {
            x: 0,
            y: r.top + window.scrollY,
            width: 390,
            height: r.height
          };
        })()`
      });
      console.log('Mobile book section bounds:', mobRect.result.value);
      await new Promise(r => setTimeout(r, 600));

      const mobShot = await send('Page.captureScreenshot', {
        format: 'png',
        clip: {
          x: 0,
          y: Math.max(0, mobRect.result.value.y - 10),
          width: 390,
          height: mobRect.result.value.height + 20,
          scale: 1
        }
      });
      const mobPath = '/Users/macbook/.gemini/antigravity-ide/brain/bed129c7-8853-43af-a600-be46829b7514/.tempmediaStorage/book_mobile.png';
      fs.writeFileSync(mobPath, Buffer.from(mobShot.data, 'base64'));
      console.log('Saved', mobPath);

      ws.close();
      console.log('Done!');
      process.exit(0);
    } catch (err) {
      console.error('Error during CDP testing:', err);
      ws.close();
      process.exit(1);
    }
  };
}

run().catch(console.error);
