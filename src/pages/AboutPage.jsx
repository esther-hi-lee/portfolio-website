
import React from 'react'

export default function AboutPage() {
  return (
    <div className="about-page" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%'
    }}>
      <header className="gallery-header" style={{marginBottom: '2rem'}}>
        <h1 style={{fontSize: '3rem', margin: 0}}>About</h1>
      </header>

      <div className="container" style={{maxWidth: 800, textAlign: 'center'}}>
        <p style={{fontSize: '1.1rem', lineHeight: '1.8'}}>
          Esther Hyo In Lee is a Game and Entertainment Design student at Otis College of Art and Design. In her work, she focuses on detail, storytelling, functionality, and investigation of play. As a creative, Lee seeks spaces heavily driven by teamwork, innovation, and problem solving.
        </p>

        <div className="about-socials" style={{marginTop: '2rem'}}>
          <a href="https://www.instagram.com/everythingsprecious/" aria-label="Instagram" className="social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>

          <a href="https://www.linkedin.com/in/esther-hyo-in-lee-6812b0233/" aria-label="LinkedIn" className="social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
