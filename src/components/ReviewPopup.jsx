import { useEffect, useState } from 'react'

const REVIEW_URL =
  'https://g.page/r/CQh8LMgy6ldvEBE/review'

export default function ReviewPopup() {
  const [open, setOpen] = useState(false)
  const [activeStar, setActiveStar] = useState(0)
  const [reviewing, setReviewing] = useState(false)

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

  // ⭐ One-by-one star animation
  useEffect(() => {
    if (!open) return

    setActiveStar(0)

    const interval = setInterval(() => {
      setActiveStar((prev) => {
        if (prev >= 5) return 0
        return prev + 1
      })
    }, 650)

    return () => clearInterval(interval)
  }, [open])

  const closePopup = () => {
    setOpen(false)
  }

  const handleReview = () => {
    if (reviewing) return

    setReviewing(true)

    setTimeout(() => {
      window.open(
        REVIEW_URL,
        '_blank',
        'noopener,noreferrer'
      )

      setReviewing(false)
      setOpen(false)
    }, 450)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200]
                 flex items-end justify-center
                 bg-navy-900/55
                 backdrop-blur-md
                 px-3 pb-4 pt-6
                 animate-[fadeIn_.35s_ease-out]"
      onClick={closePopup}
    >

      {/* ================= POPUP ================= */}

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm
                   overflow-hidden
                   rounded-[26px]
                   bg-white
                   shadow-[0_25px_80px_rgba(0,0,0,0.35)]
                   border border-white/60
                   animate-[popupEnter_.55s_cubic-bezier(0.22,1,0.36,1)]"
      >

        {/* ================= ANIMATED BACKGROUND GLOW ================= */}

        <div
          className="absolute -top-24 -right-24
                     h-56 w-56 rounded-full
                     bg-yellow-300/25
                     blur-3xl
                     animate-[floatGlow_5s_ease-in-out_infinite]"
        />

        <div
          className="absolute -bottom-24 -left-24
                     h-56 w-56 rounded-full
                     bg-emerald-300/20
                     blur-3xl
                     animate-[floatGlowReverse_6s_ease-in-out_infinite]"
        />

        {/* ================= CLOSE BUTTON ================= */}

        <button
          type="button"
          onClick={closePopup}
          aria-label="Close"
          className="absolute right-3 top-3 z-30
                     h-8 w-8 rounded-full
                     flex items-center justify-center
                     bg-white/95
                     text-navy-600
                     shadow-md
                     border border-gray-200
                     transition-all duration-300
                     hover:bg-navy-800
                     hover:text-white
                     hover:rotate-90
                     hover:scale-110
                     active:scale-90
                     animate-[closePulse_2.5s_ease-in-out_infinite]"
        >
          <span className="text-xl leading-none">
            ×
          </span>
        </button>

        {/* ================= TOP SECTION ================= */}

        <div
          className="relative px-4 pt-6 pb-4
                     text-center
                     bg-gradient-to-br
                     from-amber-50
                     via-white
                     to-emerald-50"
        >

          {/* Decorative circles */}

          <div
            className="absolute top-6 left-5
                       h-2 w-2 rounded-full
                       bg-yellow-400
                       animate-[particle1_3s_ease-in-out_infinite]"
          />

          <div
            className="absolute top-14 right-8
                       h-1.5 w-1.5 rounded-full
                       bg-emerald-400
                       animate-[particle2_2.5s_ease-in-out_infinite]"
          />

          <div
            className="absolute bottom-5 left-10
                       h-1.5 w-1.5 rounded-full
                       bg-orange-400
                       animate-[particle3_3.5s_ease-in-out_infinite]"
          />

          {/* ================= MAIN ROTATING STAR ================= */}

          <div className="relative mx-auto h-[76px] w-[76px]">

            {/* Outer rotating ring */}

            <div
              className="absolute inset-0 rounded-full
                         border-[3px]
                         border-dashed
                         border-amber-300
                         animate-[spinSlow_7s_linear_infinite]"
            />

            {/* Second ring */}

            <div
              className="absolute inset-[6px]
                         rounded-full
                         border
                         border-yellow-200
                         animate-[spinReverse_5s_linear_infinite]"
            />

            {/* Glow */}

            <div
              className="absolute inset-2
                         rounded-full
                         bg-yellow-300/30
                         blur-xl
                         animate-[starGlow_1.8s_ease-in-out_infinite]"
            />

            {/* Star */}

            <div
              className="absolute inset-[10px]
                         rounded-full
                         bg-gradient-to-br
                         from-amber-300
                         via-yellow-400
                         to-orange-400
                         shadow-lg
                         shadow-amber-300/50
                         flex items-center justify-center
                         animate-[starFloat_2s_ease-in-out_infinite]"
            >
              <span
                className="text-4xl
                           drop-shadow-md
                           animate-[starRotate_4s_ease-in-out_infinite]"
              >
                ⭐
              </span>
            </div>

            {/* Orbiting dot */}

            <span
              className="absolute
                         left-1/2 top-0
                         h-2.5 w-2.5
                         -translate-x-1/2
                         rounded-full
                         bg-orange-400
                         shadow-md
                         animate-[orbitDot_3s_linear_infinite]"
            />

          </div>

          {/* ================= FIVE STAR LOADER ================= */}

          <div className="mt-4 flex justify-center gap-1">

            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`
                  text-2xl
                  transition-all
                  duration-500
                  ${
                    activeStar >= star
                      ? 'text-yellow-400 scale-110 drop-shadow-[0_0_6px_rgba(250,204,21,0.65)]'
                      : 'text-gray-200 scale-90'
                  }
                `}
              >
                ★
              </span>
            ))}

          </div>

          {/* ================= BADGE ================= */}

          <div
            className="mt-3 inline-flex items-center gap-1.5
                       rounded-full
                       bg-gradient-to-r
                       from-amber-100
                       to-yellow-100
                       border border-amber-200
                       px-3 py-1
                       text-[9px]
                       font-bold
                       text-amber-700
                       uppercase
                       tracking-widest
                       shadow-sm
                       animate-[badgePulse_2s_ease-in-out_infinite]"
          >
            <span className="animate-pulse">
              ✨
            </span>

            Your Feedback Matters
          </div>

          {/* ================= TITLE ================= */}

          <h2
            className="mt-3
                       font-bold
                       text-lg
                       text-navy-800
                       leading-tight"
          >
            Share Your Experience
          </h2>

          <p
            className="mt-1.5
                       text-[11px]
                       text-navy-500
                       leading-relaxed
                       px-3"
          >
            तुमचा अनुभव share करा ❤️
            <br />
            एक छोटासा Review आम्हाला खूप मदत करतो.
          </p>

        </div>

        {/* ================= REVIEW CARD ================= */}

        <div className="relative px-3 pt-3">

          <div
            className="relative
                       overflow-hidden
                       rounded-2xl
                       border border-gray-100
                       bg-gradient-to-br
                       from-white
                       via-amber-50/50
                       to-emerald-50/50
                       p-3.5
                       shadow-sm"
          >

            {/* Moving shine */}

            <div
              className="absolute
                         top-0
                         -left-[100%]
                         h-full
                         w-[60%]
                         skew-x-[-20deg]
                         bg-gradient-to-r
                         from-transparent
                         via-white/70
                         to-transparent
                         animate-[shine_4s_ease-in-out_infinite]"
            />

            {/* Google */}

            <div
              className="relative
                         flex items-center
                         justify-center
                         gap-3"
            >

              <div
                className="h-10 w-10
                           rounded-xl
                           bg-white
                           shadow-md
                           border border-gray-100
                           flex items-center
                           justify-center
                           animate-[googleFloat_2.5s_ease-in-out_infinite]"
              >

                <svg
                  className="h-6 w-6"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />

                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />

                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />

                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>

              </div>

              <div className="text-left">

                <p className="text-xs font-bold text-navy-700">
                  Google Review
                </p>

                <p className="text-[10px] text-navy-400">
                  Takes less than a minute ⭐
                </p>

              </div>

            </div>

            {/* ================= REVIEW BUTTON ================= */}

            <button
              type="button"
              onClick={handleReview}
              disabled={reviewing}
              className={`
                relative
                group
                overflow-hidden
                mt-3
                w-full
                flex items-center
                justify-center
                gap-2
                rounded-xl
                px-4
                py-3
                font-bold
                text-xs
                text-navy-800
                shadow-lg
                transition-all
                duration-300
                ${
                  reviewing
                    ? 'bg-yellow-300 cursor-wait'
                    : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:-translate-y-1 hover:shadow-xl active:scale-[0.97]'
                }
              `}
            >

              {/* Button shine */}

              {!reviewing && (
                <span
                  className="absolute
                             top-0
                             -left-[80%]
                             h-full
                             w-[45%]
                             skew-x-[-25deg]
                             bg-white/40
                             animate-[buttonShine_2.8s_ease-in-out_infinite]"
                />
              )}

              {reviewing ? (
                <>
                  <span className="text-base animate-spin">
                    ⏳
                  </span>

                  Opening Review...

                </>
              ) : (
                <>
                  <span
                    className="relative text-base
                               animate-[buttonStar_1.5s_ease-in-out_infinite]"
                  >
                    ⭐
                  </span>

                  <span className="relative">
                    Review Now
                  </span>

                  <span
                    className="relative text-base
                               animate-[arrowMove_1s_ease-in-out_infinite]"
                  >
                    → → →
                  </span>
                </>
              )}

            </button>

          </div>

        </div>

        {/* ================= FOOTER ================= */}

        <div
          className="relative
                     px-4
                     pt-3
                     pb-4
                     text-center"
        >

          <div
            className="inline-flex
                       items-center
                       gap-1.5
                       rounded-full
                       bg-emerald-50
                       border border-emerald-100
                       px-3 py-1
                       animate-[feedbackPulse_2.5s_ease-in-out_infinite]"
          >

            <span className="text-xs animate-bounce">
              ❤️
            </span>

            <span
              className="text-[9px]
                         font-semibold
                         text-emerald-700"
            >
              Your feedback helps us grow
            </span>

          </div>

          <p
            className="mt-2
                       text-[8px]
                       text-navy-400
                       tracking-widest"
          >
            SHIVYOG ELECTRICAL &amp; ELECTRONICS
          </p>

        </div>

        {/* ================= BOTTOM ANIMATED ACCENT ================= */}

        <div
          className="relative
                     h-1
                     overflow-hidden
                     bg-gradient-to-r
                     from-amber-400
                     via-rose-400
                     to-emerald-500"
        >

          <div
            className="absolute
                       top-0
                       -left-[30%]
                       h-full
                       w-[30%]
                       bg-white/70
                       blur-sm
                       animate-[accentMove_2s_linear_infinite]"
          />

        </div>

      </div>

      {/* ================= ANIMATIONS ================= */}

      <style>{`

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes popupEnter {
          0% {
            opacity: 0;
            transform: translateY(80px) scale(.88);
          }

          60% {
            opacity: 1;
            transform: translateY(-8px) scale(1.02);
          }

          100% {
            transform: translateY(0) scale(1);
          }
        }

        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spinReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes starFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
          }

          50% {
            transform: translateY(-4px) scale(1.05);
          }
        }

        @keyframes starRotate {
          0%, 100% {
            transform: rotate(-8deg) scale(1);
          }

          50% {
            transform: rotate(8deg) scale(1.08);
          }
        }

        @keyframes starGlow {
          0%, 100% {
            opacity: .35;
            transform: scale(.9);
          }

          50% {
            opacity: .8;
            transform: scale(1.15);
          }
        }

        @keyframes orbitDot {
          0% {
            transform: translateX(-50%) rotate(0deg)
                       translateY(-34px);
          }

          25% {
            transform: translateX(-50%) rotate(90deg)
                       translateY(-34px);
          }

          50% {
            transform: translateX(-50%) rotate(180deg)
                       translateY(-34px);
          }

          75% {
            transform: translateX(-50%) rotate(270deg)
                       translateY(-34px);
          }

          100% {
            transform: translateX(-50%) rotate(360deg)
                       translateY(-34px);
          }
        }

        @keyframes closePulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(15,23,42,.08);
          }

          50% {
            box-shadow: 0 0 0 5px rgba(15,23,42,.06);
          }
        }

        @keyframes badgePulse {
          0%, 100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.04);
          }
        }

        @keyframes shine {
          0% {
            left: -100%;
          }

          45%, 100% {
            left: 130%;
          }
        }

        @keyframes buttonShine {
          0% {
            left: -80%;
          }

          55%, 100% {
            left: 130%;
          }
        }

        @keyframes buttonStar {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }

          50% {
            transform: scale(1.25) rotate(15deg);
          }
        }

        @keyframes arrowMove {
          0%, 100% {
            transform: translateX(0);
          }

          50% {
            transform: translateX(5px);
          }
        }

        @keyframes googleFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes feedbackPulse {
          0%, 100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.03);
          }
        }

        @keyframes accentMove {
          from {
            left: -30%;
          }

          to {
            left: 130%;
          }
        }

        @keyframes floatGlow {
          0%, 100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(-20px, 20px);
          }
        }

        @keyframes floatGlowReverse {
          0%, 100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(20px, -20px);
          }
        }

        @keyframes particle1 {
          0%, 100% {
            transform: translate(0, 0);
            opacity: .3;
          }

          50% {
            transform: translate(12px, 15px);
            opacity: 1;
          }
        }

        @keyframes particle2 {
          0%, 100% {
            transform: translate(0, 0);
            opacity: .3;
          }

          50% {
            transform: translate(-10px, 12px);
            opacity: 1;
          }
        }

        @keyframes particle3 {
          0%, 100% {
            transform: translate(0, 0);
            opacity: .3;
          }

          50% {
            transform: translate(15px, -10px);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

      `}</style>

    </div>
  )
}
