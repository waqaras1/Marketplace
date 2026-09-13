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
      console.log('CDP WebSocket opened for quote section testing');
      await send('Page.enable');
      await send('Runtime.enable');

      // 1. Desktop: 1440 x 900, scroll so quote is partially revealed
      console.log('1. Setting desktop viewport (1440x900)...');
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 900,
        deviceScaleFactor: 2,
        mobile: false
      });
      await send('Page.navigate', { url: 'http://localhost:5173' });
      await new Promise(r => setTimeout(r, 1200));

      // Scroll into partial view
      await send('Runtime.evaluate', {
        expression: `
          const quote = document.querySelector('[data-screen-label="Quote"]');
          window.scrollTo({ top: quote.offsetTop - 450, behavior: 'instant' });
          window.dispatchEvent(new Event('scroll'));
        `
      });
      await new Promise(r => setTimeout(r, 400));

      let shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/quote_partial_desktop.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved scripts/quote_partial_desktop.png');

      // Scroll so quote is fully revealed
      const fullEval = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          const quote = document.querySelector('[data-screen-label="Quote"]');
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
          window.dispatchEvent(new Event('scroll'));
          const opacities = Array.from(document.querySelectorAll('[data-qw]')).map(el => ({
            text: el.textContent.trim(),
            opacity: el.style.opacity
          }));
          return {
            scrollY: window.scrollY,
            maxScroll: document.documentElement.scrollHeight - window.innerHeight,
            scrollHeight: document.documentElement.scrollHeight,
            windowHeight: window.innerHeight,
            opacities
          };
        })()`
      });
      console.log('Full reveal metrics:', JSON.stringify(fullEval.result.value, null, 2));
      await new Promise(r => setTimeout(r, 400));

      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/quote_full_desktop.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved scripts/quote_full_desktop.png');

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
          const quote = document.querySelector('[data-screen-label="Quote"]');
          quote.scrollIntoView({ behavior: 'instant', block: 'center' });
          window.dispatchEvent(new Event('scroll'));
        `
      });
      await new Promise(r => setTimeout(r, 400));

      shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('scripts/quote_mobile.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved scripts/quote_mobile.png');

      ws.close();
      console.log('All quote screenshots captured successfully!');
      process.exit(0);
    } catch (err) {
      console.error('Error during CDP run:', err);
      ws.close();
      process.exit(1);
    }
  };
}

run().catch(console.error);
