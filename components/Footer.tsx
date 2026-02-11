import React from 'react';
import { Translation } from '../types';
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';

interface FooterProps {
  t: Translation['contact'];
}

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
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-700 hover:bg-brand-orange p-2 rounded-full transition text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-gray-700 hover:bg-brand-orange p-2 rounded-full transition text-white">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xl font-bold font-display text-white mb-6 border-l-4 border-brand-orange pl-3">
              {t.title}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="text-brand-orange mt-1 mr-3 flex-shrink-0" size={20} />
                <span className="text-gray-300">
                   123/45 Muang District, Samut Prakan, Thailand 10270
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="text-brand-orange mr-3 flex-shrink-0" size={20} />
                <span className="text-gray-300">012-345-6789</span>
              </div>
              <div className="flex items-center">
                <Mail className="text-brand-orange mr-3 flex-shrink-0" size={20} />
                <span className="text-gray-300">contact@donutbrand.com</span>
              </div>
            </div>
          </div>

          {/* Map (Placeholder) */}
          <div className="rounded-xl overflow-hidden h-48 bg-gray-600">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.9351090332856!2d100.590!3d13.600!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDM2JzAwLjAiTiAxMDDCsDM1JzI0LjAiRQ!5e0!3m2!1sen!2sth!4v1633000000000!5m2!1sen!2sth" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy"
              title="Company Map"
            />
          </div>

        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Donut Brand Co., Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;