import { useEffect, useRef } from 'react'

const FULL_TEXT = '// FiveM · Los Santos · Est. 2025'

export default function Hero() {
  const tagRef = useRef(null)
  const gridRef = useRef(null)

  // Typing cursor effect
  useEffect(() => {
    const el = tagRef.current
    if (!el) return
    el.textContent = ''
    let i = 0
    let stopped = false
    el.style.borderRight = '1px solid rgba(255,255,255,0.4)'
    el.style.paddingRight = '4px'

    const timerId = setTimeout(() => {
      const type = () => {
        if (stopped) return
        if (i < FULL_TEXT.length) {
          el.textContent += FULL_TEXT[i++]
          setTimeout(type, 55)
        } else {
          el.style.borderRight = 'none'
        }
      }
      type()
    }, 500)

    return () => {
      stopped = true
      clearTimeout(timerId)
      el.textContent = FULL_TEXT
      el.style.borderRight = 'none'
    }
  }, [])

  // Mouse parallax on the grid
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      grid.style.transform = `translate(${x}px, ${y}px)`
    }
    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  const scrollTo = (e, id) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero">
      <div className="hero-bg" />
      <div className="hero-grid" ref={gridRef} />

      <div className="hero-content">
        <p className="hero-tag" ref={tagRef}>{FULL_TEXT}</p>
        <h1 className="hero-title glitch">GBG</h1>
        <p className="hero-subtitle">Go Broke Gang</p>
        <div className="hero-divider" />
        <p className="hero-desc">
          We don&apos;t chase respect — we take it.<br />
          Black &amp; White. No shades of grey.
        </p>
        <div className="hero-cta">
          <a href="#join" className="btn btn-primary" onClick={(e) => scrollTo(e, 'join')}>
            Join the Gang
          </a>
          <a href="#about" className="btn btn-secondary" onClick={(e) => scrollTo(e, 'about')}>
            Learn More
          </a>
        </div>
      </div>

      <div className="scroll-indicator">
        <span>Scroll</span>
        <div className="arrow" />
      </div>
    </section>
  )
}
