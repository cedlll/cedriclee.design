import './BuiltWith.css'

type BuiltWithProps = {
  /** Merged onto the outer wrapper. */
  className?: string
}

/** Subtle "Built with Cursor and Claude Code" credit, with brand marks. Shared across the homepage and case study pages. */
export function BuiltWith({ className }: BuiltWithProps = {}) {
  const rootClass = ['bw-built-with', className].filter(Boolean).join(' ')

  return (
    <aside className={rootClass} aria-label="How this was built">
      <span className="bw-built-with__lead">Built with</span>
      <div className="bw-built-with__brands">
        <span className="bw-built-with__brand">
          <img
            className="bw-built-with__logo bw-built-with__logo--cursor"
            src="/logos/cursor.svg"
            alt=""
            width={22}
            height={22}
            decoding="async"
          />
          <span className="bw-built-with__name">Cursor</span>
        </span>
        <span className="bw-built-with__sep" aria-hidden="true">
          and
        </span>
        <span className="bw-built-with__brand">
          <img
            className="bw-built-with__logo bw-built-with__logo--claude"
            src="/logos/claude.svg"
            alt=""
            width={22}
            height={22}
            decoding="async"
          />
          <span className="bw-built-with__name">Claude Code</span>
        </span>
      </div>
    </aside>
  )
}
