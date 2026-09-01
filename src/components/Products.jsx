import { useMemo, useState, useEffect } from 'react'
import products from '../data/products'
import { filterGroups } from '../data/categories'
import { waLink, WA_MESSAGES } from '../utils/contact'
import { useLanguage } from '../context/LanguageContext'
import { useAdminProducts } from '../context/AdminProductsContext'
import ProductModal from './ProductModal'

function ProductCard({ p, onOpen }) {
  const { t, pick } = useLanguage()
  const name = pick(p.nameMr, p.nameEn) || p.name
  const desc = pick(p.descMr, p.descEn) || p.desc

  
  return (
    <button
      type="button"
      onClick={() => onOpen(p)}
      className="premium-card p-4 flex flex-col text-left w-full focus-visible:ring-2 focus-visible:ring-royal-300 relative"
    >
      {p.isAdmin && (
        <span className="absolute top-2 right-2 text-[10px] font-bold bg-gold-500 text-navy-700 px-2 py-0.5 rounded-full">
          {t('products_new_badge')}
        </span>
      )}
      <div className="h-28 rounded-xl bg-gradient-to-br from-navy-50 to-royal-50 flex items-center justify-center text-4xl mb-3 overflow-hidden">
        {p.image ? (
          <img src={p.image} alt={name} className="h-full w-full object-cover" />
        ) : (
          p.icon
        )}
      </div>
      <span className="text-[11px] font-semibold uppercase tracking-wide text-royal-500 mb-1">
        {p.category}
      </span>
      <h3 className="font-display font-semibold text-navy-700 text-sm leading-snug">
        {name}
      </h3>
      <p className="text-xs text-navy-400/80 font-marathi mt-1 flex-1 line-clamp-2">{desc}</p>
      <div className="flex items-center justify-between mt-3 mb-1">
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            p.available
              ? 'bg-green-100 text-green-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {p.available ? t('products_available') : t('products_on_request')}
        </span>
        <span className="text-xs font-semibold text-navy-600">
          {p.price ? `₹${p.price}` : t('products_price_na')}
        </span>
      </div>
      <span className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-royal-50 text-royal-600 text-xs font-semibold py-2.5 hover:bg-royal-100 transition">
        {t('products_view_details')}
      </span>
    </button>
  )
}

export default function Products({ activeCategory, setActiveCategory }) {
  const { t, lang } = useLanguage()
  const { adminProducts } = useAdminProducts()
  const [query, setQuery] = useState('')
  const [openProduct, setOpenProduct] = useState(null)

  const allProducts = useMemo(() => [...adminProducts, ...products], [adminProducts])

  useEffect(() => {
    if (activeCategory && activeCategory !== 'सर्व') {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [activeCategory])

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      const name = (p.nameMr || p.nameEn || p.name || '').toLowerCase()
      const desc = (p.descMr || p.descEn || p.desc || '')
      const matchesCategory =
        !activeCategory || activeCategory === 'सर्व' || p.category === activeCategory
      const matchesQuery =
        !query.trim() ||
        name.includes(query.toLowerCase()) ||
        desc.includes(query) ||
        (p.category || '').toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [query, activeCategory, allProducts])

  return (
    <section id="products" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="eyebrow justify-center">{t('products_eyebrow')}</span>
          <h2 className="mt-3 font-display font-bold text-2xl md:text-3xl text-navy-700">
            {t('products_title')}
          </h2>
          <p className="mt-2 text-navy-400/80 font-marathi text-sm md:text-base">
            {t('products_subtitle')}
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-300">🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('products_search_placeholder')}
              className="w-full rounded-full border border-navy-100 pl-11 pr-4 py-3 text-sm font-marathi focus:border-royal-400 focus:ring-2 focus:ring-royal-100 outline-none"
              aria-label={t('products_search_placeholder')}
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-8 justify-start md:justify-center">
          {filterGroups.map((g) => (
            <button
              key={g}
              onClick={() => setActiveCategory(g)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                (activeCategory || 'सर्व') === g
                  ? 'bg-royal-500 text-white border-royal-500'
                  : 'bg-white text-navy-500 border-navy-100 hover:border-royal-300'
              }`}
            >
              {g === 'सर्व' ? t('products_all') : g}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} p={p} onOpen={setOpenProduct} />
            ))}
          </div>
        ) : (
          <div className="text-center py-14">
            <p className="font-marathi text-navy-400">{t('products_none_found')}</p>
            <a
              href={waLink(WA_MESSAGES.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex mt-4 items-center gap-1.5 rounded-full bg-green-500 text-white text-sm font-semibold px-5 py-2.5"
            >
              {t('products_ask_whatsapp')}
            </a>
          </div>
        )}

        {/* Send-a-photo feature */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-navy-600 to-royal-500 text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-lg">{t('products_photo_title')}</h3>
            <p className="font-marathi text-white/90 text-sm mt-1">{t('products_photo_desc')}</p>
          </div>
          <a
            href={waLink(WA_MESSAGES.productPhoto)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gold-500 text-navy-700 font-bold px-6 py-3 shrink-0 hover:brightness-105 transition"
          >
            {t('products_photo_cta')}
          </a>
        </div>
      </div>

      {openProduct && (
        <ProductModal product={openProduct} onClose={() => setOpenProduct(null)} />
      )}
    </section>
  )
}
