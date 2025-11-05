
import React from 'react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <h1>Art Portfolio</h1>
        <p>Splash text if you want it</p>
        <div style={{marginTop: '1rem'}}>
          <Link to="/gallery" className="btn">View Gallery</Link>
        </div>
      </div>
    </section>
  )
}
