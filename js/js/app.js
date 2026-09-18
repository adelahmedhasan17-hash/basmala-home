// ===== المتغيرات العامة =====
let currentFilter = 'all';
let searchQuery = '';

// ===== عرض المنتجات =====
function renderProducts(list) {
  const grid = document.getElementById('productsGrid');
  const empty = document.getElementById('emptyMsg');

  if (!list.length) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  grid.innerHTML = list.map(p => {
    const discount = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
    const badgeClass = p.badge === 'جديد' ? 'new' : p.badge === 'الأكثر مبيعاً' ? 'best' : '';
    const isWished = isInWishlist(p.id);

    return `
      <div class="product-card">
        <div class="product-img" style="padding:0;">
          <img src="${p.image}" alt="${p.title}" loading="lazy"
            style="width:100%;height:220px;object-fit:cover;display:block;"
            onerror="this.style.display='none';this.parentElement.innerHTML='<div style=\\'font-size:80px;padding:30px 0;text-align:center;\\'>${p.icon}</div>'">
          ${p.badge ? `<span class="badge-tag ${badgeClass}">${p.badge}</span>` : ''}
          <button class="wish-btn ${isWished ? 'active' : ''}" onclick="event.stopPropagation();toggleWish(${p.id}, this)">
            ${isWished ? '❤️' : '🤍'}
          </button>
        </div>
        <div class="product-info">
          <span class="product-cat">${p.cat}</span>
          <h3 class="product-title">${p.title}</h3>
          <div class="product-rating">
            ${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5 - Math.round(p.rating))}
            <span>(${p.reviewsCount})</span>
          </div>
          <div class="product-price">
            <span class="price-now">${p.price} ج.م</span>
            ${p.old ? `<span class="price-old">${p.old} ج.م</span>` : ''}
            ${discount ? `<span style="color:var(--red);font-weight:700;font-size:13px;">-${discount}%</span>` : ''}
          </div>
          <button class="add-btn" onclick="event.stopPropagation();addToCart(${p.id})"
            ${!p.inStock ? 'disabled style="opacity:.5"' : ''}>
            ${p.inStock ? '🛒 أضف للسلة' : 'غير متوفر'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ===== الفلترة =====
function filterCat(cat, btn) {
  currentFilter = cat;
  document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  applyFilters();
  scrollToProducts();
}

function doSearch() {
  searchQuery = document.getElementById('searchInput').value.trim().toLowerCase();
  applyFilters();
  scrollToProducts();
}

function applyFilters() {
  let list = PRODUCTS;

  if (currentFilter !== 'all') {
    list = list.filter(p => p.cat === currentFilter);
  }
  if (searchQuery) {
    list = list.filter(p =>
      p.title.toLowerCase().includes(searchQuery) ||
      p.cat.toLowerCase().includes(searchQuery) ||
      p.shortDesc.toLowerCase().includes(searchQuery)
    );
  }
  renderProducts(list);
}

function scrollToProducts() {
  const el = document.getElementById('productsSection');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function goHome(e) {
  if (e) e.preventDefault();
  currentFilter = 'all';
  searchQuery = '';
  const si = document.getElementById('searchInput');
  if (si) si.value = '';
  document.querySelectorAll('.cat-pill').forEach((b, i) => b.classList.toggle('active', i === 0));
  document.getElementById('productsTitle').textContent = 'الأكثر مبيعاً';
  applyFilters();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== الوضع الليلي =====
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('darkMode', isDark);
  showToast(isDark ? '🌙 الوضع الليلي مفعل' : '☀️ الوضع النهاري مفعل', 'gold');
}

// ===== Toast =====
let toastTimer;
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast show ' + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}

// ===== التشغيل الأولي =====
document.addEventListener('DOMContentLoaded', () => {
  // تطبيق الوضع الليلي المحفوظ
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
  }

  // البحث الفوري
  const input = document.getElementById('searchInput');
  if (input) {
    input.addEventListener('input', () => {
      searchQuery = input.value.trim().toLowerCase();
      applyFilters();
    });
  }

  // عرض المنتجات
  renderProducts(PRODUCTS);

  // تحديث الواجهات
  if (typeof updateCartUI === 'function') updateCartUI();
  if (typeof updateWishUI === 'function') updateWishUI();
  if (typeof loadUser === 'function') loadUser();
  if (typeof updatePointsUI === 'function') updatePointsUI();

  // Reveal Animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section, .cat-card, .product-card, .feature')
    .forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
});
