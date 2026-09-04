// import { useEffect, useState } from 'react'
// import Navbar from './components/Navbar'
// import Hero from './components/Hero'
// import TrustBadges from './components/TrustBadges'
// import Categories from './components/Categories'
// import Products from './components/Products'
// import WaterHeaterSection from './components/WaterHeaterSection'
// import FanSection from './components/FanSection'
// import TvDthSection from './components/TvDthSection'
// import DecorLightingSection from './components/DecorLightingSection'
// import Services from './components/Services'
// import WhyChooseUs from './components/WhyChooseUs'
// import Tips from './components/Tips'
// import Gallery from './components/Gallery'
// import About from './components/About'
// import Location from './components/Location'
// import Contact from './components/Contact'
// import Footer from './components/Footer'
// import FloatingButtons from './components/FloatingButtons'
// import AdminPanel from './components/AdminPanel'
// import ReviewPopup from './components/ReviewPopup'

// export default function App() {
//   const [activeCategory, setActiveCategory] = useState('सर्व')
//   const [adminOpen, setAdminOpen] = useState(false)

//   // allow direct access via a #admin link/bookmark as well as the footer button
//   useEffect(() => {
//     if (window.location.hash === '#admin') setAdminOpen(true)
//   }, [])

//   // simple scroll-reveal for elements with the `reveal` class
//   useEffect(() => {
//     const els = document.querySelectorAll('.reveal')
//     const io = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) entry.target.classList.add('in-view')
//         })
//       },
//       { threshold: 0.15 }
//     )
//     els.forEach((el) => io.observe(el))
//     return () => io.disconnect()
//   }, [])

//   return (
//     <div className="pb-14 md:pb-0 overflow-x-hidden">
//       <Navbar />
//       <main>
//         <Hero />
//         <TrustBadges />
//         <Categories onSelectCategory={setActiveCategory} />
//         <Products activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
//         <WaterHeaterSection />
//         <FanSection />
//         <TvDthSection />
//         <DecorLightingSection />
//         <Services />
//         <WhyChooseUs />
//         <Tips />
//         <Gallery />
//         <About />
//         <Location />
//         <Contact />
//       </main>
//      <Footer onOpenAdmin={() => setAdminOpen(true)} />

// <ReviewPopup />

// <FloatingButtons />

// {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}
//     </div>
//   )
// }


























import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TrustBadges from './components/TrustBadges'
import Categories from './components/Categories'
import Products from './components/Products'
import WaterHeaterSection from './components/WaterHeaterSection'
import FanSection from './components/FanSection'
import TvDthSection from './components/TvDthSection'
import DecorLightingSection from './components/DecorLightingSection'
import Services from './components/Services'
import WhyChooseUs from './components/WhyChooseUs'
import Tips from './components/Tips'
import Gallery from './components/Gallery'
import About from './components/About'
import Location from './components/Location'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingButtons from './components/FloatingButtons'
import AdminPanel from './components/AdminPanel'
import ReviewPopup from './components/ReviewPopup'
import { Analytics } from '@vercel/analytics/react'

/* =========================================================
   LOCAL SEO CONTENT
   ========================================================= */

// function LocalSEOSection() {
//   return (
//     <section
//       id="local-seo"
//       className="reveal py-12 md:py-16 px-4"
//       aria-labelledby="local-seo-title"
//     >
//       <div className="max-w-6xl mx-auto">

//         <div className="text-center mb-8">
//           <h2
//             id="local-seo-title"
//             className="text-2xl md:text-4xl font-bold"
//           >
//             Shivyog Electrical & Electronics – Basmath
//           </h2>

//           <p className="mt-3 text-base md:text-lg">
//             Electrical & Electronics Shop in Basmath, Hingoli, Maharashtra
//           </p>
//         </div>

//         <div className="space-y-5 text-sm md:text-base leading-7">

//           <p>
//             <strong>Shivyog Electrical & Electronics</strong> is a trusted
//             electrical and electronics shop located at Mama Chowk, Main Road,
//             Basmath, Hingoli, Maharashtra. We provide a range of electrical
//             materials, electronics products, lighting products and electrical
//             accessories for homes, shops and businesses.
//           </p>

//           <p>
//             If you are looking for an <strong>Electrical Shop in Basmath</strong>
//             or an <strong>Electronics Shop in Basmath</strong>, Shivyog
//             Electrical & Electronics offers a variety of products including
//             electrical wires, switches, sockets, MCBs, fans, LED lights,
//             decorative lights, TV remotes, DTH remotes and water heater
//             elements.
//           </p>

//           <p>
//             Basmath is also commonly searched online using names such as
//             <strong> Vasmat </strong> and <strong> Vasmath</strong>.
//             Shivyog Electrical & Electronics serves customers in Basmath
//             (Vasmat/Vasmath), Hingoli and nearby areas.
//           </p>

//           <h3 className="text-xl md:text-2xl font-bold pt-4">
//             Electrical Products in Basmath
//           </h3>

//           <p>
//             We offer commonly required electrical products such as wires,
//             cables, switches, sockets, plugs, MCBs, electrical accessories,
//             fans, LED bulbs, LED lights and decorative lighting products.
//           </p>

//           <h3 className="text-xl md:text-2xl font-bold pt-4">
//             Electronics Products in Basmath
//           </h3>

//           <p>
//             Our electronics range includes TV remotes, DTH remotes and other
//             useful electronics accessories. Customers can contact us for
//             product availability, pricing and assistance.
//           </p>

//           <h3 className="text-xl md:text-2xl font-bold pt-4">
//             Shivyog Electrical – Vasmat / Vasmath / Basmath
//           </h3>

//           <p>
//             Shivyog Electrical & Electronics is the local electrical and
//             electronics destination for customers searching for electrical
//             material and electronics products in Basmath, also known as
//             Vasmat or Vasmath, in Hingoli district, Maharashtra.
//           </p>

//         </div>
//       </div>
//     </section>
//   )
// }

// /* =========================================================
//    LOCAL SEO FAQ
//    ========================================================= */

// function LocalFAQ() {
//   const faqs = [
//     {
//       question: 'Where is Shivyog Electrical & Electronics located?',
//       answer:
//         'Shivyog Electrical & Electronics is located at Mama Chowk, Main Road, Basmath, Hingoli, Maharashtra.'
//     },
//     {
//       question: 'Does Shivyog Electrical sell electrical products in Basmath?',
//       answer:
//         'Yes. The shop offers electrical products such as wires, switches, sockets, MCBs, fans, LED lights, decorative lights and other electrical accessories.'
//     },
//     {
//       question: 'Does Shivyog Electrical sell electronics products?',
//       answer:
//         'Yes. Electronics products and accessories include TV remotes, DTH remotes and other related products.'
//     },
//     {
//       question: 'Is Basmath also called Vasmat or Vasmath?',
//       answer:
//         'Yes. Basmath is also commonly written or searched online as Vasmat and Vasmath.'
//     },
//     {
//       question: 'Does Shivyog Electrical serve customers from Hingoli district?',
//       answer:
//         'Yes. The shop is located in Basmath, Hingoli district, Maharashtra and serves customers from Basmath and nearby areas.'
//     }
//   ]

//   return (
//     <section
//       id="faq"
//       className="reveal py-12 md:py-16 px-4"
//       aria-labelledby="faq-title"
//     >
//       <div className="max-w-5xl mx-auto">

//         <div className="text-center mb-8">
//           <h2
//             id="faq-title"
//             className="text-2xl md:text-4xl font-bold"
//           >
//             Frequently Asked Questions
//           </h2>

//           <p className="mt-3">
//             Shivyog Electrical & Electronics – Basmath, Hingoli
//           </p>
//         </div>

//         <div className="space-y-4">
//           {faqs.map((faq, index) => (
//             <details
//               key={index}
//               className="rounded-xl border p-4"
//             >
//               <summary className="cursor-pointer font-semibold">
//                 {faq.question}
//               </summary>

//               <p className="mt-3 leading-7">
//                 {faq.answer}
//               </p>
//             </details>
//           ))}
//         </div>

//       </div>
//     </section>
//   )
// }

/* =========================================================
   MAIN APP
   ========================================================= */

export default function App() {
  const [activeCategory, setActiveCategory] = useState('सर्व')
  const [adminOpen, setAdminOpen] = useState(false)

  /* ---------------------------------------------------------
     Admin direct access
     --------------------------------------------------------- */

  useEffect(() => {
    if (window.location.hash === '#admin') {
      setAdminOpen(true)
    }
  }, [])

  /* ---------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------- */

  useEffect(() => {
    const els = document.querySelectorAll('.reveal')

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
          }
        })
      },
      {
        threshold: 0.15
      }
    )

    els.forEach((el) => io.observe(el))

    return () => io.disconnect()
  }, [])

  return (
    <div className="pb-14 md:pb-0 overflow-x-hidden">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar />

      <main>

        {/* ===================================================
            HERO
        =================================================== */}

        <Hero />

        {/* ===================================================
            TRUST
        =================================================== */}

        <TrustBadges />

        {/* ===================================================
            CATEGORIES
        =================================================== */}

        <Categories
          onSelectCategory={setActiveCategory}
        />

        {/* ===================================================
            PRODUCTS
        =================================================== */}

        <Products
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {/* ===================================================
            PRODUCT SECTIONS
        =================================================== */}

        <WaterHeaterSection />

        <FanSection />

        <TvDthSection />

        <DecorLightingSection />

        {/* ===================================================
            SERVICES
        =================================================== */}

        <Services />

        {/* ===================================================
            WHY CHOOSE US
        =================================================== */}

        <WhyChooseUs />

        {/* ===================================================
            TIPS
        =================================================== */}

        <Tips />

        {/* ===================================================
            GALLERY
        =================================================== */}

        <Gallery />

        {/* ===================================================
            ABOUT
        =================================================== */}

        <About />

        {/* ===================================================
            LOCATION
        =================================================== */}

        <Location />

        {/* ===================================================
            LOCAL SEO CONTENT
        =================================================== */}

        {/* <LocalSEOSection /> */}

        {/* ===================================================
            FAQ
        =================================================== */}

        {/* <LocalFAQ /> */}

        {/* ===================================================
            CONTACT
        =================================================== */}

        <Contact />
         <Analytics />

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* =====================================================
          REVIEW POPUP
      ===================================================== */}

      <ReviewPopup />

      {/* =====================================================
          FLOATING BUTTONS
      ===================================================== */}

      <FloatingButtons />

      {/* =====================================================
          ADMIN PANEL
      ===================================================== */}

      {adminOpen && (
        <AdminPanel
          onClose={() => setAdminOpen(false)}
        />
      )}

    </div>
  )
}
