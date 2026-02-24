import React, { useState, useEffect } from 'react';
import { Language, Translation } from '../types';
import { Menu, X, Facebook, Instagram, Mail, Globe } from 'lucide-react';

interface NavbarProps {
  currentLang: Language;
  setLang: (lang: Language) => void;
  t: Translation['nav'];
  scrollToSection: (id: string) => void;
}

// สร้าง Custom Icon สำหรับ TikTok และ Line
const TiktokIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a3 3 0 0 1-3-3" />
  </svg>
);

const LineIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.5 10.5C21.5 6.35786 17.2467 3 12 3C6.75329 3 2.5 6.35786 2.5 10.5C2.5 13.9167 4.79326 16.8184 8.08272 17.7508C8.58309 17.893 8.70678 18.2573 8.61899 18.7296C8.54719 19.1158 8.16335 20.8967 8.09355 21.2464C7.99464 21.7423 8.35852 21.8465 8.76106 21.5979C9.20625 21.323 14.1505 18.4239 16.6385 16.2713C19.5935 13.7145 21.5 12.2458 21.5 10.5Z" />
  </svg>
);

const Navbar: React.FC<NavbarProps> = ({ currentLang, setLang, t, scrollToSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // เช็คการเลื่อนจอเพื่อให้ Navbar เปลี่ยนสี
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: t.home },
    { id: 'products', label: t.products },
    { id: 'contact', label: t.contact },
  ];

  // ข้อมูลลิงก์โซเชียลมีเดีย
  const socialLinks = [
    { name: 'Facebook', icon: <Facebook size={18} />, url: "https://www.facebook.com/athip.panich.donut/?locale=th_TH", hoverColor: "hover:text-blue-600 hover:bg-blue-50" },
    { name: 'Instagram', icon: <Instagram size={18} />, url: "https://www.instagram.com/don_utbrand/", hoverColor: "hover:text-pink-600 hover:bg-pink-50" },
    { name: 'TikTok', icon: <TiktokIcon size={18} />, url: "https://www.tiktok.com/@donut.athip", hoverColor: "hover:text-black hover:bg-gray-200" },
    { name: 'Line', icon: <LineIcon size={18} />, url: "#", hoverColor: "hover:text-green-600 hover:bg-green-50" }, // ใส่ path Line ตรงเครื่องหมาย #
    { name: 'Email', icon: <Mail size={18} />, url: "mailto:athip_panich@hotmail.com", hoverColor: "hover:text-red-500 hover:bg-red-50" }
  ];

  const handleNavClick = (id: string) => {
    scrollToSection(id);
    setIsOpen(false); // ปิดเมนูมือถือเวลาคลิก
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-white py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <div 
            className="flex-shrink-0 cursor-pointer flex items-center gap-2" 
            onClick={() => handleNavClick('home')}
          >
            {/* โลโก้แบรนด์ (ถ้ามีรูปภาพสามารถใส่แท็ก <img src="/logo.jpg" /> แทนข้อความได้) */}
            <span className="text-2xl font-bold font-display text-brand-orange">
              DONUT <span className="text-brand-dark">BRAND</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Main Links */}
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className="text-gray-700 hover:text-brand-orange font-medium transition"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-gray-300"></div>

            {/* Social Icons */}
            <div className="flex space-x-1">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-500 p-2 rounded-full transition-colors duration-200 ${social.hoverColor} tooltip`}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Language Selector */}
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
              <Globe size={16} className="text-brand-orange" />
              <div className="flex space-x-1 text-sm font-medium">
                {(['th', 'en', 'cn'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLang(lang)}
                    className={`px-2 py-0.5 rounded transition ${
                      currentLang === lang 
                        ? 'bg-brand-orange text-white shadow-sm' 
                        : 'text-gray-500 hover:text-brand-dark hover:bg-gray-200'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-brand-orange focus:outline-none p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 py-4 px-4 flex flex-col space-y-4">
          
          {/* Mobile Links */}
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="text-left w-full text-lg font-medium text-gray-700 hover:text-brand-orange border-b border-gray-50 pb-2"
            >
              {link.label}
            </button>
          ))}

          {/* Mobile Socials */}
          <div className="pt-2">
            <p className="text-xs text-gray-400 mb-3 font-semibold uppercase">ติดตามเราได้ที่</p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-600 bg-gray-100 p-2.5 rounded-full ${social.hoverColor}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile Languages */}
          <div className="pt-2 flex items-center space-x-3">
            <Globe size={18} className="text-gray-500" />
            {(['th', 'en', 'cn'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => { setLang(lang); setIsOpen(false); }}
                className={`px-3 py-1 rounded-md text-sm font-medium border ${
                  currentLang === lang 
                    ? 'bg-brand-orange text-white border-brand-orange' 
                    : 'bg-white text-gray-600 border-gray-300'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

        </div>
      )}
    </nav>
  );
};

export default Navbar;