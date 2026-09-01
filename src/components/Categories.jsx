import categories from '../data/categories'
import { useLanguage } from '../context/LanguageContext'

export default function Categories({ onSelectCategory }) {
  const { t, lang, pick } = useLanguage()

  return (
    <section id="categories" className="bg-navy-50/40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="eyebrow justify-center">{t('categories_eyebrow')}</span>
          <h2 className="mt-3 font-display font-bold text-2xl md:text-3xl text-navy-700">
            {t('categories_title')}
          </h2>
          <p className="mt-2 text-navy-400/80 font-marathi text-sm md:text-base">
            {t('categories_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {categories.map((c) => (
            <div
                key={c.id}
                onClick={() => onSelectCategory?.(c.group)}
                className="premium-card p-5 flex flex-col items-start gap-2 group cursor-pointer"
              >
                <div className="h-16 w-16 rounded-xl overflow-hidden bg-gray-100 group-hover:scale-110 transition-transform">
                  <img
                    src={c.icon}
                    alt={lang === 'en' ? c.name : c.marathi}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="font-display font-semibold text-navy-700 text-sm md:text-base">
                  {lang === 'en' ? c.name : c.marathi}
                </h3>

                <p className="text-xs text-navy-400/80 font-marathi leading-snug">
                  {pick(c.desc, c.descEn)}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectCategory?.(c.group)
                  }}
                  className="mt-2 text-xs font-semibold text-royal-500 hover:text-brand-red transition-colors inline-flex items-center gap-1"
                >
                  {t('categories_view_products')}
                </button>
              </div>
          ))}
        </div>
      </div>
    </section>
  )
}
