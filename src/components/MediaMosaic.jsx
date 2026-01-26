import React from 'react'
import { Link } from 'react-router-dom'
import { getCategoryInfo, categoryToSlug } from '../pages/ProjectPage.jsx'
import './MediaMosaic.css'

export default function MediaMosaic() {
  const categories = getCategoryInfo()
  
  return (
    <section className="media-mosaic">
      <div className="container">
        <h2 className="mosaic-title">Explore My Work</h2>
        <p className="mosaic-subtitle">Click on any project to explore the full collection</p>
        
        <div className="mosaic-grid">
          {categories.map((category, index) => (
            <Link 
              key={category.slug} 
              to={`/project/${category.slug}`}
              className={`mosaic-item mosaic-item-${index % 6}`}
            >
              <div className="mosaic-image-wrapper">
                {category.thumbnail ? (
                  category.thumbnail.toLowerCase().endsWith('.mp4') ? (
                    <video 
                      src={category.thumbnail} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      preload="auto"
                    />
                  ) : (
                    <img 
                      src={category.thumbnail} 
                      alt={category.title}
                      loading="lazy"
                    />
                  )
                ) : (
                  <div className="mosaic-placeholder">
                    <span>🎨</span>
                  </div>
                )}
                <div className="mosaic-overlay">
                  <h3 className="mosaic-item-title">{category.title}</h3>
                  <span className="mosaic-item-count">
                    {category.items.length} piece{category.items.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
