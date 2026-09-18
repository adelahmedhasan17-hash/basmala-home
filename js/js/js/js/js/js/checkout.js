let checkoutStep = 1;
let shippingData = {};
let paymentMethod = 'cash';

const EGYPT_GOVS = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'المنوفية',
  'القليوبية', 'البحيرة', 'الغربية', 'بورسعيد', 'دمياط', 'الإسماعيلية',
  'السويس', 'كفر الشيخ', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط',
  'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر', 'الوادي الجديد',
  'مطروح', 'شمال سيناء', 'جنوب سيناء'
];

function openCheckout() {
  if (!cart.length) {
    showToast('🛒 سلتك فارغة', 'red');
    return;
  }

  if (!document.querySelector('.checkout-page')) {
    document.body.insertAdjacentHTML('beforeend', buildCheckoutHTML());
  }

  checkoutStep = 1;
  goToStep(1);
  renderCheckoutSummary();

  // إظهار خطوات + ملخص لو كانوا مخفيين
  const stepsBar = document.querySelector('.steps-bar');
  if (stepsBar) stepsBar.style.display = 'block';
  const summarySide = document.getElementById('summarySidebar');
  if (summarySide) summarySide.style.display = 'block';
  const successScreen = document.getElementById('successScreen');
  if (successScreen) successScreen.classList.remove('active');
  document.querySelectorAll('.checkout-step').forEach(s => s.style.display = '');

  document.querySelector('.checkout-page').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  document.querySelector('.checkout-page')?.classList.remove('active');
  document.body.style.overflow = '';
}

function buildCheckoutHTML() {
  return `
    <div class="checkout-page">
      <div class="checkout-header">
        <div class="container">
          <h2>💳 إتمام الطلب</h2>
          <button onclick="closeCheckout()">✕</button>
        </div>
      </div>

      <div class="steps-bar">
        <div class="steps-wrap">
          <div class="step-item active" data-step="1">
            <span class="step-num">1</span><span>الشحن</span>
          </div>
          <div class="step-line"></div>
          <div class="step-item" data-step="2">
            <span class="step-num">2</span><span>الدفع</span>
          </div>
          <div class="step-line"></div>
          <div class="step-item" data-step="3">
            <span class="step-num">3</span><span>التأكيد</span>
          </div>
        </div>
      </div>

      <div class="checkout-body" id="checkoutBody">
        <!-- Step 1 -->
        <div class="checkout-step active" id="step1">
          <div class="checkout-card">
            <h3>📍 بيانات الشحن</h3>
            <div class="form-group">
              <label>الاسم الكامل *</label>
              <input type="text" id="coName" placeholder="مثال: أحمد محمد">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>رقم الموبايل *</label>
                <input type="tel" id="coPhone" placeholder="01xxxxxxxxx">
              </div>
              <div class="form-group">
                <label>المحافظة *</label>
                <select id="coGov">
                  <option value="">اختر المحافظة</option>
                  ${EGYPT_GOVS.map(g => `<option value="${g}">${g}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>العنوان التفصيلي *</label>
              <textarea id="coAddress" rows="3" placeholder="الشارع، رقم العمارة، الدور، الشقة..."></textarea>
            </div>
            <div class="form-group">
              <label>ملاحظات (اختياري)</label>
              <textarea id="coNotes" rows="2" placeholder="أي تعليمات خاصة للتوصيل..."></textarea>
            </div>
            <div class="step-nav">
              <button class="btn-primary" onclick="validateShipping()">التالي: طريقة الدفع ←</button>
            </div>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="checkout-step" id="step2">
          <div class="checkout-card">
            <h3>💳 طريقة الدفع</h3>
            <div class="payment-methods">
              <label class="payment-opt active" onclick="selectPayment(this, 'cash')">
                <input type="radio" name="payment" value="cash" checked>
                <div class="pm-icon">💵</div>
                <div class="pm-info"><h4>كاش عند الاستلام</h4><p>ادفع نقداً عند وصول الطلب</p></div>
              </label>
              <label class="payment-opt" onclick="selectPayment(this, 'card')">
                <input type="radio" name="payment" value="card">
                <div class="pm-icon">💳</div>
                <div class="pm-info"><h4>بطاقة ائتمانية</h4><p>فيزا / ماستركارد / ميزة</p></div>
              </label>
              <label class="payment-opt" onclick="selectPayment(this, 'wallet')">
                <input type="radio" name="payment" value="wallet">
                <div class="pm-icon">📱</div>
                <div class="pm-info"><h4>محفظة إلكترونية</h4><p>فودافون كاش / اتصالات كاش</p></div>
              </label>
            </div>

            <div id="cardFields" style="display:none;margin-top:20px;">
              <div class="form-group">
                <label>رقم البطاقة</label>
                <input type="text" placeholder="0000 0000 0000 0000" maxlength="19">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>تاريخ الانتهاء</label>
                  <input type="text" placeholder="MM/YY" maxlength="5">
                </div>
                <div class="form-group">
                  <label>CVV</label>
                  <input type="text" placeholder="123" maxlength="4">
                </div>
              </div>
            </div>

            <div id="walletFields" style="display:none;margin-top:20px;">
              <div class="form-group">
                <label>رقم المحفظة</label>
                <input type="tel" placeholder="01xxxxxxxxx">
              </div>
            </div>

            <div class="step-nav">
              <button class="btn-outline" onclick="goToStep(1)">→ السابق</button>
              <button class="btn-primary" onclick="goToStep(3)">التالي: التأكيد ←</button>
            </div>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="checkout-step" id="step3">
          <div class="checkout-card">
            <h3>📋 تأكيد الطلب</h3>
            <div style="background:var(--gray-light);border-radius:12px;padding:15px;margin-bottom:20px;">
              <h4 style="margin-bottom:10px;">📍 عنوان الشحن</h4>
              <p id="confirmAddress" style="font-size:14px;color:#555;"></p>
            </div>
            <div style="background:var(--gray-light);border-radius:12px;padding:15px;margin-bottom:20px;">
              <h4 style="margin-bottom:10px;">💳 طريقة الدفع</h4>
              <p id="confirmPayment" style="font-size:14px;color:#555;"></p>
            </div>
            <div style="background:var(--gray-light);border-radius:12px;padding:15px;margin-bottom:20px;">
              <h4 style="margin-bottom:10px;">🛒 المنتجات</h4>
              <div id="confirmItems"></div>
            </div>
            <div class="step-nav">
              <button class="btn-outline" onclick="goToStep(2)">→ السابق</button>
              <button class="btn-primary" onclick="placeOrder()">✅ تأكيد الطلب</button>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div id="summarySidebar">
          <div class="summary-card">
            <h3>📦 ملخص الطلب</h3>
            <div id="summaryItems"></div>
            <div class="summary-rows" id="summaryRows"></div>
          </div>
        </div>

        <!-- Success -->
        <div class="success-screen" id="successScreen" style="grid-column:1/-1;">
          <div class="success-icon">✓</div>
          <h1>تم استلام طلبك!</h1>
          <p>شكراً لك، هنتواصل معك قريباً لتأكيد الطلب</p>
          <div class="order-number" id="orderNum">#00000</div>
          <p style="font-size:14px;">رقم الطلب — احتفظ به للمتابعة</p>
          <div class="success-actions">
            <button class="btn-primary" onclick="closeCheckout()">🏠 العودة للرئيسية</button>
            <button class="btn-outline" onclick="showToast('📦 هنتواصل معاك قريباً', 'gold')">📞 تتبع الطلب</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function goToStep(n) {
  checkoutStep = n;
  document.querySelectorAll('.checkout-step').forEach(s => s.classList.remove('active'));
  document.getElementById('step' + n)?.classList.add('active');

  document.querySelectorAll('.step-item').forEach(item => {
    const step = parseInt(item.dataset.step);
    item.classList.toggle('active', step === n);
    item.classList.toggle('done', step < n);
  });

  if (n === 3) renderConfirm();
  renderCheckoutSummary();
  document.querySelector('.checkout-page')?.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateShipping() {
  const name = document.getElementById('coName').value.trim();
  const phone = document.getElementById('coPhone').value.trim();
  const gov = document.getElementById('coGov').value;
  const address = document.getElementById('coAddress').value.trim();

  if (!name || name.length < 3) {
    showToast('❌ اكتب اسمك الكامل', 'red');
    return;
  }
  if (!/^01[0-9]{9}$/.test(phone)) {
    showToast('❌ رقم موبايل غير صحيح (11 رقم يبدأ بـ 01)', 'red');
    return;
  }
  if (!gov) {
    showToast('❌ اختر المحافظة', 'red');
    return;
  }
  if (!address || address.length < 10) {
    showToast('❌ اكتب العنوان التفصيلي', 'red');
    return;
  }

  shippingData = {
    name, phone, gov, address,
    notes: document.getElementById('coNotes').value.trim()
  };
  goToStep(2);
}

function selectPayment(el, method) {
  document.querySelectorAll('.payment-opt').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  paymentMethod = method;

  const cardFields = document.getElementById('cardFields');
  const walletFields = document.getElementById('walletFields');
  if (cardFields) cardFields.style.display = method === 'card' ? 'block' : 'none';
  if (walletFields) walletFields.style.display = method === 'wallet' ? 'block' : 'none';
}

function renderConfirm() {
  document.getElementById('confirmAddress').innerHTML = `
    <strong>${shippingData.name}</strong><br>
    📱 ${shippingData.phone}<br>
    📍 ${shippingData.gov} - ${shippingData.address}
    ${shippingData.notes ? `<br>📝 ${shippingData.notes}` : ''}
  `;

  const paymentNames = {
    cash: '💵 كاش عند الاستلام',
    card: '💳 بطاقة ائتمانية',
    wallet: '📱 محفظة إلكترونية'
  };
  document.getElementById('confirmPayment').textContent = paymentNames[paymentMethod];

  document.getElementById('confirmItems').innerHTML = cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    if (!p) return '';
    return `
      <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:14px;">
        <span>${p.icon} ${p.title} × ${item.qty}</span>
        <strong>${p.price * item.qty} ج.م</strong>
      </div>
    `;
  }).join('');
}

function renderCheckoutSummary() {
  const itemsEl = document.getElementById('summaryItems');
  if (!itemsEl) return;

  itemsEl.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    if (!p) return '';
    return `
      <div class="summary-item">
        <div class="summary-item-img">${p.icon}</div>
        <div class="summary-item-info">
          <h4>${p.title}</h4>
          <span>الكمية: ${item.qty}</span>
        </div>
        <strong style="font-size:14px;">${p.price * item.qty} ج.م</strong>
      </div>
    `;
  }).join('');

  const sub = calcSubtotal();
  const disc = calcDiscount(sub);
  const ship = calcShipping(sub);
  const total = calcTotal();

  document.getElementById('summaryRows').innerHTML = `
    <div class="summary-row"><span>الإجمالي الفرعي</span><span>${sub} ج.م</span></div>
    ${disc ? `<div class="summary-row discount"><span>الخصم</span><span>-${disc} ج.م</span></div>` : ''}
    <div class="summary-row ${ship === 0 ? 'free' : ''}">
      <span>الشحن</span><span>${ship === 0 ? 'مجاني 🎉' : ship + ' ج.م'}</span>
    </div>
    <div class="summary-row total"><span>الإجمالي النهائي</span><span>${total} ج.م</span></div>
  `;
}

function placeOrder() {
  const orderNum = '#BH' + Date.now().toString().slice(-6);
  const finalTotal = calcTotal();
  const pointsEarned = Math.floor(finalTotal / 10);

  const order = {
    number: orderNum,
    date: new Date().toISOString(),
    items: cart.map(item => {
      const p = PRODUCTS.find(x => x.id === item.id);
      return { id: p.id, title: p.title, price: p.price, qty: item.qty };
    }),
    shipping: shippingData,
    payment: paymentMethod,
    total: finalTotal,
    status: 'pending'
  };

  // حفظ في حساب المستخدم
  if (currentUser) {
    currentUser.orders = currentUser.orders || [];
    currentUser.orders.push(order);
    currentUser.points = (currentUser.points || 0) + pointsEarned;
    localStorage.setItem('user', JSON.stringify(currentUser));
  }

  // حفظ في سجل الطلبات العام
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  // إظهار شاشة النجاح
  document.querySelectorAll('.checkout-step').forEach(s => s.style.display = 'none');
  document.getElementById('summarySidebar').style.display = 'none';
  document.querySelector('.steps-bar').style.display = 'none';
  document.getElementById('successScreen').classList.add('active');
  document.getElementById('orderNum').textContent = orderNum;

  // تفريغ السلة
  cart = [];
  coupon = null;
  localStorage.removeItem('cart');
  localStorage.removeItem('coupon');
  updateCartUI();

  showToast(`🎉 تم تأكيد طلبك! ربحت ${pointsEarned} نقطة`, 'gold');
  if (typeof updatePointsUI === 'function') updatePointsUI();
}
