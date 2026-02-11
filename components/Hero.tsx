import React, { useState, useRef, useEffect } from 'react';
import { Translation, HeroSlide } from '../types';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { db } from '../firebase'; // Import Database
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

interface HeroProps {
  t: Translation['hero'];
  scrollToSection: (id: string) => void;
  // ลบ slides ออกจาก props เพราะเราจะดึงเอง
}

const Hero: React.FC<HeroProps> = ({ t, scrollToSection }) => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // --- ดึงข้อมูลวิดีโอจาก Firebase ---
  useEffect(() => {
    const q = query(collection(db, 'hero_slides'), orderBy('createdAt', 'desc')); // เรียงจากใหม่ไปเก่า
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedSlides = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HeroSlide[];
      setSlides(loadedSlides);
    });
    return () => unsubscribe();
  }, []);

  const handleNext = () => {
    if (slides.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    if (slides.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    }
  }, [currentIndex]);

  // ถ้ายังไม่มีวิดีโอ ให้แสดงพื้นหลังดำรอ
  if (slides.length === 0) {
    return (
      <section id="home" className="relative h-screen w-full bg-black flex items-center justify-center">
         <div className="text-white text-opacity-50">Loading Video...</div>
      </section>
    );
  }

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
         <video 
            ref={videoRef}
            key={slides[currentIndex].id}
            autoPlay 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            src={slides[currentIndex].url} 
            onEnded={handleNext}
          />
      </div>

      {/* Controls */}
      {slides.length > 1 && (
        <>
          <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 text-white/50 hover:text-white transition">
            <ChevronLeft size={48} />
          </button>
          <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 text-white/50 hover:text-white transition">
            <ChevronRight size={48} />
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, idx) => (
          <div 
            key={idx} 
            className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-brand-orange w-8' : 'bg-white/50'}`} 
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg font-display">
          {t.title}
        </h1>
        <p className="text-xl md:text-2xl text-brand-cream mb-8 max-w-2xl drop-shadow-md">
          {t.subtitle}
        </p>
        <button 
          onClick={() => scrollToSection('products')}
          className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
        >
          {t.cta}
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce cursor-pointer" onClick={() => scrollToSection('about')}>
        <ChevronDown size={48} className="text-white drop-shadow-lg" />
      </div>
    </section>
  );
};

export default Hero;