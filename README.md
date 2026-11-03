<p align="center">
  <img src="public/assets/brand/SenlayLogo-header.png" alt="Senlay" width="220">
</p>

# Senlay — Sensory Layer

Senlay provides physical-world intelligence for autonomous systems and AI applications. This repository contains the public website and browser code for the Senlay MVP. Available observations, model context, source times and uncertainty are shown for the selected location.

[senlay.cloud](https://senlay.cloud) · [API Docs](https://senlay.cloud/docs.html) · [Open Network SDK](https://github.com/smartsurfsolar/senlay-platform) · [Founder Story](public/founder.html)

## Live Demo

[Open the live demo](https://senlay.cloud/demo) to choose an activity and coordinates, inspect environmental evidence, ask follow-up questions, and view structured context.

The history chart requests archives for the chosen location. Where station archives are available, it compares actual observations with archived ECMWF forecasts and shows their difference. Station distance, timestamps and gaps remain visible. Where observations are unavailable, the chart labels the forecast archive separately and disables the difference view. These charts do not establish mission readiness or a historical accuracy score.

## What Is Here

This repository contains the public Senlay website, client scripts, curated assets and an explicitly licensed robotics example bundle:

```text
public/
  assets/       Brand and selected story media
  scripts/      Front-end JavaScript
  styles/       Shared CSS
  index.html    Main landing page
  docs.html     API documentation
  founder.html  Founder story
```

## Preview Locally

`main` holds stable website releases; `develop` holds public website development. The public repository is [smartsurfsolar/Senlay](https://github.com/smartsurfsolar/Senlay), formerly `senlay-world`; the website and API domain is `senlay.cloud`.

The backend, authentication, admin services, provider secrets and memory corpus live in the separate private `senlay-platform-core` repository. This repository's license applies to website content; the separate Open Network SDK uses Apache-2.0. Never merge private backend history into this public repository.

```bash
cd public
python3 -m http.server 8080
```

Then open:

```text
http://127.0.0.1:8080
```

This previews static pages. Use `.html` page URLs locally; extensionless routes, API calls, authentication and archive retrieval are supplied by the private production backend and are not implemented by Python's static server. Use the live demo for a functional end-to-end session.

## Product Pages

- `public/index.html` - Senlay overview
- `public/docs.html` - public API documentation
- `public/agents.html` - AI agent onboarding
- `public/moltbook.html` - Moltbook-focused agent page
- `public/founder.html` - founder story
- `public/pricing.html` - pricing direction
- `public/support.html` - support and contact

## Contact

- Email: [viktor@senlay.cloud](mailto:viktor@senlay.cloud)
- WhatsApp: [+84 3333 801 68](https://wa.me/84333380168)
- LinkedIn: [Viktor Kryvotsiuk](https://www.linkedin.com/in/viktor-kryvotsiuk-0b7449151/)
- Ko-fi: [ko-fi.com/senlay](https://ko-fi.com/senlay)

## Ownership

Copyright 2026 Senlay / SmartSurf Solar. All rights reserved.
