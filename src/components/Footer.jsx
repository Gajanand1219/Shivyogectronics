import logo from '../assets/logo.png'
import {
  PHONE_NUMBERS,
  SHOP_ADDRESS,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  telLink,
} from '../utils/contact'
import { useLanguage } from '../context/LanguageContext'

const quickLinks = [
  { href: '#home', label: 'Home' },
  { href: '#products', label: 'Products' },
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#tips', label: 'Tips' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
]

const categoryLinks = [
  'Electrical',
  'Electronics',
  'Lighting',
  'Fans',
  'TV/DTH',
  'Decoration',
]

const LOCATION_URL =
  'https://www.google.com/maps/place/Shivyog+Electrical+and+Electronics/@19.3272886,77.1552773,17z/data=!3m1!4b1!4m6!3m5!1s0x3bd033bfc68c865b:0x6f57ea32c82c7c08!8m2!3d19.3272886!4d77.1552773!16s%2Fg%2F11yz89w4tc?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D'

const WHATSAPP_NUMBER = '917038319408'

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  'नमस्कार, मला शिवयोगा इलेक्ट्रिकल & इलेक्ट्रॉनिक्स बद्दल माहिती हवी आहे.'
)}`

export default function Footer({ onOpenAdmin }) {
  const { t } = useLanguage()

  return (
    <footer className="bg-navy-700 text-white/85">

      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">

        {/* BRAND */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <img
              src={logo}
              alt="shivyog Electrical & Electronics"
              className="h-10 w-10 rounded-full bg-white object-contain"
            />

            <span className="font-display font-bold text-white text-sm">
              shivyog Electrical &amp; Electronics
            </span>
          </div>

          <p className="font-marathi text-sm text-gold-400 font-semibold">
            {t('footer_tagline')}
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-3 mt-5">

            {/* FACEBOOK */}
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-blue-600 transition"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-current"
              >
                <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.7-1.6h1.5V4.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4V11H8v3h2.5v8h3z" />
              </svg>
            </a>

            {/* INSTAGRAM */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-pink-600 transition"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-none stroke-current"
                strokeWidth="1.8"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  className="fill-current stroke-none"
                />
              </svg>
            </a>

            {/* WHATSAPP */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-green-500 transition"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-current"
              >
                <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1 1 12 20zm4.4-5.9c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.5.1-.2.2-.5.7-.7.9-.1.2-.3.2-.5.1-1.4-.7-2.4-1.3-3.4-2.9-.2-.3.2-.3.5-1 .1-.2.1-.3 0-.5 0-.1-.5-1.2-.7-1.7-.2-.4-.4-.4-.5-.4h-.4c-.2 0-.5.1-.7.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 3.9 3.5 1.4.6 1.9.7 2.6.6.4-.1 1.3-.5 1.5-1 .2-.5.2-.9.2-1 0-.2-.2-.3-.4-.4z" />
              </svg>
            </a>

            {/* LOCATION */}
            <a
              href={LOCATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Location"
              className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-red-500 transition"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-none stroke-current"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </a>

          </div>
        </div>

        {/* MOBILE = 3 COLUMNS
            DESKTOP = 3 COLUMNS */}
        <div className="grid grid-cols-3 gap-3 sm:gap-8">

          {/* QUICK LINKS */}
          <div className="min-w-0">
            <h4 className="font-display font-semibold text-white text-xs sm:text-base mb-3">
              {t('footer_quick_links')}
            </h4>

            <ul className="space-y-2 text-[11px] sm:text-sm">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="hover:text-gold-400 transition-colors break-words"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CATEGORIES */}
          <div className="min-w-0">
            <h4 className="font-display font-semibold text-white text-xs sm:text-base mb-3">
              {t('footer_categories')}
            </h4>

            <ul className="space-y-2 text-[11px] sm:text-sm">
              {categoryLinks.map((c) => (
                <li key={c}>
                  <a
                    href="#products"
                    className="hover:text-gold-400 transition-colors break-words"
                  >
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="min-w-0">
            <h4 className="font-display font-semibold text-white text-xs sm:text-base mb-3">
              {t('footer_contact')}
            </h4>

            <ul className="space-y-2 text-[10px] sm:text-sm">
              {PHONE_NUMBERS.map((n) => (
                <li key={n}>
                  <a
                    href={telLink(n)}
                    className="hover:text-gold-400 transition-colors break-all"
                  >
                    {n}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href={LOCATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block font-marathi text-[10px] sm:text-sm mt-3 leading-relaxed hover:text-gold-400 transition-colors"
            >
              📍 {SHOP_ADDRESS}
            </a>
          </div>

        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-white/10 py-5 px-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center text-xs text-white/60 font-marathi">

        <span>
          © {new Date().getFullYear()} शिवयोगा इलेक्ट्रिकल &amp; इलेक्ट्रॉनिक्स.{' '}
          {t('footer_rights')}
        </span>

        <button
          onClick={onOpenAdmin}
          className="text-white/40 hover:text-gold-400 transition-colors underline-offset-2 hover:underline"
        >
          {t('footer_admin')}
        </button>

      </div>
    </footer>
  )
}
