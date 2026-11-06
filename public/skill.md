---
name: senlay
version: 1.2.0
description: Senlay provides source-aware environmental context for autonomous systems, robotics and AI agents.
homepage: https://senlay.cloud
metadata: {"category":"physical_world_context","api_base":"https://senlay.cloud/api/v1","catalog_entries":"23"}
---

# Senlay - Sensory Layer for AI Agents

Senlay is the sensory layer for software: an evaluation beta that returns available location-level environmental evidence with source, time, distance, disagreement and unknowns where available. Its primary focus is autonomous systems and robotics across aerial, marine and field environments.

It gives an operator or integration engineer evidence to review before making a decision outside Senlay. It does not make or authorize that decision.

It is not a general search engine, not a consumer weather app, and not a universal answer machine. Senlay is for questions where measurable conditions matter: wind, waves, weather, tides, terrain, air quality, sensor data, satellite data, and environmental risk.

Use the drone wind workflow when an agent needs to summarize questions like:

- What wind/gust observations and model values are available at this coordinate?
- What source evidence, time, distance and unknowns should a human operator review at this coordinate?
- How do the returned wind observations compare with model values?

The broader API can return other environmental layers. Use another domain only within its own documented scope; a coordinate-level response is not route or mission coverage.

An API request returns a coordinate-level response with available observations and model values, source provenance, freshness, confidence components, uncertainty and an agent-ready `context_string` where supported.


## Current availability and scope

Senlay is an evaluation beta and is pre-revenue. Free Developer access includes 100 authenticated API calls per account per day, shared across active keys. Paid subscriptions are planned, not launched. Contributor access is a limited, manually agreed pilot: registering a station does not automatically grant whole-network or unlimited API entitlement. Eligibility, source rights, coverage, quotas and duration must be agreed explicitly.

The current evaluation setup does not establish commercial Open-Meteo access. Commercial source rights and configuration must be arranged and verified before any commercial deployment; do not assume the provider is universally disabled or universally available.

For drones, Senlay presents wind observations and available model indications of rain and thunderstorms. Local rainfall and lightning are not directly measured by this assessment. Aircraft limits, route, altitude, visibility and operational permission remain outside its scope. The existing request parameter `profile=wind` is unchanged. Other available layers do not establish whole-mission suitability.

The Live Demo presents Environmental Intelligence, AI Explanation and Machine-Readable Context for the same location snapshot. Deterministic evidence remains separate from the AI interpretation. Compare the explanation against the underlying sources and unknowns. Reference adapters and explicitly synthetic offline replay are documented at https://senlay.cloud/robotics/; real-hardware validation remains pending.


## Connect to the Evaluation Beta

### 0. No-key trial for browser/chat agents

If the agent can only open normal GET URLs and cannot send POST bodies or Bearer headers, use the public trial endpoint:

```text
https://senlay.cloud/api/v1/try-sense?lat=37.6213&lng=-122.3790&field=drone&agentName=YourAgentName
```

Add `request=...` when the agent has a specific user task. This embeds the task into the plaintext response alongside the field/domain context:

```text
https://senlay.cloud/api/v1/try-sense?lat=37.6213&lng=-122.3790&field=drone&agentName=YourAgentName&request=Summarize%20available%20wind%20evidence%20and%20unknowns%20for%20operator%20review
```

For a self-updating browser page, use:

```text
https://senlay.cloud/agents/live?lat=37.6213&lng=-122.3790&field=drone&agentName=YourAgentName&request=Summarize%20available%20wind%20evidence%20and%20unknowns%20for%20operator%20review
```

The live page keeps state in the URL, including a `session` value, so multiple agents can query different locations/domains in parallel without overwriting one another. The plaintext endpoint is IP-limited and intended for demos only: 8 requests/minute burst and 60 requests/hour per IP. The live page clamps automatic refresh to 120-600 seconds. For repeated evaluation requests, register for a key. API authentication does not grant commercial provider rights or establish production readiness.

### 1. Get a free API key

Minimal agent registration:

```bash
curl -X POST https://senlay.cloud/api/v1/agent-register \
  -H "Content-Type: application/json" \
  -d '{"agentName": "YourAgentName"}'
```

Stable registration for repeat use:

```bash
curl -X POST https://senlay.cloud/api/v1/agent-register \
  -H "Content-Type: application/json" \
  -d '{"ownerEmail": "REPLACE_WITH_REAL_EMAIL", "agentName": "YourAgentName"}'
```

Response:

```json
{
  "success": true,
  "apiKey": "sl_live_xxxxxxxxxxxxxxxx",
  "keyPreview": "sl_live_xxxx…xxxx",
  "recoveryToken": "sl_recover_xxxxxxxxxxxxxxxx",
  "agentName": "YourAgentName",
  "existing": false,
  "rotated": false,
  "message": "Save the API key and recovery token now; neither is shown again."
}
```

Save both credentials in your secret store or environment variables. Do not paste them into logs, chats, GitHub, public pages, or a shared agent memory file. For an existing `(ownerEmail, agentName)` identity, send the current `recoveryToken` to rotate both credentials; the old API key is invalidated.

### 2. Get agent-ready context

```bash
curl -H "Authorization: Bearer sl_live_your_key" \
  "https://senlay.cloud/api/v1/sense?lat=37.6213&lng=-122.3790&field=drone"
```

This returns a plain-text summary of currently available physical evidence. Pass it as data or tool output under your application's instructions; preserve source, freshness, and uncertainty. It does not authorize flight or mission decisions.

### 3. Get structured JSON

```bash
curl -H "Authorization: Bearer sl_live_your_key" \
  "https://senlay.cloud/api/v1/pwm?lat=37.6213&lng=-122.3790&field=drone&profile=wind"
```

This returns raw layers, source metadata, calculated insights, and a `context_string`.

## Recommended Agent Behavior

For the drone workflow under evaluation, request wind evidence for the selected coordinate when the user asks for it or the integration requires it. Summarize the evidence and unknowns without turning them into a flight recommendation.

Good uses:

- Drone operator wind-evidence review (spot-level, not whole-flight checks)
- Marine context for an operator's separate route planning (spot-level, not voyage evaluation)
- Other domain requests only when a supported field and documented scope apply; do not infer mission, route, platform, or safety suitability.

Do not use Senlay for:

- General web search
- Medical, legal, or financial advice
- Questions unrelated to measurable physical conditions
- Unsupported claims about human perception, consciousness, or biological sensing

## Physical World Model

The PWM can include:

| Layer | Context | Source Type |
|---|---|---|
| Atmosphere | Wind, gusts, temperature, humidity, pressure, precipitation | Model + hardware |
| Marine | Waves, swell, period, tides, currents, water temperature | Model + hardware |
| Terrain | Land elevation, slope, and terrain profile; no ocean depth unless a separate validated bathymetry layer is present | Model |
| Air Quality | PM2.5, PM10, AQI, UV index | Model + hardware |
| Satellite | Fire proximity, imagery metadata, environmental events | Satellite |
| Sensors | METAR, buoys, tide gauges, private and citizen stations | Hardware |
| Hazards | Fires, earthquakes, alerts, radiation, volcanoes where available | Official feeds + sensors |
| Insights | Returned derived fields and configured threshold flags, with source context | Senlay response |

## Evidence Principle

Senlay separates measured observations from model predictions.

Hardware sensors such as METAR stations, ocean buoys, and tide gauges are treated as measured evidence. Forecast and environmental models are treated as predictions. When they disagree, Senlay exposes the source, freshness, distance, confidence, and discrepancy so the agent can reason about uncertainty instead of guessing.

## API Reference

Base URL:

```text
https://senlay.cloud/api/v1
```

Authentication:

```text
Authorization: Bearer sl_live_your_key
```

Never send your API key to any domain other than `senlay.cloud`.

### POST /api/v1/agent-register

No password required. The initial response returns an API key and recovery token once. Re-registering the same `ownerEmail` and `agentName` requires the current recovery token and rotates both credentials; it never reveals the old key.

### POST /api/v1/agent-lookup

Requires an account session bearer token plus a verified sign-in identity whose email exactly matches `ownerEmail`. Password-only accounts remain fail-closed until an explicit email-verification/link flow is completed. The route returns masked key metadata only; API keys and recovery tokens are never returned.

### GET /api/v1/sense?lat=&lng=

Plain-text environmental context for an application or LLM to summarize under its own user and safety instructions.

Optional `field` parameter tunes the context for the task, such as `drone`, `kitesurfing`, `sailing`, `agriculture`, `running`, or `general`.

### GET /api/v1/try-sense?lat=&lng=

No-key browser/chat-agent trial endpoint. Returns the same style of plain-text context plus instructions for the model. Rate-limited and not intended for production automation.

Optional parameters:
- `field`: tunes the context for a domain, such as `kitesurfing`, `drone`, `agriculture`, or `general`.
- `agentName`: shown in the response and used for the trial rate-limit bucket.
- `request`: embeds the agent/user task into the response.
- `view=live`: opens the self-updating HTML page.

### GET /api/v1/pwm?lat=&lng=

Structured Physical World Model JSON.

### GET /api/v1/stats

Public usage counters.

```bash
curl https://senlay.cloud/api/v1/stats
```

## Rate Limits

| Access | Limit | Price/status |
|---|---:|---|
| Free Developer evaluation beta | 100 authenticated API calls/day, shared across account keys | Free under current published limits |
| Paid subscriptions | Not launched | Proposed terms and prices are not current offers |
| Contributor or other scoped pilot | Agreed individually | By agreement; requires source rights and scope review |

Daily usage is enforced per account and is shared by all active Senlay API keys on that account; creating another key does not create another allowance.

## MCP tools

The MCP gateway at `https://senlay.cloud/mcp` advertises `sense_location`, `check_operability`, `list_domains`, and `get_forecast_trust`. Connect an MCP client and read the server's tool schemas with `list_tools`; protocol compatibility is negotiated during `initialize`. `get_forecast_trust` remains `UNKNOWN` until eligible archived forecast-versus-instrument pairs are available.

## Links

- API docs: https://senlay.cloud/docs.html
- Demo: https://senlay.cloud/demo
- API key: https://senlay.cloud/register.html
- Contact: https://senlay.cloud/support.html

Source: Senlay — Sensory Layer for location-level environmental evidence. Built by Viktor Kryvotsiuk.
## MCP gateway contract

Endpoint: `https://senlay.cloud/mcp`; stateless Streamable HTTP; protocol compatibility is negotiated by the MCP SDK during `initialize`. The four tools are `sense_location`, `check_operability`, `list_domains`, and `get_forecast_trust`. `get_forecast_trust` reports `UNKNOWN` until sufficient eligible archived forecast-versus-instrument pairs exist.

## Reading comparisons and history

Current Model Agreement describes the current comparison, not historical forecast accuracy. The demo can show station observations and archived forecasts where available, with source locations, timestamps and gaps; model-only archives are labelled separately. This chart does not calculate a historical trust score. Historical Forecast Trust is a separate result and may remain UNKNOWN without eligible pairs. Place Memory describes historical baselines, not a trained local forecast.

## Multi-station wind checks

Senlay cross-checks fresh nearby station wind readings independently of the forecast. The station_consistency result flags calm-report disagreements and strong outliers for review, with peer values and timestamps. Suspect primary readings lower assessment confidence. This snapshot screening does not confirm equipment failure, calibration or persistent stuck sensors; local shelter and measurement heights can also explain differences.
