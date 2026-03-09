import { useEffect, useRef } from 'react'

/**
 * Attaches an IntersectionObserver to a DOM element.
 * When the element enters the viewport, the 'visible' class is added.
 * Pair with the `.reveal` CSS class for fade-in/slide-up animations.
 */
export function useScrollReveal(delay = 0) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (delay) el.style.transitionDelay = `${delay}ms`

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.12 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return ref
}
