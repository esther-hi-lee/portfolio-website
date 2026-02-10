import React from 'react'

export default function Navbar() {
  const handleNavClick = (e, id) => {
    e.preventDefault()
    const targetSection = document.getElementById(id)
    if (!targetSection) return
    
    // Use scrollIntoView which works perfectly with scroll-snap
    targetSection.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    })
    
    // Update URL hash without jumping
    history.replaceState(null, '', `#${id}`)
  }
  
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="nav-brand">
          <a href="#home" onClick={(e) => handleNavClick(e, 'home')} style={{fontWeight:800, textDecoration:'none', color:'inherit'}}>Esther Hyo In Lee</a>
        </div>
        <nav>
          <a href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a>
          <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')}>Projects</a>
          <a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a>
        </nav>
      </div>
    </header>
  )
}
