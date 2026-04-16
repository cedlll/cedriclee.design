import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import './DisbursementsCaseStudy.css'
import { DisbursementsPrototypeEmbed } from './DisbursementsPrototypeEmbed'

/** In-page anchor for the interactive prototype block (hero CTA). */
const DISBURSEMENTS_PROTOTYPE_SECTION_ID = 'disbursements-prototype-walkthrough' as const

/* ── Reveal on scroll ── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}

function Reveal({
  children,
  className = '',
  id,
  as: Tag = 'section',
}: {
  children: React.ReactNode
  className?: string
  id?: string
  as?: 'section' | 'div' | 'figure' | 'blockquote' | 'footer' | 'aside'
}) {
  const { ref, visible } = useReveal()
  return (
    <Tag
      ref={ref as never}
      id={id}
      className={`ew-reveal ${visible ? 'ew-visible' : ''} ${className}`}
    >
      {children}
    </Tag>
  )
}

/** Other case studies from selected work (thumbnails align with home `works` grid). */
const OTHER_CASE_STUDIES: Array<{
  label: string
  title: string
  description: string
  href: string | null
  thumbnailSrc: string
  thumbnailAlt: string
}> = [
  {
    label: 'Logistics and Supply Chain',
    title: 'Shipmates',
    description: 'Logistics platform for Philippine e-commerce.',
    href: null,
    thumbnailSrc: '/disbursement-case-before.svg',
    thumbnailAlt: 'Shipmates case study preview image',
  },
  {
    label: 'Education Technology',
    title: 'Cambridge',
    description: 'Enterprise digital services.',
    href: null,
    thumbnailSrc: '/disbursement-case-after.svg',
    thumbnailAlt: 'Cambridge case study preview image',
  },
  {
    label: 'Technology Service',
    title: 'Case Study 04',
    description: 'Coming soon.',
    href: null,
    thumbnailSrc: '/disbursement-case-before.svg',
    thumbnailAlt: 'Case study preview',
  },
  {
    label: 'Technology Service',
    title: 'Case Study 05',
    description: 'Coming soon.',
    href: null,
    thumbnailSrc: '/disbursement-case-after.svg',
    thumbnailAlt: 'Case study preview',
  },
]

function NextReadThumbnail({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="ew-next-read-thumb-wrap">
      <img
        className="ew-next-read-thumb"
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}

function PrototypeBuiltWith({ className }: { className?: string } = {}) {
  const rootClass = ['ew-prototype-built-with', className].filter(Boolean).join(' ')
  return (
    <div className={rootClass} aria-label="How this prototype was built">
      <span className="ew-prototype-built-with__lead">Built with</span>
      <div className="ew-prototype-built-with__brands">
        <span className="ew-prototype-built-with__brand">
          <img
            className="ew-prototype-built-with__logo ew-prototype-built-with__logo--cursor"
            src="/logos/cursor.svg"
            alt=""
            width={22}
            height={22}
            decoding="async"
          />
          <span className="ew-prototype-built-with__name">Cursor</span>
        </span>
        <span className="ew-prototype-built-with__sep" aria-hidden="true">
          and
        </span>
        <span className="ew-prototype-built-with__brand">
          <img
            className="ew-prototype-built-with__logo ew-prototype-built-with__logo--claude"
            src="/logos/claude.svg"
            alt=""
            width={22}
            height={22}
            decoding="async"
          />
          <span className="ew-prototype-built-with__name">Claude Code</span>
        </span>
      </div>
    </div>
  )
}

/* ================================================================
   Main component
   ================================================================ */
export function DisbursementsCaseStudy() {
  useEffect(() => {
    if (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const actionLinks = globalThis.document.querySelectorAll<HTMLAnchorElement>('a.ew-hero-cta')
    const cleanupFns: Array<() => void> = []

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

    return () => {
      cleanupFns.forEach((cleanup) => cleanup())
    }
  }, [])

  return (
    <article className="ew">
      <a href="/" className="ew-back">&larr; Back</a>

      {/* ── Hero ── */}
      <header className="ew-hero">
        <div className="ew-hero-text">
          <p className="ew-kicker">Financial Management &mdash; Philippine payment gateway fintech</p>
          <h1 className="ew-title">Enterprise disbursements</h1>
          <p className="ew-subtitle">
            <span className="ew-em-serif">Easy to ship, hard to trust:</span> 91% of onboarded merchants never
            used the product. Async rails,
            thin validation, and risk policy broke confidence &mdash; not bad UI. I led design so the
            product told the truth about money it didn&apos;t fully control.
          </p>
          <div className="ew-hero-cta-row">
            <a className="ew-hero-cta" href={`#${DISBURSEMENTS_PROTOTYPE_SECTION_ID}`}>
              View live prototype
            </a>
            <PrototypeBuiltWith />
          </div>
        </div>
        <aside className="ew-meta">
          <dl className="ew-meta-list">
            <div className="ew-meta-item">
              <dt>Role</dt>
              <dd>Lead Product Designer</dd>
            </div>
            <div className="ew-meta-item">
              <dt>Scope</dt>
              <dd>Research, IA, UI, design system patterns</dd>
            </div>
            <div className="ew-meta-item">
              <dt>Platform</dt>
              <dd>Web</dd>
            </div>
            <div className="ew-meta-item">
              <dt>Timeline</dt>
              <dd>2021&ndash;2023</dd>
            </div>
          </dl>
        </aside>
      </header>

      {/* ── Impact numbers ── */}
      <Reveal className="ew-row">
        <div className="ew-col-narrow">
          <p className="ew-label">Impact</p>
          <h2 className="ew-h2">What moved</h2>
        </div>
        <div className="ew-col-wide">
          <div className="ew-metrics">
            <div className="ew-metric">
              <span className="ew-metric-value">12 &rarr; 93</span>
              <span className="ew-metric-label">Active merchants (same pool)</span>
            </div>
            <div className="ew-metric">
              <span className="ew-metric-value">&#x20B1;163.9K</span>
              <span className="ew-metric-label">Baseline TPV window</span>
            </div>
            <div className="ew-metric">
              <span className="ew-metric-value">High &rarr; Lower</span>
              <span className="ew-metric-label">Ops touches on schedules &amp; vague failures</span>
            </div>
          </div>
          <p className="ew-body">
            Fewer tickets, more self-serve. Status, validation, and error patterns later reused on Treasury
            work.
          </p>
        </div>
      </Reveal>

      {/* ── Context + pain (merged) ── */}
      <Reveal className="ew-row ew-row--reverse">
        <div className="ew-col-narrow">
          <p className="ew-label">Context</p>
          <h2 className="ew-h2">Problem &amp; signal</h2>
        </div>
        <div className="ew-col-wide">
          <p className="ew-body">
            Outbound payouts lagged competitors; enterprises lived in spreadsheets and bank portals. About 9%
            of onboarded merchants had transacted. We could not
            promise instant rails, so we bet on visibility and honest sequencing (cadence, CSV, lifecycle
            states) ahead of EMI-dependent features like external funding.
          </p>
          <p className="ew-body">
            Early: support ticket tagging and ~93 merchant interviews with rough wireframes&mdash;wrong
            timelines kept pointing to IA and vocabulary, not more surface area.
          </p>
          <ol className="ew-numbered-list">
            <li>
              <strong>Payout vs. disbursement confusion</strong>
              <p>Split language and hierarchy so settlement and send-money are never one blur.</p>
            </li>
            <li>
              <strong>No self-service cadence</strong>
              <p>Schedule changes were ops-heavy; we automated allowed moves and gated the rest.</p>
            </li>
            <li>
              <strong>Async felt &ldquo;broken&rdquo;</strong>
              <p>Batches without named states drove &ldquo;where is my money?&rdquo; tickets.</p>
            </li>
            <li>
              <strong>Late failures, weak recovery</strong>
              <p>Weak pre-checks plus hours-later declines; errors needed plain language and a next step.</p>
            </li>
          </ol>
        </div>
      </Reveal>

      {/* ── Texture: one tight block ── */}
      <Reveal className="ew-row">
        <div className="ew-col-narrow">
          <p className="ew-label">Texture</p>
          <h2 className="ew-h2">What did not ship</h2>
        </div>
        <div className="ew-col-wide">
          <p className="ew-body">
            A single &ldquo;Pending&rdquo; chip and vague competitor-style speed copy increased anxiety. We moved
            to named states with ETA ranges and notifications. Rich inline bank checks were not API-realistic;
            saved recipients plus CSV pre-validation shifted errors left instead.
          </p>
          <p className="ew-body">
            <strong className="ew-hero-lede-strong">Hardest part:</strong> defending async truth to GTM
            when everyone wanted &ldquo;instant.&rdquo; Ticket volume and merchant reads on prototypes won the argument.
          </p>
        </div>
      </Reveal>

      {/* ── Constraints ── */}
      <Reveal className="ew-row ew-row--reverse">
        <div className="ew-col-narrow">
          <p className="ew-label">Constraints</p>
          <h2 className="ew-h2">Platform &amp; risk</h2>
        </div>
        <div className="ew-col-wide">
          <div className="ew-constraint-list">
            <div className="ew-constraint">
              <p className="ew-constraint-tag">Partner rail</p>
              <h3 className="ew-constraint-title">Async batches, caps, weak pre-checks</h3>
              <p className="ew-constraint-text">
                No live status; queues and rate limits; account validation often surfaced hours later.
              </p>
              <p className="ew-constraint-response">
                <strong>Response:</strong> Named states + ETAs + notifications; CSV validate-before-send;
                saved recipients verified at save-time.
              </p>
            </div>
            <div className="ew-constraint">
              <p className="ew-constraint-tag">Risk &amp; policy</p>
              <h3 className="ew-constraint-title">Segmentation</h3>
              <p className="ew-constraint-text">
                Not every merchant qualifies for faster cadence; rules lived in Ops tooling.
              </p>
              <p className="ew-constraint-response">
                <strong>Response:</strong> Retool-backed eligibility; UI only showed allowed options so
                guardrails stayed invisible when you were clear.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── Quote ── */}
      <Reveal className="ew-quote-section" as="blockquote">
        <p className="ew-quote">
          Transparency beats false promises; shift errors left; keep risk quiet for everyone who does not
          need to feel it.
        </p>
      </Reveal>

      {/* ── Approach + decision (merged flow) ── */}
      <Reveal className="ew-row">
        <div className="ew-col-narrow">
          <p className="ew-label">Role</p>
          <h2 className="ew-h2">How I worked</h2>
        </div>
        <div className="ew-col-wide">
          <p className="ew-body">
            End-to-end: research and IA through specs, QA with Engineering, launch with PMM. I owned
            vocabulary, status + notifications, CSV validation, saved recipients, and error-to-support
            mapping. Risk/Retool, integrations, Finance, and GTM owned the rest; copy debates settled with
            tickets, SLAs, and recordings&mdash;not opinions.
          </p>
          <div className="ew-callout">
            <p className="ew-callout-title">Decision: honest async states (not fake &ldquo;instant&rdquo;)</p>
            <p className="ew-body">
              Chose explicit batch-aware states with ETA ranges over vague &ldquo;processing&rdquo; or decorative
              spinners. Prototypes + support histograms got PM/GTM aligned; &ldquo;where is my money?&rdquo; tickets
              dropped as a class even when wall-clock time barely moved.
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal className="ew-case-photo-reveal" as="figure">
        <div className="ew-case-photo-frame">
          {/* Add: <img className="ew-case-photo-img" src="/your-photo.webp" alt="…" loading="lazy" decoding="async" /> */}
        </div>
      </Reveal>

      <Reveal className="ew-row ew-row--reverse">
        <div className="ew-col-narrow">
          <p className="ew-label">Ship</p>
          <h2 className="ew-h2">What we shipped</h2>
        </div>
        <div className="ew-col-wide">
          <ul className="ew-bullets">
            <li>
              <span className="ew-inline-strong">Self-service cadence</span> &mdash; eligible schedules only;
              edge cases stay on humans.
            </li>
            <li>
              <span className="ew-inline-strong">Status + comms</span> &mdash; friendly names, estimates,
              SMS/email on transitions.
            </li>
            <li>
              <span className="ew-inline-strong">CSV in</span> &mdash; strict template, row errors before batch
              work starts.
            </li>
            <li>
              <span className="ew-inline-strong">Saved recipients</span> &mdash; verify once, reuse on repeat
              payees.
            </li>
            <li>
              <span className="ew-inline-strong">Recovery</span> &mdash; plain errors, CTAs that match what Ops
              would do.
            </li>
          </ul>
          <p className="ew-body">
            Same patterns later carried into email, SMS, and Treasury surfaces&mdash;one money vocabulary,
            state beats spinners, fix in place.
          </p>
        </div>
      </Reveal>

      {/* ── Interactive prototype ── */}
      <Reveal id={DISBURSEMENTS_PROTOTYPE_SECTION_ID} className="ew-full ew-prototype-anchor">
        <p className="ew-label">Prototype</p>
        <h2 className="ew-h2">Interactive walkthrough</h2>
        <p className="ew-body ew-body--narrow">
          Fictional merchant UI: cadence, single + CSV send, batch timeline, notifications, failure
          recovery&mdash;click through the same story as above.
        </p>
        <PrototypeBuiltWith className="ew-prototype-built-with--in-walkthrough" />
        <div className="ew-prototype-embed">
          <DisbursementsPrototypeEmbed />
        </div>
        <p className="ew-caption">
          Fictional UI and data for portfolio context only; not production software from the employer.
        </p>
      </Reveal>

      {/* ── Lessons ── */}
      <Reveal className="ew-row">
        <div className="ew-col-narrow">
          <p className="ew-label">Reflection</p>
          <h2 className="ew-h2">Lessons</h2>
        </div>
        <div className="ew-col-wide">
          <ol className="ew-lessons">
            <li>
              <h3>Tell the truth about time</h3>
              <p>Named latency beats heroic adjectives; trust is the conversion lever in money.</p>
            </li>
            <li>
              <h3>Shift errors left</h3>
              <p>CSV and saved-recipient checks cost less than midnight batch rescues.</p>
            </li>
            <li>
              <h3>Guardrails off-stage</h3>
              <p>Eligibility belongs in config and UI surfacing, not in support as default UX.</p>
            </li>
          </ol>
        </div>
      </Reveal>

      {/* ── Next reads — full-width intro + two-column spread (not label|body ew-row) ── */}
      <Reveal className="ew-next-reads" as="aside" aria-label="More case studies to read">
        <header className="ew-next-reads-intro">
          <p className="ew-kicker">Thanks for reading</p>
          <h2 className="ew-h2">More case studies</h2>
          <p className="ew-body ew-next-reads-lede">More write-ups when they are ready.</p>
        </header>
        <ul className="ew-next-reads-grid">
          {OTHER_CASE_STUDIES.slice(0, 2).map((item) => (
            <li key={item.title}>
              {item.href ? (
                <a href={item.href} className="ew-next-read-link">
                  <NextReadThumbnail src={item.thumbnailSrc} alt={item.thumbnailAlt} />
                  <span className="ew-constraint-tag ew-next-read-link__line">{item.label}</span>
                  <span className="ew-constraint-title ew-next-read-link__line">{item.title}</span>
                  <span className="ew-constraint-text ew-next-read-link__line">
                    {item.description}
                  </span>
                </a>
              ) : (
                <div className="ew-next-read-static">
                  <NextReadThumbnail src={item.thumbnailSrc} alt={item.thumbnailAlt} />
                  <p className="ew-constraint-tag">{item.label}</p>
                  <p className="ew-constraint-title">{item.title}</p>
                  <p className="ew-constraint-text">{item.description}</p>
                  <p className="ew-next-read-soon">Coming soon</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </Reveal>

      {/* ── Footer ── */}
    </article>
  )
}
