import { waLink, WA_MESSAGES } from '../utils/contact'

const brands = ['Samsung', 'LG', 'Tata Play', 'DishTV', 'Airtel', 'Videocon d2h']

export default function TvDthSection() {
  return (
    <section className="bg-gradient-to-br from-navy-600 to-royal-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-grid [background-size:22px_22px] opacity-10" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <span className="eyebrow text-gold-400">TV / DTH / Dish</span>
          <h2 className="mt-3 font-display font-bold text-2xl md:text-3xl font-marathi">
            TV, DTH, Dish चे Remote एकाच ठिकाणी!
          </h2>
          <p className="mt-3 text-white/85 font-marathi text-sm md:text-base">
            Original / Compatible पर्याय उपलब्धतेनुसार. सेट-टॉप बॉक्स अॅक्सेसरीज देखील उपलब्ध.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {brands.map((b) => (
              <span key={b} className="px-3 py-1.5 rounded-full glass-panel text-xs font-semibold">
                {b}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={waLink(WA_MESSAGES.remotePhoto)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gold-500 text-navy-700 font-bold px-6 py-3 hover:brightness-105 transition"
            >
              📸 तुमच्या Remote चा फोटो पाठवा
            </a>
            <a
              href={waLink(WA_MESSAGES.service('TV / DTH Remote'))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-green-500 text-white font-bold px-6 py-3 hover:brightness-105 transition"
            >
              <i className="fa fa-whatsapp text-2xl"></i>
              Enquire on WhatsApp
            </a>
          </div>
        </div>

        <div className="flex justify-center">
        
          <div className="h-56 w-56 md:h-72 md:w-72 rounded-full bg-gradient-to-br from-royal-100 to-navy-50 flex items-center justify-center shadow-inner overflow-hidden">
  <img
                src="https://rukminim2.flixcart.com/image/612/612/xif0q/dth-new/y/a/r/free-installation-hd-set-top-box-1-month-cricket-world-cup-original-imagtueyyaz6khjm.jpeg?q=70"

    alt="Fan"
    className="h-full w-full object-cover"
  />
</div>
        </div>
        </div>
    </section>
  )
}
