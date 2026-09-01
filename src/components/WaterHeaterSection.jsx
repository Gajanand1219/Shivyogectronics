import { waLink, WA_MESSAGES } from '../utils/contact'

const items = ['Water Heater Elements', 'Kettle Elements', 'Geyser Elements', 'Replacement Elements', 'विविध साईज व टाईप']

export default function WaterHeaterSection() {
  return (
    <section className="bg-gradient-to-br from-navy-50 to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div className="order-2 md:order-1">
          <span className="eyebrow">Water Heater</span>
          <h2 className="mt-3 font-display font-bold text-2xl md:text-3xl text-navy-700 font-marathi">
            गरम पाण्याच्या गरजांसाठी दर्जेदार Water Heater Elements
          </h2>
          <ul className="mt-5 space-y-2">
            {items.map((i) => (
              <li key={i} className="flex items-center gap-2 text-navy-500 font-marathi text-sm md:text-base">
                <span className="text-brand-orange">♨️</span> {i}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-navy-400/70 font-marathi">
            उपलब्धतेनुसार ब्रँड्स व साईज बदलू शकतात — कृपया चौकशी करा.
          </p>
          <a
            href={waLink(WA_MESSAGES.waterHeater)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-500 text-white font-semibold px-6 py-3 hover:brightness-105 transition"
          >
           <i className="fa fa-whatsapp text-2xl"></i>
             Water Heater Element साठी WhatsApp करा
          </a>
        </div>
        <div className="order-1 md:order-2 flex justify-center">
          <div className="h-56 w-56 md:h-72 md:w-72 rounded-full bg-gradient-to-br from-brand-orange/20 to-gold-400/30 flex items-center justify-center shadow-inner overflow-hidden">
          <img
            src="https://m.media-amazon.com/images/I/61OJQuiXqmL.jpg"
            alt="Water Heater"
            className="h-full w-full object-contain"
          />
        </div>
        </div>
      </div>
    </section>
  )
}
