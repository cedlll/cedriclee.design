import { useSyncExternalStore } from 'react'

function subscribeReducedMotion(onChange: () => void): () => void {
  if (globalThis.window === undefined) return () => {}
  const mq = globalThis.window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getReducedMotionSnapshot(): boolean {
  if (globalThis.window === undefined) return false
  return globalThis.window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getReducedMotionServerSnapshot(): boolean {
  return false
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot)
}
