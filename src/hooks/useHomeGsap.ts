import { useLayoutEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HERO_HEADLINE_PREFIX, HERO_HEADLINE_ROTATOR_WORDS } from '../homeHeroHeadline'

gsap.registerPlugin(ScrollTrigger)

/** Pause (seconds) after a word finishes typing before the next cycle. */
const HERO_ROTATOR_PAUSE_SEC = 3

const HERO_TYPEWRITER_DELETE_STEP_SEC = 0.02
const HERO_TYPEWRITER_TYPE_STEP_SEC = 0.03

function appendTypeInOnly(
  tl: gsap.core.Timeline,
  el: HTMLElement,
  fullText: string,
  stepSec: number,
): void {
  for (let j = 1; j <= fullText.length; j++) {
    const position = j === 1 ? undefined : `+=${stepSec}`
    tl.call(
      () => {
        el.textContent = fullText.slice(0, j)
      },
      undefined,
      position,
    )
  }
}

function appendTypewriterTimeline(
  tl: gsap.core.Timeline,
  el: HTMLElement,
  fromWord: string,
  toWord: string,
): void {
  for (let i = fromWord.length; i > 0; i--) {
    const sliceEnd = i - 1
    tl.call(
      () => {
        el.textContent = fromWord.slice(0, sliceEnd)
      },
      undefined,
      i === fromWord.length ? 0 : `+=${HERO_TYPEWRITER_DELETE_STEP_SEC}`,
    )
  }
  for (let j = 1; j <= toWord.length; j++) {
    let position: number | string = `+=${HERO_TYPEWRITER_TYPE_STEP_SEC}`
    if (j === 1) {
      position = fromWord.length === 0 ? 0 : `+=${HERO_TYPEWRITER_TYPE_STEP_SEC}`
    }
    tl.call(
      () => {
        el.textContent = toWord.slice(0, j)
      },
      undefined,
      position,
    )
  }
}

function attachCaseStudyHover(row: HTMLElement): () => void {
  const media = row.querySelector<HTMLElement>('.ed-work-media')

  const onEnter = () => {
    gsap.to(row, {
      y: -3,
      duration: 0.22,
      ease: 'power2.out',
      overwrite: 'auto',
    })

    if (!media) return
    gsap.to(media, {
      scale: 1.015,
      duration: 0.28,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }

  const onLeave = () => {
    gsap.to(row, {
      y: 0,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: 'auto',
    })

    if (!media) return
    gsap.to(media, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }

  row.addEventListener('mouseenter', onEnter)
  row.addEventListener('mouseleave', onLeave)
  row.addEventListener('focus', onEnter)
  row.addEventListener('blur', onLeave)

  return () => {
    row.removeEventListener('mouseenter', onEnter)
    row.removeEventListener('mouseleave', onLeave)
    row.removeEventListener('focus', onEnter)
    row.removeEventListener('blur', onLeave)
  }
}

/**
 * Entrance + scroll-driven motion for the portfolio home.
 * @see https://github.com/greensock/GSAP
 */
export function useHomeGsap(rootRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || globalThis.matchMedia === undefined) return

    const cleanupFns: Array<() => void> = []

    const mqReduce = globalThis.matchMedia('(prefers-reduced-motion: reduce)')
    const reduceMotion = mqReduce.matches

    const ctx = gsap.context(() => {
      const headlineLineRm = root.querySelector<HTMLElement>('.ed-hero-headline-line')
      const headlineRotatorRm = root.querySelector<HTMLElement>('.ed-hero-headline-rotator')
      if (reduceMotion) {
        if (headlineLineRm) headlineLineRm.textContent = HERO_HEADLINE_PREFIX
        if (headlineRotatorRm) headlineRotatorRm.textContent = HERO_HEADLINE_ROTATOR_WORDS[0]
        const heroHeadingRm = root.querySelector<HTMLElement>('#hero-heading')
        heroHeadingRm?.setAttribute(
          'aria-label',
          `Cedric is a product designer building things worth ${HERO_HEADLINE_ROTATOR_WORDS[0]}`,
        )
        return
      }

      const heroTl = gsap.timeline({ delay: 0.2, defaults: { ease: 'power3.out' } })
      heroTl.from('.home-hero-about-col', { opacity: 0, y: 8, duration: 0.55 }, 0.06)

      const headlineLine = root.querySelector<HTMLElement>('.ed-hero-headline-line')
      const headlineRotator = root.querySelector<HTMLElement>('.ed-hero-headline-rotator')
      const heroHeading = root.querySelector<HTMLElement>('#hero-heading')

      if (headlineLine && headlineRotator) {
        headlineLine.textContent = ''
        headlineRotator.textContent = ''
        heroHeading?.setAttribute('aria-busy', 'true')
        heroHeading?.setAttribute(
          'aria-label',
          `Cedric is a product designer building things worth ${HERO_HEADLINE_ROTATOR_WORDS[0]}`,
        )

        let wordIndex = 0
        let rotateDelay: gsap.core.Tween | null = null
        let activeTypewriter: gsap.core.Timeline | null = null

        const setHeadingAriaLabel = (word: string) => {
          heroHeading?.setAttribute(
            'aria-label',
            `Cedric is a product designer building things worth ${word}`,
          )
        }

        const rotate = () => {
          const fromWord = (headlineRotator.textContent ?? '').trim()
          wordIndex = (wordIndex + 1) % HERO_HEADLINE_ROTATOR_WORDS.length
          const toWord = HERO_HEADLINE_ROTATOR_WORDS[wordIndex]

          activeTypewriter?.kill()
          const tl = gsap.timeline({
            onComplete: () => {
              activeTypewriter = null
              setHeadingAriaLabel(toWord)
              rotateDelay = gsap.delayedCall(HERO_ROTATOR_PAUSE_SEC, rotate)
            },
          })
          activeTypewriter = tl
          appendTypewriterTimeline(tl, headlineRotator, fromWord, toWord)
        }

        const typeIntro = gsap.timeline({
          onComplete: () => {
            heroHeading?.removeAttribute('aria-busy')
            setHeadingAriaLabel(HERO_HEADLINE_ROTATOR_WORDS[0])
            rotateDelay = gsap.delayedCall(HERO_ROTATOR_PAUSE_SEC, rotate)
          },
        })
        appendTypeInOnly(typeIntro, headlineLine, HERO_HEADLINE_PREFIX, HERO_TYPEWRITER_TYPE_STEP_SEC)
        appendTypeInOnly(
          typeIntro,
          headlineRotator,
          HERO_HEADLINE_ROTATOR_WORDS[0],
          HERO_TYPEWRITER_TYPE_STEP_SEC,
        )
        heroTl.add(typeIntro, 0.06)

        cleanupFns.push(() => {
          rotateDelay?.kill()
          activeTypewriter?.kill()
          gsap.killTweensOf(headlineRotator)
          gsap.killTweensOf(headlineLine)
          heroHeading?.removeAttribute('aria-busy')
        })
      }

      // Reveal each work section independently.
      const workLists = root.querySelectorAll<HTMLElement>('.ed-work-list')
      workLists.forEach((list) => {
        const rows = list.querySelectorAll<HTMLElement>('.ed-work-row')
        gsap.set(rows, { opacity: 0, y: 28 })
        gsap.to(rows, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.07,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: list,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        })
      })

      root
        .querySelectorAll<HTMLElement>('.home-case-study-row')
        .forEach((row) => cleanupFns.push(attachCaseStudyHover(row)))

      const footer = root.querySelector('.site-footer')
      if (footer) {
        gsap.set(footer, { opacity: 0, y: 24 })
        gsap.to(footer, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 94%',
            toggleActions: 'play none none none',
          },
        })
      }

      // Ensure ScrollTrigger recalculates after layout settles.
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }, root)

    return () => {
      cleanupFns.forEach((cleanup) => cleanup())
      ctx.revert()
    }
  }, [rootRef])
}
