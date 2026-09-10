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

  // Lock body scroll while open
  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, [])

  // ESC to close
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!product) return null

  const name = pick(product.nameMr, product.nameEn) || product.name
  const desc = pick(product.descMr, product.descEn) || product.desc

  return (
    <div
      className="fixed inset-0 z-[90] bg-navy-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="
          relative w-full sm:max-w-lg bg-white
          rounded-t-3xl sm:rounded-2xl
          shadow-2xl overflow-hidden
          max-h-[92vh] sm:max-h-[90vh]
          flex flex-col
          animate-slideUp
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* ═════ IMAGE HEADER ═════ */}
        <div className="relative shrink-0">
          <div className="h-56 sm:h-64 bg-gradient-to-br from-navy-50 to-royal-50 flex items-center justify-center overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-7xl">{product.icon || '🛍️'}</span>
            )}
          </div>

          {/* Bottom fade over image */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Drag handle (mobile only) */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 h-1.5 w-12 rounded-full bg-white/70 sm:hidden" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label={t('modal_close')}
            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/95 text-navy-700 text-xl leading-none flex items-center justify-center shadow-md hover:bg-white active:scale-95 transition"
          >
            ×
          </button>
        </div>

        {/* ═════ SCROLLABLE BODY ═════ */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 pb-24 sm:pb-6">

          {/* CATEGORY  ·····  PRICE */}
          <div className="flex items-start justify-between gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-royal-500 pt-1">
              {product.category}
            </span>
            <span className="text-lg font-bold text-navy-700 whitespace-nowrap">
              {product.price ? `₹${product.price}` : t('products_price_na')}
            </span>
          </div>

          {/* PRODUCT NAME */}
          <h3 className="mt-1 font-display font-bold text-xl text-navy-700 leading-snug">
            {name}
          </h3>

          {/* AVAILABILITY + FLOATING CALL */}
          <div className="mt-3 flex items-center justify-between gap-3">
            <span
              className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                product.available
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {product.available ? t('products_available') : t('products_on_request')}
            </span>

            {/* Floating Call button (mobile only) */}
            <a
              href="tel:+919552884781"
              aria-label="Call"
              className="sm:hidden h-11 w-11 shrink-0 rounded-full bg-royal-500 text-white flex items-center justify-center shadow-lg ring-4 ring-royal-500/15 active:scale-95 transition"
            >
              <i className="fa fa-phone text-base" />
            </a>
          </div>

          {/* DESCRIPTION */}
          {desc && (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-400 mb-1">
                {t('modal_description')}
              </p>
              <p className="text-sm text-navy-500 font-marathi leading-relaxed">
                {desc}
              </p>
            </div>
          )}

          {/* DESKTOP WhatsApp button (mobile uses sticky bar below) */}
          <a
            href={waLink(WA_MESSAGES.product(name))}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex mt-6 w-full items-center justify-center gap-2 rounded-full bg-green-500 text-white font-bold py-3 hover:brightness-105 transition"
          >
            <i className="fa fa-whatsapp text-2xl" />
            {t('products_wa_enquiry')}
          </a>
        </div>

        {/* ═════ STICKY MOBILE WHATSAPP BAR ═════ */}
        <div className="sm:hidden absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-navy-100 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <a
            href={waLink(WA_MESSAGES.product(name))}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-green-500 text-white font-bold shadow-md active:scale-[0.98] transition"
          >
            <i className="fa fa-whatsapp text-xl" />
            {t('products_wa_enquiry')}
          </a>
        </div>

      </div>
    </div>
  )
}
