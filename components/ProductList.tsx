import React, { useState, useEffect } from 'react';
import { Translation, Product, Language } from '../types';
import { db } from '../firebase'; 
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Search, ChevronDown } from 'lucide-react';

interface ProductListProps {
  t: Translation['products'];
  currentLang: Language;
}

// สร้าง Component ย่อยสำหรับแสดงสินค้า 1 ชิ้น เพื่อให้จัดการ State ของ "ไซส์ที่เลือก" แยกกันได้
const ProductCard: React.FC<{ product: Product, currentLang: Language }> = ({ product, currentLang }) => {  // รวบรวมข้อมูลไซส์ (รองรับทั้งแบบเก่าและแบบใหม่)
  const variants = product.variants && product.variants.length > 0 
    ? product.variants 
    : (product.weight ? [{ weight: product.weight, price: product.price || 0 }] : []);
  
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeVariant = variants[selectedIdx] || { weight: '-', price: 0 };

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {/* Image & Badges */}
      <div className="relative overflow-hidden aspect-square bg-gray-50 flex-shrink-0">
        {/* ป้ายกำกับ NEW & BEST SELLER */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.isNew && (
            <span className="bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full shadow-sm">
              NEW
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-brand-yellow text-brand-dark text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center">
              ⭐ BEST SELLER
            </span>
          )}
        </div>

        <img 
          src={product.image || 'https://via.placeholder.com/400x400?text=No+Image'} 
          alt={product.name[currentLang]} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white font-bold border-2 border-white px-4 py-2 rounded-full backdrop-blur-sm">
            ดูรายละเอียด
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 text-center flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-sm sm:text-lg font-bold text-gray-800 mb-3 font-display min-h-[3rem] flex items-center justify-center line-clamp-2">
            {product.name[currentLang]}
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
            <p className="text-xs text-gray-400 mb-3">ไม่ระบุขนาด</p>
          )}
        </div>

        {/* ราคา */}
        <div className="mt-auto">
          {activeVariant.price > 0 ? (
            <p className="text-brand-orange font-bold text-xl sm:text-2xl">
              ฿{activeVariant.price}
            </p>
          ) : (
            <p className="text-gray-500 text-sm font-medium bg-gray-100 py-1 rounded-md">
              ติดต่อสอบถามราคา
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductList: React.FC<ProductListProps> = ({ t, currentLang }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12); // โชว์ 12 ชิ้น (3 บรรทัด) ในตอนแรก

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('category'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(loadedProducts);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // รีเซ็ตการแสดงผลเมื่อมีการค้นหาหรือเปลี่ยนหมวดหมู่
  useEffect(() => {
    setVisibleCount(12);
  }, [filter, searchTerm]);

  // ระบบ Filter & Search
  const filteredProducts = products.filter(p => {
    const matchCategory = filter === 'all' || p.category === filter;
    const matchSearch = p.name.th.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (p.name.en && p.name.en.toLowerCase().includes(searchTerm.toLowerCase()));
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
        
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-dark mb-4 font-display">
            {t.title}
          </h2>
          <div className="w-24 h-1 bg-brand-yellow mx-auto mb-8"></div>
          
          {/* ช่องค้นหาสินค้า */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="ค้นหาสินค้าที่ต้องการ..." 
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-brand-orange outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Buttons */}
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

        {/* Grid สินค้า */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-brand-orange rounded-full animate-spin mb-4"></div>
            กำลังโหลดสินค้า...
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
                 ไม่พบสินค้าที่คุณค้นหา
               </div>
            )}

            {/* ปุ่มแสดงเพิ่มเติม */}
            {filteredProducts.length > visibleCount && (
              <div className="text-center mt-12">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 12)}
                  className="inline-flex items-center px-8 py-3 bg-white border border-brand-orange text-brand-orange font-bold rounded-full hover:bg-brand-orange hover:text-white transition shadow-sm"
                >
                  แสดงสินค้าเพิ่มเติม <ChevronDown size={20} className="ml-2" />
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