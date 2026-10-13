# Compass UK&I Digital — AI Checkout Quote Generator

A branded React app for generating quotes and downloadable PDF documents for AI checkout suppliers (Vision Checkout, AutoCanteen, Deligo).

## 🚀 Deploy to GitHub Pages (5 minutes)

### Step 1 — Create a GitHub repository
1. Go to [github.com/new](https://github.com/new)
2. Name it `compass-pricing-tool` (or anything you like)
3. Set it to **Private** if needed, then click **Create repository**

### Step 2 — Upload this project
**Option A — GitHub Desktop (easiest):**
1. Download [GitHub Desktop](https://desktop.github.com)
2. Clone your new repository
3. Copy all files from this folder into the cloned folder
4. Commit and push

**Option B — Command line:**
```bash
cd compass-pricing-tool
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/compass-pricing-tool.git
git push -u origin main
```

### Step 3 — Add your GitHub username to package.json
Open `package.json` and add/update the `homepage` field:
```json
"homepage": "https://YOUR_USERNAME.github.io/compass-pricing-tool"
```

### Step 4 — Deploy
```bash
npm run deploy
```

Your app will be live at: `https://YOUR_USERNAME.github.io/compass-pricing-tool`

---

## 💻 Run locally
```bash
npm install
npm start
```
Then open [http://localhost:3000](http://localhost:3000)

## 📁 Project structure
```
src/
  App.jsx       ← Main app + all pricing logic + PDF generation
  index.js      ← React entry point
public/
  index.html    ← HTML template
package.json    ← Dependencies & scripts
```

## 🔧 Updating prices
All pricing data is in `src/App.jsx` inside the `calcQuote()` function.

## 📄 PDF generation
Uses [jsPDF](https://github.com/parallax/jsPDF) — generates real PDFs directly in the browser, no server needed. Downloads automatically on button click.

## Compass Workspace integration

At the end of a quote, choose **Send to Workspace**. AI Costings opens a separate, Cloudflare Access-protected Compass Workspace window and sends the price snapshot with the Client Summary PDF, Cost Breakdown PDF and Excel quote via a nonce-bound cross-origin `postMessage` exchange. It does not send Workspace credentials or the quote to a public API. The Workspace window validates the source origin and records the snapshot in private Cloudflare D1, with documents stored in private R2.

Choose an existing project or **Unassigned Quotes Inbox**. You can also open AI Costings from a project's **Quotes** tab to preselect the target project.

If pop-ups, an organisation's login flow or browser isolation prevents communication, use **Download import file** in AI Costings, then **Workspace → Quotes → Import quote file**. The transfer file contains pricing and documents and should be treated as confidential. Do not upload this JSON package to a public repository.

Later quotes are saved as separate, immutable snapshots; sending a revised estimate does not overwrite previous pricing. Sending a quote to Workspace does not automatically submit the Power Automate pipeline form. Commercial data must be stored and shared in compliance with company policy.
