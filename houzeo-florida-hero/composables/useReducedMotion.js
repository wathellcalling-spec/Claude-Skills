/* Small helper: does the visitor prefer reduced motion? Guards every animation. */
export const useReducedMotion = () => {
  const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return { prefersReducedMotion }
}
