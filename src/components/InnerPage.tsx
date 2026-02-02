import './InnerPage.css'

export type InnerPageBlock =
  | { type: 'point'; label?: string; text: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
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

function InnerPageBlockRenderer({ block }: { block: InnerPageBlock }) {
  switch (block.type) {
    case 'point':
      return (
        <section className="inner-page-block inner-page-point">
          {block.label && (
            <h2 className="inner-page-block-label">{block.label}</h2>
          )}
          <p className="inner-page-block-text">{block.text}</p>
        </section>
      )
    case 'image':
      return (
        <figure className="inner-page-block inner-page-image">
          <img src={block.src} alt={block.alt} />
          {block.caption && (
            <figcaption className="inner-page-image-caption">
              {block.caption}
            </figcaption>
          )}
        </figure>
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
