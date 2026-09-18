// ===== المتغيرات =====
let currentUser = JSON.parse(localStorage.getItem('user') || 'null');

// ===== تحميل بيانات المستخدم =====
function loadUser() {
  const el = document.getElementById('userName');
  if (currentUser && el) {
    el.textContent = currentUser.name.split(' ')[0];
  } else if (el) {
    el.textContent = '';
  }
}

// ===== فتح نافذة الحساب =====
function openAuthModal() {
  if (currentUser) {
    // لو مسجل دخول → افتح لوحة الحساب
    if (typeof openAccount === 'function') {
      openAccount();
    }
    return;
  }
  document.getElementById('authModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAuthModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('modal-close')) return;
  document.getElementById('authModal').classList.remove('active');
  document.body.style.overflow = '';
}

// ===== التبديل بين التابات =====
function switchTab(tab, btn) {
  document.querySelectorAll('.auth-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('loginForm').style.display = tab === 'login' ? 'flex' : 'none';
  document.getElementById('registerForm').style.display = tab === 'register' ? 'flex' : 'none';
}

// ===== إظهار/إخفاء كلمة السر =====
function togglePass(id) {
  const input = document.getElementById(id);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
}

// ===== تسجيل الدخول =====
function handleLogin(e) {
  e.preventDefault();
  const inputs = e.target.querySelectorAll('input');
  const email = inputs[0].value.trim();
  const remember = document.getElementById('rememberMe').checked;

  // لو المستخدم موجود قبل كده احتفظ ببياناته
  const existing = JSON.parse(localStorage.getItem('user') || 'null');
  if (existing && existing.email === email) {
    currentUser = existing;
  } else {
    currentUser = {
      name: email.split('@')[0],
      email,
      phone: '',
      address: '',
      orders: [],
      points: 0
    };
  }

  localStorage.setItem('user', JSON.stringify(currentUser));
  if (!remember) sessionStorage.setItem('user', JSON.stringify(currentUser));

  closeAuthModal();
  loadUser();
  if (typeof updatePointsUI === 'function') updatePointsUI();
  showToast(`👋 أهلاً ${currentUser.name}`, 'gold');
}

// ===== تسجيل جديد =====
function handleRegister(e) {
  e.preventDefault();
  const inputs = e.target.querySelectorAll('input');

  currentUser = {
    name: inputs[0].value.trim(),
    email: inputs[1].value.trim(),
    phone: inputs[2].value.trim(),
    address: '',
    orders: [],
    points: 0
  };

  localStorage.setItem('user', JSON.stringify(currentUser));
  closeAuthModal();
  loadUser();
  if (typeof updatePointsUI === 'function') updatePointsUI();
  showToast(`🎉 تم إنشاء حسابك بنجاح`, 'gold');

  // رسالة ترحيب
  setTimeout(() => {
    showToast('🎁 كود ترحيبي: WELCOME10', 'gold');
  }, 1500);
}

// ===== تسجيل الخروج =====
function logout() {
  currentUser = null;
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
  const el = document.getElementById('userName');
  if (el) el.textContent = '';
  if (typeof updatePointsUI === 'function') updatePointsUI();
  showToast('👋 تم تسجيل الخروج');
}

// ===== تحديث نقاط المستخدم =====
function updatePointsUI() {
  const el = document.getElementById('pointsCount');
  if (!el) return;

  if (!currentUser) {
    el.textContent = '0';
    return;
  }

  const orders = currentUser.orders || [];
  const totalSpent = orders.reduce((s, o) => s + (o.total || 0), 0);
  const points = currentUser.points || Math.floor(totalSpent / 10);
  el.textContent = points;
}
