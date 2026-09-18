// ===== Router بسيط =====
function navigate(path) {
  try {
    history.pushState({}, '', path);
    handleRoute();
  } catch (e) {
    console.log('Navigation error:', e);
  }
}

function handleRoute() {
  const path = location.pathname;
  const knownRoutes = ['/', '/category', '/product', '/cart', '/checkout', '/wishlist', '/account', '/about', '/contact'];
  const isKnown = knownRoutes.some(r => path === r || path.startsWith(r + '/'));

  if (path !== '/' && !isKnown) {
    navigate('/');
  }
}

window.addEventListener('popstate', handleRoute);
document.addEventListener('DOMContentLoaded', handleRoute);
