# AdFlare
Static landing page (HTML + CSS, no build step).

## Deploy on GitHub Pages
1. Push the CONTENTS of this folder to the repo root (index.html must be at the root).
2. Settings → Pages → Deploy from a branch → `main` / `(root)` → Save.
3. Live at `https://<user>.github.io/<repo>/`.

Notes
- Folder must be named `img` (lowercase). GitHub is case-sensitive.
- Run `sh check-assets.sh` before pushing.
- Max 100 MB per file.

## Flare (AI assistant)
- Lives in the nav bar: "Ask Flare" opens the AI bar (waveform, type or mic). Files: `flare.js`, `flare.css`, `tour.js`, `portfolio-ui.css`.
- Mic uses the browser's speech recognition (Chrome, Edge, Safari). Needs HTTPS, which GitHub Pages already has.
- Delete `flare.js` + `flare.css` to remove her.
- "Hey Flare" (hands-free): tap the mic icon next to Ask Flare (or the mic icon inside her answer card on phones). While it is on, the browser listens for her name ("Hey Flare", "Flare") and she opens, answers out loud and listens for your question. It is OFF by default, the browser shows its own mic indicator, and nothing is recorded or sent by the site. The turn-off is the same icon. Needs HTTPS and the tab open.
