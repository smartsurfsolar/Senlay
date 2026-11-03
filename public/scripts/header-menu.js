(function () {
  function closeMobileNav(restoreFocus = false) {
    const nav = document.querySelector('.header .nav.open');
    const button = document.querySelector('.header .hamburger.active');
    if (nav) nav.classList.remove('open');
    if (button) {
      button.classList.remove('active');
      button.setAttribute('aria-expanded', 'false');
      if (restoreFocus) button.focus();
    }
  }

  function initDetailsMenus() {
    document.querySelectorAll('.header details.nav-menu').forEach((menu) => {
      const close = () => {
        menu.open = false;
      };

      menu.addEventListener('toggle', () => {
        if (!menu.open) return;

        document.querySelectorAll('.header details.nav-menu[open]').forEach((other) => {
          if (other !== menu) other.open = false;
        });
      });

      menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', close);
      });
    });
  }

  function initMobileNav() {
    const header = document.querySelector('.header');
    const nav = header?.querySelector('.nav');
    const button = header?.querySelector('.hamburger');
    if (!header || !nav || !button) return;
    button.setAttribute('aria-expanded', String(nav.classList.contains('open')));
    if (!nav.id) nav.id = 'primary-navigation';
    button.setAttribute('aria-controls', nav.id);

    const close = () => {
      closeMobileNav();
    };

    button.addEventListener('click', () => {
      window.setTimeout(() => {
        button.setAttribute('aria-expanded', String(nav.classList.contains('open')));
      }, 0);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', close);
    });
  }

  function initGlobalClose() {
    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest('.header')) {
        document.querySelectorAll('.header details.nav-menu[open]').forEach((menu) => {
          menu.open = false;
        });
        closeMobileNav();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const active = document.activeElement;
      const openMenu = active instanceof Element ? active.closest('.header details.nav-menu[open]') : null;
      const mobileOpen = document.querySelector('.header .nav.open');
      if (!openMenu && !mobileOpen) return;
      event.preventDefault();
      document.querySelectorAll('.header details.nav-menu[open]').forEach((menu) => {
        menu.open = false;
        if (menu === openMenu) menu.querySelector('summary')?.focus();
      });
      closeMobileNav(Boolean(mobileOpen));
    });
  }

  function init() {
    initDetailsMenus();
    initMobileNav();
    initGlobalClose();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
