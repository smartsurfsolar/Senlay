(function () {
  const SESSION_TOKEN_STORAGE_KEY = 'senlay_session_token';

  function getSessionToken() {
    try {
      return sessionStorage.getItem(SESSION_TOKEN_STORAGE_KEY) || localStorage.getItem(SESSION_TOKEN_STORAGE_KEY) || '';
    } catch (_) {
      return '';
    }
  }

  function clearSessionToken() {
    try {
      sessionStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);
      localStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);
    } catch (_) {}
  }

  function applyAuthState(nav, signedIn) {
    nav.querySelectorAll('[data-app-nav]').forEach((link) => {
      const section = link.getAttribute('data-app-nav');
      if (section === 'signin') {
        link.hidden = signedIn;
      } else {
        link.hidden = !signedIn;
      }
    });
    const signOutButton = nav.querySelector('#navSignOut');
    if (signOutButton) signOutButton.hidden = !signedIn;
  }

  async function init() {
    const nav = document.querySelector('[data-app-nav-root]');
    if (!nav) return;

    const token = getSessionToken();
    if (!token) {
      applyAuthState(nav, false);
      return;
    }

    try {
      const res = await fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } });
      applyAuthState(nav, res.ok);
    } catch (_) {
      applyAuthState(nav, true); // network hiccup: assume signed in rather than flashing the user out
    }

    const signOutButton = nav.querySelector('#navSignOut');
    if (signOutButton) {
      signOutButton.addEventListener('click', () => {
        clearSessionToken();
        window.location.href = '/login.html';
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
