// หน้าสินค้าแต่ละตัว เช่น /product/cheese-seasoning/
import React from 'react';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import { Language, Product } from '../types';
import { PAGE_TEXT } from '../constants';
import { CategoryId, CATEGORY_IDS, categoryPath, productSizes } from '../routes';
import { ProductCard } from './ProductList';
import { Breadcrumb, CategoryLinks, ContactCTA, NotFound, homeCrumb } from './PageParts';

interface ProductPageProps {
  lang: Language;
  slug: string;
  products: (Product & { slug: string })[];
  loading: boolean;
}

const ProductPage: React.FC<ProductPageProps> = ({ lang, slug, products, loading }) => {
  const pt = PAGE_TEXT[lang];
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    if (loading) return <div className="py-24 text-center text-gray-400">{pt.ui.loading}</div>;
    return <NotFound lang={lang} />;
  }

  const category = (CATEGORY_IDS.includes(product.category as CategoryId) ? product.category : 'additives') as CategoryId;
  const cat = pt.categories[category];
  const name = product.name[lang] || product.name.th;
  const sizes = productSizes(product);
  const customDesc = product.description?.[lang] || '';
  const variants = product.variants && product.variants.length > 0
    ? product.variants
    : product.weight ? [{ weight: product.weight, price: product.price || 0 }] : [];
  const otherNames = (['th', 'en', 'cn'] as Language[]).filter((l) => l !== lang).map((l) => product.name[l]).filter(Boolean);
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 8);

  return (
    <>
      <section className="pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[homeCrumb(lang), { label: cat.name, href: categoryPath(lang, category) }, { label: name }]} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 aspect-square">
              <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                {product.isNew && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">NEW</span>}
                {product.isBestSeller && <span className="bg-brand-yellow text-brand-dark text-xs font-bold px-2 py-1 rounded-full shadow-sm">⭐ BEST SELLER</span>}
              </div>
              {product.image && <img src={product.image} alt={name} className="w-full h-full object-cover" />}
            </div>

            <div>
              <p className="text-brand-orange font-bold mb-2">{cat.name} · Donut Brand</p>
              <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-2 font-display">{name}</h1>
              {otherNames.length > 0 && <p className="text-gray-500 mb-5">{otherNames.join(' · ')}</p>}

              {customDesc && <p className="text-gray-700 leading-relaxed mb-3 whitespace-pre-line">{customDesc}</p>}
              <p className="text-gray-700 leading-relaxed mb-6">{pt.product.body(name, sizes || '-', category)}</p>

              <h2 className="font-bold text-gray-800 mb-2">{pt.ui.sizes}</h2>
              {variants.length > 0 ? (
                <ul className="flex flex-wrap gap-2 mb-6">
                  {variants.map((v, i) => (
                    <li key={i} className="border border-gray-200 bg-white rounded-xl px-4 py-2 text-center">
                      <span className="block font-bold text-gray-800">{v.weight}</span>
                      <span className="block text-sm">
                        {v.price > 0 ? <span className="text-brand-orange font-bold">฿{v.price}</span> : <span className="text-gray-500">{pt.ui.contactForPrice}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 mb-6">{pt.ui.notSpecified}</p>
              )}

              <h2 className="font-bold text-gray-800 mb-2">{pt.ui.usesTitle}</h2>
              <ul className="flex flex-wrap gap-2 mb-6">
                {cat.uses.map((u) => (
                  <li key={u} className="inline-flex items-center bg-gray-50 border border-gray-200 rounded-full px-3 py-1 text-sm text-gray-700">
                    <CheckCircle size={14} className="text-brand-orange mr-1.5" />{u}
                  </li>
                ))}
              </ul>

              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm text-gray-600 mb-6">
                <dt className="font-semibold">{pt.ui.brandLabel}</dt><dd>{lang === 'th' ? 'ตราโดนัท (Donut Brand)' : lang === 'en' ? 'Donut Brand (ตราโดนัท)' : 'Donut 甜甜圈品牌（ตราโดนัท）'}</dd>
                <dt className="font-semibold">{pt.ui.manufacturerLabel}</dt><dd>{lang === 'th' ? 'บริษัท อธิปพาณิชย์ จำกัด' : 'Athip Panich Co., Ltd.'}</dd>
                <dt className="font-semibold">{pt.ui.certLabel}</dt><dd className="inline-flex items-center"><ShieldCheck size={14} className="text-green-600 mr-1" />CODEX HACCP, GHPs</dd>
              </dl>

              <ContactCTA pt={pt} />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-12 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-6 font-display">{pt.ui.relatedProducts}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
              {related.map((p) => <ProductCard key={p.id} product={p} currentLang={lang} />)}
            </div>
            <div className="text-center mt-8">
              <a href={categoryPath(lang, category)} className="inline-block border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white font-bold py-2 px-6 rounded-full transition">
                {pt.ui.viewCategory}: {cat.name} →
              </a>
            </div>
          </div>
        </section>
      )}

      <CategoryLinks lang={lang} products={products} />
    </>
  );
};

export default ProductPage;
