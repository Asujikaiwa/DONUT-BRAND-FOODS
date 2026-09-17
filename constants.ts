import { Language, Product, Translation } from './types';
import type { CategoryId } from './routes';

export const TRANSLATIONS: Record<Language, Translation> = {
  th: {
nav: { home: 'หน้าแรก', products: 'สินค้า', contact: 'ติดต่อเรา', contactSales: 'ติดต่อฝ่ายขาย', followUs: 'ติดตามเราได้ที่', selectLanguage: 'เลือกภาษา' },    hero: { title: 'รสชาติที่ลงตัว คู่ครัวคุณ', subtitle: 'ผู้ผลิตและจำหน่ายผงปรุงรสและวัตถุเจือปนอาหารคุณภาพสูง ตราโดนัท', cta: 'ดูสินค้าของเรา' },
    about: {
      title: 'ประวัติบริษัท',
      description: 'บริษัท อธิป พาณิชย์ จำกัด ก่อตั้งในนาม คุณคนึงรัตน์ ใจตรง เมื่อปี พศ.2543 ดำเนินธุรกิจเกี่ยวกับผลิตและจำหน่าย“ผงปรุงรส”เพื่อขายให้แก่อุตสาหกรรมขนม ได้แก่ ข้าวเกรียบ ข้าวโพดอบกรอบ เป็นต้น\n\nต่อมาในช่วงปี พศ.2546 คุณคนึงรัตน์ ใจตรง ได้เล็งเห็นถึงการมาของกระแส ชานมไข่มุก จึงได้นำเอาผลิตภัณฑ์ “ครีมเทียม” มาจำหน่ายในช่วงนั้น ทำให้กิจการเริ่มขยับขยาย และเติบโตขึ้นอย่างต่อเนื่อง\n\nจนกระทั้งในปี พศ.2560 จึงจดทะเบียนบริษัท ในนาม “บริษัท อธิป พาณิชย์ จำกัด” จากนั้นทางบริษัทฯ ก็ได้มีการขยับขยายสินค้าออกมามากมาย ทั้งในส่วนของ “เครื่องดื่มชนิดผง” “ผงครีมชีส” ”วัตถุเจือปนอาหาร” และอื่นๆอีกมากมายจนถึงปัจจุบัน',
      certTitle: 'การรับรองมาตรฐานระดับสากล',
      certDesc: 'บริษัท อธิป พาณิชย์ จำกัด ให้ความสำคัญกับความปลอดภัยและคุณภาพของอาหารเป็นอันดับหนึ่ง โรงงานของเราได้รับการรับรองระบบคุณภาพมาตรฐานสากล CODEX HACCP และ GHPs (Good Hygiene Practices)\n\nซึ่งเป็นการรับประกันว่ากระบวนการผลิตของเรามีความสะอาด ปลอดภัย และได้มาตรฐานในทุกขั้นตอน ตั้งแต่การคัดสรรวัตถุดิบ การควบคุมการผลิต ไปจนถึงการจัดเก็บและส่งมอบ เพื่อให้ผู้บริโภคมั่นใจในคุณภาพสินค้าทุกชิ้นภายใต้แบรนด์ "โดนัท"',
      processTitle: 'กระบวนการและมาตรฐานการทำงาน',
      facilities: [
        'โรงงานและเครื่องจักรที่ทันสมัย สะอาด ปลอดภัย',
        'ควบคุมคุณภาพอย่างเข้มงวดในทุกขั้นตอนการผลิต',
        'คลังสินค้าและระบบจัดเก็บที่ได้มาตรฐานสากล',
        'ทีมงานผู้เชี่ยวชาญดูแลกระบวนการผลิตอย่างใกล้ชิด',
        'การบรรจุหีบห่อที่มิดชิด รักษาคุณภาพสินค้าให้อยู่ได้นาน',
        'กระบวนการผสมที่แม่นยำ เพื่อรสชาติที่สม่ำเสมอ',
        'พร้อมส่งมอบผลิตภัณฑ์คุณภาพสูงถึงมือผู้บริโภค'
      ]
    },
    products: { title: 'สินค้าของเรา', filterAll: 'ทั้งหมด', filterSeasoning: 'ผงปรุงรส', filterBeverage: 'ผงเครื่องดื่ม', filterAdditives: 'อื่นๆ' },
    contact: { title: 'ติดต่อเรา', addressLabel: 'ที่อยู่บริษัท', address: 'บริษัท อธิปพาณิชย์ จำกัด, HGR5+2PG, Unnamed Road, ตำบล บ้านคลองสวน อำเภอพระสมุทรเจดีย์ สมุทรปราการ 10290', phoneLabel: 'เบอร์โทรศัพท์', emailLabel: 'อีเมล', followUs: 'ติดตามเราได้ที่' },  },
  en: {
    nav: { home: 'Home', products: 'Products', contact: 'Contact', contactSales: 'Contact Sales', followUs: 'Follow Us', selectLanguage: 'Select Language' },    hero: { title: 'The Perfect Taste for Your Kitchen', subtitle: 'Manufacturer and distributor of high-quality food additives and seasoning powders, Donut Brand.', cta: 'View Products' },
    about: {
      title: 'Company History',
      description: 'Athip Panich Co., Ltd. was founded by Ms. Kanuengrut Jaitrong in 2000. The business started by manufacturing and distributing "seasoning powders" for the snack industry, such as crackers and crispy corn.\n\nLater, in 2003, seeing the rising trend of bubble tea, Ms. Kanuengrut began selling "non-dairy creamer", which led to continuous business expansion and growth.\n\nEventually, in 2017, the company was officially registered as "Athip Panich Co., Ltd.". Since then, the company has expanded its product lines extensively, including "beverage powders", "cream cheese powders", "food additives", and many others to this day.',
      certTitle: 'International Standard Certifications',
      certDesc: 'Athip Panich Co., Ltd. prioritizes food safety and quality above all else. Our factory is certified with international quality standard systems: CODEX HACCP and GHPs (Good Hygiene Practices).\n\nThis guarantees that our production processes are clean, safe, and standardized at every step—from selecting raw materials and controlling production to storage and delivery. Consumers can be confident in the quality of every product under the "Donut" brand.',
      processTitle: 'Working Process & Standards',
      facilities: [
        'Modern, clean, and safe factory and machinery',
        'Strict quality control in every production step',
        'Warehouse and storage systems meeting international standards',
        'Expert team closely monitoring the production process',
        'Secure packaging to preserve product quality for longer',
        'Precise mixing process for consistent flavor',
        'Ready to deliver high-quality products to consumers'
      ]
    },
    products: { title: 'Our Products', filterAll: 'All', filterSeasoning: 'Seasonings', filterBeverage: 'beverage powder', filterAdditives: 'Other' },
    contact: { title: 'Contact Us', addressLabel: 'Address', address: 'Athip Panich Co., Ltd., HGR5+2PG, Unnamed Road, Ban Khlong Suan, Phra Samut Chedi District, Samut Prakan 10290', phoneLabel: 'Phone', emailLabel: 'Email', followUs: 'Follow Us' },  },
  cn: {
    nav: { home: '首页', products: '产品', contact: '联系我们', contactSales: '联系销售', followUs: '关注我们', selectLanguage: '选择语言' },    hero: { title: '厨房的完美味道', subtitle: 'Donut 品牌高品质食品添加剂和调味粉的生产商和分销商。', cta: '查看产品' },
    about: {
      title: '公司历史',
      description: 'Athip Panich 有限公司由 Kanuengrut Jaitrong 女士于 2000 年创立。该业务最初为休闲食品行业（如饼干和脆玉米）生产和销售“调味粉”。\n\n后来，在 2003 年，看到珍珠奶茶的上升趋势，Kanuengrut 女士开始销售“植脂末”，这导致业务不断扩张和增长。\n\n最终，在 2017 年，公司正式注册为“Athip Panich 有限公司”。从那时起，公司广泛扩展了其产品线，包括“饮料粉”、“奶油芝士粉”、“食品添加剂”以及至今的许多其他产品。',
      certTitle: '国际标准认证',
      certDesc: 'Athip Panich 有限公司将食品安全和质量放在首位。我们的工厂已通过国际质量标准体系认证：CODEX HACCP 和 GHPs（良好卫生规范）。\n\n这保证了我们的生产过程在从选择原材料和控制生产到储存和交付的每一个环节都是清洁、安全和标准化的。消费者可以对“Donut”品牌下每一件产品的质量充满信心。',
      processTitle: '工作流程与标准',
      facilities: [
        '现代化、清洁、安全的工厂和机械',
        '每个生产环节的严格质量控制',
        '符合国际标准的仓库和存储系统',
        '专家团队密切监控生产过程',
        '安全的包装，更长时间地保持产品质量',
        '精确的混合工艺，确保风味一致',
        '准备向消费者交付高质量产品'
      ]
    },
    products: { title: '我们的产品', filterAll: '全部', filterSeasoning: '调味料', filterBeverage: '饮料', filterAdditives: '其他' },
    contact: { title: '联系我们', addressLabel: '地址', address: 'Athip Panich 有限公司, HGR5+2PG, Unnamed Road, Ban Khlong Suan, Phra Samut Chedi 县, 北榄府 10290', phoneLabel: '电话', emailLabel: '电子邮件', followUs: '关注我们' },  },
};
// =====================================================================
// ข้อความสำหรับหน้าแยก (หมวดสินค้า / หน้าสินค้า / คำถามพบบ่อย) และ SEO
// เพิ่มเพื่อรองรับ URL แยกภาษา: /  /en/  /zh/
// =====================================================================
export interface PageText {
  ui: {
    brandEyebrow: string;
    breadcrumbHome: string;
    sizes: string;
    notSpecified: string;
    contactForPrice: string;
    viewDetails: string;
    relatedProducts: string;
    allProducts: string;
    searchPlaceholder: string;
    noResults: string;
    showMore: string;
    loading: string;
    promotions: string;
    usesTitle: string;
    orderTitle: string;
    orderDesc: string;
    emailUs: string;
    faqNav: string;
    faqTitle: string;
    faqIntro: string;
    seeAllFaq: string;
    categoriesTitle: string;
    viewCategory: string;
    notFoundTitle: string;
    notFoundDesc: string;
    backHome: string;
    brandLabel: string;
    manufacturerLabel: string;
    certLabel: string;
  };
  home: { metaTitle: string; metaDesc: string };
  faqMeta: { metaTitle: string; metaDesc: string };
  categories: Record<CategoryId, {
    name: string;
    h1: string;
    metaTitle: string;
    metaDesc: (count: number) => string;
    intro: string[];
    uses: string[];
  }>;
  product: {
    metaTitle: (name: string, sizes: string, categoryName: string) => string;
    metaDesc: (name: string, sizes: string, category: CategoryId) => string;
    body: (name: string, sizes: string, category: CategoryId) => string;
  };
  faq: (c: { total: number; seasoning: number; beverage: number; additives: number }) => { q: string; a: string }[];
}

const PHONES = '091-803-3478, 097-269-2898, 091-879-9922';
const EMAIL = 'athip_panich@hotmail.com';

export const PAGE_TEXT: Record<Language, PageText> = {
  th: {
    ui: {
      brandEyebrow: 'ผงปรุงรส ตราโดนัท',
      breadcrumbHome: 'หน้าแรก',
      sizes: 'ขนาดบรรจุ',
      notSpecified: 'ไม่ระบุขนาด',
      contactForPrice: 'ติดต่อสอบถามราคา',
      viewDetails: 'ดูรายละเอียด',
      relatedProducts: 'สินค้าอื่นในหมวดเดียวกัน',
      allProducts: 'สินค้าทั้งหมด',
      searchPlaceholder: 'ค้นหาสินค้าที่ต้องการ...',
      noResults: 'ไม่พบสินค้าที่คุณค้นหา',
      showMore: 'แสดงสินค้าเพิ่มเติม',
      loading: 'กำลังโหลดข้อมูล...',
      promotions: 'โปรโมชั่นพิเศษ (Promotions)',
      usesTitle: 'เหมาะสำหรับ',
      orderTitle: 'สั่งซื้อ / ขอราคาส่ง / รับผลิต OEM',
      orderDesc: 'ติดต่อฝ่ายขายเพื่อสอบถามราคาปลีก-ส่ง ขนาดบรรจุ และการผลิตตามสูตรลูกค้า',
      emailUs: 'ส่งอีเมล',
      faqNav: 'คำถามพบบ่อย',
      faqTitle: 'คำถามที่พบบ่อยเกี่ยวกับผงปรุงรส ตราโดนัท',
      faqIntro: 'รวมคำตอบเรื่องบริษัท มาตรฐานการผลิต สินค้า ขนาดบรรจุ การสั่งซื้อ และการรับผลิต OEM',
      seeAllFaq: 'ดูคำถามทั้งหมด',
      categoriesTitle: 'หมวดสินค้า',
      viewCategory: 'ดูสินค้าในหมวดนี้',
      notFoundTitle: 'ไม่พบหน้าที่คุณต้องการ',
      notFoundDesc: 'หน้านี้อาจถูกย้ายหรือไม่มีอยู่แล้ว ลองกลับไปหน้าแรกหรือดูสินค้าทั้งหมด',
      backHome: 'กลับหน้าแรก',
      brandLabel: 'แบรนด์',
      manufacturerLabel: 'ผู้ผลิต',
      certLabel: 'มาตรฐานโรงงาน',
    },
    home: {
      metaTitle: 'ผงปรุงรส ตราโดนัท | ผงชีส บาร์บีคิว เครื่องดื่มชนิดผง - บจก. อธิปพาณิชย์',
      metaDesc: 'ผู้ผลิตและจำหน่ายผงปรุงรส ตราโดนัท (Donut Brand) คุณภาพสูง มาตรฐาน CODEX HACCP & GHPs เช่น ผงชีส บาร์บีคิว ปาปริก้า ผงเครื่องดื่ม และวัตถุเจือปนอาหาร ขายปลีก-ส่ง รับผลิต OEM',
    },
    faqMeta: {
      metaTitle: 'คำถามพบบ่อย ผงปรุงรส ตราโดนัท | สั่งซื้อ ขนาดบรรจุ รับผลิต OEM',
      metaDesc: 'คำตอบเรื่องผงปรุงรสตราโดนัท: ผู้ผลิต มาตรฐาน CODEX HACCP สินค้าที่มี ขนาดบรรจุ วิธีใช้ การสั่งซื้อ และการรับผลิตผงปรุงรส OEM',
    },
    categories: {
      seasoning: {
        name: 'ผงปรุงรส',
        h1: 'ผงปรุงรส ตราโดนัท (ผงเขย่า)',
        metaTitle: 'ผงปรุงรส ผงเขย่า ขายส่ง ตราโดนัท | ชีส บาร์บีคิว ปาปริก้า',
        metaDesc: (n) => `รวมผงปรุงรสตราโดนัท ${n} รสชาติ เช่น ชีส บาร์บีคิว ปาปริก้า ต้มยำ หม่าล่า ไข่เค็ม สำหรับเฟรนช์ฟรายส์ ไก่ทอด ป๊อปคอร์น ขายปลีก-ส่ง รับผลิต OEM โรงงานมาตรฐาน HACCP`,
        intro: [
          'ผงปรุงรสตราโดนัท หรือที่ร้านค้านิยมเรียกว่า "ผงเขย่า" ผลิตโดยบริษัท อธิปพาณิชย์ จำกัด ซึ่งผลิตผงปรุงรสให้อุตสาหกรรมขนมมาตั้งแต่ปี พ.ศ. 2543 ใช้โรยหรือเขย่ากับอาหารทอดและขนมขบเคี้ยวเพื่อเพิ่มรสชาติได้ทันที',
          'มีให้เลือกหลายรสชาติและหลายขนาดบรรจุ จำหน่ายทั้งปลีกและส่ง และรับผลิตผงปรุงรสตามสูตรของลูกค้า (OEM) ผลิตในโรงงานที่ได้รับการรับรองมาตรฐาน CODEX HACCP และ GHPs',
        ],
        uses: ['เฟรนช์ฟรายส์', 'ไก่ทอด', 'ป๊อปคอร์น', 'มันฝรั่งทอด', 'ข้าวเกรียบ', 'ข้าวโพดอบกรอบ'],
      },
      beverage: {
        name: 'เครื่องดื่มชนิดผง',
        h1: 'เครื่องดื่มชนิดผง ตราโดนัท',
        metaTitle: 'เครื่องดื่มชนิดผง ตราโดนัท | ผงชาไทย ชาเขียว ชานม โกโก้ ขายส่ง',
        metaDesc: (n) => `ผงเครื่องดื่มตราโดนัท ${n} รายการ เช่น ผงชาไทย ชาเขียวมัทฉะ ชานมไข่มุก โกโก้ ช็อกโกแลต นมผง สำหรับร้านชานมและคาเฟ่ ขายปลีก-ส่ง มาตรฐาน HACCP`,
        intro: [
          'เครื่องดื่มชนิดผงตราโดนัท เช่น ผงชาไทย ชาเขียวมัทฉะ ชานมไข่มุก โกโก้ ช็อกโกแลต และนมผง สำหรับร้านชานม คาเฟ่ และธุรกิจเครื่องดื่ม',
          'บริษัท อธิปพาณิชย์ จำกัด เริ่มจำหน่ายสินค้าสำหรับร้านชานมตั้งแต่ปี พ.ศ. 2546 และผลิตในโรงงานที่ได้รับการรับรองมาตรฐาน CODEX HACCP และ GHPs',
        ],
        uses: ['ร้านชานมไข่มุก', 'คาเฟ่', 'ร้านเครื่องดื่ม', 'ธุรกิจอาหารและเครื่องดื่ม'],
      },
      additives: {
        name: 'วัตถุเจือปนอาหาร',
        h1: 'วัตถุเจือปนอาหาร ตราโดนัท',
        metaTitle: 'วัตถุเจือปนอาหาร ตราโดนัท | กรดมะนาว (Citric Acid) ขายส่ง',
        metaDesc: (n) => `วัตถุเจือปนอาหารตราโดนัท ${n} รายการ เช่น กรดมะนาว (Citric Acid) สำหรับงานผลิตอาหารและเครื่องดื่ม ขายปลีก-ส่ง โดยบริษัท อธิปพาณิชย์ จำกัด`,
        intro: [
          'วัตถุเจือปนอาหารตราโดนัท สำหรับงานผลิตอาหารและเครื่องดื่ม เช่น กรดมะนาว (Citric Acid) ที่นิยมใช้ปรับรสเปรี้ยว',
          'จำหน่ายทั้งปลีกและส่งโดยบริษัท อธิปพาณิชย์ จำกัด โรงงานมาตรฐาน CODEX HACCP และ GHPs',
        ],
        uses: ['โรงงานผลิตอาหาร', 'ร้านเครื่องดื่ม', 'ผู้ผลิตขนม'],
      },
    },
    product: {
      metaTitle: (name, sizes, cat) => `${name} ตราโดนัท ${sizes} | ${cat} ขายส่ง`,
      metaDesc: (name, sizes, c) => `${name} ตราโดนัท ขนาด ${sizes} ${c === 'seasoning' ? 'ผงเขย่าสำหรับเฟรนช์ฟรายส์ ไก่ทอด ป๊อปคอร์น' : c === 'beverage' ? 'สำหรับร้านชานมและคาเฟ่' : 'สำหรับงานผลิตอาหารและเครื่องดื่ม'} ขายปลีก-ส่ง รับผลิต OEM โรงงานมาตรฐาน CODEX HACCP โดยบริษัท อธิปพาณิชย์ จำกัด`,
      body: (name, sizes, c) =>
        c === 'seasoning'
          ? `${name} ตราโดนัท เป็นผงปรุงรส (ผงเขย่า) สำหรับโรยหรือเขย่ากับอาหารทอดและขนมขบเคี้ยว เช่น เฟรนช์ฟรายส์ ไก่ทอด ป๊อปคอร์น และมันฝรั่งทอด ขนาดบรรจุ ${sizes} ผลิตโดยบริษัท อธิปพาณิชย์ จำกัด ในโรงงานที่ได้รับการรับรองมาตรฐาน CODEX HACCP และ GHPs จำหน่ายทั้งปลีกและส่ง`
          : c === 'beverage'
          ? `${name} ตราโดนัท เป็นเครื่องดื่มชนิดผง สำหรับร้านชานม คาเฟ่ และธุรกิจเครื่องดื่ม ขนาดบรรจุ ${sizes} ผลิตโดยบริษัท อธิปพาณิชย์ จำกัด ในโรงงานที่ได้รับการรับรองมาตรฐาน CODEX HACCP และ GHPs จำหน่ายทั้งปลีกและส่ง`
          : `${name} ตราโดนัท เป็นวัตถุเจือปนอาหารสำหรับงานผลิตอาหารและเครื่องดื่ม ขนาดบรรจุ ${sizes} จำหน่ายโดยบริษัท อธิปพาณิชย์ จำกัด ทั้งปลีกและส่ง`,
    },
    faq: (c) => [
      { q: 'ผงปรุงรสตราโดนัท ผลิตโดยบริษัทอะไร', a: 'ผงปรุงรสตราโดนัท (Donut Brand) ผลิตและจำหน่ายโดย บริษัท อธิปพาณิชย์ จำกัด (Athip Panich Co., Ltd.) ก่อตั้งเมื่อ พ.ศ. 2543 โดยคุณคนึงรัตน์ ใจตรง และจดทะเบียนเป็นบริษัทเมื่อ พ.ศ. 2560 โรงงานตั้งอยู่ที่อำเภอพระสมุทรเจดีย์ จังหวัดสมุทรปราการ' },
      { q: 'ผงปรุงรสตราโดนัท ได้รับการรับรองมาตรฐานอะไรบ้าง', a: 'โรงงานของบริษัท อธิปพาณิชย์ จำกัด ได้รับการรับรองระบบคุณภาพมาตรฐานสากล CODEX HACCP และ GHPs (Good Hygiene Practices) ครอบคลุมตั้งแต่การคัดสรรวัตถุดิบ การควบคุมการผลิต ไปจนถึงการจัดเก็บและส่งมอบ' },
      { q: 'ตราโดนัท มีสินค้าอะไรบ้าง', a: `ปัจจุบันมีสินค้า ${c.total} รายการ แบ่งเป็น 3 หมวด คือ ผงปรุงรส ${c.seasoning} รายการ (เช่น ผงชีส บาร์บีคิว ปาปริก้า ต้มยำ ลาบ หม่าล่า ไข่เค็ม พิซซ่า), เครื่องดื่มชนิดผง ${c.beverage} รายการ (เช่น ชาไทย ชาเขียวมัทฉะ ชานมไข่มุก โกโก้ นมผง) และวัตถุเจือปนอาหาร ${c.additives} รายการ (เช่น กรดมะนาว)` },
      { q: 'ผงปรุงรสตราโดนัท มีขนาดบรรจุอะไรบ้าง', a: 'ขนาดบรรจุขึ้นอยู่กับแต่ละรายการ โดยทั่วไปผงปรุงรสมีขนาด 100 กรัม, 200 กรัม และ 500 กรัม บางรายการมีขนาด 50 กรัม ส่วนเครื่องดื่มชนิดผงส่วนใหญ่ขนาด 200 กรัม และกรดมะนาวมีขนาด 500 กรัม และ 1,000 กรัม ดูขนาดของแต่ละสินค้าได้ที่หน้าสินค้า' },
      { q: 'ผงปรุงรสตราโดนัท ใช้กับอาหารอะไรได้บ้าง', a: 'ผงปรุงรสตราโดนัทเหมาะสำหรับโรยหรือคลุกอาหารทอดและขนมขบเคี้ยว เช่น เฟรนช์ฟรายส์ ไก่ทอด ป๊อปคอร์น มันฝรั่งทอด ข้าวเกรียบ และข้าวโพดอบกรอบ ส่วนเครื่องดื่มชนิดผงใช้ชงเครื่องดื่มสำหรับร้านชานม คาเฟ่ และธุรกิจเครื่องดื่ม' },
      { q: 'บริษัท อธิปพาณิชย์ จำกัด รับผลิตผงปรุงรส OEM ตามสูตรลูกค้าหรือไม่', a: `บริษัทรับผลิตผงปรุงรสแบบ OEM ตามสูตรของลูกค้า สอบถามรายละเอียด เงื่อนไข และขอใบเสนอราคาได้ที่โทร ${PHONES} หรืออีเมล ${EMAIL}` },
      { q: 'สั่งซื้อผงปรุงรสตราโดนัท และติดต่อบริษัทได้ทางไหน', a: `ติดต่อฝ่ายขายได้ที่โทร ${PHONES} อีเมล ${EMAIL} หรือทาง Facebook (athip.panich.donut), Instagram (don_utbrand) และ TikTok (donut.athip) โรงงานตั้งอยู่ที่ตำบลบ้านคลองสวน อำเภอพระสมุทรเจดีย์ จังหวัดสมุทรปราการ 10290` },
    ],
  },

  en: {
    ui: {
      brandEyebrow: 'Donut Brand Seasoning Powder',
      breadcrumbHome: 'Home',
      sizes: 'Pack sizes',
      notSpecified: 'Size not specified',
      contactForPrice: 'Contact us for price',
      viewDetails: 'View details',
      relatedProducts: 'More products in this category',
      allProducts: 'All products',
      searchPlaceholder: 'Search products...',
      noResults: 'No products found',
      showMore: 'Show more products',
      loading: 'Loading...',
      promotions: 'Promotions',
      usesTitle: 'Great for',
      orderTitle: 'Order / Wholesale price / OEM production',
      orderDesc: 'Contact our sales team for retail and wholesale prices, pack sizes and custom-recipe (OEM) production.',
      emailUs: 'Email us',
      faqNav: 'FAQ',
      faqTitle: 'Frequently Asked Questions about Donut Brand Seasoning',
      faqIntro: 'Answers about the company, production standards, products, pack sizes, ordering and OEM production.',
      seeAllFaq: 'See all questions',
      categoriesTitle: 'Product categories',
      viewCategory: 'View products',
      notFoundTitle: 'Page not found',
      notFoundDesc: 'This page may have moved or no longer exists. Go back to the home page or browse all products.',
      backHome: 'Back to home',
      brandLabel: 'Brand',
      manufacturerLabel: 'Manufacturer',
      certLabel: 'Factory standards',
    },
    home: {
      metaTitle: 'Donut Brand Seasoning Powder Manufacturer Thailand | Athip Panich',
      metaDesc: 'Thai manufacturer of Donut Brand seasoning powders (cheese, BBQ, paprika, tom yum), beverage powders and food additives. CODEX HACCP & GHPs certified. Retail, wholesale and OEM.',
    },
    faqMeta: {
      metaTitle: 'FAQ – Donut Brand Seasoning Powder | Ordering, Pack Sizes, OEM',
      metaDesc: 'Answers about Donut Brand seasoning powder: manufacturer, CODEX HACCP certification, products, pack sizes, uses, ordering and OEM seasoning production in Thailand.',
    },
    categories: {
      seasoning: {
        name: 'Seasoning Powder',
        h1: 'Donut Brand Seasoning Powder (Shaker Powder)',
        metaTitle: 'Seasoning Powder Wholesale Thailand | Cheese, BBQ, Paprika – Donut Brand',
        metaDesc: (n) => `${n} Donut Brand seasoning powder flavors such as cheese, BBQ, paprika, tom yum, mala and salted egg for French fries, fried chicken and popcorn. Wholesale and OEM from a HACCP-certified Thai factory.`,
        intro: [
          'Donut Brand seasoning powder, often called "shaker powder", is made by Athip Panich Co., Ltd., which has supplied seasoning to the Thai snack industry since 2000. Sprinkle or shake it onto fried food and snacks for instant flavor.',
          'Choose from many flavors and pack sizes, available for retail and wholesale, with custom-recipe (OEM) production. Produced in a factory certified to CODEX HACCP and GHPs.',
        ],
        uses: ['French fries', 'Fried chicken', 'Popcorn', 'Potato chips', 'Rice crackers', 'Crispy corn snacks'],
      },
      beverage: {
        name: 'Beverage Powder',
        h1: 'Donut Brand Beverage Powder',
        metaTitle: 'Beverage Powder Wholesale Thailand | Thai Tea, Matcha, Cocoa – Donut Brand',
        metaDesc: (n) => `${n} Donut Brand beverage powders including Thai tea, matcha green tea, bubble tea, cocoa, chocolate and milk powder for tea shops and cafés. Retail and wholesale, HACCP certified.`,
        intro: [
          'Donut Brand beverage powders such as Thai tea, matcha green tea, bubble tea, cocoa, chocolate and milk powder, made for bubble tea shops, cafés and beverage businesses.',
          'Athip Panich Co., Ltd. has supplied products for bubble tea shops since 2003, produced in a factory certified to CODEX HACCP and GHPs.',
        ],
        uses: ['Bubble tea shops', 'Cafés', 'Drink stalls', 'Food & beverage businesses'],
      },
      additives: {
        name: 'Food Additives',
        h1: 'Donut Brand Food Additives',
        metaTitle: 'Food Additives Thailand | Citric Acid Wholesale – Donut Brand',
        metaDesc: (n) => `${n} Donut Brand food additive products such as citric acid for food and beverage production. Retail and wholesale from Athip Panich Co., Ltd., Thailand.`,
        intro: [
          'Donut Brand food additives for food and beverage production, such as citric acid, commonly used to add sourness.',
          'Available for retail and wholesale from Athip Panich Co., Ltd., a CODEX HACCP and GHPs certified manufacturer.',
        ],
        uses: ['Food factories', 'Beverage shops', 'Snack producers'],
      },
    },
    product: {
      metaTitle: (name, sizes, cat) => `${name} ${sizes} | Donut Brand ${cat}`,
      metaDesc: (name, sizes, c) => `Donut Brand ${name}, pack sizes ${sizes}. ${c === 'seasoning' ? 'Shaker seasoning for French fries, fried chicken and popcorn.' : c === 'beverage' ? 'For bubble tea shops and cafés.' : 'For food and beverage production.'} Retail, wholesale and OEM from a CODEX HACCP certified Thai factory.`,
      body: (name, sizes, c) =>
        c === 'seasoning'
          ? `Donut Brand ${name} is a seasoning (shaker) powder to sprinkle or shake onto fried food and snacks such as French fries, fried chicken, popcorn and potato chips. Pack sizes: ${sizes}. Made by Athip Panich Co., Ltd. in a CODEX HACCP and GHPs certified factory. Available for retail and wholesale.`
          : c === 'beverage'
          ? `Donut Brand ${name} is a beverage powder for bubble tea shops, cafés and drink businesses. Pack sizes: ${sizes}. Made by Athip Panich Co., Ltd. in a CODEX HACCP and GHPs certified factory. Available for retail and wholesale.`
          : `Donut Brand ${name} is a food additive for food and beverage production. Pack sizes: ${sizes}. Sold by Athip Panich Co., Ltd. for retail and wholesale.`,
    },
    faq: (c) => [
      { q: 'Who makes Donut Brand seasoning powder?', a: 'Donut Brand seasoning powder is manufactured and distributed by Athip Panich Co., Ltd., founded in 2000 by Ms. Kanuengrut Jaitrong and registered as a company in 2017. The factory is in Phra Samut Chedi District, Samut Prakan, Thailand.' },
      { q: 'What certifications does the factory have?', a: 'The Athip Panich factory is certified to the international CODEX HACCP and GHPs (Good Hygiene Practices) standards, covering raw material selection, production control, storage and delivery.' },
      { q: 'What products does Donut Brand offer?', a: `There are currently ${c.total} products in 3 categories: ${c.seasoning} seasoning powders (e.g. cheese, BBQ, paprika, tom yum, larb, mala, salted egg, pizza), ${c.beverage} beverage powders (e.g. Thai tea, matcha, bubble tea, cocoa, milk powder) and ${c.additives} food additive product(s) (e.g. citric acid).` },
      { q: 'What pack sizes are available?', a: 'It depends on the product. Seasoning powders usually come in 100 g, 200 g and 500 g, with some in 50 g. Most beverage powders are 200 g, and citric acid comes in 500 g and 1,000 g. See each product page for its sizes.' },
      { q: 'What can Donut Brand seasoning be used on?', a: 'It is ideal for sprinkling on or tossing with fried food and snacks such as French fries, fried chicken, popcorn, potato chips, rice crackers and crispy corn. The beverage powders are for bubble tea shops, cafés and drink businesses.' },
      { q: 'Does Athip Panich offer OEM seasoning production?', a: `Yes. We produce seasoning powder to customers' own recipes (OEM). For details, terms and quotations call ${PHONES} or email ${EMAIL}.` },
      { q: 'How can I order or contact the company?', a: `Contact our sales team at ${PHONES}, email ${EMAIL}, or via Facebook (athip.panich.donut), Instagram (don_utbrand) and TikTok (donut.athip). The factory is in Ban Khlong Suan, Phra Samut Chedi, Samut Prakan 10290, Thailand.` },
    ],
  },

  cn: {
    ui: {
      brandEyebrow: 'Donut 甜甜圈品牌 调味粉',
      breadcrumbHome: '首页',
      sizes: '包装规格',
      notSpecified: '未注明规格',
      contactForPrice: '请联系询价',
      viewDetails: '查看详情',
      relatedProducts: '同类其他产品',
      allProducts: '全部产品',
      searchPlaceholder: '搜索产品...',
      noResults: '未找到相关产品',
      showMore: '显示更多产品',
      loading: '加载中...',
      promotions: '特别优惠',
      usesTitle: '适用于',
      orderTitle: '订购 / 批发价格 / OEM 代工',
      orderDesc: '请联系销售团队咨询零售与批发价格、包装规格以及按客户配方代工（OEM）。',
      emailUs: '发送邮件',
      faqNav: '常见问题',
      faqTitle: 'Donut 甜甜圈品牌调味粉常见问题',
      faqIntro: '关于公司、生产标准、产品、包装规格、订购及 OEM 代工的解答。',
      seeAllFaq: '查看全部问题',
      categoriesTitle: '产品分类',
      viewCategory: '查看产品',
      notFoundTitle: '页面不存在',
      notFoundDesc: '该页面可能已移动或不存在。请返回首页或浏览全部产品。',
      backHome: '返回首页',
      brandLabel: '品牌',
      manufacturerLabel: '生产商',
      certLabel: '工厂认证',
    },
    home: {
      metaTitle: '泰国调味粉生产商 Donut 甜甜圈品牌 | 芝士粉 烧烤粉 饮料粉',
      metaDesc: '泰国 Athip Panich 公司生产 Donut 甜甜圈品牌调味粉（芝士、烧烤、红椒、冬阴功）、饮料粉及食品添加剂，通过 CODEX HACCP 与 GHPs 认证，提供零售、批发及 OEM 代工。',
    },
    faqMeta: {
      metaTitle: '常见问题 – Donut 甜甜圈品牌调味粉 | 订购 包装规格 OEM',
      metaDesc: '关于 Donut 甜甜圈品牌调味粉的解答：生产商、CODEX HACCP 认证、产品种类、包装规格、用途、订购方式及泰国 OEM 调味粉代工。',
    },
    categories: {
      seasoning: {
        name: '调味粉',
        h1: 'Donut 甜甜圈品牌调味粉（撒粉）',
        metaTitle: '泰国调味粉批发 | 芝士粉 烧烤粉 红椒粉 – Donut 甜甜圈品牌',
        metaDesc: (n) => `Donut 甜甜圈品牌 ${n} 种调味粉，如芝士、烧烤、红椒、冬阴功、麻辣、咸蛋黄，适用于薯条、炸鸡、爆米花。泰国 HACCP 认证工厂，批发及 OEM 代工。`,
        intro: [
          'Donut 甜甜圈品牌调味粉（又称"撒粉"）由 Athip Panich 有限公司生产，自 2000 年起为泰国休闲食品行业供应调味粉。撒在或摇拌于油炸食品和零食上，即刻增添风味。',
          '多种口味与包装规格可选，提供零售、批发及按客户配方代工（OEM）。产品在通过 CODEX HACCP 与 GHPs 认证的工厂生产。',
        ],
        uses: ['薯条', '炸鸡', '爆米花', '薯片', '米饼', '脆玉米零食'],
      },
      beverage: {
        name: '饮料粉',
        h1: 'Donut 甜甜圈品牌饮料粉',
        metaTitle: '泰国饮料粉批发 | 泰式茶粉 抹茶粉 可可粉 – Donut 甜甜圈品牌',
        metaDesc: (n) => `Donut 甜甜圈品牌 ${n} 种饮料粉，包括泰式茶、抹茶、珍珠奶茶、可可、巧克力及奶粉，适合奶茶店和咖啡馆。零售与批发，HACCP 认证。`,
        intro: [
          'Donut 甜甜圈品牌饮料粉，如泰式茶粉、抹茶粉、珍珠奶茶粉、可可粉、巧克力粉和奶粉，专为奶茶店、咖啡馆及饮品企业打造。',
          'Athip Panich 有限公司自 2003 年起为奶茶店供货，产品在通过 CODEX HACCP 与 GHPs 认证的工厂生产。',
        ],
        uses: ['珍珠奶茶店', '咖啡馆', '饮品店', '餐饮企业'],
      },
      additives: {
        name: '食品添加剂',
        h1: 'Donut 甜甜圈品牌食品添加剂',
        metaTitle: '泰国食品添加剂 | 柠檬酸批发 – Donut 甜甜圈品牌',
        metaDesc: (n) => `Donut 甜甜圈品牌 ${n} 种食品添加剂，如柠檬酸，适用于食品和饮料生产。泰国 Athip Panich 有限公司零售与批发。`,
        intro: [
          'Donut 甜甜圈品牌食品添加剂，适用于食品和饮料生产，例如常用于增加酸味的柠檬酸。',
          '由通过 CODEX HACCP 与 GHPs 认证的 Athip Panich 有限公司提供零售与批发。',
        ],
        uses: ['食品工厂', '饮品店', '零食生产商'],
      },
    },
    product: {
      metaTitle: (name, sizes, cat) => `${name} ${sizes} | Donut 甜甜圈品牌${cat}`,
      metaDesc: (name, sizes, c) => `Donut 甜甜圈品牌${name}，包装规格 ${sizes}。${c === 'seasoning' ? '适用于薯条、炸鸡、爆米花的撒粉。' : c === 'beverage' ? '适合奶茶店和咖啡馆。' : '适用于食品和饮料生产。'}泰国 CODEX HACCP 认证工厂，零售、批发及 OEM。`,
      body: (name, sizes, c) =>
        c === 'seasoning'
          ? `Donut 甜甜圈品牌${name}是一款调味撒粉，可撒在或摇拌于薯条、炸鸡、爆米花、薯片等油炸食品和零食上。包装规格：${sizes}。由 Athip Panich 有限公司在通过 CODEX HACCP 与 GHPs 认证的工厂生产，提供零售与批发。`
          : c === 'beverage'
          ? `Donut 甜甜圈品牌${name}是一款饮料粉，适合奶茶店、咖啡馆及饮品企业。包装规格：${sizes}。由 Athip Panich 有限公司在通过 CODEX HACCP 与 GHPs 认证的工厂生产，提供零售与批发。`
          : `Donut 甜甜圈品牌${name}是一款食品添加剂，适用于食品和饮料生产。包装规格：${sizes}。由 Athip Panich 有限公司提供零售与批发。`,
    },
    faq: (c) => [
      { q: 'Donut 甜甜圈品牌调味粉由哪家公司生产？', a: 'Donut 甜甜圈品牌调味粉由 Athip Panich 有限公司生产和销售。公司由 Kanuengrut Jaitrong 女士于 2000 年创立，2017 年正式注册，工厂位于泰国北榄府 Phra Samut Chedi 县。' },
      { q: '工厂通过了哪些认证？', a: 'Athip Panich 工厂通过了国际 CODEX HACCP 与 GHPs（良好卫生规范）认证，涵盖原料筛选、生产控制、储存及交付各环节。' },
      { q: 'Donut 甜甜圈品牌有哪些产品？', a: `目前共有 ${c.total} 种产品，分为 3 类：调味粉 ${c.seasoning} 种（如芝士、烧烤、红椒、冬阴功、麻辣、咸蛋黄、披萨），饮料粉 ${c.beverage} 种（如泰式茶、抹茶、珍珠奶茶、可可、奶粉），以及食品添加剂 ${c.additives} 种（如柠檬酸）。` },
      { q: '有哪些包装规格？', a: '视产品而定。调味粉通常有 100 克、200 克和 500 克，部分有 50 克；饮料粉大多为 200 克；柠檬酸有 500 克和 1000 克。具体规格请查看各产品页面。' },
      { q: '调味粉适合用在哪些食物上？', a: '适合撒在或拌入油炸食品和零食，如薯条、炸鸡、爆米花、薯片、米饼和脆玉米。饮料粉适合奶茶店、咖啡馆及饮品企业。' },
      { q: '是否提供 OEM 调味粉代工？', a: `是的，我们可按客户配方代工生产调味粉（OEM）。详情、条件及报价请致电 ${PHONES} 或发送邮件至 ${EMAIL}。` },
      { q: '如何订购或联系公司？', a: `请致电销售团队 ${PHONES}，发送邮件至 ${EMAIL}，或通过 Facebook（athip.panich.donut）、Instagram（don_utbrand）和 TikTok（donut.athip）联系我们。工厂地址：泰国北榄府 Phra Samut Chedi 县 Ban Khlong Suan 10290。` },
    ],
  },
};
