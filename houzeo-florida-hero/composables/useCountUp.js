import { ref, onMounted, onBeforeUnmount } from 'vue'

/* ============================================================================
   useCountUp — animates a figure from 0 to `target` when it scrolls into view,
   with a cubic ease-out over 1.5s, formatted en-US. Returns a template ref and
   a reactive `display` string. Honours prefers-reduced-motion (jumps to final).
   ========================================================================== */
export const useCountUp = (target, { prefix = '', post = '' } = {}) => {
  const el = ref(null)
  const display = ref(prefix + '0')
  const { prefersReducedMotion } = useReducedMotion()
  let observer = null
  let frame = null

  const format = (n) => prefix + Math.round(n).toLocaleString('en-US') + post

  const run = () => {
    if (prefersReducedMotion()) {
      display.value = format(target)
      return
    }
    const duration = 1500
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      display.value = format(target * eased)
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
  }

  onMounted(() => {
    if (!el.value || typeof IntersectionObserver === 'undefined') {
      run()
      return
    }
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          observer.unobserve(entry.target)
          run()
        })
      },
      { threshold: 0.5 }
    )
    observer.observe(el.value)
  })

  onBeforeUnmount(() => {
    if (observer) observer.disconnect()
    if (frame) cancelAnimationFrame(frame)
  })

  return { el, display }
}
