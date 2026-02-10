import React from 'react'

export default function Navbar() {
  const handleNavClick = (e, id) => {
    e.preventDefault()
    const targetSection = document.getElementById(id)
    if (!targetSection) return
    
    // Scroll within the snap container
    const container = targetSection.closest('.scroll-snap-container')
    if (container) {
      container.scrollTo({
        top: targetSection.offsetTop,
        behavior: 'smooth'
      })
    }
  }
  
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="nav-brand">
          <a href="/" onClick={(e) => handleNavClick(e, 'home')} style={{fontWeight:800, textDecoration:'none', color:'inherit'}}>Esther Hyo In Lee</a>
        </div>
        <nav>
          <a href="/" onClick={(e) => handleNavClick(e, 'home')}>Home</a>
          <a href="/" onClick={(e) => handleNavClick(e, 'projects')}>Projects</a>
          <a href="/" onClick={(e) => handleNavClick(e, 'about')}>About</a>
          <a href="/" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a>
        </nav>
      </div>
    </header>
  )
}
