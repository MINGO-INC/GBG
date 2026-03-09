import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const LINKS = ['about', 'rules', 'ranks', 'join']

export default function Navbar() {
  const navRef = useRef(null)

  // Solid background once user scrolls past the hero
  useEffect(() => {
    const nav = navRef.current
    const handleScroll = () => {
      if (window.scrollY > 80) {
        nav.style.background = 'rgba(0,0,0,0.97)'
        nav.style.borderBottomColor = 'rgba(255,255,255,0.1)'
      } else {
        nav.style.background = ''
        nav.style.borderBottomColor = ''
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Highlight active section link on scroll
  useEffect(() => {
    const navLinks = navRef.current?.querySelectorAll('.nav-links a') ?? []
    const sections = LINKS.map((id) => document.getElementById(id)).filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${entry.target.id}`,
              )
            })
          }
        })
      },
      { rootMargin: '-40% 0px -50% 0px' },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const scrollTo = (e, id) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav ref={navRef}>
      <a href="#hero" className="nav-logo" onClick={(e) => scrollTo(e, 'hero')}>
        GBG
      </a>
      <ul className="nav-links">
        {LINKS.map((id) => (
          <li key={id}>
            <a href={`#${id}`} onClick={(e) => scrollTo(e, id)}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          </li>
        ))}
        <li>
          <Link to="/login" className="nav-login-btn">
            Login
          </Link>
        </li>
      </ul>
    </nav>
  )
}
