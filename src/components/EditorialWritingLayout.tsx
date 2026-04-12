import { useId, useMemo, useState, type ReactElement, type PointerEventHandler } from 'react'
import { useCarouselAutoplay } from '../hooks/useCarouselAutoplay'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import type { InnerPageBlock } from './InnerPage'
import { DisbursementsPrototypeEmbed } from './DisbursementsPrototypeEmbed'
import './DisbursementsCaseStudy.css'
import './EditorialWritingLayout.css'

export type EditorialWritingLayoutProps = {
  readonly title: string
  readonly date: string
  readonly backHref?: string
  readonly backLabel?: string
  readonly blocks: readonly InnerPageBlock[]
  /** Omit kicker line when `''`. Default when prop omitted: `Writing`. */
  readonly kicker?: string
  readonly showMetaAside?: boolean
  /** When false, hide the “← Back” link (e.g. About is reachable from main nav). */
  readonly showBack?: boolean
}

function EditorialBack({
  href,
  label,
}: {
  readonly href: string
  readonly label: string
}): ReactElement {
  return (
    <a href={href} className="ew-back">
      &larr; {label}
    </a>
  )
}

function WritingLink({
  href,
  label,
}: {
  readonly href: string
  readonly label: string
}): ReactElement {
  const isExternal = href.startsWith('http://') || href.startsWith('https://')
  const linkProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <a href={href} className="ew-writing-link" {...linkProps}>
      {label}
    </a>
  )
}

function ImageCompare({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
}: {
  readonly beforeSrc: string
  readonly afterSrc: string
  readonly beforeAlt?: string
  readonly afterAlt?: string
}) {
  const [position, setPosition] = useState(50)
  const compareHintId = useId()

  const updatePositionFromClientX = (clientX: number, rect: DOMRect) => {
    const relativeX = clientX - rect.left
    const ratio = relativeX / rect.width
    setPosition(Math.min(100, Math.max(0, ratio * 100)))
  }

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (event) => {
    const target = event.currentTarget
    const rect = target.getBoundingClientRect()
    updatePositionFromClientX(event.clientX, rect)
    target.setPointerCapture(event.pointerId)
  }

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (event) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    const rect = event.currentTarget.getBoundingClientRect()
    updatePositionFromClientX(event.clientX, rect)
  }

  const handlePointerUp: PointerEventHandler<HTMLDivElement> = (event) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return (
    <div className="ew-compare">
      <div
        className="ew-compare-track"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <img className="ew-compare-img" src={beforeSrc} alt={beforeAlt ?? 'Before image'} loading="lazy" decoding="async" />
        <div className="ew-compare-after" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <img className="ew-compare-img" src={afterSrc} alt={afterAlt ?? 'After image'} loading="lazy" decoding="async" />
        </div>
        <div className="ew-compare-line" style={{ left: `${position}%` }} aria-hidden />
        <div className="ew-compare-knob" style={{ left: `${position}%` }} aria-hidden />
        <span id={compareHintId} className="visually-hidden">
          Use left and right arrow keys to adjust the comparison.
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="ew-compare-range"
          aria-label="Drag to compare before and after"
          aria-describedby={compareHintId}
        />
      </div>
    </div>
  )
}

type EditorialCarouselSlide = {
  readonly src: string
  readonly alt: string
  readonly caption?: string
}

function EditorialWritingCarousel({ slides }: { readonly slides: readonly EditorialCarouselSlide[] }) {
  const AUTO_PLAY_SPEED_MS = 6000
  const PROGRESS_TICK_MS = 50

  const len = slides.length
  const reducedMotion = usePrefersReducedMotion()
  const [userPaused, setUserPaused] = useState(false)
  const autoPlayActive = len > 1 && !reducedMotion && !userPaused

  const { index, progress, goToSlide, goToNext } = useCarouselAutoplay(
    len,
    AUTO_PLAY_SPEED_MS,
    PROGRESS_TICK_MS,
    autoPlayActive,
  )

  if (len === 0) return null

  const slide = slides[index]

  return (
    <div className="ew-carousel">
      {len > 1 && (
        <div className="ew-carousel-toolbar">
          {reducedMotion ? (
            <span className="visually-hidden" role="status">
              Slideshow auto-advance is disabled to respect reduced motion.
            </span>
          ) : (
            <button
              type="button"
              className="ew-carousel-pause"
              onClick={() => setUserPaused((p) => !p)}
              aria-pressed={userPaused}
            >
              {userPaused ? 'Play slideshow' : 'Pause slideshow'}
            </button>
          )}
        </div>
      )}
      <div className="ew-carousel-wrap">
        {len > 1 && (
          <div className="ew-carousel-progress">
            {slides.map((s, i) => {
              let width = '0%'
              if (i < index) width = '100%'
              else if (i === index) width = `${Math.min(progress, 100)}%`

              return (
                <button
                  key={s.src}
                  type="button"
                  className="ew-carousel-progress-segment"
                  onClick={() => goToSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                >
                  <span className="ew-carousel-progress-bar" aria-hidden>
                    <span className="ew-carousel-progress-fill" style={{ width }} />
                  </span>
                </button>
              )
            })}
          </div>
        )}

        <figure className="ew-carousel-slide">
          <button
            type="button"
            className="ew-carousel-image-button"
            onClick={goToNext}
            aria-label="Next image"
          >
            <img src={slide.src} alt={slide.alt} loading="lazy" decoding="async" />
          </button>
          {slide.caption ? <figcaption className="ew-caption">{slide.caption}</figcaption> : null}
        </figure>
      </div>
    </div>
  )
}

function EditorialWritingBlockRenderer({ block }: { readonly block: InnerPageBlock }) {
  switch (block.type) {
    case 'point': {
      const label = block.label
      return (
        <section className="ew-row">
          <div className="ew-col-narrow">
            {label ? <h2 className="ew-label">{label}</h2> : null}
          </div>
          <div className="ew-col-wide">
            <p className="ew-body ew-writing-body">
              {block.text}
              {block.link && (
                <>
                  {' '}
                  {block.link.superscript ? (
                    <sup className="ew-writing-citation">
                      <WritingLink href={block.link.href} label={block.link.label} />
                    </sup>
                  ) : (
                    <WritingLink href={block.link.href} label={block.link.label} />
                  )}
                </>
              )}
            </p>
          </div>
        </section>
      )
    }

    case 'image':
      return (
        <figure className="ew-full ew-writing-image-figure">
          {block.srcWebp ? (
            <picture>
              <source srcSet={block.srcWebp} type="image/webp" />
              <img
                className="ew-writing-image"
                src={block.src}
                alt={block.alt}
                width={block.width}
                height={block.height}
                loading="lazy"
                decoding="async"
              />
            </picture>
          ) : (
            <img
              className="ew-writing-image"
              src={block.src}
              alt={block.alt}
              width={block.width}
              height={block.height}
              loading="lazy"
              decoding="async"
            />
          )}
          {(block.caption || block.link) && (
            <figcaption className="ew-caption">
              {block.caption}
              {block.link && (
                <>
                  {block.caption ? ' ' : null}
                  <WritingLink href={block.link.href} label={block.link.label} />
                </>
              )}
            </figcaption>
          )}
        </figure>
      )

    case 'imageCompare':
      return (
        <section className="ew-full ew-writing-image-figure">
          <ImageCompare
            beforeSrc={block.beforeSrc}
            afterSrc={block.afterSrc}
            beforeAlt={block.beforeAlt}
            afterAlt={block.afterAlt}
          />
          {block.caption && <p className="ew-caption">{block.caption}</p>}
        </section>
      )

    case 'quote':
      return (
        <blockquote className="ew-quote-section">
          <p className="ew-quote">
            &ldquo;{block.line1}
            {block.line2 ? ` ${block.line2}` : ''}&rdquo;
          </p>
        </blockquote>
      )

    case 'embed': {
      const width = block.width ?? 560
      const height = block.height ?? 314
      const paddingBottom = (height / width) * 100
      return (
        <section className="ew-full">
          <div className="ew-writing-embed" style={{ paddingBottom: `${paddingBottom}%` }}>
            <iframe
              src={block.src}
              width={width}
              height={height}
              loading="lazy"
              title={block.title ?? 'Embedded content'}
              style={{ border: 'none', overflow: 'hidden' }}
              sandbox="allow-scripts allow-same-origin allow-popups"
              allowFullScreen
            />
          </div>
        </section>
      )
    }

    case 'disbursementsPrototype':
      return (
        <section className="ew-full">
          <div className="ew-prototype-embed">
            <DisbursementsPrototypeEmbed />
          </div>
        </section>
      )

    case 'carousel':
      return (
        <section className="ew-full">
          <EditorialWritingCarousel slides={block.slides} />
        </section>
      )

    default:
      return null
  }
}

export function EditorialWritingLayout({
  title,
  date,
  backHref = '/',
  backLabel = 'Back',
  blocks,
  kicker,
  showBack = true,
}: EditorialWritingLayoutProps) {
  const kickerText = kicker ?? 'Writing'
  const safeDate = useMemo(() => date ?? '', [date])

  const getBlockKey = (block: InnerPageBlock): string => {
    switch (block.type) {
      case 'point':
        return `point:${block.label ?? ''}:${block.text.slice(0, 40)}`
      case 'image':
        return `image:${block.src}:${block.caption ?? ''}`
      case 'imageCompare':
        return `compare:${block.beforeSrc}:${block.afterSrc}:${block.caption ?? ''}`
      case 'quote':
        return `quote:${block.line1}:${block.line2 ?? ''}`
      case 'embed':
        return `embed:${block.src}:${block.title ?? ''}`
      case 'disbursementsPrototype':
        return 'disbursementsPrototype'
      case 'carousel':
        return `carousel:${block.slides.map((s) => s.src).join(',')}`
      default: {
        // `InnerPageBlock` is currently exhaustive; keep a safe fallback.
        return 'block'
      }
    }
  }

  return (
    <article className="ew">
      {showBack ? <EditorialBack href={backHref} label={backLabel} /> : null}

      <header className="ew-hero">
        <div className="ew-hero-text">
          {kickerText ? <p className="ew-kicker">{kickerText}</p> : null}
          <h1 className="ew-title">{title}</h1>
          {safeDate ? <p className="ew-subtitle">{safeDate}</p> : null}
        </div>
      </header>

      {blocks.map((block) => (
        <EditorialWritingBlockRenderer key={getBlockKey(block)} block={block} />
      ))}
    </article>
  )
}

