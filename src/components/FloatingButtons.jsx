// import { PHONE_NUMBERS, telLink, waLink, WA_MESSAGES, MAPS_LINK } from '../utils/contact'
// import { useLanguage } from '../context/LanguageContext'

// export default function FloatingButtons() {
//   const { t } = useLanguage()
//   return (
//     <>
//       {/* Desktop / tablet floating buttons */}
//       <div className="hidden md:flex flex-col gap-3 fixed bottom-6 right-6 z-40">
//         <a
//           href={waLink(WA_MESSAGES.general)}
//           target="_blank"
//           rel="noopener noreferrer"
//           aria-label="WhatsApp वर चौकशी करा"
//           className="h-14 w-14 rounded-full bg-green-500 text-white flex items-center justify-center text-2xl shadow-xl hover:scale-110 transition-transform animate-pulseGlow"
//         >
//                     <i className="fa fa-whatsapp text-2xl"></i>

//         </a>
//         <a
//           href={telLink(PHONE_NUMBERS[0])}
//           aria-label="कॉल करा"
//           className="h-14 w-14 rounded-full bg-navy-600 text-white flex items-center justify-center text-2xl shadow-xl hover:scale-110 transition-transform"
//         >
//           📞
//         </a>
//       </div>

//       {/* Mobile sticky bottom action bar */}
//       <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-navy-100 shadow-[0_-4px_20px_rgba(11,37,69,0.12)] grid grid-cols-3">
//         <a
//           href={waLink(WA_MESSAGES.general)}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-green-600 font-semibold text-xs"
//         >
//           <span className="text-lg"><i className="fa fa-whatsapp text-2xl"></i></span> WhatsApp
//         </a>
//         <a
//           href={telLink(PHONE_NUMBERS[0])}
//           className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-navy-600 font-semibold text-xs border-x border-navy-100"
//         >
//           <span className="text-lg">📞</span> {t('fab_call')}
//         </a>
//         <a
//           href={MAPS_LINK}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-brand-red font-semibold text-xs"
//         >
//           <span className="text-lg">🗺️</span> {t('fab_directions')}
//         </a>
//       </div>
//     </>
//   )
// }

















import { useEffect, useRef, useState } from 'react'
import {
  PHONE_NUMBERS,
  telLink,
  waLink,
  WA_MESSAGES,
  MAPS_LINK,
} from '../utils/contact'
import { useLanguage } from '../context/LanguageContext'

export default function FloatingButtons() {
  const { t } = useLanguage()

  const [showBot, setShowBot] = useState(false)
  const [botAlert, setBotAlert] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  const audioContextRef = useRef(null)

  // ============================================
  // 3 SECOND BOT NOTIFICATION
  // ============================================
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBot(true)
      setBotAlert(true)
      setShowMessage(true)

      playBigNotificationSound()

      // Stop attention animation after 5 seconds
      const stopTimer = setTimeout(() => {
        setBotAlert(false)
      }, 5000)

      // Hide message after 7 seconds
      const messageTimer = setTimeout(() => {
        setShowMessage(false)
      }, 7000)

      return () => {
        clearTimeout(stopTimer)
        clearTimeout(messageTimer)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // ============================================
  // BIG NOTIFICATION SOUND
  // ============================================
  const playBigNotificationSound = () => {
    try {
      const AudioContext =
        window.AudioContext || window.webkitAudioContext

      if (!AudioContext) return

      const ctx = new AudioContext()
      audioContextRef.current = ctx

      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const now = ctx.currentTime

      // -----------------------------
      // FIRST LOUD BEEP
      // -----------------------------
      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()

      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(700, now)
      osc1.frequency.exponentialRampToValueAtTime(1100, now + 0.15)

      gain1.gain.setValueAtTime(0.001, now)
      gain1.gain.exponentialRampToValueAtTime(0.65, now + 0.03)
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

      osc1.connect(gain1)
      gain1.connect(ctx.destination)

      osc1.start(now)
      osc1.stop(now + 0.35)

      // -----------------------------
      // SECOND BEEP
      // -----------------------------
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()

      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(950, now + 0.18)
      osc2.frequency.exponentialRampToValueAtTime(
        1450,
        now + 0.33
      )

      gain2.gain.setValueAtTime(0.001, now + 0.18)
      gain2.gain.exponentialRampToValueAtTime(
        0.75,
        now + 0.21
      )
      gain2.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.58
      )

      osc2.connect(gain2)
      gain2.connect(ctx.destination)

      osc2.start(now + 0.18)
      osc2.stop(now + 0.58)

      // -----------------------------
      // THIRD SOFT BEEP
      // -----------------------------
      const osc3 = ctx.createOscillator()
      const gain3 = ctx.createGain()

      osc3.type = 'sine'
      osc3.frequency.setValueAtTime(1200, now + 0.4)

      gain3.gain.setValueAtTime(0.001, now + 0.4)
      gain3.gain.exponentialRampToValueAtTime(
        0.45,
        now + 0.43
      )
      gain3.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.8
      )

      osc3.connect(gain3)
      gain3.connect(ctx.destination)

      osc3.start(now + 0.4)
      osc3.stop(now + 0.8)

      setTimeout(() => {
        try {
          ctx.close()
        } catch (e) {}
      }, 1200)
    } catch (error) {
      console.log('Bot notification sound blocked:', error)
    }
  }

  // ============================================
  // BOT CLICK
  // ============================================
  const openBot = () => {
    setBotAlert(false)
    setShowMessage(false)
    window.location.href = '/chatbot'
  }

  return (
    <>
      {/* =====================================================
          DESKTOP / TABLET BOT
      ===================================================== */}
      {showBot && (
        <div className="hidden md:flex fixed bottom-6 right-6 z-[100] flex-col items-end gap-3">

          {/* BOT MESSAGE */}
          {showMessage && (
            <div className="bot-message-card relative mr-1 bg-white rounded-2xl shadow-2xl border border-blue-100 px-5 py-3 max-w-[260px]">

              <div className="flex items-center gap-3">

                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-xl shadow-md">
                  🤖
                </div>

                <div>
                  <div className="font-bold text-slate-800 text-sm">
                    Shivyog Electrical
                  </div>

                  <div className="text-xs text-slate-500">
                    Hi! 👋 How can I help you?
                  </div>
                </div>

              </div>

              {/* Small arrow */}
              <div className="absolute -bottom-2 right-7 w-4 h-4 bg-white rotate-45 border-r border-b border-blue-100" />
            </div>
          )}

          {/* BOT BUTTON */}
          <button
            onClick={openBot}
            aria-label="Open Shivyog AI Assistant"
            title="Shivyog Electrical AI Assistant"
            className={`
              relative
              h-16 w-16
              rounded-full
              bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500
              text-white
              flex items-center justify-center
              text-3xl
              shadow-[0_10px_35px_rgba(37,99,235,0.45)]
              border-2 border-white
              cursor-pointer
              transition-all duration-300
              hover:scale-110
              active:scale-95
              ${botAlert ? 'bot-big-alert' : 'bot-float'}
            `}
          >

            {/* Outer Glow */}
            {botAlert && (
              <>
                <span className="absolute inset-[-8px] rounded-full border-2 border-blue-400 bot-ring-1" />
                <span className="absolute inset-[-15px] rounded-full border-2 border-cyan-300 bot-ring-2" />
              </>
            )}

            {/* Robot */}
            <span className="relative z-10">
              🤖
            </span>

            {/* Online dot */}
            <span className="absolute top-0 right-0 h-4 w-4 bg-green-400 rounded-full border-2 border-white shadow-md" />

            {/* Notification badge */}
            {botAlert && (
              <span className="absolute -top-2 -left-2 h-6 min-w-6 px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-lg bot-badge">
                1
              </span>
            )}

          </button>

          {/* Shop Name under bot */}
          <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-lg border border-blue-100">
            <span className="text-xs font-bold text-slate-700">
              🤖 Shivyog AI Assistant
            </span>
          </div>

        </div>
      )}

      {/* =====================================================
          MOBILE BOT
      ===================================================== */}
      {showBot && (
        <div className="md:hidden fixed right-4 bottom-[92px] z-[100] flex flex-col items-end gap-2">

          {/* MOBILE MESSAGE */}
          {showMessage && (
            <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 px-3 py-2.5 max-w-[210px] bot-mobile-message">

              <div className="flex items-center gap-2">

                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-base">
                  🤖
                </div>

                <div>
                  <div className="font-bold text-slate-800 text-xs">
                    Shivyog Electrical
                  </div>

                  <div className="text-[10px] text-slate-500">
                    Need help? 👋
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* MOBILE BOT */}
          <button
            onClick={openBot}
            aria-label="Open Shivyog AI Assistant"
            title="Shivyog Electrical AI Assistant"
            className={`
              relative
              h-16 w-16
              rounded-full
              bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500
              text-white
              flex items-center justify-center
              text-3xl
              shadow-[0_10px_35px_rgba(37,99,235,0.5)]
              border-2 border-white
              cursor-pointer
              active:scale-90
              transition-all duration-300
              ${botAlert ? 'bot-big-alert' : 'bot-float'}
            `}
          >

            {botAlert && (
              <>
                <span className="absolute inset-[-7px] rounded-full border-2 border-blue-400 bot-ring-1" />
                <span className="absolute inset-[-14px] rounded-full border-2 border-cyan-300 bot-ring-2" />
              </>
            )}

            <span className="relative z-10">
              🤖
            </span>

            {/* Online */}
            <span className="absolute top-0 right-0 h-4 w-4 bg-green-400 rounded-full border-2 border-white" />

            {/* Badge */}
            {botAlert && (
              <span className="absolute -top-2 -left-2 h-6 min-w-6 px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-lg bot-badge">
                1
              </span>
            )}

          </button>

        </div>
      )}

      {/* =====================================================
          MOBILE BOTTOM ACTION BAR
      ===================================================== */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-[90] bg-white border-t border-navy-100 shadow-[0_-4px_20px_rgba(11,37,69,0.12)] grid grid-cols-3">

        {/* WhatsApp */}
        <a
          href={waLink(WA_MESSAGES.general)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-green-600 font-semibold text-xs active:bg-green-50"
        >
          <span className="text-lg">
            <i className="fa fa-whatsapp text-2xl"></i>
          </span>

          WhatsApp
        </a>

        {/* Call */}
        <a
          href={telLink(PHONE_NUMBERS[0])}
          className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-navy-600 font-semibold text-xs border-x border-navy-100 active:bg-blue-50"
        >
          <span className="text-lg">
            📞
          </span>

          {t('fab_call')}
        </a>

        {/* Directions */}
        <a
          href={MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-brand-red font-semibold text-xs active:bg-red-50"
        >
          <span className="text-lg">
            🗺️
          </span>

          {t('fab_directions')}
        </a>

      </div>

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}
      <style>
        {`

        /* ==========================================
           NORMAL SLOW FLOAT
        ========================================== */

        @keyframes botFloat {

          0% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-7px);
          }

          100% {
            transform: translateY(0px);
          }

        }

        .bot-float {
          animation: botFloat 3s ease-in-out infinite;
        }


        /* ==========================================
           BIG ATTENTION ANIMATION
        ========================================== */

        @keyframes botBigAlert {

          0% {
            transform: scale(1) translateY(0);
          }

          15% {
            transform: scale(1.18) translateY(-8px);
          }

          30% {
            transform: scale(1) translateY(0);
          }

          45% {
            transform: scale(1.15) translateY(-7px);
          }

          60% {
            transform: scale(1) translateY(0);
          }

          75% {
            transform: scale(1.1) translateY(-4px);
          }

          100% {
            transform: scale(1) translateY(0);
          }

        }

        .bot-big-alert {
          animation:
            botBigAlert 0.8s ease-in-out infinite,
            botGlow 1.2s ease-in-out infinite;
        }


        /* ==========================================
           BLUE GLOW
        ========================================== */

        @keyframes botGlow {

          0% {
            box-shadow:
              0 0 0 0 rgba(59,130,246,0.5),
              0 10px 35px rgba(37,99,235,0.45);
          }

          50% {
            box-shadow:
              0 0 35px 12px rgba(59,130,246,0.35),
              0 15px 45px rgba(37,99,235,0.65);
          }

          100% {
            box-shadow:
              0 0 0 0 rgba(59,130,246,0.5),
              0 10px 35px rgba(37,99,235,0.45);
          }

        }


        /* ==========================================
           OUTER RINGS
        ========================================== */

        @keyframes botRing {

          0% {
            transform: scale(0.8);
            opacity: 0.9;
          }

          70% {
            transform: scale(1.35);
            opacity: 0;
          }

          100% {
            transform: scale(1.35);
            opacity: 0;
          }

        }

        .bot-ring-1 {
          animation: botRing 1.2s ease-out infinite;
        }

        .bot-ring-2 {
          animation: botRing 1.2s ease-out infinite 0.5s;
        }


        /* ==========================================
           NOTIFICATION BADGE
        ========================================== */

        @keyframes botBadge {

          0% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.3);
          }

          100% {
            transform: scale(1);
          }

        }

        .bot-badge {
          animation: botBadge 0.8s ease-in-out infinite;
        }


        /* ==========================================
           MESSAGE POPUP
        ========================================== */

        @keyframes botMessage {

          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.9);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

        }

        .bot-message-card {
          animation: botMessage 0.5s ease-out;
        }

        .bot-mobile-message {
          animation: botMessage 0.5s ease-out;
        }


        /* ==========================================
           REDUCED MOTION
        ========================================== */

        @media (prefers-reduced-motion: reduce) {

          .bot-float,
          .bot-big-alert,
          .bot-ring-1,
          .bot-ring-2,
          .bot-badge {
            animation: none !important;
          }

        }

        `}
      </style>
    </>
  )
}
