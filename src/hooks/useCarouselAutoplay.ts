import { useCallback, useEffect, useState } from 'react'

/**
 * Carousel index + progress bar state with optional autoplay.
 * Autoplay runs only when `autoPlayActive` is true (e.g. not paused, not reduced motion).
 */
export function useCarouselAutoplay(
  len: number,
  autoPlaySpeedMs: number,
  progressTickMs: number,
  autoPlayActive: boolean,
) {
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  const goToSlide = useCallback((i: number) => {
    setIndex(i)
    setProgress(0)
  }, [])

  const goToNext = useCallback(() => {
    if (len <= 1) return
    setIndex((i) => (i + 1) % len)
    setProgress(0)
  }, [len])

  useEffect(() => {
    if (len <= 1 || !autoPlayActive) return

    let startTime = Date.now()
    const timerId = globalThis.setInterval(() => {
      const elapsed = Date.now() - startTime
      const ratio = elapsed / autoPlaySpeedMs

      if (ratio >= 1) {
        setIndex((i) => (i + 1) % len)
        setProgress(0)
        startTime = Date.now()
      } else {
        setProgress(ratio * 100)
      }
    }, progressTickMs)

    return () => {
      globalThis.clearInterval(timerId)
    }
  }, [len, index, autoPlaySpeedMs, progressTickMs, autoPlayActive])

  return { index, progress, goToSlide, goToNext }
}
