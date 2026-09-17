// scripts/prerender.mjs
// รันต่อจาก `vite build` (ดู npm run build) เพื่อสร้างไฟล์ HTML ที่มีเนื้อหาครบของทุกหน้า
//   1) ดึงรายการสินค้าจาก Firestore (ถ้าต่อไม่ได้ ใช้ data/products.snapshot.json แทน)
//   2) สร้าง dist/<หน้า>/index.html ทุกภาษา + dist/404.html + dist/admin/index.html
//   3) สร้าง dist/sitemap.xml (มี hreflang ครบทุกภาษา)
// ใช้ไฟล์ snapshot โดยไม่ต่อเน็ต: npm run build:offline (หรือตั้ง SKIP_FIRESTORE=1)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const snapshotFile = path.join(root, 'data', 'products.snapshot.json');
const SITE_URL = 'https://athip-panich.com';

// ---------- 1) โหลดสินค้า ----------
function fromFirestoreValue(v) {
  if (v == null) return null;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return Number(v.doubleValue);
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('timestampValue' in v) return v.timestampValue;
  if ('referenceValue' in v) return v.referenceValue;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(fromFirestoreValue);
  if ('mapValue' in v) return fromFirestoreFields(v.mapValue.fields || {});
  return null;
}
function fromFirestoreFields(fields) {
  const out = {};
  for (const [k, v] of Object.entries(fields)) out[k] = fromFirestoreValue(v);
  return out;
}

// เก็บเฉพาะฟิลด์ที่หน้าเว็บใช้ (ไฟล์ HTML จะได้ไม่ใหญ่)
function slim(p) {
  const keep = ['id', 'category', 'name', 'description', 'weight', 'price', 'variants', 'isBestSeller', 'isNew', 'isHidden', 'image', 'slug'];
  const o = {};
  for (const k of keep) if (p[k] !== undefined && p[k] !== null) o[k] = p[k];
  return o;
}

async function loadFromFirestore() {
  const cfg = fs.readFileSync(path.join(root, 'firebase.ts'), 'utf8');
  const projectId = (cfg.match(/projectId:\s*"([^"]+)"/) || [])[1];
  const apiKey = (cfg.match(/apiKey:\s*"([^"]+)"/) || [])[1];
  if (!projectId) throw new Error('ไม่พบ projectId ใน firebase.ts');
  const docs = [];
  let pageToken = '';
  do {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products`
      + `?pageSize=300&orderBy=category${apiKey ? `&key=${apiKey}` : ''}${pageToken ? `&pageToken=${pageToken}` : ''}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`Firestore ตอบกลับ ${res.status}`);
    const json = await res.json();
    for (const d of json.documents || []) {
      docs.push({ id: d.name.split('/').pop(), ...fromFirestoreFields(d.fields || {}) });
    }
    pageToken = json.nextPageToken || '';
  } while (pageToken);
  if (docs.length === 0) throw new Error('Firestore ไม่มีสินค้า');
  return docs;
}

async function loadProducts() {
  if (process.env.SKIP_FIRESTORE !== '1' && !process.argv.includes('--offline')) {
    try {
      const products = (await loadFromFirestore()).map(slim);
      fs.writeFileSync(snapshotFile, JSON.stringify({
        source: 'Firestore (อัปเดตอัตโนมัติทุกครั้งที่ build สำเร็จ)',
        updatedAt: new Date().toISOString(),
        products,
      }, null, 2));
      console.log(`[prerender] ✔ ดึงสินค้าจาก Firestore ${products.length} รายการ (บันทึก snapshot แล้ว)`);
      return products;
    } catch (e) {
      console.warn(`[prerender] ⚠ ดึงจาก Firestore ไม่ได้ (${e.message}) -> ใช้ data/products.snapshot.json แทน`);
    }
  }
  const snap = JSON.parse(fs.readFileSync(snapshotFile, 'utf8'));
  console.log(`[prerender] ใช้ snapshot ${snap.products.length} รายการ (อัปเดตล่าสุด ${snap.updatedAt})`);
  return snap.products;
}

// ---------- 2) สร้าง HTML ----------
const products = (await loadProducts()).filter((p) => !p.isHidden);
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (!template.includes('<!--app-html-->')) {
  throw new Error('dist/index.html ไม่มี <!--app-html--> (ต้องรัน vite build ก่อน prerender)');
}
const serverEntry = path.join(root, 'dist-ssr', 'entry-server.js');
const { render, listPaths } = await import(pathToFileURL(serverEntry).href);

const dataScript = `<script>window.__INITIAL_PRODUCTS__=${JSON.stringify(products).replace(/</g, '\\u003c')}</script>`;

function fill({ head, html, htmlLang }, withData = true) {
  return template
    .replace('<html lang="th">', `<html lang="${htmlLang}">`)
    .replace('<!--app-head-->', head)
    .replace('<!--app-html-->', html)
    .replace('<!--app-data-->', withData ? dataScript : '');
}

function writePage(urlPath, content) {
  const parts = urlPath.split('/').filter(Boolean);
  const dir = path.join(dist, ...parts);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), content);
}

const paths = listPaths(products);
let count = 0;
for (const p of paths) {
  const result = render(p, products);
  if (result.status !== 200) throw new Error(`หน้า ${p} render ได้สถานะ ${result.status}`);
  writePage(p, fill(result));
  count++;
}

// หน้า 404 (Firebase Hosting ใช้ dist/404.html อัตโนมัติ)
fs.writeFileSync(path.join(dist, '404.html'), fill(render('/__404__/', products)));

// หน้า Admin: ไม่ prerender เนื้อหา + noindex
writePage('/admin/', fill({
  head: '<title>Admin | Donut Brand</title>\n    <meta name="robots" content="noindex, nofollow">',
  html: '',
  htmlLang: 'th',
}, false));

console.log(`[prerender] ✔ สร้าง HTML ${count} หน้า + 404.html + admin/index.html`);

// ---------- 3) sitemap.xml ----------
const today = new Date().toISOString().slice(0, 10);
const LANG_PREFIX = { '': 'th', '/en': 'en', '/zh': 'zh-Hans' };
const splitLang = (p) => {
  const m = p.match(/^\/(en|zh)(\/.*)$/);
  return m ? { prefix: `/${m[1]}`, rest: m[2] } : { prefix: '', rest: p };
};
const xmlEsc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const absUrl = (u) => (/^https?:\/\//.test(u) ? u : SITE_URL + encodeURI(decodeURI(u)));

// สร้าง map slug -> สินค้า (ใช้ listPaths ของ entry-server ซึ่งคำนวณ slug แบบเดียวกับหน้าเว็บ)
const productBySlug = new Map();
{
  const { withSlugs, visibleProducts } = await import(pathToFileURL(serverEntry).href);
  if (withSlugs) for (const p of withSlugs(visibleProducts(products))) productBySlug.set(p.slug, p);
}

const urls = paths.map((p) => {
  const { rest } = splitLang(p);
  const alts = Object.entries(LANG_PREFIX)
    .map(([prefix, hl]) => `    <xhtml:link rel="alternate" hreflang="${hl}" href="${xmlEsc(SITE_URL + prefix + rest)}"/>`)
    .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEsc(SITE_URL + rest)}"/>`)
    .join('\n');
  const slugMatch = rest.match(/^\/product\/([^/]+)\/$/);
  const prod = slugMatch ? productBySlug.get(slugMatch[1]) : null;
  const img = prod && prod.image
    ? `\n    <image:image>\n      <image:loc>${xmlEsc(absUrl(prod.image))}</image:loc>\n    </image:image>`
    : '';
  const priority = rest === '/' ? '1.0' : slugMatch ? '0.7' : '0.8';
  return `  <url>\n    <loc>${xmlEsc(SITE_URL + p)}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n${alts}${img}\n  </url>`;
});

fs.writeFileSync(path.join(dist, 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>
`);
console.log(`[prerender] ✔ sitemap.xml ${urls.length} URL`);
