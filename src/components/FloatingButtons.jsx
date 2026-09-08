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






























import { useEffect, useState } from 'react'
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
  const [botAttention, setBotAttention] = useState(false)

  useEffect(() => {
    // Website open झाल्यावर 3 seconds नंतर bot attention
    const timer = setTimeout(() => {
      setBotAttention(true)

      // Notification sound
      try {
        const AudioContext =
          window.AudioContext || window.webkitAudioContext

        if (AudioContext) {
          const audioContext = new AudioContext()

          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          oscillator.type = 'sine'

          // Notification sound
          oscillator.frequency.setValueAtTime(
            880,
            audioContext.currentTime
          )

          oscillator.frequency.setValueAtTime(
            1175,
            audioContext.currentTime + 0.12
          )

          gainNode.gain.setValueAtTime(
            0.0001,
            audioContext.currentTime
          )

          gainNode.gain.exponentialRampToValueAtTime(
            0.18,
            audioContext.currentTime + 0.02
          )

          gainNode.gain.exponentialRampToValueAtTime(
            0.0001,
            audioContext.currentTime + 0.35
          )

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          oscillator.start()
          oscillator.stop(audioContext.currentTime + 0.35)

          oscillator.onended = () => {
            audioContext.close()
          }
        }
      } catch (error) {
        console.log('Notification sound blocked:', error)
      }

      // Attention animation 2.5 seconds
      setTimeout(() => {
        setBotAttention(false)
      }, 2500)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* =====================================================
          DESKTOP / TABLET FLOATING BUTTONS
      ===================================================== */}
      <div className="hidden md:flex flex-col gap-3 fixed bottom-6 right-6 z-40">

        {/* AI Chatbot */}
        <a
          href="/chatbot"
          aria-label="AI Chatbot"
          title="Shivyog AI Assistant"
          className={`
            h-14 w-14 rounded-full
            bg-gradient-to-br from-indigo-600 to-blue-500
            text-white flex items-center justify-center
            text-2xl shadow-xl
            relative
            transition-all duration-300
            hover:scale-110
            ${botAttention ? 'animate-botAttention' : 'animate-botFloat'}
          `}
        >
          🤖

          {/* Online indicator */}
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 border-2 border-white rounded-full" />

          {/* Notification ring */}
          {botAttention && (
            <span className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping opacity-70" />
          )}
        </a>

        {/* WhatsApp */}
        <a
          href={waLink(WA_MESSAGES.general)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp वर चौकशी करा"
          title="WhatsApp"
          className="h-14 w-14 rounded-full bg-green-500 text-white flex items-center justify-center text-2xl shadow-xl hover:scale-110 transition-transform animate-pulseGlow"
        >
          <i className="fa fa-whatsapp text-2xl"></i>
        </a>

        {/* Call */}
        <a
          href={telLink(PHONE_NUMBERS[0])}
          aria-label="कॉल करा"
          title="Call Shivyog"
          className="h-14 w-14 rounded-full bg-navy-600 text-white flex items-center justify-center text-2xl shadow-xl hover:scale-110 transition-transform"
        >
          📞
        </a>
      </div>


      {/* =====================================================
          MOBILE AI CHATBOT
      ===================================================== */}
      <a
        href="/chatbot"
        aria-label="AI Chatbot"
        title="Shivyog AI Assistant"
        className={`
          md:hidden
          fixed
          right-4
          bottom-24
          z-50
          h-14
          w-14
          rounded-full
          bg-gradient-to-br from-indigo-600 to-blue-500
          text-white
          flex items-center justify-center
          text-2xl
          shadow-xl
          transition-all duration-300
          active:scale-95
          ${botAttention ? 'animate-botAttention' : 'animate-botFloat'}
        `}
      >
        🤖

        {/* Online indicator */}
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 border-2 border-white rounded-full" />

        {/* Notification pulse */}
        {botAttention && (
          <span className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping opacity-70" />
        )}

        {/* Small notification badge */}
        {botAttention && (
          <span
            className="
              absolute
              -top-2
              -left-2
              h-5
              min-w-5
              px-1
              rounded-full
              bg-red-500
              text-white
              text-[10px]
              font-bold
              flex
              items-center
              justify-center
              shadow-md
            "
          >
            1
          </span>
        )}
      </a>


      {/* =====================================================
          MOBILE STICKY BOTTOM ACTION BAR
      ===================================================== */}
      <div
        className="
          md:hidden
          fixed
          bottom-0
          inset-x-0
          z-40
          bg-white
          border-t
          border-navy-100
          shadow-[0_-4px_20px_rgba(11,37,69,0.12)]
          grid
          grid-cols-3
        "
      >

        {/* WhatsApp */}
        <a
          href={waLink(WA_MESSAGES.general)}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex
            flex-col
            items-center
            justify-center
            gap-0.5
            py-2.5
            text-green-600
            font-semibold
            text-xs
            active:bg-green-50
          "
        >
          <span className="text-lg">
            <i className="fa fa-whatsapp text-2xl"></i>
          </span>

          WhatsApp
        </a>


        {/* Call */}
        <a
          href={telLink(PHONE_NUMBERS[0])}
          className="
            flex
            flex-col
            items-center
            justify-center
            gap-0.5
            py-2.5
            text-navy-600
            font-semibold
            text-xs
            border-x
            border-navy-100
            active:bg-blue-50
          "
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
          className="
            flex
            flex-col
            items-center
            justify-center
            gap-0.5
            py-2.5
            text-brand-red
            font-semibold
            text-xs
            active:bg-red-50
          "
        >
          <span className="text-lg">
            🗺️
          </span>

          {t('fab_directions')}
        </a>

      </div>


      {/* =====================================================
          BOT ANIMATION CSS
      ===================================================== */}
      <style>
        {`
          @keyframes botFloat {
            0% {
              transform: translateY(0px);
            }

            50% {
              transform: translateY(-5px);
            }

            100% {
              transform: translateY(0px);
            }
          }

          @keyframes botAttention {
            0% {
              transform: translateY(0px) scale(1);
            }

            15% {
              transform: translateY(-5px) scale(1.08);
            }

            30% {
              transform: translateY(0px) scale(1);
            }

            45% {
              transform: translateY(-4px) scale(1.06);
            }

            60% {
              transform: translateY(0px) scale(1);
            }

            100% {
              transform: translateY(0px) scale(1);
            }
          }

          .animate-botFloat {
            animation: botFloat 3s ease-in-out infinite;
          }

          .animate-botAttention {
            animation: botAttention 0.7s ease-in-out infinite;
          }
        `}
      </style>
    </>
  )
}
