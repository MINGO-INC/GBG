import { useState, useEffect, useRef } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { fetchStats } from '../api/api'

const DEFAULT_STATS = { memberCount: 50, loyalty: 100, ranking: 1 }

function StatBox({ value, suffix, label }) {
  const boxRef = useRef(null)
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let current = 0
          const step = Math.max(1, Math.ceil(value / 75))
          const tick = () => {
            current = Math.min(current + step, value)
            setDisplayed(current)
            if (current < value) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          observer.unobserve(el)
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return (
    <div className="stat-box" ref={boxRef}>
      <div className="stat-number">
        {displayed}
        {suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function About() {
  const textRef = useScrollReveal()
  const statsRef = useScrollReveal(150)
  const [stats, setStats] = useState(DEFAULT_STATS)

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch(() => {}) // use defaults if backend is unavailable
  }, [])

  return (
    <section id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-text reveal" ref={textRef}>
            <p className="section-tag">// Who We Are</p>
            <h2 className="section-title">
              About
              <br />
              GBG
            </h2>
            <div className="section-line" />
            <p>
              <strong>GBG (Go Broke Gang)</strong> is one of Los Santos&apos; most feared
              crews on the FiveM server. We started with nothing and built an empire
              on loyalty, grit, and raw street hustle.
            </p>
            <p>
              Our colors are <strong>black and white</strong> — because there are no
              grey areas when it comes to respect. You&apos;re either with us or you&apos;re not.
            </p>
            <p>
              We run the streets, run the rackets, and ride together no matter what.
              If you want in, you better be ready to earn your stripes.
            </p>
          </div>

          <div className="about-stats reveal" ref={statsRef}>
            <StatBox value={stats.memberCount} suffix="+" label="Active Members" />
            <StatBox value={stats.loyalty}     suffix="%" label="Loyalty"        />
            <StatBox value={stats.ranking}     suffix="#" label="Server Ranking" />
            <StatBox value={0}                 suffix="L" label="Rats Tolerated" />
          </div>
        </div>
      </div>
    </section>
  )
}
