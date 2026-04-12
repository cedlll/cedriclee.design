import { useState, useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const isMobile = () =>
  typeof navigator !== 'undefined' &&
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

type CustomCursorProps = {
  dotSize?: number
  dotColor?: string
  animationDuration?: number
  blendMode?: string
  opacity?: number
  hideOnMobile?: boolean
}

export default function CustomCursor({
  dotSize = 6,
  dotColor = 'var(--color-bg)',
  animationDuration = 200,
  blendMode = 'difference',
  opacity = 1,
  hideOnMobile = true,
}: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [hidden, setHidden] = useState(true)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isMobile() && hideOnMobile) return
    if (reducedMotion) return

    document.body.style.cursor = 'none'
    const styleEl = document.createElement('style')
    styleEl.innerHTML = '* { cursor: none !important; }'
    document.head.appendChild(styleEl)

    const onMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - dotSize / 2}px, ${e.clientY - dotSize / 2}px)`
      }
      setHidden(false)
    }
    const onMouseEnter = () => setHidden(false)
    const onMouseLeave = () => setHidden(true)

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseleave', onMouseLeave)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.body.style.cursor = 'auto'
      styleEl.remove()
    }
  }, [hideOnMobile, dotSize, reducedMotion])

  if (typeof window === 'undefined') return null
  if (isMobile() && hideOnMobile) return null
  if (reducedMotion) return null

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: `${dotSize}px`,
        height: `${dotSize}px`,
        backgroundColor: dotColor,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 10000,
        mixBlendMode: blendMode as React.CSSProperties['mixBlendMode'],
        opacity: hidden ? 0 : opacity,
        transition: `opacity ${animationDuration}ms ease`,
      }}
    />
  )
}
