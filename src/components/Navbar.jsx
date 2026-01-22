import React from 'react'
import { NavLink, Link } from 'react-router-dom'

const linkClass = ({ isActive }) => isActive ? 'active' : ''

export default function Navbar() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <div className="nav-brand">
          <Link to="/" style={{fontWeight:700, textDecoration:'none', color:'inherit'}}>Esther Hyo In Lee</Link>
          <div className="nav-social-icons">
            <a href="https://www.instagram.com/everythingsprecious/" aria-label="Instagram" className="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/esther-hyo-in-lee-6812b0233/" aria-label="LinkedIn" className="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </div>
        <nav>
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/gallery" className={linkClass}>Projects</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </nav>
      </div>
    </header>
  )
}
