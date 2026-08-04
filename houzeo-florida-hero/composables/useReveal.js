import { ref, onMounted, onBeforeUnmount } from 'vue'

/* ============================================================================
   useReveal — reveal-on-scroll. Returns a template ref to attach to an element
   and a reactive `shown` flag the component binds to Tailwind opacity/transform
   utilities. Mirrors the original IntersectionObserver reveal (threshold 0.12,
   rootMargin -6% bottom) and respects prefers-reduced-motion.
   ========================================================================== */
export const useReveal = () => {
  const el = ref(null)
  const shown = ref(false)
  const { prefersReducedMotion } = useReducedMotion()
  let observer = null

  onMounted(() => {
    if (prefersReducedMotion()) {
      shown.value = true
      return
    }
    if (!el.value || typeof IntersectionObserver === 'undefined') {
      shown.value = true
      return
    }
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          shown.value = true
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    )
    observer.observe(el.value)
  })

  onBeforeUnmount(() => observer && observer.disconnect())

  return { el, shown }
}
