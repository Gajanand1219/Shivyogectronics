import { useState } from 'react'
import emailjs from '@emailjs/browser'
import {
  PHONE_NUMBERS,
  SHOP_ADDRESS,
  telLink,
  waLink,
} from '../utils/contact'
import { useLanguage } from '../context/LanguageContext'

export default function Contact() {
  const { t, lang } = useLanguage()

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    looking: '',
    message: '',
  })

  const [sending, setSending] = useState(false)

  function handleChange(e) {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (sending) return

    setSending(true)

    try {
      const result = await emailjs.send(
        'service_24354u2',
        'template_34dvvbw',
        {
          name: form.name,
          mobile: form.mobile,
          looking: form.looking || '-',
          message: form.message || '-',
        },
        {
          publicKey: 'v1nrqlR6RlZTCnL3s',
        }
      )

      console.log('Email sent successfully:', result)

      alert(
        lang === 'en'
          ? '✅ Your enquiry has been sent successfully!'
          : '✅ तुमची चौकशी यशस्वीरित्या पाठवली गेली!'
      )

      setForm({
        name: '',
        mobile: '',
        looking: '',
        message: '',
      })
    } catch (error) {
      console.error('EmailJS Error:', error)

      alert(
        lang === 'en'
          ? '❌ Failed to send enquiry. Please try again.'
          : '❌ चौकशी पाठवता आली नाही. कृपया पुन्हा प्रयत्न करा.'
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <section
      // id="contact"
      className="relative overflow-hidden bg-gradient-to-br from-navy-50 via-white to-royal-50/50"
    >
      {/* Decorative Background */}
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-royal-200/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-gold-300/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16">

        {/* ================= HEADING ================= */}

        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="eyebrow justify-center">
            {t('contact_eyebrow')}
          </span>

          <h2 className="mt-3 font-display font-bold text-2xl md:text-4xl text-navy-700 font-marathi">
            {t('contact_title')}
          </h2>

          <p className="mt-3 text-sm md:text-base text-navy-400/80 font-marathi">
            {lang === 'en'
              ? 'Have a question? Contact us and we will be happy to help you.'
              : 'तुम्हाला काही माहिती हवी असल्यास आमच्याशी संपर्क करा.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-7 lg:gap-10 items-stretch">

          {/* =====================================================
              SHOP INFORMATION
          ====================================================== */}

          <div className="relative overflow-hidden rounded-3xl bg-white border border-navy-100 shadow-xl p-6 md:p-8">

            {/* Top Gradient */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-royal-500 via-gold-400 to-royal-500" />

            {/* Shop Header */}
            <div className="flex items-center gap-4 mb-7">

              <div className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br from-royal-500 to-royal-700 flex items-center justify-center text-3xl shadow-lg shadow-royal-200">
                🏪
              </div>

              <div>
                <h3 className="font-display font-bold text-lg md:text-xl text-navy-700">
                  शिवयोग इलेक्ट्रिकल &amp; इलेक्ट्रॉनिक्स
                </h3>

                <p className="text-xs text-royal-500 font-semibold mt-1">
                  {lang === 'en'
                    ? 'Electrical & Electronics Store'
                    : 'इलेक्ट्रिकल & इलेक्ट्रॉनिक्स दुकान'}
                </p>
              </div>

            </div>

            {/* Address */}
            <div className="group flex items-start gap-4 p-4 rounded-2xl bg-red-50 border border-red-100 hover:shadow-md transition-all">

              <div className="h-11 w-11 shrink-0 rounded-xl bg-red-500 text-white flex items-center justify-center text-xl shadow-md">
                📍
              </div>

              <div>
                <p className="text-xs font-bold text-red-500 uppercase tracking-wide mb-1">
                  {lang === 'en' ? 'Visit Us' : 'पत्ता'}
                </p>

                <p className="font-marathi text-sm md:text-base text-navy-600 font-medium leading-relaxed">
                  {SHOP_ADDRESS}
                </p>
              </div>

            </div>

            {/* Phone Numbers */}
            <div className="mt-4 space-y-3">

              {PHONE_NUMBERS.map((n) => (
                <a
                  key={n}
                  href={telLink(n)}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100 hover:bg-blue-500 hover:border-blue-500 transition-all duration-300"
                >

                  <div className="h-11 w-11 shrink-0 rounded-xl bg-blue-500 text-white flex items-center justify-center text-xl shadow-md group-hover:bg-white group-hover:text-blue-500 transition">
                    📞
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-bold text-blue-500 group-hover:text-white/80 uppercase tracking-wide">
                      {lang === 'en' ? 'Call Us' : 'फोन करा'}
                    </p>

                    <p className="text-sm md:text-base font-bold text-navy-700 group-hover:text-white">
                      {n}
                    </p>
                  </div>

                  <span className="text-blue-500 group-hover:text-white text-xl">
                    →
                  </span>

                </a>
              ))}

            </div>

            {/* WhatsApp */}
            <a
              href={waLink(
                'नमस्कार, मला तुमच्या दुकानातील उत्पादनांबद्दल माहिती हवी आहे.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 flex items-center gap-4 p-4 rounded-2xl bg-green-50 border border-green-100 hover:bg-green-500 hover:border-green-500 transition-all duration-300"
            >

              <div className="h-11 w-11 shrink-0 rounded-xl bg-green-500 text-white flex items-center justify-center text-xl shadow-md group-hover:bg-white group-hover:text-green-500 transition">
                <i className="fa fa-whatsapp text-xl"></i>
              </div>

              <div className="flex-1">
                <p className="text-xs font-bold text-green-600 group-hover:text-white/80 uppercase tracking-wide">
                  WhatsApp
                </p>

                <p className="text-sm md:text-base font-bold text-navy-700 group-hover:text-white">
                  {t('contact_whatsapp')}
                </p>
              </div>

              <span className="text-green-500 group-hover:text-white text-xl">
                →
              </span>

            </a>

            {/* Small Info */}
            <div className="mt-6 flex flex-wrap gap-2">

              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 text-purple-600 px-3 py-1.5 text-xs font-semibold">
                ⚡ Electrical
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 text-orange-600 px-3 py-1.5 text-xs font-semibold">
                📺 Electronics
              </span>

              <span id="contact" className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 text-cyan-600 px-3 py-1.5 text-xs font-semibold">
                🛠️ Services
              </span >

            </div>

          </div>


          {/* =====================================================
              CONTACT FORM
          ====================================================== */}
          <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-3xl bg-white border border-navy-100 shadow-xl p-6 md:p-8"
          >

            {/* Top Gradient */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold-400 via-royal-500 to-gold-400" />

            {/* Form Header */}
            <div className="flex items-center gap-4 mb-7">

              <div className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br from-gold-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg shadow-orange-100">
                ✉️
              </div>

              <div>
                <h3 className="font-display font-bold text-lg md:text-xl text-navy-700">
                  {lang === 'en'
                    ? 'Send Your Enquiry'
                    : 'तुमची चौकशी पाठवा'}
                </h3>

                <p className="text-xs text-navy-400 mt-1">
                  {lang === 'en'
                    ? 'Fill the form and we will contact you.'
                    : 'फॉर्म भरा आणि आम्ही तुमच्याशी संपर्क करू.'}
                </p>
              </div>

            </div>


            {/* ================= NAME ================= */}

            <div>
              <label
                htmlFor="name"
                className="flex items-center gap-2 text-sm font-semibold text-navy-600 font-marathi"
              >
                <span className="text-lg">👤</span>
                {t('contact_form_name')}
              </label>

              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                required
                placeholder={
                  lang === 'en'
                    ? 'Enter your name'
                    : 'तुमचे नाव लिहा'
                }
                className="mt-2 w-full rounded-xl border border-navy-100 bg-navy-50/30 px-4 py-3 text-sm focus:border-royal-400 focus:ring-2 focus:ring-royal-100 outline-none transition"
              />
            </div>


            {/* ================= MOBILE ================= */}

            <div className="mt-4">

              <label
                htmlFor="mobile"
                className="flex items-center gap-2 text-sm font-semibold text-navy-600 font-marathi"
              >
                <span className="text-lg">📱</span>
                {t('contact_form_mobile')}
              </label>

              <input
                id="mobile"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                type="tel"
                required
                pattern="[0-9]{10}"
                maxLength={10}
                inputMode="numeric"
                placeholder={
                  lang === 'en'
                    ? 'Enter 10 digit mobile number'
                    : '१० अंकी मोबाईल नंबर लिहा'
                }
                className="mt-2 w-full rounded-xl border border-navy-100 bg-navy-50/30 px-4 py-3 text-sm focus:border-royal-400 focus:ring-2 focus:ring-royal-100 outline-none transition"
              />

            </div>


            {/* ================= LOOKING FOR ================= */}

            <div className="mt-4">

              <label
                htmlFor="looking"
                className="flex items-center gap-2 text-sm font-semibold text-navy-600 font-marathi"
              >
                <span className="text-lg">🔎</span>
                {t('contact_form_looking')}
              </label>

              <input
                id="looking"
                name="looking"
                value={form.looking}
                onChange={handleChange}
                type="text"
                placeholder={t('contact_form_looking_placeholder')}
                className="mt-2 w-full rounded-xl border border-navy-100 bg-navy-50/30 px-4 py-3 text-sm focus:border-royal-400 focus:ring-2 focus:ring-royal-100 outline-none transition"
              />

            </div>


            {/* ================= MESSAGE ================= */}

            <div className="mt-4">

              <label
                htmlFor="message"
                className="flex items-center gap-2 text-sm font-semibold text-navy-600 font-marathi"
              >
                <i className="fa fa-comment text-lg"></i>
                {t('contact_form_message')}
              </label>

              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder={
                  lang === 'en'
                    ? 'Write your message'
                    : 'तुमचा संदेश लिहा'
                }
                className="mt-2 w-full rounded-xl border border-navy-100 bg-navy-50/30 px-4 py-3 text-sm focus:border-royal-400 focus:ring-2 focus:ring-royal-100 outline-none transition resize-none"
              />

            </div>


            {/* ================= SUBMIT ================= */}

            <button
              type="submit"
              disabled={sending}
              className={`mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-6 py-3.5 shadow-lg shadow-green-100 transition-all duration-300 ${
                sending
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:from-green-600 hover:to-emerald-700 hover:-translate-y-0.5 hover:shadow-xl'
              }`}
            >

              {sending ? (
                <>
                  <span className="animate-spin">⏳</span>
                  {lang === 'en'
                    ? 'Sending...'
                    : 'पाठवत आहे...'}
                </>
              ) : (
                <>
                  📧 {t('contact_form_submit')}
                </>
              )}

            </button>


           

          

          </form>

        </div>
      </div>
    </section>
  )
}