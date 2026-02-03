import { useState } from 'react'
import './InnerPage.css'

export type InnerPageCarouselSlide = { src: string; alt: string; caption?: string }

export type InnerPageBlock =
  | { type: 'point'; label?: string; text: string; link?: { href: string; label: string } }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'carousel'; slides: InnerPageCarouselSlide[] }
  | { type: 'quote'; line1: string; line2?: string }

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
    <article className="inner-page" data-name="inner-page" data-node-id="60:159">
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
                <a
                  href={block.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {block.link.label}
                </a>
              </>
            )}
          </p>
        </section>
      )
    case 'image':
      return (
        <figure className="inner-page-block inner-page-image">
          <img src={block.src} alt={block.alt} loading="lazy" decoding="async" />
          {block.caption && (
            <figcaption className="inner-page-image-caption">
              {block.caption}
            </figcaption>
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
          <p>"{block.line1}"</p>
          {block.line2 && <p>"{block.line2}"</p>}
        </blockquote>
      )
    default:
      return null
  }
}
