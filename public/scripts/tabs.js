(function () {
  function activate(nav, name) {
    nav.querySelectorAll('.tab-button').forEach((button) => {
      button.classList.toggle('active', button.dataset.tab === name);
    });
    // Panels are expected to be siblings of the nav (direct children of its parent).
    nav.parentElement.querySelectorAll(':scope > .tab-panel').forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.panel === name);
    });
  }

  function init() {
    document.querySelectorAll('nav.tabs').forEach((nav) => {
      nav.querySelectorAll('.tab-button').forEach((button) => {
        button.addEventListener('click', () => activate(nav, button.dataset.tab));
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  window.SenlayTabs = { activate };
})();
