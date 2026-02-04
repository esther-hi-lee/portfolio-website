import React from 'react'

export default function Navbar() {
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
        </nav>
      </div>
    </header>
  )
}
