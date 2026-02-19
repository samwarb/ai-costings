# CLAUDE.md — AI Assistant Guide for `ai-costings`

## Project Overview

This is a **client-side React web application** that generates branded pricing quotes and downloadable PDF documents for AI self-checkout suppliers. It is an internal tool for **Compass UK&I Digital** (contract catering/hospitality).

**Live URL:** https://samwarb.github.io/ai-costings
**Deployed via:** GitHub Pages

### Supported Suppliers

| Supplier | Brand Colour | ID Constant |
|---|---|---|
| Vision Checkout | `#1a56db` (blue) | `VISION_CHECKOUT` |
| AutoCanteen | `#c81e1e` (red) | `AUTOCANTEEN` |
| Deligo | `#057a55` (green) | `DELIGO` |

---

## Tech Stack

| Concern | Technology |
|---|---|
| Language | JavaScript (JSX) — no TypeScript |
| UI Framework | React 18.2 |
| Build Toolchain | Create React App (`react-scripts` 5.0.1) |
| PDF Generation | jsPDF 4.1.0 (fully client-side) |
| Styling | Inline `<style>` tag with class names + CSS custom properties |
| Fonts | Google Fonts — Inter (UI) + Playfair Display (headings) |
| Deployment | GitHub Pages via `gh-pages` package |
| Linting | ESLint (`react-app` preset, configured in `package.json`) |
| Testing | **None** — no test framework is installed |

---

## Repository Structure

```
ai-costings/
├── public/
│   └── index.html          # HTML shell; sets page title; loads Google Fonts
├── src/
│   ├── index.js            # React entry point — renders <App /> in StrictMode
│   └── App.jsx             # ENTIRE application (617 lines) — all logic lives here
├── package.json            # Scripts, dependencies, ESLint config, homepage URL
├── package-lock.json       # Locked dependency tree (commit this file)
├── .gitignore              # Ignores: node_modules/, build/, .env, .DS_Store
└── README.md               # Setup and deployment instructions
```

**This is a deliberately flat, single-file architecture.** All pricing logic, PDF generation, React components, and styles live in `src/App.jsx`. Do not split files unnecessarily for small changes.

---

## Development Commands

```bash
# Install dependencies
npm install

# Run locally at http://localhost:3000
npm start

# Build for production (outputs to build/)
npm run build

# Deploy to GitHub Pages (runs build first via predeploy hook)
npm run deploy
```

---

## Architecture: `src/App.jsx`

### Key Sections

| Lines | What it contains |
|---|---|
| 1–2 | Imports: `useState`, `useRef`, `useEffect` from React; `jsPDF` |
| 4–7 | Base64-encoded logo images (very long lines — Vision Checkout, AutoCanteen, Deligo, Compass) |
| 10–11 | Formatting utilities: `fmt` (GBP currency) and `fmtN` (decimal number) |
| 13–17 | `SUPPLIERS` constant — maps supplier IDs to `{ name, color, logo }` |
| 19–23 | `getSteps(supplier)` — returns the ordered wizard step array for a given supplier |
| 25–72 | `calcQuote()` — **pricing engine** (all hardcoded cost constants live here) |
| 80–219 | `makeSummaryPDF()` — generates portrait A4 summary PDF |
| 222–352 | `makeBreakdownPDF()` — generates landscape A4 detailed breakdown PDF |
| 356–365 | `AnimatedNumber` component — smooth counter animation for live totals |
| 367–617 | `App` — main component with all state, navigation logic, styles, and JSX |

### Wizard Step Flow

```
All suppliers:  supplier → quantities → sme → siteinfo → summary
Deligo only:    supplier → t2e → quantities → sme → siteinfo → summary
```

The `t2e` step asks whether a T2E system is already in place — this affects Deligo's annual cost calculation (Control Desk Fee of £625 is only added when NOT already on T2E).

### State Variables (inside `App`)

| Variable | Default | Purpose |
|---|---|---|
| `supplier` | `"VISION_CHECKOUT"` | Currently selected supplier key |
| `t2eExisting` | `false` | Deligo: whether T2E system already in place |
| `scanners` | `1` | Number of AI scanner units |
| `weighPays` | `0` | Number of Weigh & Pay Scale units |
| `smeDays` | `1` | On-site implementation/SME days (minimum 1) |
| `step` | `"supplier"` | Current wizard step ID |
| `animIn` | `true` | Controls page transition CSS animation |
| `siteName` | `""` | Site information form fields |
| `unitNumber` | `""` | |
| `contactName` | `""` | |
| `address` | `""` | |
| `goLive` | `""` | |

---

## Pricing Logic (`calcQuote()`)

All prices are hardcoded constants. When prices change, update `calcQuote()` directly — there is no external config file.

### Vision Checkout

| Item | Cost |
|---|---|
| AI Scanner & Base | £3,373 / unit |
| Receipt Printer | £190 / unit |
| Worldpay MID | £50 flat |
| Weigh & Pay Scale | £750 / unit |
| Installation (1st device) | £1,750 |
| Installation (each additional) | £1,072.50 |
| Software (annual) | £4,649.50 / scanner |
| EFT/TCPOS Cloud (annual) | £1,583 flat |
| Worldpay PED (annual) | £116.52 / scanner |

### AutoCanteen

| Item | Cost |
|---|---|
| AI Scanner + Printer | £4,400 / unit |
| Worldpay MID | £50 flat |
| Weigh & Pay Scale | £660 / unit |
| Installation (1st device) | £4,576 |
| Installation (each additional) | £352 |
| SLA Support | £660 / scanner |
| Software (annual) | £5,280 / scanner |
| Weigh & Pay Software (annual) | £440 / unit |
| Worldpay PED (annual) | £116.52 |

### Deligo

| Item | Cost |
|---|---|
| AI Scanner | £3,800 / unit |
| Worldpay MID | £50 flat |
| Weigh & Pay Scale | £695 / unit |
| Survey & Config | £750 flat |
| UPS Shipping | £100 / scanner |
| Deligo Licence (annual) | £4,560 / scanner |
| POS T2E Licence (annual) | £150 / scanner |
| Control Desk Fee (annual) | £625 flat — only if NOT already on T2E |

### Universal Costs (all suppliers)

| Item | Formula |
|---|---|
| Implementation Fee | `£1,250 + (smeDays × £300)` |
| Contingency (2.5%) | `(capitalTotal + annualTotal) × 0.025` |
| Grand Total | `capitalTotal + annualTotal + contingency` |

---

## PDF Generation

Two PDFs are generated client-side using **jsPDF** (imperative coordinate-based drawing):

- **Summary PDF** (`makeSummaryPDF`): Portrait A4. Includes Compass logo, site info table, capital cost breakdown, annual costs, project totals with contingency, and disclaimer.
- **Breakdown PDF** (`makeBreakdownPDF`): Landscape A4. Detailed itemised line-by-line table with columns: Section, Description, Unit Cost, Qty, Capital Cost, Annual Cost.

Both auto-download as `{SiteName}_Summary.pdf` and `{SiteName}_Breakdown.pdf`.

**jsPDF is used imperatively** — text and shapes are drawn at explicit mm coordinates. If modifying PDFs, work in millimetres within the A4 bounds (210×297mm portrait, 297×210mm landscape).

---

## Styling Conventions

- All styles are in a single `<style>` JSX block inside `App.jsx` — **no separate CSS file**.
- The current supplier's brand colour is applied via:
  - A CSS custom property `--sc` set on the root container
  - Inline `style={{ color: sc }}` / `style={{ background: sc }}` on individual elements
- Fonts (Inter, Playfair Display) are loaded via `<link>` tags in `public/index.html`.
- There is no CSS framework (no Tailwind, no Bootstrap, no styled-components).

---

## Assets

Supplier and Compass logos are **base64-encoded strings** embedded directly in `App.jsx` (lines 4–7). There is no `public/images/` or `src/assets/` folder. This keeps the app entirely self-contained with zero network asset requests.

---

## Key Conventions to Follow

1. **Keep changes in `src/App.jsx`** — this is intentionally a single-file app. Do not create new component files unless significantly expanding scope.
2. **Update pricing in `calcQuote()`** — all cost constants are hardcoded there. No config files or environment variables are used.
3. **No TypeScript** — this is a plain JavaScript project. Do not add `.ts`/`.tsx` files or TypeScript tooling.
4. **No test framework** — there are no tests. Do not add test files unless explicitly requested.
5. **Preserve base64 logos** — the long base64 constants on lines 4–7 must not be modified unless replacing logos intentionally.
6. **Deployment is via `npm run deploy`** — this runs `build` then pushes to the `gh-pages` branch. Do not manually manipulate the `gh-pages` branch.
7. **ESLint** uses the `react-app` preset (configured in `package.json`). Run `npm run build` to surface lint errors — there is no standalone `npm run lint` script.
8. **Minimum `smeDays` is 1** — enforced in the UI decrement handler; do not allow it to go below 1.
9. **Deligo T2E logic** — the `t2eExisting` boolean controls whether the Control Desk Fee (£625/year) is included. This is the only supplier-specific conditional cost.

---

## Disclaimer Text (included in PDFs and Summary screen)

> *"This costing is a close working guide subject to site surveys before a final cost can be confirmed."*

Exclusions listed:
- Data points — approx. £50 per location
- Power supply — approx. £50 per location
- Menu build — £1,000–£2,500
- Strip & fit — £500–£1,500 per POS
