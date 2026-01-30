

import AutoPreview from './AutoPreview.jsx'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="preview-container" style={{marginTop: 0}}>
          <AutoPreview />
        </div>
      </div>
    </section>
  )
}
