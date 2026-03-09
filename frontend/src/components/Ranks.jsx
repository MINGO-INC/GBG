import { useEffect, useRef } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const RANKS = [
  { badge: '👑', title: 'Boss',      desc: 'Runs the whole operation. Absolute authority. Word is law.' },
  { badge: '🥇', title: 'Underboss', desc: 'Second in command. Keeps everything tight when the Boss is away.' },
  { badge: '⚡', title: 'Captain',   desc: 'Leads crews on the ground. Trusted. Proven. Ruthless.' },
  { badge: '🔫', title: 'Soldier',   desc: 'Full member. Earned their stripes. Ready for any job.' },
  { badge: '🃏', title: 'Associate', desc: 'Prospect proving themselves. Still earning their place in the crew.' },
  { badge: '🆕', title: 'Recruit',   desc: 'Fresh blood. Just started. Gotta prove they belong here.' },
]

export default function Ranks() {
  const headerRef = useScrollReveal()
  const gridRef = useRef(null)

  // Staggered reveal for each rank card
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.rank-card') ?? []
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )
    cards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 80}ms`
      observer.observe(card)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <section id="ranks">
      <div className="container">
        <div className="reveal" ref={headerRef}>
          <p className="section-tag">// Hierarchy</p>
          <h2 className="section-title">
            Gang
            <br />
            Ranks
          </h2>
          <div className="section-line" />
        </div>

        <div className="ranks-grid" ref={gridRef}>
          {RANKS.map(({ badge, title, desc }) => (
            <div key={title} className="rank-card reveal">
              <span className="rank-badge">{badge}</span>
              <div className="rank-title">{title}</div>
              <p className="rank-desc">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
