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

import LocalSEOSection from './components/LocalSEOSection'
import LocalFAQ from './components/LocalFAQ'
/* =========================================================
   MAIN APP
   ========================================================= */

export default function App() {
  const [activeCategory, setActiveCategory] = useState('सर्व')
  const [adminOpen, setAdminOpen] = useState(false)
  const isFAQPage = window.location.pathname === '/faq'
  const isTipsPage = window.location.pathname === '/tips'

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
         {isFAQPage ? (
              <>
                <Navbar />
            
                <main className="pt-20">
                  <LocalSEOSection />
                  <LocalFAQ />
                </main>
            
                <Footer
                  onOpenAdmin={() => setAdminOpen(true)}
                />
            
                <FloatingButtons />
              </>
            ) : isTipsPage ? (
              <>
                <Navbar />
            
                <main className="pt-20">
                  <Tips />
                </main>
            
                <Footer
                  onOpenAdmin={() => setAdminOpen(true)}
                />
            
                <FloatingButtons />
              </>
            ) : (
              <>

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

       <div className="hidden md:block">
           <Tips />
         </div>
         
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
      </>
    )}
    </div>
  )
}
