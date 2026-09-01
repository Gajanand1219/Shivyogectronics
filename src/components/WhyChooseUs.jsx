import { whyChooseUs } from '../data/services'
import { useLanguage } from '../context/LanguageContext'

export default function WhyChooseUs() {
  const { t, pick } = useLanguage()
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="eyebrow justify-center">{t('why_eyebrow')}</span>
          <h2 className="mt-3 font-display font-bold text-2xl md:text-3xl text-navy-700 font-marathi">
            {t('why_title')}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {whyChooseUs.map((item) => (
            <div
              key={item.mr}
              className="flex items-center gap-2.5 rounded-xl border border-navy-50 bg-gradient-to-br from-white to-navy-50/50 px-4 py-4 shadow-sm"
            >
              <span className="h-6 w-6 shrink-0 rounded-full bg-gold-500 text-navy-700 flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <span className="font-marathi text-sm font-semibold text-navy-600">
                {pick(item.mr, item.en)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
