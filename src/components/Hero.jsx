import logo from '../assets/logo.png'
import { waLink, telLink, PHONE_NUMBERS, WA_MESSAGES } from '../utils/contact'
import { useLanguage } from '../context/LanguageContext'

const floatingChips = [
  { icon: '🔌', label: 'वायर व केबल्स', pos: 'top-2 left-2 md:top-4 md:left-0' },
  { icon: '🪭', label: 'फॅन्स', pos: 'top-1/3 -right-2 md:right-2' },
  { icon: '♨️', label: 'वॉटर हीटर', pos: 'bottom-16 left-0 md:left-4' },
  { icon: '✨', label: 'डेकोरेशन लाईट्स', pos: 'bottom-0 right-4 md:right-10' },
  { icon: '📡', label: 'DTH रिमोट', pos: 'top-4 right-1/3' },
]

export default function Hero() {
  const { t } = useLanguage()
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-navy-700 via-navy to-royal-600"
    >
      {/* subtle dotted circuit-grid backdrop */}
      <div className="absolute inset-0 bg-hero-grid [background-size:22px_22px] opacity-30" />
      {/* soft glow accents */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gold-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-royal-400/30 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 pt-12 pb-16 md:pt-20 md:pb-24 grid lg:grid-cols-2 gap-10 items-center">
        <div className="text-center lg:text-left">
          <span className="eyebrow text-gold-400 justify-center lg:justify-start">
            {t('hero_eyebrow')}
          </span>

         <h1 className="mt-4 font-display font-extrabold text-2xl sm:text-4xl md:text-5xl text-white leading-tight">
  शिवयोग इलेक्ट्रिकल &amp;
  
  {/* <span className="block mt-2 bg-gradient-to-r from-gold-400 to-brand-orange bg-clip-text text-transparent"> */}
  <span className="block mt-2 text-gold-400">
    इलेक्ट्रॉनिक्स
  </span>
</h1>

          <p className="mt-5 text-navy-50/90 text-base md:text-lg font-marathi max-w-xl mx-auto lg:mx-0">
            {t('hero_desc')}
          </p>

          <p className="mt-3 text-gold-400 font-semibold text-sm md:text-base">
            {t('hero_tagline')}
          </p>

          <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
            <a
              href="#products"
              className="inline-flex items-center gap-2 rounded-full bg-gold-500 text-navy-700 font-bold px-6 py-3 shadow-glow hover:brightness-105 hover:scale-[1.03] transition-all"
            >
              {t('hero_cta_products')}
            </a>
            <a
              href={waLink(WA_MESSAGES.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-green-500 text-white font-bold px-6 py-3 shadow-md hover:brightness-105 hover:scale-[1.03] transition-all"
            >
              <i className="fa fa-whatsapp text-2xl"></i>
              {t('hero_cta_whatsapp')}
            </a>
            <a
              href={telLink(PHONE_NUMBERS[0])}
              className="inline-flex items-center gap-2 rounded-full glass-panel text-white font-bold px-6 py-3 hover:bg-white/20 transition-all"
            >
              {/* <i className="fa fa-phone text-2xl"></i> */}
              {t('hero_cta_call')}
            </a>
          </div>
        </div>

        {/* Hero visual: real logo with glowing bulb ring + floating category chips */}
        <div className="relative flex justify-center items-center h-72 sm:h-80 md:h-96">
          <div className="absolute h-56 w-56 md:h-72 md:w-72 rounded-full bg-gold-400/30 blur-2xl animate-pulseGlow" />
          <div className="relative animate-floaty">
            <img
              src={logo}
              alt="Shivyoga Electrical & Electronics – official logo"
              className="h-52 w-52 md:h-64 md:w-64 rounded-full shadow-2xl ring-4 ring-white/30 object-contain bg-white"
            />
          </div>

          {floatingChips.map((c) => (
            <div
              key={c.label}
              className={`hidden sm:flex absolute ${c.pos} items-center gap-1.5 glass-panel rounded-full px-3 py-1.5 text-white text-xs font-semibold shadow-lg`}
            >
              <span>{c.icon}</span>
              <span className="font-marathi">{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* signature circuit-trace divider */}
      <svg
        className="circuit-divider"
        viewBox="0 0 1200 28"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 14 H420 L440 4 L460 24 L480 4 L500 24 L520 14 H1200"
          fill="none"
          stroke="#F4B400"
          strokeWidth="2"
        />
      </svg>
    </section>
  )
}
