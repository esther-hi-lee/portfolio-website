import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Hero from '../components/Hero.jsx'
import AboutPage from './AboutPage.jsx'
import ContactPage from './ContactPage.jsx'
import artworks from '../data/artworks.json'
import { getCategoryInfo, categoryToSlug } from './ProjectPage.jsx'
import { isYouTube, toYouTubeEmbedUrl } from '../utils/media.js'

/* ─── Full-screen project gallery section ─── */
function ProjectGallerySection({ category, onClose }) {
  const base = (import.meta && import.meta.env && import.meta.env.BASE_URL) || '/'
  const { title, items, galleryDescription } = category
  const videoItem = items.find(i => i.video || i.youtube || i.youtubeId)
  const photos = items.filter(i => !(i.video || i.youtube || i.youtubeId))
  const hasVideo = Boolean(videoItem)
  const programsItem = items.find(item => item.programs)
  const programs = programsItem?.programs

  const [lightboxPhoto, setLightboxPhoto] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const openLightbox = (photo, index) => { setLightboxPhoto(photo); setLightboxIndex(index) }
  const closeLightbox = () => setLightboxPhoto(null)
  const goToPrev = (e) => {
    e.stopPropagation()
    const i = lightboxIndex > 0 ? lightboxIndex - 1 : photos.length - 1
    setLightboxIndex(i); setLightboxPhoto(photos[i])
  }
  const goToNext = (e) => {
    e.stopPropagation()
    const i = lightboxIndex < photos.length - 1 ? lightboxIndex + 1 : 0
    setLightboxIndex(i); setLightboxPhoto(photos[i])
  }

  return (
    <div className="project-gallery-fullscreen">
      {/* Top bar with back button and title */}
      <div className="project-gallery-topbar">
        <button
          className="project-gallery-back"
          onClick={onClose}
          aria-label="Back to projects"
        >
          ← Back to Projects
        </button>
        <p className="project-gallery-title">{title}</p>
        <div style={{ width: 140 }} />{/* spacer for centering */}
      </div>

      {/* Main content area - no scroll, fits in viewport */}
      <div className="project-gallery-main">
        {/* Left: Video or hero photo */}
        <div className="project-gallery-media">
          {hasVideo && (
            <div className="pdf-video-section">
              <div className="pdf-video-card">
                {(videoItem.youtube || videoItem.youtubeId) ? (
                  <iframe
                    src={toYouTubeEmbedUrl(videoItem.youtube || videoItem.youtubeId)}
                    title={videoItem.title || 'YouTube video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <video controls preload="metadata" playsInline poster={videoItem.poster || videoItem.image || undefined}>
                    <source src={videoItem.video} />
                  </video>
                )}
              </div>
            </div>
          )}

          {!hasVideo && photos.length > 0 && (
            <div className="pdf-hero-section" style={{ marginBottom: 0 }}>
              <div className="pdf-hero-photo" onClick={() => openLightbox(photos[0], 0)}>
                <img src={photos[0].image} alt={photos[0].title} />
              </div>
            </div>
          )}

          {/* Process photos - compact scrollable strip below video/photo */}
          {(() => {
            const gridPhotos = hasVideo ? photos : photos.slice(1)
            return gridPhotos.length > 0 && (
              <div className="project-gallery-process">
                <div className="project-gallery-process-strip">
                  {gridPhotos.map((photo) => {
                    const originalIndex = photos.indexOf(photo)
                    return (
                      <div key={photo.id} className="process-thumb" onClick={() => openLightbox(photo, originalIndex)}>
                        <img src={photo.image} alt={photo.title} loading="lazy" />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}
        </div>

        {/* Right: Project info */}
        <div className="project-gallery-info">
          <h1 className="pdf-title">{title}</h1>
          <p className="pdf-subtitle">
            {items.length} piece{items.length !== 1 ? 's' : ''}
            {hasVideo && ' • Includes video'}
          </p>
          {galleryDescription && <p className="pdf-description">{galleryDescription}</p>}
          {programs && <p className="pdf-programs"><strong>Programs Used:</strong> {programs}</p>}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxPhoto && createPortal(
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={(e) => { e.stopPropagation(); closeLightbox() }}>×</button>
          <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); goToPrev(e) }}>‹</button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxPhoto.image} alt={lightboxPhoto.title} />
            {lightboxPhoto.title && <p className="lightbox-caption">{lightboxPhoto.title}</p>}
            {lightboxPhoto.subcaption && (
              <div className="lightbox-credits">
                {Array.isArray(lightboxPhoto.subcaption)
                  ? lightboxPhoto.subcaption.map((line, i) => <p key={i}>{line}</p>)
                  : <p>{lightboxPhoto.subcaption}</p>}
              </div>
            )}
            <p className="lightbox-counter">{lightboxIndex + 1} / {photos.length}</p>
          </div>
          <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); goToNext(e) }}>›</button>
        </div>,
        document.body
      )}
    </div>
  )
}

// Mosaic gallery with thumbnails in natural proportions
function SimpleGalleryGrid({ onProjectClick }) {
  const base = (import.meta && import.meta.env && import.meta.env.BASE_URL) || '/'
  
  // Map project IDs to ensure we get the exact items we want
  const projectIds = [
    'P5-video',  // Reminisce City Scene
    'P7-video',  // Let's Make Breakfast
    '5',         // Drowsy Cinematic Nature Scene
    'P3-process-1', // Resting Point Scene
    '1',         // A Hungry Hamster
    'P6-slide-first'  // Nerve Game Concept
  ]

  const thumbnails = projectIds.map((id, idx) => {
    const item = artworks.find(a => a.id === id && a.thumbnail)
    return item ? {
      id: item.id || idx,
      image: item.thumbnail,
      title: item.title || item.category,
      category: item.category
    } : null
  }).filter(Boolean)

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '0.5rem',
      width: '95%',
      maxWidth: '1800px',
      margin: '0 auto',
      padding: '1rem',
      gridAutoFlow: 'dense',
      alignItems: 'start'
    }}>
      {thumbnails.map(item => {
        const src = `${base}${item.image.replace(/^\//, '')}`
        const isVideo = /\.mp4$/i.test(src)
        
        return (
          <div key={item.id} style={{
            width: '100%',
            aspectRatio: '12/7',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onClick={() => onProjectClick(item.category)}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.02)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)'
            e.currentTarget.style.zIndex = '10'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)'
            e.currentTarget.style.zIndex = '1'
          }}
          >
            {isVideo ? (
              <video
                src={src}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                src={src}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(null)
  const gallerySectionRef = useRef(null)
  const containerRef = useRef(null)

  const categories = getCategoryInfo()

  const handleProjectClick = (categoryName) => {
    const cat = categories.find(c => c.title === categoryName)
    if (cat) {
      setSelectedProject(cat)
    }
  }

  const handleCloseGallery = () => {
    setSelectedProject(null)
    // Scroll back to the projects section
    setTimeout(() => {
      const projectsSection = document.getElementById('projects')
      if (projectsSection && containerRef.current) {
        containerRef.current.scrollTo({
          top: projectsSection.offsetTop,
          behavior: 'smooth'
        })
      }
    }, 50)
  }

  // Scroll to gallery section when a project is selected
  useEffect(() => {
    if (selectedProject && gallerySectionRef.current && containerRef.current) {
      setTimeout(() => {
        gallerySectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    }
  }, [selectedProject])

  // On mount, reset any native scroll offset caused by hash fragments
  useEffect(() => {
    // Fix browser's native hash scroll breaking layout
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [])

  return (
    <div className="scroll-snap-container" ref={containerRef}>
      <section id="home" className="full-screen-section">
        <Hero />
      </section>

      <section id="projects" className="full-screen-section">
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 600,
          margin: '0 0 2rem 0',
          color: 'var(--text)',
          position: 'absolute',
          top: '6rem',
          zIndex: 5
        }}>Projects</h1>
        <SimpleGalleryGrid onProjectClick={handleProjectClick} />
      </section>

      {selectedProject && (
        <section id="project-gallery" className="full-screen-section gallery-section" ref={gallerySectionRef}>
          <ProjectGallerySection
            key={selectedProject.slug}
            category={selectedProject}
            onClose={handleCloseGallery}
          />
        </section>
      )}

      <section id="about" className="full-screen-section">
        <AboutPage />
      </section>

      <section id="contact" className="full-screen-section">
        <ContactPage />
      </section>
    </div>
  )
}
