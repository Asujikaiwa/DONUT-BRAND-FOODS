import React from 'react';
import { Translation } from '../types';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  t: Translation['hero'];
  scrollToSection: (id: string) => void;
}

const Hero: React.FC<HeroProps> = ({ t, scrollToSection }) => {
  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full bg-black/20 z-10"></div>
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover"
        // Using a high quality stock food/cooking video
        src="https://videos.pexels.com/video-files/5091624/5091624-hd_1920_1080_24fps.mp4" 
      />

      {/* Content Overlay */}
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
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce cursor-pointer" onClick={() => scrollToSection('about')}>
        <ChevronDown size={48} className="text-white drop-shadow-lg" />
      </div>
    </section>
  );
};

export default Hero;