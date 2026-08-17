const { chromium } = require('playwright');
const fs = require('fs');

const CSS = `
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:100%;height:100%}
  body{
    font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;
    background:
      radial-gradient(100% 100% at 78% 88%, rgba(185,127,14,.09) 0%, rgba(185,127,14,0) 62%),
      linear-gradient(155deg, #F7F7F4 0%, #EAEAE4 100%);
    display:flex;align-items:center;justify-content:center;
  }
  /* browser window */
  .win{
    background:#fff;border-radius:13px;overflow:hidden;
    box-shadow:0 2px 4px rgba(20,20,16,.06), 0 30px 70px -12px rgba(20,20,16,.34);
  }
  .bar{
    height:34px;background:#F0F0EC;border-bottom:1px solid #E1E1DC;
    display:flex;align-items:center;gap:7px;padding:0 13px;
  }
  .dot{width:9px;height:9px;border-radius:99px;background:#D2D2CB;flex:none}
  .url{
    margin-left:9px;flex:1;max-width:290px;height:20px;background:#fff;
    border:1px solid #E4E4DE;border-radius:99px;
    font-family:ui-monospace,Menlo,Consolas,monospace;font-size:10.5px;color:#8A8A82;
    display:flex;align-items:center;justify-content:center;letter-spacing:.02em;
  }
  .win img{display:block;width:100%}
  /* phone */
  .phone{
    background:#111;border-radius:38px;padding:9px;flex:none;position:relative;
    box-shadow:0 2px 4px rgba(20,20,16,.08), 0 26px 56px -10px rgba(20,20,16,.4);
  }
  .screen{border-radius:30px;overflow:hidden;background:#fff;position:relative}
  .screen img{display:block;width:100%}
`;

const page = (body, extra = '') =>
  `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${CSS}${extra}</style></head><body>${body}</body></html>`;

const win = (img, w) =>
  `<div class="win" style="width:${w}px">
     <div class="bar"><span class="dot"></span><span class="dot"></span><span class="dot"></span>
       <div class="url">book.cwgholdings.net</div></div>
     <img src="${img}">
   </div>`;

const phone = (img, w) =>
  `<div class="phone" style="width:${w}px">
     <div class="screen"><img src="${img}"></div>
   </div>`;

const SHOTS = [
  { out:'showcase-hero.png', w:1200, h:670,
    body:`<div style="position:relative;width:1070px;height:560px">
            <div style="position:absolute;left:0;top:0;">${win('raw-board.png', 820)}</div>
            <div style="position:absolute;right:0;bottom:6px;">${phone('raw-mobile.png', 224)}</div>
          </div>` },
  { out:'showcase-board.png',  w:1120, h:770, body:win('raw-board.png', 980) },
  { out:'showcase-admin.png',  w:1120, h:770, body:win('raw-admin.png', 980) },
  { out:'showcase-booking.png',w:1120, h:770, body:win('raw-detail.png', 980) },
  { out:'showcase-mobile.png', w:620,  h:840, body:phone('raw-mobile.png', 340) },
];

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const s of SHOTS) {
    fs.writeFileSync('_c.html', page(s.body));
    const p = await b.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 2 });
    await p.goto('file:///tmp/claude-0/-home-user-CWG-software-/2c0ffccf-b765-5ab5-b86e-7dfec3ee25eb/scratchpad/_c.html');
    await p.waitForTimeout(500);
    await p.screenshot({ path: s.out });
    await p.close();
    const kb = (fs.statSync(s.out).size / 1024).toFixed(0);
    console.log(`${s.out}  ${s.w*2}x${s.h*2}  ${kb} KB`);
  }
  fs.unlinkSync('_c.html');
  await b.close();
})();
