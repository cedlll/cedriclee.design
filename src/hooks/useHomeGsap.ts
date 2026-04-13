import { useLayoutEffect, type RefObject } from 'react'
import { HERO_HEADLINE_PREFIX, HERO_HEADLINE_ROTATOR_WORDS } from '../homeHeroHeadline'

/** Pause (seconds) after a word finishes typing before the next cycle. */
const HERO_ROTATOR_PAUSE_SEC = 3

/**
 * Lightweight home interactions without animation libraries.
 */
export function useHomeGsap(rootRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || globalThis.matchMedia === undefined) return

    const mqReduce = globalThis.matchMedia('(prefers-reduced-motion: reduce)')
    const reduceMotion = mqReduce.matches
    const cleanupFns: Array<() => void> = []

    const headlineLine = root.querySelector<HTMLElement>('.ed-hero-headline-line')
    const headlineRotator = root.querySelector<HTMLElement>('.ed-hero-headline-rotator')
    const heroHeading = root.querySelector<HTMLElement>('#hero-heading')

    if (headlineLine && headlineRotator) {
      headlineLine.textContent = HERO_HEADLINE_PREFIX
      headlineRotator.textContent = HERO_HEADLINE_ROTATOR_WORDS[0]
      heroHeading?.setAttribute(
        'aria-label',
        `Cedric is a product designer building things worth ${HERO_HEADLINE_ROTATOR_WORDS[0]}`,
      )
    }

    if (!reduceMotion && headlineRotator) {
      let wordIndex = 0
      const intervalId = globalThis.window.setInterval(() => {
        wordIndex = (wordIndex + 1) % HERO_HEADLINE_ROTATOR_WORDS.length
        const word = HERO_HEADLINE_ROTATOR_WORDS[wordIndex]
        headlineRotator.textContent = word
        heroHeading?.setAttribute(
          'aria-label',
          `Cedric is a product designer building things worth ${word}`,
        )
      }, HERO_ROTATOR_PAUSE_SEC * 1000)

      cleanupFns.push(() => globalThis.window.clearInterval(intervalId))
    }

    if (!reduceMotion && globalThis.IntersectionObserver) {
      const revealTargets = root.querySelectorAll<HTMLElement>('.ed-work-row, .site-footer')
      revealTargets.forEach((el) => el.classList.add('ed-reveal'))

      const observer = new globalThis.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          })
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
      )

      revealTargets.forEach((el) => observer.observe(el))
      cleanupFns.push(() => observer.disconnect())
    }

    return () => {
      cleanupFns.forEach((cleanup) => cleanup())
    }
  }, [rootRef])
}
