// ===== فتح لوحة الحساب =====
function openAccount() {
  if (!currentUser) {
    openAuthModal();
    return;
  }

  if (!document.querySelector('.account-page')) {
    document.body.insertAdjacentHTML('beforeend', buildAccountHTML());
  }

  renderProfile();
  renderOrders();
  renderPoints();
  renderSettings();

  document.querySelector('.account-page').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAccount() {
  document.querySelector('.account-page')?.classList.remove('active');
  document.body.style.overflow = '';
}

function buildAccountHTML() {
  return `
    <div class="account-page">
      <div class="account-header">
        <h2>👤 حسابي</h2>
        <button onclick="closeAccount()">✕</button>
      </div>

      <div class="profile-card" id="profileCard"></div>

      <div class="account-tabs">
        <button class="acc-tab active" onclick="switchAccTab('orders', this)">📦 طلباتي</button>
        <button class="acc-tab" onclick="switchAccTab('wishlist', this)">❤️ المفضلة</button>
        <button class="acc-tab" onclick="switchAccTab('points', this)">🎁 نقاطي</button>
        <button class="acc-tab" onclick="switchAccTab('settings', this)">⚙️ الإعدادات</button>
      </div>

      <div class="account-content">
        <div class="acc-panel active" id="acc-orders"></div>
        <div class="acc-panel" id="acc-wishlist"></div>
        <div class="acc-panel" id="acc-points"></div>
        <div class="acc-panel" id="acc-settings"></div>
      </div>
    </div>
  `;
}

function switchAccTab(tab, btn) {
  document.querySelectorAll('.acc-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.acc-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('acc-' + tab).classList.add('active');

  if (tab === 'wishlist') renderAccWishlist();
  if (tab === 'points')   renderPoints();
  if (tab === 'settings') renderSettings();
  if (tab === 'orders')   renderOrders();
}

// ===== البروفايل =====
function renderProfile() {
  const orders = currentUser.orders || [];
  const totalSpent = orders.reduce((s, o) => s + (o.total || 0), 0);
  const points = currentUser.points || Math.floor(totalSpent / 10);

  document.getElementById('profileCard').innerHTML = `
    <div class="profile-avatar">${currentUser.name.charAt(0).toUpperCase()}</div>
    <h3>${currentUser.name}</h3>
    <p>${currentUser.email}</p>
    <div class="profile-stats">
      <div class="stat-item">
        <strong>${orders.length}</strong>
        <span>طلبات</span>
      </div>
      <div class="stat-item">
        <strong>${points}</strong>
        <span>نقاط</span>
      </div>
      <div class="stat-item">
        <strong>${totalSpent}</strong>
        <span>ج.م إجمالي</span>
      </div>
    </div>
  `;
}

// ===== الطلبات =====
function renderOrders() {
  const el = document.getElementById('acc-orders');
  if (!el) return;
  const orders = currentUser.orders || [];

  if (!orders.length) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="icon">📦</div>
        <h3>لا توجد طلبات بعد</h3>
        <p>ابدأ التسوق واستمتع بعروضنا</p>
        <button class="btn-primary" onclick="closeAccount();scrollToProducts();">🛍️ تسوق الآن</button>
      </div>`;
    return;
  }

  const statuses = {
    pending:   { text: 'قيد المراجعة', cls: 'status-pending' },
    shipped:   { text: 'تم الشحن',    cls: 'status-shipped' },
    delivered: { text: 'تم التسليم',  cls: 'status-delivered' }
  };

  el.innerHTML = orders.slice().reverse().map(order => {
    const status = statuses[order.status || 'pending'];
    const date = new Date(order.date).toLocaleDateString('ar-EG', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    return `
      <div class="order-card">
        <div class="order-head">
          <div>
            <div class="order-num">${order.number}</div>
            <div class="order-date">📅 ${date}</div>
          </div>
          <span class="order-status ${status.cls}">${status.text}</span>
        </div>
        <div class="order-items">
          ${order.items.map(i => `
            <div class="order-item-row">
              <span>${i.title} × ${i.qty}</span>
              <strong>${i.price * i.qty} ج.م</strong>
            </div>
          `).join('')}
        </div>
        <div class="order-total">
          <span>الإجمالي</span>
          <span>${order.total} ج.م</span>
        </div>
      </div>
    `;
  }).join('');
}

// ===== المفضلة =====
function renderAccWishlist() {
  const el = document.getElementById('acc-wishlist');
  if (!el) return;

  if (!wishlist.length) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="icon">❤️</div>
        <h3>المفضلة فارغة</h3>
        <p>أضف منتجات لمفضلتك</p>
        <button class="btn-primary" onclick="closeAccount();scrollToProducts();">🛍️ تسوق الآن</button>
      </div>`;
    return;
  }

  el.innerHTML = wishlist.map(id => {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return '';
    return `
      <div class="order-card" style="display:grid;grid-template-columns:80px 1fr auto;gap:15px;align-items:center;">
        <img src="${p.image}" style="width:80px;height:80px;object-fit:cover;border-radius:12px;" alt="${p.title}">
        <div>
          <h4 style="font-size:15px;margin-bottom:5px;">${p.title}</h4>
          <span style="color:var(--gold-dark);font-weight:900;">${p.price} ج.م</span>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn-primary" style="padding:10px 16px;font-size:13px;" onclick="addToCart(${p.id})">🛒</button>
          <button onclick="toggleWish(${p.id});renderAccWishlist();" style="font-size:20px;">❤️</button>
        </div>
      </div>
    `;
  }).join('');
}

// ===== النقاط =====
function renderPoints() {
  const el = document.getElementById('acc-points');
  if (!el) return;

  const orders = currentUser.orders || [];
  const totalSpent = orders.reduce((s, o) => s + (o.total || 0), 0);
  const points = currentUser.points || Math.floor(totalSpent / 10);
  const progress = points % 100;

  el.innerHTML = `
    <div class="settings-card" style="text-align:center;">
      <div style="font-size:80px;margin-bottom:15px;">🎁</div>
      <h3 style="font-size:24px;margin-bottom:10px;">لديك ${points} نقطة</h3>
      <p style="color:#888;margin-bottom:20px;">كل 10 جنيه = نقطة واحدة</p>

      <div style="background:var(--gray-light);border-radius:12px;padding:20px;margin-bottom:20px;text-align:right;">
        <h4 style="margin-bottom:15px;">💡 كيف تستخدم نقاطك؟</h4>
        <div style="font-size:14px;color:#555;line-height:2;">
          • 100 نقطة = خصم 10 ج.م<br>
          • 500 نقطة = خصم 60 ج.م<br>
          • 1000 نقطة = شحن مجاني + خصم 100 ج.م
        </div>
      </div>

      <div style="background:var(--gray-light);border-radius:12px;padding:15px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
          <span>التقدم للخصم القادم:</span>
          <strong>${progress}/100</strong>
        </div>
        <div style="height:12px;background:#ddd;border-radius:50px;overflow:hidden;">
          <div style="height:100%;width:${progress}%;background:linear-gradient(90deg,var(--gold),var(--gold-dark));transition:width 1s;"></div>
        </div>
      </div>
    </div>
  `;
}

// ===== الإعدادات =====
function renderSettings() {
  const el = document.getElementById('acc-settings');
  if (!el) return;

  el.innerHTML = `
    <div class="settings-card">
      <h3 style="margin-bottom:20px;">⚙️ تعديل البيانات</h3>
      <div class="form-group">
        <label>الاسم الكامل</label>
        <input type="text" id="setName" value="${currentUser.name || ''}">
      </div>
      <div class="form-group">
        <label>الإيميل</label>
        <input type="email" id="setEmail" value="${currentUser.email || ''}">
      </div>
      <div class="form-group">
        <label>رقم الموبايل</label>
        <input type="tel" id="setPhone" value="${currentUser.phone || ''}">
      </div>
      <div class="form-group">
        <label>العنوان</label>
        <input type="text" id="setAddress" value="${currentUser.address || ''}">
      </div>
      <button class="btn-primary" style="width:100%;margin-bottom:12px;" onclick="saveSettings()">
        💾 حفظ التعديلات
      </button>
      <button class="btn-outline" style="width:100%;" onclick="logoutFromAccount()">
        🚪 تسجيل الخروج
      </button>
    </div>
  `;
}

function saveSettings() {
  currentUser.name = document.getElementById('setName').value.trim();
  currentUser.email = document.getElementById('setEmail').value.trim();
  currentUser.phone = document.getElementById('setPhone').value.trim();
  currentUser.address = document.getElementById('setAddress').value.trim();

  localStorage.setItem('user', JSON.stringify(currentUser));
  loadUser();
  renderProfile();
  showToast('✅ تم حفظ البيانات', 'gold');
}

function logoutFromAccount() {
  if (!confirm('هل تريد تسجيل الخروج؟')) return;
  logout();
  closeAccount();
}
