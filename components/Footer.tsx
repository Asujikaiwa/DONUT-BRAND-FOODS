import React from 'react';
import { Translation } from '../types';
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';

interface FooterProps {
  t: Translation['contact'];
}

// สร้าง Custom Icon สำหรับ TikTok
const TiktokIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a3 3 0 0 1-3-3" />
  </svg>
);

// สร้าง Custom Icon สำหรับ Line แบบวาดลายเส้น
const LineIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.5 10.5C21.5 6.35786 17.2467 3 12 3C6.75329 3 2.5 6.35786 2.5 10.5C2.5 13.9167 4.79326 16.8184 8.08272 17.7508C8.58309 17.893 8.70678 18.2573 8.61899 18.7296C8.54719 19.1158 8.16335 20.8967 8.09355 21.2464C7.99464 21.7423 8.35852 21.8465 8.76106 21.5979C9.20625 21.323 14.1505 18.4239 16.6385 16.2713C19.5935 13.7145 21.5 12.2458 21.5 10.5Z" />
  </svg>
);

const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <footer id="contact" className="bg-brand-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          
          {/* Brand Info */}
          <div>
            <h3 className="text-2xl font-bold font-display text-brand-yellow mb-4">DONUT BRAND</h3>
            <p className="text-gray-400 mb-6">
              Flavoring your life with quality products.
            </p>
            {/* Social Links */}
            <div className="flex space-x-3">
              <a href="https://www.facebook.com/athip.panich.donut/?locale=th_TH" target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-blue-600 p-2.5 rounded-full transition text-white tooltip flex items-center justify-center" title="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://www.instagram.com/don_utbrand/" target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-pink-600 p-2.5 rounded-full transition text-white tooltip flex items-center justify-center" title="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://www.tiktok.com/@donut.athip" target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-black p-2.5 rounded-full transition text-white tooltip flex items-center justify-center" title="TikTok">
                <TiktokIcon size={18} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-green-500 p-2.5 rounded-full transition text-white tooltip flex items-center justify-center" title="Line">
                <LineIcon size={18} />
              </a>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xl font-bold font-display text-white mb-6 border-l-4 border-brand-orange pl-3">
              {t.title}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start group">
                <MapPin className="text-brand-orange mt-1 mr-3 flex-shrink-0" size={20} />
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=บริษัท+อธิปพาณิชย์+จำกัด+สมุทรปราการ" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-brand-yellow transition"
                >
                   บริษัท อธิปพาณิชย์ จำกัด, HGR5+2PG, Unnamed Road, ตำบล บ้านคลองสวน อำเภอพระสมุทรเจดีย์ สมุทรปราการ 10290
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="text-brand-orange mr-3 flex-shrink-0" size={20} />
                <span className="text-gray-300">094 347 6691</span>
              </div>
              <div className="flex items-center">
                <Mail className="text-brand-orange mr-3 flex-shrink-0" size={20} />
                <a href="mailto:athip_panich@hotmail.com" className="text-gray-300 hover:text-brand-yellow transition">
                  athip_panich@hotmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-xl overflow-hidden h-48 bg-gray-600 shadow-inner">
            <iframe 
              src="https://maps.google.com/maps?q=บริษัท%20อธิปพาณิชย์%20จำกัด%20สมุทรปราการ&t=&z=14&ie=UTF8&iwloc=&output=embed" 
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy" title="Company Map"
            />
          </div>

        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Athip Panich Co., Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
export default Footer;