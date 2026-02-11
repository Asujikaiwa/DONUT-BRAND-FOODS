import React, { useState, useEffect } from 'react';
import { Translation, Product, Language } from '../types';
import { db } from '../firebase'; // Import Database
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

interface ProductListProps {
  t: Translation['products'];
  currentLang: Language;
}

const ProductList: React.FC<ProductListProps> = ({ t, currentLang }) => {
  const [filter, setFilter] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // --- ดึงข้อมูลสินค้าจาก Firebase ---
  useEffect(() => {
    // ดึงข้อมูลและเรียงตาม category เพื่อความสวยงาม
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

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter);

  const categories = [
    { id: 'all', label: t.filterAll },
    { id: 'seasoning', label: t.filterSeasoning },
    { id: 'beverage', label: t.filterBeverage },
    { id: 'additives', label: t.filterAdditives },
  ];

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-dark mb-4 font-display">
            {t.title}
          </h2>
          <div className="w-24 h-1 bg-brand-yellow mx-auto"></div>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                filter === cat.id 
                  ? 'bg-brand-orange text-white shadow-lg scale-105' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                
                {/* Image */}
                <div className="relative overflow-hidden aspect-square bg-gray-50">
                  {product.isNew && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-sm">
                      NEW
                    </div>
                  )}
                  <img 
                    src={product.image || 'https://via.placeholder.com/400x400?text=No+Image'} 
                    alt={product.name[currentLang]} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white font-bold border-2 border-white px-4 py-2 rounded-full">
                      View Detail
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 text-center">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 font-display min-h-[3rem] flex items-center justify-center">
                    {product.name[currentLang]}
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 bg-gray-100 inline-block px-2 py-0.5 rounded">
                      {product.weight}
                    </p>
                    {product.price && (
                      <p className="text-brand-orange font-bold text-xl">
                        ฿{product.price}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {filteredProducts.length === 0 && !loading && (
           <div className="text-center text-gray-400 mt-8">ยังไม่มีสินค้าในหมวดหมู่นี้</div>
        )}

      </div>
    </section>
  );
};

export default ProductList;