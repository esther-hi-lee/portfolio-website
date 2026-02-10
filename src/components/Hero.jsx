

import AutoPreview from './AutoPreview.jsx'

export default function Hero() {
  return (
    <div className="hero" style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <div style={{width: '100%', height: '100%'}}>
        <AutoPreview />
      </div>
    </div>
  )
}
