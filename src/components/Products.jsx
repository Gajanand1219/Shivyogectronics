// import { useMemo, useState, useEffect } from 'react'
// import products from '../data/products'
// import { filterGroups } from '../data/categories'
// import { waLink, WA_MESSAGES } from '../utils/contact'
// import { useLanguage } from '../context/LanguageContext'
// import { useAdminProducts } from '../context/AdminProductsContext'
// import ProductModal from './ProductModal'

// function ProductCard({ p, onOpen }) {
//   const { t, pick } = useLanguage()

//   const name = pick(p.nameMr, p.nameEn) || p.name
//   const desc = pick(p.descMr, p.descEn) || p.desc

//   return (
//     <button
//       type="button"
//       onClick={() => onOpen(p)}
//       className="premium-card p-4 flex flex-col text-left w-full focus-visible:ring-2 focus-visible:ring-royal-300 relative"
//     >
//       {p.isAdmin && (
//         <span className="absolute top-2 right-2 text-[10px] font-bold bg-gold-500 text-navy-700 px-2 py-0.5 rounded-full">
//           {t('products_new_badge')}
//         </span>
//       )}

//       <div className="h-28 rounded-xl bg-gradient-to-br from-navy-50 to-royal-50 flex items-center justify-center text-4xl mb-3 overflow-hidden">
//         {p.image ? (
//           <img
//             src={p.image}
//             alt={name}
//             className="h-full w-full object-cover"
//           />
//         ) : (
//           p.icon
//         )}
//       </div>

//       <span className="text-[11px] font-semibold uppercase tracking-wide text-royal-500 mb-1">
//         {p.category}
//       </span>

//       <h3 className="font-display font-semibold text-navy-700 text-sm leading-snug">
//         {name}
//       </h3>

//       <p className="text-xs text-navy-400/80 font-marathi mt-1 flex-1 line-clamp-2">
//         {desc}
//       </p>

//       <div className="flex items-center justify-between mt-3 mb-1">
//         <span
//           className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
//             p.available
//               ? 'bg-green-100 text-green-700'
//               : 'bg-amber-100 text-amber-700'
//           }`}
//         >
//           {p.available
//             ? t('products_available')
//             : t('products_on_request')}
//         </span>

//         <span className="text-xs font-semibold text-navy-600">
//           {p.price ? `₹${p.price}` : t('products_price_na')}
//         </span>
//       </div>

//       <span className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-royal-50 text-royal-600 text-xs font-semibold py-2.5 hover:bg-royal-100 transition">
//         {t('products_view_details')}
//       </span>
//     </button>
//   )
// }

// export default function Products({
//   activeCategory,
//   setActiveCategory,
// }) {
//   const { t } = useLanguage()
//   const { adminProducts } = useAdminProducts()

//   const [query, setQuery] = useState('')
//   const [openProduct, setOpenProduct] = useState(null)

//   /*
//    * IMPORTANT:
//    *
//    * products = products bundled with frontend
//    * adminProducts = products coming from GitHub API
//    *
//    * Both can contain the same product.
//    *
//    * Use ID as the unique key and merge them.
//    */
//   const allProducts = useMemo(() => {
//     const productMap = new Map()

//     // First add bundled products
//     products.forEach((product) => {
//       if (product?.id) {
//         productMap.set(String(product.id), product)
//       }
//     })

//     // Then add API/GitHub products
//     // API version replaces the bundled version
//     adminProducts.forEach((product) => {
//       if (product?.id) {
//         productMap.set(String(product.id), product)
//       }
//     })

//     return Array.from(productMap.values())
//   }, [adminProducts])

//   /*
//    * Scroll to products when category changes
//    */
//   useEffect(() => {
//     if (activeCategory && activeCategory !== 'सर्व') {
//       setTimeout(() => {
//         document
//           .getElementById('products')
//           ?.scrollIntoView({
//             behavior: 'smooth',
//             block: 'start',
//           })
//       }, 50)
//     }
//   }, [activeCategory])

//   /*
//    * SEARCH + CATEGORY FILTER
//    */
//   const filtered = useMemo(() => {
//     const selectedCategory = String(
//       activeCategory || 'सर्व'
//     ).trim()

//     const searchText = String(query || '')
//       .trim()
//       .toLowerCase()

//     return allProducts.filter((p) => {
//       const category = String(p?.category || '').trim()

//       const name = String(
//         p?.nameMr ||
//         p?.nameEn ||
//         p?.name ||
//         ''
//       ).toLowerCase()

//       const desc = String(
//         p?.descMr ||
//         p?.descEn ||
//         p?.desc ||
//         ''
//       ).toLowerCase()

//       /*
//        * Category condition
//        */
//       const matchesCategory =
//         selectedCategory === 'सर्व' ||
//         category === selectedCategory

//       /*
//        * Search condition
//        */
//       const matchesSearch =
//         !searchText ||
//         name.includes(searchText) ||
//         desc.includes(searchText) ||
//         category.toLowerCase().includes(searchText)

//       return matchesCategory && matchesSearch
//     })
//   }, [allProducts, activeCategory, query])

//   return (
//     <section id="products" className="bg-white">
//       <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">

//         {/* Header */}
//         <div className="text-center max-w-2xl mx-auto mb-8">
//           <span className="eyebrow justify-center">
//             {t('products_eyebrow')}
//           </span>

//           <h2 className="mt-3 font-display font-bold text-2xl md:text-3xl text-navy-700">
//             {t('products_title')}
//           </h2>

//           <p className="mt-2 text-navy-400/80 font-marathi text-sm md:text-base">
//             {t('products_subtitle')}
//           </p>
//         </div>

//         {/* Search */}
//         <div className="max-w-xl mx-auto mb-6">
//           <div className="relative">
//             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-300">
//               🔍
//             </span>

//             <input
//               type="text"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder={t('products_search_placeholder')}
//               className="w-full rounded-full border border-navy-100 pl-11 pr-4 py-3 text-sm font-marathi focus:border-royal-400 focus:ring-2 focus:ring-royal-100 outline-none"
//               aria-label={t('products_search_placeholder')}
//             />
//           </div>
//         </div>

//         {/* Category filters */}
//         <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-8 justify-start md:justify-center">
//           {filterGroups.map((group) => {
//             const selected =
//               (activeCategory || 'सर्व') === group

//             return (
//               <button
//                 key={group}
//                 type="button"
//                 onClick={() => {
//                   setActiveCategory(group)
//                 }}
//                 className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
//                   selected
//                     ? 'bg-royal-500 text-white border-royal-500'
//                     : 'bg-white text-navy-500 border-navy-100 hover:border-royal-300'
//                 }`}
//               >
//                 {group === 'सर्व'
//                   ? t('products_all')
//                   : group}
//               </button>
//             )
//           })}
//         </div>

//         {/* Product count */}
//         <div className="text-center mb-5">
//           <span className="text-xs text-navy-400">
//             {filtered.length} products
//           </span>
//         </div>

//         {/* Products */}
//         {filtered.length > 0 ? (
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
//             {filtered.map((product) => (
//               <ProductCard
//                 key={product.id}
//                 p={product}
//                 onOpen={setOpenProduct}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-14">
//             <p className="font-marathi text-navy-400">
//               {t('products_none_found')}
//             </p>

//             <a
//               href={waLink(WA_MESSAGES.general)}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex mt-4 items-center gap-1.5 rounded-full bg-green-500 text-white text-sm font-semibold px-5 py-2.5"
//             >
//               {t('products_ask_whatsapp')}
//             </a>
//           </div>
//         )}

//         {/* Send photo */}
//         <div className="mt-12 rounded-2xl bg-gradient-to-r from-navy-600 to-royal-500 text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
//           <div>
//             <h3 className="font-display font-bold text-lg">
//               {t('products_photo_title')}
//             </h3>

//             <p className="font-marathi text-white/90 text-sm mt-1">
//               {t('products_photo_desc')}
//             </p>
//           </div>

//           <a
//             href={waLink(WA_MESSAGES.productPhoto)}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="inline-flex items-center gap-2 rounded-full bg-gold-500 text-navy-700 font-bold px-6 py-3 shrink-0 hover:brightness-105 transition"
//           >
//             {t('products_photo_cta')}
//           </a>
//         </div>
//       </div>

//       {/* Modal */}
//       {openProduct && (
//         <ProductModal
//           product={openProduct}
//           onClose={() => setOpenProduct(null)}
//         />
//       )}
//     </section>
//   )
// }



























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
      className="
        premium-card
        p-3 sm:p-4
        flex flex-col
        text-left
        w-full
        focus-visible:ring-2
        focus-visible:ring-royal-300
        relative
        min-w-0
      "
    >
      {/* NEW / ADMIN BADGE */}
      {p.isAdmin && (
        <span
          className="
            absolute
            top-2
            right-2
            z-10
            text-[9px]
            sm:text-[10px]
            font-bold
            bg-gold-500
            text-navy-700
            px-1.5
            sm:px-2
            py-0.5
            rounded-full
          "
        >
          {t('products_new_badge')}
        </span>
      )}

      {/* IMAGE */}
      <div
        className="
          h-24
          sm:h-28
          rounded-xl
          bg-gradient-to-br
          from-navy-50
          to-royal-50
          flex
          items-center
          justify-center
          text-3xl
          sm:text-4xl
          mb-2
          sm:mb-3
          overflow-hidden
        "
      >
        {p.image ? (
          <img
            src={p.image}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          p.icon
        )}
      </div>

      {/* CATEGORY */}
      <span
        className="
          text-[9px]
          sm:text-[11px]
          font-semibold
          uppercase
          tracking-wide
          text-royal-500
          mb-1
          truncate
        "
      >
        {p.category}
      </span>

      {/* PRODUCT NAME */}
      <h3
        className="
          font-display
          font-semibold
          text-navy-700
          text-xs
          sm:text-sm
          leading-snug
          line-clamp-2
        "
      >
        {name}
      </h3>

      {/* DESCRIPTION */}
      <p
        className="
          text-[10px]
          sm:text-xs
          text-navy-400/80
          font-marathi
          mt-1
          flex-1
          line-clamp-2
        "
      >
        {desc}
      </p>

      {/* PRICE + AVAILABILITY */}
      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-1
          mt-2
          sm:mt-3
          mb-1
        "
      >
        <span
          className={`
            w-fit
            text-[9px]
            sm:text-[11px]
            font-semibold
            px-1.5
            sm:px-2
            py-0.5
            rounded-full
            ${
              p.available
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700'
            }
          `}
        >
          {p.available
            ? t('products_available')
            : t('products_on_request')}
        </span>

        <span
          className="
            text-[11px]
            sm:text-xs
            font-semibold
            text-navy-600
          "
        >
          {p.price
            ? `₹${p.price}`
            : t('products_price_na')}
        </span>
      </div>

      {/* VIEW DETAILS */}
      <span
        className="
          mt-2
          inline-flex
          items-center
          justify-center
          gap-1.5
          rounded-full
          bg-royal-50
          text-royal-600
          text-[10px]
          sm:text-xs
          font-semibold
          py-2
          sm:py-2.5
          hover:bg-royal-100
          transition
        "
      >
        {t('products_view_details')}
      </span>
    </button>
  )
}

export default function Products({
  activeCategory,
  setActiveCategory,
}) {
  const { t } = useLanguage()
  const { adminProducts } = useAdminProducts()

  const [query, setQuery] = useState('')
  const [openProduct, setOpenProduct] = useState(null)

  // --------------------------------------------------
  // VIEW MORE / SHOW LESS
  // --------------------------------------------------
  const [showAll, setShowAll] = useState(false)

  // --------------------------------------------------
  // COMBINE PRODUCTS + ADMIN PRODUCTS
  // REMOVE DUPLICATES BY ID
  // ADMIN/API VERSION WINS
  // --------------------------------------------------
  const allProducts = useMemo(() => {
    const productMap = new Map()

    products.forEach((product) => {
      if (product?.id) {
        productMap.set(String(product.id), product)
      }
    })

    adminProducts.forEach((product) => {
      if (product?.id) {
        productMap.set(String(product.id), product)
      }
    })

    return Array.from(productMap.values())
  }, [adminProducts])

  // --------------------------------------------------
  // SCROLL TO PRODUCTS WHEN CATEGORY CHANGES
  // --------------------------------------------------
  useEffect(() => {
    // Whenever category changes,
    // start from first 8 products again.
    setShowAll(false)

    if (
      activeCategory &&
      activeCategory !== 'सर्व'
    ) {
      setTimeout(() => {
        document
          .getElementById('products')
          ?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
      }, 50)
    }
  }, [activeCategory])

  // --------------------------------------------------
  // FILTER PRODUCTS
  // --------------------------------------------------
  const filtered = useMemo(() => {
    const selectedCategory = String(
      activeCategory || 'सर्व'
    ).trim()

    const searchText = String(query || '')
      .trim()
      .toLowerCase()

    return allProducts.filter((p) => {
      const category = String(
        p?.category || ''
      ).trim()

      const name = String(
        p?.nameMr ||
        p?.nameEn ||
        p?.name ||
        ''
      ).toLowerCase()

      const desc = String(
        p?.descMr ||
        p?.descEn ||
        p?.desc ||
        ''
      ).toLowerCase()

      // CATEGORY FILTER
      const matchesCategory =
        selectedCategory === 'सर्व' ||
        category === selectedCategory

      // SEARCH FILTER
      const matchesSearch =
        !searchText ||
        name.includes(searchText) ||
        desc.includes(searchText) ||
        category
          .toLowerCase()
          .includes(searchText)

      return (
        matchesCategory &&
        matchesSearch
      )
    })
  }, [
    allProducts,
    activeCategory,
    query,
  ])

  // --------------------------------------------------
  // SHOW ONLY 8 INITIALLY
  // --------------------------------------------------
  const visibleProducts = useMemo(() => {
    // If search is active,
    // show all matching search results.
    if (query.trim()) {
      return filtered
    }

    // If SHOW ALL clicked,
    // show all filtered products.
    if (showAll) {
      return filtered
    }

    // Default = first 8 products
    return filtered.slice(0, 8)
  }, [
    filtered,
    showAll,
    query,
  ])

  // --------------------------------------------------
  // WHETHER VIEW MORE BUTTON IS NEEDED
  // --------------------------------------------------
  const canShowMore =
    !query.trim() &&
    filtered.length > 8

  // --------------------------------------------------
  // ACTIVE CATEGORY LABEL
  // --------------------------------------------------
  const activeCategoryLabel =
    activeCategory &&
    activeCategory !== 'सर्व'
      ? activeCategory
      : null

  return (
    <section
      id="products"
      className="bg-white"
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          md:px-6
          py-12
          md:py-16
        "
      >
        {/* ==================================================
            HEADER
        ================================================== */}
        <div className="mb-6 md:mb-8">
          <div
            className="
              flex
              flex-col
              md:flex-row
              md:items-end
              md:justify-between
              gap-4
            "
          >
            {/* TITLE */}
            <div>
              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-royal-500
                  mb-2
                "
              >
                Products
              </p>

              <h2
                className="
                  font-display
                  text-2xl
                  md:text-4xl
                  font-bold
                  text-navy-700
                "
              >
                {t('products_title')}
              </h2>

              {activeCategoryLabel && (
                <p
                  className="
                    text-sm
                    text-navy-400
                    mt-1
                  "
                >
                  {activeCategoryLabel}
                </p>
              )}
            </div>

            {/* SEARCH */}
            <div
              className="
                relative
                w-full
                md:w-80
              "
            >
              <span
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-navy-400
                  text-sm
                "
              >
                🔍
              </span>

              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setShowAll(false)
                }}
                placeholder={
                  t('products_search') ||
                  'Search products...'
                }
                className="
                  w-full
                  pl-9
                  pr-4
                  py-2.5
                  rounded-full
                  border
                  border-navy-100
                  bg-navy-50/40
                  text-sm
                  text-navy-700
                  outline-none
                  focus:border-royal-300
                  focus:ring-2
                  focus:ring-royal-100
                  transition
                "
              />
            </div>
          </div>
        </div>

        {/* ==================================================
            CATEGORY FILTER
        ================================================== */}
        <div
          className="
            mb-7
            overflow-x-auto
            scrollbar-hide
          "
        >
          <div
            className="
              flex
              gap-2
              min-w-max
              pb-1
            "
          >
            {/* ALL BUTTON */}
            <button
              type="button"
              onClick={() => {
                setActiveCategory('सर्व')
                setShowAll(false)
              }}
              className={`
                px-4
                py-2
                rounded-full
                text-xs
                sm:text-sm
                font-semibold
                whitespace-nowrap
                transition
                ${
                  !activeCategory ||
                  activeCategory === 'सर्व'
                    ? 'bg-navy-700 text-white shadow-sm'
                    : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
                }
              `}
            >
              {t('products_all') || 'सर्व'}
            </button>

            {/* CATEGORY BUTTONS */}
            {filterGroups.map(
              (group) => {
                const category =
                  group.label || group.name

                if (!category) {
                  return null
                }

                const isActive =
                  activeCategory === category

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setActiveCategory(
                        category
                      )
                      setShowAll(false)
                    }}
                    className={`
                      px-4
                      py-2
                      rounded-full
                      text-xs
                      sm:text-sm
                      font-semibold
                      whitespace-nowrap
                      transition
                      ${
                        isActive
                          ? 'bg-royal-600 text-white shadow-sm'
                          : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
                      }
                    `}
                  >
                    {category}
                  </button>
                )
              }
            )}
          </div>
        </div>

        {/* ==================================================
            PRODUCT COUNT
        ================================================== */}
        <div
          className="
            flex
            items-center
            justify-between
            mb-4
          "
        >
          <p
            className="
              text-xs
              sm:text-sm
              text-navy-400
            "
          >
            {query.trim()
              ? `${filtered.length} products found`
              : showAll
              ? `${filtered.length} products`
              : `Showing ${Math.min(
                  8,
                  filtered.length
                )} of ${filtered.length}`}
          </p>

          {showAll &&
            !query.trim() &&
            filtered.length > 8 && (
              <button
                type="button"
                onClick={() =>
                  setShowAll(false)
                }
                className="
                  text-xs
                  sm:text-sm
                  font-semibold
                  text-royal-600
                  hover:text-royal-700
                "
              >
                Show Less
              </button>
            )}
        </div>

        {/* ==================================================
            PRODUCTS GRID
        ================================================== */}
        {visibleProducts.length > 0 ? (
          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              lg:grid-cols-4
              gap-3
              sm:gap-4
              md:gap-5
            "
          >
            {visibleProducts.map(
              (product) => (
                <ProductCard
                  key={product.id}
                  p={product}
                  onOpen={setOpenProduct}
                />
              )
            )}
          </div>
        ) : (
          /* ==================================================
             NO PRODUCTS
          ================================================== */
          <div
            className="
              py-16
              text-center
              rounded-2xl
              bg-navy-50/50
              border
              border-navy-100
            "
          >
            <div className="text-4xl mb-3">
              🔍
            </div>

            <h3
              className="
                font-display
                font-semibold
                text-navy-700
                text-lg
              "
            >
              No products found
            </h3>

            <p
              className="
                text-sm
                text-navy-400
                mt-1
              "
            >
              Try another search or category.
            </p>

            {(query ||
              activeCategory !==
                'सर्व') && (
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setActiveCategory(
                    'सर्व'
                  )
                  setShowAll(false)
                }}
                className="
                  mt-4
                  px-5
                  py-2
                  rounded-full
                  bg-royal-600
                  text-white
                  text-sm
                  font-semibold
                  hover:bg-royal-700
                  transition
                "
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* ==================================================
            VIEW MORE / SHOW LESS
        ================================================== */}
        {canShowMore && (
          <div
            className="
              flex
              justify-center
              mt-8
            "
          >
            {!showAll ? (
              <button
                type="button"
                onClick={() =>
                  setShowAll(true)
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-7
                  py-3
                  rounded-full
                  bg-navy-700
                  text-white
                  text-sm
                  font-semibold
                  shadow-sm
                  hover:bg-navy-800
                  hover:-translate-y-0.5
                  transition
                "
              >
                View More
                <span className="text-base">
                  ↓
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setShowAll(false)
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-7
                  py-3
                  rounded-full
                  bg-navy-50
                  text-navy-700
                  text-sm
                  font-semibold
                  border
                  border-navy-100
                  hover:bg-navy-100
                  transition
                "
              >
                Show Less
                <span className="text-base">
                  ↑
                </span>
              </button>
            )}
          </div>
        )}

        {/* ==================================================
            WHATSAPP / CONTACT BUTTON
        ================================================== */}
        <div
          className="
            flex
            justify-center
            mt-10
          "
        >
          <a
            href={waLink(
              WA_MESSAGES.products
            )}
            target="_blank"
            rel="noreferrer"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-6
              py-3
              rounded-full
              bg-green-600
              text-white
              text-sm
              font-semibold
              hover:bg-green-700
              transition
              shadow-sm
            "
          >
            <span>WhatsApp</span>
            <span>→</span>
          </a>
        </div>
      </div>

      {/* ==================================================
          PRODUCT MODAL
      ================================================== */}
      {openProduct && (
        <ProductModal
          product={openProduct}
          onClose={() =>
            setOpenProduct(null)
          }
        />
      )}
    </section>
  )
}
