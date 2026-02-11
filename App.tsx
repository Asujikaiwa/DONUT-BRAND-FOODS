// src/App.tsx (แก้ไข)
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import ProductList from './components/ProductList';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel'; // Import เข้ามาใหม่
import { Language } from './types';
import { TRANSLATIONS } from './constants';

const App: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<Language>('th');
  const [isAdminMode, setIsAdminMode] = useState(false); // State สำหรับสลับหน้า Admin
  
  const t = TRANSLATIONS[currentLang];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ถ้าอยู่ในโหมด Admin ให้แสดงหน้า AdminPanel แทนหน้าเว็บปกติ
  if (isAdminMode) {
    return <AdminPanel onBack={() => setIsAdminMode(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 relative"> {/* เพิ่ม relative เพื่อให้ปุ่ม admin ลอยอิงกับหน้านี้ได้ */}
      <Navbar 
        currentLang={currentLang} 
        setLang={setCurrentLang} 
        t={t.nav}
        scrollToSection={scrollToSection}
      />
      <main className="pt-[88px] md:pt-[104px]">
        <Hero t={t.hero} scrollToSection={scrollToSection} />
        <About t={t.about} />
        <ProductList t={t.products} currentLang={currentLang} />
      </main>
      <Footer t={t.contact} />

      {/* ปุ่มลับสำหรับเข้าหน้า Admin (มุมขวาล่าง) */}
      <button 
        onClick={() => setIsAdminMode(true)}
        className="fixed bottom-2 right-2 opacity-20 hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded z-50 transition-opacity"
      >
        Admin Login
      </button>
    </div>
  );
};

export default App;