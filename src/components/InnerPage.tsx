import { useState } from 'react'
import './InnerPage.css'

export type InnerPageCarouselSlide = { src: string; alt: string; caption?: string }

export type InnerPageBlock =
  | {
      type: 'point'
      label?: string
      text: string
      link?: { href: string; label: string; superscript?: boolean }
    }
  | { type: 'image'; src: string; alt: string; caption?: string; link?: { href: string; label: string } }
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

export type InnerPageProps = {
  title: string
  date: string
  backHref?: string
  backLabel?: string
  blocks: InnerPageBlock[]
}

const DEFAULT_BACK_HREF = '/'
const DEFAULT_BACK_LABEL = 'cclee.design'

export function InnerPage({
  title,
  date,
  backHref = DEFAULT_BACK_HREF,
  backLabel = DEFAULT_BACK_LABEL,
  blocks,
}: InnerPageProps) {
  return (
    <article className="inner-page">
      <a href={backHref} className="inner-page-back">
        ← {backLabel}
      </a>

      <header className="inner-page-header">
        <h1 className="inner-page-title">{title}</h1>
        {date && (
          <time className="inner-page-date" dateTime={date}>
            {date}
          </time>
        )}
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
  return (
    <div className="inner-page-compare-wrap">
      <div className="inner-page-compare-images">
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
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="inner-page-compare-range"
          aria-label="Drag to compare before and after"
        />
      </div>
    </div>
  )
}

function InnerPageCarousel({ slides }: { slides: InnerPageCarouselSlide[] }) {
  const [index, setIndex] = useState(0)
  const len = slides.length
  if (len === 0) return null
  const prev = () => setIndex((i) => (i - 1 + len) % len)
  const next = () => setIndex((i) => (i + 1) % len)
  const slide = slides[index]
  return (
    <div className="inner-page-carousel-wrap">
      <div className="inner-page-carousel-track">
        <figure className="inner-page-carousel-slide">
          <img src={slide.src} alt={slide.alt} loading="lazy" decoding="async" />
          {slide.caption && (
            <figcaption className="inner-page-image-caption">
              {slide.caption}
            </figcaption>
          )}
        </figure>
      </div>
      {len > 1 && (
        <>
          <button
            type="button"
            className="inner-page-carousel-btn inner-page-carousel-prev"
            onClick={prev}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            type="button"
            className="inner-page-carousel-btn inner-page-carousel-next"
            onClick={next}
            aria-label="Next slide"
          >
            →
          </button>
          <div className="inner-page-carousel-dots" role="tablist" aria-label="Slide">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}`}
                className={`inner-page-carousel-dot ${i === index ? 'is-active' : ''}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      )}
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
          <img src={block.src} alt={block.alt} loading="lazy" decoding="async" />
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
            width={block.width ?? 560}
            height={block.height ?? 314}
            style={{ border: 'none', overflow: 'hidden' }}
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            title={block.title ?? 'Embedded content'}
          />
        </div>
      )
    default:
      return null
  }
}
