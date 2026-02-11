export type Language = 'th' | 'en' | 'cn';

export interface Product {
  id: string;
  category: string;
  name: {
    th: string;
    en: string;
    cn: string;
  };
  weight: string;
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