import logo from '../assets/logo.png'
import { useLanguage } from '../context/LanguageContext'

export default function About() {
  const { t } = useLanguage()
  const tags = ['about_tag_1', 'about_tag_2', 'about_tag_3', 'about_tag_4']
  return (
    <section id="about" className="bg-navy-50/40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="flex justify-center order-2 md:order-1">
          <img
            src={logo}
            alt="Shivyoga Electrical & Electronics"
            className="h-52 w-52 md:h-64 md:w-64 rounded-full shadow-card object-contain bg-white p-4"
          />
        </div>
        <div className="order-1 md:order-2">
          <span className="eyebrow">{t('about_eyebrow')}</span>
          <h2 className="mt-3 font-display font-bold text-2xl md:text-3xl text-navy-700 font-marathi">
            {t('about_title')}
          </h2>
          <p className="mt-4 text-navy-500 font-marathi leading-relaxed">{t('about_p1')}</p>
          <p className="mt-3 text-navy-400/90 font-marathi leading-relaxed text-sm md:text-base">
            {t('about_p2')}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {tags.map((key) => (
              <div key={key} className="flex items-center gap-2 text-sm font-marathi text-navy-600 font-semibold">
                <span className="text-gold-500">●</span> {t(key)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
