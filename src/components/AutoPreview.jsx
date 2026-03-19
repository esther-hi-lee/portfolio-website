import React, { useEffect, useState, useRef } from 'react'
import artworks from '../data/artworks.json'
import './AutoPreview.css'

function isVideo(url) {
  return /\.mp4$/i.test(url)
}

const FALLBACK_IMAGES = [
  'assets/Homepage Static Fading Transitions 3-18/Copy of Game Level Overall Shot.png',
  'assets/Homepage Static Fading Transitions 3-18/Copy of Mini Game Mechanic 3.png',
  'assets/Homepage Static Fading Transitions 3-18/Copy of Resting Point Thumbnail.png',
  'assets/Homepage Static Fading Transitions 3-18/Copy of process pic city 1.png',
  'assets/Homepage Static Fading Transitions 3-18/Copy of process pic hamster3.png',
  'assets/Homepage Static Fading Transitions 3-18/Copy of process pic nature scene 3.png',
]

const VIDEO_LOAD_TIMEOUT_MS = 3000

export default function AutoPreview() {
  const base = (import.meta && import.meta.env && import.meta.env.BASE_URL) || '/'
  const thumbs = artworks
    .filter(a => a.thumbnail && isVideo(a.thumbnail))
    .map(a => `${base}${a.thumbnail.replace(/^\//, '')}`)

  const fallbackSrcs = FALLBACK_IMAGES.map(p => `${base}${p}`)

  const [index, setIndex] = useState(0)
  const [useFallback, setUseFallback] = useState(false)
  const videoRef = useRef(null)
  const timeoutRef = useRef(null)
  const loadTimeoutRef = useRef(null)

  // Fallback image slideshow
  useEffect(() => {
    if (!useFallback) return
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setIndex(i => (i + 1) % fallbackSrcs.length)
    }, 3000)
    return () => clearTimeout(timeoutRef.current)
  }, [useFallback, index, fallbackSrcs.length])

  // Video playback logic
  useEffect(() => {
    if (useFallback) return

    const current = thumbs[index]
    if (!isVideo(current)) {
      if (videoRef.current) videoRef.current.onended = null
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setIndex(i => (i + 1) % thumbs.length)
      }, 3000)
    } else {
      const vid = videoRef.current
      if (vid) {
        vid.currentTime = 0
        vid.muted = true

        // Start a load timeout — if video doesn't play in time, fall back
        clearTimeout(loadTimeoutRef.current)
        loadTimeoutRef.current = setTimeout(() => {
          if (vid.readyState < 3) {
            setUseFallback(true)
            setIndex(0)
          }
        }, VIDEO_LOAD_TIMEOUT_MS)

        vid.play()
          .then(() => clearTimeout(loadTimeoutRef.current))
          .catch(() => {
            clearTimeout(loadTimeoutRef.current)
            setUseFallback(true)
            setIndex(0)
          })

        vid.onended = () => {
          setIndex(i => (i + 1) % thumbs.length)
        }
        vid.onerror = () => {
          clearTimeout(loadTimeoutRef.current)
          setUseFallback(true)
          setIndex(0)
        }
      }
    }

    return () => {
      clearTimeout(timeoutRef.current)
      clearTimeout(loadTimeoutRef.current)
    }
  }, [useFallback, index])

  const src = useFallback
    ? fallbackSrcs[index % fallbackSrcs.length]
    : thumbs[index]

  return (
    <div className="auto-preview" aria-hidden={false} aria-label="View gallery preview">
      <div className="media-wrap visible">
        {!useFallback && isVideo(src) ? (
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
