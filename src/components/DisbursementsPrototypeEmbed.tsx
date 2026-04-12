import './DisbursementsPrototypeEmbed.css'

/** Hosted interactive (same build as the portfolio disb prototype). */
export const DISBURSEMENTS_PROTOTYPE_SRC =
  'https://disbursements-rho.vercel.app/dashboard' as const

type DisbursementsPrototypeEmbedProps = {
  /** Merged onto the outer frame, e.g. `inner-page-block` for legacy inner pages. */
  readonly className?: string
}

export function DisbursementsPrototypeEmbed({ className }: DisbursementsPrototypeEmbedProps) {
  const frameClass = ['ew-prototype-frame', className].filter(Boolean).join(' ')

  return (
    <div className={frameClass}>
      <iframe
        src={DISBURSEMENTS_PROTOTYPE_SRC}
        title="DisbursePH merchant dashboard prototype"
        loading="lazy"
        className="ew-prototype-iframe"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="clipboard-write"
      />
    </div>
  )
}
