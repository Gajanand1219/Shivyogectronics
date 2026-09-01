// Central category data. Icons are emoji so no external image dependency is
// required — swap `icon` for a real photo path once shop photos are ready.
// `desc` is Marathi, `descEn` is the English translation used when the site
// language toggle is set to English.
const categories = [
  { id: 'wires', name: 'Electrical Wires & Cables', marathi: 'वायर व केबल्स', icon: 'https://5.imimg.com/data5/SELLER/Default/2024/6/426685656/GR/KY/SK/222673043/electrical-wires-and-cables-1000x1000.jpg', group: 'Electrical', desc: 'घर व दुकानासाठी दर्जेदार वायरिंग साहित्य.', descEn: 'Quality wiring material for home and shop.' },
  { id: 'switches', name: 'Switches & Sockets', marathi: 'स्विच व सॉकेट', icon: 'https://tse3.mm.bing.net/th/id/OIP.05_20VSznCOGaVaw5N3gAAHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', group: 'Electrical', desc: 'मॉड्युलर व सर्वसाधारण स्विच-सॉकेट पर्याय.', descEn: 'Modular and standard switch-socket options.' },
  { id: 'mcb', name: 'MCB / RCCB', marathi: 'एमसीबी / आरसीसीबी', icon: 'https://www.electricaltechnology.org/wp-content/uploads/2019/07/Difference-between-MCB-MCCB-ELCB-RCD-RCCB-or-RCB-RCBO-Circuit-Breakers.jpg', group: 'Electrical', desc: 'सुरक्षिततेसाठी आवश्यक प्रोटेक्शन साहित्य.', descEn: 'Essential protection equipment for safety.' },
  { id: 'protection', name: 'Electrical Protection', marathi: 'इलेक्ट्रिकल प्रोटेक्शन', icon: 'https://tse2.mm.bing.net/th/id/OIP.y1lPgdXh_WeqCeT1xZwaMgHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', group: 'Electrical', desc: 'सर्ज प्रोटेक्टर, स्टॅबिलायझर व सुरक्षा साधने.', descEn: 'Surge protectors, stabilizers and safety devices.' },
  { id: 'inverter', name: 'Inverter / UPS', marathi: 'इन्व्हर्टर / यूपीएस', icon: 'https://sunapecopower.com/wp-content/uploads/2026/02/UPS-Inverter-With-Battery.png?wsr', group: 'Inverter / UPS', desc: 'लोडशेडिंगवर मात करण्यासाठी विश्वासार्ह पर्याय.', descEn: 'Reliable options to beat load-shedding.' },
  { id: 'batteries', name: 'Batteries', marathi: 'बॅटरी', icon: 'https://www.batteriesplus.com/4aff31/globalassets/blog/interior-images/sli-collage.jpg', group: 'Inverter / UPS', desc: 'इन्व्हर्टर व इतर उपकरणांसाठी बॅटरी.', descEn: 'Batteries for inverters and other devices.' },
  { id: 'fans', name: 'Fans', marathi: 'पंखे', icon: 'https://m.media-amazon.com/images/I/71KjLv9CcOL.jpg', group: 'Fans', desc: 'टेबल, सीलिंग, वॉल व एक्झॉस्ट फॅन्स.', descEn: 'Table, ceiling, wall and exhaust fans.' },
  { id: 'waterheater', name: 'Water Heater / Geyser Elements', marathi: 'वॉटर हीटर एलिमेंट', icon: 'https://5.imimg.com/data5/ANDROID/Default/2024/1/373517619/TO/JG/QP/34703821/product-jpeg-1000x1000.jpg', group: 'Water Heater', desc: 'गिझर व वॉटर हीटरचे रिप्लेसमेंट एलिमेंट्स.', descEn: 'Replacement elements for geysers and water heaters.' },
  { id: 'ledlights', name: 'LED Lights', marathi: 'एलईडी लाईट्स', icon: 'https://tse3.mm.bing.net/th/id/OIP._tfuHI02gVQM21H-H6ebCgHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', group: 'Light / Lighting', desc: 'घर व दुकानासाठी ऊर्जा-बचत करणारे एलईडी दिवे.', descEn: 'Energy-saving LED lights for home and shop.' },
  { id: 'decor', name: 'Decorative Lighting', marathi: 'सजावटीचे दिवे', icon: 'https://cdn.fcglcdn.com/brainbees/images/products/583x720/18730239a.webp', group: 'Decoration', desc: 'सण व लग्नासाठी आकर्षक डेकोरेशन लायटिंग.', descEn: 'Attractive decorative Lighting for festivals and weddings.' },
  { id: 'tvacc', name: 'TV Accessories', marathi: 'टीव्ही अॅक्सेसरीज', icon: 'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/03/6-best-accessories-for-the-ultimate-tv-viewing-experience-game-rant-deals-feature.jpg?w=1600&h=900&fit=crop', group: 'TV / DTH', desc: 'टीव्हीशी संबंधित उपकरणे व साहित्य.', descEn: 'TV-related equipment and accessories.' },
  { id: 'dth', name: 'DTH / Dish Accessories', marathi: 'डीटीएच / डिश साहित्य', icon: 'https://m.media-amazon.com/images/I/411Fl+vbdTL.jpg', group: 'TV / DTH', desc: 'डीटीएच व डिश सेटअपसाठी आवश्यक साहित्य.', descEn: 'Essential material for DTH and dish setups.' },
  { id: 'remotes', name: 'Remote Controls', marathi: 'रिमोट कंट्रोल', icon: 'https://tse2.mm.bing.net/th/id/OIP.OYjfODjF3TPmeWwYN27FpwHaE0?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', group: 'TV / DTH', desc: 'टीव्ही, एसी, डीटीएचचे ओरिजिनल व कंपॅटिबल रिमोट.', descEn: 'Original and compatible remotes for TV, AC, DTH.' },
  { id: 'extension', name: 'Extension Boards', marathi: 'एक्सटेंशन बोर्ड', icon: 'https://5.imimg.com/data5/SELLER/Default/2022/2/VM/ZQ/HH/77107326/fedus-4-plus-4-extension-board-1000x1000.jpg', group: 'Accessories', desc: 'सुरक्षित व मजबूत एक्सटेंशन बोर्ड पर्याय.', descEn: 'Safe and sturdy extension board options.' },
  { id: 'plugs', name: 'Plugs & Adapters', marathi: 'प्लग व अडॉप्टर', icon: 'https://m.media-amazon.com/images/I/619RiLAuLWL._AC_SL1500_.jpg', group: 'Accessories', desc: 'सर्व प्रकारचे प्लग व अडॉप्टर उपलब्ध.', descEn: 'All types of plugs and adapters available.' },
  { id: 'conduit', name: 'Conduit Pipes', marathi: 'कंड्युट पाईप', icon: 'https://cdn.shopify.com/s/files/1/0603/3503/0456/files/WEEK-27-BLOG2-Content-The-Essential-Guide-to-Conduit-Fittings_1.jpg?v=1711366167', group: 'Electrical', desc: 'वायरिंग सुरक्षिततेसाठी कंड्युट पाईप्स.', descEn: 'Conduit pipes for wiring safety.' },
  { id: 'earthing', name: 'Earthing Materials', marathi: 'अर्थिंग साहित्य', icon: 'https://axis-india.com/wp-content/uploads/2023/04/Creatives-for-Website-Landing-Page-2.jpg', group: 'Electrical', desc: 'सुरक्षित अर्थिंगसाठी आवश्यक साहित्य.', descEn: 'Essential material for safe earthing.' },
  { id: 'tools', name: 'Electrical Tools', marathi: 'इलेक्ट्रिकल टूल्स', icon: 'https://mbelectrical.in/wp-content/uploads/2025/11/e135c196-4dd8-4161-9853-7cdb543f200e.png', group: 'Accessories', desc: 'इलेक्ट्रिशियनसाठी आवश्यक हत्यारे व साधने.', descEn: 'Essential tools and equipment for electricians.' },
  { id: 'components', name: 'Electronics Components', marathi: 'इलेक्ट्रॉनिक्स कॉम्पोनंट्स', icon: 'https://wallpapercave.com/wp/wp5982420.jpg', group: 'Electronics', desc: 'छोटी-मोठी इलेक्ट्रॉनिक्स सुटी उपकरणे.', descEn: 'Small and large electronics spare parts.' },
  { id: 'homeacc', name: 'Home Electrical Accessories', marathi: 'घरगुती इलेक्ट्रिकल साहित्य', icon: 'https://i.ytimg.com/vi/wDkV53iD5eI/maxresdefault.jpg', group: 'Accessories', desc: 'दैनंदिन घरगुती इलेक्ट्रिकल गरजांसाठी साहित्य.', descEn: 'Material for everyday household electrical needs.' },
]

export const filterGroups = [
  'सर्व',
  'Electrical',
  'Electronics',
  'Light / Lighting',
  'Fans',
  'Water Heater',
  'TV / DTH',
  'Decoration',
  'Inverter / UPS',
  'Accessories',
]

export default categories
