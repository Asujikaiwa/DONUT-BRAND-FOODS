import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import ProductList from './components/ProductList';
import Footer from './components/Footer';
import { Language } from './types';
import { TRANSLATIONS } from './constants';

const App: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<Language>('th');
  const t = TRANSLATIONS[currentLang];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        currentLang={currentLang} 
        setLang={setCurrentLang} 
        t={t.nav}
        scrollToSection={scrollToSection}
      />
      <main className="pt-[88px] md:pt-[104px]"> {/* Padding top to account for sticky navbar height */}
        <Hero t={t.hero} scrollToSection={scrollToSection} />
        <About t={t.about} />
        <ProductList t={t.products} currentLang={currentLang} />
      </main>
      <Footer t={t.contact} />
    </div>
  );
};

export default App;