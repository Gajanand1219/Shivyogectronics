// import { useEffect } from 'react'
// import { useLanguage } from '../context/LanguageContext'
// import { waLink, WA_MESSAGES } from '../utils/contact'

// export default function ProductModal({ product, onClose }) {
//   const { t, pick } = useLanguage()

//   useEffect(() => {
//     function onKey(e) {
//       if (e.key === 'Escape') onClose()
//     }
//     window.addEventListener('keydown', onKey)
//     return () => window.removeEventListener('keydown', onKey)
//   }, [onClose])

//   if (!product) return null

  
//   const name = pick(product.nameMr, product.nameEn) || product.name
//   const desc = pick(product.descMr, product.descEn) || product.desc

//   return (
//     <div
//       className="fixed inset-0 z-[90] bg-navy-900/80 flex items-end sm:items-center justify-center p-0 sm:p-4"
//       role="dialog"
//       aria-modal="true"
//       onClick={onClose}
//     >
//       <div
//         className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="relative">
//           <div className="h-56 sm:h-64 bg-gradient-to-br from-navy-50 to-royal-50 flex items-center justify-center overflow-hidden">
//             {product.image ? (
//               <img src={product.image} alt={name} className="h-full w-full object-cover" />
//             ) : (
//               <span className="text-7xl">{product.icon}</span>
//             )}
//           </div>
//           <button
//             onClick={onClose}
//             aria-label={t('modal_close')}
//             className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 text-navy-700 text-xl leading-none flex items-center justify-center shadow-md hover:bg-white transition"
//           >
//             ×
//           </button>
//         </div>

//         <div className="p-5 sm:p-6">
//           <span className="text-[11px] font-semibold uppercase tracking-wide text-royal-500">
//             {product.category}
//           </span>
//           <h3 className="mt-1 font-display font-bold text-xl text-navy-700">{name}</h3>

//           <div className="flex items-center gap-3 mt-3">
//             <span
//               className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
//                 product.available
//                   ? 'bg-green-100 text-green-700'
//                   : 'bg-amber-100 text-amber-700'
//               }`}
//             >
//               {product.available ? t('products_available') : t('products_on_request')}
//             </span>
          
//             <span className="text-sm font-semibold text-navy-600">
//               {product.price ? `₹${product.price}` : t('products_price_na')}
//             </span>
          
//             {/* Call button - Mobile only */}
           

//             <a
//               href="tel:+919552884781"
//                 aria-label="Call"
//                 className="sm:hidden ml-auto h-10 w-10 rounded-full bg-green-600 text-white flex items-center justify-center shadow-md hover:bg-green-700 transition call-float"
//               >
//                 <i className="fa fa-phone text-base"></i>
//             </a>
        
                    
//           </div>

//           {desc && (
//             <div className="mt-4">
//               <p className="text-xs font-semibold uppercase tracking-wide text-navy-400 mb-1">
//                 {t('modal_description')}
//               </p>
//               <p className="text-sm text-navy-500 font-marathi leading-relaxed">{desc}</p>
//             </div>
//           )}

//           <a
//             href={waLink(WA_MESSAGES.product(name))}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-green-500 text-white font-bold py-3 hover:brightness-105 transition"
//           >
//              <i className="fa fa-whatsapp text-2xl"></i>
//             {t('products_wa_enquiry')}
//           </a>
//         </div>
//       </div>
//     </div>
//   )
// }




import { useEffect } from 'react'

import { useLanguage } from '../context/LanguageContext'
import { waLink, WA_MESSAGES } from '../utils/contact'

export default function ProductModal({ product, onClose }) {
  const { t, pick } = useLanguage()

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKey)

    // Prevent background scrolling while modal is open
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!product) return null

  const name = pick(product.nameMr, product.nameEn) || product.name
  const desc = pick(product.descMr, product.descEn) || product.desc

  return (
    <div
      className="
        fixed inset-0 z-[90]
        bg-slate-950/80
        backdrop-blur-sm
        flex items-end sm:items-center justify-center
        p-0 sm:p-4
      "
      role="dialog"
      aria-modal="true"
      aria-label={name}
      onClick={onClose}
    >
      <div
        className="
          relative
          w-full
          sm:max-w-xl
          bg-white
          rounded-t-[28px]
          sm:rounded-[28px]
          shadow-[0_20px_80px_rgba(0,0,0,0.35)]
          overflow-hidden
          max-h-[94vh]
          sm:max-h-[90vh]
          flex flex-col
          animate-[modalUp_.25s_ease-out]
        "
        onClick={(e) => e.stopPropagation()}
      >

        {/* =========================
            MOBILE DRAG HANDLE
        ========================== */}
        <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 z-20">
          <div className="w-12 h-1.5 rounded-full bg-white/80 shadow-sm" />
        </div>

        {/* =========================
            IMAGE SECTION
        ========================== */}
        <div className="relative shrink-0">

          <div
            className="
              h-[270px]
              sm:h-[330px]
              w-full
              bg-gradient-to-br
              from-slate-50
              via-blue-50
              to-indigo-100
              flex items-center justify-center
              overflow-hidden
            "
          >

            {product.image ? (
              <img
                src={product.image}
                alt={name}
                className="
                  w-full
                  h-full
                  object-contain
                  p-3
                  sm:p-5
                  drop-shadow-xl
                "
              />
            ) : (
              <div
                className="
                  h-32
                  w-32
                  sm:h-40
                  sm:w-40
                  rounded-[32px]
                  bg-white/80
                  backdrop-blur
                  shadow-xl
                  flex items-center justify-center
                  border border-white
                "
              >
                <span className="text-7xl sm:text-8xl">
                  {product.icon || '📦'}
                </span>
              </div>
            )}
          </div>

          {/* Image bottom gradient */}
          <div
            className="
              absolute
              bottom-0
              left-0
              right-0
              h-24
              bg-gradient-to-t
              from-black/30
              to-transparent
              pointer-events-none
            "
          />

          {/* =========================
              CLOSE BUTTON
          ========================== */}
          <button
            onClick={onClose}
            aria-label={t('modal_close')}
            className="
              absolute
              top-4
              right-4
              h-11
              w-11
              rounded-full
              bg-white/95
              backdrop-blur
              text-slate-800
              text-2xl
              leading-none
              flex items-center justify-center
              shadow-lg
              border border-white
              hover:bg-white
              active:scale-90
              transition-all
              z-20
            "
          >
            ×
          </button>

          {/* =========================
              CATEGORY OVER IMAGE
          ========================== */}
          {product.category && (
            <div className="absolute bottom-4 left-4 z-10">
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  px-3
                  py-1.5
                  rounded-full
                  bg-white/90
                  backdrop-blur
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-wide
                  text-indigo-700
                  shadow-md
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                {product.category}
              </span>
            </div>
          )}

        </div>

        {/* =========================
            SCROLLABLE CONTENT
        ========================== */}
        <div className="overflow-y-auto overscroll-contain">

          <div className="px-5 pt-5 pb-28 sm:px-7 sm:pt-6 sm:pb-8">

            {/* =========================
                PRODUCT NAME
            ========================== */}
            <div>
              <h3
                className="
                  font-display
                  font-extrabold
                  text-[23px]
                  sm:text-2xl
                  leading-tight
                  text-slate-800
                "
              >
                {name}
              </h3>

              {/* Small divider */}
              <div className="mt-3 h-1 w-12 rounded-full bg-indigo-500" />
            </div>

            {/* =========================
                STATUS + PRICE
            ========================== */}
            <div className="mt-5 grid grid-cols-2 gap-3">

              {/* Availability */}
              <div
                className="
                  rounded-2xl
                  border border-slate-100
                  bg-slate-50
                  px-3.5
                  py-3
                "
              >
                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  Status
                </p>

                <div className="mt-1.5 flex items-center gap-2">

                  <span
                    className={`
                      h-2.5
                      w-2.5
                      rounded-full
                      ${
                        product.available
                          ? 'bg-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.12)]'
                          : 'bg-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.12)]'
                      }
                    `}
                  />

                  <span
                    className={`
                      text-xs
                      font-bold
                      ${
                        product.available
                          ? 'text-green-700'
                          : 'text-amber-700'
                      }
                    `}
                  >
                    {product.available
                      ? t('products_available')
                      : t('products_on_request')}
                  </span>

                </div>
              </div>

              {/* Price */}
              <div
                className="
                  rounded-2xl
                  border border-indigo-100
                  bg-indigo-50
                  px-3.5
                  py-3
                "
              >
                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-indigo-400
                  "
                >
                  Price
                </p>

                <p
                  className="
                    mt-0.5
                    text-lg
                    font-extrabold
                    text-indigo-700
                    truncate
                  "
                >
                  {product.price
                    ? `₹${product.price}`
                    : t('products_price_na')}
                </p>
              </div>

            </div>

            {/* =========================
                DESCRIPTION
            ========================== */}
            {desc && (
              <div className="mt-6">

                <div className="flex items-center gap-2 mb-2.5">

                  <div
                    className="
                      h-7
                      w-7
                      rounded-lg
                      bg-indigo-50
                      text-indigo-600
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <i className="fa fa-info text-xs" />
                  </div>

                  <p
                    className="
                      text-xs
                      font-extrabold
                      uppercase
                      tracking-wider
                      text-slate-500
                    "
                  >
                    {t('modal_description')}
                  </p>

                </div>

                <div
                  className="
                    rounded-2xl
                    bg-slate-50
                    border border-slate-100
                    p-4
                  "
                >
                  <p
                    className="
                      text-sm
                      text-slate-600
                      font-marathi
                      leading-7
                    "
                  >
                    {desc}
                  </p>
                </div>

              </div>
            )}

          </div>

        </div>

        {/* =========================
            MOBILE ACTION BAR
        ========================== */}
        <div
          className="
            sm:hidden
            absolute
            bottom-0
            left-0
            right-0
            z-30
            bg-white/95
            backdrop-blur-xl
            border-t
            border-slate-100
            px-4
            pt-3
            pb-[calc(12px+env(safe-area-inset-bottom))]
            shadow-[0_-10px_30px_rgba(0,0,0,0.08)]
          "
        >

          <div className="flex items-center gap-3">

            {/* Call */}
            <a
              href="tel:+919552884781"
              aria-label="Call"
              className="
                shrink-0
                h-12
                w-12
                rounded-2xl
                bg-green-50
                text-green-600
                border border-green-100
                flex items-center justify-center
                shadow-sm
                active:scale-95
                transition-all
              "
            >
              <i className="fa fa-phone text-lg" />
            </a>

            {/* WhatsApp */}
            <a
              href={waLink(WA_MESSAGES.product(name))}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex-1
                h-12
                rounded-2xl
                bg-gradient-to-r
                from-green-500
                to-emerald-500
                text-white
                font-extrabold
                flex
                items-center
                justify-center
                gap-2
                shadow-lg
                shadow-green-500/20
                active:scale-[0.98]
                transition-all
              "
            >
              <i className="fa fa-whatsapp text-xl" />
              <span>{t('products_wa_enquiry')}</span>
            </a>

          </div>

        </div>

        {/* =========================
            DESKTOP ACTION
        ========================== */}
        <div
          className="
            hidden
            sm:block
            px-7
            pb-7
          "
        >

          <div className="flex gap-3">

            <a
              href="tel:+919552884781"
              className="
                h-12
                px-5
                rounded-full
                border
                border-green-200
                bg-green-50
                text-green-700
                font-bold
                flex items-center
                justify-center
                gap-2
                hover:bg-green-100
                transition
              "
            >
              <i className="fa fa-phone" />
              Call
            </a>

            <a
              href={waLink(WA_MESSAGES.product(name))}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex-1
                h-12
                rounded-full
                bg-green-500
                text-white
                font-bold
                flex
                items-center
                justify-center
                gap-2
                shadow-lg
                shadow-green-500/20
                hover:bg-green-600
                hover:shadow-xl
                transition-all
              "
            >
              <i className="fa fa-whatsapp text-xl" />
              {t('products_wa_enquiry')}
            </a>

          </div>

        </div>

      </div>

      {/* =========================
          MODAL ANIMATION
      ========================== */}
      <style>{`
        @keyframes modalUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (min-width: 640px) {
          @keyframes modalUp {
            from {
              opacity: 0;
              transform: scale(0.96) translateY(10px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        }
      `}</style>

    </div>
  )
}
