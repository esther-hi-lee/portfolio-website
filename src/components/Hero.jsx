

import AutoPreview from './AutoPreview.jsx'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="preview-container" style={{marginTop: '1rem'}}>
          <AutoPreview />
        </div>
      </div>
    </section>
  )
}
