import { PHONE_NUMBERS, telLink, waLink, WA_MESSAGES, MAPS_LINK } from '../utils/contact'
import { useLanguage } from '../context/LanguageContext'

export default function FloatingButtons() {
  const { t } = useLanguage()
  return (
    <>
      {/* Desktop / tablet floating buttons */}
      <div className="hidden md:flex flex-col gap-3 fixed bottom-6 right-6 z-40">
        <a
          href={waLink(WA_MESSAGES.general)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp वर चौकशी करा"
          className="h-14 w-14 rounded-full bg-green-500 text-white flex items-center justify-center text-2xl shadow-xl hover:scale-110 transition-transform animate-pulseGlow"
        >
                    <i className="fa fa-whatsapp text-2xl"></i>

        </a>
        <a
          href={telLink(PHONE_NUMBERS[0])}
          aria-label="कॉल करा"
          className="h-14 w-14 rounded-full bg-navy-600 text-white flex items-center justify-center text-2xl shadow-xl hover:scale-110 transition-transform"
        >
          📞
        </a>
      </div>

      {/* Mobile sticky bottom action bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-navy-100 shadow-[0_-4px_20px_rgba(11,37,69,0.12)] grid grid-cols-3">
        <a
          href={waLink(WA_MESSAGES.general)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-green-600 font-semibold text-xs"
        >
          <span className="text-lg"><i className="fa fa-whatsapp text-2xl"></i></span> WhatsApp
        </a>
        <a
          href={telLink(PHONE_NUMBERS[0])}
          className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-navy-600 font-semibold text-xs border-x border-navy-100"
        >
          <span className="text-lg">📞</span> {t('fab_call')}
        </a>
        <a
          href={MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-brand-red font-semibold text-xs"
        >
          <span className="text-lg">🗺️</span> {t('fab_directions')}
        </a>
      </div>
    </>
  )
}