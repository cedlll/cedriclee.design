import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { HERO_HEADLINE_PREFIX, HERO_HEADLINE_ROTATOR_WORDS } from '../homeHeroHeadline'

/** Pause (seconds) after a word finishes typing before erase + next word. */
const HERO_ROTATOR_PAUSE_SEC = 3

const HERO_ERASE_CHAR_MS = 42
const HERO_TYPE_CHAR_MS = 52

function heroAriaLabel(rotatorWord: string): string {
  return `Cedric is a product designer building things worth ${rotatorWord}`
}

function delay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }
    const onAbort = () => {
      globalThis.window.clearTimeout(id)
      signal.removeEventListener('abort', onAbort)
      reject(new DOMException('Aborted', 'AbortError'))
    }
    const id = globalThis.window.setTimeout(() => {
      signal.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    signal.addEventListener('abort', onAbort)
  })
}

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

    const headlinePrefixEl = root.querySelector<HTMLElement>('.ed-hero-headline-name')
    const headlineRotator = root.querySelector<HTMLElement>('.ed-hero-headline-rotator')
    const heroHeading = root.querySelector<HTMLElement>('#hero-heading')

    if (headlinePrefixEl && headlineRotator) {
      if (reduceMotion) {
        headlinePrefixEl.textContent = HERO_HEADLINE_PREFIX
        headlineRotator.textContent = HERO_HEADLINE_ROTATOR_WORDS[0]
        heroHeading?.setAttribute('aria-label', heroAriaLabel(HERO_HEADLINE_ROTATOR_WORDS[0]))
      } else {
        headlinePrefixEl.textContent = ''
        headlineRotator.textContent = ''
        heroHeading?.setAttribute('aria-busy', 'true')
        heroHeading?.removeAttribute('aria-label')

        const ac = new AbortController()
        const { signal } = ac

        const runHeroHeadline = async () => {
          try {
            for (let i = 1; i <= HERO_HEADLINE_PREFIX.length && !signal.aborted; i += 1) {
              headlinePrefixEl.textContent = HERO_HEADLINE_PREFIX.slice(0, i)
              await delay(HERO_TYPE_CHAR_MS, signal)
            }
            const firstWord = HERO_HEADLINE_ROTATOR_WORDS[0]
            for (let i = 1; i <= firstWord.length && !signal.aborted; i += 1) {
              headlineRotator.textContent = firstWord.slice(0, i)
              await delay(HERO_TYPE_CHAR_MS, signal)
            }
            heroHeading?.removeAttribute('aria-busy')
            heroHeading?.setAttribute('aria-label', heroAriaLabel(firstWord))

            let wordIndex = 0
            while (!signal.aborted) {
              await delay(HERO_ROTATOR_PAUSE_SEC * 1000, signal)
              const current = HERO_HEADLINE_ROTATOR_WORDS[wordIndex]
              for (let len = current.length; len > 0 && !signal.aborted; len -= 1) {
                headlineRotator.textContent = current.slice(0, len - 1)
                await delay(HERO_ERASE_CHAR_MS, signal)
              }
              wordIndex = (wordIndex + 1) % HERO_HEADLINE_ROTATOR_WORDS.length
              const next = HERO_HEADLINE_ROTATOR_WORDS[wordIndex]
              for (let len = 1; len <= next.length && !signal.aborted; len += 1) {
                headlineRotator.textContent = next.slice(0, len)
                await delay(HERO_TYPE_CHAR_MS, signal)
              }
              heroHeading?.setAttribute('aria-label', heroAriaLabel(next))
            }
          } catch {
            /* aborted */
          } finally {
            heroHeading?.removeAttribute('aria-busy')
          }
        }

        void runHeroHeadline()
        cleanupFns.push(() => {
          ac.abort()
          heroHeading?.removeAttribute('aria-busy')
        })
      }
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

    if (!reduceMotion) {
      const actionLinks = root.querySelectorAll<HTMLAnchorElement>('a.ed-work-action')

      actionLinks.forEach((link) => {
        const handleEnter = () => {
          gsap.to(link, {
            y: -2,
            scale: 1.01,
            duration: 0.22,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }

        const handleLeave = () => {
          gsap.to(link, {
            y: 0,
            scale: 1,
            duration: 0.2,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }

        link.addEventListener('mouseenter', handleEnter)
        link.addEventListener('mouseleave', handleLeave)
        link.addEventListener('focus', handleEnter)
        link.addEventListener('blur', handleLeave)

        cleanupFns.push(() => {
          gsap.killTweensOf(link)
          link.removeEventListener('mouseenter', handleEnter)
          link.removeEventListener('mouseleave', handleLeave)
          link.removeEventListener('focus', handleEnter)
          link.removeEventListener('blur', handleLeave)
          gsap.set(link, { clearProps: 'transform' })
        })
      })
    }

    return () => {
      cleanupFns.forEach((cleanup) => cleanup())
    }
  }, [rootRef])
}
