/* Generic submit lifecycle: returns { busy, error, setError, run } */
export function useSubmit(onDone, { failFirst } = {}) {
  const busy = ref(false);
  const error = ref(null);
  let attempts = 0;
  const setError = (v) => (error.value = v);
  const run = () => {
    busy.value = true;
    error.value = null;
    setTimeout(() => {
      busy.value = false;
      if (failFirst && attempts === 0) {
        attempts = 1;
        error.value =
          "We couldn't reach the listing server. Please check your connection and try again.";
      } else {
        onDone();
      }
    }, 1700);
  };
  return { busy, error, setError, run };
}
