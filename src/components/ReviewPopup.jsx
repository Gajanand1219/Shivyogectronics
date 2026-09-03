import { useEffect, useState } from 'react'

const REVIEW_URL ='https://www.google.com/maps/place/Shivyog+Electrical+and+Electronics/@19.3272886,77.1552773,17z/data=!4m8!3m7!1s0x3bd033bfc68c865b:0x6f57ea32c82c7c08!8m2!3d19.3272886!4d77.1552773!9m1!1b1!16s%2Fg%2F11yz89w4tc?entry=ttu&g_ep=EgoyMDI2MDgzMS4wIKXMDSoASAFQAw%3D%3D'
//   'https://g.page/r/CUkTq0OMoaWhECE/review'

export default function ReviewPopup() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(
      'shivyog_review_popup'
    )

    if (alreadyShown) return

    const timer = setTimeout(() => {
      setOpen(true)

      sessionStorage.setItem(
        'shivyog_review_popup',
        'true'
      )
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  const closePopup = () => {
    setOpen(false)
  }

  const handleReview = () => {
    window.open(
      REVIEW_URL,
      '_blank',
      'noopener,noreferrer'
    )

    setOpen(false)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200]
                 flex items-end justify-center
                 bg-navy-900/50
                 backdrop-blur-sm
                 px-3 pb-4 pt-6
                 animate-[fadeIn_.3s_ease]"
      onClick={closePopup}
    >
      {/* POPUP - Mobile Compact */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm
                   overflow-hidden
                   rounded-2xl
                   bg-white
                   shadow-2xl shadow-black/30
                   border border-white/30
                   animate-[slideUp_.35s_cubic-bezier(0.34,1.56,0.64,1)]"
      >
        {/* Decorative Glow - Smaller for mobile */}
        <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-amber-300/20 blur-2xl" />
        <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-rose-300/10 blur-2xl" />

        {/* CLOSE BUTTON - Smaller */}
        <button
          type="button"
          onClick={closePopup}
          aria-label="Close"
          className="absolute right-2 top-2 z-30
                     h-7 w-7 rounded-full
                     flex items-center justify-center
                     bg-white/90 text-navy-600
                     shadow-sm border border-gray-200
                     hover:bg-navy-700 hover:text-white
                     transition-all duration-300
                     text-sm"
        >
          <span className="text-xl leading-none">×</span>
        </button>

        {/* TOP SECTION - Compact */}
        <div className="relative px-4 pt-5 pb-3 text-center
                        bg-gradient-to-br from-amber-50/80 via-white to-emerald-50/60">
          
          {/* Small Icon */}
          <div className="mx-auto h-14 w-14 rounded-2xl
                          bg-gradient-to-br from-amber-100 to-yellow-200
                          shadow-md shadow-amber-200/30
                          flex items-center justify-center
                          border border-white/60">
            <span className="text-3xl drop-shadow-sm">⭐</span>
          </div>

          {/* Stars - Smaller */}
          <div className="mt-2 flex justify-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-yellow-400 text-lg">★</span>
            ))}
          </div>

          {/* Badge - Compact */}
          <div className="mt-2 inline-flex items-center gap-1.5
                          rounded-full bg-amber-100/80 border border-amber-200/60
                          px-3 py-0.5 text-[9px] font-bold text-amber-700
                          uppercase tracking-wider">
            ✨ Feedback
          </div>

          {/* Title - Smaller */}
          <h2 className="mt-2 font-bold text-base text-navy-800 leading-tight">
            Share Your Experience
          </h2>

          <p className="mt-1 text-[11px] text-navy-500 leading-relaxed px-2">
            तुमचा अनुभव share करा ❤️
            <br />
            एक छोटासा Review आम्हाला मदत करतो.
          </p>
        </div>

        {/* REVIEW CARD - Compact */}
        <div className="relative px-3 pt-3">
          <div className="rounded-2xl border border-gray-100/60
                          bg-gradient-to-br from-white via-amber-50/40 to-emerald-50/40
                          p-3 shadow-sm">
            
            {/* Google - Smaller */}
            <div className="flex items-center justify-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-white shadow-sm
                              border border-gray-100 flex items-center justify-center">
                <svg className="h-5 w-5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              </div>

              <div className="text-left">
                <p className="text-xs font-bold text-navy-700">Google Review</p>
                <p className="text-[10px] text-navy-400">Takes a minute</p>
              </div>
            </div>

            {/* REVIEW BUTTON - Compact */}
            <button
              type="button"
              onClick={handleReview}
              className="group mt-3 w-full
                         flex items-center justify-center gap-2
                         rounded-xl bg-gradient-to-r
                         from-amber-400 via-yellow-400 to-orange-400
                         px-4 py-3 text-navy-800 font-bold
                         text-xs
                         shadow-md shadow-amber-200/50
                         hover:shadow-lg hover:-translate-y-0.5
                         active:translate-y-0
                         transition-all duration-300"
            >
              <span className="text-base">⭐</span>
              Review Now
              <span className="text-base transition-transform duration-300
                               group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </div>

        {/* FOOTER - Compact */}
        <div className="relative px-4 pt-2 pb-4 text-center">
          <div className="inline-flex items-center gap-1.5
                          rounded-full bg-emerald-50/60 border border-emerald-100/60
                          px-3 py-1">
            <span className="text-xs">❤️</span>
            <span className="text-[9px] font-medium text-emerald-700">
              Your feedback matters
            </span>
          </div>

          <p className="mt-2 text-[8px] text-navy-400 tracking-wide">
            Shivyoga Electrical & Electronics
          </p>
        </div>

        {/* Bottom accent - thinner */}
        <div className="h-1 bg-gradient-to-r from-amber-400 via-rose-400 to-emerald-500" />
      </div>

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
