/* ============================================================================
   useHeroApi — the single seam to a backend (ported from the original api.js).

   Each function returns a Promise so swapping the mock body for a real fetch()
   requires no change anywhere else in the app.
   ========================================================================== */

export const useHeroApi = () => {
  /* Set to a positive number to simulate network latency while developing. */
  const MOCK_LATENCY_MS = 0

  const mock = (payload) =>
    MOCK_LATENCY_MS > 0
      ? new Promise((resolve) => setTimeout(() => resolve(payload), MOCK_LATENCY_MS))
      : Promise.resolve(payload)

  /* INTEGRATION POINT
     return $fetch('/api/best-places/florida/stats') */
  const getHeroStats = () => mock(HERO_STATS)

  /* INTEGRATION POINT
     return $fetch('/api/best-places/florida/contributors') */
  const getContributors = () => mock(CONTRIBUTORS)

  return { getHeroStats, getContributors }
}
