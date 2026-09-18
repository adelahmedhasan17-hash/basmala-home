// ===== PWA Registration =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('✅ SW Registered:', reg.scope))
      .catch(err => console.log('❌ SW Error:', err));
  });
}

// ===== Install Prompt =====
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallBanner();
});

function showInstallBanner() {
  if (localStorage.getItem('installDismissed') === 'true') return;
  if (document.getElementById('installBanner')) return;

  const banner = document.createElement('div');
  banner.id = 'installBanner';
  banner.innerHTML = `
    <div style="
      position:fixed;bottom:20px;left:50%;transform:translateX(-50%);
      background:var(--black);color:var(--white);
      padding:15px 20px;border-radius:16px;
      box-shadow:0 10px 40px rgba(0,0,0,0.3);
      display:flex;align-items:center;gap:15px;
      z-index:9999;max-width:90%;width:400px;
      animation:slideUp .5s;
      border:2px solid var(--gold);
    ">
      <div style="font-size:32px;">📱</div>
      <div style="flex:1;">
        <strong style="display:block;margin-bottom:3px;">ثبّت التطبيق</strong>
        <span style="font-size:12px;opacity:0.8;">تجربة أسرع وأفضل</span>
      </div>
      <button onclick="installPWA()" style="
        background:var(--gold);color:var(--black);
        border:none;padding:10px 18px;border-radius:50px;
        font-weight:900;cursor:pointer;font-family:inherit;
      ">تثبيت</button>
      <button onclick="dismissInstall()" style="
        background:transparent;color:#888;border:none;
        font-size:20px;cursor:pointer;padding:5px;
      ">✕</button>
    </div>
  `;
  document.body.appendChild(banner);
}

function installPWA() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(choice => {
    if (choice.outcome === 'accepted') {
      showToast('🎉 تم تثبيت التطبيق!', 'gold');
    }
    deferredPrompt = null;
    document.getElementById('installBanner')?.remove();
  });
}

function dismissInstall() {
  localStorage.setItem('installDismissed', 'true');
  document.getElementById('installBanner')?.remove();
}

// ===== Push Notifications =====
async function requestNotificationPermission() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') return;
  if (Notification.permission === 'denied') return;

  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    showToast('🔔 هتوصلك إشعارات بالعروض الجديدة', 'gold');
  }
}

setTimeout(() => {
  if (localStorage.getItem('notifAsked') !== 'true') {
    requestNotificationPermission();
    localStorage.setItem('notifAsked', 'true');
  }
}, 30000);

// ===== Online/Offline =====
window.addEventListener('online', () => showToast('✅ رجع الإنترنت', 'gold'));
window.addEventListener('offline', () => showToast('📡 لا يوجد اتصال', 'red'));
