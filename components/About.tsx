import React, { useState, useEffect } from 'react';
import { Translation } from '../types';
import { Award, ShieldCheck, Leaf, History, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface AboutProps {
  t: Translation['about'];
}

const About: React.FC<AboutProps> = ({ t }) => {
  // ข้อมูลรูปภาพ 1-7 (ดึงคำอธิบายมาจากไฟล์แปลภาษา)
  const facilityImages = [
    '/PictureProduct/Other/About/LINE_ALBUM_Information_260224_1.jpg',
    '/PictureProduct/Other/About/LINE_ALBUM_Information_260224_2.jpg',
    '/PictureProduct/Other/About/LINE_ALBUM_Information_260224_3.jpg',
    '/PictureProduct/Other/About/LINE_ALBUM_Information_260224_4.jpg',
    '/PictureProduct/Other/About/LINE_ALBUM_Information_260224_5.jpg',
    '/PictureProduct/Other/About/LINE_ALBUM_Information_260224_6.jpg',
    '/PictureProduct/Other/About/LINE_ALBUM_Information_260224_7.jpg',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // เลื่อนสไลด์อัตโนมัติทุกๆ 4 วินาที
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % facilityImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [facilityImages.length]);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % facilityImages.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + facilityImages.length) % facilityImages.length);

  return (
    <section id="about" className="py-20 bg-brand-cream relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= 1. ส่วนประวัติบริษัท ================= */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          <div className="w-full lg:w-5/12 flex justify-center order-2 lg:order-1">
            <div className="relative rounded-full overflow-hidden shadow-xl border-8 border-white aspect-square w-64 md:w-80 lg:w-full max-w-md bg-white">
              <img 
                src="/PictureProduct/Other/Logo/logo.jpg" 
                alt="Athip Panich Logo" 
                className="w-full h-full object-contain p-6"
              />
            </div>
          </div>

          <div className="w-full lg:w-7/12 order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-6 border-b-2 border-brand-orange pb-4 inline-flex">
              <History className="text-brand-orange" size={32} />
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark font-display">
                {t.title}
              </h2>
            </div>
            
            <div className="text-gray-600 leading-relaxed space-y-4 mb-8 text-base md:text-lg">
              {t.description.split('\n').map((paragraph, idx) => (
                paragraph.trim() !== '' && <p key={idx} className="indent-4">{paragraph}</p>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition">
                <ShieldCheck size={36} className="text-green-500 mb-2" />
                <span className="font-bold text-gray-700 text-sm">FDA Certified</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition">
                <Award size={36} className="text-brand-orange mb-2" />
                <span className="font-bold text-gray-700 text-sm">Premium Quality</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition">
                <Leaf size={36} className="text-brand-yellow mb-2" />
                <span className="font-bold text-gray-700 text-sm">Natural Taste</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 2. ส่วนมาตรฐานใบรับรอง (CODEX) ================= */}
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-16 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-full md:w-2/5">
              <img 
                src="/PictureProduct/Other/About/CODEX_HACCP&GHPS.jpg" 
                alt="CODEX HACCP & GHPs Certificate" 
                className="w-full h-auto rounded-xl shadow-md border border-gray-200 hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="w-full md:w-3/5">
              <h3 className="text-2xl md:text-3xl font-bold text-brand-dark mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={28} />
                {t.certTitle} {/* ใช้คำแปล */}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {t.certDesc.split('\n').map((paragraph, idx) => (
                   <React.Fragment key={idx}>
                      {paragraph.includes('CODEX HACCP') ? (
                         <span dangerouslySetInnerHTML={{__html: paragraph.replace('CODEX HACCP', '<strong>CODEX HACCP</strong>').replace('GHPs (Good Hygiene Practices)', '<strong>GHPs (Good Hygiene Practices)</strong>')}} />
                      ) : (
                         paragraph
                      )}
                      <br/>
                   </React.Fragment>
                ))}
              </p>
            </div>
          </div>
        </div>

        {/* ================= 3. ส่วนสไลด์โชว์กระบวนการทำงาน ================= */}
        <div>
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-brand-dark mb-3 font-display">{t.processTitle}</h3> {/* ใช้คำแปล */}
            <div className="w-24 h-1 bg-brand-orange mx-auto"></div>
          </div>
          
          <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 max-w-5xl mx-auto flex flex-col md:flex-row group">
            
            {/* ฝั่งซ้าย: รูปภาพ */}
            <div className="w-full md:w-1/2 relative aspect-[4/3] md:aspect-auto md:h-[450px] bg-gray-100 overflow-hidden">
              {facilityImages.map((src, index) => (
                <img 
                  key={index}
                  src={src} 
                  alt={`Facility ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                    index === currentIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
                  }`}
                />
              ))}
            </div>

            {/* ฝั่งขวา: ข้อความอธิบาย (ดึงจากอาเรย์ facilities ในคำแปล) */}
            <div className="w-full md:w-1/2 relative bg-white flex items-center justify-center min-h-[250px] md:min-h-[450px] p-8 md:p-12">
              {t.facilities.map((desc, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 flex flex-col items-center justify-center p-8 md:p-12 text-center transition-all duration-1000 ease-in-out ${
                    index === currentIndex ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-4 z-0 pointer-events-none'
                  }`}
                >
                  <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <CheckCircle className="text-brand-orange" size={32} />
                  </div>
                  <p className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}

              {/* ปุ่มเลื่อน ซ้าย-ขวา */}
              <button 
                onClick={handlePrev} 
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-600 transition opacity-0 group-hover:opacity-100 z-20 shadow-md backdrop-blur-sm"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={handleNext} 
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-600 transition opacity-0 group-hover:opacity-100 z-20 shadow-md backdrop-blur-sm"
              >
                <ChevronRight size={24} />
              </button>

              {/* จุดบอกตำแหน่งสไลด์ (Dots) */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
                {facilityImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? 'bg-brand-orange w-8' : 'bg-gray-200 w-2.5 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
      
      {/* วงกลมตกแต่งฉากหลัง */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10 pointer-events-none">
        <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" fill="#FF8C00" />
        </svg>
      </div>
    </section>
  );
};

export default About;