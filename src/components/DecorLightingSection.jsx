import { waLink, WA_MESSAGES } from '../utils/contact'

const decorItems = [
  'Fairy Lights', 'Curtain Lights', 'Serial Lights', 'LED Strip Lights', 'Rope Lights',
   'Decorative Bulbs', 'Diwali Lighting', 'Ganpati Decoration', 'Lakshmi Pooja Lighting', 'Wedding Decoration',
]

export default function DecorLightingSection() {
  return (
    <section id="decor" className="relative overflow-hidden bg-navy-700 text-white">
      {/* warm festive glow particles */}
      <div className="absolute -top-10 left-10 h-40 w-40 rounded-full bg-gold-400/30 blur-3xl animate-pulseGlow" />
      <div className="absolute bottom-0 right-10 h-56 w-56 rounded-full bg-brand-red/20 blur-3xl animate-pulseGlow" />
      <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-orange/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 text-center">
        <span className="eyebrow justify-center text-gold-400">Decoration</span>
        <h2 className="mt-3 font-display font-bold text-2xl md:text-3xl font-marathi">
          सणासुदीच्या सजावटीसाठी आकर्षक Lighting
        </h2>
        <p className="mt-2 text-white/80 font-marathi text-sm md:text-base max-w-xl mx-auto">
          दिवाळी, गणपती, लक्ष्मीपूजन आणि लग्नसमारंभासाठी सुंदर व आकर्षक डेकोरेशन लायटिंग.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto">
          {decorItems.map((d) => (
            <span
              key={d}
              className="px-3.5 py-2 rounded-full glass-panel text-xs md:text-sm font-semibold hover:bg-gold-400/20 transition-colors"
            >
              ✨ {d}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#products"
            className="inline-flex items-center gap-2 rounded-full bg-white text-navy-700 font-bold px-6 py-3 hover:brightness-95 transition"
          >
            Decoration Lighting पहा
          </a>
          <a
            href={waLink(WA_MESSAGES.decor)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-green-500 text-white font-bold px-6 py-3 hover:brightness-105 transition"
          >
            <i className="fa fa-whatsapp text-2xl"></i>
             Enquire on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
