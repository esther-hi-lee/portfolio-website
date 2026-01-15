
import React from 'react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <h1>Art Portfolio</h1>
        <p>A collection of my artwork showcasing various projects and styles.</p>
        <div style={{marginTop: '1rem'}}>
          <Link to="/gallery" className="btn">View Gallery</Link>
        </div>
      </div>
    </section>
  )
}
