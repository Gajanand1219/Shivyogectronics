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

export default function App() {
  const [activeCategory, setActiveCategory] = useState('सर्व')
  const [adminOpen, setAdminOpen] = useState(false)

  // allow direct access via a #admin link/bookmark as well as the footer button
  useEffect(() => {
    if (window.location.hash === '#admin') setAdminOpen(true)
  }, [])

  // simple scroll-reveal for elements with the `reveal` class
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('in-view')
        })
      },
      { threshold: 0.15 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="pb-14 md:pb-0 overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <TrustBadges />
        <Categories onSelectCategory={setActiveCategory} />
        <Products activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        <WaterHeaterSection />
        <FanSection />
        <TvDthSection />
        <DecorLightingSection />
        <Services />
        <WhyChooseUs />
        <Tips />
        <Gallery />
        <About />
        <Location />
        <Contact />
      </main>
      <Footer onOpenAdmin={() => setAdminOpen(true)} />
      <FloatingButtons />
      {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}
    </div>
  )
}
