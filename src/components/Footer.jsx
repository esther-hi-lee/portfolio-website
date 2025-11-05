
import React from 'react'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container">
        © {year} Esther Hyo In Lee • All rights reserved
      </div>
    </footer>
  )
}
