export type Language = 'th' | 'en' | 'cn';

export interface ProductVariant {
  weight: string;
  price: number;
}

export interface Product {
  id: string;
  category: string;
  name: {
    th: string;
    en: string;
    cn: string;
  };

  description?: {
    th: string;
    en: string;
    cn: string;
  };

  weight: string;
  price: number; 

  // ของใหม่ที่เพิ่มเข้ามา
  variants?: ProductVariant[]; // เก็บหลายขนาดหลายราคา
  isBestSeller?: boolean;      // เช็คว่าเป็นสินค้าขายดีไหม

  image: string; // URL to the image
  isNew?: boolean;
}

export interface Translation {
  nav: {
    home: string;
    products: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  about: {
    title: string;
    description: string;
    certTitle: string; // เพิ่ม
    certDesc: string; // เพิ่ม
    processTitle: string; // เพิ่ม
    facilities: string[]; // เพิ่ม
  };
  products: {
    title: string;
    filterAll: string;
    filterSeasoning: string;
    filterBeverage: string;
    filterAdditives: string;
  };
  contact: {
    title: string;
    addressLabel: string;
    phoneLabel: string;
    emailLabel: string;
    followUs: string;
  };
}

export interface HeroSlide {
  id: string;
  url: string; // เก็บ URL ของวิดีโอ
  type: 'video'; // เผื่ออนาคตอยากใส่ 'image'
}