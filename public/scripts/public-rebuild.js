const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');
if (navToggle && nav) {
  if (!nav.id) nav.id = 'site-navigation';
  navToggle.setAttribute('aria-controls', nav.id);
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const sportData = {
  surf: {
    risk: 'Reef contact window rises when low tide, angled swell, and failed paddle-outs overlap.',
    sources: 'Validated or curated bathymetry when available, tide level, swell direction, and rescue-margin markers.',
    decision: 'Warn: move peak, wait for tide, or downgrade to monitored session.'
  },
  kite: {
    risk: 'Offshore wind drift and gust spread matter more than clean average wind speed.',
    sources: 'Nearest live wind, gust factor, launch geometry, current, downwind escape zones.',
    decision: 'Caution: launch only with buddy, avoid offshore tack, keep rescue threshold low.'
  },
  sup: {
    risk: 'Distance from shore, headwind return, chop, and current can turn a calm start into a rescue.',
    sources: 'Wind trend, current vector, tide phase, route bearing, fatigue duration.',
    decision: 'Monitor: shorten route and require check-in at the turn point.'
  },
  foil: {
    risk: 'High speed plus a charted or curated shallow hazard or crowded channel creates a small error window.',
    sources: 'Validated chart or curated spot hazard, traffic zone, wind shadow, wave period, board speed.',
    decision: 'Warn: keep foil line outside shallow contour and avoid overlap with swimmers.'
  },
  sailing: {
    risk: 'Squall lines, gust front timing, tide gate, and lee-shore geometry dominate the call.',
    sources: 'Radar nowcast, METAR, buoy trend, tide current, route exposure.',
    decision: 'Go/no-go: delay departure or reef early when front timing crosses route.'
  },
  wing: {
    risk: 'Wing drift after fall, foil impact, and offshore wind combine quickly in marginal conditions.',
    sources: 'Wind angle, board separation, current, depth, rider stop duration.',
    decision: 'Escalate: check-in after stop plus separation and offshore vector.'
  }
};

document.querySelectorAll('[data-sport]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-sport]').forEach((b) => b.classList.remove('is-active'));
    button.classList.add('is-active');
    const data = sportData[button.dataset.sport] || sportData.surf;
    document.querySelector('[data-risk]').textContent = data.risk;
    document.querySelector('[data-sources]').textContent = data.sources;
    document.querySelector('[data-decision]').textContent = data.decision;
  });
});
