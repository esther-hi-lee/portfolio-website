import React, { useEffect, useState, useRef } from 'react'
import artworks from '../data/artworks.json'
import './AutoPreview.css'

function isVideo(url) {
  return /\.mp4$/i.test(url)
}

export default function AutoPreview() {
  const base = (import.meta && import.meta.env && import.meta.env.BASE_URL) || '/'
  const thumbs = artworks
  .filter(a => a.thumbnail && isVideo(a.thumbnail))
  .map(a => `${base}${a.thumbnail.replace(/^\//, '')}`)

  const [index, setIndex] = useState(0)
  const videoRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const current = thumbs[index]
    // If current is image, auto-advance after 3s
    if (!isVideo(current)) {
      if (videoRef.current) {
        videoRef.current.onended = null
      }
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setIndex(i => (i + 1) % thumbs.length)
      }, 3000)
    } else {
      // For video: wait for video to end to advance
      const vid = videoRef.current
      if (vid) {
        vid.currentTime = 0
        vid.muted = true
        vid.play().catch(() => {})
        vid.onended = () => {
          setIndex(i => (i + 1) % thumbs.length)
        }
      }
    }

    return () => clearTimeout(timeoutRef.current)
  }, [index])

  const src = thumbs[index]

  return (
    <div className="auto-preview" aria-hidden={false} aria-label="View gallery preview">
      <div className="media-wrap visible">
        {isVideo(src) ? (
          <video
            ref={videoRef}
            src={src}
            className="media"
            playsInline
            muted
            preload="auto"
          />
        ) : (
          <img src={src} alt="gallery thumbnail" className="media" />
        )}
      </div>
      <div className="auto-preview-title">
        <div>Esther H Lee</div>
        <div style={{
          fontSize: '0.5em',
          opacity: 0.75,
          marginTop: '0.5rem',
          fontWeight: 400
        }}>Game and Entertainment Design</div>
      </div>
    </div>
  )
}
