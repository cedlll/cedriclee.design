import { useId, useState } from 'react'
import { useCarouselAutoplay } from '../hooks/useCarouselAutoplay'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { DisbursementsPrototypeEmbed } from './DisbursementsPrototypeEmbed'
import './InnerPage.css'

export type InnerPageCarouselSlide = { src: string; alt: string; caption?: string }

export type InnerPageBlock =
  | {
      type: 'point'
      label?: string
      text: string
      link?: { href: string; label: string; superscript?: boolean }
    }
  | {
      type: 'image'
      src: string
      alt: string
      caption?: string
      link?: { href: string; label: string }
      width?: number
      height?: number
      /** Optional WebP URL for `<picture>`; keep `src` as a universally supported fallback. */
      srcWebp?: string
    }
  | {
      type: 'imageCompare'
      beforeSrc: string
      afterSrc: string
      beforeAlt?: string
      afterAlt?: string
      caption?: string
    }
  | { type: 'carousel'; slides: InnerPageCarouselSlide[] }
  | { type: 'quote'; line1: string; line2?: string }
  | {
      type: 'embed'
      src: string
      width?: number
      height?: number
      title?: string
    }
  | { type: 'disbursementsPrototype' }

export type InnerPageProps = {
  title: string
  date: string
  backHref?: string
  backLabel?: string
  blocks: InnerPageBlock[]
}

function machineReadableDateTime(display: string): string | undefined {
  const t = display.trim()
  if (t === '') return undefined
  if (/^\d{4}$/.test(t)) return `${t}-01-01`
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t
  const parsed = Date.parse(t)
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString().slice(0, 10)
  }
  return undefined
}

const DEFAULT_BACK_HREF = '/'
const DEFAULT_BACK_LABEL = 'Back'

export function InnerPage({
  title,
  date,
  backHref = DEFAULT_BACK_HREF,
  backLabel = DEFAULT_BACK_LABEL,
  blocks,
}: InnerPageProps) {
  const dateTimeAttr = date ? machineReadableDateTime(date) : undefined

  return (
    <article className="inner-page">
      <a href={backHref} className="inner-page-back">
        ← {backLabel}
      </a>

      <header className="inner-page-header">
        <h1 className="inner-page-title">{title}</h1>
        {date &&
          (dateTimeAttr ? (
            <time className="inner-page-date" dateTime={dateTimeAttr}>
              {date}
            </time>
          ) : (
            <p className="inner-page-date">{date}</p>
          ))}
      </header>

      <div className="inner-page-content">
        {blocks.map((block, i) => (
          <InnerPageBlockRenderer key={i} block={block} />
        ))}
      </div>
    </article>
  )
}

function InnerPageImageCompare({
  beforeSrc,
  afterSrc,
  beforeAlt = '',
  afterAlt = '',
}: {
  beforeSrc: string
  afterSrc: string
  beforeAlt?: string
  afterAlt?: string
}) {
  const [position, setPosition] = useState(50)
  const compareHintId = useId()

  const updatePositionFromClientX = (clientX: number, rect: DOMRect) => {
    const relativeX = clientX - rect.left
    const ratio = relativeX / rect.width
    const next = Math.min(100, Math.max(0, ratio * 100))
    setPosition(next)
  }

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    const target = event.currentTarget
    const rect = target.getBoundingClientRect()
    updatePositionFromClientX(event.clientX, rect)
    target.setPointerCapture(event.pointerId)
  }

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    const rect = event.currentTarget.getBoundingClientRect()
    updatePositionFromClientX(event.clientX, rect)
  }

  const handlePointerUp: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return (
    <div className="inner-page-compare-wrap">
      <div
        className="inner-page-compare-images"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <img
          className="inner-page-compare-before"
          src={beforeSrc}
          alt={beforeAlt}
          loading="lazy"
          decoding="async"
        />
        <div
          className="inner-page-compare-after-wrap"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            className="inner-page-compare-after"
            src={afterSrc}
            alt={afterAlt}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div
          className="inner-page-compare-divider"
          style={{ left: `${position}%` }}
          aria-hidden
        />
        <div
          className="inner-page-compare-knob"
          style={{ left: `${position}%` }}
          aria-hidden
        />
        <span id={compareHintId} className="visually-hidden">
          Use left and right arrow keys to adjust the comparison.
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="inner-page-compare-range"
          aria-label="Drag to compare before and after"
          aria-describedby={compareHintId}
        />
      </div>
    </div>
  )
}

function InnerPageCarousel({ slides }: { slides: InnerPageCarouselSlide[] }) {
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
    <div className="inner-page-carousel-wrap">
      {len > 1 && (
        <div className="inner-page-carousel-toolbar">
          {reducedMotion ? (
            <span className="visually-hidden" role="status">
              Slideshow auto-advance is disabled to respect reduced motion.
            </span>
          ) : (
            <button
              type="button"
              className="inner-page-carousel-pause"
              onClick={() => setUserPaused((p) => !p)}
              aria-pressed={userPaused}
            >
              {userPaused ? 'Play slideshow' : 'Pause slideshow'}
            </button>
          )}
        </div>
      )}
      <div className="inner-page-carousel-track">
        {len > 1 && (
          <div className="inner-page-carousel-progress">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                className="inner-page-carousel-progress-segment"
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
              >
                <span className="inner-page-carousel-progress-bar" aria-hidden>
                  <span
                    className="inner-page-carousel-progress-fill"
                    style={{
                      width:
                        i < index ? '100%' : i === index ? `${Math.min(progress, 100)}%` : '0%',
                    }}
                  />
                </span>
              </button>
            ))}
          </div>
        )}
        <figure className="inner-page-carousel-slide">
          <button
            type="button"
            className="inner-page-carousel-image-button"
            onClick={goToNext}
            aria-label="Next image"
          >
            <img src={slide.src} alt={slide.alt} loading="lazy" decoding="async" />
          </button>
          {slide.caption && (
            <figcaption className="inner-page-image-caption">
              {slide.caption}
            </figcaption>
          )}
        </figure>
      </div>
    </div>
  )
}

function InnerPageBlockRenderer({ block }: { block: InnerPageBlock }) {
  switch (block.type) {
    case 'point':
      return (
        <section className="inner-page-block inner-page-point">
          {block.label && (
            <h2 className="inner-page-block-label">{block.label}</h2>
          )}
          <p className="inner-page-block-text">
            {block.text}
            {block.link && (
              <>
                {' '}
                {block.link.superscript ? (
                  <sup className="inner-page-citation">
                    <a
                      href={block.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {block.link.label}
                    </a>
                  </sup>
                ) : (
                  <a
                    href={block.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {block.link.label}
                  </a>
                )}
              </>
            )}
          </p>
        </section>
      )
    case 'image':
      return (
        <figure className="inner-page-block inner-page-image">
          {block.srcWebp ? (
            <picture>
              <source srcSet={block.srcWebp} type="image/webp" />
              <img
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
              src={block.src}
              alt={block.alt}
              width={block.width}
              height={block.height}
              loading="lazy"
              decoding="async"
            />
          )}
          {(block.caption || block.link) && (
            <figcaption className="inner-page-image-caption">
              {block.caption}
              {block.link && (
                <>
                  {block.caption && ' '}
                  <a href={block.link.href} target="_blank" rel="noopener noreferrer">
                    {block.link.label}
                  </a>
                </>
              )}
            </figcaption>
          )}
        </figure>
      )
    case 'imageCompare':
      return (
        <figure className="inner-page-block inner-page-image inner-page-compare">
          <InnerPageImageCompare
            beforeSrc={block.beforeSrc}
            afterSrc={block.afterSrc}
            beforeAlt={block.beforeAlt}
            afterAlt={block.afterAlt}
          />
          {block.caption && (
            <figcaption className="inner-page-image-caption">{block.caption}</figcaption>
          )}
        </figure>
      )
    case 'carousel':
      return (
        <div className="inner-page-block inner-page-carousel">
          <InnerPageCarousel slides={block.slides} />
        </div>
      )
    case 'quote':
      return (
        <blockquote className="inner-page-block inner-page-quote">
          <p>
            "{block.line1}
            {block.line2 ? ` ${block.line2}` : ''}"
          </p>
        </blockquote>
      )
    case 'embed':
      return (
        <div className="inner-page-block inner-page-embed">
          <iframe
            src={block.src}
            loading="lazy"
            width={block.width ?? 560}
            height={block.height ?? 314}
            style={{ border: 'none', overflow: 'hidden' }}
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            sandbox="allow-scripts allow-same-origin allow-popups"
            title={block.title ?? 'Embedded content'}
          />
        </div>
      )
    case 'disbursementsPrototype':
      return <DisbursementsPrototypeEmbed className="inner-page-block" />
    default:
      return null
  }
}
