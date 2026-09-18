// ===== بيانات إضافية لكل منتج =====
function getProductDetails(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return null;

  const specs = {
    'أدوات كهربائية': {
      'الطاقة': '500 وات',
      'الجهد': '220-240 فولت',
      'الضمان': 'سنتان',
      'بلد المنشأ': 'الصين',
      'المادة': 'ستانلس ستيل + بلاستيك ABS'
    },
    'أطقم صيني': {
      'عدد القطع': '24 قطعة',
      'المادة': 'بورسلين فاخر',
      'آمن في الميكروويف': 'نعم',
      'آمن في غسالة الأطباق': 'نعم',
      'بلد المنشأ': 'تركيا'
    },
    'أدوات مطبخ': {
      'المادة': 'ستانلس ستيل 304',
      'عدد القطع': '5 قطع',
      'يناسب جميع المواقد': 'نعم',
      'قابل للغسل في غسالة الأطباق': 'نعم',
      'الضمان': 'سنة'
    },
    'أطقم سفرة': {
      'المادة': 'ستانلس ستيل 18/10',
      'عدد القطع': '24 قطعة',
      'التشطيب': 'مطفي لامع',
      'قابل للغسل في غسالة الأطباق': 'نعم'
    },
    'مستلزمات الحمام': {
      'المادة': 'بلاستيك عالي الجودة',
      'عدد القطع': '4 قطع',
      'الألوان': 'متعدد',
      'مقاوم للرطوبة': 'نعم'
    },
    'ديكور المنزل': {
      'المادة': 'خشب + معدن',
      'المقاس': '40×50 سم',
      'اللون': 'ذهبي/أسود',
      'التركيب': 'جاهز للتعليق'
    }
  };

  const reviewNames = ['أحمد م.', 'سارة ع.', 'محمود ك.', 'فاطمة ح.', 'خالد ر.', 'منى س.'];
  const reviewTexts = [
    'جودة ممتازة والسعر مناسب جداً، أنصح به بشدة.',
    'المنتج وصل بسرعة والتغليف كان محترم.',
    'أفضل من المتوقع، هشتري تاني أكيد.',
    'خامات ممتازة والتصميم جميل جداً.'
  ];

  const reviews = [];
  for (let i = 0; i < 3; i++) {
    reviews.push({
      name: reviewNames[(id + i) % reviewNames.length],
      rating: 4 + ((id + i) % 2),
      text: reviewTexts[(id + i) % reviewTexts.length]
    });
  }

  return {
    ...p,
    specs: specs[p.cat] || {},
    reviews
  };
}

// ===== فتح نافذة المنتج =====
function openProductModal(id) {
  const p = getProductDetails(id);
  if (!p) return;

  const discount = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;

  document.querySelector('.product-modal-overlay')?.remove();

  const html = `
    <div class="product-modal-overlay" onclick="closeProductModal(event)">
      <div class="product-modal" onclick="event.stopPropagation()">
        <button class="pm-close" onclick="closeProductModal()">✕</button>

        <div class="pm-content">
          <div class="pm-gallery">
            <div class="pm-main-img" id="pmMainImg" style="padding:0;overflow:hidden;">
              <img src="${p.image}" alt="${p.title}" id="pmMainImgTag"
                style="width:100%;height:100%;object-fit:cover;display:block;">
            </div>
            <div class="pm-thumbs">
              <div class="pm-thumb active" style="padding:0;overflow:hidden;" onclick="switchThumb(this, '${p.image}')">
                <img src="${p.image}" style="width:100%;height:100%;object-fit:cover;">
              </div>
              <div class="pm-thumb" style="padding:0;overflow:hidden;" onclick="switchThumb(this, '${p.image}')">
                <img src="${p.image}" style="width:100%;height:100%;object-fit:cover;filter:hue-rotate(45deg);">
              </div>
              <div class="pm-thumb" style="padding:0;overflow:hidden;" onclick="switchThumb(this, '${p.image}')">
                <img src="${p.image}" style="width:100%;height:100%;object-fit:cover;filter:grayscale(1);">
              </div>
              <div class="pm-thumb" style="padding:0;overflow:hidden;" onclick="switchThumb(this, '${p.image}')">
                <img src="${p.image}" style="width:100%;height:100%;object-fit:cover;filter:sepia(0.6);">
              </div>
            </div>
          </div>

          <div class="pm-info">
            <span class="pm-cat-tag">${p.cat}</span>
            <h1>${p.title}</h1>

            <div class="pm-rating">
              ${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5 - Math.round(p.rating))}
              <span>(${p.reviewsCount} تقييم)</span>
            </div>

            <div class="pm-price-box">
              <div class="pm-price-row">
                <span class="pm-price-now">${p.price} ج.م</span>
                ${p.old ? `<span class="pm-price-old">${p.old} ج.م</span>` : ''}
                ${discount ? `<span class="pm-discount">وفّر ${discount}%</span>` : ''}
              </div>
            </div>

            <p class="pm-desc">${p.fullDesc}</p>

            ${p.colors && p.colors.length ? `
              <div class="pm-colors">
                <h4>اللون:</h4>
                <div class="color-options">
                  ${p.colors.map((c, i) => `
                    <button class="color-opt ${i === 0 ? 'active' : ''}"
                      onclick="selectColor(this)">${c}</button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <div class="pm-actions">
              <div class="qty-box">
                <button onclick="pmChangeQty(-1)">−</button>
                <span id="pmQty">1</span>
                <button onclick="pmChangeQty(1)">+</button>
              </div>
              <button class="pm-add-btn" onclick="pmAddToCart(${p.id})">
                🛒 أضف للسلة
              </button>
            </div>

            <button class="pm-buy-btn" onclick="pmBuyNow(${p.id})">
              ⚡ اشتري الآن
            </button>

            <div class="pm-shipping">
              <p>🚚 <strong>توصيل سريع</strong> خلال 2-3 أيام عمل</p>
              <p>🔒 <strong>دفع آمن</strong> 100% أو كاش عند الاستلام</p>
              <p>↩️ <strong>إرجاع مجاني</strong> خلال 14 يوم</p>
              ${p.inStock
                ? '<p style="color:#27AE60;">✅ <strong>متوفر في المخزون</strong></p>'
                : '<p style="color:#E74C3C;">❌ <strong>غير متوفر حالياً</strong></p>'}
            </div>
          </div>
        </div>

        <div class="pm-tabs">
          <div class="pm-tab-buttons">
            <button class="pm-tab-btn active" onclick="pmSwitchTab('desc', this)">📝 الوصف</button>
            <button class="pm-tab-btn" onclick="pmSwitchTab('specs', this)">⚙️ المواصفات</button>
            <button class="pm-tab-btn" onclick="pmSwitchTab('reviews', this)">⭐ المراجعات (${p.reviews.length})</button>
          </div>

          <div class="pm-tab-content">
            <div class="pm-tab-panel active" id="pm-desc">
              <p style="line-height:1.9;color:#555;">${p.fullDesc}</p>
              <p style="margin-top:12px;color:#555;">${p.shortDesc}</p>
            </div>

            <div class="pm-tab-panel" id="pm-specs">
              <ul class="pm-specs-list">
                ${Object.entries(p.specs).map(([k, v]) => `
                  <li><span>${k}</span><span>${v}</span></li>
                `).join('')}
              </ul>
            </div>

            <div class="pm-tab-panel" id="pm-reviews">
              ${p.reviews.map(r => `
                <div class="review-item">
                  <div class="review-head">
                    <span class="review-name">${r.name}</span>
                    <span class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
                  </div>
                  <p class="review-text">${r.text}</p>
                </div>
              `).join('')}
              <button class="btn-primary" style="width:100%;margin-top:10px;" onclick="showToast('⭐ شكراً لتقييمك!', 'gold')">
                ✍️ اكتب تقييمك
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    document.querySelector('.product-modal-overlay').classList.add('active');
  });

  window._pmQty = 1;
}

function closeProductModal(e) {
  if (e && e.target !== e.currentTarget) return;
  const overlay = document.querySelector('.product-modal-overlay');
  if (!overlay) return;
  overlay.classList.remove('active');
  setTimeout(() => {
    overlay.remove();
    document.body.style.overflow = '';
  }, 300);
}

function switchThumb(el, imgUrl) {
  document.querySelectorAll('.pm-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const mainTag = document.getElementById('pmMainImgTag');
  if (!mainTag) return;
  const elImg = el.querySelector('img');
  mainTag.style.filter = elImg.style.filter || 'none';
}

function selectColor(el) {
  document.querySelectorAll('.color-opt').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

function pmChangeQty(delta) {
  window._pmQty = Math.max(1, (window._pmQty || 1) + delta);
  const qtyEl = document.getElementById('pmQty');
  if (qtyEl) qtyEl.textContent = window._pmQty;
}

function pmAddToCart(id) {
  const qty = window._pmQty || 1;
  for (let i = 0; i < qty; i++) addToCart(id);
  closeProductModal();
}

function pmBuyNow(id) {
  const qty = window._pmQty || 1;
  for (let i = 0; i < qty; i++) addToCart(id);
  closeProductModal();
  setTimeout(() => {
    if (typeof openCheckout === 'function') openCheckout();
  }, 400);
}

function pmSwitchTab(tab, btn) {
  document.querySelectorAll('.pm-tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.pm-tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('pm-' + tab).classList.add('active');
}

// ===== ربط كارت المنتج بالـ Modal =====
document.addEventListener('click', (e) => {
  const card = e.target.closest('.product-card');
  if (!card) return;
  if (e.target.closest('.add-btn, .wish-btn')) return;

  const title = card.querySelector('.product-title')?.textContent;
  const product = PRODUCTS.find(p => p.title === title);
  if (product) openProductModal(product.id);
});
