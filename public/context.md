# Senlay context

Senlay is a physical-world intelligence infrastructure beta for autonomous systems, robotics and AI applications. It returns available environmental observations and model context for a coordinate with source, time, distance, disagreements and unknowns where available.


## Current availability and scope

Senlay is an evaluation beta and is pre-revenue. Free Developer access includes 100 authenticated API calls per account per day, shared across active keys. Paid subscriptions are planned, not launched. Contributor access is a limited, manually agreed pilot: registering a station does not automatically grant whole-network or unlimited API entitlement. Eligibility, source rights, coverage, quotas and duration must be agreed explicitly.

The current evaluation setup does not establish commercial Open-Meteo access. Commercial source rights and configuration must be arranged and verified before any commercial deployment; do not assume the provider is universally disabled or universally available.

For drones, Senlay presents wind observations and available model indications of rain and thunderstorms. Local rainfall and lightning are not directly measured by this assessment. Aircraft limits, route, altitude, visibility and operational permission remain outside its scope. The existing request parameter `profile=wind` is unchanged. Other available layers do not establish whole-mission suitability.

The Live Demo presents Environmental Intelligence, AI Explanation and Machine-Readable Context for the same location snapshot. Deterministic evidence remains separate from the AI interpretation. Compare the explanation against the underlying sources and unknowns. Reference adapters and explicitly synthetic offline replay are documented at https://senlay.cloud/robotics/; real-hardware validation remains pending.


## What makes Senlay different

Senlay aims to make the following available source evidence inspectable together. This is an output description, not a blanket comparison with every weather provider:

- measured/model conditions
- source identity
- source type
- distance from source
- timestamp and freshness
- confidence
- hardware/model disagreement
- operational `risk_event` alerts for station/lifeguard workflows
- domain interpretation
- `context_string` for LLMs
- structured JSON for applications

## First workflow being evaluated

An operator or integration engineer can review available wind observations and forecasts for a selected coordinate before making a decision outside Senlay. The current drone profile does not evaluate a whole route or mission. Broader domains may use other API fields, but each requires its own documented scope and validation.

## Source families

Senlay uses "23 catalog entries (not a count of live sources at any coordinate)" as the standard wording. Availability varies by location and configured tier. Some source families are active by default, some require optional provider keys, partner access, licensing review, or attribution. Marine/watersports context may include buoys, ship observations, tide gauges, current meters/predictions, USGS river/inlet stations, webcam visual checks, global tide prediction fallbacks, and cached ocean-background layers when configured.

## API quickstart

No-key trial:

```bash
curl "https://senlay.cloud/api/v1/try-sense?lat=37.6213&lng=-122.3790&field=drone&request=Summarize%20available%20wind%20and%20marine%20evidence%20and%20unknowns"
```

Authenticated plain-text context:

```bash
curl -H "Authorization: Bearer sl_live_your_key" \
  "https://senlay.cloud/api/v1/sense?lat=37.6213&lng=-122.3790&field=drone"
```

Authenticated structured JSON:

```bash
curl -H "Authorization: Bearer sl_live_your_key" \
  "https://senlay.cloud/api/v1/pwm?lat=37.6213&lng=-122.3790&field=drone&profile=wind"
```

Authenticated risk events:

```bash
curl -H "Authorization: Bearer sl_live_your_key" \
  "https://senlay.cloud/api/v1/risk-events?lat=37.6213&lng=-122.3790&field=drone"
```

The current risk endpoint requires coordinates and does not accept `status` as a query filter. Use `/api/v1/risk-events/recent` when you need persisted records and supported audit filters.

## Safety

Senlay provides evidence, context, risk-event support, and decision support. It is not a final safety authority. Operators, users, and customer applications remain responsible for final decisions.
## MCP gateway contract

Endpoint: `https://senlay.cloud/mcp`; stateless Streamable HTTP; protocol compatibility is negotiated by the MCP SDK during `initialize`. The four tools are `sense_location`, `check_operability`, `list_domains`, and `get_forecast_trust`. `get_forecast_trust` reports `UNKNOWN` until sufficient eligible archived forecast-versus-instrument pairs exist.

## Reading comparisons and history

Current Model Agreement describes the current comparison, not historical forecast accuracy. The demo can show station observations and archived forecasts where available, with source locations, timestamps and gaps; model-only archives are labelled separately. This chart does not calculate a historical trust score. Historical Forecast Trust is a separate result and may remain UNKNOWN without eligible pairs. Place Memory describes historical baselines, not a trained local forecast.

## Multi-station wind checks

Senlay cross-checks fresh nearby station wind readings independently of the forecast. The station_consistency result flags calm-report disagreements and strong outliers for review, with peer values and timestamps. Suspect primary readings lower assessment confidence. This snapshot screening does not confirm equipment failure, calibration or persistent stuck sensors; local shelter and measurement heights can also explain differences.
