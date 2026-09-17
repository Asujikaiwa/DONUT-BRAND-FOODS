// หน้าหมวดสินค้า เช่น /seasoning-powder/  /en/seasoning-powder/  /zh/seasoning-powder/
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Language, Product } from '../types';
import { PAGE_TEXT, TRANSLATIONS } from '../constants';
import { CategoryId } from '../routes';
import ProductList from './ProductList';
import { Breadcrumb, CategoryLinks, ContactCTA, homeCrumb } from './PageParts';

interface CategoryPageProps {
  lang: Language;
  category: CategoryId;
  products: (Product & { slug: string })[];
  loading: boolean;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ lang, category, products, loading }) => {
  const pt = PAGE_TEXT[lang];
  const c = pt.categories[category];

  return (
    <>
      <section className="bg-brand-cream/60 pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[homeCrumb(lang), { label: c.name }]} />
          <h1 className="text-3xl md:text-5xl font-bold text-brand-dark mb-6 font-display">{c.h1}</h1>
          <div className="max-w-3xl space-y-3 text-gray-700 leading-relaxed">
            {c.intro.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="mt-6">
            <p className="font-bold text-gray-800 mb-2">{pt.ui.usesTitle}</p>
            <ul className="flex flex-wrap gap-2">
              {c.uses.map((u) => (
                <li key={u} className="inline-flex items-center bg-white border border-gray-200 rounded-full px-3 py-1 text-sm text-gray-700">
                  <CheckCircle size={14} className="text-brand-orange mr-1.5" />{u}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ProductList
        t={TRANSLATIONS[lang].products}
        currentLang={lang}
        products={products}
        loading={loading}
        fixedCategory={category}
        title={`${pt.ui.allProducts} – ${c.name}`}
        showBanners={false}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ContactCTA pt={pt} />
      </div>

      <CategoryLinks lang={lang} products={products} exclude={category} />
    </>
  );
};

export default CategoryPage;
