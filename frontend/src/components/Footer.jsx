const LINKS = ['about', 'rules', 'ranks']

export default function Footer() {
  const scrollTo = (e, id) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer>
      <div className="container">
        <span className="footer-logo">GBG</span>

        <ul className="footer-links">
          {LINKS.map((id) => (
            <li key={id}>
              <a href={`#${id}`} onClick={(e) => scrollTo(e, id)}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>

        <p className="footer-copy">
          © 2025 GBG – Go Broke Gang · FiveM · Los Santos · All Rights Reserved
        </p>
      </div>
    </footer>
  )
}
