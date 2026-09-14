import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Translation, HeroSlide } from '../types';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { db } from '../firebase'; // Import Database
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

/**
 * วิดีโอสำรอง: เก็บไว้ในโฟลเดอร์ public/videos และเสิร์ฟจาก Firebase Hosting โดยตรง
 * ใช้เมื่อดึงจาก Firestore ไม่ได้ หรือ URL ใน Firestore (Firebase Storage) โหลดไม่ขึ้น
 */
const LOCAL_SLIDES: HeroSlide[] = [
  { id: 'local-1', type: 'video', url: '/videos/hero-1.mp4', poster: '/videos/hero-1-poster.jpg' },
  { id: 'local-2', type: 'video', url: '/videos/hero-2.mp4', poster: '/videos/hero-2-poster.jpg' },
  { id: 'local-3', type: 'video', url: '/videos/hero-3.mp4', poster: '/videos/hero-3-poster.jpg' },
];

// รูปพื้นหลังสุดท้าย ถ้าวิดีโอเล่นไม่ได้เลยสักตัว
const FALLBACK_POSTER = '/videos/hero-1-poster.jpg';

interface HeroProps {
  t: Translation['hero'];
  scrollToSection: (id: string) => void;
}

const Hero: React.FC<HeroProps> = ({ t, scrollToSection }) => {
  const [remoteSlides, setRemoteSlides] = useState<HeroSlide[]>([]);
  const [brokenUrls, setBrokenUrls] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // --- ดึงข้อมูลวิดีโอจาก Firebase (ถ้าพังก็ไม่เป็นไร เดี๋ยวใช้ไฟล์ในเครื่องแทน) ---
  useEffect(() => {
    const q = query(collection(db, 'hero_slides'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loaded = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as HeroSlide))
          .filter((s) => !!s.url);
        setRemoteSlides(loaded);
      },
      (error) => {
        // อ่าน Firestore ไม่ได้ (สิทธิ์ / เน็ต / บิลลิ่ง) -> ใช้วิดีโอสำรองในเครื่อง
        console.warn('[Hero] โหลด hero_slides จาก Firestore ไม่สำเร็จ:', error);
        setRemoteSlides([]);
      }
    );
    return () => unsubscribe();
  }, []);

  // เลือกชุดสไลด์ที่ใช้ได้จริง: ของ Firestore ก่อน ถ้าพังหมดค่อยใช้ไฟล์ใน public/videos
  const slides = useMemo(() => {
    const usableRemote = remoteSlides.filter((s) => !brokenUrls.includes(s.url));
    if (usableRemote.length > 0) return usableRemote;
    return LOCAL_SLIDES.filter((s) => !brokenUrls.includes(s.url));
  }, [remoteSlides, brokenUrls]);

  // กันค่า index เกินหลังชุดสไลด์เปลี่ยน
  const safeIndex = slides.length > 0 ? currentIndex % slides.length : 0;
  const currentSlide = slides[safeIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (slides.length === 0 ? 0 : (prev + 1) % slides.length));
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (slides.length === 0 ? 0 : (prev - 1 + slides.length) % slides.length));
  }, [slides.length]);

  // วิดีโอตัวไหนโหลดไม่ขึ้น -> จำไว้ว่าเสีย แล้วข้ามไปตัวถัดไปอัตโนมัติ
  const handleVideoError = useCallback(() => {
    const badUrl = currentSlide?.url;
    if (!badUrl) return;
    console.warn('[Hero] เล่นวิดีโอนี้ไม่ได้ ข้ามไปตัวถัดไป:', badUrl);
    setBrokenUrls((prev) => (prev.includes(badUrl) ? prev : [...prev, badUrl]));
    setCurrentIndex(0);
  }, [currentSlide]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch((e) => console.log('Autoplay prevented:', e));
    }
  }, [safeIndex, currentSlide?.url]);

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden bg-black">
      {/* ระหว่างรอวิดีโอ = พื้นดำเปล่า ๆ (ไม่มีรูปซ้อน)
          รูปสำรองจะขึ้นเฉพาะตอนที่ไม่มีวิดีโอตัวไหนเล่นได้เลย */}
      {!currentSlide && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${FALLBACK_POSTER})` }}
          aria-hidden="true"
        />
      )}

      {/* Video Background */}
      {currentSlide && (
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            key={currentSlide.id}
            autoPlay
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            src={currentSlide.url}
            onEnded={handleNext}
            onError={handleVideoError}
          />
        </div>
      )}

      {/* Controls */}
      {slides.length > 1 && (
        <>
          <button onClick={handlePrev} aria-label="สไลด์ก่อนหน้า" className="absolute left-4 top-1/2 -translate-y-1/2 z-30 text-white/50 hover:text-white transition">
            <ChevronLeft size={48} />
          </button>
          <button onClick={handleNext} aria-label="สไลด์ถัดไป" className="absolute right-4 top-1/2 -translate-y-1/2 z-30 text-white/50 hover:text-white transition">
            <ChevronRight size={48} />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === safeIndex ? 'bg-brand-orange w-8' : 'bg-white/50'}`}
            />
          ))}
        </div>
      )}

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
