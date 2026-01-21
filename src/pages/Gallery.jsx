import React from 'react'
import { Link } from 'react-router-dom'
import { getCategoryInfo } from './ProjectPage.jsx'
import './Gallery.css'

export default function Gallery() {
  const categories = getCategoryInfo()

  return (
    <div className="gallery-page">
      <header className="gallery-header">
        <h1>Gallery</h1>
        <p className="gallery-subtitle">Browse all collections and projects</p>
      </header>
      
      <div className="gallery-collections">
        {categories.map((category) => (
          <Link 
            key={category.slug} 
            to={`/project/${category.slug}`}
            className="collection-card"
          >
            <div className="collection-thumbnail">
              {category.thumbnail ? (
                <img 
                  src={category.thumbnail} 
                  alt={category.title}
                  loading="lazy"
                />
              ) : (
                <div className="collection-placeholder">
                  <span>🎨</span>
                </div>
              )}
            </div>
            <div className="collection-info">
              <h2 className="collection-title">{category.title}</h2>
              <span className="collection-count">
                {category.items.length} piece{category.items.length !== 1 ? 's' : ''}
              </span>
              <span className="collection-cta">View Collection →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
