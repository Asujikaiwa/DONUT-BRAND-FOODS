import { Language, Product, Translation } from './types';

export const TRANSLATIONS: Record<Language, Translation> = {
  th: {
    nav: {
      home: 'หน้าแรก',
      products: 'สินค้า',
      contact: 'ติดต่อเรา',
    },
    hero: {
      title: 'รสชาติที่ลงตัว คู่ครัวคุณ',
      subtitle: 'ผู้ผลิตและจำหน่ายผงปรุงรสและวัตถุเจือปนอาหารคุณภาพสูง ตราโดนัท',
      cta: 'ดูสินค้าของเรา',
    },
    about: {
      title: 'เกี่ยวกับเรา',
      description: 'บริษัทของเรามุ่งมั่นในการผลิตสินค้าวัตถุเจือปนอาหารและผงปรุงรสที่มีคุณภาพ ได้มาตรฐาน อย. และ ฮาลาล เพื่อตอบสนองความต้องการของผู้ประกอบการและครัวเรือน ด้วยประสบการณ์ที่ยาวนาน เราคัดสรรวัตถุดิบชั้นดีเพื่อรสชาติที่ถูกปากคนไทย ไม่ว่าจะเป็น ผงเขย่า ผงปรุงรส เครื่องดื่มผงกลิ่นผลไม้ และสารเสริมคุณภาพอาหาร',
    },
    products: {
      title: 'สินค้าของเรา',
      filterAll: 'ทั้งหมด',
      filterSeasoning: 'ผงปรุงรส',
      filterBeverage: 'เครื่องดื่ม',
      filterAdditives: 'วัตถุดิบ/สารเสริม',
    },
    contact: {
      title: 'ติดต่อเรา',
      addressLabel: 'ที่อยู่บริษัท',
      phoneLabel: 'เบอร์โทรศัพท์',
      emailLabel: 'อีเมล',
      followUs: 'ติดตามเราได้ที่',
    },
  },
  en: {
    nav: {
      home: 'Home',
      products: 'Products',
      contact: 'Contact',
    },
    hero: {
      title: 'The Perfect Taste for Your Kitchen',
      subtitle: 'Manufacturer and distributor of high-quality food additives and seasoning powders, Donut Brand.',
      cta: 'View Products',
    },
    about: {
      title: 'About Us',
      description: 'Our company is committed to producing high-quality food additives and seasoning powders that meet FDA and Halal standards. We cater to both entrepreneurs and households. With years of experience, we select the finest ingredients to create tastes that delight. Our range includes shaking powders, seasonings, fruit-flavored drink powders, and food enhancers.',
    },
    products: {
      title: 'Our Products',
      filterAll: 'All',
      filterSeasoning: 'Seasonings',
      filterBeverage: 'Beverages',
      filterAdditives: 'Additives',
    },
    contact: {
      title: 'Contact Us',
      addressLabel: 'Address',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      followUs: 'Follow Us',
    },
  },
  cn: {
    nav: {
      home: '首页',
      products: '产品',
      contact: '联系我们',
    },
    hero: {
      title: '厨房的完美味道',
      subtitle: 'Donut 品牌高品质食品添加剂和调味粉的生产商和分销商。',
      cta: '查看产品',
    },
    about: {
      title: '关于我们',
      description: '我们要致力于生产符合 FDA 和清真标准的高品质食品添加剂和调味粉。我们为企业家和家庭提供服务。凭借多年的经验，我们精选最优质的原料，创造出令人愉悦的口味。我们的产品范围包括摇摇粉、调味料、果味饮料粉和食品强化剂。',
    },
    products: {
      title: '我们的产品',
      filterAll: '全部',
      filterSeasoning: '调味料',
      filterBeverage: '饮料',
      filterAdditives: '添加剂',
    },
    contact: {
      title: '联系我们',
      addressLabel: '地址',
      phoneLabel: '电话',
      emailLabel: '电子邮件',
      followUs: '关注我们',
    },
  },
};

// NOTE: Since we cannot host the user's specific images, we are using high-quality placeholders 
// that closely resemble the items (Seasoning packets, powders, beverages).
// In a real deployment, replace these URLs with the actual image paths.

export const PRODUCTS: Product[] = [
  // Seasoning Powders (ผงปรุงรส)
  {
    id: 's1',
    category: 'seasoning',
    name: { th: 'ผงปรุงรสวิงซ์แซ่บ', en: 'Wing Zab Seasoning', cn: '香辣鸡翅调料' },
    weight: '500g / 200g / 100g',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800',
    isNew: true
  },
  {
    id: 's2',
    category: 'seasoning',
    name: { th: 'ผงปรุงรสชีส', en: 'Cheese Seasoning', cn: '芝士调料' },
    weight: '500g / 200g / 100g',
    image: 'https://images.unsplash.com/photo-1624806992066-5ffcf7ca186b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 's3',
    category: 'seasoning',
    name: { th: 'ผงปรุงรสปาปริก้า', en: 'Paprika Seasoning', cn: '红椒调料' },
    weight: '500g / 200g / 100g',
    image: 'https://images.unsplash.com/photo-1621360841013-c76837cae9e4?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 's4',
    category: 'seasoning',
    name: { th: 'ผงปรุงรสบาร์บีคิว', en: 'BBQ Seasoning', cn: '烧烤调料' },
    weight: '500g / 200g / 100g',
    image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 's5',
    category: 'seasoning',
    name: { th: 'ผงปรุงรสต้มยำ', en: 'Tom Yum Seasoning', cn: '冬阴功调料' },
    weight: '500g / 200g',
    image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b485c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 's6',
    category: 'seasoning',
    name: { th: 'ผงปรุงรสไข่เค็ม', en: 'Salted Egg Seasoning', cn: '咸蛋黄调料' },
    weight: '500g / 200g / 100g',
    image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 's7',
    category: 'seasoning',
    name: { th: 'ผงซาวครีมและหัวหอม', en: 'Sour Cream & Onion', cn: '酸奶油洋葱调料' },
    weight: '500g / 200g / 100g',
    image: 'https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?auto=format&fit=crop&q=80&w=800'
  },
  
  // Beverage Powders (เครื่องดื่ม)
  {
    id: 'b1',
    category: 'beverage',
    name: { th: 'ชานมไข่มุก', en: 'Bubble Tea Powder', cn: '珍珠奶茶粉' },
    weight: '200g',
    image: 'https://images.unsplash.com/photo-1594489815967-0c1a938c47b1?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b2',
    category: 'beverage',
    name: { th: 'ผงโกโก้ 100%', en: 'Cocoa Powder 100%', cn: '可可粉' },
    weight: '120g',
    image: 'https://images.unsplash.com/photo-1546464522-d8d17b8f9722?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b3',
    category: 'beverage',
    name: { th: 'ชาเขียวมัทฉะ', en: 'Matcha Green Tea', cn: '抹茶粉' },
    weight: '200g',
    image: 'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b4',
    category: 'beverage',
    name: { th: 'นมเย็น', en: 'Pink Milk (Nom Yen)', cn: '粉红奶' },
    weight: '200g',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b5',
    category: 'beverage',
    name: { th: 'เผือกหอม', en: 'Taro Powder', cn: '香芋粉' },
    weight: '200g',
    image: 'https://images.unsplash.com/photo-1546816086-6411979d554a?auto=format&fit=crop&q=80&w=800'
  },

  // Additives (วัตถุดิบ)
  {
    id: 'a1',
    category: 'additives',
    name: { th: 'กรดมะนาว (Citric Acid)', en: 'Citric Acid', cn: '柠檬酸' },
    weight: '1000g / 500g',
    image: 'https://images.unsplash.com/photo-1616428753232-47535b9148d0?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'a2',
    category: 'additives',
    name: { th: 'แป้งหวาน', en: 'Sweetener Powder', cn: '甜味粉' },
    weight: '500g',
    image: 'https://images.unsplash.com/photo-1516641396056-0ce60a85d49f?auto=format&fit=crop&q=80&w=800'
  }
];