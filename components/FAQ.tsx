// คำถามที่พบบ่อย — แสดงบนหน้าจริง (Google ให้น้ำหนักเฉพาะเนื้อหาที่ผู้ใช้มองเห็น)
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Language, Product } from '../types';
import { PAGE_TEXT } from '../constants';
import { faqPath, productCounts } from '../routes';
import { Breadcrumb, ContactCTA, homeCrumb } from './PageParts';

interface FAQProps {
  lang: Language;
  products: Product[];
  /** true = หน้า /faq/ เต็ม (มี h1), false = ส่วนย่อยในหน้าแรก */
  fullPage?: boolean;
  limit?: number;
}

const FAQ: React.FC<FAQProps> = ({ lang, products, fullPage = false, limit }) => {
  const pt = PAGE_TEXT[lang];
  const all = pt.faq(productCounts(products));
  const items = limit ? all.slice(0, limit) : all;
  const Heading = fullPage ? 'h1' : 'h2';
  const QHeading = fullPage ? 'h2' : 'h3';

  return (
    <section id="faq" className={fullPage ? 'py-10 md:py-14' : 'py-16 bg-white'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {fullPage && <Breadcrumb items={[homeCrumb(lang), { label: pt.ui.faqNav }]} />}
        <div className="text-center mb-10">
          <Heading className="text-3xl md:text-4xl font-bold text-brand-dark mb-3 font-display">{pt.ui.faqTitle}</Heading>
          <p className="text-gray-600">{pt.ui.faqIntro}</p>
        </div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <details key={i} open={fullPage || i === 0} className="group bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <summary className="flex items-start gap-3 cursor-pointer list-none">
                <HelpCircle size={20} className="text-brand-orange flex-shrink-0 mt-0.5" />
                <QHeading className="font-bold text-gray-800 text-base md:text-lg font-display">{item.q}</QHeading>
              </summary>
              <p className="mt-3 pl-8 text-gray-600 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>

        {!fullPage && limit && all.length > limit && (
          <div className="text-center mt-8">
            <a href={faqPath(lang)} className="inline-block border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white font-bold py-2 px-6 rounded-full transition">
              {pt.ui.seeAllFaq} →
            </a>
          </div>
        )}

        {fullPage && <div className="mt-10"><ContactCTA pt={pt} /></div>}
      </div>
    </section>
  );
};

export default FAQ;
