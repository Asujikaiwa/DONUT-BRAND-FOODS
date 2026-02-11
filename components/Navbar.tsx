import React from 'react';
import { Facebook, Instagram, Phone, Mail, MessageCircle } from 'lucide-react';
import { Language, Translation } from '../types';

// Custom icons for Line and TikTok since Lucide doesn't have them built-in perfectly
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const LineIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.5 2 2 5.6 2 10c0 2.4 1.4 4.6 3.7 6.1.6.3.6.7.4 1.3-.3 1-.8 2.2-.9 2.3-.1.3.1.5.4.5.2 0 1.2-.2 5-2.6 1.1.3 2.3.4 3.4.4 5.5 0 10-3.6 10-8s-4.5-8-10-8z"/>
  </svg>
);

interface NavbarProps {
  currentLang: Language;
  setLang: (lang: Language) => void;
  t: Translation['nav'];
  scrollToSection: (id: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentLang, setLang, t, scrollToSection }) => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white shadow-md border-t-4 border-brand-orange">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          
          {/* Top Row: Contact & Socials + Lang Switcher */}
          <div className="flex justify-end items-center py-2 space-x-6 border-b border-gray-100">
            {/* Socials & Contact */}
            <div className="flex items-center space-x-4 text-gray-600 text-sm">
              <a href="#" className="hover:text-brand-orange transition flex items-center gap-1">
                <Instagram size={18} />
              </a>
              <a href="#" className="hover:text-brand-orange transition flex items-center gap-1">
                <TikTokIcon className="w-[18px] h-[18px]" />
              </a>
              <a href="#" className="hover:text-brand-orange transition flex items-center gap-1">
                <Facebook size={18} />
              </a>
              <a href="#" className="hover:text-green-500 transition flex items-center gap-1">
                <LineIcon className="w-[18px] h-[18px]" />
              </a>
              <a href="tel:+66123456789" className="hover:text-brand-orange transition flex items-center gap-1">
                <Phone size={16} /> <span>012-345-6789</span>
              </a>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setLang('th')} 
                className={`px-2 py-1 text-xs rounded border transition ${currentLang === 'th' ? 'bg-brand-orange text-white border-brand-orange' : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'}`}
              >
                ไทย
              </button>
              <button 
                onClick={() => setLang('en')} 
                className={`px-2 py-1 text-xs rounded border transition ${currentLang === 'en' ? 'bg-brand-orange text-white border-brand-orange' : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'}`}
              >
                ENG
              </button>
              <button 
                onClick={() => setLang('cn')} 
                className={`px-2 py-1 text-xs rounded border transition ${currentLang === 'cn' ? 'bg-brand-orange text-white border-brand-orange' : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'}`}
              >
                中文
              </button>
            </div>
          </div>

          {/* Bottom Row: Logo (Brand) & Main Navigation */}
          <div className="flex justify-between items-center py-4">
            {/* Logo/Brand Name */}
            <div className="flex items-center cursor-pointer" onClick={() => scrollToSection('home')}>
              {/* Simple Circle Logo Placeholder */}
              <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold text-xl mr-2 font-display">
                D
              </div>
              <span className="text-2xl font-bold text-brand-dark font-display tracking-tight">
                DONUT <span className="text-brand-orange">BRAND</span>
              </span>
            </div>

            {/* Centered Navigation Buttons */}
            <div className="flex space-x-1 md:space-x-4">
              <button 
                onClick={() => scrollToSection('home')}
                className="px-4 py-2 text-brand-dark hover:text-brand-orange hover:bg-orange-50 rounded-full transition font-medium"
              >
                {t.home}
              </button>
              <button 
                onClick={() => scrollToSection('products')}
                className="px-4 py-2 text-brand-dark hover:text-brand-orange hover:bg-orange-50 rounded-full transition font-medium"
              >
                {t.products}
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="px-4 py-2 text-brand-dark hover:text-brand-orange hover:bg-orange-50 rounded-full transition font-medium"
              >
                {t.contact}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;