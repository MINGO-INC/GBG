import { useEffect, useRef } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const RULES = [
  {
    n: '01',
    title: 'Loyalty First',
    body: 'Gang members come before everything. You bleed black and white — no exceptions, no excuses.',
  },
  {
    n: '02',
    title: 'No Snitching',
    body: 'What happens inside GBG stays inside GBG. Anyone caught talking to the cops is out — permanently.',
  },
  {
    n: '03',
    title: 'Respect the Ranks',
    body: 'Follow the chain of command. Higher ranks make the calls. You earn your say by earning your rank.',
  },
  {
    n: '04',
    title: 'Represent the Colors',
    body: 'Wear black and white. Don\'t dishonor the gang by dressing sloppy or acting outside the code.',
  },
  {
    n: '05',
    title: 'Stay Active',
    body: 'Ghosts don\'t eat. Show up, participate, and contribute. Inactive members get removed — no hard feelings.',
  },
  {
    n: '06',
    title: 'Handle Business',
    body: 'We handle our beef internally. No public drama, no petty beef. Keep it professional, keep it clean.',
  },
]

export default function Rules() {
  const headerRef = useScrollReveal()
  const listRef = useRef(null)

  // Staggered reveal for each rule card
  useEffect(() => {
    const items = listRef.current?.querySelectorAll('.rule-item') ?? []
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
    items.forEach((item, i) => {
      item.style.transitionDelay = `${i * 75}ms`
      observer.observe(item)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <section id="rules">
      <div className="container">
        <div className="reveal" ref={headerRef}>
          <p className="section-tag">// Code of the Streets</p>
          <h2 className="section-title">
            Gang
            <br />
            Rules
          </h2>
          <div className="section-line" />
        </div>

        <ul className="rules-list" ref={listRef}>
          {RULES.map(({ n, title, body }) => (
            <li key={n} className="rule-item reveal">
              <span className="rule-number">{n}</span>
              <div className="rule-content">
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
