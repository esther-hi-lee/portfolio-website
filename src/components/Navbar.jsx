import React from 'react'
import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }) => isActive ? 'active' : ''

export default function Navbar() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <NavLink to="/" style={{fontWeight:700, textDecoration:'none', color:'inherit'}}>Esther Hyo In Lee</NavLink>
        <nav>
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/gallery" className={linkClass}>Gallery</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
        </nav>
      </div>
    </header>
  )
}
