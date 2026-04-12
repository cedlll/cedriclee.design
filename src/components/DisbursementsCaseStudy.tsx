import { useState, useRef, useEffect } from 'react'
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
  return (
    <article className="ew">
      <a href="/" className="ew-back">&larr; Back</a>

      {/* ── Hero ── */}
      <header className="ew-hero">
        <div className="ew-hero-text">
          <p className="ew-kicker">Financial Management</p>
          <h1 className="ew-title">
            Enterprise disbursements
          </h1>
          <p className="ew-subtitle">
            Redesigning enterprise money movement&mdash;from a thin, support-heavy wedge
            to self-service schedules, batch flows, and legible async status inside real
            banking APIs and risk policy.
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
              <dd>Lead Designer</dd>
            </div>
            <div className="ew-meta-item">
              <dt>Scope</dt>
              <dd>End-to-end UX</dd>
            </div>
            <div className="ew-meta-item">
              <dt>Platform</dt>
              <dd>Web</dd>
            </div>
            <div className="ew-meta-item">
              <dt>Timeline</dt>
              <dd>2023</dd>
            </div>
          </dl>
        </aside>
      </header>

      {/* ── Impact numbers ── */}
      <Reveal className="ew-row">
        <div className="ew-col-narrow">
          <p className="ew-label">Impact</p>
          <h2 className="ew-h2">Outcomes</h2>
        </div>
        <div className="ew-col-wide">
          <div className="ew-metrics">
            <div className="ew-metric">
              <span className="ew-metric-value">12 &rarr; 93</span>
              <span className="ew-metric-label">Merchants with disbursement activity</span>
            </div>
            <div className="ew-metric">
              <span className="ew-metric-value">&#x20B1;163.9K</span>
              <span className="ew-metric-label">Illustrative TPV in the same reporting window</span>
            </div>
            <div className="ew-metric">
              <span className="ew-metric-value">High &rarr; Lower</span>
              <span className="ew-metric-label">Ops load &mdash; fewer manual touches after launch</span>
            </div>
          </div>
          <p className="ew-body">
            Merchant participation rose sharply; Finance and Risk Ops handled fewer manual
            schedule and failure tickets. Status, validation, and error patterns reused across
            later Treasury and payout work.
          </p>
        </div>
      </Reveal>

      {/* ── Overview ── */}
      <Reveal className="ew-row ew-row--reverse">
        <div className="ew-col-narrow">
          <p className="ew-label">Overview</p>
          <h2 className="ew-h2">The challenge</h2>
        </div>
        <div className="ew-col-wide">
          <p className="ew-body ew-body--lead">
            I was lead designer for disbursements at a Philippine payment gateway fintech: merchants
            accepted payments and moved money in one stack. Outbound payouts lagged what competitors
            offered and kept teams in spreadsheets and bank portals.
          </p>
          <p className="ew-body">
            In mid&ndash;2022, only about <strong>9% of onboarded merchants</strong> had used the
            product. Problems clustered in three areas: user trust and mental models,
            missing enterprise capabilities and ops load, and hard technical and policy
            limits we could make legible but not erase.
          </p>
        </div>
      </Reveal>

      {/* ── User & business pain ── */}
      <Reveal className="ew-row">
        <div className="ew-col-narrow">
          <p className="ew-label">Discovery</p>
          <h2 className="ew-h2">User &amp; business pain</h2>
          <p className="ew-aside-body">
            Mental models, trust, and clarity when money is asynchronous&mdash;plus
            adoption, competitiveness, and enterprise readiness.
          </p>
        </div>
        <div className="ew-col-wide">
          <ol className="ew-numbered-list">
            <li>
              <strong>Payout vs. disbursement confusion</strong>
              <p>Merchants conflated &ldquo;when the platform settles to me&rdquo; with &ldquo;when I can push funds out.&rdquo; I separated language, hierarchy, and empty states so each workflow had one mental model.</p>
            </li>
            <li>
              <strong>No self-service payout cadence</strong>
              <p>Every schedule change routed through Risk and Finance. We automated allowed moves and kept edge cases behind human review.</p>
            </li>
            <li>
              <strong>Async processing felt &ldquo;broken&rdquo;</strong>
              <p>Batch partners meant hours of ambiguity. Without designed states and ETAs, users assumed failure and opened tickets.</p>
            </li>
            <li>
              <strong>No external funding capability</strong>
              <p>Users could only disburse from funds already held on the platform. They couldn&rsquo;t top up from external bank accounts&mdash;a table-stakes feature competitors already shipped.</p>
            </li>
            <li>
              <strong>Missing proof of deposit</strong>
              <p>For compliance and accounting, users needed downloadable transaction receipts. Enterprise customers couldn&rsquo;t complete their audit trails.</p>
            </li>
            <li>
              <strong>Late failures, weak recovery</strong>
              <p>Limited name/account validation up front guaranteed downstream declines. I paired honest timelines with error taxonomies and CTAs so teams could self-serve remediation.</p>
            </li>
          </ol>
        </div>
      </Reveal>

      {/* ── Constraints ── */}
      <Reveal className="ew-row ew-row--reverse">
        <div className="ew-col-narrow">
          <p className="ew-label">Constraints</p>
          <h2 className="ew-h2">Platform &amp; risk</h2>
          <p className="ew-aside-body">
            Each limit from partners or policy and how we addressed it in the product.
          </p>
        </div>
        <div className="ew-col-wide">
          <div className="ew-constraint-list">
            <div className="ew-constraint">
              <p className="ew-constraint-tag">Technical</p>
              <h3 className="ew-constraint-title">Asynchronous processing</h3>
              <p className="ew-constraint-text">
                Banking partner API couldn&rsquo;t provide real-time status. Disbursements were
                &ldquo;queued&rdquo; and processed in batches every few hours.
              </p>
              <p className="ew-constraint-response">
                <strong>Response:</strong> Multi-step status model (Processing &rarr; In Transit &rarr; Completed)
                with ETA messaging and email/SMS notifications at each state transition.
              </p>
            </div>
            <div className="ew-constraint">
              <p className="ew-constraint-tag">Technical</p>
              <h3 className="ew-constraint-title">Batch size &amp; rate limits</h3>
              <p className="ew-constraint-text">
                The API could only process a certain number per batch. If a merchant sent 500
                disbursements at once, the system would queue them, leading to unpredictable delays.
              </p>
              <p className="ew-constraint-response">
                <strong>Response:</strong> Bulk CSV with pre-submit validation and clear queue semantics.
                Errors flagged before submission, not after batch processing started.
              </p>
            </div>
            <div className="ew-constraint">
              <p className="ew-constraint-tag">Technical</p>
              <h3 className="ew-constraint-title">Weak pre-submit validation</h3>
              <p className="ew-constraint-text">
                We couldn&rsquo;t validate recipient bank account details before submission.
                Disbursements could fail hours after initiation.
              </p>
              <p className="ew-constraint-response">
                <strong>Response:</strong> Saved recipients with verification at save-time, reused across runs.
                Accounts checked once when saved, not when disbursed.
              </p>
            </div>
            <div className="ew-constraint">
              <p className="ew-constraint-tag">Risk &amp; policy</p>
              <h3 className="ew-constraint-title">Risk segmentation</h3>
              <p className="ew-constraint-text">
                Not all merchants could use faster payout schedules. Risk Ops required merchants
                to meet certain thresholds before enabling features.
              </p>
              <p className="ew-constraint-response">
                <strong>Response:</strong> Retool-backed configuration; dashboard showed only eligible payout
                options. Guardrails invisible to safe merchants while high-risk accounts stayed protected.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── Quote ── */}
      <Reveal className="ew-quote-section" as="blockquote">
        <p className="ew-quote">
          &ldquo;Transparency beats false promises. Shift errors left; make risk guardrails
          invisible to eligible merchants.&rdquo;
        </p>
      </Reveal>

      {/* ── Approach & decisions ── */}
      <Reveal className="ew-row">
        <div className="ew-col-narrow">
          <p className="ew-label">Approach</p>
          <h2 className="ew-h2">How I worked</h2>
        </div>
        <div className="ew-col-wide">
          <p className="ew-body">
            Lead designer for Disbursements: research with 93 merchants, tight loops with Risk,
            Engineering, Finance, and PMM; flows for schedules, bulk send, and recovery; specs
            and handoff through launch. I biased toward honest timelines and batch reality
            over overpromising&mdash;clearer trust, lighter support.
          </p>
        </div>
      </Reveal>

      <Reveal className="ew-row ew-row--reverse">
        <div className="ew-col-narrow">
          <p className="ew-label">Solutions</p>
          <h2 className="ew-h2">Key decisions</h2>
        </div>
        <div className="ew-col-wide">
          <ol className="ew-decisions">
            <li>
              <h3>Self-service payout schedule</h3>
              <p>
                Merchants changed cadence (monthly &rarr; bi-weekly &rarr; on-demand) without tickets.
                Eligibility from history and KYC; the UI only showed options they qualified for.
              </p>
            </li>
            <li>
              <h3>Transparent status communication</h3>
              <p>
                Processing, in transit, completed, failed&mdash;with estimates and email/SMS.
                Enough detail to trust async money movement without sounding like an API doc.
              </p>
            </li>
            <li>
              <h3>Bulk upload with pre-validation</h3>
              <p>
                CSV checked before send (format, accounts, amounts). Row-level errors
                (&ldquo;Row 12: invalid account&rdquo;) so fixes land before a batch fails.
              </p>
            </li>
            <li>
              <h3>Saved recipients for recurring disbursements</h3>
              <p>
                Most volume was repeat payees. Saved recipients after verification cut re-entry
                mistakes and sped up recurring runs.
              </p>
            </li>
            <li>
              <h3>Error handling &amp; recovery paths</h3>
              <p>
                Errors mapped to plain language and a clear next step (e.g. invalid account &rarr;
                edit and retry). CTAs matched what support would actually do.
              </p>
            </li>
          </ol>
        </div>
      </Reveal>

      {/* ── Interactive prototype ── */}
      <Reveal id={DISBURSEMENTS_PROTOTYPE_SECTION_ID} className="ew-full ew-prototype-anchor">
        <p className="ew-label">Prototype</p>
        <h2 className="ew-h2">Interactive walkthrough</h2>
        <p className="ew-body ew-body--narrow">
          Explore an illustrative merchant dashboard: payout cadence, single and CSV
          disbursements, batch timelines, notifications, and failed-state recovery.
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
          <h2 className="ew-h2">Lessons learned</h2>
        </div>
        <div className="ew-col-wide">
          <ol className="ew-lessons">
            <li>
              <h3>Transparency beats false promises</h3>
              <p>
                Users would rather know the truth about processing times than be promised instant
                results that don&rsquo;t materialize.
              </p>
            </li>
            <li>
              <h3>Shift errors left</h3>
              <p>
                Pre-submission validation prevents catastrophic failures downstream. Better to add
                friction upfront than deal with errors after hours of batch processing.
              </p>
            </li>
            <li>
              <h3>Self-service at scale requires guardrails</h3>
              <p>
                Risk requirements demanded merchant segmentation. The key was making guardrails
                invisible to eligible users while protecting against fraud.
              </p>
            </li>
            <li>
              <h3>API limitations are design constraints, not excuses</h3>
              <p>
                Asynchronous processing, batch limits, and validation gaps required creative
                design solutions. The best products work within reality, not against it.
              </p>
            </li>
            <li>
              <h3>Cross-functional collaboration is non-negotiable</h3>
              <p>
                Every design decision involved trade-offs between user needs, technical feasibility,
                risk requirements, and business goals.
              </p>
            </li>
          </ol>
        </div>
      </Reveal>

      {/* ── Next reads — full-width intro + two-column spread (not label|body ew-row) ── */}
      <Reveal className="ew-next-reads" as="aside" aria-label="More case studies to read">
        <header className="ew-next-reads-intro">
          <p className="ew-kicker">Thanks for reading</p>
          <h2 className="ew-h2">More case studies</h2>
          <p className="ew-aside-body ew-next-reads-lede">
            A few other pieces from selected work. I will link each one when the write-up is
            ready.
          </p>
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
