// Structured product data. No prices are invented — unknown prices show
// "किंमतीसाठी संपर्क करा" / "Contact for price" per shop instructions.
// Replace `image` with a real product photo path (e.g. `/products/xyz.jpg`)
// whenever the owner adds one, or add photos via the Admin Panel instead.

const products = [
  { id: 'p01', name: 'House Wiring Cable (Multi-size)', category: 'Electrical', brand: 'उपलब्धतेनुसार', image: 'https://5.imimg.com/data5/SELLER/Default/2024/6/426685656/GR/KY/SK/222673043/electrical-wires-and-cables-1000x1000.jpg', desc: 'घर व दुकानाच्या वायरिंगसाठी विविध साईजचे तांब्याचे वायर.', descEn: 'Copper wires of various sizes for home and shop wiring.', price: null, available: true },
  { id: 'p02', name: 'Modular Switch & Socket Set', category: 'Electrical', brand: 'उपलब्धतेनुसार', image: 'https://img-new.cgtrader.com/items/4093892/7f08d37714/large/coswall-modular-range-switches-and-sockets-set-3d-model-7f08d37714.webp', desc: 'आकर्षक व टिकाऊ मॉड्युलर स्विच-सॉकेट.', descEn: 'Attractive and durable modular switch-sockets.', price: null, available: true },
  { id: 'p03', name: 'MCB (Single & Double Pole)', category: 'Electrical', brand: 'उपलब्धतेनुसार', image: 'https://5.imimg.com/data5/SELLER/Default/2022/11/BN/YU/LR/143489371/dpi1-1000x1000.jpg', desc: 'शॉर्ट-सर्किट व ओव्हरलोड पासून सुरक्षा.', descEn: 'Protection from short-circuit and overload.', price: null, available: true },
  { id: 'p04', name: 'RCCB / ELCB', category: 'Electrical', brand: 'उपलब्धतेनुसार', image: 'https://i.ytimg.com/vi/JVrS0UHLlP4/maxresdefault.jpg', desc: 'करंट लिकेजपासून जीवितहानी टाळण्यासाठी आवश्यक.', descEn: 'Essential to prevent injury from current leakage.', price: null, available: true },
  { id: 'p05', name: 'Voltage Stabilizer', category: 'Electrical', brand: 'उपलब्धतेनुसार', image: 'https://www.consumeradvise.in/wp-content/uploads/2021/10/working-voltage-stabilizer.jpg', desc: 'फ्रीज, एसी, टीव्हीसाठी व्होल्टेज संरक्षण.', descEn: 'Voltage protection for fridge, AC and TV.', price: null, available: true },
  { id: 'p06', name: 'Distribution Board', category: 'Electrical', brand: 'उपलब्धतेनुसार', image: 'https://3.imimg.com/data3/LF/FR/MY-11536672/distribution-board.jpg', desc: 'सुरक्षित व व्यवस्थित वायरिंग सेटअपसाठी.', descEn: 'For a safe and organised wiring setup.', price: null, available: true },
  { id: 'p07', name: 'Inverter (Home Use)', category: 'Inverter / UPS', brand: 'उपलब्धतेनुसार', image: 'https://www.housegyan.com/_next/image?url=https%3A%2F%2Fimages.housegyan.com%2Fmedia%2F1767868253192-types-of-inverters-for-home.webp&w=1080&q=50', desc: 'लोडशेडिंगच्या काळात अखंडित वीजपुरवठा.', descEn: 'Uninterrupted power supply during load-shedding.', price: null, available: true },
  { id: 'p08', name: 'Inverter Battery', category: 'Inverter / UPS', brand: 'उपलब्धतेनुसार', image: 'https://5.imimg.com/data5/SELLER/Default/2023/9/347712583/KD/OW/FO/6326311/home-inverter-batterywww-1000x1000.jpg', desc: 'दीर्घकाळ बॅकअप देणाऱ्या बॅटरी.', descEn: 'Batteries that give long-lasting backup.', price: null, available: true },
  { id: 'p09', name: 'Table Fan', category: 'Fans', brand: 'उपलब्धतेनुसार', image: 'https://tse1.mm.bing.net/th/id/OIP.ggxuOAO_A9OCxAEYHq2hJwHaDm?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', desc: 'शक्तिशाली हवा व कमी वीज वापर असणारा टेबल फॅन.', descEn: 'Table fan with powerful airflow and low power use.', price: null, available: true },
  { id: 'p10', name: 'Ceiling Fan', category: 'Fans', brand: 'उपलब्धतेनुसार', image: 'https://topceilingfans.net/wp-content/uploads/2024/12/top_ceiling_fan_brands-5.jpg', desc: 'घर व ऑफिससाठी योग्य सीलिंग फॅन.', descEn: 'Ceiling fan suited for home and office.', price: null, available: true },
  { id: 'p11', name: 'Exhaust Fan', category: 'Fans', brand: 'उपलब्धतेनुसार', image: 'https://tse2.mm.bing.net/th/id/OIP.JisFR0rg0XiQyAEevk-kggHaJT?r=0&w=716&h=900&rs=1&pid=ImgDetMain&o=7&rm=3', desc: 'स्वयंपाकघर व बाथरूमसाठी एक्झॉस्ट फॅन.', descEn: 'Exhaust fan for kitchen and bathroom.', price: null, available: true },
  { id: 'p12', name: 'Water Heater / Geyser Element', category: 'Water Heater', brand: 'उपलब्धतेनुसार', image: 'https://images-na.ssl-images-amazon.com/images/I/314IbFxQZJL._SL500_AC_SS350_.jpg', desc: 'विविध साईज व वॅटेजचे रिप्लेसमेंट एलिमेंट्स.', descEn: 'Replacement elements in various sizes and wattages.', price: null, available: true },
  { id: 'p13', name: 'Kettle Element', category: 'Water Heater', brand: 'उपलब्धतेनुसार', image: 'https://i.ytimg.com/vi/7HK0I4YsKwc/maxresdefault.jpg', desc: 'इलेक्ट्रिक केटलसाठी रिप्लेसमेंट एलिमेंट.', descEn: 'Replacement element for electric kettles.', price: null, available: true },
  { id: 'p14', name: 'LED Bulb (7W / 9W / 12W)', category: 'Light / Lighting', brand: 'उपलब्धतेनुसार', image: 'https://tse2.mm.bing.net/th/id/OIP.0Yjx_Xwt4l7LevW0M59adAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', desc: 'ऊर्जा-बचत करणारे तेजस्वी एलईडी बल्ब.', descEn: 'Bright, energy-saving LED bulbs.', price: null, available: true },
  { id: 'p15', name: 'LED Panel Light', category: 'Light / Lighting', brand: 'उपलब्धतेनुसार', image: 'https://ae01.alicdn.com/kf/HTB19IfPsTXYBeNkHFrdq6AiuVXaw/TSLEEN-RGB-Dimmable-LED-Panel-LED-Light-Ceiling-with-Remote-24-key-Controller-Driver-2835-LEDS.jpg', desc: 'दुकान व ऑफिससाठी स्लिम पॅनल लाईट.', descEn: 'Slim panel lights for shop and office.', price: null, available: true },
  { id: 'p16', name: 'Flood Light', category: 'Light / Lighting', brand: 'उपलब्धतेनुसार', image: 'https://tse1.mm.bing.net/th/id/OIP.kj3EwrSu2zBxPWM5IUxX8AHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', desc: 'दुकानाच्या बाहेरील भागासाठी शक्तिशाली फ्लड लाईट.', descEn: 'Powerful flood lights for outdoor shop areas.', price: null, available: true },
  { id: 'p17', name: 'Fairy / Serial Lights', category: 'Decoration', brand: 'उपलब्धतेनुसार', image: 'https://m.media-amazon.com/images/I/61kla4x7c8L._SL1500_.jpg', desc: 'सण व लग्नाच्या सजावटीसाठी सुंदर लायटिंग.', descEn: 'Beautiful lighting for festival and wedding decor.', price: null, available: true },
  { id: 'p18', name: 'LED Strip / Rope Lights', category: 'Decoration', brand: 'उपलब्धतेनुसार', image: 'https://m.media-amazon.com/images/I/81DbzH+HLyL._AC_SL1500_.jpg', desc: 'घर व दुकानाच्या सजावटीसाठी रंगीत लायटिंग.', descEn: 'Colourful lighting for home and shop decor.', price: null, available: true },
  { id: 'p19', name: 'TV Remote (Original / Compatible)', category: 'TV / DTH', brand: 'Samsung / LG / Videocon', image: 'https://image.made-in-china.com/2f0j00hMQbuaCGYion/Universal-LCD-LED-TV-Remote-Control.jpg', desc: 'Original / Compatible पर्याय उपलब्धतेनुसार.', descEn: 'Original / compatible options subject to availability.', price: null, available: true },
  { id: 'p20', name: 'DTH Remote', category: 'TV / DTH', brand: 'Tata Play / DishTV / Airtel', image: 'https://i5.walmartimages.com/seo/XIBUFE-Wall-Mount-Remote-Control-Holder-Adhesive-Storage-Box-for-Set-top-Box-Accessories-No-Drill-Organizer-remote-wall-holder_0bef9e7c-a971-4139-a164-dafdf55c2ab3.217175855bfb3d5fc6a6ad7b19533c00.jpeg', desc: 'सर्व प्रमुख डीटीएच कंपन्यांचे रिमोट पर्याय.', descEn: 'Remote options for all major DTH companies.', price: null, available: true },
  { id: 'p21', name: 'Set-top Box Accessories', category: 'TV / DTH', brand: 'उपलब्धतेनुसार', image: 'https://ii1.pepperfry.com/media/catalog/product/m/d/1100x1210/mdf-set-top-box-in-black-by-home-sparkle-mdf-set-top-box-in-black-by-home-sparkle-bl0bk2.jpg', desc: 'सेट-टॉप बॉक्ससाठी आवश्यक साहित्य.', descEn: 'Essential material for set-top boxes.', price: null, available: true },
  { id: 'p22', name: 'Extension Board (4/6 Socket)', category: 'Accessories', brand: 'उपलब्धतेनुसार', image: 'https://5.imimg.com/data5/SJ/HH/CM/SELLER-16347024/extension-board-4-sockets-4-usb-ext-404--1000x1000.jpeg', desc: 'सुरक्षित मल्टी-सॉकेट एक्सटेंशन बोर्ड.', descEn: 'Safe multi-socket extension boards.', price: null, available: true },
  { id: 'p23', name: 'Plug Top & Adapter', category: 'Accessories', brand: 'उपलब्धतेनुसार', image: 'https://i5.walmartimages.com/asr/300d4f2d-66e6-48a7-9159-372898cac7a8.54e37daf476b1c6bee967f70c806faec.jpeg', desc: 'सर्व प्रकारचे 2-पिन व 3-पिन प्लग.', descEn: 'All types of 2-pin and 3-pin plugs.', price: null, available: true },
  { id: 'p24', name: 'Earthing Rod & Accessories', category: 'Electrical', brand: 'उपलब्धतेनुसार', image: 'https://images-na.ssl-images-amazon.com/images/I/31iet7iZn9L._UL500_.jpg', desc: 'सुरक्षित अर्थिंगसाठी दर्जेदार साहित्य.', descEn: 'Quality material for safe earthing.', price: null, available: true },


    // ================= ELECTRONICS =================

  {
    id: 'p25',
    name: 'Bluetooth Speaker',
    category: 'Electronics',
    brand: 'उपलब्धतेनुसार',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=80',
    desc: 'घर, पार्टी आणि छोट्या कार्यक्रमांसाठी पोर्टेबल ब्लूटूथ स्पीकर.',
    descEn: 'Portable Bluetooth speaker for home, parties and small events.',
    price: null,
    available: true
  },

  {
    id: 'p26',
    name: 'Rechargeable Emergency Light',
    category: 'Electronics',
    brand: 'उपलब्धतेनुसार',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1000&q=80',
    desc: 'वीज गेल्यावर वापरण्यासाठी रिचार्जेबल इमर्जन्सी लाईट.',
    descEn: 'Rechargeable emergency light for use during power cuts.',
    price: null,
    available: true
  },

  {
    id: 'p27',
    name: 'Digital Multimeter',
    category: 'Electronics',
    brand: 'उपलब्धतेनुसार',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1000&q=80',
    desc: 'व्होल्टेज, करंट आणि रेझिस्टन्स तपासण्यासाठी डिजिटल मल्टीमीटर.',
    descEn: 'Digital multimeter for measuring voltage, current and resistance.',
    price: null,
    available: true
  },

  {
    id: 'p28',
    name: 'Rechargeable Torch Light',
    category: 'Electronics',
    brand: 'उपलब्धतेनुसार',
    image: 'https://5.imimg.com/data5/SELLER/Default/2024/1/378558472/PM/LA/ER/22053261/chetak-new-torch-light-1000x1000.jpg',
    desc: 'घर, दुकान आणि बाहेरील वापरासाठी शक्तिशाली रिचार्जेबल टॉर्च.',
    descEn: 'Powerful rechargeable torch for home, shop and outdoor use.',
    price: null,
    available: true
  },

    // ================= DECORATION =================

  {
    id: 'p29',
    name: 'Decorative LED String Lights',
    category: 'Decoration',
    brand: 'उपलब्धतेनुसार',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80',
    desc: 'घर, दुकान, सण आणि कार्यक्रमांच्या सजावटीसाठी आकर्षक LED स्ट्रिंग लाईट्स.',
    descEn: 'Attractive LED string lights for home, shop, festivals and events.',
    price: null,
    available: true
  },

  {
    id: 'p30',
    name: 'Decorative Wall Light',
    category: 'Decoration',
    brand: 'उपलब्धतेनुसार',
    image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1000&q=80',
    desc: 'घर, दुकान आणि ऑफिसच्या भिंतींसाठी सुंदर डेकोरेटिव्ह वॉल लाईट.',
    descEn: 'Beautiful decorative wall light for home, shop and office walls.',
    price: null,
    available: true
  },

  {
    id: 'p31',
    name: 'Decorative Hanging Light',
    category: 'Decoration',
    brand: 'उपलब्धतेनुसार',
    image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=1000&q=80',
    desc: 'हॉल, दुकान आणि इंटिरियर सजावटीसाठी आकर्षक हँगिंग लाईट.',
    descEn: 'Attractive hanging light for halls, shops and interior decoration.',
    price: null,
    available: true
  },



    // ================= WATER HEATER =================

  {
    id: 'p32',
    name: 'Electric Geyser',
    category: 'Water Heater',
    brand: 'उपलब्धतेनुसार',
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1000&q=80',
    desc: 'घरासाठी गरम पाण्याची सोय देणारा ऊर्जा-बचत करणारा इलेक्ट्रिक गिझर.',
    descEn: 'Energy-efficient electric geyser for hot water at home.',
    price: null,
    available: true
  },

  {
    id: 'p33',
    name: 'Geyser Heating Element',
    category: 'Water Heater',
    brand: 'उपलब्धतेनुसार',
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1000&q=80',
    desc: 'विविध गिझर मॉडेलसाठी उपलब्ध रिप्लेसमेंट हीटिंग एलिमेंट.',
    descEn: 'Replacement heating element suitable for various geyser models.',
    price: null,
    available: true
  },

  {
    id: 'p34',
    name: 'Instant Water Heater',
    category: 'Water Heater',
    brand: 'उपलब्धतेनुसार',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80',
    desc: 'कमी वेळेत गरम पाणी मिळण्यासाठी कॉम्पॅक्ट इन्स्टंट वॉटर हीटर.',
    descEn: 'Compact instant water heater for quick hot water.',
    price: null,
    available: true
  },


    // ================= LIGHT / LIGHTING =================

  

{
  id: 'p38',
  name: 'Motion Sensor Light',
  category: 'Light / Lighting',
  brand: 'उपलब्धतेनुसार',
  image: 'https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=1000&q=80',
  desc: 'हालचाल ओळखून आपोआप सुरू होणारी स्मार्ट सेन्सर लाईट.',
  descEn: 'Smart sensor light that automatically turns on when motion is detected.',
  price: null,
  available: true
},



// ================= ACCESSORIES – BOARDS & SWITCHES =================


{
  id: 'p42',
  name: '6 Module Switch Board',
  category: 'Accessories',
  brand: 'उपलब्धतेनुसार',
  image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1000&q=80',
  desc: 'स्विच, सॉकेट आणि इतर मॉड्युल बसवण्यासाठी 6 मॉड्युल बोर्ड.',
  descEn: '6-module board for installing switches, sockets and other modules.',
  price: null,
  available: true
},

{
  id: 'p43',
  name: '2 Way Switch',
  category: 'Accessories',
  brand: 'उपलब्धतेनुसार',
  image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80',
  desc: 'एकाच लाईटला दोन ठिकाणांहून नियंत्रित करण्यासाठी 2-Way स्विच.',
  descEn: '2-way switch for controlling a light from two different locations.',
  price: null,
  available: true
},




]

export default products
