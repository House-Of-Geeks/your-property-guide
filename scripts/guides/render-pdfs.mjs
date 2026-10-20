#!/usr/bin/env node
// Prints the free guides to PDF, and their covers to images, from the same
// content as the chapter pages (15 Oct 2026). Since 20 Oct 2026 the cover is
// the shared "Clear decisions" design (src/components/brand/BookCover.tsx),
// so the PDF, the cover image, the email image and the site all match.
//
//   1. Run the site (npm run dev, or npm run build && npm run start).
//   2. BASE=http://localhost:3000 npm run guides:pdf
//
// For each guide it opens /print/guides/<guide> in headless Chrome and writes:
//   public/downloads/<file>.pdf               the guide (A4)
//   public/images/guide/<guide>-guide-cover.jpg        1440 x 2036, for structured data and sharing
//   public/images/guide/<guide>-guide-cover-email.jpg  601 x 850, for the guide emails
//
// Chrome: CHROME_PATH, or the headless shell Playwright installs
// (~/Library/Caches/ms-playwright on a Mac, ~/.cache/ms-playwright on Linux).
// It talks to Chrome over the DevTools protocol, so no npm package is needed.

import { spawn } from "node:child_process";
import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { homedir, platform } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = (process.env.BASE ?? "http://localhost:3000").replace(/\/$/, "");
const ROOT = fileURLToPath(new URL("../..", import.meta.url));

// Must match src/lib/guide-pdfs.ts (the funnels, emails and thanks pages link these).
const GUIDES = [
  { id: "selling", pdf: "public/downloads/your-property-guide-selling-a-home-australia.pdf" },
  { id: "buying", pdf: "public/downloads/your-property-guide-buying-property-australia.pdf" },
];

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const cache = platform() === "darwin" ? join(homedir(), "Library/Caches/ms-playwright") : join(homedir(), ".cache/ms-playwright");
  if (!existsSync(cache)) return null;
  for (const dir of readdirSync(cache).filter((d) => d.startsWith("chromium_headless_shell-")).sort().reverse()) {
    for (const sub of readdirSync(join(cache, dir))) {
      const bin = join(cache, dir, sub, "chrome-headless-shell");
      if (existsSync(bin)) return bin;
    }
  }
  return null;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function withPage(chrome, fn) {
  const port = 9400 + Math.floor(Math.random() * 500);
  const proc = spawn(chrome, ["--headless", `--remote-debugging-port=${port}`, "--hide-scrollbars", "--no-first-run", "about:blank"], { stdio: "ignore" });
  try {
    let wsUrl;
    for (let i = 0; i < 80 && !wsUrl; i++) {
      try {
        const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
        wsUrl = list.find((t) => t.type === "page")?.webSocketDebuggerUrl;
      } catch {}
      if (!wsUrl) await sleep(150);
    }
    if (!wsUrl) throw new Error("Chrome's DevTools didn't start");
    const ws = new WebSocket(wsUrl);
    await new Promise((r) => ws.addEventListener("open", r, { once: true }));
    let id = 0;
    const pending = new Map();
    ws.addEventListener("message", (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) {
        pending.get(m.id)(m);
        pending.delete(m.id);
      }
    });
    const send = (method, params = {}) =>
      new Promise((res, rej) => {
        const i = ++id;
        pending.set(i, (m) => (m.error ? rej(new Error(`${method}: ${m.error.message}`)) : res(m.result)));
        ws.send(JSON.stringify({ id: i, method, params }));
      });
    const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result?.value;
    const open = async (url) => {
      await send("Page.navigate", { url });
      for (let i = 0; i < 120; i++) {
        if ((await evaluate("document.readyState")) === "complete") break;
        await sleep(250);
      }
      await evaluate("document.fonts.ready.then(() => true)");
      await evaluate(`(async () => { const imgs = [...document.images]; await Promise.all(imgs.map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); document.querySelector('nextjs-portal')?.remove(); return true })()`);
      await sleep(500);
    };
    await send("Page.enable");
    await send("Runtime.enable");
    const result = await fn({ send, evaluate, open });
    ws.close();
    return result;
  } finally {
    proc.kill();
  }
}

async function main() {
  const chrome = findChrome();
  if (!chrome) {
    console.error("No Chrome found. Set CHROME_PATH, or run `npx playwright install chromium-headless-shell`.");
    process.exit(1);
  }
  const ping = await fetch(`${BASE}/print/guides/selling`).catch(() => null);
  if (!ping || !ping.ok) {
    console.error(`${BASE}/print/guides/selling didn't answer. Start the site first, and set BASE if it isn't on port 3000.`);
    process.exit(1);
  }

  for (const g of GUIDES) {
    await withPage(chrome, async ({ send, evaluate, open }) => {
      // The PDF.
      await send("Emulation.setDeviceMetricsOverride", { width: 794, height: 1123, deviceScaleFactor: 1, mobile: false });
      await open(`${BASE}/print/guides/${g.id}`);
      await send("Emulation.setEmulatedMedia", { media: "print" });
      const pdf = await send("Page.printToPDF", { printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false });
      writeFileSync(join(ROOT, g.pdf), Buffer.from(pdf.data, "base64"));
      console.log(`wrote ${g.pdf}`);

      // The cover, as images.
      await send("Emulation.setEmulatedMedia", { media: "screen" });
      await open(`${BASE}/print/guides/${g.id}?cover=1`);
      const box = await evaluate(`(() => { const r = document.getElementById('cover').getBoundingClientRect(); return [r.left, r.top + scrollY, r.width, r.height] })()`);
      const [x, y, width, height] = box;
      const big = await send("Page.captureScreenshot", { format: "jpeg", quality: 88, captureBeyondViewport: true, clip: { x, y, width, height, scale: 1440 / width } });
      writeFileSync(join(ROOT, `public/images/guide/${g.id}-guide-cover.jpg`), Buffer.from(big.data, "base64"));
      const jpg = await send("Page.captureScreenshot", { format: "jpeg", quality: 85, captureBeyondViewport: true, clip: { x, y, width, height, scale: 601 / width } });
      writeFileSync(join(ROOT, `public/images/guide/${g.id}-guide-cover-email.jpg`), Buffer.from(jpg.data, "base64"));
      console.log(`wrote the ${g.id} cover images`);
    });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
