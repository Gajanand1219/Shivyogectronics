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
  const [messageIndex, setMessageIndex] = useState(0)
  const [burst, setBurst] = useState(false)

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

      sessionStorage.setItem(
        'shivyog_review_popup',
        'true'
      )

      trackReviewPopupShown()
    }, 9000)

    return () => clearTimeout(timer)
  }, [])

  // =========================================================
  // DYNAMIC STAR ANIMATION
  // =========================================================
  useEffect(() => {
    if (!open) return

    setActiveStar(0)

    let current = 0

    const interval = setInterval(() => {
      current += 1

      if (current > 5) {
        current = 0
      }

      setActiveStar(current)
    }, 420)

    return () => clearInterval(interval)
  }, [open])

  // =========================================================
  // DYNAMIC MESSAGE
  // =========================================================
  useEffect(() => {
    if (!open) return

    const messages = [
      'तुमचा अनुभव share करा ❤️',
      'तुमचा छोटासा Review आम्हाला खूप मदत करतो.',
      'Your feedback helps us grow ✨',
      'It takes less than a minute ⭐',
    ]

    let index = 0

    const interval = setInterval(() => {
      index = (index + 1) % messages.length
      setMessageIndex(index)
    }, 2200)

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
    setBurst(true)

    trackReviewClick('review_popup')

    setTimeout(() => {
      window.open(
        REVIEW_URL,
        '_blank',
        'noopener,noreferrer'
      )

      setReviewing(false)
      setOpen(false)
    }, 600)

    setTimeout(() => {
      setBurst(false)
    }, 900)
  }

  if (!open) return null

  const messages = [
    'तुमचा अनुभव share करा ❤️',
    'तुमचा छोटासा Review आम्हाला खूप मदत करतो.',
    'Your feedback helps us grow ✨',
    'It takes less than a minute ⭐',
  ]

  return (
    <>
      {/* =====================================================
          BACKDROP
      ====================================================== */}
      <div
        className="
          fixed inset-0 z-[9999]
          flex items-center justify-center
          px-3
          py-3
          bg-slate-950/65
          backdrop-blur-[8px]
          animate-reviewFade
        "
        onClick={closePopup}
      >
        {/* =====================================================
            MAIN MOBILE CARD
        ====================================================== */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="
            relative
            w-full
            max-w-[370px]
            overflow-hidden
            rounded-[30px]
            bg-white
            shadow-[0_30px_100px_rgba(0,0,0,0.45)]
            border border-white/80
            animate-reviewCard
          "
        >

          {/* =====================================================
              BACKGROUND BLOBS
          ====================================================== */}

          <div
            className="
              absolute
              -top-20
              -right-20
              h-44
              w-44
              rounded-full
              bg-yellow-300/35
              blur-3xl
              animate-blobOne
            "
          />

          <div
            className="
              absolute
              -bottom-24
              -left-20
              h-48
              w-48
              rounded-full
              bg-emerald-300/30
              blur-3xl
              animate-blobTwo
            "
          />

          {/* =====================================================
              PARTICLES
          ====================================================== */}

          <span className="
            absolute left-[8%] top-[12%]
            h-2 w-2 rounded-full
            bg-yellow-400
            animate-particleA
          " />

          <span className="
            absolute right-[12%] top-[25%]
            h-1.5 w-1.5 rounded-full
            bg-emerald-400
            animate-particleB
          " />

          <span className="
            absolute left-[15%] top-[42%]
            h-1.5 w-1.5 rounded-full
            bg-orange-400
            animate-particleC
          " />

          <span className="
            absolute right-[18%] bottom-[25%]
            h-2 w-2 rounded-full
            bg-yellow-300
            animate-particleD
          " />

          {/* =====================================================
              CLOSE BUTTON
          ====================================================== */}

          <button
            type="button"
            onClick={closePopup}
            aria-label="Close review popup"
            className="
              absolute
              right-3
              top-3
              z-50
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-white/90
              backdrop-blur-md
              border
              border-slate-200
              text-slate-600
              shadow-md
              transition-all
              duration-300
              hover:rotate-90
              hover:scale-110
              hover:bg-slate-900
              hover:text-white
              active:scale-75
            "
          >
            <span className="text-xl leading-none">
              ×
            </span>
          </button>

          {/* =====================================================
              TOP HERO
          ====================================================== */}

          <div
            className="
              relative
              px-5
              pt-6
              pb-4
              text-center
              bg-gradient-to-br
              from-amber-50
              via-white
              to-emerald-50
            "
          >

            {/* MINI BADGE */}

            <div
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-amber-200
                bg-white/80
                px-3
                py-1
                shadow-sm
                animate-badge
              "
            >
              <span className="animate-sparkle">
                ✨
              </span>

              <span
                className="
                  text-[9px]
                  font-extrabold
                  uppercase
                  tracking-[0.16em]
                  text-amber-700
                "
              >
                Your Feedback Matters
              </span>
            </div>

            {/* =================================================
                MAIN STAR ICON
            ================================================== */}

            <div
              className="
                relative
                mx-auto
                mt-3
                h-[82px]
                w-[82px]
                animate-starEntrance
              "
            >

              {/* Outer rotating ring */}

              <div
                className="
                  absolute
                  inset-0
                  rounded-full
                  border-[2px]
                  border-dashed
                  border-amber-300
                  animate-ring
                "
              />

              {/* Inner rotating ring */}

              <div
                className="
                  absolute
                  inset-[7px]
                  rounded-full
                  border
                  border-yellow-200
                  animate-ringReverse
                "
              />

              {/* Glow */}

              <div
                className="
                  absolute
                  inset-[12px]
                  rounded-full
                  bg-yellow-300/50
                  blur-xl
                  animate-starGlow
                "
              />

              {/* Star */}

              <div
                className="
                  absolute
                  inset-[12px]
                  flex
                  items-center
                  justify-center
                  rounded-full
                  bg-gradient-to-br
                  from-amber-300
                  via-yellow-400
                  to-orange-400
                  shadow-[0_10px_30px_rgba(245,158,11,0.45)]
                  animate-starFloat
                "
              >
                <span
                  className="
                    text-[38px]
                    drop-shadow-lg
                    animate-star
                  "
                >
                  ⭐
                </span>
              </div>

              {/* Orbit dot */}

              <span
                className="
                  absolute
                  left-1/2
                  top-0
                  h-2.5
                  w-2.5
                  -translate-x-1/2
                  rounded-full
                  bg-orange-400
                  shadow-lg
                  animate-orbit
                "
              />
            </div>

            {/* =================================================
                FIVE STARS
            ================================================== */}

            <div
              className="
                mt-2
                flex
                justify-center
                gap-1
              "
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`
                    inline-block
                    text-[22px]
                    transition-all
                    duration-300
                    ${
                      activeStar >= star
                        ? `
                          scale-110
                          text-yellow-400
                          drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]
                        `
                        : `
                          scale-90
                          text-slate-200
                        `
                    }
                  `}
                >
                  ★
                </span>
              ))}
            </div>

            {/* =================================================
                TITLE
            ================================================== */}

            <h2
              className="
                mt-2
                text-[20px]
                font-extrabold
                leading-tight
                tracking-tight
                text-slate-800
                animate-title
              "
            >
              Share Your Experience
            </h2>

            {/* =================================================
                DYNAMIC MESSAGE
            ================================================== */}

            <div
              key={messageIndex}
              className="
                mt-1.5
                min-h-[34px]
                px-5
                text-[11px]
                font-medium
                leading-relaxed
                text-slate-500
                animate-message
              "
            >
              {messages[messageIndex]}
            </div>
          </div>

          {/* =====================================================
              REVIEW AREA
          ====================================================== */}

          <div className="relative px-4 pb-3">

            <div
              className="
                relative
                overflow-hidden
                rounded-[22px]
                border
                border-slate-100
                bg-gradient-to-br
                from-white
                via-amber-50/50
                to-emerald-50/50
                p-3.5
                shadow-[0_8px_30px_rgba(15,23,42,0.07)]
                animate-reviewArea
              "
            >

              {/* Moving shine */}

              <div
                className="
                  pointer-events-none
                  absolute
                  top-0
                  -left-[100%]
                  h-full
                  w-[55%]
                  skew-x-[-20deg]
                  bg-gradient-to-r
                  from-transparent
                  via-white/80
                  to-transparent
                  animate-shine
                "
              />

              {/* =================================================
                  GOOGLE HEADER
              ================================================== */}

              <div
                className="
                  relative
                  flex
                  items-center
                  gap-3
                "
              >

                {/* Google icon */}

                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-[13px]
                    bg-white
                    border
                    border-slate-100
                    shadow-md
                    animate-googleFloat
                  "
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

                <div className="min-w-0 text-left">
                  <p
                    className="
                      text-[13px]
                      font-extrabold
                      text-slate-800
                    "
                  >
                    Google Review
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[10px]
                      font-medium
                      text-slate-400
                    "
                  >
                    Takes less than a minute ⭐
                  </p>
                </div>

                {/* Rating */}

                <div
                  className="
                    ml-auto
                    flex
                    items-center
                    gap-0.5
                    rounded-full
                    bg-yellow-50
                    px-2
                    py-1
                    border
                    border-yellow-100
                  "
                >
                  <span className="text-[11px]">
                    ★
                  </span>

                  <span
                    className="
                      text-[10px]
                      font-bold
                      text-yellow-700
                    "
                  >
                    5.0
                  </span>
                </div>
              </div>

              {/* =================================================
                  REVIEW BUTTON
              ================================================== */}

              <div className="relative mt-3">

                {/* Button outer glow */}

                {!reviewing && (
                  <div
                    className="
                      absolute
                      inset-0
                      rounded-[16px]
                      bg-yellow-400/40
                      blur-md
                      animate-buttonGlow
                    "
                  />
                )}

                <button
                  type="button"
                  onClick={handleReview}
                  disabled={reviewing}
                  className={`
                    relative
                    z-10
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    overflow-hidden
                    rounded-[16px]
                    px-4
                    py-3.5
                    text-[13px]
                    font-extrabold
                    text-slate-900
                    shadow-[0_8px_25px_rgba(245,158,11,0.30)]
                    transition-all
                    duration-300
                    active:scale-[0.94]
                    ${
                      reviewing
                        ? `
                          cursor-wait
                          bg-yellow-300
                        `
                        : `
                          bg-gradient-to-r
                          from-amber-400
                          via-yellow-400
                          to-orange-400
                          animate-reviewButton
                          hover:-translate-y-1
                          hover:shadow-[0_15px_35px_rgba(245,158,11,0.4)]
                        `
                    }
                  `}
                >

                  {/* Shine */}

                  {!reviewing && (
                    <span
                      className="
                        pointer-events-none
                        absolute
                        top-0
                        -left-[70%]
                        h-full
                        w-[42%]
                        skew-x-[-25deg]
                        bg-white/55
                        animate-buttonShine
                      "
                    />
                  )}

                  {reviewing ? (
                    <>
                      <span
                        className="
                          text-base
                          animate-spin
                        "
                      >
                        ⏳
                      </span>

                      <span>
                        Opening Review...
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className="
                          relative
                          text-lg
                          animate-buttonStar
                        "
                      >
                        ⭐
                      </span>

                      <span className="relative">
                        Review Now
                      </span>

                      <span
                        className="
                          relative
                          text-lg
                          animate-arrow
                        "
                      >
                        →
                      </span>
                    </>
                  )}
                </button>

                {/* =================================================
                    CLICK BURST
                ================================================== */}

                {burst && (
                  <div className="pointer-events-none absolute inset-0 z-20">
                    <span className="burst burst1">
                      ⭐
                    </span>

                    <span className="burst burst2">
                      ✨
                    </span>

                    <span className="burst burst3">
                      ❤️
                    </span>

                    <span className="burst burst4">
                      ⭐
                    </span>

                    <span className="burst burst5">
                      ✨
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =====================================================
              FOOTER
          ====================================================== */}

          <div
            className="
              px-4
              pb-3
              text-center
              animate-footer
            "
          >
            <div
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-emerald-100
                bg-emerald-50
                px-3
                py-1.5
                shadow-sm
                animate-feedback
              "
            >
              <span className="text-[11px] animate-heart">
                ❤️
              </span>

              <span
                className="
                  text-[9px]
                  font-bold
                  text-emerald-700
                "
              >
                Your feedback helps us grow
              </span>
            </div>

            <p
              className="
                mt-2
                text-[7px]
                font-semibold
                tracking-[0.2em]
                text-slate-400
              "
            >
              SHIVYOG ELECTRICAL &amp; ELECTRONICS
            </p>
          </div>

          {/* =====================================================
              BOTTOM ANIMATED LINE
          ====================================================== */}

          <div
            className="
              relative
              h-[3px]
              overflow-hidden
              bg-gradient-to-r
              from-amber-400
              via-rose-400
              to-emerald-500
            "
          >
            <div
              className="
                absolute
                top-0
                -left-[30%]
                h-full
                w-[30%]
                bg-white/80
                blur-sm
                animate-accent
              "
            />
          </div>
        </div>
      </div>

      {/* =======================================================
          ANIMATIONS
      ======================================================== */}

      <style>{`

        /* =====================================================
           BACKDROP
        ====================================================== */

        @keyframes reviewFade {
          from {
            opacity: 0;
            backdrop-filter: blur(0px);
          }

          to {
            opacity: 1;
            backdrop-filter: blur(8px);
          }
        }

        .animate-reviewFade {
          animation: reviewFade 0.35s ease-out forwards;
        }


        /* =====================================================
           CARD ENTRY
        ====================================================== */

        @keyframes reviewCard {
          0% {
            opacity: 0;
            transform:
              translateY(80px)
              scale(0.88)
              rotateX(10deg);
          }

          60% {
            opacity: 1;
            transform:
              translateY(-8px)
              scale(1.02)
              rotateX(0deg);
          }

          80% {
            transform:
              translateY(3px)
              scale(0.995);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        .animate-reviewCard {
          animation:
            reviewCard
            0.65s
            cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
        }


        /* =====================================================
           BLOBS
        ====================================================== */

        @keyframes blobOne {
          0%,
          100% {
            transform:
              translate(0, 0)
              scale(1);
          }

          50% {
            transform:
              translate(-20px, 20px)
              scale(1.18);
          }
        }

        .animate-blobOne {
          animation:
            blobOne
            5s
            ease-in-out
            infinite;
        }


        @keyframes blobTwo {
          0%,
          100% {
            transform:
              translate(0, 0)
              scale(1);
          }

          50% {
            transform:
              translate(20px, -20px)
              scale(1.18);
          }
        }

        .animate-blobTwo {
          animation:
            blobTwo
            6s
            ease-in-out
            infinite;
        }


        /* =====================================================
           PARTICLES
        ====================================================== */

        @keyframes particleA {
          0%,
          100% {
            transform:
              translate(0, 0)
              scale(0.7);
            opacity: 0.3;
          }

          50% {
            transform:
              translate(14px, 18px)
              scale(1.4);
            opacity: 1;
          }
        }

        .animate-particleA {
          animation:
            particleA
            3s
            ease-in-out
            infinite;
        }


        @keyframes particleB {
          0%,
          100% {
            transform:
              translate(0, 0)
              scale(0.6);
            opacity: 0.25;
          }

          50% {
            transform:
              translate(-15px, 18px)
              scale(1.3);
            opacity: 1;
          }
        }

        .animate-particleB {
          animation:
            particleB
            2.5s
            ease-in-out
            infinite;
        }


        @keyframes particleC {
          0%,
          100% {
            transform:
              translate(0, 0)
              scale(0.6);
            opacity: 0.3;
          }

          50% {
            transform:
              translate(16px, -15px)
              scale(1.4);
            opacity: 1;
          }
        }

        .animate-particleC {
          animation:
            particleC
            3.5s
            ease-in-out
            infinite;
        }


        @keyframes particleD {
          0%,
          100% {
            transform:
              translate(0, 0)
              scale(0.6);
            opacity: 0.25;
          }

          50% {
            transform:
              translate(-12px, -16px)
              scale(1.4);
            opacity: 1;
          }
        }

        .animate-particleD {
          animation:
            particleD
            2.8s
            ease-in-out
            infinite;
        }


        /* =====================================================
           BADGE
        ====================================================== */

        @keyframes badge {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.04);
          }
        }

        .animate-badge {
          animation:
            badge
            2s
            ease-in-out
            infinite;
        }


        @keyframes sparkle {
          0%,
          100% {
            transform: rotate(0deg) scale(1);
          }

          50% {
            transform: rotate(15deg) scale(1.3);
          }
        }

        .animate-sparkle {
          animation:
            sparkle
            1.4s
            ease-in-out
            infinite;
        }


        /* =====================================================
           STAR ENTRANCE
        ====================================================== */

        @keyframes starEntrance {
          0% {
            opacity: 0;
            transform:
              scale(0.3)
              rotate(-30deg);
          }

          60% {
            opacity: 1;
            transform:
              scale(1.12)
              rotate(8deg);
          }

          100% {
            opacity: 1;
            transform:
              scale(1)
              rotate(0deg);
          }
        }

        .animate-starEntrance {
          animation:
            starEntrance
            0.8s
            cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
        }


        /* =====================================================
           RINGS
        ====================================================== */

        @keyframes ring {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .animate-ring {
          animation:
            ring
            7s
            linear
            infinite;
        }


        @keyframes ringReverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        .animate-ringReverse {
          animation:
            ringReverse
            5s
            linear
            infinite;
        }


        /* =====================================================
           STAR
        ====================================================== */

        @keyframes starFloat {
          0%,
          100% {
            transform:
              translateY(0)
              scale(1);
          }

          50% {
            transform:
              translateY(-5px)
              scale(1.07);
          }
        }

        .animate-starFloat {
          animation:
            starFloat
            2s
            ease-in-out
            infinite;
        }


        @keyframes star {
          0%,
          100% {
            transform:
              rotate(-8deg)
              scale(1);
          }

          50% {
            transform:
              rotate(8deg)
              scale(1.12);
          }
        }

        .animate-star {
          animation:
            star
            2.5s
            ease-in-out
            infinite;
        }


        @keyframes starGlow {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(0.85);
          }

          50% {
            opacity: 0.9;
            transform: scale(1.2);
          }
        }

        .animate-starGlow {
          animation:
            starGlow
            1.8s
            ease-in-out
            infinite;
        }


        /* =====================================================
           ORBIT
        ====================================================== */

        @keyframes orbit {
          0% {
            transform:
              translateX(-50%)
              rotate(0deg)
              translateY(-36px);
          }

          25% {
            transform:
              translateX(-50%)
              rotate(90deg)
              translateY(-36px);
          }

          50% {
            transform:
              translateX(-50%)
              rotate(180deg)
              translateY(-36px);
          }

          75% {
            transform:
              translateX(-50%)
              rotate(270deg)
              translateY(-36px);
          }

          100% {
            transform:
              translateX(-50%)
              rotate(360deg)
              translateY(-36px);
          }
        }

        .animate-orbit {
          animation:
            orbit
            3s
            linear
            infinite;
        }


        /* =====================================================
           TITLE
        ====================================================== */

        @keyframes title {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-title {
          animation:
            title
            0.7s
            ease-out
            forwards;
        }


        /* =====================================================
           DYNAMIC MESSAGE
        ====================================================== */

        @keyframes message {
          from {
            opacity: 0;
            transform:
              translateY(7px)
              scale(0.97);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        .animate-message {
          animation:
            message
            0.45s
            ease-out
            forwards;
        }


        /* =====================================================
           REVIEW AREA
        ====================================================== */

        @keyframes reviewArea {
          from {
            opacity: 0;
            transform:
              translateY(20px)
              scale(0.97);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        .animate-reviewArea {
          animation:
            reviewArea
            0.65s
            0.15s
            ease-out
            both;
        }


        /* =====================================================
           GOOGLE ICON
        ====================================================== */

        @keyframes googleFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        .animate-googleFloat {
          animation:
            googleFloat
            2.5s
            ease-in-out
            infinite;
        }


        /* =====================================================
           SHINE
        ====================================================== */

        @keyframes shine {
          0% {
            left: -100%;
          }

          45%,
          100% {
            left: 130%;
          }
        }

        .animate-shine {
          animation:
            shine
            4s
            ease-in-out
            infinite;
        }


        /* =====================================================
           BUTTON GLOW
        ====================================================== */

        @keyframes buttonGlow {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(0.98);
          }

          50% {
            opacity: 0.75;
            transform: scale(1.035);
          }
        }

        .animate-buttonGlow {
          animation:
            buttonGlow
            1.8s
            ease-in-out
            infinite;
        }


        /* =====================================================
           REVIEW BUTTON
        ====================================================== */

        @keyframes reviewButton {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.018);
          }
        }

        .animate-reviewButton {
          animation:
            reviewButton
            2s
            ease-in-out
            infinite;
        }


        /* =====================================================
           BUTTON SHINE
        ====================================================== */

        @keyframes buttonShine {
          0% {
            left: -70%;
          }

          50%,
          100% {
            left: 130%;
          }
        }

        .animate-buttonShine {
          animation:
            buttonShine
            2.2s
            ease-in-out
            infinite;
        }


        /* =====================================================
           BUTTON STAR
        ====================================================== */

        @keyframes buttonStar {
          0%,
          100% {
            transform:
              scale(1)
              rotate(0deg);
          }

          50% {
            transform:
              scale(1.3)
              rotate(12deg);
          }
        }

        .animate-buttonStar {
          animation:
            buttonStar
            1.3s
            ease-in-out
            infinite;
        }


        /* =====================================================
           ARROW
        ====================================================== */

        @keyframes arrow {
          0%,
          100% {
            transform: translateX(0);
          }

          50% {
            transform: translateX(7px);
          }
        }

        .animate-arrow {
          animation:
            arrow
            0.9s
            ease-in-out
            infinite;
        }


        /* =====================================================
           FOOTER
        ====================================================== */

        @keyframes footer {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-footer {
          animation:
            footer
            0.8s
            0.35s
            ease-out
            both;
        }


        @keyframes feedback {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.035);
          }
        }

        .animate-feedback {
          animation:
            feedback
            2.5s
            ease-in-out
            infinite;
        }


        @keyframes heart {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.3);
          }
        }

        .animate-heart {
          animation:
            heart
            1.2s
            ease-in-out
            infinite;
        }


        /* =====================================================
           BOTTOM ACCENT
        ====================================================== */

        @keyframes accent {
          from {
            left: -30%;
          }

          to {
            left: 130%;
          }
        }

        .animate-accent {
          animation:
            accent
            2s
            linear
            infinite;
        }


        /* =====================================================
           CLICK BURST
        ====================================================== */

        .burst {
          position: absolute;
          left: 50%;
          top: 50%;
          font-size: 18px;
          animation:
            burstAnimation
            0.8s
            ease-out
            forwards;
        }

        .burst1 {
          --x: -70px;
          --y: -35px;
        }

        .burst2 {
          --x: 65px;
          --y: -35px;
        }

        .burst3 {
          --x: -75px;
          --y: 20px;
        }

        .burst4 {
          --x: 75px;
          --y: 20px;
        }

        .burst5 {
          --x: 0px;
          --y: -55px;
        }

        @keyframes burstAnimation {
          0% {
            opacity: 1;
            transform:
              translate(-50%, -50%)
              scale(0.3);
          }

          100% {
            opacity: 0;
            transform:
              translate(
                calc(-50% + var(--x)),
                calc(-50% + var(--y))
              )
              scale(1.3)
              rotate(25deg);
          }
        }


        /* =====================================================
           MOBILE OPTIMIZATION
        ====================================================== */

        @media (max-width: 380px) {

          .animate-reviewCard {
            max-width: 350px;
          }

        }


        @media (max-height: 680px) {

          .animate-reviewCard {
            transform: scale(0.92);
            transform-origin: center;
          }

        }


        /* =====================================================
           TOUCH
        ====================================================== */

        button {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }


        /* =====================================================
           REDUCED MOTION
        ====================================================== */

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
    </>
  )
}
