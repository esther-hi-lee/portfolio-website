import React from 'react'
import { useTheme } from '../context/ThemeContext.jsx'

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme()

  const handleNavClick = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const nav = document.querySelector('.nav')
    const navHeight = nav ? nav.offsetHeight : 64
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 8
    window.scrollTo({ top, behavior: 'smooth' })
    // update hash without jumping
    history.replaceState(null, '', `#${id}`)
  }
  
  return (
    <header className="nav">
      <div className="container nav-inner">
        <div className="nav-brand">
          <a href="#home" style={{fontWeight:800, textDecoration:'none', color:'inherit'}}>Esther Hyo In Lee</a>
        </div>
        <nav>
          <a href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a>
          <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')}>Projects</a>
          <a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a>
          <button 
            onClick={toggleDarkMode} 
            className="dark-mode-toggle"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}
