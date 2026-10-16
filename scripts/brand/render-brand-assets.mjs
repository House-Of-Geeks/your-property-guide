#!/usr/bin/env node
// Regenerates the brand's raster assets in v6 colours (16 Oct 2026) from the
// same mark as src/components/brand/Logo.tsx and src/app/icon.svg:
//
//   src/app/favicon.ico                 16, 32 and 48 px, the eucalyptus tile
//   src/app/apple-icon.png              180 px, full-bleed tile (iOS rounds it)
//   public/images/brand/mark.svg        the mark alone, copper
//   public/images/brand/mark-96.png     the mark alone, copper (email header)
//   public/images/brand/tile-96.png     the tile, 96 px
//   public/images/brand/icon-192.png    the tile, 192 px
//   public/images/brand/icon-512.png    the tile, 512 px
//   public/og-image.jpg                 1200 x 630 social card, from /print/og
//
// The social card needs the site running:
//   BASE=http://localhost:3000 node scripts/brand/render-brand-assets.mjs
// Without BASE it skips the card and writes the icons only.
//
// Chrome: CHROME_PATH, or the headless shell Playwright installs (as in
// scripts/guides/render-pdfs.mjs). No npm package is needed.

import { spawn } from "node:child_process";
import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { homedir, platform } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const BASE = process.env.BASE?.replace(/\/$/, "");

// Brand v6 (BRAND.md): eucalyptus, copper, light copper.
const EUCALYPTUS = "#0f3d2e";
const COPPER = "#c47a3a";
const COPPER_LIGHT = "#e9b07c";
const MARK_PATH = "M16 2.5 L28.5 12 L28.5 25 L12.5 25 L6.5 30.5 L7.6 25 L3.5 25 L3.5 12 Z";

const tile = (rounded) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32"${rounded ? ' rx="7"' : ""} fill="${EUCALYPTUS}"/><path fill="${COPPER_LIGHT}" transform="translate(4.4 4.2) scale(0.725)" d="${MARK_PATH}"/></svg>`;
const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="${COPPER}" d="${MARK_PATH}"/></svg>`;

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
    await send("Page.enable");
    await send("Runtime.enable");
    const result = await fn({ send, evaluate });
    ws.close();
    return result;
  } finally {
    proc.kill();
  }
}

// An SVG drawn at an exact pixel size on a transparent page, as PNG bytes.
async function svgToPng({ send }, svg, size) {
  await send("Emulation.setDeviceMetricsOverride", { width: size, height: size, deviceScaleFactor: 1, mobile: false });
  await send("Emulation.setDefaultBackgroundColorOverride", { color: { r: 0, g: 0, b: 0, a: 0 } });
  const html = `<!doctype html><html><body style="margin:0;background:transparent"><img src="data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}" width="${size}" height="${size}" style="display:block"></body></html>`;
  await send("Page.navigate", { url: `data:text/html;base64,${Buffer.from(html).toString("base64")}` });
  await sleep(300);
  const shot = await send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: size, height: size, scale: 1 } });
  return Buffer.from(shot.data, "base64");
}

// A .ico holding PNG images (supported by every current browser).
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

async function main() {
  const chrome = findChrome();
  if (!chrome) {
    console.error("No Chrome found. Set CHROME_PATH, or run `npx playwright install chromium-headless-shell`.");
    process.exit(1);
  }
  const out = (rel, data) => {
    writeFileSync(join(ROOT, rel), data);
    console.log(`wrote ${rel}`);
  };

  await withPage(chrome, async (page) => {
    const sizes = [16, 32, 48];
    const favs = [];
    for (const size of sizes) favs.push({ size, data: await svgToPng(page, tile(true), size) });
    out("src/app/favicon.ico", ico(favs));
    out("src/app/apple-icon.png", await svgToPng(page, tile(false), 180));
    out("public/images/brand/mark.svg", mark);
    out("public/images/brand/mark-96.png", await svgToPng(page, mark, 96));
    out("public/images/brand/tile-96.png", await svgToPng(page, tile(true), 96));
    out("public/images/brand/icon-192.png", await svgToPng(page, tile(true), 192));
    out("public/images/brand/icon-512.png", await svgToPng(page, tile(true), 512));
  });

  if (!BASE) {
    console.log("BASE not set: skipped public/og-image.jpg (needs the site running).");
    return;
  }
  await withPage(chrome, async ({ send, evaluate }) => {
    await send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
    await send("Page.navigate", { url: `${BASE}/print/og` });
    for (let i = 0; i < 120; i++) {
      if ((await evaluate("document.readyState")) === "complete") break;
      await sleep(250);
    }
    await evaluate("document.fonts.ready.then(() => true)");
    await evaluate(`(async () => { await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); document.querySelector('nextjs-portal')?.remove(); return true })()`);
    await sleep(600);
    const shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 88, clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 } });
    out("public/og-image.jpg", Buffer.from(shot.data, "base64"));
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
