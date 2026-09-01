import { useLanguage } from '../context/LanguageContext'

const badges = [
  { icon: '⚡', key: 'badge_1' },
  { icon: '🛡️', key: 'badge_2' },
  { icon: '💰', key: 'badge_3' },
  { icon: '🔧', key: 'badge_4' },
  { icon: '🏠', key: 'badge_5' },
  { icon: '📦', key: 'badge_6' },
]

export default function TrustBadges() {
  const { t } = useLanguage()
  return (
    <section className="bg-white border-b border-navy-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {badges.map((b) => (
          <div
            key={b.key}
            className="reveal in-view flex flex-col items-center text-center gap-2 rounded-xl px-2 py-4 hover:bg-navy-50/60 transition-colors"
          >
            <span className="text-3xl">{b.icon}</span>
            <span className="font-marathi text-xs sm:text-sm font-semibold text-navy-600">
              {t(b.key)}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
