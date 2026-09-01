export const WHATSAPP_NUMBER = '917038319408' // +91 7038319408
export const PHONE_NUMBERS = ['7038319408', '9552884781']
export const SHOP_ADDRESS = 'मामा चौक, मेन रोड, वसमत, जि. हिंगोली, महाराष्ट्र'
export const FACEBOOK_URL = 'https://www.facebook.com/shivyog.electrical/about/'
export const INSTAGRAM_URL = 'https://www.instagram.com/shivyog.electrical/'
export const MAPS_QUERY = encodeURIComponent(
  'Shivyog Electrical and Electronics, Mama Chowk, Main Road, Vasmat, Hingoli, Maharashtra'
)
export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`
export const MAPS_EMBED_SRC = `https://maps.google.com/maps?q=${MAPS_QUERY}&z=15&output=embed`

/** Build a wa.me link with a pre-filled Marathi message */
export function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function telLink(number) {
  return `tel:+91${number}`
}

export const WA_MESSAGES = {
  general:
    'नमस्कार, मला तुमच्या दुकानातील इलेक्ट्रिकल/इलेक्ट्रॉनिक्स उत्पादनांबद्दल माहिती हवी आहे.',
  product: (name) => `नमस्कार शिवयोग इलेक्ट्रिकल & इलेक्ट्रॉनिक्स, मला ${name} बद्दल माहिती हवी आहे.`,
  service: (name) => `नमस्कार, मला ${name} साठी माहिती हवी आहे.`,
  remotePhoto:
    'नमस्कार, मला या TV/DTH Remote ची गरज आहे. कृपया उपलब्धता आणि किंमत सांगा.',
  productPhoto:
    'नमस्कार, मला या उत्पादनाबद्दल माहिती हवी आहे. मी फोटो पाठवत आहे.',
  waterHeater: 'नमस्कार, मला Water Heater Element बद्दल माहिती हवी आहे.',
  fan: 'नमस्कार, मला Fan बद्दल माहिती हवी आहे.',
  decor: 'नमस्कार, मला Decoration Lighting बद्दल माहिती हवी आहे.',
}
