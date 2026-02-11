// src/components/Hero.tsx (แก้ใหม่)
import React, { useState, useRef, useEffect } from 'react';
import { Translation, HeroSlide } from '../types';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';

interface HeroProps {
  t: Translation['hero'];
  scrollToSection: (id: string) => void;
  slides: HeroSlide[]; // รับข้อมูลสไลด์เข้ามา
}

const Hero: React.FC<HeroProps> = ({ t, scrollToSection, slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // ฟังก์ชันเปลี่ยนไปคลิปถัดไป
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length); // ถ้าถึงตัวสุดท้ายจะวนกลับไป 0
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // เมื่อ currentIndex เปลี่ยน ให้สั่งเล่นวิดีโอใหม่ทันที (เผื่อ browser ไม่ auto play)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    }
  }, [currentIndex]);

  // ถ้าไม่มีวิดีโอเลย ให้แสดงพื้นหลังดำ
  if (slides.length === 0) return <div className="h-screen bg-black" />;

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
         <video 
            ref={videoRef}
            key={slides[currentIndex].id} // key สำคัญ! เปลี่ยน key เพื่อให้ React รู้ว่าเป็นคนละวิดีโอ
            autoPlay 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-60" // ปรับความสว่างวิดีโอลงหน่อยเพื่อให้ตัวหนังสือเด่น
            src={slides[currentIndex].url} 
            onEnded={handleNext} // *** สำคัญ: จบแล้วไปคลิปต่อไป ***
          />
      </div>

      {/* ปุ่มกดเลื่อนเอง (Optional) */}
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

      {/* Dots Indicator (จุดบอกตำแหน่ง) */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, idx) => (
          <div 
            key={idx} 
            className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-brand-orange w-8' : 'bg-white/50'}`} 
          />
        ))}
      </div>

      {/* Content Overlay (คงเดิม) */}
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

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce cursor-pointer" onClick={() => scrollToSection('about')}>
        <ChevronDown size={48} className="text-white drop-shadow-lg" />
      </div>
    </section>
  );
};

export default Hero;