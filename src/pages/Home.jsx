import React from 'react'
import Hero from '../components/Hero.jsx'
import GalleryGrid from '../components/GalleryGrid.jsx'
import artworks from '../data/artworks.json'
import AutoScroll from '../components/AutoScroll.jsx'

export default function Home() {
  // Show first 6 as a teaser
  const featured = artworks.slice(0, 6)
  return (
    <>
      <Hero />
      <AutoScroll items={artworks} height={320} speed={0.075} />
    </>
  )
}
