# Website Root

This folder contains the public Senlay website.

```text
assets/   Brand and curated public media
scripts/  Front-end JavaScript
styles/   Shared CSS
*.html    Public pages served from the site root
```

For local preview:

```bash
python3 -m http.server 8080
```

Then open `http://127.0.0.1:8080`.

The Live Demo uses production API endpoints for environmental evidence, history and AI responses. The static preview does not implement those services. Open https://senlay.cloud/demo for the working product.
