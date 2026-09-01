import services from '../data/services'
import { waLink, WA_MESSAGES } from '../utils/contact'
import { useLanguage } from '../context/LanguageContext'

export default function Services() {
  const { t, pick } = useLanguage()
  return (
    <section id="services" className="bg-navy-50/40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="eyebrow justify-center">{t('services_eyebrow')}</span>
          <h2 className="mt-3 font-display font-bold text-2xl md:text-3xl text-navy-700">
            {t('services_title')}
          </h2>
          <p className="mt-2 text-navy-400/80 font-marathi text-sm md:text-base">
            {t('services_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <div key={s.id} className="premium-card p-6 flex gap-4 items-start">
              <div className="h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br from-royal-500 to-navy-600 text-white flex items-center justify-center text-xl shadow-md">
                {s.icon}
              </div>
              <div>
                <h3 className="font-display font-semibold text-navy-700">{s.title}</h3>
                <p className="text-sm text-navy-400/80 font-marathi mt-1">{pick(s.desc, s.descEn)}</p>
               <a
                href={waLink(WA_MESSAGES.service(s.title))}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-royal-500 px-4 py-2 text-xs font-bold text-white shadow-md active:scale-95 transition-transform duration-150 service-enquire-btn"
              >
                <span>{t('services_enquire')}</span>
                <span className="text-sm">→</span>
              </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}