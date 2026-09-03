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

           {/* Contact & Social Icons */}
<div className="mt-2 flex items-center justify-center gap-3
                rounded-2xl border border-gray-100
                bg-gradient-to-r from-blue-50 via-green-50 via-pink-50 to-indigo-50
                px-4 py-3 shadow-sm">

  {/* Call */}
 <a
  href="https://www.google.com/maps/search/?api=1&query=Shivyog%20Electrical%20and%20Electronics%2C%20Mama%20Chowk%2C%20Main%20Road%2C%20Vasmat%2C%20Hingoli%2C%20Maharashtra"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-100 px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
>
  <i className="fa fa-map-marker text-lg"></i>
</a>

  {/* WhatsApp */}
  <a
    href={waLink(WA_MESSAGES.general)}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="WhatsApp"
    className="group h-11 w-11 flex items-center justify-center rounded-xl
               bg-white border border-green-100 shadow-sm
               hover:bg-green-500 hover:border-green-500
               transition-all duration-300"
  >
    <i className="fa fa-whatsapp text-xl text-green-500 group-hover:text-white transition"></i>
  </a>

  {/* Instagram */}
  <a
    href="https://www.instagram.com/shivyog.electrical/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
    className="group h-11 w-11 flex items-center justify-center rounded-xl
               bg-white border border-pink-100 shadow-sm
               hover:bg-pink-500 hover:border-pink-500
               transition-all duration-300"
  >
    <i className="fa fa-instagram text-xl text-pink-500 group-hover:text-white transition"></i>
  </a>

  {/* Facebook */}
  <a
    href="https://www.facebook.com/shivyog.electrical/about/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Facebook"
    className="group h-11 w-11 flex items-center justify-center rounded-xl
               bg-white border border-blue-100 shadow-sm
               hover:bg-blue-600 hover:border-blue-600
               transition-all duration-300"
  >
    <i className="fa fa-facebook text-xl text-blue-600 group-hover:text-white transition"></i>
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

                         {/* <a
              href="https://g.page/r/CUkTq0OMoaWhECE/review"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full
                         bg-gradient-to-r from-yellow-400 to-yellow-500
                         text-navy-700 font-semibold px-6 py-3
                         shadow-sm hover:shadow-md hover:brightness-105
                         transition-all duration-300"
            >
              <i className="fa fa-star text-lg"></i>
              Give us a Review
            </a> */}
          </div>
        </div>
      </div>
    </section>
  )
}
