import { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import { PHONE_NUMBERS, telLink, waLink, WA_MESSAGES } from '../utils/contact'
import { useLanguage } from '../context/LanguageContext'

const MENU_HINT_KEY = 'shivyog_menu_hint_seen'

export default function Navbar() {
  const { t, lang, toggleLang } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [showMenuHint, setShowMenuHint] = useState(false)

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

  // =========================================================
  // FIRST TIME MOBILE MENU HINT
  // =========================================================
  useEffect(() => {
    const alreadySeen = localStorage.getItem(MENU_HINT_KEY)

    if (alreadySeen) return

    // थोडा delay करून hint दाखवतो
    const timer = setTimeout(() => {
      setShowMenuHint(true)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  // =========================================================
  // MOBILE MENU CLICK
  // =========================================================
  const handleMenuToggle = () => {
    // User ने एकदा menu click केला की hint permanently hide
    localStorage.setItem(MENU_HINT_KEY, 'true')

    setShowMenuHint(false)
    setOpen((o) => !o)
  }

  const LangToggle = ({ className = '' }) => (
    <button
      onClick={toggleLang}
      aria-label={t('lang_toggle_label')}
      className={`inline-flex items-center rounded-full border-2 border-gold-500 text-xs font-bold overflow-hidden shrink-0 ${className}`}
    >
      <span
        className={`px-2.5 py-1.5 transition-colors ${
          lang === 'mr'
            ? 'bg-gold-500 text-navy-700'
            : 'text-navy-500'
        }`}
      >
        मराठी
      </span>

      <span
        className={`px-2.5 py-1.5 transition-colors ${
          lang === 'en'
            ? 'bg-gold-500 text-navy-700'
            : 'text-navy-500'
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

        {/* =====================================================
            LOGO
        ====================================================== */}
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

        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}
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

        {/* =====================================================
            DESKTOP BUTTONS
        ====================================================== */}
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

        {/* =====================================================
            MOBILE RIGHT SIDE
        ====================================================== */}
        <div className="flex items-center gap-2 md:hidden relative">

          <LangToggle />

          {/* =================================================
              FIRST TIME MENU HINT
          ================================================= */}
          {showMenuHint && (
            <div
              className="
                absolute
                right-0
                top-[52px]
                z-[100]
                whitespace-nowrap
                animate-menuHint
              "
            >
              <div
                className="
                  relative
                  rounded-xl
                  bg-navy-800
                  px-3
                  py-2
                  text-[11px]
                  font-bold
                  text-white
                  shadow-xl
                  border
                  border-white/20
                "
              >
                {lang === 'mr'
                  ? 'Menu साठी येथे टॅप करा 👆'
                  : 'Tap here for Menu 👆'}

                {/* ARROW */}
                <span
                  className="
                    absolute
                    -top-2
                    right-4
                    h-4
                    w-4
                    rotate-45
                    bg-navy-800
                    border-l
                    border-t
                    border-white/20
                  "
                />
              </div>
            </div>
          )}

          {/* =================================================
              HAMBURGER BUTTON
          ================================================= */}
          <button
            type="button"
            aria-label={
              open
                ? t('nav_menu_close')
                : t('nav_menu_open')
            }
            aria-expanded={open}
            onClick={handleMenuToggle}
            className="
              relative
              flex
              flex-col
              justify-center
              gap-1.5
              h-10
              w-10
              rounded-lg
              border
              border-navy-100
              items-center
              bg-white
              shadow-sm
              transition-all
              duration-300
              active:scale-90
              touch-manipulation
            "
          >

            {/* HINT GLOW */}
            {showMenuHint && (
              <span
                className="
                  absolute
                  inset-0
                  rounded-lg
                  border-2
                  border-gold-400
                  animate-menuPulse
                "
              />
            )}

            {/* 3 LINES */}
            <span
              className={`
                block
                h-0.5
                w-5
                bg-navy
                transition-all
                duration-300
                ${
                  open
                    ? 'translate-y-2 rotate-45'
                    : ''
                }
              `}
            />

            <span
              className={`
                block
                h-0.5
                w-5
                bg-navy
                transition-all
                duration-300
                ${
                  open
                    ? 'opacity-0 scale-0'
                    : ''
                }
              `}
            />

            <span
              className={`
                block
                h-0.5
                w-5
                bg-navy
                transition-all
                duration-300
                ${
                  open
                    ? '-translate-y-2 -rotate-45'
                    : ''
                }
              `}
            />
          </button>
        </div>
      </nav>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}
      {open && (
        <div
          className="
            lg:hidden
            bg-white
            border-t
            border-navy-50
            shadow-lg
            animate-mobileMenu
          "
        >
          <ul className="flex flex-col px-4 py-3 font-marathi text-navy-600 font-medium">
            {links.map((l) => (
              <li
                key={l.href}
                className="border-b border-navy-50 last:border-0"
              >
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 hover:text-royal-500 transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* =================================================
              SOCIAL BUTTONS
          ================================================= */}
          <div
            className="
              mx-4
              mb-4
              mt-2
              flex
              items-center
              justify-center
              gap-4
              rounded-2xl
              border
              border-gray-100
              bg-gradient-to-r
              from-green-50
              via-pink-50
              to-blue-50
              px-5
              py-3
              shadow-sm
            "
          >
            {/* WHATSAPP */}
            <a
              href={waLink(WA_MESSAGES.general)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              onClick={() => setOpen(false)}
              className="
                h-10
                w-10
                flex
                items-center
                justify-center
                rounded-xl
                bg-white
                shadow-sm
                border
                border-green-100
                hover:bg-green-500
                transition-all
                duration-300
              "
            >
              <i className="fa fa-whatsapp text-xl text-green-500"></i>
            </a>

            {/* INSTAGRAM */}
            <a
              href="https://www.instagram.com/shivyog.electrical/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              onClick={() => setOpen(false)}
              className="
                h-10
                w-10
                flex
                items-center
                justify-center
                rounded-xl
                bg-white
                shadow-sm
                border
                border-pink-100
                hover:bg-pink-500
                transition-all
                duration-300
              "
            >
              <i className="fa fa-instagram text-xl text-pink-500"></i>
            </a>

            {/* FACEBOOK */}
            <a
              href="https://www.facebook.com/shivyog.electrical/about/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              onClick={() => setOpen(false)}
              className="
                h-10
                w-10
                flex
                items-center
                justify-center
                rounded-xl
                bg-white
                shadow-sm
                border
                border-blue-100
                hover:bg-blue-600
                transition-all
                duration-300
              "
            >
              <i className="fa fa-facebook text-xl text-blue-600"></i>
            </a>

            {/* YOUTUBE */}
            <a
              href="https://www.youtube.com/@Shivyog.Electrical"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              onClick={() => setOpen(false)}
              className="
                h-10
                w-10
                flex
                items-center
                justify-center
                rounded-xl
                bg-white
                shadow-sm
                border
                border-red-100
                hover:bg-red-500
                transition-all
                duration-300
              "
            >
              <i className="fa fa-youtube-play text-xl text-red-600"></i>
            </a>

            {/* GOOGLE REVIEW */}
            <a
              href="https://g.page/r/CQh8LMgy6ldvEBE/review"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Google Review"
              onClick={() => setOpen(false)}
              className="
                h-10
                w-10
                flex
                items-center
                justify-center
                rounded-xl
                bg-white
                shadow-sm
                border
                border-yellow-100
                hover:bg-yellow-400
                transition-all
                duration-300
              "
            >
              <i className="fa fa-star text-xl text-yellow-500"></i>
            </a>
          </div>
        </div>
      )}

      {/* =====================================================
          MOBILE MENU ANIMATIONS
      ====================================================== */}
      <style>{`
        @keyframes menuHint {
          0% {
            opacity: 0;
            transform: translateY(-8px) scale(0.9);
          }

          60% {
            opacity: 1;
            transform: translateY(3px) scale(1.04);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-menuHint {
          animation: menuHint 0.55s ease-out forwards;
        }

        @keyframes menuPulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }

          50% {
            opacity: 1;
            transform: scale(1.12);
          }
        }

        .animate-menuPulse {
          animation: menuPulse 1.3s ease-in-out infinite;
        }

        @keyframes mobileMenu {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-mobileMenu {
          animation: mobileMenu 0.25s ease-out forwards;
        }

        @media (max-width: 640px) {
          button,
          a {
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </header>
  )
}
