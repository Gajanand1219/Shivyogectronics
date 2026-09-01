import { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import { useLanguage } from '../context/LanguageContext'

// =====================================================
// GALLERY GROUPS
// प्रत्येक g च्या आत त्याची स्वतःची images आहेत.
// =====================================================

const galleryGroups = [
  // ---------------------------------------------------
  // G1 - LOGO
  // ---------------------------------------------------
 




{
 id: 'g1',
    cover: logo,
    labelMr: 'आमचा ब्रँड',
    labelEn: 'Our Brand',

    images: [
       {
        src: logo,
        alt: 'Shivyoga Electrical & Electronics Logo',
      },
    {
        src: 'https://scontent.fhyd7-1.fna.fbcdn.net/v/t39.30808-6/646806057_122102622602365627_7086416858809416304_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x2048&ctp=s960x960&_nc_cat=105&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=5kjpZAGTxf4Q7kNvwGKIBJ_&_nc_oc=Adq56qyfjcNn2lZlxLM_AKIgMPk2VPYGSIbAfV_YQPB_ScDJV5BdzQrJpIDXUQ5HQyI&_nc_zt=23&_nc_ht=scontent.fhyd7-1.fna&_nc_gid=Nwo5M2VdlD7-_kdVbmR8NQ&_nc_ss=7b2a8&oh=00_AQK51A2r19WDSwDbIGQYK7PqwVsMT01eS2yOIcgKwufa_Q&oe=6A9A3B84',
        alt: 'Shivyoga Electrical & Electronics Logo',
      }
      
    ],
  },
  // ---------------------------------------------------
  // G2 - SHOP
  // ---------------------------------------------------
  {
    id: 'g2',
    cover: 'https://cdn.corenexis.com/f/1Snft4Sr9KF.jpeg',
    labelMr: 'दुकान',
    labelEn: 'Shop',

    images: [
        {
        src: 'https://cdn.corenexis.com/f/1Snft4Sr9KF.jpeg',
        alt: 'Shivyoga Shop',
      },
      {
        src: 'https://cdn.corenexis.com/f/ICCUOT7xdEm.png',
        alt: 'Shivyoga Shop',
      },
       {
        src: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWl4KetbUklNYG9PP1iCtxbXAtw9dIA8RPpULLTydKeQ98PXo81jlYoht0NPvJ1ngXl1J5pwKGkT2hlaqHmU4OY8Sxix3rdP3tU3HpKFOctSOH2ZMt0l19IHk0Ge2JM1bySo10JIgW2qBGwi=w203-h270-k-no',
        alt: 'Shivyoga Electrical Shop',
      },
      {
        src: 'https://cdn.corenexis.com/f/EVuoVxe44fS.png',
        alt: 'Shivyoga Shop Interior',
      },
    
      {
        src: 'https://cdn.corenexis.com/f/01HoYBZZe8j.png',
        alt: 'Shivyoga Electrical Shop',
      },
      {
        src: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkImTjsF1AFT15fU6Nzum6Gn12-jalgnE3eWRyiDkKk5bsur8d5uDl2VG_mFZd3627ciVRYKYbb_nszpwugXUGCcJdI5bmHRjVZAYKHtNGnIIw4uFg8qqUH-zjrMt6kdVQ6Ygsv2L4mbgH6=s527-k-no',
        alt: 'Shivyoga Shop Products',
      },
       {
        src: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWn81dFXDG1tsHX5o8ZHg3M8cDCHovBfVIm7Q7CHSwLhCjZbI83lDhGLcQTKSt88k7Rg6ClfrPO5ITZR3A2kgN7-l-7xUTouaVqmfKpsj9Ug7ft-SUfsZkDxUfzAW7Gvduk4RyEtnP2j43Z7=w203-h270-k-no',
        alt: 'Shivyoga Shop Products',
      },

      
    ],
  },

  
  // ---------------------------------------------------
  // G9 - FESTIVAL DECORATION
  // ---------------------------------------------------
  {
    id: 'g9',
    cover: 'https://scontent.fhyd7-1.fna.fbcdn.net/v/t39.30808-6/779957641_122130962228365627_2655053558510186934_n.jpg?stp=dst-jpg_tt6&cstp=mx1024x1536&ctp=s1024x1536&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=y1IwIj347NYQ7kNvwFon37_&_nc_oc=Adp4V0Kww9m7OR4sy07CQJp3HOgA59R81XgD1KWs-sB1-XigOlYhv7i-yx1HAwjRd4A&_nc_zt=23&_nc_ht=scontent.fhyd7-1.fna&_nc_gid=nUBCDhf6n_n-pZxavqnYrQ&_nc_ss=7b2a8&oh=00_AQL1z3WYvAbUfjw43Ann6n4L7h_QVPXxkKRiZosw9elkhw&oe=6A9A3FAE',
    labelMr: 'सण सजावट',
    labelEn: 'Festival Decoration',

    images: [
      {
        src: 'https://scontent.fhyd7-1.fna.fbcdn.net/v/t39.30808-6/779957641_122130962228365627_2655053558510186934_n.jpg?stp=dst-jpg_tt6&cstp=mx1024x1536&ctp=s1024x1536&_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=y1IwIj347NYQ7kNvwFon37_&_nc_oc=Adp4V0Kww9m7OR4sy07CQJp3HOgA59R81XgD1KWs-sB1-XigOlYhv7i-yx1HAwjRd4A&_nc_zt=23&_nc_ht=scontent.fhyd7-1.fna&_nc_gid=nUBCDhf6n_n-pZxavqnYrQ&_nc_ss=7b2a8&oh=00_AQL1z3WYvAbUfjw43Ann6n4L7h_QVPXxkKRiZosw9elkhw&oe=6A9A3FAE',
        alt: 'Festival Decoration',
      },
       {
        src: 'https://alacritys.in/wp-content/uploads/2024/09/1.-Fairy-Light-Curtains-Ganpati-Decor.jpeg',
        alt: 'Festival Decoration',
      },
      {
        src: 'https://scontent.fhyd7-1.fna.fbcdn.net/v/t39.30808-6/789301249_122130836990365627_2241280489982577902_n.jpg?stp=dst-jpg_tt6&cstp=mx1536x1024&ctp=s1536x1024&_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=9i0dApIdFM8Q7kNvwFf0XZN&_nc_oc=Adrk_InvfzrE_NdzawI9ZLQhME8VzSiTRIlQzpPn5iTufz6oUUuhoFtDmL7DbltSDNc&_nc_zt=23&_nc_ht=scontent.fhyd7-1.fna&_nc_gid=pTiOFtNh4lMYjBSjqIO-RQ&_nc_ss=7b2a8&oh=00_AQK1REII-6-9rox-G5B4AuV4SCGLG3WYx8cHaG0QlEAAXQ&oe=6A9A34B6',
        alt: 'Festival Lights',
      },
      {
        src: 'https://tse1.mm.bing.net/th/id/OIP.ObiViaunjoNYKSCf9zJXDgHaGZ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
        alt: 'Festival Decoration',
      },
        {
        src: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkImTjsF1AFT15fU6Nzum6Gn12-jalgnE3eWRyiDkKk5bsur8d5uDl2VG_mFZd3627ciVRYKYbb_nszpwugXUGCcJdI5bmHRjVZAYKHtNGnIIw4uFg8qqUH-zjrMt6kdVQ6Ygsv2L4mbgH6=s527-k-no',
        alt: 'Shivyoga Shop Products',
      },

      
    ],

  },

  // ---------------------------------------------------
  // G10 - SERVICES
  // ---------------------------------------------------
  {
    id: 'g10',
    cover: 'https://cdn.corenexis.com/f/JYQnENcrpBu.png',
    labelMr: 'सेवा',
    labelEn: 'Services',

    images: [
      {
        src: 'https://cdn.corenexis.com/f/JYQnENcrpBu.png',
        alt: 'Electrical Services',
      },
      {
        src: 'https://cdn.corenexis.com/f/QsfSLWAW5Ky.png',
        alt: 'Electrical Service',
      },
      {
        src: 'https://cdn.corenexis.com/f/zuH2RAgmQdf.png',
        alt: 'Electrical Work',
      },
       {
        src: 'https://cdn.corenexis.com/f/G3RnockAi9F.png',
        alt: 'Electrical Work',
      },
   
    ],
  },
]

// =====================================================
// GALLERY
// =====================================================

export default function Gallery() {
  const { t, pick } = useLanguage()

  // कोणता group open आहे?
  const [activeGroup, setActiveGroup] = useState(null)

  // त्या group मधली कोणती image open आहे?
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // ---------------------------------------------------
  // OPEN GROUP
  // ---------------------------------------------------

  const openGroup = (group) => {
    setActiveGroup(group)
    setActiveImageIndex(0)
  }

  // ---------------------------------------------------
  // CLOSE
  // ---------------------------------------------------

  const closeGallery = () => {
    setActiveGroup(null)
    setActiveImageIndex(0)
  }

  // ---------------------------------------------------
  // NEXT
  // फक्त activeGroup मधल्या images वर काम करेल
  // ---------------------------------------------------

  const nextImage = () => {
    if (!activeGroup) return

    setActiveImageIndex((current) => {
      if (current === activeGroup.images.length - 1) {
        return 0
      }

      return current + 1
    })
  }

  // ---------------------------------------------------
  // PREVIOUS
  // फक्त activeGroup मधल्या images वर काम करेल
  // ---------------------------------------------------

  const previousImage = () => {
    if (!activeGroup) return

    setActiveImageIndex((current) => {
      if (current === 0) {
        return activeGroup.images.length - 1
      }

      return current - 1
    })
  }

  // ---------------------------------------------------
  // KEYBOARD
  // ---------------------------------------------------

  useEffect(() => {
    if (!activeGroup) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeGallery()
      }

      if (activeGroup.images.length > 1) {
        if (e.key === 'ArrowLeft') {
          previousImage()
        }

        if (e.key === 'ArrowRight') {
          nextImage()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [activeGroup])

  // ---------------------------------------------------
  // ACTIVE IMAGE
  // ---------------------------------------------------

  const activeImage = activeGroup
    ? activeGroup.images[activeImageIndex]
    : null

  return (
    <>
      {/* =================================================
          GALLERY SECTION
      ================================================= */}

      <section id="gallery" className="bg-white">

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">

          {/* HEADER */}

          <div className="text-center max-w-2xl mx-auto mb-10">

            <span className="eyebrow justify-center">
              {t('gallery_eyebrow')}
            </span>

            <h2 className="mt-3 font-display font-bold text-2xl md:text-3xl text-navy-700 font-marathi">
              {t('gallery_title')}
            </h2>

            <p className="mt-2 text-navy-400/80 font-marathi text-sm">
              {t('gallery_subtitle')}
            </p>

          </div>

          {/* =================================================
              GROUP GRID
          ================================================= */}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

            {galleryGroups.map((group) => {

              const label = pick(
                group.labelMr,
                group.labelEn
              )

              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => openGroup(group)}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-navy-50 focus-visible:ring-2 focus-visible:ring-gold-500"
                  aria-label={label}
                >

                  {/* COVER IMAGE */}

                  <img
                    src={group.cover}
                    alt={label}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* OVERLAY */}

                  <div className="absolute inset-0 bg-navy-900/10 group-hover:bg-navy-900/30 transition-colors" />

                  {/* IMAGE COUNT */}

                  {group.images.length > 1 && (
                    <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full">
                      📷 {group.images.length}
                    </span>
                  )}

                  {/* LABEL */}

                  <span className="absolute bottom-0 inset-x-0 bg-navy-700/80 text-white text-[11px] font-marathi py-1.5 text-center">
                    {label}
                  </span>

                </button>
              )
            })}

          </div>
        </div>
      </section>

      {/* =================================================
          IMAGE POPUP
      ================================================= */}

      {activeGroup && activeImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={closeGallery}
        >

          {/* CLOSE */}

          <button
            type="button"
            onClick={closeGallery}
            className="absolute top-4 right-4 z-[120] h-11 w-11 rounded-full bg-white/15 hover:bg-white/30 text-white text-3xl flex items-center justify-center"
            aria-label={t('gallery_close')}
          >
            ×
          </button>

          {/* =================================================
              COUNTER
          ================================================= */}

          {activeGroup.images.length > 1 && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[120] bg-black/60 text-white px-4 py-1.5 rounded-full text-sm">
              {activeImageIndex + 1} / {activeGroup.images.length}
            </div>
          )}

          {/* =================================================
              PREVIOUS
              फक्त group मध्ये 2+ images असतील तेव्हाच
          ================================================= */}

          {activeGroup.images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                previousImage()
              }}
              className="absolute left-3 md:left-8 z-[120] h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/15 hover:bg-white/30 text-white text-4xl flex items-center justify-center transition"
              aria-label="Previous image"
            >
              ‹
            </button>
          )}

          {/* =================================================
              IMAGE
          ================================================= */}

          <div
            className="max-w-6xl w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >

            <img
              src={activeImage.src}
              alt={activeImage.alt}
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
            />

            {/* GROUP NAME */}

            <p className="mt-4 text-white font-marathi font-semibold text-base md:text-lg">
              {pick(
                activeGroup.labelMr,
                activeGroup.labelEn
              )}
            </p>

          </div>

          {/* =================================================
              NEXT
              फक्त group मध्ये 2+ images असतील तेव्हाच
          ================================================= */}

          {activeGroup.images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              className="absolute right-3 md:right-8 z-[120] h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/15 hover:bg-white/30 text-white text-4xl flex items-center justify-center transition"
              aria-label="Next image"
            >
              ›
            </button>
          )}

        </div>
      )}
    </>
  )
}
