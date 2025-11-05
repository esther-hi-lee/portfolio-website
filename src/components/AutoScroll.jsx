import React, { useEffect, useMemo, useRef, useState } from 'react'
import './AutoScroll.css'

function pickSrc(item) {
  return (
    item?.image ||
    item?.src ||
    item?.url ||
    item?.imageUrl ||
    item?.thumbnail ||
    item?.thumb ||
    ''
  )
}

function pickAlt(item) {
  return item?.title || item?.name || item?.alt || ''
}

export default function AutoScroll({ items = [], height = 160, gap = 16, speed = 0.15, pauseOnHover = true }) {
  const containerRef = useRef(null)
  const [paused, setPaused] = useState(false)

  const images = useMemo(() => {
    return (items || [])
      .map((it) => ({ src: pickSrc(it), alt: pickAlt(it) }))
      .filter((x) => !!x.src)
  }, [items])

  useEffect(() => {
    const el = containerRef.current
    if (!el || images.length === 0) return

    let rafId
    let lastTs

    const step = (ts) => {
      if (!el) return
      if (lastTs == null) lastTs = ts
      const dt = ts - lastTs
      lastTs = ts

      if (!paused) {
        const delta = dt * speed
        el.scrollLeft += delta
        const half = el.scrollWidth / 2
        if (el.scrollLeft >= half) {
          el.scrollLeft -= half
        }
      }

      rafId = requestAnimationFrame(step)
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [images, speed, paused])

  if (images.length === 0) return null

  const handleEnter = () => pauseOnHover && setPaused(true)
  const handleLeave = () => pauseOnHover && setPaused(false)

  const styleVars = {
    '--gap': `${gap}px`,
    '--height': `${height}px`,
  }

  return (
    <div className="auto-scroll-wrapper" style={styleVars}>
      <div
        className="auto-scroll-container"
        ref={containerRef}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <div className="auto-scroll-track">
          {images.map((img, idx) => (
            <div className="auto-scroll-item" key={`a-${idx}`}>
              <img src={img.src} alt={img.alt} height={height} loading="lazy" />
            </div>
          ))}
          {images.map((img, idx) => (
            <div className="auto-scroll-item" key={`b-${idx}`}>
              <img src={img.src} alt={img.alt} height={height} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
