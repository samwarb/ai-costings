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

At the end of a quote, choose **Send to Workspace**. Microsoft Copilot Managed Runtime opens in a separate tab and receives the price snapshot, Client Summary PDF, Cost Breakdown PDF and Excel workbook through a nonce-bound cross-origin `postMessage` exchange. Review the destination in Workspace and save the quote. If you open AI Costings from a project's **New quote** button, that project is preselected and its name is used when the Site / Outlet Name is blank. Otherwise, choose a project folder or **Unassigned** in Workspace.

Workspace stores new quote snapshots in the `CompassQuotes` SharePoint List and the three documents in the selected project folder under `Documents / AI Frictionless / Projects`. Unassigned quotes go in `Projects / Unassigned`. All quote data inherits the Deployment SharePoint site's permissions. The handoff does not send Workspace credentials or use a public API.

If pop-ups or browser isolation prevent direct communication, choose **Download import file** in AI Costings, then **Workspace → Quotes → Import quote file**. The transfer file contains supplier pricing and documents and should be treated as confidential. Do not upload this JSON package to a public repository.

Each import is an immutable snapshot; sending a revised estimate does not overwrite earlier pricing. New quotes use Microsoft SharePoint. The existing Cloudflare Workspace and its historical quote archive are unchanged. Sending a quote does not automatically submit the Power Automate pipeline form.
