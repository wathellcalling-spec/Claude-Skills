/* ============================================================================
   useLightbox — shared state for the avatar lightbox. Any component can call
   open(src) to show a full-size image; a single <AvatarLightbox> renders it.
   useState keeps the state SSR-safe and shared across every caller.
   ========================================================================== */
export const useLightbox = () => {
  const isOpen = useState('lightbox-open', () => false)
  const src = useState('lightbox-src', () => '')

  const open = (imageSrc) => {
    src.value = imageSrc
    isOpen.value = true
  }
  const close = () => {
    isOpen.value = false
  }

  return { isOpen, src, open, close }
}
