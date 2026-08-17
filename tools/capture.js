const { chromium } = require('playwright');

// Hide demo scaffolding (via CSS, so the app's own re-renders still work)
// and reword the footer, so the shots read as a real product.
const CLEAN = () => {
  if (!document.getElementById('showcase-css')) {
    const s = document.createElement('style');
    s.id = 'showcase-css';
    s.textContent = '.demobar{display:none!important}.toast,#toast{display:none!important}';
    document.head.appendChild(s);
  }
  document.querySelectorAll('span').forEach(el => {
    if (/unbranded booking system mockup/i.test(el.textContent)) {
      el.textContent = 'Linehaul — load booking for CWG Holdings';
    }
    if (/placeholder name/i.test(el.textContent)) {
      el.textContent = 'load board · south africa';
    }
  });
};

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

  async function shot(name, { width, height, dsf = 2, setup }) {
    const p = await b.newPage({ viewport: { width, height }, deviceScaleFactor: dsf });
    const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await p.goto('file:///home/user/CWG-software-/index.html');
    await p.evaluate(() => localStorage.clear());
    await p.reload();
    await p.waitForTimeout(400);
    if (setup) { await p.evaluate(setup); await p.waitForTimeout(600); }
    await p.evaluate(CLEAN);
    await p.waitForTimeout(300);
    await p.screenshot({ path: name });
    await p.close();
    console.log(name, errs.length ? 'ERRORS: ' + errs : 'ok');
  }

  await shot('raw-board.png',  { width: 1440, height: 900 });
  await shot('raw-admin.png',  { width: 1440, height: 900, setup: () => setRole('admin') });
  await shot('raw-detail.png', { width: 1440, height: 900,
    setup: () => { signInAs('TR-101'); openLoadDetail('LD-2141'); } });
  // Sort by best rate so the phone leads with an open, bookable load
  await shot('raw-mobile.png', { width: 390, height: 844, dsf: 3,
    setup: () => { signInAs('TR-102'); filters.sort = 'rate'; render(); } });

  await b.close();
})();
