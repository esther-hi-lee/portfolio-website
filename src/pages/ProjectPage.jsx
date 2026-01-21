import React, { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import artworks from '../data/artworks.json'
import PhotoCarousel from '../components/PhotoCarousel.jsx'
import GalleryGrid from '../components/GalleryGrid.jsx'
import { InteractiveScroll } from '../components/InteractiveScrollSimple.jsx'
import { isYouTube, toYouTubeEmbedUrl } from '../utils/media.js'

// Convert category to URL-friendly slug
export function categoryToSlug(category) {
  return category
    .toLowerCase()
    .replace(/[""]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Get unique categories from artworks
export function getCategories() {
  const categories = new Set()
  artworks.forEach(item => {
    if (item.category) {
      categories.add(item.category)
    }
  })
  return Array.from(categories).sort()
}

// Get category info with slug and thumbnail
export function getCategoryInfo() {
  const categoryMap = new Map()
  
  artworks.forEach(item => {
    if (item.category) {
      if (!categoryMap.has(item.category)) {
        categoryMap.set(item.category, {
          title: item.category,
          slug: categoryToSlug(item.category),
          items: [],
          thumbnail: null
        })
      }
      const cat = categoryMap.get(item.category)
      cat.items.push(item)
      // Use first image as thumbnail if not set
      if (!cat.thumbnail && item.image) {
        cat.thumbnail = item.image
      }
    }
  })
  
  return Array.from(categoryMap.values()).sort((a, b) => a.title.localeCompare(b.title))
}

export default function ProjectPage() {
  const { slug } = useParams()
  
  const projectData = useMemo(() => {
    const categories = getCategoryInfo()
    return categories.find(cat => cat.slug === slug)
  }, [slug])
  
  if (!projectData) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <Link to="/gallery" className="back-link">← Back to Gallery</Link>
        <h2>Project Not Found</h2>
        <p>The project you're looking for doesn't exist.</p>
      </div>
    )
  }
  
  const { title, items } = projectData
  const videoItem = items.find(i => i.video || i.youtube || i.youtubeId)
  const photos = items.filter(i => !(i.video || i.youtube || i.youtubeId))
  const hasVideo = Boolean(videoItem)
  
  // Check if any photos have descriptions - if so, use interactive scroll layout
  const hasDescriptions = photos.some(item => item.description && item.description.trim())
  
  // Convert photos to interactive scroll format if descriptions exist
  const interactiveItems = hasDescriptions ? photos.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description || '',
    media: {
      type: 'image',
      src: item.image,
      alt: item.title
    }
  })) : []
  
  return (
    <div className="project-page">
      <Link to="/gallery" className="back-link">← Back to Gallery</Link>
      
      <header className="project-header">
        <h1>{title}</h1>
        <p className="project-count">{items.length} piece{items.length !== 1 ? 's' : ''}</p>
      </header>
      
      {hasVideo && (
        <section className="project-video">
          <article className="card">
            {isYouTube(videoItem.youtube || videoItem.youtubeId || videoItem.video) ? (
              <iframe
                src={toYouTubeEmbedUrl(videoItem.youtube || videoItem.youtubeId || videoItem.video)}
                title={videoItem.title || 'YouTube video'}
                style={{ width: '100%', aspectRatio: '16 / 9', border: 0, background: '#000' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video
                controls
                preload="metadata"
                playsInline
                poster={videoItem.poster || videoItem.image || undefined}
                style={{ width: '100%', display: 'block', background: '#000' }}
              >
                <source src={videoItem.video} />
                Your browser does not support the video tag.
              </video>
            )}
            <div className="card-body">
              <h3 className="card-title">{videoItem.title}</h3>
              <div className="card-meta">
                {(videoItem.year || '') + 
                 (videoItem.medium ? (videoItem.year ? ' • ' : '') + videoItem.medium : '') + 
                 (videoItem.size ? ' • ' + videoItem.size : '')}
              </div>
            </div>
          </article>
        </section>
      )}
      
      {photos.length > 0 && hasDescriptions ? (
        <InteractiveScroll
          headerTitle="Process & Gallery"
          headerSubtitle="Scroll through the creative journey behind this project"
          items={interactiveItems}
          className="project-interactive-scroll"
        />
      ) : photos.length > 0 && (
        <section className="project-gallery">
          <h2>Process & Gallery</h2>
          {hasVideo ? (
            <PhotoCarousel items={photos} />
          ) : (
            <GalleryGrid items={photos} />
          )}
        </section>
      )}
    </div>
  )
}
