// ชิ้นส่วนที่ใช้ร่วมกันในหน้าหมวด / หน้าสินค้า / หน้าคำถามพบบ่อย
import React from 'react';
import { ChevronRight, Phone, Mail, Facebook } from 'lucide-react';
import { Language, Product } from '../types';
import { PageText, PAGE_TEXT } from '../constants';
import { CATEGORY_IDS, CategoryId, categoryPath, homePath } from '../routes';

export interface Crumb { label: string; href?: string }

export const Breadcrumb: React.FC<{ items: Crumb[] }> = ({ items }) => (
  <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
    <ol className="flex flex-wrap items-center gap-1">
      {items.map((c, i) => (
        <li key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={14} className="text-gray-400" />}
          {c.href ? (
            <a href={c.href} className="hover:text-brand-orange transition">{c.label}</a>
          ) : (
            <span className="text-gray-700 font-medium" aria-current="page">{c.label}</span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

export function homeCrumb(lang: Language): Crumb {
  return { label: PAGE_TEXT[lang].ui.breadcrumbHome, href: homePath(lang) };
}

/** การ์ดลิงก์ไปหน้าหมวดสินค้า (ให้ Google ตามลิงก์ไปเจอทุกหน้า) */
export const CategoryLinks: React.FC<{ lang: Language; products: Product[]; exclude?: CategoryId }> = ({ lang, products, exclude }) => {
  const pt = PAGE_TEXT[lang];
  const cats = CATEGORY_IDS.filter((c) => c !== exclude && products.some((p) => p.category === c));
  if (cats.length === 0) return null;
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-6 font-display text-center">{pt.ui.categoriesTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cats.map((c) => {
            const count = products.filter((p) => p.category === c).length;
            const sample = products.find((p) => p.category === c && p.image);
            return (
              <a key={c} href={categoryPath(lang, c)} className="group flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition p-4">
                {sample && (
                  <img src={sample.image} alt={pt.categories[c].name} loading="lazy" decoding="async" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                )}
                <div>
                  <p className="font-bold text-gray-800 font-display group-hover:text-brand-orange transition">{pt.categories[c].name}</p>
                  <p className="text-sm text-gray-500">{count} · {pt.ui.viewCategory} →</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/** กล่องติดต่อสั่งซื้อ */
export const ContactCTA: React.FC<{ pt: PageText }> = ({ pt }) => (
  <div className="bg-brand-cream border border-brand-yellow/40 rounded-2xl p-6">
    <h2 className="text-xl font-bold text-brand-dark font-display mb-2">{pt.ui.orderTitle}</h2>
    <p className="text-gray-600 mb-4">{pt.ui.orderDesc}</p>
    <div className="flex flex-wrap gap-3">
      {[['0918033478', '091-803-3478'], ['0972692898', '097-269-2898'], ['0918799922', '091-879-9922']].map(([tel, label]) => (
        <a key={tel} href={`tel:${tel}`} className="inline-flex items-center bg-brand-orange hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-full transition">
          <Phone size={16} className="mr-2" />{label}
        </a>
      ))}
      <a href="mailto:athip_panich@hotmail.com" className="inline-flex items-center bg-white border border-gray-200 hover:border-brand-orange text-gray-700 font-medium px-4 py-2 rounded-full transition">
        <Mail size={16} className="mr-2" />{pt.ui.emailUs}
      </a>
      <a href="https://www.facebook.com/athip.panich.donut/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-white border border-gray-200 hover:border-blue-500 text-gray-700 font-medium px-4 py-2 rounded-full transition">
        <Facebook size={16} className="mr-2" />Facebook
      </a>
    </div>
  </div>
);

export const NotFound: React.FC<{ lang: Language }> = ({ lang }) => {
  const pt = PAGE_TEXT[lang];
  return (
    <section className="py-24 text-center px-4">
      <p className="text-6xl font-bold text-brand-orange font-display mb-4">404</p>
      <h1 className="text-3xl font-bold text-brand-dark font-display mb-3">{pt.ui.notFoundTitle}</h1>
      <p className="text-gray-600 mb-8 max-w-lg mx-auto">{pt.ui.notFoundDesc}</p>
      <a href={homePath(lang)} className="inline-block bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition">{pt.ui.backHome}</a>
    </section>
  );
};
