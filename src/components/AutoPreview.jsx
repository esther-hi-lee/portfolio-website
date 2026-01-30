import React, { useEffect, useState, useRef } from 'react'
import artworks from '../data/artworks.json'
import './AutoPreview.css'

function isVideo(url) {
  return /\.mp4$/i.test(url)
}

export default function AutoPreview() {
  const base = (import.meta && import.meta.env && import.meta.env.BASE_URL) || '/'
  const thumbs = artworks
    .filter(a => a.thumbnail)
    .map(a => `${base}${a.thumbnail.replace(/^\//, '')}`)

  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const videoRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const current = thumbs[index]
    // If current is image, auto-advance after 3s (plus transition)
    if (!isVideo(current)) {
      if (videoRef.current) {
        videoRef.current.onended = null
      }
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        // fade out, then advance
        setVisible(false)
        setTimeout(() => setIndex(i => (i + 1) % thumbs.length), 300)
      }, 3000)
    } else {
      // For video: wait for video to end to advance
      const vid = videoRef.current
      if (vid) {
        vid.currentTime = 0
        vid.muted = true
        vid.play().catch(() => {})
        vid.onended = () => {
          setVisible(false)
          setTimeout(() => setIndex(i => (i + 1) % thumbs.length), 300)
        }
      }
    }

    return () => clearTimeout(timeoutRef.current)
  }, [index])

  // When index changes, fade in the new media after short delay
  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [index])

  const src = thumbs[index]

  return (
    <div className="auto-preview" aria-hidden={false} aria-label="View gallery preview">
      <div className={`media-wrap ${visible ? 'visible' : ''}`}>
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
      <div className="auto-preview-title">Esther H Lee</div>
    </div>
  )
}
