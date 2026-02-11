import React from 'react';
import { Translation } from '../types';
import { Award, ShieldCheck, Leaf } from 'lucide-react';

interface AboutProps {
  t: Translation['about'];
}

const About: React.FC<AboutProps> = ({ t }) => {
  return (
    <section id="about" className="py-20 bg-brand-cream relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          {/* Image Side */}
          <div className="w-full md:w-1/2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2">
               {/* Corporate/Factory Stock Image */}
              <img 
                src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=1000" 
                alt="Donut Brand Factory" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Text Side */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6 font-display border-l-8 border-brand-orange pl-4">
              {t.title}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {t.description}
            </p>

            {/* Features/Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition">
                <ShieldCheck size={40} className="text-green-500 mb-2" />
                <span className="font-bold text-gray-700">FDA Certified</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition">
                <Award size={40} className="text-brand-orange mb-2" />
                <span className="font-bold text-gray-700">Premium Quality</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition">
                <Leaf size={40} className="text-brand-yellow mb-2" />
                <span className="font-bold text-gray-700">Natural Taste</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
        <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" fill="#FF8C00" />
        </svg>
      </div>
    </section>
  );
};

export default About;