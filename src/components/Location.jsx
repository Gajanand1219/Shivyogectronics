import { MAPS_EMBED_SRC, MAPS_LINK, SHOP_ADDRESS, PHONE_NUMBERS, waLink, WA_MESSAGES, telLink } from '../utils/contact'
import { useLanguage } from '../context/LanguageContext'

export default function Location() {
  const { t } = useLanguage()
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="eyebrow justify-center">{t('location_eyebrow')}</span>
          <h2 className="mt-3 font-display font-bold text-2xl md:text-3xl text-navy-700 font-marathi">
            {t('location_title')}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          <div className="rounded-2xl overflow-hidden shadow-card border border-navy-50 min-h-[280px]">
            <iframe
              title="Shivyoga Electrical & Electronics - Google Maps"
              src={MAPS_EMBED_SRC}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '280px' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="premium-card p-6 md:p-8 flex flex-col justify-center gap-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📍</span>
              <p className="font-marathi text-navy-600 font-medium">{SHOP_ADDRESS}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📞</span>
              <div className="flex flex-col gap-1">
                {PHONE_NUMBERS.map((n) => (
                  <a key={n} href={telLink(n)} className="text-navy-600 font-medium hover:text-royal-500">
                    {n}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <a
                href={waLink(WA_MESSAGES.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-navy-600 font-medium hover:text-royal-500"
              >
              <i className="fa fa-whatsapp text-3xl text-green-500"></i>

                {t('location_whatsapp')}
              </a>
            </div>

            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-navy-600 text-white font-semibold px-6 py-3 hover:bg-navy-700 transition"
            >
              {t('location_directions')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
