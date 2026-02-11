import React, { useState } from 'react';
import { Translation, Product, Language } from '../types';
import { PRODUCTS } from '../constants';

interface ProductListProps {
  t: Translation['products'];
  currentLang: Language;
}

const ProductList: React.FC<ProductListProps> = ({ t, currentLang }) => {
  const [filter, setFilter] = useState('all');

  const filteredProducts = filter === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === filter);

  const categories = [
    { id: 'all', label: t.filterAll },
    { id: 'seasoning', label: t.filterSeasoning },
    { id: 'beverage', label: t.filterBeverage },
    { id: 'additives', label: t.filterAdditives },
  ];

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-dark mb-4 font-display">
            {t.title}
          </h2>
          <div className="w-24 h-1 bg-brand-yellow mx-auto"></div>
        </div>

        {/* Filter Buttons */}
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

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              
              {/* Product Image Container */}
              <div className="relative overflow-hidden aspect-square bg-gray-50">
                {product.isNew && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-sm">
                    NEW
                  </div>
                )}
                <img 
                  src={product.image} 
                  alt={product.name[currentLang]} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Add more info on hover */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white font-bold border-2 border-white px-4 py-2 rounded-full">
                    View Detail
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-2 font-display min-h-[3rem] flex items-center justify-center">
                  {product.name[currentLang]}
                </h3>
                <p className="text-sm text-brand-orange font-medium bg-orange-50 inline-block px-3 py-1 rounded-lg">
                  {product.weight}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Helper text for user */}
        <div className="mt-12 text-center text-gray-400 text-sm italic">
          * Images are for illustration purposes. <br/> 
          (Note to developer: Add more products in constants.ts)
        </div>

      </div>
    </section>
  );
};

export default ProductList;