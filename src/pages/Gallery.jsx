import React, { useMemo } from 'react'
import GalleryGrid from '../components/GalleryGrid.jsx'
import artworks from '../data/artworks.json'
import PhotoCarousel from '../components/PhotoCarousel.jsx'
import { isYouTube, toYouTubeEmbedUrl } from '../utils/media.js'

// Derive a group title from the image path's subfolders inside /assets.
// Example: /assets/Paintings/Landscapes/img.jpg -> "Paintings / Landscapes"
function getGroupFromImagePath(src = '') {
  if (!src) return 'Uncategorized'
  try {
    const parts = src.split('/').filter(Boolean)
    const idx = parts.indexOf('assets')
    if (idx >= 0 && idx < parts.length - 1) {
      const sub = parts.slice(idx + 1, parts.length - 1)
      if (sub.length) return decodeURIComponent(sub.join(' / '))
    }
  } catch {
    // noop
  }
  return 'Uncategorized'
}

function groupArtworks(items) {
  const map = new Map()
  for (const item of items) {
    const key = (item.category && item.category.trim()) || getGroupFromImagePath(item.image)
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(item)
  }
  // Sort alphabetically, put "Uncategorized" at the end
  const keys = Array.from(map.keys()).sort((a, b) => {
    if (a === 'Uncategorized' && b !== 'Uncategorized') return 1
    if (b === 'Uncategorized' && a !== 'Uncategorized') return -1
    return a.localeCompare(b)
  })
  // Build grouped payload without reordering; we'll separate video vs photos in render
  return keys.map(k => ({ title: k, items: map.get(k) || [] }))
}

export default function Gallery() {
  const groups = useMemo(() => groupArtworks(artworks), [])

  return (
    <>
      <h2 style={{marginTop: '2rem'}}>Gallery</h2>
      {groups.map(({ title, items }, idx) => {
        const videoItem = items.find(i => i.video || i.youtube || i.youtubeId)
        const photos = items.filter(i => !(i.video || i.youtube || i.youtubeId))
        const hasVideo = Boolean(videoItem)

        return (
          <details key={title} open={idx === 0} style={{ margin: '1rem 0' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, padding: '.5rem 0' }}>
              {title} <span style={{ color: 'var(--muted)' }}>({items.length})</span>
            </summary>
            {hasVideo && (
              <div style={{ marginBottom: '1rem' }}>
                <article className="card col-12">
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
                      {(videoItem.year || '') + (videoItem.medium ? (videoItem.year ? ' • ' : '') + videoItem.medium : '') + (videoItem.size ? ' • ' + videoItem.size : '')}
                    </div>
                  </div>
                </article>
              </div>
            )}

            {!hasVideo && <GalleryGrid items={photos} />}
            {hasVideo && <PhotoCarousel items={photos} />}
          </details>
        )
      })}
    </>
  )
}
