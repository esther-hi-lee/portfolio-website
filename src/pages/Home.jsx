import React from 'react'
import Hero from '../components/Hero.jsx'
import MediaMosaic from '../components/MediaMosaic.jsx'
import Gallery from './Gallery.jsx'
import AboutPage from './AboutPage.jsx'
import ContactPage from './ContactPage.jsx'

export default function Home() {
  return (
    <>
      <section id="home" className="section">
        <Hero />
      </section>

      <section id="about" className="section">
        <AboutPage />
      </section>

      <section id="projects" className="section">
        <Gallery />
      </section>

      <section id="contact" className="section">
        <ContactPage />
      </section>
    </>
  )
}
