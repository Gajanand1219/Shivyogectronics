import { useEffect, useState } from 'react'
import {
  trackReviewClick,
  trackReviewPopupShown,
  trackReviewPopupClosed,
} from '../utils/analytics'

const REVIEW_URL =
  'https://g.page/r/CQh8LMgy6ldvEBE/review'

export default function ReviewPopup() {
  const [open, setOpen] = useState(false)
  const [activeStar, setActiveStar] = useState(0)
  const [reviewing, setReviewing] = useState(false)

  // =========================================================
  // OPEN POPUP AFTER 9 SECONDS
  // =========================================================
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(
      'shivyog_review_popup'
    )

    if (alreadyShown) return

    const timer = setTimeout(() => {
      setOpen(true)
      sessionStorage.setItem('shivyog_review_popup', 'true')
      trackReviewPopupShown()
    }, 9000)

    return () => clearTimeout(timer)
  }, [])

  // =========================================================
  // STAR ANIMATION
  // =========================================================
  useEffect(() => {
    if (!open) return

    setActiveStar(0)
    const interval = setInterval(() => {
      setActiveStar((prev) => {
        if (prev >= 5) return 0
        return prev + 1
      })
    }, 600)

    return () => clearInterval(interval)
  }, [open])

  // =========================================================
  // CLOSE
  // =========================================================
  const closePopup = () => {
    trackReviewPopupClosed()
    setOpen(false)
  }

  // =========================================================
  // REVIEW BUTTON
  // =========================================================
  const handleReview = () => {
    if (reviewing) return

    setReviewing(true)
    trackReviewClick('review_popup')

    setTimeout(() => {
      window.open(REVIEW_URL, '_blank', 'noopener,noreferrer')
      setReviewing(false)
      setOpen(false)
    }, 450)
  }

  if (!open) return null

  return (
    <>
      <div
        className="
          fixed inset-0 z-[200]
          flex items-end sm:items-center justify-center
          bg-navy-900/60 backdrop-blur-md
          px-3 py-4 sm:px-4
          animate-fadeIn
        "
        onClick={closePopup}
      >
        {/* =====================================================
            POPUP
        ====================================================== */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="
            relative w-full max-w-sm sm:max-w-md
            max-h-[92vh] overflow-y-auto
            rounded-[28px] bg-white
            shadow-[0_25px_90px_rgba(0,0,0,0.40)]
            border border-white/70
            animate-popupEnter
            overscroll-contain
          "
        >
          {/* =====================================================
              BACKGROUND GLOW
          ====================================================== */}
          <div
            className="
              pointer-events-none absolute -top-24 -right-24
              h-56 w-56 rounded-full bg-yellow-300/30 blur-3xl
              animate-glow1
            "
          />

          <div
            className="
              pointer-events-none absolute -bottom-24 -left-24
              h-56 w-56 rounded-full bg-emerald-300/25 blur-3xl
              animate-glow2
            "
          />

          {/* =====================================================
              CLOSE BUTTON
          ====================================================== */}
          <button
            type="button"
            onClick={closePopup}
            aria-label="Close"
            className="
              absolute right-3 top-3 z-50
              flex h-9 w-9 items-center justify-center
              rounded-full bg-white/95 text-navy-700
              border border-gray-200 shadow-lg
              transition-all duration-300
              hover:bg-navy-800 hover:text-white hover:rotate-90 hover:scale-110
              active:scale-75 active:rotate-90
              touch-manipulation
              animate-closePulse
            "
          >
            <span className="text-xl leading-none">×</span>
          </button>

          {/* =====================================================
              TOP SECTION
          ====================================================== */}
          <div
            className="
              relative overflow-hidden
              px-4 pt-7 pb-4 text-center
              bg-gradient-to-br from-amber-50 via-white to-emerald-50
            "
          >
            {/* PARTICLES */}
            <span className="pointer-events-none absolute left-6 top-7 h-2 w-2 rounded-full bg-yellow-400 animate-particle1" />
            <span className="pointer-events-none absolute right-8 top-16 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-particle2" />
            <span className="pointer-events-none absolute bottom-6 left-10 h-1.5 w-1.5 rounded-full bg-orange-400 animate-particle3" />

            {/* =================================================
                MAIN STAR
            ================================================== */}
            <div className="relative mx-auto h-[78px] w-[78px] animate-iconEnter">
              {/* OUTER RING */}
              <div className="absolute inset-0 rounded-full border-[3px] border-dashed border-amber-300 animate-spin-slow" />

              {/* SECOND RING */}
              <div className="absolute inset-[6px] rounded-full border border-yellow-200 animate-spin-reverse" />

              {/* GLOW */}
              <div className="absolute inset-2 rounded-full bg-yellow-300/30 blur-xl animate-starGlow" />

              {/* STAR */}
              <div className="absolute inset-[10px] flex items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-400 shadow-xl shadow-amber-300/50 animate-starFloat">
                <span className="text-4xl drop-shadow-md animate-starRotate">⭐</span>
              </div>

              {/* ORBIT DOT */}
              <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-orange-400 shadow-md animate-orbit" />
            </div>

            {/* =================================================
                FIVE STARS
            ================================================== */}
            <div className="mt-4 flex justify-center gap-1 animate-starsEnter">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`
                    text-2xl transition-all duration-500
                    ${
                      activeStar >= star
                        ? 'text-yellow-400 scale-110 drop-shadow-[0_0_7px_rgba(250,204,21,0.70)]'
                        : 'text-gray-200 scale-90'
                    }
                  `}
                >
                  ★
                </span>
              ))}
            </div>

            {/* =================================================
                BADGE
            ================================================== */}
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-amber-700 shadow-sm animate-badgePulse">
              <span className="animate-pulse">✨</span>
              Your Feedback Matters
            </div>

            {/* =================================================
                TITLE
            ================================================== */}
            <h2 className="mt-3 text-lg sm:text-xl font-bold leading-tight text-navy-800 animate-textUp">
              Share Your Experience
            </h2>

            <p className="mt-1.5 px-3 text-[11px] sm:text-xs leading-relaxed text-navy-500 animate-textUpDelay">
              तुमचा अनुभव share करा ❤️
              <br />
              एक छोटासा Review आम्हाला खूप मदत करतो.
            </p>
          </div>

          {/* =====================================================
              REVIEW CARD
          ====================================================== */}
          <div className="relative px-3 pt-3 animate-cardUp">
            <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-amber-50/60 to-emerald-50/60 p-3.5 shadow-sm">
              {/* SHINE */}
              <div className="pointer-events-none absolute top-0 -left-[100%] h-full w-[60%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shine" />

              {/* GOOGLE ICON */}
              <div className="relative flex items-center justify-center gap-3 animate-googleEnter">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-gray-100 shadow-md animate-googleFloat">
                  <svg className="h-6 w-6" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                </div>

                <div className="text-left">
                  <p className="text-xs font-bold text-navy-700">Google Review</p>
                  <p className="text-[10px] text-navy-400">Takes less than a minute ⭐</p>
                </div>
              </div>

              {/* =================================================
                  REVIEW BUTTON
              ================================================== */}
              <button
                type="button"
                onClick={handleReview}
                disabled={reviewing}
                className={`
                  relative group overflow-hidden mt-3 w-full
                  flex items-center justify-center gap-2
                  rounded-xl px-4 py-3.5
                  font-bold text-xs text-navy-800
                  shadow-lg transition-all duration-300
                  touch-manipulation active:scale-[0.94] active:shadow-md
                  ${
                    reviewing
                      ? 'cursor-wait bg-yellow-300'
                      : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:-translate-y-1 hover:shadow-xl animate-buttonPulse'
                  }
                `}
              >
                {!reviewing && (
                  <span className="pointer-events-none absolute top-0 -left-[80%] h-full w-[45%] skew-x-[-25deg] bg-white/50 animate-buttonShine" />
                )}

                {reviewing ? (
                  <>
                    <span className="text-base animate-spin">⏳</span>
                    <span className="relative">Opening Review...</span>
                  </>
                ) : (
                  <>
                    <span className="relative text-base animate-buttonStar">⭐</span>
                    <span className="relative">Review Now</span>
                    <span className="relative text-base animate-arrow">→</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* =====================================================
              FOOTER
          ====================================================== */}
          <div className="relative px-4 pt-3 pb-4 text-center animate-footerUp">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 animate-feedbackPulse">
              <span className="text-xs animate-bounce">❤️</span>
              <span className="text-[9px] font-semibold text-emerald-700">
                Your feedback helps us grow
              </span>
            </div>

            <p className="mt-2 text-[8px] tracking-widest text-navy-400">
              SHIVYOG ELECTRICAL &amp; ELECTRONICS
            </p>
          </div>

          {/* =====================================================
              BOTTOM ACCENT
          ====================================================== */}
          <div className="relative h-1 overflow-hidden bg-gradient-to-r from-amber-400 via-rose-400 to-emerald-500">
            <div className="absolute top-0 -left-[30%] h-full w-[30%] bg-white/70 blur-sm animate-accent" />
          </div>
        </div>
      </div>

      {/* =======================================================
          ANIMATIONS
      ======================================================== */}
      <style>{`
        /* =====================================================
           FADE IN
        ====================================================== */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.35s ease-out forwards;
        }

        /* =====================================================
           POPUP ENTRY
        ====================================================== */
        @keyframes popupEnter {
          0% {
            opacity: 0;
            transform: translateY(120px) scale(0.86) rotateX(8deg);
          }
          45% {
            opacity: 1;
            transform: translateY(-12px) scale(1.025) rotateX(0deg);
          }
          70% {
            transform: translateY(4px) scale(0.99);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-popupEnter {
          animation: popupEnter 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* =====================================================
           ICON ENTRY
        ====================================================== */
        @keyframes iconEnter {
          0% {
            opacity: 0;
            transform: scale(0.35) rotate(-35deg);
          }
          65% {
            opacity: 1;
            transform: scale(1.12) rotate(8deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }
        .animate-iconEnter {
          animation: iconEnter 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* =====================================================
           TEXT
        ====================================================== */
        @keyframes textUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-textUp {
          animation: textUp 0.7s ease-out forwards;
        }
        .animate-textUpDelay {
          animation: textUp 0.9s ease-out forwards;
        }

        @keyframes cardUp {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-cardUp {
          animation: cardUp 0.7s ease-out forwards;
        }

        @keyframes footerUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-footerUp {
          animation: footerUp 1s ease-out forwards;
        }

        /* =====================================================
           ROTATING RINGS
        ====================================================== */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 7s linear infinite;
        }

        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 5s linear infinite;
        }

        /* =====================================================
           STAR
        ====================================================== */
        @keyframes starFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.07); }
        }
        .animate-starFloat {
          animation: starFloat 2s ease-in-out infinite;
        }

        @keyframes starRotate {
          0%, 100% { transform: rotate(-8deg) scale(1); }
          50% { transform: rotate(8deg) scale(1.12); }
        }
        .animate-starRotate {
          animation: starRotate 3s ease-in-out infinite;
        }

        @keyframes starGlow {
          0%, 100% { opacity: 0.3; transform: scale(0.88); }
          50% { opacity: 0.85; transform: scale(1.18); }
        }
        .animate-starGlow {
          animation: starGlow 1.8s ease-in-out infinite;
        }

        /* =====================================================
           ORBIT
        ====================================================== */
        @keyframes orbit {
          0% { transform: translateX(-50%) rotate(0deg) translateY(-34px); }
          25% { transform: translateX(-50%) rotate(90deg) translateY(-34px); }
          50% { transform: translateX(-50%) rotate(180deg) translateY(-34px); }
          75% { transform: translateX(-50%) rotate(270deg) translateY(-34px); }
          100% { transform: translateX(-50%) rotate(360deg) translateY(-34px); }
        }
        .animate-orbit {
          animation: orbit 3s linear infinite;
        }

        /* =====================================================
           GLOW
        ====================================================== */
        @keyframes glow1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-25px, 25px) scale(1.15); }
        }
        .animate-glow1 {
          animation: glow1 5s ease-in-out infinite;
        }

        @keyframes glow2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(25px, -25px) scale(1.15); }
        }
        .animate-glow2 {
          animation: glow2 6s ease-in-out infinite;
        }

        /* =====================================================
           PARTICLES
        ====================================================== */
        @keyframes particle1 {
          0%, 100% { transform: translate(0, 0) scale(0.7); opacity: 0.3; }
          50% { transform: translate(14px, 16px) scale(1.3); opacity: 1; }
        }
        .animate-particle1 {
          animation: particle1 3s ease-in-out infinite;
        }

        @keyframes particle2 {
          0%, 100% { transform: translate(0, 0) scale(0.7); opacity: 0.3; }
          50% { transform: translate(-12px, 15px) scale(1.3); opacity: 1; }
        }
        .animate-particle2 {
          animation: particle2 2.5s ease-in-out infinite;
        }

        @keyframes particle3 {
          0%, 100% { transform: translate(0, 0) scale(0.7); opacity: 0.3; }
          50% { transform: translate(16px, -12px) scale(1.3); opacity: 1; }
        }
        .animate-particle3 {
          animation: particle3 3.5s ease-in-out infinite;
        }

        /* =====================================================
           CLOSE BUTTON
        ====================================================== */
        @keyframes closePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(15, 23, 42, 0.08); }
          50% { box-shadow: 0 0 0 6px rgba(15, 23, 42, 0.05); }
        }
        .animate-closePulse {
          animation: closePulse 2.5s ease-in-out infinite;
        }

        /* =====================================================
           BADGE
        ====================================================== */
        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        .animate-badgePulse {
          animation: badgePulse 2s ease-in-out infinite;
        }

        /* =====================================================
           GOOGLE ICON
        ====================================================== */
        @keyframes googleEnter {
          from { opacity: 0; transform: translateY(15px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-googleEnter {
          animation: googleEnter 0.8s ease-out forwards;
        }

        @keyframes googleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-googleFloat {
          animation: googleFloat 2.5s ease-in-out infinite;
        }

        /* =====================================================
           SHINE
        ====================================================== */
        @keyframes shine {
          0% { left: -100%; }
          45%, 100% { left: 130%; }
        }
        .animate-shine {
          animation: shine 4s ease-in-out infinite;
        }

        @keyframes buttonShine {
          0% { left: -80%; }
          55%, 100% { left: 130%; }
        }
        .animate-buttonShine {
          animation: buttonShine 2.5s ease-in-out infinite;
        }

        /* =====================================================
           BUTTON
        ====================================================== */
        @keyframes buttonPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.015); }
        }
        .animate-buttonPulse {
          animation: buttonPulse 2.5s ease-in-out infinite;
        }

        @keyframes buttonStar {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.3) rotate(15deg); }
        }
        .animate-buttonStar {
          animation: buttonStar 1.4s ease-in-out infinite;
        }

        @keyframes arrow {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(7px); }
        }
        .animate-arrow {
          animation: arrow 1s ease-in-out infinite;
        }

        /* =====================================================
           FOOTER
        ====================================================== */
        @keyframes feedbackPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        .animate-feedbackPulse {
          animation: feedbackPulse 2.5s ease-in-out infinite;
        }

        /* =====================================================
           STARS ENTER
        ====================================================== */
        @keyframes starsEnter {
          from { opacity: 0; transform: scale(0.8) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-starsEnter {
          animation: starsEnter 0.7s ease-out forwards;
        }

        /* =====================================================
           BOTTOM ACCENT
        ====================================================== */
        @keyframes accent {
          from { left: -30%; }
          to { left: 130%; }
        }
        .animate-accent {
          animation: accent 2s linear infinite;
        }

        /* =====================================================
           MOBILE OPTIMIZATION
        ====================================================== */
        @media (max-width: 640px) {
          * {
            -webkit-tap-highlight-color: transparent;
          }
          button, a {
            touch-action: manipulation;
          }
        }

        /* =====================================================
           REDUCED MOTION
        ====================================================== */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  )
}
