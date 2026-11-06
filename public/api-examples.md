# Senlay API examples


## Current availability and scope

Senlay is an evaluation beta and is pre-revenue. Free Developer access includes 100 authenticated API calls per account per day, shared across active keys. Paid subscriptions are planned, not launched. Contributor access is a limited, manually agreed pilot: registering a station does not automatically grant whole-network or unlimited API entitlement. Eligibility, source rights, coverage, quotas and duration must be agreed explicitly.

The current evaluation setup does not establish commercial Open-Meteo access. Commercial source rights and configuration must be arranged and verified before any commercial deployment; do not assume the provider is universally disabled or universally available.

For drones, Senlay presents wind observations and available model indications of rain and thunderstorms. Local rainfall and lightning are not directly measured by this assessment. Aircraft limits, route, altitude, visibility and operational permission remain outside its scope. The existing request parameter `profile=wind` is unchanged. Other available layers do not establish whole-mission suitability.

The Live Demo presents Environmental Intelligence, AI Explanation and Machine-Readable Context for the same location snapshot. Deterministic evidence remains separate from the AI interpretation. Compare the explanation against the underlying sources and unknowns. Reference adapters and explicitly synthetic offline replay are documented at https://senlay.cloud/robotics/; real-hardware validation remains pending.


## Browser URL / no-key agent trial

```text
https://senlay.cloud/api/v1/try-sense?lat=37.6213&lng=-122.3790&field=drone&agentName=ExampleAgent&request=Summarize%20available%20wind%20and%20marine%20evidence%20and%20unknowns
```

## Live self-updating page

```text
https://senlay.cloud/agents/live?lat=37.6213&lng=-122.3790&field=drone&agentName=ExampleAgent&request=Summarize%20available%20wind%20and%20marine%20evidence%20and%20unknowns
```

## Scoped drone wind evidence request

The authenticated request below uses `field=drone&profile=wind`. A non-2xx response is an API error, never evidence; inspect `outcome`, `evaluation_scope`, `unknowns`, and timestamps/source distance in the returned layers. For drones, Senlay presents wind observations and available model indications of rain and thunderstorms. Local rainfall and lightning are not directly measured by this assessment. Aircraft limits, route, altitude, visibility and operational permission remain outside its scope.

```bash
curl --fail-with-body -H "Authorization: Bearer $SENLAY_API_KEY" \
  "https://senlay.cloud/api/v1/pwm?lat=37.6213&lng=-122.3790&field=drone&profile=wind"
```

The response includes `risk_assessment.outcome`, `risk_assessment.evaluation_scope`, and `risk_assessment.unknowns`; source details are under `pwm.layers.*.current_source`.

## curl: plain-text verification context

```bash
curl -H "Authorization: Bearer sl_live_your_key" \
  "https://senlay.cloud/api/v1/sense?lat=37.6213&lng=-122.3790&field=drone"
```

## curl: structured JSON

```bash
curl -H "Authorization: Bearer sl_live_your_key" \
  "https://senlay.cloud/api/v1/pwm?lat=37.6213&lng=-122.3790&field=drone&profile=wind"
```

## curl: operational risk events

```bash
curl -H "Authorization: Bearer sl_live_your_key" \
  "https://senlay.cloud/api/v1/risk-events?lat=37.6213&lng=-122.3790&field=drone"
```

The 100/day account request allowance and hourly source-refresh capacity are separate. Cache hits can count as API requests without consuming a fresh source refresh. Some rejected pre-fetch requests are refunded; attempted upstream failures are not generally refundable. On structured 503, inspect `code`, `Retry-After`, and `retry_after_seconds`, then back off. Default adapter cadence is 120 seconds.

The current risk endpoint requires `lat` and `lng` and derives events for that coordinate. It does not support a `status` query filter. Use `/api/v1/risk-events/recent` for persisted records and its documented type, severity, subject, time-window, and optional location filters.

## JavaScript fetch

```js
const res = await fetch(
  "https://senlay.cloud/api/v1/pwm?lat=37.6213&lng=-122.3790&field=drone&profile=wind",
  { headers: { Authorization: `Bearer ${process.env.SENLAY_API_KEY}` } }
);
const data = await res.json();
console.log(data.context_string || data.pwm?.context_string);
```

## Python requests

```python
import os
import requests

url = "https://senlay.cloud/api/v1/sense"
params = {"lat": 36.01, "lng": -5.60, "field": "drone"}
headers = {"Authorization": f"Bearer {os.environ['SENLAY_API_KEY']}"}

response = requests.get(url, params=params, headers=headers, timeout=30)
response.raise_for_status()
print(response.text)
```

## Example LLM system prompt

```text
You are helping a drone software team evaluate Senlay's wind-evidence workflow. For a selected coordinate, inspect the returned wind observations and model values, their sources, timestamps, distance, disagreement and unknowns. Summarize available evidence for operator review. Do not treat profile coverage or a configured threshold outcome as flight clearance, and do not invent missing measurements. The operator remains responsible for mission decisions.
```

## Example agent behavior

For the drone workflow under evaluation, request a coordinate and inspect the wind evidence and returned unknowns. If a coordinate or domain is missing, ask for it. Describe observations separately from model values; do not turn a status, coverage label or configured flag into an operational recommendation. Use other domains only within their documented scope.
## MCP gateway contract

Endpoint: `https://senlay.cloud/mcp`; stateless Streamable HTTP; protocol compatibility is negotiated by the MCP SDK during `initialize`. The four tools are `sense_location`, `check_operability`, `list_domains`, and `get_forecast_trust`. `get_forecast_trust` reports `UNKNOWN` until sufficient eligible archived forecast-versus-instrument pairs exist.

## Reading comparisons and history

Current Model Agreement describes the current comparison, not historical forecast accuracy. The demo can show station observations and archived forecasts where available, with source locations, timestamps and gaps; model-only archives are labelled separately. This chart does not calculate a historical trust score. Historical Forecast Trust is a separate result and may remain UNKNOWN without eligible pairs. Place Memory describes historical baselines, not a trained local forecast.

## Multi-station wind checks

Senlay cross-checks fresh nearby station wind readings independently of the forecast. The station_consistency result flags calm-report disagreements and strong outliers for review, with peer values and timestamps. Suspect primary readings lower assessment confidence. This snapshot screening does not confirm equipment failure, calibration or persistent stuck sensors; local shelter and measurement heights can also explain differences.
