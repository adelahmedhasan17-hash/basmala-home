// ===== السلة والمفضلة =====
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
let coupon = JSON.parse(localStorage.getItem('coupon') || 'null');

const COUPONS = {
  'WELCOME10': { type: 'percent', value: 10, label: 'خصم 10%' },
  'SAVE50':    { type: 'fixed',   value: 50, label: 'خصم 50 ج.م' },
  'FREESHIP':  { type: 'ship',    value: 0,  label: 'شحن مجاني' }
};

const SHIPPING = 50;

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}
function saveWish() {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateWishUI();
}

// ===== إضافة للسلة =====
function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  const item = cart.find(x => x.id === id);
  if (item) item.qty++;
  else cart.push({ id, qty: 1 });

  saveCart();
  showToast(`✅ تمت إضافة "${p.title}" للسلة`, 'gold');

  // Pulse على أيقونة السلة
  const badge = document.getElementById('cartCount');
  if (badge) {
    badge.classList.add('pulse');
    setTimeout(() => badge.classList.remove('pulse'), 500);
  }
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  saveCart();
  showToast('🗑️ تم حذف المنتج', 'red');
}

function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) return removeFromCart(id);
  saveCart();
}

// ===== الحسابات =====
function calcSubtotal() {
  return cart.reduce((sum, item) => {
    const p = PRODUCTS.find(x => x.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

function calcDiscount(subtotal) {
  if (!coupon) return 0;
  if (coupon.type === 'percent') return Math.round(subtotal * coupon.value / 100);
  if (coupon.type === 'fixed')   return coupon.value;
  return 0;
}

function calcShipping(subtotal) {
  if (subtotal >= 1000) return 0;
  if (coupon && coupon.type === 'ship') return 0;
  return SHIPPING;
}

function calcTotal() {
  const sub = calcSubtotal();
  return sub - calcDiscount(sub) + calcShipping(sub);
}

// ===== عرض السلة =====
function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const countEl = document.getElementById('cartCount');
  if (countEl) countEl.textContent = count;

  const body = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');
  if (!body || !footer) return;

  if (!cart.length) {
    body.innerHTML = `
      <div style="text-align:center;padding:40px 20px;color:#888;">
        <div style="font-size:60px;margin-bottom:15px;">🛒</div>
        <p>سلتك فارغة، ابدأ التسوق</p>
      </div>`;
    footer.innerHTML = '';
    return;
  }

  body.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    if (!p) return '';
    return `
      <div class="cart-item">
        <div class="cart-item-img">${p.icon}</div>
        <div class="cart-item-info">
          <h4>${p.title}</h4>
          <span class="price">${p.price} ج.م</span>
          <div class="qty-controls">
            <button onclick="changeQty(${p.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${p.id}, 1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${p.id})">🗑️</button>
      </div>
    `;
  }).join('');

  const sub = calcSubtotal();
  const disc = calcDiscount(sub);
  const ship = calcShipping(sub);
  const total = calcTotal();

  footer.innerHTML = `
    <div style="margin-bottom:15px;">
      <div style="display:flex;gap:8px;">
        <input type="text" id="couponInput" placeholder="كود الخصم (WELCOME10)"
          style="flex:1;padding:10px 14px;border:2px solid var(--gray-light);border-radius:10px;font-family:inherit;outline:none;background:var(--white);color:var(--black);">
        <button class="btn-primary" style="padding:10px 18px;" onclick="applyCoupon()">تطبيق</button>
      </div>
      ${coupon ? `<p style="color:#27AE60;font-size:13px;margin-top:8px;">✅ ${coupon.label} مطبق <button onclick="removeCoupon()" style="color:var(--red);font-size:12px;">إزالة</button></p>` : ''}
    </div>
    <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px;">
      <span>الإجمالي:</span><span>${sub} ج.م</span>
    </div>
    ${disc ? `<div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px;color:#27AE60;">
      <span>الخصم:</span><span>-${disc} ج.م</span>
    </div>` : ''}
    <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:10px;">
      <span>الشحن:</span><span>${ship === 0 ? 'مجاني 🎉' : ship + ' ج.م'}</span>
    </div>
    <div class="total-row">
      <span>الإجمالي النهائي:</span><span style="color:var(--gold);">${total} ج.م</span>
    </div>
    <button class="btn-primary" style="width:100%;" onclick="goCheckout()">إتمام الشراء 💳</button>
  `;
}

// ===== الكوبونات =====
function applyCoupon() {
  const input = document.getElementById('couponInput');
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  if (!code) return;

  if (!COUPONS[code]) {
    showToast('❌ كود الخصم غير صالح', 'red');
    return;
  }
  coupon = { code, ...COUPONS[code] };
  localStorage.setItem('coupon', JSON.stringify(coupon));
  updateCartUI();
  showToast(`✅ تم تطبيق ${coupon.label}`, 'gold');
}

function removeCoupon() {
  coupon = null;
  localStorage.removeItem('coupon');
  updateCartUI();
  showToast('تم إزالة الكوبون');
}

// ===== فتح/إغلاق السلة =====
function openCart() {
  document.getElementById('cartDrawer').classList.add('active');
  document.getElementById('drawerOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('active');
  document.getElementById('drawerOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// ===== المفضلة =====
function toggleWish(id, btn) {
  const idx = wishlist.indexOf(id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast('💔 تم الحذف من المفضلة');
  } else {
    wishlist.push(id);
    showToast('❤️ تمت الإضافة للمفضلة', 'gold');
  }
  saveWish();
  if (btn) {
    btn.classList.toggle('active');
    btn.textContent = btn.classList.contains('active') ? '❤️' : '🤍';
  }
}

function isInWishlist(id) {
  return wishlist.includes(id);
}

function updateWishUI() {
  const el = document.getElementById('wishCount');
  if (el) el.textContent = wishlist.length;
}

function openWishlist() {
  if (!wishlist.length) {
    showToast('❤️ لا توجد منتجات في المفضلة');
    return;
  }
  const list = PRODUCTS.filter(p => wishlist.includes(p.id));
  renderProducts(list);
  document.getElementById('productsTitle').textContent = '❤️ المفضلة';
  scrollToProducts();
}

// ===== الانتقال للدفع =====
function goCheckout() {
  if (!cart.length) return;
  closeCart();
  if (typeof openCheckout === 'function') {
    setTimeout(openCheckout, 300);
  }
      }
