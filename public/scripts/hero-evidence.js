/* One real, source-attributed coordinate snapshot; no synthetic fallback. */
(async () => {
  const card = document.getElementById('liveEvidence');
  if (!card) return;
  const set = (id, value) => { document.getElementById(id).textContent = value; };
  const number = value => typeof value === 'number' && Number.isFinite(value);
  const wind = value => number(value) ? `${value.toFixed(1)} km/h` : 'unavailable';
  const time = value => {
    const date = new Date(value);
    return value && Number.isFinite(date.getTime()) ? date.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC') : 'time unavailable';
  };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch('/api/pwm?lat=37.7749&lng=-122.4194&field=drone&profile=wind&view=full', { signal: controller.signal, cache: 'no-store' });
    if (!response.ok) throw new Error('Snapshot unavailable');
    const data = await response.json();
    const sensors = data.sensors || {};
    const comparisons = sensors.forecast_agreement?.comparisons || [];
    const comparison = comparisons.find(item => item.field === 'wind_speed');
    const gust = comparisons.find(item => item.field === 'wind_gust');
    const source = comparison?.primary_source || sensors.forecast_agreement?.primary_sensor;
    const observed = comparison?.hardware_value;
    const model = comparison?.model_value;
    set('heroObservation', number(observed) ? `Station reports ${wind(observed)}${number(gust?.hardware_value) ? ` · gust ${wind(gust.hardware_value)}` : ''}` : 'Physical wind observation unavailable');
    const distance = number(source?.distance_km) ? ` · ${source.distance_km} km away` : '';
    set('heroSource', source ? `${source.name || source.station_id || 'Station'}${source.source ? ` (${source.source})` : ''}${distance} · measured ${time(source.observed_at)}` : 'No physical station returned');
    const nearby = (sensors.forecast_agreement?.comparison_sensors || [])
      .filter(item => number(item.wind_speed_kmh))
      .slice(0, 3);
    set('heroNearby', nearby.length ? nearby.map(item => `${item.name || item.station_id}: ${wind(item.wind_speed_kmh)}${number(item.distance_km) ? ` · ${item.distance_km} km away` : ''} · ${time(item.observed_at)}`).join('; ') : 'No other wind observations returned');
    const valid = sensors.layers?.atmosphere?.model_current?.valid_at;
    set('heroForecast', number(model) ? `Wind ${wind(model)} · model value · valid ${time(valid)}` : 'Comparable forecast unavailable');
    if (number(observed) && number(model)) {
      const delta = observed - model;
      set('heroDifference', delta === 0 ? 'Observed wind matches model' : `Observed wind is ${wind(Math.abs(delta))} ${delta > 0 ? 'higher' : 'lower'} than model`);
    } else set('heroDifference', 'Comparison unavailable');
    set('heroEvidenceStatus', number(observed) ? 'Station-level wind + model comparison' : 'Partial real evidence');
    set('heroEvidenceTime', `Snapshot: ${time(data.snapshot?.captured_at || sensors.timestamp)}. Latest available readings. Wind is station-specific, not a city-wide measurement. Station exposure and calibration are unverified.`);
  } catch {
    set('heroEvidenceStatus', 'Live evidence temporarily unavailable');
    for (const id of ['heroObservation', 'heroSource', 'heroNearby', 'heroForecast', 'heroDifference']) set(id, 'Unavailable');
    set('heroEvidenceTime', 'Could not load current evidence. Open the Live Demo to request a location.');
  } finally {
    clearTimeout(timeout);
    card.setAttribute('aria-busy', 'false');
  }
})();
