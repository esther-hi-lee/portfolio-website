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

  // double-buffered layers: 0 and 1
  const [activeLayer, setActiveLayer] = useState(0)
  const layersRef = useRef([null, null]) // { src, type }
  const layerLoadedRef = useRef([false, false])
  const advanceTimerRef = useRef(null)
  const loadTimeoutRef = useRef(null)

  // helper: get current source and type
  const getSrcForIndex = (i) => {
    if (useFallback) return { src: fallbackSrcs[i % fallbackSrcs.length], type: 'image' }
    const s = thumbs[i % thumbs.length]
    return { src: s, type: isVideo(s) ? 'video' : 'image' }
  }

  // preload into off-DOM element (Image or video element) and resolve when ready
  function preloadMedia(src, type) {
    return new Promise((resolve, reject) => {
      if (type === 'image') {
        const img = new Image()
        img.src = src
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('image load failed'))
      } else {
        const v = document.createElement('video')
        v.src = src
        v.preload = 'auto'
        v.muted = true
        // canplay indicates enough data to play
        const onCan = () => { cleanup(); resolve() }
        const onErr = () => { cleanup(); reject(new Error('video load failed')) }
        function cleanup() { v.removeEventListener('canplay', onCan); v.removeEventListener('error', onErr); }
        v.addEventListener('canplay', onCan)
        v.addEventListener('error', onErr)
        // call load explicitly
        try { v.load() } catch (e) {}
      }
    })
  }

  // clear any pending advance timers
  function clearAdvance() {
    if (advanceTimerRef.current) { clearTimeout(advanceTimerRef.current); advanceTimerRef.current = null }
    if (loadTimeoutRef.current) { clearTimeout(loadTimeoutRef.current); loadTimeoutRef.current = null }
  }

  // prepare layer (other than active) with given index, then crossfade when ready
  useEffect(() => {
    clearAdvance()
    const nextIndex = index
    const nextLayer = 1 - activeLayer
    const { src, type } = getSrcForIndex(nextIndex)

    // start load timeout: if not ready within VIDEO_LOAD_TIMEOUT_MS, fallback
    loadTimeoutRef.current = setTimeout(() => {
      // only trigger fallback if it's a video
      if (type === 'video') {
        setUseFallback(true)
        setIndex(0)
      }
    }, VIDEO_LOAD_TIMEOUT_MS)

    preloadMedia(src, type)
      .then(() => {
        clearTimeout(loadTimeoutRef.current)
        layersRef.current[nextLayer] = { src, type }
        layerLoadedRef.current[nextLayer] = true
        // after setting data, let React render layer with src; then crossfade
        // small timeout to allow DOM update
        setTimeout(() => {
          setActiveLayer(nextLayer)
          // when showing an image, auto-advance after 3s
          if (type === 'image') {
            clearAdvance()
            advanceTimerRef.current = setTimeout(() => {
              setIndex(i => (i + 1) % (useFallback ? fallbackSrcs.length : thumbs.length))
            }, 3000)
          }
        }, 50)
      })
      .catch(() => {
        clearTimeout(loadTimeoutRef.current)
        // fallback to images if video fails
        setUseFallback(true)
        setIndex(0)
      })

    return () => clearAdvance()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  // when active layer changes and it's a video, start playback and set onended
  useEffect(() => {
    const layer = layersRef.current[activeLayer]
    if (!layer) return
    if (layer.type === 'video') {
      const vid = document.querySelector(`.auto-preview video[data-layer=\"${activeLayer}\"]`)
      if (vid) {
        vid.currentTime = 0
        vid.muted = true
        vid.play().catch(() => {})
        vid.onended = () => {
          setIndex(i => (i + 1) % thumbs.length)
        }
        vid.onerror = () => {
          setUseFallback(true)
          setIndex(0)
        }
      }
    }
    // if image, advance handled in preload effect
  }, [activeLayer, useFallback])

  // initial load: set index 0 into layer 0 so effect can manage next loads
  useEffect(() => {
    const initial = getSrcForIndex(0)
    layersRef.current[0] = initial
    layerLoadedRef.current[0] = true
    setActiveLayer(0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // cleanup on unmount
  useEffect(() => () => { clearAdvance() }, [])

  const renderLayer = (layerIdx) => {
    const data = layersRef.current[layerIdx]
    const visible = layerIdx === activeLayer
    if (!data) return <div key={layerIdx} className={`media-layer ${visible ? 'visible' : ''}`} />
    if (data.type === 'video') {
      return (
        <div key={layerIdx} className={`media-layer ${visible ? 'visible' : ''}`}>
          <video data-layer={layerIdx} src={data.src} playsInline muted preload="auto" />
        </div>
      )
    }
    return (
      <div key={layerIdx} className={`media-layer ${visible ? 'visible' : ''}`}>
        <img src={data.src} alt="gallery thumbnail" />
      </div>
    )
  }

  return (
    <div className="auto-preview" aria-hidden={false} aria-label="View gallery preview">
      <div className="media-wrap visible">
        {renderLayer(0)}
        {renderLayer(1)}
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
