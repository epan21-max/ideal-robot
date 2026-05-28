const ROAST_MESSAGES = [
  "Wah wah wah... Ketauan ya mau ngintip-ngintip? 🔍",
  "Halo tukang inspect! Mau nyuri kode orang? Bikin sendiri dong!",
  "DevTools dibuka = Ketauan gabut. Sana ngoding sendiri!",
  "Inspect apaan sih? Mending belajar React dari nol aja sono.",
  "Kamu pikir bisa copy-paste terus jadi developer? Think again.",
  "Eh, yang buka DevTools! Iya kamu! Malu dong sama laptop kamu.",
  "Source code bukan harta karun. Close DevTools-nya, sana!",
  "Ngapain inspect? Mau refactor? Kirim PR aja ke GitHub.",
  "Console.log('Kamu ketauan!') — salam dari EpanDStream.",
  "Bro, ini bukan CTF challenge. Close inspect-nya.",
];

function getRandomRoast() {
  return ROAST_MESSAGES[Math.floor(Math.random() * ROAST_MESSAGES.length)];
}

let overlayEl: HTMLDivElement | null = null;

function showBlockOverlay() {
  if (overlayEl) return;
  overlayEl = document.createElement('div');
  overlayEl.id = 'devtools-block-overlay';
  overlayEl.innerHTML = `
    <div style="
      position:fixed;inset:0;z-index:99999;
      background:#0F0F1A;
      display:flex;align-items:center;justify-content:center;
      font-family:'Space Grotesk',sans-serif;
    ">
      <div style="
        max-width:420px;padding:32px;margin:16px;
        border:3px solid #000;
        box-shadow:6px 6px 0 #000;
        background:#1A1A2E;
        text-align:center;
      ">
        <div style="
          width:64px;height:64px;margin:0 auto 16px;
          border:3px solid #000;box-shadow:4px 4px 0 #000;
          background:#F56565;
          display:flex;align-items:center;justify-content:center;
          font-size:28px;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </div>
        <h1 style="
          font-size:24px;font-weight:700;color:#F56565;
          margin-bottom:8px;letter-spacing:-0.5px;
        ">AKSES DITOLAK!</h1>
        <p style="
          font-family:'Space Mono',monospace;font-size:11px;
          color:#A0AEC0;line-height:1.6;margin-bottom:16px;
        " id="devtools-roast-text">${getRandomRoast()}</p>
        <div style="
          padding:12px;border:2px solid #F5656540;
          background:#F5656510;margin-bottom:16px;
        ">
          <p style="font-family:'Space Mono',monospace;font-size:10px;color:#F56565;line-height:1.5;">
            DevTools / Inspect Element terdeteksi.<br/>
            Tutup DevTools untuk melanjutkan browsing.
          </p>
        </div>
        <div style="
          padding:8px 16px;border:2px solid #000;
          box-shadow:3px 3px 0 #000;background:#16213E;
          font-family:'Space Mono',monospace;font-size:10px;
          color:#A0AEC0;
        ">
          EpanDStream v2.3.6 &mdash; Nice try tho 😏
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlayEl);
  document.body.style.overflow = 'hidden';
}

function hideBlockOverlay() {
  if (overlayEl) {
    overlayEl.remove();
    overlayEl = null;
    document.body.style.overflow = '';
  }
}

let isDevToolsOpen = false;

function checkDevTools() {
  const widthThreshold = window.outerWidth - window.innerWidth > 160;
  const heightThreshold = window.outerHeight - window.innerHeight > 160;
  const devOpen = widthThreshold || heightThreshold;

  if (devOpen && !isDevToolsOpen) {
    isDevToolsOpen = true;
    showBlockOverlay();
  } else if (!devOpen && isDevToolsOpen) {
    isDevToolsOpen = false;
    hideBlockOverlay();
  }
}

export function initAntiDevtools() {
  // Check on resize (devtools dock/undock)
  window.addEventListener('resize', checkDevTools);
  
  // Periodic check
  setInterval(checkDevTools, 1000);

  // Block right-click
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Block common keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12') {
      e.preventDefault();
    }
    // Ctrl+Shift+I / Cmd+Option+I
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
      e.preventDefault();
    }
    // Ctrl+Shift+J / Cmd+Option+J
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
      e.preventDefault();
    }
    // Ctrl+Shift+C / Cmd+Option+C
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
      e.preventDefault();
    }
    // Ctrl+U / Cmd+U (view source)
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
      e.preventDefault();
    }
  });

  // Debugger trap
  (function trap() {
    try {
      (function check() {
        const before = performance.now();
        debugger;
        const after = performance.now();
        if (after - before > 100) {
          showBlockOverlay();
          isDevToolsOpen = true;
        }
      })();
    } catch { /* ignore */ }
    setTimeout(trap, 4000);
  })();
}
