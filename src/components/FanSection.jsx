import { waLink, WA_MESSAGES } from '../utils/contact'

const types = ['Table Fans', 'Ceiling Fans', 'Exhaust Fans', 'Wall Fans', 'Pedestal Fans']
const features = ['शक्तिशाली हवा', 'कमी वीज वापर', 'कमी आवाज', 'मजबूत बॉडी', 'घर / दुकान / ऑफिससाठी योग्य']

export default function FanSection() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div className="flex justify-center">
          <div className="h-56 w-56 md:h-72 md:w-72 rounded-full bg-gradient-to-br from-royal-100 to-navy-50 flex items-center justify-center shadow-inner overflow-hidden">
          <img
            src="https://www.advwin.com.au/cdn/shop/files/899b76846c4878eb_1024x.jpg?v=1774603114"
            alt="Fan"
            className="h-full w-full object-cover"
          />
        </div>
        </div>
        <div>
          <span className="eyebrow">Fans</span>
          <h2 className="mt-3 font-display font-bold text-2xl md:text-3xl text-navy-700 font-marathi">
            उष्णतेपासून आरामाची हमी — सर्व फॅन उपलब्ध!
          </h2>

          <div className="mt-5 flex flex-wrap gap-2">
            {types.map((t) => (
              <span key={t} className="px-3 py-1.5 rounded-full bg-royal-50 text-royal-500 text-xs font-semibold">
                {t}
              </span>
            ))}
          </div>

          <ul className="mt-5 grid grid-cols-2 gap-y-2 gap-x-4">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-navy-500 font-marathi">
                <span className="text-gold-500">✓</span> {f}
              </li>
            ))}
          </ul>

          <a
            href={waLink(WA_MESSAGES.fan)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-500 text-white font-semibold px-6 py-3 hover:brightness-105 transition"
          >
            <i className="fa fa-whatsapp text-2xl"></i>
            Fan Enquire on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
