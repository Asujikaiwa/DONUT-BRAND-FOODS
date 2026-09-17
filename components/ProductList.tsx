import React, { useState, useEffect } from 'react';
import { Translation, Product, Language } from '../types';
import { db } from '../firebase'; 
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Search, ChevronDown, Percent } from 'lucide-react';
import { PAGE_TEXT } from '../constants';
import { productPath } from '../routes';

interface ProductListProps {
  t: Translation['products'];
  currentLang: Language;
  /** สินค้าที่มี slug แล้ว (ส่งมาจาก App ซึ่งดึงจาก Firestore / ข้อมูลที่ prerender ไว้) */
  products: (Product & { slug: string })[];
  loading: boolean;
  /** ใช้ในหน้าหมวด: แสดงเฉพาะหมวดนี้ ซ่อนปุ่มกรอง และแสดงสินค้าทั้งหมดในหมวด */
  fixedCategory?: string;
  title?: string;
  showBanners?: boolean;
}

export const ProductCard: React.FC<{ product: Product & { slug: string }, currentLang: Language }> = ({ product, currentLang }) => {
  const ui = PAGE_TEXT[currentLang].ui;
  const href = productPath(currentLang, product.slug);
  const name = product.name[currentLang] || product.name.th;  const variants = product.variants && product.variants.length > 0 
    ? product.variants 
    : (product.weight ? [{ weight: product.weight, price: product.price || 0 }] : []);
  
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeVariant = variants[selectedIdx] || { weight: '-', price: 0 };

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full relative">
      
      {/* ภาพและป้ายกำกับ */}
      <div className="relative overflow-hidden aspect-square bg-gray-50 flex-shrink-0">
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.isNew && (
            <span className="bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full shadow-sm">NEW</span>
          )}
          {product.isBestSeller && (
            <span className="bg-brand-yellow text-brand-dark text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full shadow-sm">⭐ BEST SELLER</span>
          )}
        </div>

        <a href={href} aria-label={name} className="block w-full h-full">
          <img
                loading="lazy"
                decoding="async"
            src={product.image || 'https://via.placeholder.com/400x400?text=No+Image'} 
            alt={name} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
            <span className="text-white font-bold border-2 border-white px-4 py-2 rounded-full">
              {ui.viewDetails}
            </span>
          </div>
        </a>
      </div>

      {/* ข้อมูลสินค้า */}
      <div className="p-4 text-center flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-sm sm:text-lg font-bold text-gray-800 mb-3 font-display min-h-[3rem] flex items-center justify-center line-clamp-2">
            <a href={href} className="hover:text-brand-orange transition">{name}</a>
          </h3>
          
          {/* ตัวเลือกขนาด */}
          {variants.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-1.5 mb-3">
              {variants.map((v, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIdx(i)}
                  className={`text-xs px-2 sm:px-3 py-1 rounded-md border font-medium transition-all ${
                    selectedIdx === i 
                    ? 'bg-brand-orange text-white border-brand-orange' 
                    : 'bg-white text-gray-500 border-gray-200 hover:border-brand-orange/50'
                  }`}
                >
                  {v.weight}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 mb-3">{ui.notSpecified}</p>
          )}
        </div>

        <div className="mt-auto">
          {activeVariant.price > 0 ? (
            <p className="text-brand-orange font-bold text-xl sm:text-2xl">
              ฿{activeVariant.price}
            </p>
          ) : (
            <p className="text-gray-500 text-sm font-medium bg-gray-100 py-1 rounded-md">
              {ui.contactForPrice}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductList: React.FC<ProductListProps> = ({ t, currentLang, products, loading, fixedCategory, title, showBanners = true }) => {
  const ui = PAGE_TEXT[currentLang].ui;
  // หน้าหมวดแสดงสินค้าครบทุกตัว (ให้ Google เห็นลิงก์ครบ) / หน้าแรกแสดงทีละ 12
  const pageSize = fixedCategory ? 1000 : 12;
  const [filter, setFilter] = useState(fixedCategory || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [banners, setBanners] = useState<any[]>([]); // สำหรับเก็บรูปโปรโมชั่น
  const [visibleCount, setVisibleCount] = useState(pageSize);

  useEffect(() => {
    if (!showBanners) return;
    // ดึงข้อมูลแบนเนอร์โปรโมชั่น (รายการสินค้าย้ายไปดึงที่ App.tsx แล้ว)
    const qBanner = query(collection(db, 'banners'));
    const unsubBanner = onSnapshot(qBanner, (snapshot) => {
      setBanners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => { unsubBanner(); };
  }, [showBanners]);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [filter, searchTerm, pageSize]);

  // ระบบค้นหาและซ่อนสินค้า
  const term = searchTerm.toLowerCase();
  const filteredProducts = products.filter(p => {
    if ((p as any).isHidden) return false; 
    const matchCategory = filter === 'all' || p.category === filter;
    const matchSearch = !term ||
                        p.name.th.toLowerCase().includes(term) || 
                        (p.name.en && p.name.en.toLowerCase().includes(term)) ||
                        (p.name.cn && p.name.cn.toLowerCase().includes(term));
    return matchCategory && matchSearch;
  });

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const categories = [
    { id: 'all', label: t.filterAll },
    { id: 'seasoning', label: t.filterSeasoning },
    { id: 'beverage', label: t.filterBeverage },
    { id: 'additives', label: t.filterAdditives },
  ];

  return (
    <section id="products" className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= จุดแสดงแบนเนอร์โปรโมชั่น ================= */}
        {banners.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6 border-l-4 border-brand-orange pl-3">
              <Percent className="text-brand-orange" size={24} />
              <h3 className="text-2xl font-bold text-gray-800 font-display">{ui.promotions}</h3>
            </div>
            
            {/* เลื่อนสไลด์รูปแบนเนอร์ */}
            <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory hide-scrollbar">
              {banners.map((b) => (
                <div key={b.id} className="snap-center flex-shrink-0 w-[85%] md:w-[60%] lg:w-[45%]">
                  <img
                loading="lazy"
                decoding="async"
                    src={b.url} 
                    alt="Promotion Banner" 
                    className="w-full h-auto aspect-[16/9] object-cover rounded-2xl shadow-lg border border-gray-200"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {/* ========================================================= */}

        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-dark mb-4 font-display">
            {title || t.title}
          </h2>
          <div className="w-24 h-1 bg-brand-yellow mx-auto mb-8"></div>
          
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder={ui.searchPlaceholder} 
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-brand-orange outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* หมวดหมู่ (ซ่อนในหน้าหมวด) */}
        {!fixedCategory && (
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 text-sm sm:text-base ${
                filter === cat.id 
                  ? 'bg-brand-orange text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        )}

        {/* รายการสินค้า */}
        {loading && products.length === 0 ? (
          <div className="text-center py-20 text-gray-400 flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-brand-orange rounded-full animate-spin mb-4"></div>
            {ui.loading}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} currentLang={currentLang} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
               <div className="text-center text-gray-500 mt-12 bg-white p-8 rounded-xl border border-dashed border-gray-300">
                 {ui.noResults}
               </div>
            )}

            {filteredProducts.length > visibleCount && (
              <div className="text-center mt-12">
                <button 
                  onClick={() => setVisibleCount(prev => prev + pageSize)}
                  className="inline-flex items-center px-8 py-3 bg-white border border-brand-orange text-brand-orange font-bold rounded-full hover:bg-brand-orange hover:text-white transition shadow-sm"
                >
                  {ui.showMore} <ChevronDown size={20} className="ml-2" />
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
};

export default ProductList;