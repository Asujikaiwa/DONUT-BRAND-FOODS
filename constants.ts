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
  // ==========================================
  // หมวดหมู่: ผงปรุงรส (Seasoning)
  // ==========================================
  { id: 's1', category: 'seasoning', name: { th: 'ผงปรุงรสบาร์บีคิว', en: 'BBQ Seasoning', cn: '烧烤调料' }, weight: '100g / 200g / 500g', price: 0, image: '/PictureProduct/FoodPowder/BBQ500G.jpeg' },
  { id: 's2', category: 'seasoning', name: { th: 'ผงปรุงรสชีส', en: 'Cheese Seasoning', cn: '芝士调料' }, weight: '100g / 200g / 500g', price: 0, image: '/PictureProduct/FoodPowder/Cheese500G.jpeg' },
  { id: 's3', category: 'seasoning', name: { th: 'ผงปรุงรสชีส (สูตร S)', en: 'Cheese Seasoning (S)', cn: '芝士调料 (S)' }, weight: '100g / 200g / 500g', price: 0, image: '/PictureProduct/FoodPowder/CheeseS500G.jpeg' },
  { id: 's4', category: 'seasoning', name: { th: 'ผงปรุงรสพริกชีส', en: 'Chilli Cheese Seasoning', cn: '辣椒芝士调料' }, weight: '200g / 500g', price: 0, image: '/PictureProduct/FoodPowder/ChilliCheese500G.jpeg' },
  { id: 's5', category: 'seasoning', name: { th: 'ผงปรุงรสข้าวโพด', en: 'Corn Seasoning', cn: '玉米调料' }, weight: '100g / 200g / 500g', price: 0, image: '/PictureProduct/FoodPowder/Corn500G.jpeg' },
  { id: 's6', category: 'seasoning', name: { th: 'ผงปรุงรสกุ้งย่าง', en: 'Grilled Shrimp Seasoning', cn: '烤虾调料' }, weight: '200g / 500g', price: 0, image: '/PictureProduct/FoodPowder/GrillShrimp500G.jpeg' },
  { id: 's7', category: 'seasoning', name: { th: 'ผงปรุงรสปลาหมึกย่าง', en: 'Grilled Squid Seasoning', cn: '烤鱿鱼调料' }, weight: '200g / 500g', price: 0, image: '/PictureProduct/FoodPowder/GrilledSquid500G.jpeg' },
  { id: 's8', category: 'seasoning', name: { th: 'ผงฮอทแอนด์สไปซี่', en: 'Hot & Spicy Seasoning', cn: '香辣调料' }, weight: '100g / 200g / 500g', price: 0, image: '/PictureProduct/FoodPowder/Hot&spicy500G.jpeg' },
  { id: 's9', category: 'seasoning', name: { th: 'ผงปรุงรสลาบ', en: 'Larb Seasoning', cn: '泰式凉拌调料' }, weight: '100g / 500g', price: 0, image: '/PictureProduct/FoodPowder/Larb500G.jpeg' },
  { id: 's10', category: 'seasoning', name: { th: 'ผงปรุงรสมีตตี้ชีส', en: 'Meaty Cheese Seasoning', cn: '肉香芝士调料' }, weight: '100g / 200g / 500g', price: 0, image: '/PictureProduct/FoodPowder/MeatyCheese500G.jpeg' },
  { id: 's11', category: 'seasoning', name: { th: 'ผงปรุงรสหม่าล่า', en: 'Mhala Seasoning', cn: '麻辣调料' }, weight: '100g / 200g / 500g', price: 0, image: '/PictureProduct/FoodPowder/Mhala500G.jpeg' },
  { id: 's12', category: 'seasoning', name: { th: 'ผงปรุงรสชีสนม', en: 'Milk Cheese Seasoning', cn: '牛奶芝士调料' }, weight: '200g / 500g', price: 0, image: '/PictureProduct/FoodPowder/MilkCheese500G.jpeg' },
  { id: 's13', category: 'seasoning', name: { th: 'ผงปรุงรสปาปริก้า', en: 'Paprika Seasoning', cn: '红椒调料' }, weight: '100g / 200g / 500g', price: 0, image: '/PictureProduct/FoodPowder/Paprika500G.jpeg' },
  { id: 's14', category: 'seasoning', name: { th: 'ผงปรุงรสพิซซ่า', en: 'Pizza Seasoning', cn: '披萨调料' }, weight: '100g / 200g / 500g', price: 0, image: '/PictureProduct/FoodPowder/Pizza500G.jpeg' },
  { id: 's15', category: 'seasoning', name: { th: 'ผงปรุงรสไข่เค็ม', en: 'Salted Egg Seasoning', cn: '咸蛋黄调料' }, weight: '100g / 200g / 500g', price: 0, image: '/PictureProduct/FoodPowder/SaltedEgg500G.jpeg' },
  { id: 's16', category: 'seasoning', name: { th: 'ผงปรุงรสสาหร่าย', en: 'Seaweed Seasoning', cn: '海苔调料' }, weight: '100g / 200g / 500g', price: 0, image: '/PictureProduct/FoodPowder/Seaweed500G.jpeg' },
  { id: 's17', category: 'seasoning', name: { th: 'ผงซาวครีมและหัวหอม', en: 'Sour Cream & Onion', cn: '酸奶油洋葱' }, weight: '100g / 200g / 500g', price: 0, image: '/PictureProduct/FoodPowder/SourCreamAndOnion500G.jpeg' },
  { id: 's18', category: 'seasoning', name: { th: 'ผงซีฟู้ดสไปซี่', en: 'Spicy Seafood Seasoning', cn: '香辣海鲜调料' }, weight: '50g / 100g / 200g', price: 0, image: '/PictureProduct/FoodPowder/SpicySeafood200G.jpeg' },
  { id: 's19', category: 'seasoning', name: { th: 'ผงปรุงรสต้มยำ', en: 'Tom Yum Seasoning', cn: '冬阴功调料' }, weight: '100g / 200g / 500g', price: 0, image: '/PictureProduct/FoodPowder/TomYum500G.jpeg' },
  { id: 's20', category: 'seasoning', name: { th: 'ผงปรุงรสวิงซ์แซ่บ', en: 'Wing Zab Seasoning', cn: '香辣鸡翅调料' }, weight: '200g / 500g', price: 0, image: '/PictureProduct/FoodPowder/WingZab500G.jpeg', isNew: true },
  { id: 's21', category: 'seasoning', name: { th: 'ผงปรุงรสแซ่บซี๊ด', en: 'Zab Zeed Seasoning', cn: '极辣调料' }, weight: '100g / 200g / 500g', price: 0, image: '/PictureProduct/FoodPowder/ZabZeed500G.jpeg' },

  // ==========================================
  // หมวดหมู่: เครื่องดื่ม (Beverage)
  // ==========================================
  { id: 'b1', category: 'beverage', name: { th: 'ผงชานมไข่มุก', en: 'Bubble Tea Powder', cn: '珍珠奶茶粉' }, weight: '200g', price: 0, image: '/PictureProduct/WaterPowder/BubbleTea200G.jpeg' },
  { id: 'b2', category: 'beverage', name: { th: 'ผงแคนตาลูป', en: 'Cantaloupe Powder', cn: '哈密瓜粉' }, weight: '200g', price: 0, image: '/PictureProduct/WaterPowder/Cantaloupe200G.jpeg' },
  { id: 'b3', category: 'beverage', name: { th: 'ผงช็อกโกแลต', en: 'Chocolate Powder', cn: '巧克力粉' }, weight: '200g', price: 0, image: '/PictureProduct/WaterPowder/Chocolate200G.jpeg' },
  { id: 'b4', category: 'beverage', name: { th: 'ผงโกโก้', en: 'Cocoa Powder', cn: '可可粉' }, weight: '120g', price: 0, image: '/PictureProduct/WaterPowder/Cocoa120G.jpeg' },
  { id: 'b5', category: 'beverage', name: { th: 'ผงมะพร้าว', en: 'Coconut Powder', cn: '椰子粉' }, weight: '200g', price: 0, image: '/PictureProduct/WaterPowder/Coconut200G.jpeg' },
  { id: 'b6', category: 'beverage', name: { th: 'ผงชาเขียวมัทฉะ', en: 'Matcha Green Tea', cn: '抹茶粉' }, weight: '200g', price: 0, image: '/PictureProduct/WaterPowder/MatchaBubbleTea200G.jpeg' },
  { id: 'b7', category: 'beverage', name: { th: 'นมผง', en: 'Milk Powder', cn: '奶粉' }, weight: '200g / 1000g', price: 0, image: '/PictureProduct/WaterPowder/Milk1000G.jpeg' },
  { id: 'b8', category: 'beverage', name: { th: 'ผงนมเย็น', en: 'Pink Milk (Nom Yen)', cn: '粉红奶粉' }, weight: '200g', price: 0, image: '/PictureProduct/WaterPowder/Nomyen200G.png' },
  { id: 'b9', category: 'beverage', name: { th: 'ผงเผือกหอม', en: 'Taro Powder', cn: '香芋粉' }, weight: '200g', price: 0, image: '/PictureProduct/WaterPowder/TaroBubble200G.jpeg' },
  { id: 'b10', category: 'beverage', name: { th: 'ผงชาไทย', en: 'Thai Tea Powder', cn: '泰式茶粉' }, weight: '200g', price: 0, image: '/PictureProduct/WaterPowder/ThaiTea200G.jpeg' },

  // ==========================================
  // หมวดหมู่: วัตถุดิบ/สารเสริม (Additives)
  // ==========================================
  { id: 'a1', category: 'additives', name: { th: 'กรดมะนาว (Citric Acid)', en: 'Citric Acid', cn: '柠檬酸' }, weight: '500g / 1000g', price: 0, image: '/PictureProduct/Other/CitricAcid1000G.jpeg' }
];