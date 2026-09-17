// routes.ts — ตาราง URL / ภาษา / slug ของทั้งเว็บ (ใช้ร่วมกันทั้งฝั่งเบราว์เซอร์และตอน prerender)
import { Language, Product } from './types';

export const SITE_URL = 'https://athip-panich.com';

export const LANGS: Language[] = ['th', 'en', 'cn'];

// ภาษาภายในโค้ดใช้ 'cn' แต่ URL / hreflang ใช้มาตรฐาน 'zh'
export const LANG_INFO: Record<Language, { prefix: string; htmlLang: string; hreflang: string; ogLocale: string; label: string }> = {
  th: { prefix: '', htmlLang: 'th', hreflang: 'th', ogLocale: 'th_TH', label: 'TH' },
  en: { prefix: '/en', htmlLang: 'en', hreflang: 'en', ogLocale: 'en_US', label: 'EN' },
  cn: { prefix: '/zh', htmlLang: 'zh-Hans', hreflang: 'zh-Hans', ogLocale: 'zh_CN', label: 'CN' },
};

export type CategoryId = 'seasoning' | 'beverage' | 'additives';
export const CATEGORY_IDS: CategoryId[] = ['seasoning', 'beverage', 'additives'];

// slug ของหน้าหมวด (ค่า category ใน Firestore -> URL)
export const CATEGORY_SLUGS: Record<CategoryId, string> = {
  seasoning: 'seasoning-powder',
  beverage: 'beverage-powder',
  additives: 'food-additives',
};

export type Route =
  | { type: 'home'; lang: Language }
  | { type: 'category'; lang: Language; category: CategoryId }
  | { type: 'product'; lang: Language; slug: string }
  | { type: 'faq'; lang: Language }
  | { type: 'admin'; lang: Language }
  | { type: 'notfound'; lang: Language };

/** แปลงชื่อภาษาอังกฤษเป็น slug เช่น "Cheese Seasoning (S)" -> "cheese-seasoning-s" */
export function slugify(text: string): string {
  return (text || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** สินค้าที่แสดงบนเว็บ (ตัดตัวที่ซ่อนไว้ในหน้า Admin ออก) */
export function visibleProducts(products: Product[]): Product[] {
  return products.filter((p) => !(p as any).isHidden && p.name && p.name.th);
}

/**
 * ให้ slug กับสินค้าทุกตัว: ใช้ฟิลด์ slug ใน Firestore ถ้ามี ไม่งั้นสร้างจากชื่อภาษาอังกฤษ
 * ถ้าชื่อซ้ำกันจะต่อท้าย -2, -3 ... (เรียงตาม id เพื่อให้ผลคงที่ทุกครั้ง)
 */
export function withSlugs(products: Product[]): (Product & { slug: string })[] {
  const used = new Set<string>();
  const sorted = [...products].sort((a, b) => String(a.id).localeCompare(String(b.id)));
  const map = new Map<string, string>();
  for (const p of sorted) {
    let base = slugify((p as any).slug || p.name?.en || '') || `product-${slugify(String(p.id)) || 'item'}`;
    let slug = base;
    let n = 2;
    while (used.has(slug)) slug = `${base}-${n++}`;
    used.add(slug);
    map.set(String(p.id), slug);
  }
  return products.map((p) => ({ ...p, slug: map.get(String(p.id))! }));
}

export function homePath(lang: Language): string {
  return `${LANG_INFO[lang].prefix}/`;
}
export function categoryPath(lang: Language, category: CategoryId): string {
  return `${LANG_INFO[lang].prefix}/${CATEGORY_SLUGS[category]}/`;
}
export function productPath(lang: Language, slug: string): string {
  return `${LANG_INFO[lang].prefix}/product/${slug}/`;
}
export function faqPath(lang: Language): string {
  return `${LANG_INFO[lang].prefix}/faq/`;
}

/** URL ของหน้าเดียวกันในภาษาอื่น (ใช้กับปุ่มเปลี่ยนภาษาและ hreflang) */
export function routePath(route: Route, lang: Language = route.lang): string {
  switch (route.type) {
    case 'home': return homePath(lang);
    case 'category': return categoryPath(lang, route.category);
    case 'product': return productPath(lang, route.slug);
    case 'faq': return faqPath(lang);
    case 'admin': return '/admin/';
    default: return homePath(lang);
  }
}

/** อ่าน URL แล้วบอกว่าเป็นหน้าอะไร ภาษาอะไร */
export function parsePath(pathname: string): Route {
  let parts = decodeURI(pathname || '/').split('/').filter(Boolean);
  let lang: Language = 'th';
  if (parts[0] === 'en') { lang = 'en'; parts = parts.slice(1); }
  else if (parts[0] === 'zh') { lang = 'cn'; parts = parts.slice(1); }

  if (parts.length === 1 && parts[0] === 'index.html') parts = [];
  if (parts.length === 0) return { type: 'home', lang };
  if (parts.length === 1 && parts[0] === 'faq') return { type: 'faq', lang };
  if (parts.length === 1 && parts[0] === 'admin' && lang === 'th') return { type: 'admin', lang };
  if (parts.length === 1) {
    const cat = CATEGORY_IDS.find((c) => CATEGORY_SLUGS[c] === parts[0]);
    if (cat) return { type: 'category', lang, category: cat };
  }
  if (parts.length === 2 && parts[0] === 'product') return { type: 'product', lang, slug: parts[1] };
  return { type: 'notfound', lang };
}

export function absoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return SITE_URL + '/';
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return SITE_URL + (pathOrUrl.startsWith('/') ? '' : '/') + encodeURI(decodeURI(pathOrUrl));
}

/** ขนาดบรรจุของสินค้าเป็นข้อความ เช่น "100g / 200g / 500g" */
export function productSizes(p: Product): string {
  const list = p.variants && p.variants.length > 0 ? p.variants.map((v) => v.weight) : p.weight ? [p.weight] : [];
  return list.filter(Boolean).join(' / ');
}

/** นับจำนวนสินค้าแต่ละหมวด (ใช้ในคำตอบ FAQ) */
export function productCounts(products: Product[]) {
  const v = visibleProducts(products);
  return {
    total: v.length,
    seasoning: v.filter((p) => p.category === 'seasoning').length,
    beverage: v.filter((p) => p.category === 'beverage').length,
    additives: v.filter((p) => p.category === 'additives').length,
  };
}
