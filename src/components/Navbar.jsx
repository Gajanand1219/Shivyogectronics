import { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import { PHONE_NUMBERS, telLink, waLink, WA_MESSAGES } from '../utils/contact'
import { useLanguage } from '../context/LanguageContext'

export default function Navbar() {
  const { t, lang, toggleLang } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const links = [
    { href: '#home', label: t('nav_home') },
    { href: '#products', label: t('nav_products') },
    { href: '#categories', label: t('nav_categories') },
    { href: '#services', label: t('nav_services') },
    { href: '#about', label: t('nav_about') },
    { href: '#tips', label: t('nav_tips') },
    { href: '#gallery', label: t('nav_gallery') },
    { href: '#contact', label: t('nav_contact') },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const LangToggle = ({ className = '' }) => (
    <button
      onClick={toggleLang}
      aria-label={t('lang_toggle_label')}
      className={`inline-flex items-center rounded-full border-2 border-gold-500 text-xs font-bold overflow-hidden shrink-0 ${className}`}
    >
      <span
        className={`px-2.5 py-1.5 transition-colors ${
          lang === 'mr' ? 'bg-gold-500 text-navy-700' : 'text-navy-500'
        }`}
      >
        मराठी
      </span>
      <span
        className={`px-2.5 py-1.5 transition-colors ${
          lang === 'en' ? 'bg-gold-500 text-navy-700' : 'text-navy-500'
        }`}
      >
        EN
      </span>
    </button>
  )

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-md'
          : 'bg-white/70 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-4 md:px-6 py-2.5">
        <a href="#home" className="flex items-center gap-2 shrink-0">
          <img
            src={logo}
            alt="Shivyoga Electrical & Electronics logo"
            className="h-11 w-11 md:h-12 md:w-12 rounded-full object-contain shadow-sm"
          />
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="font-display font-bold text-navy text-sm md:text-base">
              शिवयोगा इलेक्ट्रिकल
            </span>
            <span className="text-[11px] md:text-xs text-royal-500 font-semibold">
              & इलेक्ट्रॉनिक्स
            </span>
          </span>
        </a>

        <ul className="hidden lg:flex items-center gap-6 font-marathi text-[15px] font-medium text-navy-600">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="hover:text-royal-500 transition-colors relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-gold-500 after:transition-all hover:after:w-full"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-2">
          <LangToggle />
          <a
            href={telLink(PHONE_NUMBERS[0])}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-navy-600 text-navy-600 px-4 py-2 text-sm font-semibold hover:bg-navy-600 hover:text-white transition-colors"
          >
            


            {t('📞')}

          </a>
          <a
            href={waLink(WA_MESSAGES.general)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 text-sm font-semibold shadow-md hover:shadow-lg hover:brightness-105 transition-all"
          >
           <i className="fa fa-whatsapp text-2xl"></i>
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LangToggle />
          <button
            aria-label={open ? t('nav_menu_close') : t('nav_menu_open')}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex flex-col justify-center gap-1.5 h-10 w-10 rounded-lg border border-navy-100 items-center"
          >
            <span className={`block h-0.5 w-5 bg-navy transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-5 bg-navy transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-navy transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden bg-white border-t border-navy-50 shadow-lg animate-[fadeIn_.2s_ease]">
          <ul className="flex flex-col px-4 py-3 font-marathi text-navy-600 font-medium">
            {links.map((l) => (
              <li key={l.href} className="border-b border-navy-50 last:border-0">
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 hover:text-royal-500"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 px-4 pb-4">
            <a
              href={telLink(PHONE_NUMBERS[0])}
              className="flex-1 text-center rounded-full border-2 border-navy-600 text-navy-600 py-2.5 text-sm font-semibold"
            >
              {t('nav_call')}
            </a>
            <a
              href={waLink(WA_MESSAGES.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center rounded-full bg-green-500 text-white py-2.5 text-sm font-semibold"
            >
              {t('nav_whatsapp')}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}