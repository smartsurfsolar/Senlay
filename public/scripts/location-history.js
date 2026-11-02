/* Real station and forecast archives for the currently selected location. */
(() => {
  let archive = null, parameter = 'wind_kmh', view = 'comparison', controller = null, generation = 0, message = 'Connect to load history for this location.';
  const key = (lat,lng) => `${Number(lat)},${Number(lng)}`;
  const currentKey = () => typeof state === 'undefined' ? '' : key(state.lat,state.lng);
  const data = () => archive && key(archive.requested.lat,archive.requested.lng) === currentKey() ? archive : null;
  const label = () => parameter === 'wind_kmh' ? 'Wind' : 'Temperature';
  const unit = () => parameter === 'wind_kmh' ? 'km/h' : '°C';
  const predicted = point => point['forecast_' + parameter];
  const delta = point => Number.isFinite(point[parameter]) && Number.isFinite(predicted(point)) ? Math.round((point[parameter]-predicted(point))*10)/10 : null;
  const time = (value, detail = false) => new Intl.DateTimeFormat('en-GB',{timeZone:'UTC',year:'numeric',month:'short',day:'2-digit',...(detail?{hour:'2-digit',minute:'2-digit',hour12:false}:{})}).format(new Date(value));
  const pairedCount = () => (data()?.points || []).filter(point=>delta(point)!==null).length;
  function describe(index) {
    const archive=data(),point=archive.points[index],difference=delta(point);
    const observed=archive.mode==='forecast_only'?'':` · observed ${point[parameter]??'unavailable'} ${unit()} · ${archive.station.id} / IEM`;
    const forecast=point.forecast_valid_at?` · ECMWF +24h forecast ${predicted(point)??'unavailable'} ${unit()} valid ${time(point.forecast_valid_at,true)} UTC`:'';
    const offset=point.match_offset_seconds===null||point.match_offset_seconds===undefined?'':` · observation offset ${point.match_offset_seconds/60} min`;
    return `${time(point.time,true)} UTC${observed}${forecast}${offset}${difference!==null?` · fact − forecast ${difference>0?'+':''}${difference} ${unit()}`:''}`;
  }
  window.inspectHistoricalPoint=index=>{const target=document.getElementById('historyReadout');if(target&&data()?.points[index])target.textContent=describe(index);};
  document.addEventListener('focusin',event=>{const index=event.target?.getAttribute?.('data-history-index');if(index!==null&&index!==undefined)window.inspectHistoricalPoint(Number(index));});
  function plot() {
    const points=data().points;
    const difference=view==='difference'&&pairedCount()>0;
    const series=difference?[{get:delta,color:'#ffcb70',at:p=>p.time}]:[{get:p=>p[parameter],color:'#20cfa0',at:p=>p.time},{get:predicted,color:'#6baaff',at:p=>p.forecast_valid_at}];
    const values=series.flatMap(s=>points.map(s.get)).filter(Number.isFinite);
    if(!values.length)return '<p>No historical values are available for this parameter.</p>';
    const timestamps=series.flatMap(s=>points.filter(p=>Number.isFinite(s.get(p))&&s.at(p)).map(p=>Date.parse(s.at(p))));
    const start=Math.min(...timestamps),end=Math.max(...timestamps);
    const extent=Math.max(1,Math.ceil(Math.max(...values.map(Math.abs))));
    const low=difference?-extent:parameter==='wind_kmh'?0:Math.floor(Math.min(...values));
    const high=difference?extent:Math.max(low+1,Math.ceil(Math.max(...values)));
    const x=t=>8+(Date.parse(t)-start)/(end-start||1)*984;
    const y=value=>150-(value-low)/(high-low)*140;
    let marks='';
    for(const seriesItem of series){
      let previous=null;
      points.forEach((point,index)=>{
        const value=seriesItem.get(point),at=seriesItem.at(point);
        if(!Number.isFinite(value)||!at){previous=null;return;}
        const previousTime=previous&&seriesItem.at(previous);
        if(previous&&Date.parse(at)-Date.parse(previousTime)<=90*60000&&Date.parse(at)>Date.parse(previousTime))marks+=`<line pointer-events="none" x1="${x(previousTime)}" y1="${y(seriesItem.get(previous))}" x2="${x(at)}" y2="${y(value)}" stroke="${seriesItem.color}" stroke-width="2" vector-effect="non-scaling-stroke"/>`;
        marks+=`<circle cx="${x(at)}" cy="${y(value)}" r="4" fill="${seriesItem.color}" tabindex="0" data-history-index="${index}" role="button" aria-label="${escHtml(describe(index))}" onmouseenter="inspectHistoricalPoint(${index})" onclick="inspectHistoricalPoint(${index})"><title>${escHtml(describe(index))}</title></circle>`;
        previous=point;
      });
    }
    return `<div class="history-scale"><span>${difference?'Fact − forecast':label()} (${unit()})</span><span>${low}–${high} ${unit()}</span></div><svg viewBox="0 0 1000 160" preserveAspectRatio="none" role="group" aria-label="Historical ${label().toLowerCase()} for ${escHtml(data().station?.name||'selected coordinates')}; UTC; gaps are unconnected"><line pointer-events="none" x1="8" y1="${low<=0&&high>=0?y(0):150}" x2="992" y2="${low<=0&&high>=0?y(0):150}" stroke="#889ca8" stroke-dasharray="5 4"/>${marks}</svg><div class="history-dates"><span>${time(start)}</span><span>${time((start+end)/2)}</span><span>${time(end)}</span></div>`;
  }
  function refresh() {
    const target=document.getElementById('locationHistory');if(target)target.outerHTML=window.renderHistoricalSensorChart();
  }
  window.setHistoricalSensorParameter=next=>{if(['wind_kmh','temperature_c'].includes(next)){parameter=next;if(!pairedCount())view='comparison';refresh();}};
  window.setHistoricalSensorView=next=>{if(['comparison','difference'].includes(next)&&(next!=='difference'||pairedCount())){view=next;refresh();}};
  window.resetHistoricalSensorHistory=()=>{controller?.abort();generation++;archive=null;message='Connect to load history for this location.';refresh();};
  window.loadHistoricalSensorHistory=async(lat,lng)=>{
    controller?.abort();controller=new AbortController();const requestController=controller;const request=++generation,requestedKey=key(lat,lng);
    archive=null;message='Loading real station observations and archived forecasts for this location…';refresh();
    const timeout=setTimeout(()=>requestController.abort(),55000);
    try{
      const response=await fetch(`/api/demo/history?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`,{signal:requestController.signal});
      const result=await response.json();
      if(request!==generation||requestedKey!==currentKey())return;
      if(!response.ok||result.status!=='ok'||!result.points?.length){message=result.reason||result.error||'Historical evidence is unavailable for this location.';return;}
      if(key(result.requested.lat,result.requested.lng)!==requestedKey)throw new Error('History location mismatch');
      archive=result;view='comparison';
    }catch(error){if(request===generation)message='Historical sources are unavailable for this location. Reconnect to retry.';}
    finally{clearTimeout(timeout);if(request===generation)refresh();}
  };
  window.renderHistoricalSensorChart=()=>{
    const archive=data();
    if(!archive)return `<section id="locationHistory" class="history-chart" aria-live="polite"><h3 id="historyTitle">Historical observations & archived forecast</h3><p>${escHtml(message)}</p></section>`;
    const station=archive.station,points=archive.points,paired=pairedCount(),modelOnly=archive.mode==='forecast_only';
    const title=modelOnly?'Selected location — 7-Day Forecast Archive':`${station.name} — 7-Day History`;
    const location=`For ${escHtml(state.locationName||'selected location')} (${escHtml(archive.requested.lat)}, ${escHtml(archive.requested.lng)}).`;
    const stationText=modelOnly?'No physical station archive is available nearby. Showing archived forecasts requested at these coordinates.':`Archive station ${escHtml(station.id)}: ${escHtml(station.distance_km)} km away, at ${escHtml(station.lat)}, ${escHtml(station.lng)}. Regional observations may differ from the selected point.`;
    const coverage=modelOnly?`${points.length} forecast valid hours · no observed history`:`${points.length} distinct reports · ${paired} ${label().toLowerCase()} pairs`;
    const legend=modelOnly?'Blue: archived ECMWF forecast, 24-hour lead. Observed history and differences are unavailable.':view==='difference'?'Orange: observation − archived forecast; zero means agreement.':paired?'Green: observations · Blue: archived ECMWF forecast, 24-hour lead.':'Green: real observations. Comparable archived forecasts are unavailable.';
    const controls=[['wind_kmh','Wind speed'],['temperature_c','Temperature']].map(([value,text])=>`<button type="button" data-history-parameter="${value}" aria-pressed="${parameter===value}" onclick="setHistoricalSensorParameter('${value}')">${text}</button>`).join('');
    const sources=archive.sources.observations?`<a href="${escHtml(archive.sources.observations)}" target="_blank" rel="noopener noreferrer">IEM station archive</a>`:'';
    const forecastSource=archive.forecast?`${sources?' + ':''}<a href="https://open-meteo.com/en/docs/previous-runs-api" target="_blank" rel="noopener noreferrer">Open-Meteo Previous Runs</a>, ECMWF IFS 0.25°, model grid ${escHtml(archive.forecast.latitude)}, ${escHtml(archive.forecast.longitude)}; requested at ${modelOnly?'the selected coordinates':'the archive station'}. Wind 10 m, temperature 2 m. ${modelOnly?'':'Station heights unverified. Nearest reports within 10 minutes of forecast valid hours; both times shown in tooltips. '}Exact forecast issue times are not returned.`:'.';
    return `<section id="locationHistory" class="history-chart" aria-labelledby="historyTitle"><h3 id="historyTitle">${escHtml(title)}</h3><p>${location} ${stationText}</p><p>${time(points[0].time,true)} – ${time(points[points.length-1].time,true)} UTC · ${coverage}</p><div class="history-controls" role="group" aria-label="Historical comparison">${controls}<button type="button" data-history-view="comparison" aria-pressed="${view==='comparison'}" onclick="setHistoricalSensorView('comparison')">${modelOnly?'Archived Forecast':'Observation vs Forecast'}</button><button type="button" data-history-view="difference" ${paired?'':'disabled'} aria-pressed="${view==='difference'}" onclick="setHistoricalSensorView('difference')">Difference (fact − forecast)</button></div><p id="historyLegend">${legend}</p><div id="historyPlot">${plot()}</div><p id="historyReadout" class="history-readout" aria-live="polite">Hover, focus or select a point for times, values and sources.</p><p>Sources: ${sources}${forecastSource} Gaps remain unconnected; no historical trust score is calculated.</p></section>`;
  };
})();
