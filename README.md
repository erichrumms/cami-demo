# CPMI Pre-Prototype Demo

**Cognitive Program Management Infrastructure · Interactive Leadership Demo**

A three-screen React/Vite application demonstrating the CPMI decision trace experience for federal program management. All data is hardcoded — no backend, no API, no live inference. This is a demonstration of the experience and reasoning logic of CPMI.

## Live Demo

Deployed at Railway. Open the live URL in any browser — no authentication or installation required.

---

## Tech Stack

- React 18 + Vite 5
- Tailwind CSS v3
- Deployed to Railway (static site)

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

Outputs to `dist/` folder. Railway serves this as a static site.

---

## Railway Deployment

### First Deployment

1. Push this repository to GitHub (private repo recommended).
2. Go to [railway.app](https://railway.app) and create a new project.
3. Select **"Deploy from GitHub repo"** and connect this repository.
4. Railway auto-detects the Vite/Node project from `package.json`.
5. Verify these settings in the Railway dashboard:
   - **Build command:** `npm run build`
   - **Start command:** *(leave blank — static site)*
   - **Output directory:** `dist`
6. Click Deploy. Railway provides a public URL under **Deployments**.

### Subsequent Deployments

Push to the `main` branch. Railway auto-deploys on every push.

### Troubleshooting

| Issue | Resolution |
|-------|------------|
| Build fails | Check Railway deploy logs for the exact error. Common cause: Node version mismatch. Set Node version to 18+ in Railway environment variables: `NODE_VERSION=18` |
| Tailwind styles not applying | Verify `tailwind.config.js` content array includes `./src/**/*.{js,ts,jsx,tsx}` and `postcss.config.js` is present |
| Blank page after deploy | Confirm output directory is set to `dist` in Railway settings |

---

## Application Structure

```
cpmi-demo/
├── src/
│   ├── App.jsx              ← All three screens + state management
│   ├── main.jsx             ← React entry point
│   ├── index.css            ← Tailwind directives + animations
│   └── data/
│       ├── programs.js      ← Five hardcoded program records
│       └── sentinelTrace.js ← Project Sentinel trace content (verbatim)
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Screens

**Screen 1 — Program Portfolio Dashboard**
Five synthetic federal programs. Project Sentinel is visually distinguished with amber styling and an "Agent Analysis Available" button. All cards are clickable and navigate to Screen 2.

**Screen 2 — Decision Trace Viewer**
The core demonstration. An animated agent run produces six Decision Trace components sequentially before the Recommendation renders. Three view toggles: Operational Trace (default), Executive Summary, Full Audit Trace.

**Screen 3 — Human Review & Feedback Loop**
Approve or Override paths. Both populate a Decision Log entry with full chain-of-custody fields and a Feedback Layer DB preview.

---

*CPMI Pre-Prototype · Version 1.0 · Issued by CIA · Approved for Build*
