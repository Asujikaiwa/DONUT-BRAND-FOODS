import { Language, Product, Translation } from './types';

export const TRANSLATIONS: Record<Language, Translation> = {
  th: {
    nav: { home: 'หน้าแรก', products: 'สินค้า', contact: 'ติดต่อเรา' },
    hero: { title: 'รสชาติที่ลงตัว คู่ครัวคุณ', subtitle: 'ผู้ผลิตและจำหน่ายผงปรุงรสและวัตถุเจือปนอาหารคุณภาพสูง ตราโดนัท', cta: 'ดูสินค้าของเรา' },
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
    products: { title: 'สินค้าของเรา', filterAll: 'ทั้งหมด', filterSeasoning: 'ผงปรุงรส', filterBeverage: 'เครื่องดื่ม', filterAdditives: 'วัตถุดิบ/สารเสริม' },
    contact: { title: 'ติดต่อเรา', addressLabel: 'ที่อยู่บริษัท', phoneLabel: 'เบอร์โทรศัพท์', emailLabel: 'อีเมล', followUs: 'ติดตามเราได้ที่' },
  },
  en: {
    nav: { home: 'Home', products: 'Products', contact: 'Contact' },
    hero: { title: 'The Perfect Taste for Your Kitchen', subtitle: 'Manufacturer and distributor of high-quality food additives and seasoning powders, Donut Brand.', cta: 'View Products' },
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
    products: { title: 'Our Products', filterAll: 'All', filterSeasoning: 'Seasonings', filterBeverage: 'Beverages', filterAdditives: 'Additives' },
    contact: { title: 'Contact Us', addressLabel: 'Address', phoneLabel: 'Phone', emailLabel: 'Email', followUs: 'Follow Us' },
  },
  cn: {
    nav: { home: '首页', products: '产品', contact: '联系我们' },
    hero: { title: '厨房的完美味道', subtitle: 'Donut 品牌高品质食品添加剂和调味粉的生产商和分销商。', cta: '查看产品' },
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
    products: { title: '我们的产品', filterAll: '全部', filterSeasoning: '调味料', filterBeverage: '饮料', filterAdditives: '添加剂' },
    contact: { title: '联系我们', addressLabel: '地址', phoneLabel: '电话', emailLabel: '电子邮件', followUs: '关注我们' },
  },
};