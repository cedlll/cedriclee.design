type LoadingFallbackProps = {
  /** Visible label (keep concise for screen readers and layout). */
  label: string
  /** Extra classes, e.g. layout spacing variants. */
  className?: string
}

/**
 * Accessible loading UI for React `Suspense` boundaries: motion-friendly ring + label.
 */
export function LoadingFallback({ label, className = '' }: Readonly<LoadingFallbackProps>) {
  return (
    <div
      className={`loading-fallback ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="loading-fallback__ring" aria-hidden="true" />
      <span className="loading-fallback__label">{label}</span>
    </div>
  )
}
