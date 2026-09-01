import { useState } from 'react'
import tips from '../data/tips'
import { useLanguage } from '../context/LanguageContext'

export default function Tips() {
  const [openId, setOpenId] = useState(null)
  const { t, pick } = useLanguage()

  return (
    <section id="tips" className="bg-navy-50/40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="eyebrow justify-center">{t('tips_eyebrow')}</span>
          <h2 className="mt-3 font-display font-bold text-2xl md:text-3xl text-navy-700 font-marathi">
            {t('tips_title')}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tips.map((tip) => (
            <article key={tip.id} className="premium-card p-5 flex flex-col">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gold-400/30 to-brand-orange/20 flex items-center justify-center text-2xl mb-3">
                {tip.icon}
              </div>
              <h3 className="font-display font-semibold text-navy-700 text-sm leading-snug font-marathi">
                {pick(tip.title, tip.titleEn)}
              </h3>
              {openId === tip.id && (
                <p className="text-xs text-navy-400/80 font-marathi mt-2">
                  {pick(tip.desc, tip.descEn)}
                </p>
              )}
              <button
                onClick={() => setOpenId(openId === tip.id ? null : tip.id)}
                className="mt-3 text-xs font-semibold text-royal-500 hover:text-brand-red self-start"
              >
                {openId === tip.id ? t('tips_read_less') : t('tips_read_more')}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
