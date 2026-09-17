// entry-server.tsx — ใช้ตอน build เท่านั้น (scripts/prerender.mjs) เพื่อสร้าง HTML + <head> ของแต่ละหน้า
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { Language, Product } from './types';
import { PAGE_TEXT } from './constants';
import {
  SITE_URL, LANGS, LANG_INFO, CATEGORY_IDS, CATEGORY_SLUGS, CategoryId, Route,
  parsePath, routePath, visibleProducts, withSlugs, productPath, categoryPath, homePath, faqPath,
  absoluteUrl, productSizes, productCounts,
} from './routes';

const LOGO = `${SITE_URL}/PictureProduct/Other/Logo/logo.jpg`;
const ORG_ID = `${SITE_URL}/#organization`;

const esc = (s: string) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jsonLd = (obj: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

/** รายการ URL ทั้งหมดที่ต้อง prerender */
export function listPaths(rawProducts: Product[]): string[] {
  const products = withSlugs(visibleProducts(rawProducts));
  const paths: string[] = [];
  for (const lang of LANGS) {
    paths.push(homePath(lang));
    for (const c of CATEGORY_IDS) {
      if (products.some((p) => p.category === c)) paths.push(categoryPath(lang, c));
    }
    for (const p of products) paths.push(productPath(lang, p.slug));
    paths.push(faqPath(lang));
  }
  return paths;
}

function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}

function itemListLd(name: string, lang: Language, list: (Product & { slug: string })[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: list.length,
    itemListElement: list.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: SITE_URL + productPath(lang, p.slug),
      name: p.name[lang] || p.name.th,
    })),
  };
}

interface HeadInfo { title: string; description: string; image: string; noindex?: boolean; ogType?: string; schemas: unknown[] }

function headInfo(route: Route, products: (Product & { slug: string })[], rawProducts: Product[]): HeadInfo {
  const lang = route.lang;
  const pt = PAGE_TEXT[lang];
  const url = SITE_URL + routePath(route);
  const home = { name: pt.ui.breadcrumbHome, url: SITE_URL + homePath(lang) };

  switch (route.type) {
    case 'home':
      return {
        title: pt.home.metaTitle,
        description: pt.home.metaDesc,
        image: LOGO,
        schemas: [
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: lang === 'th' ? 'ผงปรุงรส ตราโดนัท' : 'Donut Brand',
            url: SITE_URL + homePath(lang),
            inLanguage: LANG_INFO[lang].htmlLang,
            publisher: { '@id': ORG_ID },
          },
          itemListLd(pt.ui.allProducts, lang, products),
        ],
      };
    case 'category': {
      const c = pt.categories[route.category];
      const list = products.filter((p) => p.category === route.category);
      return {
        title: c.metaTitle,
        description: c.metaDesc(list.length),
        image: absoluteUrl(list.find((p) => p.image)?.image || LOGO),
        schemas: [
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: c.h1,
            description: c.metaDesc(list.length),
            url,
            inLanguage: LANG_INFO[lang].htmlLang,
            publisher: { '@id': ORG_ID },
          },
          breadcrumbLd([home, { name: c.name, url }]),
          itemListLd(c.h1, lang, list),
        ],
      };
    }
    case 'product': {
      const p = products.find((x) => x.slug === route.slug)!;
      const cat = (CATEGORY_IDS.includes(p.category as CategoryId) ? p.category : 'additives') as CategoryId;
      const cName = pt.categories[cat].name;
      const name = p.name[lang] || p.name.th;
      const sizes = productSizes(p);
      const prices = (p.variants && p.variants.length ? p.variants.map((v) => v.price) : [p.price]).filter((x) => Number(x) > 0).map(Number);
      const desc = (p.description?.[lang] ? p.description[lang] + ' ' : '') + pt.product.body(name, sizes || '-', cat);
      const productLd: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name,
        alternateName: LANGS.filter((l) => l !== lang).map((l) => p.name[l]).filter(Boolean),
        image: p.image ? [absoluteUrl(p.image)] : [LOGO],
        description: desc,
        category: cName,
        url,
        brand: { '@type': 'Brand', name: 'ตราโดนัท (Donut Brand)' },
        manufacturer: { '@id': ORG_ID },
        countryOfOrigin: 'TH',
        additionalProperty: sizes ? [{ '@type': 'PropertyValue', name: pt.ui.sizes, value: sizes }] : undefined,
      };
      if (prices.length) {
        productLd.offers = {
          '@type': 'AggregateOffer',
          priceCurrency: 'THB',
          lowPrice: Math.min(...prices),
          highPrice: Math.max(...prices),
          offerCount: prices.length,
          url,
          seller: { '@id': ORG_ID },
        };
      }
      return {
        title: pt.product.metaTitle(name, sizes, cName),
        description: pt.product.metaDesc(name, sizes || '-', cat),
        image: absoluteUrl(p.image || LOGO),
        ogType: 'product',
        schemas: [
          productLd,
          breadcrumbLd([home, { name: cName, url: SITE_URL + categoryPath(lang, cat) }, { name, url }]),
        ],
      };
    }
    case 'faq': {
      const items = pt.faq(productCounts(rawProducts));
      return {
        title: pt.faqMeta.metaTitle,
        description: pt.faqMeta.metaDesc,
        image: LOGO,
        schemas: [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            inLanguage: LANG_INFO[lang].htmlLang,
            mainEntity: items.map((it) => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.a } })),
          },
          breadcrumbLd([home, { name: pt.ui.faqNav, url }]),
        ],
      };
    }
    default:
      return { title: `404 – ${pt.ui.notFoundTitle} | Donut Brand`, description: pt.ui.notFoundDesc, image: LOGO, noindex: true, schemas: [] };
  }
}

const TH_KEYWORDS = 'ผงปรุงรส, ผงเขย่า, ผงปรุงรสอาหาร, ผงโรยเฟรนช์ฟรายส์, ผงบาร์บีคิว, ผงชีส, ผงปาปริก้า, ผงต้มยำ, ผงหมาล่า, ผงไข่เค็ม, เครื่องดื่มชนิดผง, ผงชาไทย, วัตถุเจือปนอาหาร, กรดมะนาว, ตราโดนัท, Donut Brand, อธิปพาณิชย์, โรงงานผลิตผงปรุงรส, ขายส่งผงปรุงรส, รับผลิตผงปรุงรส OEM';

export function render(path: string, rawProducts: Product[]) {
  const route = parsePath(path);
  const products = withSlugs(visibleProducts(rawProducts));
  let status = 200;
  if (route.type === 'product' && !products.some((p) => p.slug === route.slug)) status = 404;
  if (route.type === 'notfound') status = 404;
  const effective: Route = status === 404 ? { type: 'notfound', lang: route.lang } : route;

  const html = renderToString(
    <React.StrictMode>
      <App path={path} initialProducts={rawProducts} />
    </React.StrictMode>
  );

  const info = headInfo(effective, products, rawProducts);
  const lang = route.lang;
  const canonical = SITE_URL + routePath(effective);
  const tags: string[] = [];
  tags.push(`<title>${esc(info.title)}</title>`);
  tags.push(`<meta name="description" content="${esc(info.description)}">`);
  if (lang === 'th' && effective.type !== 'notfound') tags.push(`<meta name="keywords" content="${esc(TH_KEYWORDS)}">`);
  if (info.noindex) {
    tags.push(`<meta name="robots" content="noindex, follow">`);
  } else {
    tags.push(`<link rel="canonical" href="${esc(canonical)}">`);
    for (const l of LANGS) {
      tags.push(`<link rel="alternate" hreflang="${LANG_INFO[l].hreflang}" href="${esc(SITE_URL + routePath(effective, l))}">`);
    }
    tags.push(`<link rel="alternate" hreflang="x-default" href="${esc(SITE_URL + routePath(effective, 'th'))}">`);
  }
  tags.push(`<meta property="og:type" content="${info.ogType || 'website'}">`);
  tags.push(`<meta property="og:site_name" content="ตราโดนัท Donut Brand">`);
  tags.push(`<meta property="og:url" content="${esc(canonical)}">`);
  tags.push(`<meta property="og:title" content="${esc(info.title)}">`);
  tags.push(`<meta property="og:description" content="${esc(info.description)}">`);
  tags.push(`<meta property="og:image" content="${esc(info.image)}">`);
  tags.push(`<meta property="og:locale" content="${LANG_INFO[lang].ogLocale}">`);
  for (const l of LANGS) if (l !== lang) tags.push(`<meta property="og:locale:alternate" content="${LANG_INFO[l].ogLocale}">`);
  tags.push(`<meta name="twitter:card" content="summary_large_image">`);
  for (const s of info.schemas) tags.push(jsonLd(s));

  return { html, head: tags.join('\n    '), htmlLang: LANG_INFO[lang].htmlLang, status };
}

export { CATEGORY_SLUGS, withSlugs, visibleProducts };
