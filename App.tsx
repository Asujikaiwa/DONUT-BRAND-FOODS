// src/App.tsx — เลือกหน้าและภาษาจาก URL (/, /en/, /zh/, /seasoning-powder/, /product/<slug>/, /faq/, /admin/)
import React, { useEffect, useMemo, useState, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import ProductList from './components/ProductList';
import Footer from './components/Footer';
import CategoryPage from './components/CategoryPage';
import ProductPage from './components/ProductPage';
import FAQ from './components/FAQ';
import { CategoryLinks, NotFound } from './components/PageParts';
import { Product } from './types';
import { TRANSLATIONS, PAGE_TEXT } from './constants';
import { db } from './firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { parsePath, visibleProducts, withSlugs, homePath } from './routes';

// หน้า Admin โหลดแยกเฉพาะตอนเข้า /admin/ (ไม่ถ่วงหน้าเว็บปกติ)
const AdminPanel = lazy(() => import('./components/AdminPanel'));

interface AppProps {
  /** path ของหน้า เช่น "/en/product/cheese-seasoning/" */
  path: string;
  /** รายการสินค้าที่ฝังมากับ HTML ตอน prerender (ให้หน้าแรกไม่ว่างและตรงกับ HTML) */
  initialProducts?: Product[];
}

const App: React.FC<AppProps> = ({ path, initialProducts = [] }) => {
  const route = useMemo(() => parsePath(path), [path]);
  const lang = route.lang;
  const t = TRANSLATIONS[lang];
  const pt = PAGE_TEXT[lang];

  const [rawProducts, setRawProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);

  // ดึงสินค้าสดจาก Firestore (ถ้า Admin เพิ่ม/แก้สินค้า หน้าเว็บจะอัปเดตทันที)
  useEffect(() => {
    if (route.type === 'admin') return;
    const q = query(collection(db, 'products'), orderBy('category'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        // ตอนออฟไลน์ Firestore จะส่งผลลัพธ์ว่างจากแคชมาก่อน -> ไม่เอามาทับข้อมูลที่ prerender ไว้
        if (snapshot.empty && snapshot.metadata.fromCache) return;
        setRawProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[]);
        setLoading(false);
      },
      (error) => {
        console.warn('[App] โหลดสินค้าจาก Firestore ไม่สำเร็จ ใช้ข้อมูลที่ prerender ไว้แทน:', error);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [route.type]);

  const products = useMemo(() => withSlugs(visibleProducts(rawProducts)), [rawProducts]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // อยู่หน้าอื่น -> กลับหน้าแรกของภาษานั้นแล้วเลื่อนไปยังส่วนที่เลือก
      window.location.href = `${homePath(lang)}#${id}`;
    }
  };

  if (route.type === 'admin') {
    return (
      <Suspense fallback={<div className="p-10 text-center text-gray-400">Loading...</div>}>
        <AdminPanel onBack={() => { window.location.href = '/'; }} />
      </Suspense>
    );
  }

  let content: React.ReactNode;
  switch (route.type) {
    case 'home':
      content = (
        <>
          <Hero t={t.hero} scrollToSection={scrollToSection} eyebrow={pt.ui.brandEyebrow} />
          <About t={t.about} />
          <CategoryLinks lang={lang} products={products} />
          <ProductList t={t.products} currentLang={lang} products={products} loading={loading} />
          <FAQ lang={lang} products={products} limit={3} />
        </>
      );
      break;
    case 'category':
      content = <CategoryPage lang={lang} category={route.category} products={products} loading={loading} />;
      break;
    case 'product':
      content = <ProductPage lang={lang} slug={route.slug} products={products} loading={loading} />;
      break;
    case 'faq':
      content = <FAQ lang={lang} products={products} fullPage />;
      break;
    default:
      content = <NotFound lang={lang} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 relative"> {/* เพิ่ม relative เพื่อให้ปุ่ม admin ลอยอิงกับหน้านี้ได้ */}
      <Navbar
        currentLang={lang}
        route={route}
        t={t.nav}
        faqLabel={pt.ui.faqNav}
        scrollToSection={scrollToSection}
      />
      <main className="pt-[88px] md:pt-[104px]">
        {content}
      </main>
      <Footer t={t.contact} />

      {/* ปุ่มลับสำหรับเข้าหน้า Admin (มุมขวาล่าง) — ย้ายไปอยู่ที่ /admin/ */}
      <a
        href="/admin/"
        rel="nofollow"
        className="fixed bottom-2 right-2 opacity-20 hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded z-50 transition-opacity"
      >
        Admin Login
      </a>
    </div>
  );
};

export default App;
